/**
 * 权限管理工具
 *
 * 通过 platform/permission 统一处理平台差异，
 * 此文件仅提供业务级快捷方法。
 */

import { permission } from "@/platform/permission";

/**
 * 请求定位权限
 */
export async function requestLocationPermission(): Promise<boolean> {
    return permission.requestPermission("android.permission.ACCESS_FINE_LOCATION", "需要定位权限获取您的位置信息");
}

/**
 * 请求相机权限
 */
export async function requestCameraPermission(): Promise<boolean> {
    return permission.requestPermission("android.permission.CAMERA", "需要相机权限用于拍照/扫码");
}

/**
 * 请求存储权限
 */
export async function requestStoragePermission(): Promise<boolean> {
    return permission.requestPermission("android.permission.WRITE_EXTERNAL_STORAGE", "需要存储权限用于保存文件");
}
