/**
 * i18n 国际化配置
 *
 * 使用方式:
 *   在 setup 中: const { t } = useI18n()
 *   在模板中: {{ $t("login.title") }}
 *
 * 扩展新语言:
 *   1. 复制 en.json 为 xx.json 并翻译
 *   2. 在此文件的 messages 中添加 import
 */

import { createI18n } from "vue-i18n";
import zh from "./zh.json";
import en from "./en.json";

// TODO: 从本地存储读取用户语言偏好，或根据系统语言自动选择
// const savedLocale = uni.getStorageSync("locale") || uni.getLocale()

const i18n = createI18n({
    legacy: false, // 使用 Composition API 模式
    locale: "zh", // 默认语言（TODO: 改为从系统/用户偏好读取）
    fallbackLocale: "zh",
    messages: {
        zh,
        en
    }
});

export default i18n;
