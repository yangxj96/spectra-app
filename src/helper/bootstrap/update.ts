import { DEV_MODE } from "@/config/env";

/**
 * 检查应用更新
 *
 * 流程:
 * 1. 调用后端接口获取最新版本号
 * 2. 与当前版本对比（当前版本通过 plus.runtime.getProperty 获取）
 * 3. 如有新版本：弹窗提示用户下载更新
 * 4. 如为强制更新：阻止用户继续使用
 *
 * TODO: 接入实际更新检查接口
 */
export async function initUpdateCheck() {
    // TODO: 获取当前版本号（H5 无法获取，仅 APP 有效）
    // #ifdef APP-PLUS
    // const info = plus.runtime.getProperty(plus.runtime.appid);
    // const currentVersion = info.version;
    // #endif
    // #ifndef APP-PLUS
    // const currentVersion = "1.0.0";
    // #endif

    // TODO: 调用后端更新检查接口
    // const result = await get<UpdateInfo>("/app/version", { version: currentVersion });
    // if (result.hasUpdate) {
    //     uni.showModal({
    //         title: "发现新版本",
    //         content: result.description,
    //         confirmText: "立即更新",
    //         cancelText: result.forceUpdate ? undefined : "稍后",
    //         showCancel: !result.forceUpdate,
    //         success(res) {
    //             if (res.confirm) {
    //                 // 跳转下载页（Android APK / iOS App Store）
    //                 plus.runtime.openURL(result.downloadUrl);
    //             }
    //         }
    //     });
    // }

    if (DEV_MODE) {
        console.log("更新检查完成");
    }
}
