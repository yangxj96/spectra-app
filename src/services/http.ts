import {
    API_BASE_URL,
    CRYPTO_ENABLED,
    DEV_MODE,
    REQUEST_TIMEOUT,
    STORAGE_KEY_REFRESH_TOKEN,
    STORAGE_KEY_TOKEN
} from "@/config/env";
import type { ApiResponse, RequestMethod, RequestOptions } from "@/types";
import { ApiError } from "@/types/index";
// #ifdef H5
import { decrypt, encrypt, generateIv, sign, verifySignature } from "@/utils/crypto/crypto-utils";
// #endif

// =================================================
// 加解密配置（从后端动态获取）
// =================================================

// #ifdef H5
let cryptoEnabled = false;
let serverPublicKey: string | null = null;
let clientPrivateKey: string | null = null;

/**
 * 初始化加解密配置（H5 平台）
 * 应用启动时调用，从后端获取加解密开关和服务端公钥
 */
export async function initCrypto(): Promise<void> {
    if (!CRYPTO_ENABLED) return;
    try {
        const res = await new Promise<UniApp.RequestSuccessCallbackResult>((resolve, reject) => {
            uni.request({
                url: API_BASE_URL + "/api/system/crypto/config",
                method: "GET",
                timeout: 10000,
                success: r => resolve(r),
                fail: e => reject(e)
            });
        });
        const data = res.data as ApiResponse<{ enabled: boolean; serverPublicKey: string }>;
        if (res.statusCode === 200 && data?.code === 200) {
            cryptoEnabled = data.data.enabled;
            serverPublicKey = data.data.serverPublicKey;
            console.log(`[Crypto] 初始化完成: enabled=${cryptoEnabled}`);
        }
    } catch (e) {
        console.warn("[Crypto] 初始化失败，加解密已禁用:", e);
        cryptoEnabled = false;
    }
}

/**
 * 获取客户端私钥（H5 平台）
 * 登录后调用，用于解密响应的 AES 密钥
 */
export async function fetchClientPrivateKey(): Promise<void> {
    if (!cryptoEnabled) return;
    try {
        const token = uni.getStorageSync(STORAGE_KEY_TOKEN) as string | null;
        if (!token) return;
        const res = await new Promise<UniApp.RequestSuccessCallbackResult>((resolve, reject) => {
            uni.request({
                url: API_BASE_URL + "/api/system/crypto/keypair/client-private",
                method: "GET",
                header: { Authorization: `Bearer ${token}` },
                timeout: 10000,
                success: r => resolve(r),
                fail: e => reject(e)
            });
        });
        const data = res.data as ApiResponse<{ privateKey: string }>;
        if (res.statusCode === 200 && data?.code === 200 && data.data?.privateKey) {
            clientPrivateKey = data.data.privateKey;
            console.log("[Crypto] 客户端私钥已获取");
        }
    } catch (e) {
        console.warn("[Crypto] 获取客户端私钥失败:", e);
    }
}
// #endif

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
    if (!serverPublicKey) {
        throw new Error("服务端公钥未就绪，无法加密请求");
    }

    const iv = generateIv();
    const timestamp = Math.floor(Date.now() / 1000);
    const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))));

    const { encryptedData, encryptedKey } = await encrypt(bodyStr, iv, serverPublicKey);

    const signContent = `data=${encryptedData}&nonce=${nonce}&timestamp=${timestamp}`;
    const signature = await sign(signContent, clientPrivateKey!);

    return { data: encryptedData, key: encryptedKey, iv, nonce, timestamp, signature };
}

/**
 * 解密响应体
 */
async function decryptResponse(encryptedBody: EncryptedBody): Promise<unknown> {
    if (!serverPublicKey || !clientPrivateKey) {
        throw new Error("密钥未就绪，无法解密响应");
    }

    const signData = `data=${encryptedBody.data}&nonce=${encryptedBody.nonce}&timestamp=${encryptedBody.timestamp}`;
    const isValid = await verifySignature(encryptedBody.signature, signData, serverPublicKey);
    if (!isValid) {
        throw new Error("签名验证失败，数据可能被篡改");
    }

    const json = await decrypt(encryptedBody.key, encryptedBody.data, encryptedBody.iv, clientPrivateKey);
    return JSON.parse(json) as unknown;
}
// #endif

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

    // #ifdef H5
    if (cryptoEnabled && method !== "GET" && options.data) {
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

                // 解密响应体
                // #ifdef H5
                if (
                    cryptoEnabled &&
                    clientPrivateKey &&
                    result.data &&
                    typeof result.data === "object" &&
                    "signature" in (result.data as Record<string, unknown>)
                ) {
                    try {
                        const encrypted = result.data as unknown as EncryptedBody;
                        const decrypted = await decryptResponse(encrypted);
                        Object.assign(result, { data: decrypted });
                    } catch (e: unknown) {
                        const message = e instanceof Error ? e.message : "响应解密失败";
                        reject(new ApiError(-1, message));
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
