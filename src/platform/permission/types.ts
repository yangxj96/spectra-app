/** 权限状态 */
export type PermissionStatus = "granted" | "denied" | "undetermined";

/** 权限能力接口（统一抽象） */
export type PermissionApi = {
    /**
     * 请求运行时权限
     *
     * @param permission 权限名，如 "android.permission.CAMERA"
     * @param reason 权限用途说明（拒绝后引导展示）
     * @returns 是否已授权
     */
    requestPermission(permission: string, reason?: string): Promise<boolean>;
};
