import { createBasePermissionApi } from "./base";
import type { PermissionApi } from "./types";

export const permissionApi: PermissionApi = {
    ...createBasePermissionApi()
};
