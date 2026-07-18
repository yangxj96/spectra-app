<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();

function goHome() {
    uni.reLaunch({ url: "/pages/message/index" });
}
</script>

<template>
    <view class="error-not-found__container">
        <view class="error-not-found__content">
            <text class="error-not-found__code">404</text>
            <text class="error-not-found__title">{{ t("error.not_found") }}</text>
            <text class="error-not-found__desc">{{ t("error.not_found_desc") }}</text>
            <view class="error-not-found__btn" @tap="goHome">
                <text class="error-not-found__btn-text">{{ t("error.back_home") }}</text>
            </view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.error-not-found__container {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $uni-bg-color;
}

.error-not-found__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 40rpx;
}

.error-not-found__code {
    font-size: 120rpx;
    font-weight: bold;
    color: $uni-text-color-grey;
    line-height: 1.2;
}

.error-not-found__title {
    margin-top: 24rpx;
    font-size: 36rpx;
    font-weight: 500;
    color: $uni-text-color;
}

.error-not-found__desc {
    margin-top: 16rpx;
    font-size: 28rpx;
    color: $uni-text-color-grey;
    text-align: center;
}

.error-not-found__btn {
    margin-top: 60rpx;
    padding: 20rpx 80rpx;
    background: $uni-color-primary;
    border-radius: 48rpx;
}

.error-not-found__btn-text {
    font-size: 30rpx;
    color: #ffffff;
}
</style>
