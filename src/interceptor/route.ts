import { DEV_MODE, STORAGE_KEY_REFRESH_TOKEN, STORAGE_KEY_TOKEN } from "@/config/env";

// 需要拦截的导航方法
const methods = ["navigateTo", "redirectTo", "reLaunch", "switchTab"] as const;

// 白名单路由（无需登录即可访问）
const whiteList = [
    "/pages/splash/index", // 启动页
    "/pages/login/index" // 登录页
];

/**
 * 判断目标路由是否需要登录校验
 */
function needLogin(url: string): boolean {
    return !whiteList.some(item => url.startsWith(item));
}

/** 防止重复跳转登录页 */
let isRedirecting = false;

/**
 * 校验 token 有效性
 *
 * 校验步骤（按顺序执行）:
 *
 * 1. 从本地存储获取 token
 *    - 使用 uni.getStorageSync(STORAGE_KEY_TOKEN) 读取
 *    - token 不存在则直接判定为未登录
 *
 * 2. 解析 token 判断是否过期
 *    - 方式一（离线）：解析 JWT payload 中的 exp 字段，与当前时间对比
 *    - 方式二（在线）：调用后端接口（如 GET /auth/check）验证 token 有效性
 *    - 推荐优先使用方式一，网络不可用时降级为宽松策略
 *
 * 3. token 过期时尝试刷新
 *    - 从本地存储读取 refresh_token
 *    - 调用后端接口（如 POST /auth/refresh）获取新 token
 *    - 刷新成功：更新本地存储中的 token 和 refresh_token，返回 true
 *    - 刷新失败或不存在 refresh_token：进入步骤 4
 *
 * 4. 清除本地登录状态
 *    - uni.removeStorageSync(STORAGE_KEY_TOKEN)
 *    - uni.removeStorageSync(STORAGE_KEY_REFRESH_TOKEN)
 *    - 如有其他用户相关缓存一并清除
 *    - 返回 false
 *
 * @returns true 表示已登录/token 有效，false 表示需要重新登录
 */
function validateToken(): boolean {
    // 步骤 1 - 从本地存储读取 token
    const token = uni.getStorageSync(STORAGE_KEY_TOKEN) as string | null;
    if (!token) return false;

    // 步骤 2 - 校验 token 是否过期
    // 解析 JWT 示例：
    // try {
    //     const payload = JSON.parse(atob(token.split(".")[1]));
    //     const expired = payload.exp * 1000 < Date.now();
    //     if (!expired) return true;
    // } catch {
    //     // 非 JWT 格式，调用后端接口校验（异步校验需改造为 Promise）
    // }

    // 步骤 3 - token 过期，尝试刷新
    // 注意：此处为同步拦截器，实际刷新需要异步请求。
    // 方案一：将 validateToken 改为 async，在 invoke 中 await
    // 方案二：token 过期时不在此处刷新，依赖 HTTP 层 401 响应自动刷新
    // 推荐方案二：拦截器仅判断 token 是否存在，过期由 HTTP 层 401 处理
    // const refreshToken = uni.getStorageSync(STORAGE_KEY_REFRESH_TOKEN) as string | null;
    // if (refreshToken) { ... }

    // 步骤 4 - 清除本地登录状态（到达此处说明 token 无效）
    // uni.removeStorageSync(STORAGE_KEY_TOKEN);
    // uni.removeStorageSync(STORAGE_KEY_REFRESH_TOKEN);
    // return false;

    // token 存在则放行（深度校验由 HTTP 层 401 拦截处理）
    return true;
}

/**
 * 检查登录状态，未登录时跳转至登录页
 *
 * @param url 目标页面路径
 * @returns true 放行，false 拦截并跳转登录页
 */
export function checkToken(url?: string): boolean {
    // 白名单直接放行
    if (url && !needLogin(url)) return true;

    // 开发模式跳过校验
    if (DEV_MODE) return true;

    // token 校验通过则放行
    if (validateToken()) return true;

    // 防止重复触发跳转
    if (isRedirecting) return false;

    isRedirecting = true;

    // 跳转登录页，携带来源路径用于登录后回跳
    uni.reLaunch({
        url: `/pages/login/index?redirect=${safeEncode(url)}`
    });

    return false;
}

/**
 * 安全编码 URL，避免重复编码导致的问题
 */
function safeEncode(url?: string): string {
    if (!url) return "";

    try {
        // 先解码再编码，避免重复编码
        const decoded = decodeURIComponent(url);
        return encodeURIComponent(decoded);
    } catch {
        return encodeURIComponent(url);
    }
}

// 注册导航拦截器
methods.forEach(method => {
    uni.addInterceptor(method, {
        invoke(args) {
            if (!checkToken(args.url)) {
                return false; // 拦截本次跳转
            }
            return args;
        }
    });
});
