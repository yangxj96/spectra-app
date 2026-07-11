import {
    API_BASE_URL,
    CRYPTO_ENABLED,
    DEV_MODE,
    REQUEST_TIMEOUT,
    RSA_PRIVATE_KEY,
    RSA_PUBLIC_KEY,
    STORAGE_KEY_REFRESH_TOKEN,
    STORAGE_KEY_TOKEN
} from "@/config/env";
import type { ApiResponse, RequestMethod, RequestOptions } from "@/types";
import { ApiError } from "@/types/index";
// #ifdef H5
import { decrypt, encrypt, generateIv, sign, verifySignature } from "@/utils/crypto/crypto-utils";
// #endif

// =================================================
// Token 管理
// =================================================

/** 是否正在刷新 token（防止并发刷新） */
let isRefreshing = false;
/** 等待刷新完成的请求队列 */
let refreshQueue: Array<{
    resolve: (token: string) => void;
    reject: (err: any) => void;
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
function buildUrl(url: string, method?: RequestMethod, data?: Record<string, any>): string {
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
    // TODO: 根据业务错误码做分类处理
    // 例如：code === 401 时触发 token 刷新或跳转登录
    // 例如：code === 403 时提示权限不足
    // 例如：code === 10001 时特定业务提示
    throw new ApiError(code, msg);
}

/**
 * 刷新 token
 *
 * 步骤:
 * 1. 从本地存储读取 refresh_token
 * 2. 调用 POST /auth/refresh 接口换取新 token
 * 3. 刷新成功：保存新 token，通知等待队列
 * 4. 刷新失败：清除本地 token，跳转登录页
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
    // 获取当前页面路径作为 redirect 参数
    const pages = getCurrentPages();
    const current = pages[pages.length - 1];
    const route = current ? "/" + current.route : "";
    const redirect = route ? encodeURIComponent(route) : "";

    uni.reLaunch({
        url: `/pages/login/index${redirect ? `?redirect=${redirect}` : ""}`
    });
}

// =================================================
// 请求加解密（仅 H5 平台可用）
// =================================================

// #ifdef H5
type EncryptedBody = {
    data: string;
    key: string;
    iv: string;
    nonce: string;
    timestamp: number;
    signature: string;
};

/**
 * 加密请求体
 */
async function encryptRequest(bodyStr: string): Promise<EncryptedBody> {
    const iv = generateIv();
    const timestamp = Math.floor(Date.now() / 1000);
    const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))));

    const { encryptedData, encryptedKey } = await encrypt(bodyStr, iv, RSA_PUBLIC_KEY);

    const signContent = `data=${encryptedData}&nonce=${nonce}&timestamp=${timestamp}`;
    const signature = await sign(signContent, RSA_PRIVATE_KEY);

    return { data: encryptedData, key: encryptedKey, iv, nonce, timestamp, signature };
}

/**
 * 解密响应体
 */
async function decryptResponse(encryptedBody: EncryptedBody): Promise<any> {
    const signData = `data=${encryptedBody.data}&nonce=${encryptedBody.nonce}&timestamp=${encryptedBody.timestamp}`;
    const isValid = await verifySignature(encryptedBody.signature, signData, RSA_PUBLIC_KEY);
    if (!isValid) {
        throw new Error("签名验证失败，数据可能被篡改");
    }

    const json = await decrypt(encryptedBody.key, encryptedBody.data, encryptedBody.iv, RSA_PRIVATE_KEY);
    return JSON.parse(json) as unknown;
}
// #endif

// =================================================
// 核心请求方法
// =================================================

/**
 * 发起 HTTP 请求
 *
 * 处理流程:
 * 1. 构建请求 URL（GET 请求拼接 query params）
 * 2. 构建请求头（注入 token）
 * 3. 发送请求（可选 loading）
 * 4. 解析响应的 { code, data, msg } 结构
 * 5. code === 0 返回 data，否则抛 ApiError
 * 6. 401 时自动刷新 token 并重试一次
 */
export async function request<T = any>(options: RequestOptions): Promise<T> {
    const method = options.method ?? "GET";
    const skipAuth = options.skipAuth ?? false;
    const noBody = options.noBody ?? false;

    // 加密请求体
    let requestData: any = options.data;
    let requestHeader: Record<string, string> | undefined = options.header;

    // #ifdef H5
    if (CRYPTO_ENABLED && method !== "GET" && options.data) {
        const bodyStr = JSON.stringify(options.data);
        requestData = await encryptRequest(bodyStr);
        requestHeader = { ...requestHeader, "X-Encrypted": "1" };
    }
    // #endif

    // 构建完整 URL（GET 时 data 用于 query params）
    const url = buildUrl(API_BASE_URL + options.url, method, method === "GET" ? options.data : undefined);

    // 显示 loading
    if (options.showLoading) {
        uni.showLoading({ title: options.loadingText ?? "加载中...", mask: true });
    }

    return new Promise((resolve, reject) => {
        uni.request({
            url,
            method: method as any,
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

                // 解密响应体
                // #ifdef H5
                if (
                    CRYPTO_ENABLED &&
                    result.data &&
                    typeof result.data === "object" &&
                    "signature" in (result.data as Record<string, unknown>)
                ) {
                    try {
                        const encrypted = result.data as unknown as EncryptedBody;
                        (result as any).data = await decryptResponse(encrypted);
                    } catch (e: any) {
                        reject(new ApiError(-1, e.message || "响应解密失败"));
                        return;
                    }
                }
                // #endif

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
function handleUnauthorized<T>(options: RequestOptions, resolve: (value: T) => void, reject: (err: any) => void) {
    if (!isRefreshing) {
        isRefreshing = true;
        refreshToken()
            .then(token => {
                isRefreshing = false;
                // 通知等待队列
                refreshQueue.forEach(q => q.resolve(token));
                refreshQueue = [];
                // 重试原请求
                request<T>({ ...options, skipAuth: true })
                    .then(resolve)
                    .catch(reject);
            })
            .catch(err => {
                isRefreshing = false;
                // 通知等待队列失败
                refreshQueue.forEach(q => q.reject(err));
                refreshQueue = [];
                reject(err);
            });
    } else {
        // 已有刷新请求在进行中，加入等待队列
        refreshQueue.push({
            resolve: (token: string) => {
                // 用新 token 重试
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

/**
 * 开发模式下使用模拟数据（当后端未就绪时）
 *
 * 调用方式：
 *   requestMock<T>(mockData, delay)
 *   或直接在 request 中判断 DEV_MODE 调用此函数
 */
export async function requestMock<T>(mockData: T, delay = 300): Promise<T> {
    if (!DEV_MODE) {
        throw new Error("requestMock 仅在开发模式下可用");
    }
    await new Promise(resolve => setTimeout(resolve, delay));
    return mockData;
}
