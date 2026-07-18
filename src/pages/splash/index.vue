<template>
    <!-- #ifdef APP -->
    <scroll-view style="flex: 1">
        <!-- #endif -->

        <view class="splash__container">
            <view class="splash">
                <image class="splash__logo" src="/static/logo.png" />
                <text class="splash__title">{{ t("app.splash_title") }}</text>
            </view>
        </view>

        <!-- #ifdef APP -->
    </scroll-view>
    <!-- #endif -->
</template>

<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";
import { bootstrap } from "@/helper/bootstrap";
import { STORAGE_KEY_TOKEN } from "@/config/env";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

onLoad(async () => {
    await bootstrap();
    // 控制最小展示时间（避免闪屏）
    await new Promise(resolve => setTimeout(resolve, 1000));
    next();
});

function next() {
    const token = uni.getStorageSync(STORAGE_KEY_TOKEN);
    if (token) {
        uni.switchTab({ url: "/pages/message/index" });
    } else {
        uni.reLaunch({ url: "/pages/login/index" });
    }
}
</script>

<style lang="scss" scoped>
.splash__container {
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

.splash__logo {
    width: 140px;
    height: 140px;
}

.splash__title {
    margin-top: 20px;
    font-size: 22px;
    font-weight: bold;
}
</style>
