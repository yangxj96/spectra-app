/**
 * 非 H5 平台加解密实现（空实现）
 *
 * APP 和微信小程序平台暂不支持加解密，直接透传数据
 */

import type { CryptoPlatform, EncryptedBody } from "./types";

class BaseCryptoPlatform implements CryptoPlatform {
    isEnabled(): boolean {
        return false;
    }

    async init(): Promise<void> {
        // 非 H5 平台无需初始化
    }

    async fetchClientPrivateKey(): Promise<void> {
        // 非 H5 平台无需获取私钥
    }

    async encryptRequest(bodyStr: string): Promise<EncryptedBody> {
        throw new Error("当前平台不支持加解密");
    }

    async decryptResponse(encryptedBody: EncryptedBody): Promise<unknown> {
        throw new Error("当前平台不支持加解密");
    }
}

export default new BaseCryptoPlatform();
