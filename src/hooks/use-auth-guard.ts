/**
 * 页面级认证守卫 composable
 *
 * 在需要登录才能访问的页面中调用，确保页面每次 onShow 时校验登录状态。
 *
 * 平台差异处理：
 * - H5：通过路由拦截器处理，无需额外逻辑
 * - 微信小程序：需要在 onShow 中手动校验
 *
 * 使用方式:
 *   // 在页面的 <script setup> 中
 *   useAuthGuard();
 */

import { checkToken } from "@/interceptor/route";
import { onShow } from "@dcloudio/uni-app";

export function useAuthGuard() {
    // #ifdef MP-WEIXIN
    onShow(() => {
        const pages = getCurrentPages();
        const current = pages[pages.length - 1];
        if (!current) return;

        const url = "/" + current.route;
        // 校验登录状态，未登录会自动跳转至登录页
        checkToken(url);
    });
    // #endif

    // H5 平台通过路由拦截器处理，无需额外逻辑
}
