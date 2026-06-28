<template>
    <view class="container">
        <view class="content">
            <text class="code">404</text>
            <text class="title">{{ t("error.not_found") }}</text>
            <text class="desc">{{ t("error.not_found_desc") }}</text>
            <view class="btn" @tap="goHome">
                <text class="btn-text">{{ t("error.back_home") }}</text>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();

function goHome() {
    uni.reLaunch({ url: "/pages/message/index" });
}
</script>

<style lang="scss" scoped>
.container {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $uni-bg-color;
}

.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 40rpx;
}

.code {
    font-size: 120rpx;
    font-weight: bold;
    color: $uni-text-color-grey;
    line-height: 1.2;
}

.title {
    margin-top: 24rpx;
    font-size: 36rpx;
    font-weight: 500;
    color: $uni-text-color;
}

.desc {
    margin-top: 16rpx;
    font-size: 28rpx;
    color: $uni-text-color-grey;
    text-align: center;
}

.btn {
    margin-top: 60rpx;
    padding: 20rpx 80rpx;
    background: $uni-color-primary;
    border-radius: 48rpx;
}

.btn-text {
    font-size: 30rpx;
    color: #ffffff;
}
</style>
