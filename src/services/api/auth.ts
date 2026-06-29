import { API_BASE_URL, STORAGE_KEY_REFRESH_TOKEN, STORAGE_KEY_TOKEN } from "@/config/env";
import type { LoginRequest, LoginResponseData } from "@/types";
import { request } from "../http";

/**
 * 登录
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
 * 退出登录（无响应体，需携带 token 但不触发刷新）
 */
export function logout(): Promise<void> {
    return new Promise((resolve, reject) => {
        const token = uni.getStorageSync(STORAGE_KEY_TOKEN) as string | null;
        const refreshToken = uni.getStorageSync(STORAGE_KEY_REFRESH_TOKEN) as string | null;
        uni.request({
            url: API_BASE_URL + "/api/auth/logout",
            method: "POST",
            header: {
                "Content-Type": "application/json",
                "Api-Version": "1.0.0",
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            data: { refreshToken },
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
