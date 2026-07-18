/**
 * 加解密平台抽象接口
 */

/** 加密结果 */
export interface EncryptedBody {
    data: string;
    key: string;
    iv: string;
    nonce: string;
    timestamp: number;
    signature: string;
}

/** 加解密能力接口 */
export interface CryptoPlatform {
    /** 是否启用加解密 */
    isEnabled(): boolean;

    /** 初始化加解密配置 */
    init(): Promise<void>;

    /** 获取客户端私钥 */
    fetchClientPrivateKey(): Promise<void>;

    /** 加密请求体 */
    encryptRequest(bodyStr: string): Promise<EncryptedBody>;

    /** 解密响应体 */
    decryptResponse(encryptedBody: EncryptedBody): Promise<unknown>;
}
