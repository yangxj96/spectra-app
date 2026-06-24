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
 *    - 使用 uni.getStorageSync("token") 读取
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
 *    - uni.removeStorageSync("token")
 *    - uni.removeStorageSync("refresh_token")
 *    - 如有其他用户相关缓存一并清除
 *    - 返回 false
 *
 * @returns true 表示已登录/token 有效，false 表示需要重新登录
 */
function validateToken(): boolean {
    // TODO: 步骤 1 - 从本地存储读取 token
    // const token = uni.getStorageSync("token") as string | null;
    // if (!token) return false;

    // TODO: 步骤 2 - 校验 token 是否过期
    // 解析 JWT 示例：
    // try {
    //     const payload = JSON.parse(atob(token.split(".")[1]));
    //     const expired = payload.exp * 1000 < Date.now();
    //     if (!expired) return true;
    // } catch {
    //     // 非 JWT 格式，调用后端接口校验
    // }

    // TODO: 步骤 3 - token 过期，尝试刷新
    // const refreshToken = uni.getStorageSync("refresh_token") as string | null;
    // if (refreshToken) {
    //     try {
    //         const res = await request<{ token: string; refresh_token: string }>({
    //             url: "/auth/refresh",
    //             method: "POST",
    //             data: { refresh_token: refreshToken }
    //         });
    //         if (res.code === 0) {
    //             uni.setStorageSync("token", res.data.token);
    //             uni.setStorageSync("refresh_token", res.data.refresh_token);
    //             return true;
    //         }
    //     } catch { /* 刷新失败，继续清除流程 */ }
    // }

    // TODO: 步骤 4 - 清除本地登录状态
    // uni.removeStorageSync("token");
    // uni.removeStorageSync("refresh_token");
    // return false;

    // 开发阶段暂时放行，实现上述步骤后移除此行
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
