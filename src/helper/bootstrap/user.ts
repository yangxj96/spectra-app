import { STORAGE_KEY_TOKEN } from "@/config/env";
import useAppStore from "@/stores/app";
import type { UserInfo } from "@/types";

export async function initUser() {
    const appStore = useAppStore();

    // 从本地获取 token
    const token = uni.getStorageSync(STORAGE_KEY_TOKEN) as string | null;

    if (!token) {
        console.log("未登录，跳转登录页");
        // reLaunch 关闭所有页面后打开登录页，用户无法返回上一页
        uni.reLaunch({ url: "/pages/login/index" });
        return;
    }

    appStore.setToken(token);

    // TODO: 调用后端接口获取用户信息
    // try {
    //     const user = await get<UserInfo>("/user/info");
    //     appStore.setUser(user);
    // } catch {
    //     // token 无效，清除登录状态
    //     uni.removeStorageSync(STORAGE_KEY_TOKEN);
    //     uni.removeStorageSync(STORAGE_KEY_REFRESH_TOKEN);
    //     return;
    // }

    // 开发模式：模拟用户信息
    const mockUser: UserInfo = {
        id: 1,
        name: "Jack"
    };
    appStore.setUser(mockUser);

    console.log("用户初始化完成");
}
