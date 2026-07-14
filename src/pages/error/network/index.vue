<template>
    <view class="error-network__container">
        <view class="error-network__content">
            <view class="error-network__icon-wrap">
                <text class="error-network__icon">!</text>
            </view>
            <text class="error-network__title">{{ t("error.network") }}</text>
            <text class="error-network__desc">{{ t("error.network_desc") }}</text>
            <view class="error-network__btn" @tap="retry">
                <text class="error-network__btn-text">{{ t("error.retry") }}</text>
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
.error-network__container {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $uni-bg-color;
}

.error-network__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 40rpx;
}

.error-network__icon-wrap {
    width: 120rpx;
    height: 120rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba($color: $uni-color-warning, $alpha: 0.1);
}

.error-network__icon {
    font-size: 60rpx;
    font-weight: bold;
    color: $uni-color-warning;
}

.error-network__title {
    margin-top: 32rpx;
    font-size: 36rpx;
    font-weight: 500;
    color: $uni-text-color;
}

.error-network__desc {
    margin-top: 16rpx;
    font-size: 28rpx;
    color: $uni-text-color-grey;
    text-align: center;
}

.error-network__btn {
    margin-top: 60rpx;
    padding: 20rpx 80rpx;
    background: $uni-color-primary;
    border-radius: 48rpx;
}

.error-network__btn-text {
    font-size: 30rpx;
    color: #ffffff;
}
</style>
