/**
 * Toast / Loading 统一封装
 *
 * 提供快捷方法和防重复 loading 逻辑，
 * 替换项目中直接使用 uni.showToast / uni.showLoading 的散落代码。
 */

/** loading 计数器（防止嵌套调用导致提前关闭） */
let loadingCount = 0;

/**
 * 显示加载提示（支持嵌套调用）
 */
export function showLoading(msg = "加载中..."): void {
    if (loadingCount === 0) {
        uni.showLoading({ title: msg, mask: true });
    }
    loadingCount++;
}

/**
 * 隐藏加载提示
 */
export function hideLoading(): void {
    loadingCount = Math.max(0, loadingCount - 1);
    if (loadingCount === 0) {
        uni.hideLoading();
    }
}

/**
 * 通用 Toast
 */
export function showToast(title: string, icon: "success" | "error" | "none" = "none", duration = 2000): void {
    uni.showToast({ title, icon, duration });
}

/**
 * 成功 Toast
 */
export function toastSuccess(title = "操作成功"): void {
    showToast(title, "success");
}

/**
 * 错误 Toast
 */
export function toastError(title = "操作失败"): void {
    showToast(title, "error");
}

/**
 * 包装 Promise：自动显示/隐藏 loading
 *
 * @example
 *   const data = await withLoading(fetchUser(), "加载用户信息...");
 */
export async function withLoading<T>(promise: Promise<T>, msg = "加载中..."): Promise<T> {
    showLoading(msg);
    try {
        return await promise;
    } finally {
        hideLoading();
    }
}
