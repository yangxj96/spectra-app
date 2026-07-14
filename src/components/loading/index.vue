<template>
    <view v-if="visible" class="loading__mask" @tap.stop>
        <view class="loading__content">
            <view class="loading__spinner">
                <view v-for="i in 3" :key="i" class="loading__dot" />
            </view>
            <text class="loading__text">{{ text }}</text>
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
.loading__mask {
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

.loading__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40rpx 60rpx;
    background: rgba(0, 0, 0, 0.75);
    border-radius: 16rpx;
}

.loading__spinner {
    display: flex;
    gap: 12rpx;
}

.loading__dot {
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

.loading__text {
    margin-top: 20rpx;
    font-size: 28rpx;
    color: #ffffff;
}
</style>
