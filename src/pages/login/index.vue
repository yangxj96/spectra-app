<script setup lang="ts">
import { DEV_MODE, STORAGE_KEY_TOKEN } from "@/config/env";
import { getCaptcha, login } from "@/services/api/auth";
import useAppStore from "@/stores/app";
import type { LoginResponseData } from "@/types";
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const appStore = useAppStore();

/** 登录成功后跳转的目标路径 */
const redirect = ref("");

/** 登录表单 */
const form = ref({
    username: DEV_MODE ? "devops@devops00.com" : "",
    password: DEV_MODE ? "admin123" : "",
    captcha: DEV_MODE ? "1" : ""
});

/** 密码可见性 */
const passwordVisible = ref(false);

/** 同意协议 */
const agreeProtocol = ref(false);

/** 登录按钮 loading 状态 */
const isLoggingIn = ref(false);

onLoad((options: any) => {
    if (options.redirect) {
        redirect.value = decodeURIComponent(options.redirect);
    }
});

/** 验证码图片 */
const captchaImage = ref("");

/** 验证码 key */
const captchaKey = ref("");

async function refreshCaptcha() {
    try {
        const result = await getCaptcha();
        captchaImage.value = result.image;
        captchaKey.value = result.key;
    } catch (_e) {
        uni.showToast({ title: t("login.captcha_load_failed"), icon: "none" });
    }
}

refreshCaptcha();

function togglePassword() {
    passwordVisible.value = !passwordVisible.value;
}

async function handleLogin() {
    if (!form.value.username) {
        uni.showToast({ title: t("login.error_empty_username"), icon: "none" });
        return;
    }
    if (!form.value.password) {
        uni.showToast({ title: t("login.error_empty_password"), icon: "none" });
        return;
    }
    if (!form.value.captcha) {
        uni.showToast({ title: t("login.error_empty_captcha"), icon: "none" });
        return;
    }
    if (!agreeProtocol.value) {
        uni.showToast({ title: t("login.error_agree_protocol"), icon: "none" });
        return;
    }

    if (isLoggingIn.value) return;
    isLoggingIn.value = true;

    try {
        const result = await login({
            type: "PASSWORD",
            username: form.value.username,
            password: form.value.password,
            captcha: form.value.captcha,
            captchaKey: captchaKey.value
        });
        handleLoginSuccess(result);
    } catch (err: any) {
        uni.showToast({ title: err.msg || t("login.failed"), icon: "none" });
    } finally {
        isLoggingIn.value = false;
    }
}

function handleLoginSuccess(result: LoginResponseData) {
    uni.setStorageSync(STORAGE_KEY_TOKEN, result.access_token);
    appStore.setToken(result.access_token);
    appStore.setUser({ id: result.id, username: result.username });

    uni.showToast({ title: t("login.success"), icon: "success" });

    setTimeout(() => {
        const target = redirect.value || "/pages/message/index";
        if (
            target.startsWith("/pages/message") ||
            target.startsWith("/pages/contacts") ||
            target.startsWith("/pages/workbench") ||
            target.startsWith("/pages/mine")
        ) {
            uni.switchTab({ url: target });
        } else {
            uni.reLaunch({ url: target });
        }
    }, 500);
}

function goAgreement(type: "user" | "privacy") {
    // 登录中不允许跳转，防止与登录按钮事件冲突
    if (isLoggingIn.value) return;
    const url = type === "user" ? "/pages/agreement/user/index" : "/pages/agreement/privacy/index";
    uni.navigateTo({ url });
}

function showComingSoon(feature: string) {
    uni.showModal({
        title: t("common.tip"),
        content: t("common.coming_soon", { feature }),
        showCancel: false,
        confirmText: t("common.got_it")
    });
}
</script>

<template>
    <view class="login-page">
        <!-- 顶部品牌区 -->
        <view class="brand-section">
            <view class="brand-logo">
                <image class="logo-img" src="/static/logo.png" mode="aspectFit" />
            </view>
            <view class="brand-name">{{ t("app.name") }}</view>
            <view class="brand-subtitle">{{ t("login.brand_slogan") }}</view>
        </view>

        <!-- 表单卡片区 -->
        <view class="form-card">
            <!-- 欢迎语 -->
            <view class="form-header">
                <text class="form-title">{{ t("login.welcome_back") }}</text>
                <text class="form-desc">{{ t("login.welcome_desc") }}</text>
            </view>

            <!-- 用户名 -->
            <view class="input-group">
                <view class="input-icon">
                    <text class="icon-text">👤</text>
                </view>
                <input
                    v-model="form.username"
                    class="input-field"
                    :placeholder="t('login.placeholder_username')"
                    placeholder-style="color: #bbb; font-size: 28rpx;" />
            </view>

            <!-- 密码 -->
            <view class="input-group">
                <view class="input-icon">
                    <text class="icon-text">🔒</text>
                </view>
                <input
                    v-model="form.password"
                    class="input-field"
                    :password="!passwordVisible"
                    :placeholder="t('login.placeholder_password')"
                    placeholder-style="color: #bbb; font-size: 28rpx;" />
                <view class="input-suffix" @click="togglePassword">
                    <text>{{ passwordVisible ? "🙈" : "👁️" }}</text>
                </view>
            </view>

            <!-- 验证码 -->
            <view class="input-group">
                <view class="input-icon">
                    <text class="icon-text">🛡️</text>
                </view>
                <input
                    v-model="form.captcha"
                    class="input-field"
                    :placeholder="t('login.placeholder_captcha')"
                    placeholder-style="color: #bbb; font-size: 28rpx;"
                    maxlength="4" />
                <view class="captcha-img-wrap" @tap.stop="refreshCaptcha">
                    <image v-if="captchaImage" class="captcha-img" :src="captchaImage" mode="aspectFit" />
                </view>
            </view>

            <!-- 协议勾选 -->
            <view class="protocol-row">
                <view class="checkbox" :class="{ checked: agreeProtocol }" @tap="agreeProtocol = !agreeProtocol">
                    <text v-if="agreeProtocol" class="check-icon">✓</text>
                </view>
                <text class="protocol-text">{{ t("login.protocol_agree") }}</text>
                <view class="protocol-link" @tap="goAgreement('user')">{{ t("login.protocol_user") }}</view>
                <text class="protocol-text">{{ t("login.protocol_and") }}</text>
                <view class="protocol-link" @tap="goAgreement('privacy')">{{ t("login.protocol_privacy") }}</view>
            </view>

            <!-- 登录按钮 -->
            <button class="login-btn" :disabled="isLoggingIn" @tap="handleLogin">
                <text v-if="!isLoggingIn">{{ t("login.submit") }}</text>
                <view v-else class="loading-row">
                    <text class="loading-icon">⏳</text>
                    <text>{{ t("login.submitting") }}</text>
                </view>
            </button>

            <!-- 底部链接 -->
            <view class="form-footer">
                <view class="footer-link" @tap.stop="showComingSoon(t('login.forgot_password'))">
                    <text>{{ t("login.forgot_password") }}</text>
                </view>
                <text class="footer-divider">|</text>
                <view class="footer-link" @tap.stop="showComingSoon(t('login.register'))">
                    <text>{{ t("login.register") }}</text>
                </view>
            </view>
        </view>

        <!-- 底部版本信息 -->
        <view class="version-info">
            <text>v1.0.0</text>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.login-page {
    min-height: 100vh;
    background: linear-gradient(160deg, #1a6eff 0%, #3b82f6 30%, #60a5fa 60%, #93c5fd 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
}

// =================================================
// 品牌区
// =================================================
.brand-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 100rpx;
    padding-bottom: 60rpx;
}

.brand-logo {
    width: 120rpx;
    height: 120rpx;
    border-radius: 28rpx;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.12);
}

.logo-img {
    width: 76rpx;
    height: 76rpx;
}

.brand-name {
    margin-top: 24rpx;
    font-size: 44rpx;
    font-weight: 700;
    color: #fff;
    letter-spacing: 8rpx;
}

.brand-subtitle {
    margin-top: 10rpx;
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.8);
    letter-spacing: 4rpx;
}

// =================================================
// 表单卡片
// =================================================
.form-card {
    width: calc(100% - 48rpx);
    background: #fff;
    border-radius: 48rpx;
    padding: 60rpx 48rpx 40rpx;
    margin: 0 24rpx;
    box-sizing: border-box;
}

.form-header {
    margin-bottom: 48rpx;
}

.form-title {
    display: block;
    font-size: 40rpx;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 12rpx;
}

.form-desc {
    font-size: 26rpx;
    color: #999;
}

// =================================================
// 输入框
// =================================================
.input-group {
    display: flex;
    align-items: center;
    height: 100rpx;
    background: #f5f7fa;
    border-radius: 20rpx;
    padding: 0 24rpx;
    margin-bottom: 24rpx;
    transition: background 0.2s;

    &:focus-within {
        background: #eef2ff;
    }
}

.input-icon {
    width: 56rpx;
    height: 56rpx;
    border-radius: 16rpx;
    background: #e8edf5;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20rpx;
    flex-shrink: 0;
}

.icon-text {
    font-size: 28rpx;
}

.input-field {
    flex: 1;
    height: 100%;
    font-size: 28rpx;
    color: #333;
}

.input-suffix {
    padding: 12rpx;
    font-size: 28rpx;
    opacity: 0.5;

    &:active {
        opacity: 1;
    }
}

// =================================================
// 图形验证码
// =================================================
.captcha-img-wrap {
    width: 180rpx;
    height: 60rpx;
    flex-shrink: 0;
    margin-left: 16rpx;
    border-radius: 12rpx;
    overflow: hidden;
    background: #f5f6f8;
    display: flex;
    align-items: center;
    justify-content: center;
}

.captcha-img {
    width: 100%;
    height: 100%;
}

// =================================================
// 协议
// =================================================
.protocol-row {
    display: flex;
    align-items: center;
    margin: 32rpx 0;
}

.checkbox {
    width: 36rpx;
    height: 36rpx;
    border-radius: 50%;
    border: 2rpx solid #d0d5dd;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12rpx;
    flex-shrink: 0;
    transition: all 0.2s;

    &.checked {
        background: #1a6eff;
        border-color: #1a6eff;
    }
}

.check-icon {
    color: #fff;
    font-size: 22rpx;
    font-weight: bold;
}

.protocol-text {
    font-size: 24rpx;
    color: #999;
    line-height: 1.5;
}

.protocol-link {
    color: #1a6eff;
    display: inline-block;
    padding: 4rpx 0;
}

// =================================================
// 登录按钮
// =================================================
.login-btn {
    width: 100%;
    height: 96rpx;
    background: linear-gradient(135deg, #1a6eff, #3b82f6);
    border-radius: 48rpx;
    color: #fff;
    font-size: 32rpx;
    font-weight: 600;
    letter-spacing: 8rpx;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 16rpx;
    box-shadow: 0 8rpx 24rpx rgba(26, 110, 255, 0.35);
    transition: opacity 0.2s;

    &:active {
        opacity: 0.85;
    }

    &[disabled] {
        opacity: 0.7;
        box-shadow: none;
    }
}

.loading-row {
    display: flex;
    align-items: center;
    gap: 12rpx;
}

.loading-icon {
    font-size: 28rpx;
}

// =================================================
// 底部链接
// =================================================
.form-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 40rpx;
    gap: 24rpx;
}

.footer-link {
    font-size: 26rpx;
    color: #1a6eff;
    display: inline;
}

.footer-divider {
    color: #ddd;
    font-size: 24rpx;
}

// =================================================
// 版本号
// =================================================
.version-info {
    margin-top: auto;
    padding: 24rpx 0 40rpx;
    width: 100%;
    text-align: center;
    font-size: 22rpx;
    color: rgba(255, 255, 255, 0.5);
}
</style>
