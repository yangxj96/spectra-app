import { API_BASE_URL, STORAGE_KEY_TOKEN } from "@/config/env";
import type { LoginRequest, LoginResponseData } from "@/types";
import { request } from "../http";

/**
 * 获取图形验证码
 * 返回 { key, image }，key 需随登录请求一同提交
 */
export async function getCaptcha(): Promise<{ key: string; image: string }> {
    return new Promise((resolve, reject) => {
        uni.request({
            url: API_BASE_URL + "/api/common/kaptcha",
            method: "GET",
            responseType: "arraybuffer",
            success(res) {
                if (res.statusCode !== 200) {
                    reject(new Error(`获取验证码失败(${res.statusCode})`));
                    return;
                }
                const key = (res.header && (res.header["captcha-key"] || res.header["Captcha-Key"])) || "";
                const base64 = uni.arrayBufferToBase64(res.data as ArrayBuffer);
                const image = `data:image/png;base64,${base64}`;
                resolve({ key, image });
            },
            fail(err) {
                reject(new Error(err.errMsg || "获取验证码失败"));
            }
        });
    });
}

/**
 * 密码登录
 */
export function login(data: LoginRequest): Promise<LoginResponseData> {
    return request<LoginResponseData>({
        url: "/api/auth/login",
        method: "POST",
        data,
        skipAuth: true
    });
}

/**
 * 退出登录（无响应体，HTTP 200 即成功）
 */
export function logout(): Promise<void> {
    return new Promise((resolve, reject) => {
        const token = uni.getStorageSync(STORAGE_KEY_TOKEN) as string | null;
        uni.request({
            url: API_BASE_URL + "/api/auth/logout",
            method: "POST",
            header: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            success(res) {
                if (res.statusCode === 200) {
                    resolve();
                } else {
                    reject(new Error(`退出登录失败(${res.statusCode})`));
                }
            },
            fail(err) {
                reject(new Error(err.errMsg || "网络异常"));
            }
        });
    });
}
