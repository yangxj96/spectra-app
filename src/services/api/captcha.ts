import { API_BASE_URL } from "@/config/env";
import { request } from "../http";

/**
 * 获取图形验证码
 * 返回 { key, image }，key 需随登录请求一同提交
 */
export async function getCaptcha(): Promise<{ key: string; image: string }> {
    return new Promise((resolve, reject) => {
        uni.request({
            url: API_BASE_URL + "/api/common/kaptcha",
            method: "GET",
            responseType: "arraybuffer",
            header: { "Api-Version": "1.0.0" },
            success(res) {
                if (res.statusCode !== 200) {
                    reject(new Error(`获取验证码失败(${res.statusCode})`));
                    return;
                }
                const key = (res.header && (res.header["captcha-key"] || res.header["Captcha-Key"])) || "";
                const base64 = uni.arrayBufferToBase64(res.data as ArrayBuffer);
                const image = `data:image/png;base64,${base64}`;
                resolve({ key, image });
            },
            fail(err) {
                reject(new Error(err.errMsg || "获取验证码失败"));
            }
        });
    });
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
