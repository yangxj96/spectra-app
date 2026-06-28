<script setup lang="ts">
import { onError, onExit, onHide, onLaunch, onPageNotFound, onShow, onUnhandledRejection } from "@dcloudio/uni-app";
import { useI18n } from "vue-i18n";
import { DEV_MODE } from "@/config/env";
import { setupErrorHandler, reportError } from "@/helper/error_handler";
import { pushManager } from "@/helper/push_message";
import { setupNetworkListener } from "@/hooks/useNetwork";
import useAppStore from "@/stores/app";

const { t } = useI18n();

onLaunch(() => {
    console.log("App启动");

    // 安装全局错误处理
    setupErrorHandler();

    // 安装网络状态监听
    setupNetworkListener();

    const appStore = useAppStore();

    // 动态设置 tabBar 国际化文字
    uni.setTabBarItem({ index: 0, text: t("tab.message") });
    uni.setTabBarItem({ index: 1, text: t("tab.contacts") });
    uni.setTabBarItem({ index: 2, text: t("tab.workbench") });
    uni.setTabBarItem({ index: 3, text: t("tab.mine") });

    // 获取客户端推送ID
    uni.getPushClientId({
        success: res => {
            console.log("获取推送ClientId成功：", res.cid);
            appStore.setPushId(res.cid);
        },
        fail: err => {
            console.error("获取推送ClientId失败：", err);
        }
    });

    // 接收客户端推送消息
    pushManager.on("receive", data => {
        console.log("收到消息回调:", data);
    });

    pushManager.on("click", data => {
        console.log("点击通知回调:", data);
    });
});

onShow(() => {
    console.log("App切换到前台");
});

onHide(() => {
    console.log("App切换到后台");
});

onExit(() => {
    console.log("App退出");
    // 取消监听推送消息
    uni.offPushMessage();
});

// 全局 Vue 组件错误捕获
onError(err => {
    console.error("[onError]", err);
    reportError({ type: "vueError", message: String(err) });

    // 开发模式下弹窗提示
    if (DEV_MODE) {
        uni.showToast({ title: String(err).slice(0, 20), icon: "none" });
    }
});

// 未处理的 Promise 拒绝（补充 setupErrorHandler 中的 uni.onUnhandledRejection）
onUnhandledRejection(res => {
    console.error("[onUnhandledRejection]", res);
    reportError({ type: "unhandledRejection", detail: res });
});

// 页面不存在
onPageNotFound(res => {
    console.error("[onPageNotFound]", res.path);
    reportError({ type: "pageNotFound", message: res.path });
    uni.reLaunch({ url: "/pages/error/not-found/index" });
});
</script>
<style></style>
