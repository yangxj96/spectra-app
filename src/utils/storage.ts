/**
 * 类型安全的本地存储工具
 *
 * 对 uni.getStorageSync / setStorageSync / removeStorageSync 的封装，
 * 统一 key 管理、JSON 序列化、异常处理。
 */

/** 存储 key 常量（集中管理，避免字符串拼写错误） */
export const STORAGE_KEYS = {
    TOKEN: "token",
    REFRESH_TOKEN: "refresh_token",
    USER_INFO: "user_info",
    SETTINGS: "app_settings",
    FIRST_LAUNCH: "first_launch"
} as const;

/**
 * 读取存储值
 */
export function getItem<T = any>(key: string): T | null {
    try {
        const value = uni.getStorageSync(key);
        if (value === "" || value === null || value === undefined) return null;
        return value as T;
    } catch (err) {
        console.error(`[Storage] getItem("${key}") 失败:`, err);
        return null;
    }
}

/**
 * 写入存储值
 */
export function setItem<T = any>(key: string, value: T): void {
    try {
        uni.setStorageSync(key, value);
    } catch (err) {
        console.error(`[Storage] setItem("${key}") 失败:`, err);
    }
}

/**
 * 移除存储值
 */
export function removeItem(key: string): void {
    try {
        uni.removeStorageSync(key);
    } catch (err) {
        console.error(`[Storage] removeItem("${key}") 失败:`, err);
    }
}

/**
 * 清空所有存储
 */
export function clearAll(): void {
    try {
        uni.clearStorageSync();
    } catch (err) {
        console.error("[Storage] clearAll 失败:", err);
    }
}

/**
 * 读取 JSON 存储值（自动 JSON.parse）
 */
export function getJSON<T = any>(key: string): T | null {
    try {
        const value = uni.getStorageSync(key);
        if (value === "" || value === null || value === undefined) return null;
        return JSON.parse(value) as T;
    } catch (err) {
        console.error(`[Storage] getJSON("${key}") 失败:`, err);
        return null;
    }
}

/**
 * 写入 JSON 存储值（自动 JSON.stringify）
 */
export function setJSON<T = any>(key: string, value: T): void {
    try {
        uni.setStorageSync(key, JSON.stringify(value));
    } catch (err) {
        console.error(`[Storage] setJSON("${key}") 失败:`, err);
    }
}
