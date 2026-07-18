import { API_BASE_URL, DEV_MODE, REQUEST_TIMEOUT, STORAGE_KEY_REFRESH_TOKEN, STORAGE_KEY_TOKEN } from "@/config/env";
import type { ApiResponse, RequestMethod, RequestOptions } from "@/types";
import { ApiError } from "@/types/index";
import { crypto, type EncryptedBody } from "@/platform/crypto";

// =================================================
// 扩展请求选项（支持 responseType 等）
// =================================================

export interface RequestRawOptions extends RequestOptions {
    /** 响应类型（如 arraybuffer） */
    responseType?: string;
}

// =================================================
// 导出加解密初始化方法（保持向后兼容）
// =================================================

/**
 * 初始化加解密配置
 * 应用启动时调用
 */
export async function initCrypto(): Promise<void> {
    return crypto.init();
}

/**
 * 获取客户端私钥
 * 登录后调用
 */
export async function fetchClientPrivateKey(): Promise<void> {
    return crypto.fetchClientPrivateKey();
}

// =================================================
// Token 管理
// =================================================

/** 是否正在刷新 token（防止并发刷新） */
let isRefreshing = false;
/** 等待刷新完成的请求队列 */
let refreshQueue: Array<{
    resolve: (token: string) => void;
    reject: (err: unknown) => void;
}> = [];

function getToken(): string | null {
    return uni.getStorageSync(STORAGE_KEY_TOKEN) as string | null;
}

function getRefreshToken(): string | null {
    return uni.getStorageSync(STORAGE_KEY_REFRESH_TOKEN) as string | null;
}

function saveToken(token: string) {
    uni.setStorageSync(STORAGE_KEY_TOKEN, token);
}

function saveRefreshToken(token: string) {
    uni.setStorageSync(STORAGE_KEY_REFRESH_TOKEN, token);
}

function clearToken() {
    uni.removeStorageSync(STORAGE_KEY_TOKEN);
    uni.removeStorageSync(STORAGE_KEY_REFRESH_TOKEN);
}

// =================================================
// 请求拦截器
// =================================================

/**
 * 构建请求头
 */
function buildHeader(custom?: Record<string, string>, skipAuth?: boolean): Record<string, string> {
    const header: Record<string, string> = { ...custom };

    header["Content-Type"] = header["Content-Type"] ?? "application/json";
    header["Api-Version"] = "1.0.0";

    if (!skipAuth) {
        const token = getToken();
        if (token) {
            header["Authorization"] = `Bearer ${token}`;
        }
    }

    return header;
}

/**
 * 将 data 转为 query string（仅 GET 请求）
 */
function buildUrl(
    url: string,
    method?: RequestMethod,
    data?: Record<string, string | number | boolean | null | undefined>
): string {
    if ((!method || method === "GET") && data && Object.keys(data).length > 0) {
        const params = Object.entries(data)
            .filter(([, v]) => v !== undefined && v !== null)
            .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
            .join("&");
        if (params) {
            url += (url.includes("?") ? "&" : "?") + params;
        }
    }
    return url;
}

// =================================================
// 响应处理
// =================================================

/**
 * 处理业务错误
 */
function handleBusinessError(code: number, msg: string): never {
    throw new ApiError(code, msg);
}

/**
 * 刷新 token
 */
async function refreshToken(): Promise<string> {
    const refresh_token = getRefreshToken();
    if (!refresh_token) {
        clearToken();
        redirectToLogin();
        throw new ApiError(-2, "登录已过期，请重新登录");
    }

    return new Promise((resolve, reject) => {
        uni.request({
            url: API_BASE_URL + "/api/auth/refresh",
            method: "POST",
            data: { refresh_token },
            header: { "Content-Type": "application/json", "Api-Version": "1.0.0" },
            timeout: REQUEST_TIMEOUT,
            success(res) {
                const statusCode = res.statusCode;
                if (statusCode !== 200) {
                    clearToken();
                    redirectToLogin();
                    reject(new ApiError(statusCode, "刷新token失败"));
                    return;
                }
                const result = res.data as ApiResponse<{ access_token: string; refresh_token: string }>;
                if (result.code === 200) {
                    saveToken(result.data.access_token);
                    saveRefreshToken(result.data.refresh_token);
                    resolve(result.data.access_token);
                } else {
                    clearToken();
                    redirectToLogin();
                    reject(new ApiError(result.code, result.msg || "登录已过期"));
                }
            },
            fail(err) {
                clearToken();
                redirectToLogin();
                reject(new ApiError(-1, err.errMsg));
            }
        });
    });
}

/**
 * 跳转到登录页
 */
function redirectToLogin() {
    const pages = getCurrentPages();
    const current = pages[pages.length - 1];
    const route = current ? "/" + current.route : "";
    const redirect = route ? encodeURIComponent(route) : "";

    uni.reLaunch({
        url: `/pages/login/index${redirect ? `?redirect=${redirect}` : ""}`
    });
}

// =================================================
// 核心请求方法
// =================================================

/**
 * 发起 HTTP 请求
 */
export async function request<T = unknown>(options: RequestOptions): Promise<T> {
    const method = options.method ?? "GET";
    const skipAuth = options.skipAuth ?? false;
    const noBody = options.noBody ?? false;

    // 加密请求体
    let requestData: RequestOptions["data"] | EncryptedBody = options.data;
    let requestHeader: Record<string, string> | undefined = options.header;

    // 通过平台抽象处理加密（平台内部处理条件编译）
    if (crypto.isEnabled() && method !== "GET" && options.data) {
        const bodyStr = JSON.stringify(options.data);
        requestData = await crypto.encryptRequest(bodyStr);
        requestHeader = { ...requestHeader, "X-Encrypted": "1" };
    }

    // 构建完整 URL（GET 时 data 用于 query params）
    const url = buildUrl(API_BASE_URL + options.url, method, method === "GET" ? options.data : undefined);

    // 显示 loading
    if (options.showLoading) {
        uni.showLoading({ title: options.loadingText ?? "加载中...", mask: true });
    }

    return new Promise((resolve, reject) => {
        uni.request({
            url,
            method: method as UniApp.RequestOptions["method"],
            data: method !== "GET" ? requestData : undefined,
            header: buildHeader(requestHeader, skipAuth),
            timeout: options.timeout ?? REQUEST_TIMEOUT,

            async success(res) {
                if (options.showLoading) {
                    uni.hideLoading();
                }

                const statusCode = res.statusCode;

                if (statusCode !== 200) {
                    if (statusCode === 401 && !skipAuth) {
                        handleUnauthorized(options, resolve, reject);
                        return;
                    }
                    reject(new ApiError(statusCode, `请求失败(${statusCode})`));
                    return;
                }

                // 无响应体模式：HTTP 200 即成功
                if (noBody) {
                    resolve(undefined as T);
                    return;
                }

                // 解析业务响应 { code, data, msg }
                const result = res.data as ApiResponse<T>;

                // 通过平台抽象处理解密（平台内部处理条件编译）
                if (
                    crypto.isEnabled() &&
                    result.data &&
                    typeof result.data === "object" &&
                    "signature" in (result.data as Record<string, unknown>)
                ) {
                    try {
                        const encrypted = result.data as unknown as EncryptedBody;
                        const decrypted = await crypto.decryptResponse(encrypted);
                        Object.assign(result, { data: decrypted });
                    } catch (e: unknown) {
                        const message = e instanceof Error ? e.message : "响应解密失败";
                        reject(new ApiError(-1, message));
                        return;
                    }
                }

                if (result.code === 200) {
                    resolve(result.data);
                } else {
                    if (result.code === 401 && !skipAuth) {
                        handleUnauthorized(options, resolve, reject);
                        return;
                    }
                    handleBusinessError(result.code, result.msg);
                }
            },

            fail(err) {
                if (options.showLoading) {
                    uni.hideLoading();
                }

                reject(new ApiError(-1, err.errMsg || "网络异常，请检查网络连接"));
            }
        });
    });
}

/**
 * 处理 401 未授权：刷新 token 后重试原请求
 */
function handleUnauthorized<T>(options: RequestOptions, resolve: (value: T) => void, reject: (err: unknown) => void) {
    if (!isRefreshing) {
        isRefreshing = true;
        refreshToken()
            .then(token => {
                isRefreshing = false;
                refreshQueue.forEach(q => q.resolve(token));
                refreshQueue = [];
                request<T>({ ...options, skipAuth: true })
                    .then(resolve)
                    .catch(reject);
            })
            .catch(err => {
                isRefreshing = false;
                refreshQueue.forEach(q => q.reject(err));
                refreshQueue = [];
                reject(err);
            });
    } else {
        refreshQueue.push({
            resolve: () => {
                request<T>({ ...options, skipAuth: true })
                    .then(resolve)
                    .catch(reject);
            },
            reject
        });
    }
}

// =================================================
// 开发模式：模拟响应
// =================================================

export async function requestMock<T>(mockData: T, delay = 300): Promise<T> {
    if (!DEV_MODE) {
        throw new Error("requestMock 仅在开发模式下可用");
    }
    await new Promise(resolve => setTimeout(resolve, delay));
    return mockData;
}

// =================================================
// 原始响应请求（支持 responseType 等）
// =================================================

/**
 * 发起 HTTP 请求，返回原始响应（包含 header、statusCode 等）
 * 适用于需要访问响应头或特殊响应类型（如 arraybuffer）的场景
 */
export async function requestRaw(options: RequestRawOptions): Promise<UniApp.RequestSuccessCallbackResult> {
    const method = options.method ?? "GET";
    const skipAuth = options.skipAuth ?? false;

    // 构建完整 URL（GET 时 data 用于 query params）
    const url = buildUrl(API_BASE_URL + options.url, method, method === "GET" ? options.data : undefined);

    // 显示 loading
    if (options.showLoading) {
        uni.showLoading({ title: options.loadingText ?? "加载中...", mask: true });
    }

    return new Promise((resolve, reject) => {
        uni.request({
            url,
            method: method as UniApp.RequestOptions["method"],
            data: method !== "GET" ? options.data : undefined,
            header: buildHeader(options.header, skipAuth),
            timeout: options.timeout ?? REQUEST_TIMEOUT,
            responseType: options.responseType as "arraybuffer",

            success(res) {
                if (options.showLoading) {
                    uni.hideLoading();
                }

                if (res.statusCode !== 200) {
                    reject(new ApiError(res.statusCode, `请求失败(${res.statusCode})`));
                    return;
                }

                resolve(res);
            },

            fail(err) {
                if (options.showLoading) {
                    uni.hideLoading();
                }

                reject(new ApiError(-1, err.errMsg || "网络异常，请检查网络连接"));
            }
        });
    });
}
