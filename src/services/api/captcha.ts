import { API_BASE_URL } from "@/config/env";
import { request, requestRaw } from "../http";

/**
 * 获取图形验证码
 * 返回 { key, image }，key 需随登录请求一同提交
 */
export async function getCaptcha(): Promise<{ key: string; image: string }> {
    const res = await requestRaw({
        url: "/api/common/kaptcha",
        method: "GET",
        responseType: "arraybuffer",
        skipAuth: true
    });
    const key = (res.header && (res.header["captcha-key"] || res.header["Captcha-Key"])) || "";
    const base64 = uni.arrayBufferToBase64(res.data as ArrayBuffer);
    const image = `data:image/png;base64,${base64}`;
    return { key, image };
}

/**
 * 发送手机验证码（无响应体）
 */
export function sendSmsCode(phone: string): Promise<void> {
    return request<void>({ url: "/api/auth/sms", method: "POST", data: { phone }, skipAuth: true, noBody: true });
}

/**
 * 发送邮箱验证码（无响应体）
 */
export function sendEmailCode(email: string): Promise<void> {
    return request<void>({ url: "/api/auth/email", method: "POST", data: { email }, skipAuth: true, noBody: true });
}
