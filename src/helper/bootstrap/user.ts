import { API_BASE_URL, STORAGE_KEY_REFRESH_TOKEN, STORAGE_KEY_TOKEN } from "@/config/env";
import useAppStore from "@/stores/app";
import type { LoginResponseData } from "@/types";

export async function initUser() {
    const appStore = useAppStore();

    const refreshToken = uni.getStorageSync(STORAGE_KEY_REFRESH_TOKEN) as string | null;

    if (!refreshToken) {
        return;
    }

    try {
        const result = await new Promise<LoginResponseData>((resolve, reject) => {
            uni.request({
                url: API_BASE_URL + "/api/auth/refresh",
                method: "POST",
                data: { refresh_token: refreshToken },
                header: { "Content-Type": "application/json" },
                success(res) {
                    const body = res.data as { code: number; msg: string; data: LoginResponseData };
                    if (res.statusCode === 200 && body.code === 200) {
                        resolve(body.data);
                    } else {
                        reject(new Error(body.msg || "token无效"));
                    }
                },
                fail(err) {
                    reject(new Error(err.errMsg || "网络异常"));
                }
            });
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
