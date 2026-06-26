<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
    <view class="page">
        <view class="content">
            <view class="title">{{ t("agreement.user_title") }}</view>
            <view class="update-date">{{ t("agreement.update_date") }}</view>
            <view class="section">
                <text class="section-text">{{ t("agreement.user_preamble") }}</text>
            </view>
            <view class="section">
                <view class="section-title">{{ t("agreement.user_s1_title") }}</view>
                <text class="section-text">{{ t("agreement.user_s1_content") }}</text>
            </view>
            <view class="section">
                <view class="section-title">{{ t("agreement.user_s2_title") }}</view>
                <text class="section-text">{{ t("agreement.user_s2_content") }}</text>
            </view>
            <view class="section">
                <view class="section-title">{{ t("agreement.user_s3_title") }}</view>
                <text class="section-text">{{ t("agreement.user_s3_content") }}</text>
            </view>
            <view class="section">
                <view class="section-title">{{ t("agreement.user_s4_title") }}</view>
                <text class="section-text">{{ t("agreement.user_s4_content") }}</text>
            </view>
            <view class="section">
                <view class="section-title">{{ t("agreement.user_s5_title") }}</view>
                <text class="section-text">{{ t("agreement.user_s5_content") }}</text>
            </view>
            <view class="section">
                <view class="section-title">{{ t("agreement.user_s6_title") }}</view>
                <text class="section-text">{{ t("agreement.user_s6_content") }}</text>
            </view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.page {
    min-height: 100vh;
    background: #fff;
}

.content {
    padding: 40rpx 36rpx 60rpx;
}

.title {
    font-size: 40rpx;
    font-weight: 700;
    color: #1a1a2e;
    text-align: center;
    margin-bottom: 16rpx;
}

.update-date {
    font-size: 24rpx;
    color: #999;
    text-align: center;
    margin-bottom: 40rpx;
}

.section {
    margin-bottom: 32rpx;
}

.section-title {
    font-size: 30rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 16rpx;
}

.section-text {
    font-size: 28rpx;
    color: #555;
    line-height: 1.8;
    white-space: pre-line;
}
</style>
