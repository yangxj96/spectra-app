import { STORAGE_KEY_REFRESH_TOKEN, STORAGE_KEY_TOKEN } from "@/config/env";
import useAppStore from "@/stores/app";
import type { LoginResponseData } from "@/types";
import { request } from "@/services/http";

export async function initUser() {
    const appStore = useAppStore();

    const refreshToken = uni.getStorageSync(STORAGE_KEY_REFRESH_TOKEN) as string | null;

    if (!refreshToken) {
        return;
    }

    try {
        const result = await request<LoginResponseData>({
            url: "/api/auth/refresh",
            method: "POST",
            data: { refresh_token: refreshToken },
            skipAuth: true
        });

        uni.setStorageSync(STORAGE_KEY_TOKEN, result.access_token);
        uni.setStorageSync(STORAGE_KEY_REFRESH_TOKEN, result.refresh_token);
        appStore.setToken(result.access_token);
        appStore.setUser({ id: result.id, username: result.username });
    } catch {
        uni.removeStorageSync(STORAGE_KEY_TOKEN);
        uni.removeStorageSync(STORAGE_KEY_REFRESH_TOKEN);
    }
}
