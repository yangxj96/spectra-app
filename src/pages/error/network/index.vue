<template>
    <view class="container">
        <view class="content">
            <view class="icon-wrap">
                <text class="icon">!</text>
            </view>
            <text class="title">{{ t("error.network") }}</text>
            <text class="desc">{{ t("error.network_desc") }}</text>
            <view class="btn" @tap="retry">
                <text class="btn-text">{{ t("error.retry") }}</text>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();

function retry() {
    uni.navigateBack({ delta: 1 });
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

.icon-wrap {
    width: 120rpx;
    height: 120rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba($color: $uni-color-warning, $alpha: 0.1);
}

.icon {
    font-size: 60rpx;
    font-weight: bold;
    color: $uni-color-warning;
}

.title {
    margin-top: 32rpx;
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
