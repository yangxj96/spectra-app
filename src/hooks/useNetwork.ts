/**
 * 网络状态监听 composable
 *
 * 使用方式:
 *   const { isOnline, networkType } = useNetwork()
 *   watch(isOnline, (val) => { ... })
 */

import { onHide, onShow } from "@dcloudio/uni-app";
import { ref } from "vue";

/** 网络是否可用 */
const isOnline = ref(true);

/** 当前网络类型 */
const networkType = ref<string>("unknown");

/** 是否已初始化 */
let initialized = false;

/**
 * 初始化网络监听（应在 App.vue onLaunch 中调用 setupNetworkListener）
 */
export function setupNetworkListener() {
    if (initialized) return;
    initialized = true;

    // 获取初始网络状态
    uni.getNetworkType({
        success(res) {
            networkType.value = res.networkType;
            isOnline.value = res.networkType !== "none";
        }
    });

    // 监听网络状态变化
    uni.onNetworkStatusChange(res => {
        networkType.value = res.networkType;
        isOnline.value = res.isConnected;

        if (!res.isConnected) {
            uni.showToast({ title: "网络已断开", icon: "none" });
        }
    });
}

/**
 * 网络状态 composable
 */
export function useNetwork() {
    // 页面 onShow 时刷新网络状态
    onShow(() => {
        uni.getNetworkType({
            success(res) {
                networkType.value = res.networkType;
                isOnline.value = res.networkType !== "none";
            }
        });
    });

    return {
        isOnline,
        networkType
    };
}
