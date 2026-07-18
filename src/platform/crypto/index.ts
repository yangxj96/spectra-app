/**
 * 加解密平台抽象入口
 *
 * 通过条件编译导出对应平台的实现
 * 业务代码统一从 @/platform/crypto 导入
 */

import type { CryptoPlatform } from "./types";

function createCryptoPlatform(): CryptoPlatform {
    // #ifdef H5
    return import("./h5").then(m => m.default);
    // #endif

    // #ifndef H5
    return import("./base").then(m => m.default);
    // #endif
}

// 使用同步导入（条件编译在编译时生效）
let platform: CryptoPlatform;

// #ifdef H5
platform = (await import("./h5")).default;
// #endif

// #ifndef H5
platform = (await import("./base")).default;
// #endif

export const crypto: CryptoPlatform = platform;
export type { CryptoPlatform, EncryptedBody } from "./types";
