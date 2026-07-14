<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
    <view class="agreement-user">
        <view class="agreement-user__content">
            <view class="agreement-user__title">{{ t("agreement.user_title") }}</view>
            <view class="agreement-user__update-date">{{ t("agreement.update_date") }}</view>
            <view class="agreement-user__section">
                <text class="agreement-user__section-text">{{ t("agreement.user_preamble") }}</text>
            </view>
            <view class="agreement-user__section">
                <view class="agreement-user__section-title">{{ t("agreement.user_s1_title") }}</view>
                <text class="agreement-user__section-text">{{ t("agreement.user_s1_content") }}</text>
            </view>
            <view class="agreement-user__section">
                <view class="agreement-user__section-title">{{ t("agreement.user_s2_title") }}</view>
                <text class="agreement-user__section-text">{{ t("agreement.user_s2_content") }}</text>
            </view>
            <view class="agreement-user__section">
                <view class="agreement-user__section-title">{{ t("agreement.user_s3_title") }}</view>
                <text class="agreement-user__section-text">{{ t("agreement.user_s3_content") }}</text>
            </view>
            <view class="agreement-user__section">
                <view class="agreement-user__section-title">{{ t("agreement.user_s4_title") }}</view>
                <text class="agreement-user__section-text">{{ t("agreement.user_s4_content") }}</text>
            </view>
            <view class="agreement-user__section">
                <view class="agreement-user__section-title">{{ t("agreement.user_s5_title") }}</view>
                <text class="agreement-user__section-text">{{ t("agreement.user_s5_content") }}</text>
            </view>
            <view class="agreement-user__section">
                <view class="agreement-user__section-title">{{ t("agreement.user_s6_title") }}</view>
                <text class="agreement-user__section-text">{{ t("agreement.user_s6_content") }}</text>
            </view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.agreement-user {
    min-height: 100vh;
    background: #fff;
}

.agreement-user__content {
    padding: 40rpx 36rpx 60rpx;
}

.agreement-user__title {
    font-size: 40rpx;
    font-weight: 700;
    color: #1a1a2e;
    text-align: center;
    margin-bottom: 16rpx;
}

.agreement-user__update-date {
    font-size: 24rpx;
    color: #999;
    text-align: center;
    margin-bottom: 40rpx;
}

.agreement-user__section {
    margin-bottom: 32rpx;
}

.agreement-user__section-title {
    font-size: 30rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 16rpx;
}

.agreement-user__section-text {
    font-size: 28rpx;
    color: #555;
    line-height: 1.8;
    white-space: pre-line;
}
</style>
