<script setup lang="ts">
import { onShow } from "@dcloudio/uni-app";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import useAppStore from "@/stores/app";
import type { MessageItem } from "@/types/index";
import { useI18n } from "vue-i18n";
import { ref } from "vue";

const { t } = useI18n();

// #ifdef MP-WEIXIN
useAuthGuard();
// #endif

// 刷新状态
const refreshing = ref(false);
// 加载状态
const loading = ref(true);
const appStore = useAppStore();
const notice = ref("");

onShow(() => {
    notice.value = appStore.push_id
        ? t("message.push_id_current", { id: appStore.push_id })
        : t("message.push_id_failed");

    // 模拟加载
    setTimeout(() => {
        loading.value = false;
    }, 1500);
});

// 消息列表
const list = ref<MessageItem[]>([
    {
        id: 1,
        title: "道一",
        note: "消息预览",
        badge: "11",
        avatar: "https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png"
    },
    {
        id: 2,
        title: "道二",
        note: "消息预览",
        badge: "12",
        avatar: "https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png"
    },
    {
        id: 3,
        title: "道三",
        note: "消息预览",
        badge: "13",
        avatar: "https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png"
    },
    {
        id: 4,
        title: "道四",
        note: "消息预览",
        badge: "14",
        avatar: "https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png"
    }
]);

// 触发刷新事件
const onListRefresh = async () => {
    refreshing.value = true;

    await new Promise(resolve => setTimeout(resolve, 1000));

    list.value = [
        {
            id: Date.now(),
            title: "新消息",
            note: "刷新出来的",
            badge: "1",
            avatar: "https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png"
        },
        ...list.value
    ] satisfies MessageItem[];

    refreshing.value = false;
};

// 列表点击事件
const handlerItemClick = (item: MessageItem) => {
    console.log("点击了消息项：", item);
    uni.navigateTo({
        url: `/subpackages/message/chat/index?id=${item.id}`
    });
};
</script>

<template>
    <view class="page">
        <!-- 头部固定 -->
        <uni-nav-bar status-bar fixed :title="t('message.title')" />
        <!-- 公告 -->
        <uni-notice-bar single :text="notice" />
        <!-- 搜索） -->
        <uni-search-bar :focus="false" :placeholder="t('message.search_placeholder')" />
        <!-- 列表区域（可滚动 + 下拉刷新） -->
        <scroll-view
            class="message__list-scroll"
            scroll-y
            refresher-enabled
            :refresher-triggered="refreshing"
            @refresherrefresh="onListRefresh">
            <!-- 骨架屏 -->
            <view v-if="loading" class="message__skeleton-list">
                <view v-for="i in 5" :key="i" class="message__skeleton-item">
                    <view class="message__skeleton-avatar">
                        <t-skeleton :row-col="[[{ width: '90rpx', height: '90rpx' }]]" />
                    </view>
                    <view class="message__skeleton-content">
                        <t-skeleton :row-col="[[{ width: '30%' }], [{ width: '55%' }]]" />
                    </view>
                </view>
            </view>
            <uni-list v-else :border="true">
                <uni-list-chat
                    v-for="item in list"
                    :key="item.id"
                    clickable
                    :title="item.title"
                    :note="item.note"
                    :badge-text="item.badge"
                    :avatar="item.avatar"
                    @click="handlerItemClick(item)" />
            </uni-list>
        </scroll-view>
    </view>
</template>

<style scoped lang="scss">
.page {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

/* 列表滚动区域 */
.message__list-scroll {
    flex: 1;
}

.message__skeleton-list {
    padding: 0;
}

.message__skeleton-item {
    display: flex;
    align-items: center;
    height: 130rpx;
    padding: 20rpx 30rpx;
    box-sizing: border-box;
}

.message__skeleton-avatar {
    flex-shrink: 0;
    margin-right: 20rpx;
}

.message__skeleton-content {
    flex: 1;
    min-width: 0;
    padding: 4rpx 0;
}
</style>
