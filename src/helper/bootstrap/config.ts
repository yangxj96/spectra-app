import { DEV_MODE } from "@/config/env";

/**
 * 初始化应用配置
 *
 * TODO: 从后端拉取远程配置（如功能开关、主题色、广告位等）
 * 或从本地存储读取缓存的配置
 */
export async function initConfig() {
    // TODO: 从后端获取应用配置
    // try {
    //     const config = await get<AppConfig>("/app/config");
    //     // 缓存到本地
    //     setJSON("app_config", config);
    // } catch {
    //     // 网络失败时使用本地缓存
    //     const cached = getJSON<AppConfig>("app_config");
    //     if (cached) { ... }
    // }

    if (DEV_MODE) {
        console.log("配置初始化完成");
    }
}
