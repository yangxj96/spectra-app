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

function getLocale(): string {
    const saved = uni.getStorageSync("locale")
    if (saved) return saved
    const system = uni.getLocale()
    if (system.startsWith("zh")) return "zh"
    return "en"
}

const i18n = createI18n({
    legacy: false,
    locale: getLocale(),
    fallbackLocale: "zh",
    messages: {
        zh,
        en
    }
});

export function setLocale(locale: "zh" | "en") {
    i18n.global.locale.value = locale
    uni.setStorageSync("locale", locale)
}

export default i18n;
