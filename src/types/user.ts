/**
 * 用户相关类型定义
 */

/** 用户信息 */
export interface UserInfo {
    /** 用户 ID */
    id: string;
    /** 用户名 */
    username: string;
    /** 头像 URL */
    avatar?: string;
    /** 手机号 */
    phone?: string;
    /** 邮箱 */
    email?: string;
}

/** 登录请求参数 */
export interface LoginRequest {
    type: "PASSWORD";
    username: string;
    password: string;
    captcha: string;
    captchaKey?: string;
}

/** 登录响应 data */
export interface LoginResponseData {
    id: string;
    username: string;
    access_token: string;
    authorities: string[];
    roles: string[];
}

/** 登录响应 */
export interface LoginResponse {
    code: number;
    msg: string;
    data: LoginResponseData;
}
