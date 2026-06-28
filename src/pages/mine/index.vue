<script setup lang="ts">
import { DEFAULT_AVATAR } from "@/config/default";
import useAppStore from "@/stores/app";
import { useI18n } from "vue-i18n";
import { ref } from "vue";

const { t } = useI18n();
const appStore = useAppStore();

const userAvatar = ref("/static/example/avatar.jpg");

// 头像加载失败回调
const handleAvatarError = () => {
    userAvatar.value = DEFAULT_AVATAR;
};

/** 退出登录 */
function handleLogout() {
    uni.showModal({
        title: t("common.tip"),
        content: t("mine.logout_confirm"),
        confirmText: t("mine.logout_action"),
        cancelText: t("common.cancel"),
        success(res) {
            if (res.confirm) {
                appStore.clearAuth();
                uni.showToast({ title: t("mine.logout_success"), icon: "success" });
                setTimeout(() => {
                    uni.reLaunch({ url: "/pages/login/index" });
                }, 500);
            }
        }
    });
}
</script>

<template>
    <uni-nav-bar status-bar fixed title="" />

    <view class="header-box">
        <uni-row>
            <uni-col :span="8" style="height: 100%; display: flex; justify-content: center; align-items: center">
                <t-avatar :image="userAvatar" shape="round" size="200rpx" @error="handleAvatarError" />
            </uni-col>
            <uni-col :span="16" style="padding-left: 12rpx">
                <uni-row style="margin-top: 20rpx">
                    <text style="font-size: 40rpx">{{ t("app.name") }}</text>
                </uni-row>
                <uni-row style="margin-top: 20rpx">
                    <text style="font-size: 32rpx; color: #666">{{ t("mine.wechat_id", { id: "xxxxxxx" }) }}</text>
                </uni-row>
                <uni-row style="margin-top: 20rpx">
                    <text style="font-size: 32rpx; color: #666">{{ t("mine.status_label", { status: t("mine.status_none") }) }}</text>
                </uni-row>
            </uni-col>
        </uni-row>
    </view>

    <!-- #ifdef APP -->
    <scroll-view style="flex: 1">
        <!-- #endif -->
        <view class="features-group">
            <t-cell-group>
                <t-cell :title="t('mine.service')" hover arrow>
                    <template #left-icon>
                        <t-icon prefix="icons" name="service" color="#48B0EB" size="48rpx" />
                    </template>
                </t-cell>
            </t-cell-group>
        </view>

        <view class="features-group">
            <t-cell-group>
                <t-cell :title="t('mine.favorites')" hover arrow>
                    <template #left-icon>
                        <t-icon prefix="icons" name="collect" color="#FED547" size="48rpx" />
                    </template>
                </t-cell>
            </t-cell-group>
        </view>

        <view class="features-group">
            <t-cell-group>
                <t-cell :title="t('mine.settings')" hover arrow>
                    <template #left-icon>
                        <t-icon prefix="icons" name="settings" color="#38A65A" size="48rpx" />
                    </template>
                </t-cell>
            </t-cell-group>
        </view>

        <!-- 退出登录 -->
        <view class="features-group">
            <t-cell-group>
                <t-cell hover @click="handleLogout">
                    <template #title>
                        <text style="color: #e74c3c; text-align: center; width: 100%;">{{ t("mine.logout") }}</text>
                    </template>
                </t-cell>
            </t-cell-group>
        </view>
        <!-- #ifdef APP -->
    </scroll-view>
    <!-- #endif -->
</template>

<style lang="scss">
page {
    background-color: #f1f0f0;
}
</style>

<style lang="scss" scoped>
.header-box {
    height: 240rpx;
    background-color: white;
    padding-left: 20rpx;
    padding-right: 20rpx;
    padding-top: 20rpx;
}

// 去除导航栏底部边框
:deep(.uni-navbar--border) {
    border-bottom-style: none !important;
}

.features-group {
    margin-top: 20rpx;
    background-color: white;
}
</style>
