import { STORAGE_KEY_REFRESH_TOKEN } from "@/config/env";
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
    const refreshToken = uni.getStorageSync(STORAGE_KEY_REFRESH_TOKEN) as string | null;
    return request<void>({
        url: "/api/auth/logout",
        method: "POST",
        data: { refreshToken },
        noBody: true
    });
}
