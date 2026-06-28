<template>
    <view v-if="visible" class="loading-mask" @tap.stop>
        <view class="loading-content">
            <view class="loading-spinner">
                <view v-for="i in 3" :key="i" class="dot" />
            </view>
            <text class="loading-text">{{ text }}</text>
        </view>
    </view>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        visible?: boolean;
        text?: string;
    }>(),
    {
        visible: false,
        text: "加载中..."
    }
);
</script>

<style lang="scss" scoped>
.loading-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.45);
    z-index: 999;
}

.loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40rpx 60rpx;
    background: rgba(0, 0, 0, 0.75);
    border-radius: 16rpx;
}

.loading-spinner {
    display: flex;
    gap: 12rpx;
}

.dot {
    width: 16rpx;
    height: 16rpx;
    border-radius: 50%;
    background: #ffffff;
    animation: bounce 1.2s infinite ease-in-out;

    &:nth-child(1) {
        animation-delay: -0.32s;
    }

    &:nth-child(2) {
        animation-delay: -0.16s;
    }
}

@keyframes bounce {
    0%,
    80%,
    100% {
        transform: scale(0);
    }
    40% {
        transform: scale(1);
    }
}

.loading-text {
    margin-top: 20rpx;
    font-size: 28rpx;
    color: #ffffff;
}
</style>
