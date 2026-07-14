<script setup lang="ts">
import { DEFAULT_FEATURE } from "@/config/default";
import { useI18n } from "vue-i18n";
import { ref } from "vue";

const { t } = useI18n();

interface MenuItem {
    nameKey: string;
    icon?: string;
    color?: string;
    badge?: number;
    dot?: boolean;
}

/** 常用功能 */
const commonMenus = ref<MenuItem[]>([
    { nameKey: "workbench.attendance", color: "#4a90d9", badge: 0 },
    { nameKey: "workbench.approval", color: "#f5a623", badge: 3 },
    { nameKey: "workbench.my_tasks", color: "#7ed321", badge: 5 },
    { nameKey: "workbench.schedule", color: "#50c1e9", dot: true }
]);

/** 全部功能 */
const allCategories = ref<Array<{ titleKey: string; menus: MenuItem[] }>>([
    {
        titleKey: "workbench.office_collaboration",
        menus: [
            { nameKey: "workbench.doc_center", color: "#4a90d9" },
            { nameKey: "workbench.video_meeting", color: "#4a90d9" },
            { nameKey: "workbench.announcements", color: "#f5a623", dot: true },
            { nameKey: "workbench.enterprise_email", color: "#4a90d9" },
            { nameKey: "workbench.work_report", color: "#7ed321" },
            { nameKey: "workbench.file_sharing", color: "#50c1e9" }
        ]
    },
    {
        titleKey: "workbench.hr_management",
        menus: [
            { nameKey: "workbench.leave_request", color: "#f5a623" },
            { nameKey: "workbench.reimbursement", color: "#7ed321" },
            { nameKey: "workbench.salary_query", color: "#e74c3c" },
            { nameKey: "workbench.training_center", color: "#50c1e9" }
        ]
    },
    {
        titleKey: "workbench.admin_management",
        menus: [
            { nameKey: "workbench.visitor_booking", color: "#4a90d9" },
            { nameKey: "workbench.asset_management", color: "#f5a623" },
            { nameKey: "workbench.vehicle_request", color: "#7ed321" },
            { nameKey: "workbench.meeting_room", color: "#50c1e9" },
            { nameKey: "workbench.seal_request", color: "#e74c3c" },
            { nameKey: "workbench.license_management", color: "#4a90d9" },
            { nameKey: "workbench.office_supplies", color: "#f5a623" },
            { nameKey: "workbench.contract_management", color: "#7ed321" }
        ]
    }
]);

function onMenuClick(menu: MenuItem) {
    uni.showToast({ title: t(menu.nameKey), icon: "none" });
}
</script>

<template>
    <view class="workbench">
        <uni-nav-bar status-bar fixed :title="t('workbench.title')" />

        <!-- #ifdef APP -->
        <scroll-view class="workbench__scroll-body" scroll-y>
            <!-- #endif -->

            <!-- 常用功能 -->
            <view class="workbench__section-card">
                <view class="workbench__section-header">
                    <view class="workbench__section-title-bar" />
                    <text class="workbench__section-title">{{ t("workbench.common") }}</text>
                </view>
                <view class="workbench__common-grid">
                    <view
                        v-for="(menu, i) in commonMenus"
                        :key="'c' + i"
                        class="workbench__common-item"
                        @tap="onMenuClick(menu)">
                        <view class="workbench__common-icon-box" :style="{ backgroundColor: menu.color + '18' }">
                            <image class="workbench__common-icon" :src="DEFAULT_FEATURE" mode="aspectFit" />
                        </view>
                        <text class="workbench__common-name">{{ t(menu.nameKey) }}</text>
                        <view v-if="menu.badge" class="workbench__badge-num">
                            {{ menu.badge > 99 ? "99+" : menu.badge }}
                        </view>
                        <view v-if="menu.dot" class="workbench__badge-dot" />
                    </view>
                </view>
            </view>

            <!-- 全部功能（按分类） -->
            <view v-for="(category, ci) in allCategories" :key="'cat' + ci" class="workbench__section-card">
                <view class="workbench__section-header">
                    <view class="workbench__section-title-bar" />
                    <text class="workbench__section-title">{{ t(category.titleKey) }}</text>
                </view>
                <view class="workbench__menu-grid">
                    <view
                        v-for="(menu, mi) in category.menus"
                        :key="'m' + mi"
                        class="workbench__menu-item"
                        @tap="onMenuClick(menu)">
                        <view class="workbench__menu-icon-box" :style="{ backgroundColor: menu.color + '15' }">
                            <image class="workbench__menu-icon" :src="DEFAULT_FEATURE" mode="aspectFit" />
                        </view>
                        <text class="workbench__menu-name">{{ t(menu.nameKey) }}</text>
                        <view v-if="menu.dot" class="workbench__badge-dot-menu" />
                    </view>
                </view>
            </view>

            <!-- 底部安全区 -->
            <view class="workbench__bottom-safe" />

            <!-- #ifdef APP -->
        </scroll-view>
        <!-- #endif -->
    </view>
</template>

<style lang="scss" scoped>
.workbench {
    min-height: 100vh;
    background: #f3f4f6;
}

.workbench__scroll-body {
    height: calc(100vh - 88rpx);
}

// =================================================
// 区块卡片
// =================================================
.workbench__section-card {
    background: #fff;
    margin: 20rpx 24rpx;
    border-radius: 20rpx;
    padding: 28rpx 20rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.workbench__section-header {
    display: flex;
    align-items: center;
    margin-bottom: 24rpx;
}

.workbench__section-title-bar {
    width: 6rpx;
    height: 32rpx;
    background: linear-gradient(180deg, #1a6eff, #3b82f6);
    border-radius: 3rpx;
    margin-right: 16rpx;
}

.workbench__section-title {
    font-size: 32rpx;
    font-weight: 700;
    color: #1a1a2e;
}

// =================================================
// 常用功能
// =================================================
.workbench__common-grid {
    display: flex;
    justify-content: space-around;
}

.workbench__common-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    padding: 8rpx 0;
    width: 140rpx;
}

.workbench__common-icon-box {
    width: 96rpx;
    height: 96rpx;
    border-radius: 24rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 14rpx;
}

.workbench__common-icon {
    width: 52rpx;
    height: 52rpx;
}

.workbench__common-name {
    font-size: 26rpx;
    color: #333;
    font-weight: 500;
}

.workbench__badge-num {
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

.workbench__badge-dot {
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
.workbench__menu-grid {
    display: flex;
    flex-wrap: wrap;
}

.workbench__menu-item {
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 18rpx 0;
    position: relative;
    box-sizing: border-box;
}

.workbench__menu-icon-box {
    width: 80rpx;
    height: 80rpx;
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10rpx;
}

.workbench__menu-icon {
    width: 44rpx;
    height: 44rpx;
}

.workbench__menu-name {
    font-size: 24rpx;
    color: #555;
}

.workbench__badge-dot-menu {
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
.workbench__bottom-safe {
    height: 40rpx;
}
</style>
