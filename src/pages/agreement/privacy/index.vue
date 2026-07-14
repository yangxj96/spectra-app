<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
    <view class="agreement-privacy">
        <view class="agreement-privacy__content">
            <view class="agreement-privacy__title">{{ t("agreement.privacy_title") }}</view>
            <view class="agreement-privacy__update-date">{{ t("agreement.update_date") }}</view>
            <view class="agreement-privacy__section">
                <text class="agreement-privacy__section-text">{{ t("agreement.privacy_preamble") }}</text>
            </view>
            <view class="agreement-privacy__section">
                <view class="agreement-privacy__section-title">{{ t("agreement.privacy_s1_title") }}</view>
                <text class="agreement-privacy__section-text">{{ t("agreement.privacy_s1_content") }}</text>
            </view>
            <view class="agreement-privacy__section">
                <view class="agreement-privacy__section-title">{{ t("agreement.privacy_s2_title") }}</view>
                <text class="agreement-privacy__section-text">{{ t("agreement.privacy_s2_content") }}</text>
            </view>
            <view class="agreement-privacy__section">
                <view class="agreement-privacy__section-title">{{ t("agreement.privacy_s3_title") }}</view>
                <text class="agreement-privacy__section-text">{{ t("agreement.privacy_s3_content") }}</text>
            </view>
            <view class="agreement-privacy__section">
                <view class="agreement-privacy__section-title">{{ t("agreement.privacy_s4_title") }}</view>
                <text class="agreement-privacy__section-text">{{ t("agreement.privacy_s4_content") }}</text>
            </view>
            <view class="agreement-privacy__section">
                <view class="agreement-privacy__section-title">{{ t("agreement.privacy_s5_title") }}</view>
                <text class="agreement-privacy__section-text">{{ t("agreement.privacy_s5_content") }}</text>
            </view>
            <view class="agreement-privacy__section">
                <view class="agreement-privacy__section-title">{{ t("agreement.privacy_s6_title") }}</view>
                <text class="agreement-privacy__section-text">{{ t("agreement.privacy_s6_content") }}</text>
            </view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.agreement-privacy {
    min-height: 100vh;
    background: #fff;
}

.agreement-privacy__content {
    padding: 40rpx 36rpx 60rpx;
}

.agreement-privacy__title {
    font-size: 40rpx;
    font-weight: 700;
    color: #1a1a2e;
    text-align: center;
    margin-bottom: 16rpx;
}

.agreement-privacy__update-date {
    font-size: 24rpx;
    color: #999;
    text-align: center;
    margin-bottom: 40rpx;
}

.agreement-privacy__section {
    margin-bottom: 32rpx;
}

.agreement-privacy__section-title {
    font-size: 30rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 16rpx;
}

.agreement-privacy__section-text {
    font-size: 28rpx;
    color: #555;
    line-height: 1.8;
    white-space: pre-line;
}
</style>
