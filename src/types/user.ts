/**
 * 用户相关类型定义
 */

/** 用户信息 */
export interface UserInfo {
    /** 用户 ID */
    id: number;
    /** 用户名 */
    name: string;
    /** 头像 URL */
    avatar?: string;
    /** 手机号 */
    phone?: string;
    /** 邮箱 */
    email?: string;
}

/** 登录请求参数 */
export interface LoginRequest {
    username: string;
    password: string;
    captcha: string;
}

/** 登录响应 */
export interface LoginResponse {
    token: string;
    refresh_token: string;
    user: UserInfo;
}
