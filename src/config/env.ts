/**
 * 环境配置统一导出
 *
 * 所有环境变量通过 import.meta.env.VITE_* 注入，
 * 在此模块统一读取、类型转换、设置默认值，
 * 业务代码只引用此模块，不直接读 import.meta.env。
 */

/** API 基础地址 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

/** 是否开发模式（跳过登录校验等） */
export const DEV_MODE = import.meta.env.VITE_DEV_MODE === "true";

/** 应用标题 */
export const APP_TITLE = (import.meta.env.VITE_APP_TITLE as string) || "光谱";

/** 请求超时时间（毫秒） */
export const REQUEST_TIMEOUT = 15000;

/** token 在本地存储中的 key */
export const STORAGE_KEY_TOKEN = "token";

/** refresh_token 在本地存储中的 key */
export const STORAGE_KEY_REFRESH_TOKEN = "refresh_token";

/** 用户信息在本地存储中的 key */
export const STORAGE_KEY_USER = "user_info";

/** 是否启用请求加解密 */
export const CRYPTO_ENABLED = import.meta.env.VITE_CRYPTO_ENABLED === "true";

/** RSA 公钥（用于加密请求 / 验证响应签名） */
export const RSA_PUBLIC_KEY = import.meta.env.VITE_RSA_PUBLIC_KEY as string;

/** RSA 私钥（用于解密响应） */
export const RSA_PRIVATE_KEY = import.meta.env.VITE_RSA_PRIVATE_KEY as string;
