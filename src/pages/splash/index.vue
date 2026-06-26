<template>
    <!-- #ifdef APP -->
    <scroll-view style="flex: 1">
        <!-- #endif -->

        <view class="container">
            <view class="splash">
                <image class="logo" src="/static/logo.png" />
                <text class="title">{{ t("app.splash_title") }}</text>
            </view>
        </view>

        <!-- #ifdef APP -->
    </scroll-view>
    <!-- #endif -->
</template>

<script setup lang="ts">
import { bootstrap } from "@/helper/bootstrap";
import useAppStore from "@/stores/app";
import { STORAGE_KEY_TOKEN } from "@/config/env";
import { useI18n } from "vue-i18n";
import { onMounted } from "vue";

const { t } = useI18n();
const appStore = useAppStore();

onMounted(async () => {
    await bootstrap();
    // 控制最小展示时间（避免闪屏）
    await new Promise(resolve => setTimeout(resolve, 1000));
    next();
});

function next() {
    if (appStore.isFirstLaunch) {
        uni.switchTab({ url: "/pages/message/index" });
        return;
    }

    const token = uni.getStorageSync(STORAGE_KEY_TOKEN);
    if (!token) {
        uni.reLaunch({ url: "/pages/login/index" });
        return;
    }

    uni.switchTab({ url: "/pages/message/index" });
}
</script>

<style lang="scss" scoped>
.container {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffffff;
}

.splash {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.logo {
    width: 140px;
    height: 140px;
}

.title {
    margin-top: 20px;
    font-size: 22px;
    font-weight: bold;
}
</style>
