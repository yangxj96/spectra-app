import { API_BASE_URL, REQUEST_TIMEOUT, STORAGE_KEY_TOKEN } from "@/config/env";
import { ApiError } from "@/types";
import { request } from "./http";
import type { PageRequest, PageResponse } from "@/types";

// =================================================
// 基础 HTTP 方法
// =================================================

export function get<T = any>(url: string, params?: Record<string, any>, header?: Record<string, string>): Promise<T> {
    return request<T>({ url, method: "GET", data: params, header });
}

export function post<T = any>(url: string, data?: Record<string, any>, header?: Record<string, string>): Promise<T> {
    return request<T>({ url, method: "POST", data, header });
}

export function put<T = any>(url: string, data?: Record<string, any>, header?: Record<string, string>): Promise<T> {
    return request<T>({ url, method: "PUT", data, header });
}

export function del<T = any>(url: string, data?: Record<string, any>, header?: Record<string, string>): Promise<T> {
    return request<T>({ url, method: "DELETE", data, header });
}

// =================================================
// 文件上传
// =================================================

export interface UploadOptions {
    /** 上传地址（相对 BASE_URL） */
    url: string;
    /** 本地文件路径 */
    filePath: string;
    /** 文件对应的 key，默认 "file" */
    name?: string;
    /** 额外表单数据 */
    formData?: Record<string, any>;
    /** 自定义请求头 */
    header?: Record<string, string>;
    /** 上传进度回调 */
    onProgress?: (progress: number) => void;
}

/**
 * 上传文件
 */
export function upload<T = any>(options: UploadOptions): Promise<T> {
    return new Promise((resolve, reject) => {
        const token = uni.getStorageSync(STORAGE_KEY_TOKEN) as string | null;
        const header: Record<string, string> = { ...options.header };
        if (token) {
            header["Authorization"] = `Bearer ${token}`;
        }

        const uploadTask = uni.uploadFile({
            url: API_BASE_URL + options.url,
            filePath: options.filePath,
            name: options.name ?? "file",
            formData: options.formData,
            header,
            timeout: REQUEST_TIMEOUT,
            success(res) {
                try {
                    const result = JSON.parse(res.data);
                    if (result.code === 0) {
                        resolve(result.data as T);
                    } else {
                        reject(new ApiError(result.code, result.msg));
                    }
                } catch {
                    reject(new Error("解析上传响应失败"));
                }
            },
            fail(err) {
                reject(new Error(err.errMsg || "上传失败"));
            }
        });

        // 监听上传进度
        if (options.onProgress) {
            uploadTask.onProgressUpdate(res => {
                options.onProgress!(res.progress);
            });
        }
    });
}

// =================================================
// 文件下载
// =================================================

export interface DownloadOptions {
    /** 下载地址（相对 BASE_URL） */
    url: string;
    /** 自定义请求头 */
    header?: Record<string, string>;
    /** 下载进度回调 */
    onProgress?: (progress: number) => void;
}

export interface DownloadResult {
    /** 下载后的临时文件路径 */
    tempFilePath: string;
}

/**
 * 下载文件
 */
export function download(options: DownloadOptions): Promise<DownloadResult> {
    return new Promise((resolve, reject) => {
        const token = uni.getStorageSync(STORAGE_KEY_TOKEN) as string | null;
        const header: Record<string, string> = { ...options.header };
        if (token) {
            header["Authorization"] = `Bearer ${token}`;
        }

        const downloadTask = uni.downloadFile({
            url: API_BASE_URL + options.url,
            header,
            timeout: REQUEST_TIMEOUT,
            success(res) {
                if (res.statusCode === 200) {
                    resolve({ tempFilePath: res.tempFilePath });
                } else {
                    reject(new Error(`下载失败(${res.statusCode})`));
                }
            },
            fail(err) {
                reject(new Error(err.errMsg || "下载失败"));
            }
        });

        // 监听下载进度
        if (options.onProgress) {
            downloadTask.onProgressUpdate(res => {
                options.onProgress!(res.progress);
            });
        }
    });
}

// =================================================
// 便捷方法
// =================================================

/**
 * 带 loading 的请求
 */
export function withLoading<T>(promise: Promise<T>, msg = "加载中..."): Promise<T> {
    uni.showLoading({ title: msg, mask: true });
    return promise
        .then(data => {
            uni.hideLoading();
            return data;
        })
        .catch(err => {
            uni.hideLoading();
            throw err;
        });
}

/**
 * 分页请求
 *
 * 适用于标准分页接口，返回 { list, total, page, pageSize } 结构
 */
export function getPage<T = any>(
    url: string,
    params: PageRequest,
    header?: Record<string, string>
): Promise<PageResponse<T>> {
    return get<PageResponse<T>>(url, params as unknown as Record<string, any>, header);
}
