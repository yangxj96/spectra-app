import type { PermissionApi } from "./types";

/**
 * 基础权限实现（Web / 非原生平台）
 *
 * Web 端无运行时权限概念，直接返回 true。
 */
export function createBasePermissionApi(): PermissionApi {
    return {
        requestPermission(_permission: string, _reason?: string): Promise<boolean> {
            return Promise.resolve(true);
        }
    };
}
