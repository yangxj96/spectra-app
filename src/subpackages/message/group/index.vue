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
        <uni-nav-bar @clickLeft="back" showMenuButtonWidth statusBar left-icon="left" fixed :title="t('group.title')" />
    </view>
</template>
