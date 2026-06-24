<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";
import { DEV_MODE, STORAGE_KEY_REFRESH_TOKEN, STORAGE_KEY_TOKEN } from "@/config/env";
import { post } from "@/services/request";
import useAppStore from "@/stores/app";
import type { LoginResponse } from "@/types";

const appStore = useAppStore();

/** 登录成功后跳转的目标路径 */
const redirect = ref("");

/** 登录表单 */
const form = ref({
    username: "",
    password: "",
    captcha: ""
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

/** 验证码字符串 */
const captchaCode = ref("");

/** 每个验证码字符的样式 */
const charStyles = ref<Array<{ rotate: string; offsetY: string; fontSize: string; color: string }>>([]);

/** 验证码干扰线 */
const noiseLines = ref<Array<{ left: string; top: string; width: string; rotate: string; opacity: number }>>([]);

/** 噪点位置 */
const noiseDots = ref<Array<{ left: string; top: string; opacity: number }>>([]);

const COLORS = ["#e74c3c", "#2e71cc", "#3498db", "#e67e22"];

function generateCode(): string {
    return Math.random().toString(36).slice(2, 6).toUpperCase();
}

function randomStyle() {
    charStyles.value = Array.from({ length: 4 }, (_, i) => ({
        rotate: `${(i - 1.5) * 14 + (Math.random() * 14 - 7)}deg`,
        offsetY: `${Math.random() * 8 - 4}rpx`,
        fontSize: `${Math.random() * 12 + 36}rpx`,
        color: COLORS[i]
    }));
    noiseLines.value = Array.from({ length: 6 }, () => ({
        left: `${Math.random() * 88}%`,
        top: `${Math.random() * 78}%`,
        width: `${Math.random() * 60 + 20}rpx`,
        rotate: `${Math.random() * 50 - 25}deg`,
        opacity: Math.random() * 0.25 + 0.08
    }));
    noiseDots.value = Array.from({ length: 20 }, () => ({
        left: `${Math.random() * 93}%`,
        top: `${Math.random() * 88}%`,
        opacity: Math.random() * 0.15 + 0.03
    }));
}

function refreshCaptcha() {
    captchaCode.value = generateCode();
    randomStyle();
}

refreshCaptcha();

function togglePassword() {
    passwordVisible.value = !passwordVisible.value;
}

async function handleLogin() {
    if (!form.value.username) {
        uni.showToast({ title: "请输入用户名", icon: "none" });
        return;
    }
    if (!form.value.password) {
        uni.showToast({ title: "请输入密码", icon: "none" });
        return;
    }
    if (!form.value.captcha) {
        uni.showToast({ title: "请输入验证码", icon: "none" });
        return;
    }
    if (!agreeProtocol.value) {
        uni.showToast({ title: "请先阅读并同意用户协议", icon: "none" });
        return;
    }

    if (isLoggingIn.value) return;
    isLoggingIn.value = true;

    try {
        if (DEV_MODE) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const mockResult: LoginResponse = {
                token: "dev_token_" + Date.now(),
                refresh_token: "dev_refresh_" + Date.now(),
                user: { id: 1, name: form.value.username || "Jack" }
            };
            handleLoginSuccess(mockResult);
            return;
        }

        // TODO: 替换为实际登录接口
        // const result = await post<LoginResponse>("/auth/login", {
        //     username: form.value.username,
        //     password: form.value.password,
        //     captcha: form.value.captcha
        // });
        // handleLoginSuccess(result);
    } catch (err: any) {
        uni.showToast({ title: err.msg || "登录失败", icon: "none" });
    } finally {
        isLoggingIn.value = false;
    }
}

function handleLoginSuccess(result: LoginResponse) {
    uni.setStorageSync(STORAGE_KEY_TOKEN, result.token);
    uni.setStorageSync(STORAGE_KEY_REFRESH_TOKEN, result.refresh_token);
    appStore.setToken(result.token);
    appStore.setUser(result.user);

    uni.showToast({ title: "登录成功", icon: "success" });

    setTimeout(() => {
        const target = redirect.value || "/pages/message/index";
        // tab 页必须用 switchTab，其他页用 reLaunch
        if (target.startsWith("/pages/message") || target.startsWith("/pages/contacts") || target.startsWith("/pages/workbench") || target.startsWith("/pages/mine")) {
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
        title: "提示",
        content: `"${feature}"功能正在开发中，敬请期待`,
        showCancel: false,
        confirmText: "知道了"
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
            <view class="brand-name">光谱</view>
            <view class="brand-subtitle">高效协同 · 数字办公</view>
        </view>

        <!-- 表单卡片区 -->
        <view class="form-card">
            <!-- 欢迎语 -->
            <view class="form-header">
                <text class="form-title">欢迎回来</text>
                <text class="form-desc">请输入账号信息登录系统</text>
            </view>

            <!-- 用户名 -->
            <view class="input-group">
                <view class="input-icon">
                    <text class="icon-text">👤</text>
                </view>
                <input
                    class="input-field"
                    v-model="form.username"
                    placeholder="请输入用户名 / 手机号"
                    placeholder-style="color: #bbb; font-size: 28rpx;" />
            </view>

            <!-- 密码 -->
            <view class="input-group">
                <view class="input-icon">
                    <text class="icon-text">🔒</text>
                </view>
                <input
                    class="input-field"
                    v-model="form.password"
                    :password="!passwordVisible"
                    placeholder="请输入密码"
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
                    class="input-field"
                    v-model="form.captcha"
                    placeholder="请输入验证码"
                    placeholder-style="color: #bbb; font-size: 28rpx;"
                    maxlength="4" />
            </view>

            <!-- 图形验证码 -->
            <view class="captcha-box" @tap="refreshCaptcha">
                <view class="captcha-canvas">
                    <view
                        v-for="(line, i) in noiseLines"
                        :key="'l' + i"
                        class="noise-line"
                        :style="{
                            left: line.left,
                            top: line.top,
                            width: line.width,
                            transform: `rotate(${line.rotate})`,
                            opacity: line.opacity
                        }" />
                    <view class="captcha-chars">
                        <text
                            v-for="(char, i) in captchaCode.split('')"
                            :key="'c' + i"
                            class="captcha-char"
                            :style="{
                                transform: `rotate(${charStyles[i]?.rotate ?? '0deg'}) translateY(${charStyles[i]?.offsetY ?? '0rpx'})`,
                                fontSize: charStyles[i]?.fontSize ?? '36rpx',
                                color: charStyles[i]?.color ?? '#333'
                            }">
                            {{ char }}
                        </text>
                    </view>
                    <view class="noise-dots">
                        <text
                            v-for="(dot, i) in noiseDots"
                            :key="'d' + i"
                            class="noise-dot"
                            :style="{ left: dot.left, top: dot.top, opacity: dot.opacity }">
                            ·
                        </text>
                    </view>
                </view>
                <view class="captcha-tip-row">
                    <text class="captcha-tip-text">看不清？点击刷新</text>
                </view>
            </view>

            <!-- 协议勾选 -->
            <view class="protocol-row">
                <view class="checkbox" :class="{ checked: agreeProtocol }" @tap="agreeProtocol = !agreeProtocol">
                    <text v-if="agreeProtocol" class="check-icon">✓</text>
                </view>
                <text class="protocol-text">已阅读并同意</text>
                <view class="protocol-link" @tap="goAgreement('user')">《用户协议》</view>
                <text class="protocol-text">和</text>
                <view class="protocol-link" @tap="goAgreement('privacy')">《隐私政策》</view>
            </view>

            <!-- 登录按钮 -->
            <button class="login-btn" :disabled="isLoggingIn" @tap="handleLogin">
                <text v-if="!isLoggingIn">登 录</text>
                <view v-else class="loading-row">
                    <text class="loading-icon">⏳</text>
                    <text>登录中...</text>
                </view>
            </button>

            <!-- 底部链接 -->
            <view class="form-footer">
                <view class="footer-link" @tap.stop="showComingSoon('忘记密码')"><text>忘记密码</text></view>
                <text class="footer-divider">|</text>
                <view class="footer-link" @tap.stop="showComingSoon('注册账号')"><text>注册账号</text></view>
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
.captcha-box {
    margin-bottom: 24rpx;
}

.captcha-canvas {
    position: relative;
    width: 100%;
    height: 100rpx;
    background: #f5f6f8;
    border-radius: 16rpx;
    border: 2rpx solid #e0e3e8;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.noise-line {
    position: absolute;
    height: 2rpx;
    background: #c0c4cc;
    pointer-events: none;
}

.captcha-chars {
    position: relative;
    z-index: 2;
    display: flex;
    gap: 12rpx;
    pointer-events: none;
}

.captcha-char {
    font-weight: 700;
    font-family: "Courier New", monospace;
    text-shadow: 1rpx 1rpx 0 rgba(0, 0, 0, 0.1);
    user-select: none;
}

.noise-dots {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

.noise-dot {
    position: absolute;
    font-size: 24rpx;
    color: #999;
    font-weight: bold;
}

.captcha-tip-row {
    display: flex;
    justify-content: flex-end;
    margin-top: 10rpx;
}

.captcha-tip-text {
    font-size: 22rpx;
    color: #1a6eff;
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
