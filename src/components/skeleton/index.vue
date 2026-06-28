<template>
    <view v-if="loading" class="skeleton" :style="{ gap: gap + 'rpx' }">
        <view
            v-for="i in rows"
            :key="i"
            class="skeleton-row"
            :style="{ gap: rowGap + 'rpx' }"
        >
            <view
                v-if="avatar"
                class="skeleton-avatar"
                :class="[avatarRound ? 'round' : '']"
                :style="{ width: avatarSize + 'rpx', height: avatarSize + 'rpx' }"
            />
            <view class="skeleton-lines" :style="{ flex: 1 }">
                <view
                    v-for="j in columns"
                    :key="j"
                    class="skeleton-line"
                    :style="{
                        height: lineHeight + 'rpx',
                        width: j === columns && columns > 1 ? '60%' : '100%'
                    }"
                />
            </view>
        </view>
    </view>
    <slot v-else />
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        loading?: boolean;
        rows?: number;
        columns?: number;
        avatar?: boolean;
        avatarSize?: number;
        avatarRound?: boolean;
        lineHeight?: number;
        gap?: number;
        rowGap?: number;
    }>(),
    {
        loading: true,
        rows: 3,
        columns: 1,
        avatar: false,
        avatarSize: 80,
        avatarRound: true,
        lineHeight: 28,
        gap: 24,
        rowGap: 16
    }
);
</script>

<style lang="scss" scoped>
.skeleton {
    display: flex;
    flex-direction: column;
    padding: 24rpx;
}

.skeleton-row {
    display: flex;
    align-items: flex-start;
}

.skeleton-avatar {
    flex-shrink: 0;
    background: #f0f0f0;
    border-radius: 8rpx;

    &.round {
        border-radius: 50%;
    }
}

.skeleton-lines {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
}

.skeleton-line {
    background: #f0f0f0;
    border-radius: 8rpx;
    animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
    0% {
        opacity: 1;
    }
    50% {
        opacity: 0.4;
    }
    100% {
        opacity: 1;
    }
}
</style>
