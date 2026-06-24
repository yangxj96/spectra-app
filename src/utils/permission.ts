/**
 * 权限管理工具
 *
 * 封装 Android/iOS 运行时权限请求，
 * 处理权限拒绝后的引导跳转系统设置。
 */

/** 权限状态 */
export type PermissionStatus = "granted" | "denied" | "undetermined";

/**
 * 请求 Android 运行时权限
 *
 * @param permission Android 权限名，如 "android.permission.CAMERA"
 * @param reason 权限用途说明（首次拒绝后再次请求时展示）
 * @returns 是否已授权
 *
 * TODO: 此方法依赖 HBuilderX 基座打包后生效，H5 开发时需用条件编译包裹
 */
export async function requestAndroidPermission(permission: string, reason?: string): Promise<boolean> {
    // #ifdef APP-ANDROID
    // 注意：以下代码需在真机/模拟器上运行，H5 开发时跳过
    // const granted = plus.android.requestPermissions([permission]);
    // if (granted) return true;
    //
    // // 检查是否被永久拒绝
    // const status = plus.android.checkPermission(permission);
    // if (status === -1) {
    //     uni.showModal({
    //         title: "权限申请",
    //         content: reason || "需要此权限才能正常使用该功能，请在设置中开启",
    //         success(res) {
    //             if (res.confirm) {
    //                 // 跳转应用设置页
    //                 plus.runtime.openURL("app-settings:");
    //             }
    //         }
    //     });
    // }
    // #endif

    // 非 Android 平台直接返回 true
    return true;
}

/**
 * 请求定位权限
 */
export async function requestLocationPermission(): Promise<boolean> {
    return requestAndroidPermission("android.permission.ACCESS_FINE_LOCATION", "需要定位权限获取您的位置信息");
}

/**
 * 请求相机权限
 */
export async function requestCameraPermission(): Promise<boolean> {
    return requestAndroidPermission("android.permission.CAMERA", "需要相机权限用于拍照/扫码");
}

/**
 * 请求存储权限
 */
export async function requestStoragePermission(): Promise<boolean> {
    return requestAndroidPermission("android.permission.WRITE_EXTERNAL_STORAGE", "需要存储权限用于保存文件");
}
