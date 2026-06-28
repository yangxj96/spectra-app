import { STORAGE_KEY_TOKEN } from "@/config/env";
import useAppStore from "@/stores/app";
import type { UserInfo } from "@/types";

export async function initUser() {
    const appStore = useAppStore();

    const token = uni.getStorageSync(STORAGE_KEY_TOKEN) as string | null;

    if (!token) {
        return;
    }

    appStore.setToken(token);

    // TODO: 调用后端接口获取用户信息
    // try {
    //     const user = await get<UserInfo>("/user/info");
    //     appStore.setUser(user);
    // } catch {
    //     appStore.clearAuth();
    //     return;
    // }

    const mockUser: UserInfo = {
        id: "1",
        username: "Jack"
    };
    appStore.setUser(mockUser);
}
