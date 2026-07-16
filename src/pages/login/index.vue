<script setup lang="ts">
import { DEV_MODE, STORAGE_KEY_REFRESH_TOKEN, STORAGE_KEY_TOKEN } from "@/config/env";
import { login } from "@/services/api/auth";
import { getCaptcha, sendEmailCode, sendSmsCode } from "@/services/api/captcha";
import useAppStore from "@/stores/app";
import type { LoginResponseData, LoginType } from "@/types";
import { onLoad } from "@dcloudio/uni-app";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const STORAGE_KEY_LOGIN_TYPE = "login_type";
const STORAGE_KEY_AGREE_PROTOCOL = "agree_protocol";

const { t } = useI18n();
const appStore = useAppStore();

/** 登录成功后跳转的目标路径 */
const redirect = ref("");

/** 登录类型 */
const loginType = ref<LoginType>((uni.getStorageSync(STORAGE_KEY_LOGIN_TYPE) as LoginType) || "PASSWORD");

/** 开发模式默认值 */
const devUsername = loginType.value === "SMS" ? "13312344321" : "devops@devops00.com";

/** 登录表单 */
const form = ref({
    username: DEV_MODE ? devUsername : "",
    password: DEV_MODE ? "admin123" : "",
    captcha: DEV_MODE ? "1" : "",
    code: ""
});

/** 密码可见性 */
const passwordVisible = ref(false);

/** 同意协议 */
const agreeProtocol = ref(uni.getStorageSync(STORAGE_KEY_AGREE_PROTOCOL) === "true");

/** 登录按钮 loading 状态 */
const isLoggingIn = ref(false);

/** 倒计时 */
const countdown = ref(0);
let countdownTimer: ReturnType<typeof setInterval> | null = null;

/** 验证码图片 */
const captchaImage = ref("");

/** 验证码 key */
const captchaKey = ref("");

/** 当前是否密码模式 */
const isPasswordMode = computed(() => loginType.value === "PASSWORD");

/** 倒计时文本 */
const countdownText = computed(() => {
    if (countdown.value > 0) return `${countdown.value}s`;
    if (loginType.value === "SMS") return t("login.send_code");
    if (loginType.value === "EMAIL") return t("login.send_code");
    return "";
});

watch(loginType, val => {
    uni.setStorageSync(STORAGE_KEY_LOGIN_TYPE, val);
});

watch(agreeProtocol, val => {
    uni.setStorageSync(STORAGE_KEY_AGREE_PROTOCOL, String(val));
});

onLoad((options: Record<string, string | undefined>) => {
    if (options.redirect) {
        redirect.value = decodeURIComponent(options.redirect);
    }
});

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

function switchType(type: LoginType) {
    loginType.value = type;
    form.value.code = "";
    if (DEV_MODE) {
        form.value.username = type === "SMS" ? "13312344321" : "devops@devops00.com";
    }
}

async function handleSendCode() {
    const target = loginType.value === "SMS" ? form.value.username : form.value.username;
    if (!target) {
        uni.showToast({
            title: t(loginType.value === "SMS" ? "login.error_empty_phone" : "login.error_empty_email"),
            icon: "none"
        });
        return;
    }
    if (loginType.value === "SMS" && !/^1\d{10}$/.test(target)) {
        uni.showToast({ title: t("login.error_invalid_phone"), icon: "none" });
        return;
    }
    if (loginType.value === "EMAIL" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(target)) {
        uni.showToast({ title: t("login.error_invalid_email"), icon: "none" });
        return;
    }

    startCountdown();

    try {
        if (loginType.value === "SMS") {
            await sendSmsCode(target);
        } else {
            await sendEmailCode(target);
        }
        uni.showToast({ title: t("login.code_sent"), icon: "success" });
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        uni.showToast({ title: msg || t("login.code_send_failed"), icon: "none" });
    }
}

function startCountdown() {
    countdown.value = 60;
    if (countdownTimer) clearInterval(countdownTimer);
    countdownTimer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
            clearInterval(countdownTimer!);
            countdownTimer = null;
        }
    }, 1000);
}

async function handleLogin() {
    if (!form.value.username) {
        uni.showToast({ title: t("login.error_empty_username"), icon: "none" });
        return;
    }
    if (loginType.value === "PASSWORD") {
        if (!form.value.password) {
            uni.showToast({ title: t("login.error_empty_password"), icon: "none" });
            return;
        }
        if (!form.value.captcha) {
            uni.showToast({ title: t("login.error_empty_captcha"), icon: "none" });
            return;
        }
    } else {
        if (!form.value.code) {
            uni.showToast({ title: t("login.error_empty_code"), icon: "none" });
            return;
        }
    }
    if (!agreeProtocol.value) {
        uni.showToast({ title: t("login.error_agree_protocol"), icon: "none" });
        return;
    }

    if (isLoggingIn.value) return;
    isLoggingIn.value = true;

    try {
        let result: LoginResponseData;
        if (loginType.value === "PASSWORD") {
            result = await login({
                type: "PASSWORD",
                username: form.value.username,
                password: form.value.password,
                captcha: form.value.captcha,
                captchaKey: captchaKey.value
            });
        } else if (loginType.value === "SMS") {
            result = await login({
                type: "SMS",
                username: form.value.username,
                sms_code: form.value.code
            });
        } else {
            result = await login({
                type: "EMAIL",
                username: form.value.username,
                email_code: form.value.code
            });
        }
        handleLoginSuccess(result);
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        uni.showToast({ title: msg || t("login.failed"), icon: "none" });
    } finally {
        isLoggingIn.value = false;
    }
}

function handleLoginSuccess(result: LoginResponseData) {
    uni.setStorageSync(STORAGE_KEY_TOKEN, result.access_token);
    uni.setStorageSync(STORAGE_KEY_REFRESH_TOKEN, result.refresh_token);
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
    <view class="login">
        <!-- 顶部品牌区 -->
        <view class="login__brand-section">
            <view class="login__brand-logo">
                <image class="login__logo-img" src="/static/logo.png" mode="aspectFit" />
            </view>
            <view class="login__brand-name">{{ t("app.name") }}</view>
            <view class="login__brand-subtitle">{{ t("login.brand_slogan") }}</view>
        </view>

        <!-- 表单卡片区 -->
        <view class="login__form-card">
            <!-- 欢迎语 -->
            <view class="login__form-header">
                <text class="login__form-title">{{ t("login.welcome_back") }}</text>
                <text class="login__form-desc">{{ t("login.welcome_desc") }}</text>
            </view>

            <!-- 登录方式切换 -->
            <view class="login__type-tabs">
                <view
                    class="login__type-tab"
                    :class="{ 'login__type-tab--active': loginType === 'PASSWORD' }"
                    @tap="switchType('PASSWORD')">
                    <text>{{ t("login.type_password") }}</text>
                </view>
                <view
                    class="login__type-tab"
                    :class="{ 'login__type-tab--active': loginType === 'SMS' }"
                    @tap="switchType('SMS')">
                    <text>{{ t("login.type_sms") }}</text>
                </view>
                <view
                    class="login__type-tab"
                    :class="{ 'login__type-tab--active': loginType === 'EMAIL' }"
                    @tap="switchType('EMAIL')">
                    <text>{{ t("login.type_email") }}</text>
                </view>
            </view>

            <!-- 账号输入 -->
            <view class="login__input-group">
                <view class="login__input-icon">
                    <text class="login__icon-text">{{ loginType === "SMS" ? "📱" : "👤" }}</text>
                </view>
                <input
                    v-model="form.username"
                    class="login__input-field"
                    :placeholder="
                        loginType === 'SMS'
                            ? t('login.placeholder_phone')
                            : loginType === 'EMAIL'
                              ? t('login.placeholder_email')
                              : t('login.placeholder_username')
                    "
                    placeholder-style="color: #bbb; font-size: 28rpx;" />
            </view>

            <!-- 密码模式 -->
            <template v-if="isPasswordMode">
                <view class="login__input-group">
                    <view class="login__input-icon">
                        <text class="login__icon-text">🔒</text>
                    </view>
                    <input
                        v-model="form.password"
                        class="login__input-field"
                        :password="!passwordVisible"
                        :placeholder="t('login.placeholder_password')"
                        placeholder-style="color: #bbb; font-size: 28rpx;" />
                    <view class="login__input-suffix" @click="togglePassword">
                        <text>{{ passwordVisible ? "🙈" : "👁️" }}</text>
                    </view>
                </view>

                <view class="login__input-group">
                    <view class="login__input-icon">
                        <text class="login__icon-text">🛡️</text>
                    </view>
                    <input
                        v-model="form.captcha"
                        class="login__input-field"
                        :placeholder="t('login.placeholder_captcha')"
                        placeholder-style="color: #bbb; font-size: 28rpx;"
                        maxlength="4" />
                    <view class="login__captcha-img-wrap" @tap.stop="refreshCaptcha">
                        <image v-if="captchaImage" class="login__captcha-img" :src="captchaImage" mode="aspectFit" />
                    </view>
                </view>
            </template>

            <!-- 验证码模式 -->
            <template v-else>
                <view class="login__input-group">
                    <view class="login__input-icon">
                        <text class="login__icon-text">🔑</text>
                    </view>
                    <input
                        v-model="form.code"
                        class="login__input-field"
                        :placeholder="t('login.placeholder_code')"
                        placeholder-style="color: #bbb; font-size: 28rpx;"
                        maxlength="6"
                        type="number" />
                    <view
                        class="login__code-btn"
                        :class="{ 'login__code-btn--disabled': countdown > 0 }"
                        @tap="countdown > 0 ? undefined : handleSendCode()">
                        <text>{{ countdownText }}</text>
                    </view>
                </view>
            </template>

            <!-- 协议勾选 -->
            <view class="login__protocol-row">
                <view
                    class="login__checkbox"
                    :class="{ 'login__checkbox--checked': agreeProtocol }"
                    @tap="agreeProtocol = !agreeProtocol">
                    <text v-if="agreeProtocol" class="login__check-icon">✓</text>
                </view>
                <text class="login__protocol-text">{{ t("login.protocol_agree") }}</text>
                <view class="login__protocol-link" @tap="goAgreement('user')">{{ t("login.protocol_user") }}</view>
                <text class="login__protocol-text">{{ t("login.protocol_and") }}</text>
                <view class="login__protocol-link" @tap="goAgreement('privacy')">
                    {{ t("login.protocol_privacy") }}
                </view>
            </view>

            <!-- 登录按钮 -->
            <button class="login__btn" :disabled="isLoggingIn" @tap="handleLogin">
                <text v-if="!isLoggingIn">{{ t("login.submit") }}</text>
                <view v-else class="login__loading-row">
                    <text class="login__loading-icon">⏳</text>
                    <text>{{ t("login.submitting") }}</text>
                </view>
            </button>

            <!-- 底部链接 -->
            <view class="login__form-footer">
                <view class="login__footer-link" @tap.stop="showComingSoon(t('login.forgot_password'))">
                    <text>{{ t("login.forgot_password") }}</text>
                </view>
                <text class="login__footer-divider">|</text>
                <view class="login__footer-link" @tap.stop="showComingSoon(t('login.register'))">
                    <text>{{ t("login.register") }}</text>
                </view>
            </view>
        </view>

        <!-- 底部版本信息 -->
        <view class="login__version-info">
            <text>v1.0.0</text>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.login {
    min-height: 100vh;
    background: linear-gradient(160deg, #1a6eff 0%, #3b82f6 30%, #60a5fa 60%, #93c5fd 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
}

// =================================================
// 品牌区
// =================================================
.login__brand-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 100rpx;
    padding-bottom: 60rpx;
}

.login__brand-logo {
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

.login__logo-img {
    width: 76rpx;
    height: 76rpx;
}

.login__brand-name {
    margin-top: 24rpx;
    font-size: 44rpx;
    font-weight: 700;
    color: #fff;
    letter-spacing: 8rpx;
}

.login__brand-subtitle {
    margin-top: 10rpx;
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.8);
    letter-spacing: 4rpx;
}

// =================================================
// 表单卡片
// =================================================
.login__form-card {
    width: calc(100% - 48rpx);
    background: #fff;
    border-radius: 48rpx;
    padding: 60rpx 48rpx 40rpx;
    margin: 0 24rpx;
    box-sizing: border-box;
}

.login__form-header {
    margin-bottom: 40rpx;
}

.login__form-title {
    display: block;
    font-size: 40rpx;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 12rpx;
}

.login__form-desc {
    font-size: 26rpx;
    color: #999;
}

// =================================================
// 登录方式切换
// =================================================
.login__type-tabs {
    display: flex;
    gap: 16rpx;
    margin-bottom: 36rpx;
}

.login__type-tab {
    flex: 1;
    height: 72rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16rpx;
    background: #f5f7fa;
    font-size: 26rpx;
    color: #666;
    transition: all 0.2s;

    &--active {
        background: #1a6eff;
        color: #fff;
        font-weight: 600;
    }
}

// =================================================
// 输入框
// =================================================
.login__input-group {
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

.login__input-icon {
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

.login__icon-text {
    font-size: 28rpx;
}

.login__input-field {
    flex: 1;
    height: 100%;
    font-size: 28rpx;
    color: #333;
}

.login__input-suffix {
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
.login__captcha-img-wrap {
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

.login__captcha-img {
    width: 100%;
    height: 100%;
}

// =================================================
// 发送验证码按钮
// =================================================
.login__code-btn {
    flex-shrink: 0;
    margin-left: 16rpx;
    padding: 0 24rpx;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12rpx;
    background: #1a6eff;
    font-size: 24rpx;
    color: #fff;
    white-space: nowrap;

    &--disabled {
        background: #c0c4cc;
    }
}

// =================================================
// 协议
// =================================================
.login__protocol-row {
    display: flex;
    align-items: center;
    margin: 32rpx 0;
}

.login__checkbox {
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

    &--checked {
        background: #1a6eff;
        border-color: #1a6eff;
    }
}

.login__check-icon {
    color: #fff;
    font-size: 22rpx;
    font-weight: bold;
}

.login__protocol-text {
    font-size: 24rpx;
    color: #999;
    line-height: 1.5;
}

.login__protocol-link {
    color: #1a6eff;
    display: inline-block;
    padding: 4rpx 0;
}

// =================================================
// 登录按钮
// =================================================
.login__btn {
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

.login__loading-row {
    display: flex;
    align-items: center;
    gap: 12rpx;
}

.login__loading-icon {
    font-size: 28rpx;
}

// =================================================
// 底部链接
// =================================================
.login__form-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 40rpx;
    gap: 24rpx;
}

.login__footer-link {
    font-size: 26rpx;
    color: #1a6eff;
    display: inline;
}

.login__footer-divider {
    color: #ddd;
    font-size: 24rpx;
}

// =================================================
// 版本号
// =================================================
.login__version-info {
    margin-top: auto;
    padding: 24rpx 0 40rpx;
    width: 100%;
    text-align: center;
    font-size: 22rpx;
    color: rgba(255, 255, 255, 0.5);
}
</style>
