import { createBasePermissionApi } from "./base";
import type { PermissionApi } from "./types";

export const permissionApi: PermissionApi = {
    ...createBasePermissionApi(),
    async requestPermission(permission: string, reason?: string): Promise<boolean> {
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
        //                 plus.runtime.openURL("app-settings:");
        //             }
        //         }
        //     });
        // }
        // return false;

        // TODO: 接入 HBuilderX 基座后取消注释上方代码
        return true;
    }
};
