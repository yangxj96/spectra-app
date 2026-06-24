<script setup lang="ts">
import { DEFAULT_FEATURE } from "@/config/default";
import { ref } from "vue";

interface MenuItem {
    name: string;
    icon?: string;
    color?: string;
    badge?: number;
    dot?: boolean;
}

/** 常用功能 */
const commonMenus = ref<MenuItem[]>([
    { name: "考勤打卡", color: "#4a90d9", badge: 0 },
    { name: "流程审批", color: "#f5a623", badge: 3 },
    { name: "我的任务", color: "#7ed321", badge: 5 },
    { name: "日程管理", color: "#50c1e9", dot: true }
]);

/** 全部功能 */
const allCategories = ref<Array<{ title: string; menus: MenuItem[] }>>([
    {
        title: "办公协作",
        menus: [
            { name: "文档中心", color: "#4a90d9" },
            { name: "视频会议", color: "#4a90d9" },
            { name: "公告通知", color: "#f5a623", dot: true },
            { name: "企业邮箱", color: "#4a90d9" },
            { name: "工作报告", color: "#7ed321" },
            { name: "文件共享", color: "#50c1e9" }
        ]
    },
    {
        title: "人事管理",
        menus: [
            { name: "请假申请", color: "#f5a623" },
            { name: "报销申请", color: "#7ed321" },
            { name: "薪资查询", color: "#e74c3c" },
            { name: "培训中心", color: "#50c1e9" }
        ]
    },
    {
        title: "行政管理",
        menus: [
            { name: "访客预约", color: "#4a90d9" },
            { name: "资产管理", color: "#f5a623" },
            { name: "用车申请", color: "#7ed321" },
            { name: "会议室预定", color: "#50c1e9" },
            { name: "印章申请", color: "#e74c3c" },
            { name: "证照管理", color: "#4a90d9" },
            { name: "办公用品", color: "#f5a623" },
            { name: "合同管理", color: "#7ed321" }
        ]
    }
]);

function onMenuClick(menu: MenuItem) {
    uni.showToast({ title: menu.name, icon: "none" });
}
</script>

<template>
    <view class="page">
        <uni-nav-bar statusBar fixed title="工作台" />

        <!-- #ifdef APP -->
        <scroll-view class="scroll-body" scroll-y>
            <!-- #endif -->

            <!-- 常用功能 -->
            <view class="section-card">
                <view class="section-header">
                    <view class="section-title-bar" />
                    <text class="section-title">常用</text>
                </view>
                <view class="common-grid">
                    <view
                        v-for="(menu, i) in commonMenus"
                        :key="'c' + i"
                        class="common-item"
                        @tap="onMenuClick(menu)">
                        <view class="common-icon-box" :style="{ backgroundColor: menu.color + '18' }">
                            <image class="common-icon" :src="DEFAULT_FEATURE" mode="aspectFit" />
                        </view>
                        <text class="common-name">{{ menu.name }}</text>
                        <view v-if="menu.badge" class="badge-num">{{ menu.badge > 99 ? '99+' : menu.badge }}</view>
                        <view v-if="menu.dot" class="badge-dot" />
                    </view>
                </view>
            </view>

            <!-- 全部功能（按分类） -->
            <view v-for="(category, ci) in allCategories" :key="'cat' + ci" class="section-card">
                <view class="section-header">
                    <view class="section-title-bar" />
                    <text class="section-title">{{ category.title }}</text>
                </view>
                <view class="menu-grid">
                    <view
                        v-for="(menu, mi) in category.menus"
                        :key="'m' + mi"
                        class="menu-item"
                        @tap="onMenuClick(menu)">
                        <view class="menu-icon-box" :style="{ backgroundColor: menu.color + '15' }">
                            <image class="menu-icon" :src="DEFAULT_FEATURE" mode="aspectFit" />
                        </view>
                        <text class="menu-name">{{ menu.name }}</text>
                        <view v-if="menu.dot" class="badge-dot-menu" />
                    </view>
                </view>
            </view>

            <!-- 底部安全区 -->
            <view class="bottom-safe" />

            <!-- #ifdef APP -->
        </scroll-view>
        <!-- #endif -->
    </view>
</template>

<style lang="scss" scoped>
.page {
    min-height: 100vh;
    background: #f3f4f6;
}

.scroll-body {
    height: calc(100vh - 88rpx);
}

// =================================================
// 区块卡片
// =================================================
.section-card {
    background: #fff;
    margin: 20rpx 24rpx;
    border-radius: 20rpx;
    padding: 28rpx 20rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.section-header {
    display: flex;
    align-items: center;
    margin-bottom: 24rpx;
}

.section-title-bar {
    width: 6rpx;
    height: 32rpx;
    background: linear-gradient(180deg, #1a6eff, #3b82f6);
    border-radius: 3rpx;
    margin-right: 16rpx;
}

.section-title {
    font-size: 32rpx;
    font-weight: 700;
    color: #1a1a2e;
}

// =================================================
// 常用功能
// =================================================
.common-grid {
    display: flex;
    justify-content: space-around;
}

.common-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    padding: 8rpx 0;
    width: 140rpx;
}

.common-icon-box {
    width: 96rpx;
    height: 96rpx;
    border-radius: 24rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 14rpx;
}

.common-icon {
    width: 52rpx;
    height: 52rpx;
}

.common-name {
    font-size: 26rpx;
    color: #333;
    font-weight: 500;
}

.badge-num {
    position: absolute;
    top: 0;
    right: 16rpx;
    min-width: 32rpx;
    height: 32rpx;
    line-height: 32rpx;
    text-align: center;
    background: #e74c3c;
    color: #fff;
    font-size: 20rpx;
    border-radius: 16rpx;
    padding: 0 8rpx;
}

.badge-dot {
    position: absolute;
    top: 4rpx;
    right: 20rpx;
    width: 16rpx;
    height: 16rpx;
    background: #e74c3c;
    border-radius: 50%;
    border: 2rpx solid #fff;
}

// =================================================
// 全部功能网格
// =================================================
.menu-grid {
    display: flex;
    flex-wrap: wrap;
}

.menu-item {
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 18rpx 0;
    position: relative;
    box-sizing: border-box;
}

.menu-icon-box {
    width: 80rpx;
    height: 80rpx;
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10rpx;
}

.menu-icon {
    width: 44rpx;
    height: 44rpx;
}

.menu-name {
    font-size: 24rpx;
    color: #555;
}

.badge-dot-menu {
    position: absolute;
    top: 14rpx;
    right: 16rpx;
    width: 14rpx;
    height: 14rpx;
    background: #e74c3c;
    border-radius: 50%;
}

// =================================================
// 底部
// =================================================
.bottom-safe {
    height: 40rpx;
}
</style>
