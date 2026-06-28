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

/** 登录类型 */
export type LoginType = "PASSWORD" | "SMS" | "EMAIL";

/** 密码登录请求 */
export interface PasswordLoginRequest {
    type: "PASSWORD";
    username: string;
    password: string;
    captcha: string;
    captchaKey?: string;
}

/** 手机验证码登录请求 */
export interface SmsLoginRequest {
    type: "SMS";
    username: string;
    sms_code: string;
}

/** 邮箱验证码登录请求 */
export interface EmailLoginRequest {
    type: "EMAIL";
    username: string;
    email_code: string;
}

/** 登录请求参数 */
export type LoginRequest = PasswordLoginRequest | SmsLoginRequest | EmailLoginRequest;

/** 登录响应 data */
export interface LoginResponseData {
    id: string;
    username: string;
    access_token: string;
    refresh_token: string;
    authorities: string[];
    roles: string[];
}

/** 登录响应 */
export interface LoginResponse {
    code: number;
    msg: string;
    data: LoginResponseData;
}
