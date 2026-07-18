/**
 * 全局错误处理
 *
 * 在 App.vue 的 onLaunch 中调用 setupErrorHandler() 注册所有全局错误捕获。
 */

import { DEV_MODE } from "@/config/env";

/**
 * 安装全局错误处理器
 *
 * 应在 App.vue onLaunch 中调用。
 */
export function setupErrorHandler() {
    // 1. Vue 组件渲染/监听器错误
    // uni-app 中通过 App.vue 的 onError 钩子处理（见 App.vue）

    // 2. 未处理的 Promise 拒绝
    uni.onUnhandledRejection(res => {
        console.error("[onUnhandledRejection]", res);
        // TODO: 上报到日志平台（如 Sentry、自建日志服务）
        // reportError({ type: "unhandledRejection", detail: res });
    });

    // 3. 页面不存在
    uni.onPageNotFound(res => {
        console.error("[onPageNotFound]", res.path);
        uni.reLaunch({ url: "/pages/error/not-found/index" });
    });

    if (DEV_MODE) {
        console.log("[ErrorHandler] 全局错误处理已安装");
    }
}

/**
 * 全局错误上报
 *
 * TODO: 接入日志/监控平台
 * 可选方案:
 * - Sentry (@sentry/vue)
 * - 自建日志服务 HTTP 上报
 * - uniCloud 云函数记录
 */
export function reportError(error: { type: string; message?: string; detail?: unknown }) {
    console.error("[ErrorReport]", error.type, error.message ?? error.detail);

    // TODO: 调用日志上报接口
    // post("/log/error", {
    //     type: error.type,
    //     message: error.message,
    //     detail: JSON.stringify(error.detail),
    //     timestamp: Date.now(),
    //     page: getCurrentPages()[getCurrentPages().length - 1]?.route ?? ""
    // });
}
