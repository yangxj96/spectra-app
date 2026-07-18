/**
 * H5 平台加解密实现
 *
 * 使用 Web Crypto API 进行 RSA + AES-GCM 加解密
 */

import { API_BASE_URL, CRYPTO_ENABLED, STORAGE_KEY_TOKEN } from "@/config/env";
import type { ApiResponse } from "@/types";
import { decrypt, encrypt, generateIv, sign, verifySignature } from "@/utils/crypto/crypto-utils";
import type { CryptoPlatform, EncryptedBody } from "./types";

class H5CryptoPlatform implements CryptoPlatform {
    private cryptoEnabled = false;
    private serverPublicKey: string | null = null;
    private clientPrivateKey: string | null = null;

    isEnabled(): boolean {
        return this.cryptoEnabled;
    }

    async init(): Promise<void> {
        if (!CRYPTO_ENABLED) return;
        try {
            const res = await new Promise<UniApp.RequestSuccessCallbackResult>((resolve, reject) => {
                uni.request({
                    url: API_BASE_URL + "/api/system/crypto/config",
                    method: "GET",
                    timeout: 10000,
                    success: r => resolve(r),
                    fail: e => reject(e)
                });
            });
            const data = res.data as ApiResponse<{ enabled: boolean; serverPublicKey: string }>;
            if (res.statusCode === 200 && data?.code === 200) {
                this.cryptoEnabled = data.data.enabled;
                this.serverPublicKey = data.data.serverPublicKey;
                console.log(`[Crypto] 初始化完成: enabled=${this.cryptoEnabled}`);
            }
        } catch (e) {
            console.warn("[Crypto] 初始化失败，加解密已禁用:", e);
            this.cryptoEnabled = false;
        }
    }

    async fetchClientPrivateKey(): Promise<void> {
        if (!this.cryptoEnabled) return;
        try {
            const token = uni.getStorageSync(STORAGE_KEY_TOKEN) as string | null;
            if (!token) return;
            const res = await new Promise<UniApp.RequestSuccessCallbackResult>((resolve, reject) => {
                uni.request({
                    url: API_BASE_URL + "/api/system/crypto/keypair/client-private",
                    method: "GET",
                    header: { Authorization: `Bearer ${token}` },
                    timeout: 10000,
                    success: r => resolve(r),
                    fail: e => reject(e)
                });
            });
            const data = res.data as ApiResponse<{ privateKey: string }>;
            if (res.statusCode === 200 && data?.code === 200 && data.data?.privateKey) {
                this.clientPrivateKey = data.data.privateKey;
                console.log("[Crypto] 客户端私钥已获取");
            }
        } catch (e) {
            console.warn("[Crypto] 获取客户端私钥失败:", e);
        }
    }

    async encryptRequest(bodyStr: string): Promise<EncryptedBody> {
        if (!this.serverPublicKey) {
            throw new Error("服务端公钥未就绪，无法加密请求");
        }

        const iv = generateIv();
        const timestamp = Math.floor(Date.now() / 1000);
        const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))));

        const { encryptedData, encryptedKey } = await encrypt(bodyStr, iv, this.serverPublicKey);

        const signContent = `data=${encryptedData}&nonce=${nonce}&timestamp=${timestamp}`;
        const signature = await sign(signContent, this.clientPrivateKey!);

        return { data: encryptedData, key: encryptedKey, iv, nonce, timestamp, signature };
    }

    async decryptResponse(encryptedBody: EncryptedBody): Promise<unknown> {
        if (!this.serverPublicKey || !this.clientPrivateKey) {
            throw new Error("密钥未就绪，无法解密响应");
        }

        const signData = `data=${encryptedBody.data}&nonce=${encryptedBody.nonce}&timestamp=${encryptedBody.timestamp}`;
        const isValid = await verifySignature(encryptedBody.signature, signData, this.serverPublicKey);
        if (!isValid) {
            throw new Error("签名验证失败，数据可能被篡改");
        }

        const json = await decrypt(encryptedBody.key, encryptedBody.data, encryptedBody.iv, this.clientPrivateKey);
        return JSON.parse(json) as unknown;
    }
}

export default new H5CryptoPlatform();
