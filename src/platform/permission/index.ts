import type { PermissionApi } from "./types";

let api: PermissionApi;

// #ifdef APP-ANDROID || APP-HARMONY
import { permissionApi as androidApi } from "./android";
api = androidApi;
// #endif

// #ifdef WEB
import { permissionApi as webApi } from "./web";
api = webApi;
// #endif

/** 对外统一导出 */
export const permission = api;
