<script lang="ts" setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const back = () => {
    uni.navigateBack();
};
</script>

<template>
    <view class="page">
        <!-- 头部固定 -->
        <uni-nav-bar show-menu-button-width status-bar left-icon="left" fixed :title="t('group.title')" @click-left="back" />
    </view>
</template>
