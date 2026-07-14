<script setup lang="ts">
import { DEFAULT_AVATAR } from "@/config/default";
import { useI18n } from "vue-i18n";
import { ref } from "vue";

const { t } = useI18n();

/** 功能列表 */
const funcList = ref([
    { icon: "👤", nameKey: "contacts.new_friends", badge: 3 },
    { icon: "👥", nameKey: "contacts.group_chat" },
    { icon: "🏷️", nameKey: "contacts.tags" }
]);

/** 联系人列表（按拼音首字母分组） */
interface Contact {
    name: string;
    avatar: string;
}

const contactList = ref<Array<{ index: string; children: Contact[] }>>([
    {
        index: "A",
        children: [
            { name: "阿里巴巴", avatar: DEFAULT_AVATAR },
            { name: "艾琳", avatar: DEFAULT_AVATAR },
            { name: "安德森", avatar: DEFAULT_AVATAR }
        ]
    },
    {
        index: "B",
        children: [
            { name: "白展堂", avatar: DEFAULT_AVATAR },
            { name: "班尼特", avatar: DEFAULT_AVATAR },
            { name: "毕方", avatar: DEFAULT_AVATAR },
            { name: "博尔特", avatar: DEFAULT_AVATAR }
        ]
    },
    {
        index: "C",
        children: [
            { name: "陈长生", avatar: DEFAULT_AVATAR },
            { name: "程咬金", avatar: DEFAULT_AVATAR },
            { name: "曹操", avatar: DEFAULT_AVATAR },
            { name: "崔斯特", avatar: DEFAULT_AVATAR }
        ]
    },
    {
        index: "D",
        children: [
            { name: "狄仁杰", avatar: DEFAULT_AVATAR },
            { name: "董明珠", avatar: DEFAULT_AVATAR },
            { name: "杜兰特", avatar: DEFAULT_AVATAR }
        ]
    },
    {
        index: "F",
        children: [
            { name: "范闲", avatar: DEFAULT_AVATAR },
            { name: "冯宝宝", avatar: DEFAULT_AVATAR },
            { name: "傅红雪", avatar: DEFAULT_AVATAR }
        ]
    },
    {
        index: "G",
        children: [
            { name: "郭靖", avatar: DEFAULT_AVATAR },
            { name: "关羽", avatar: DEFAULT_AVATAR },
            { name: "高渐离", avatar: DEFAULT_AVATAR }
        ]
    },
    {
        index: "H",
        children: [
            { name: "黄蓉", avatar: DEFAULT_AVATAR },
            { name: "花木兰", avatar: DEFAULT_AVATAR },
            { name: "韩信", avatar: DEFAULT_AVATAR },
            { name: "胡八一", avatar: DEFAULT_AVATAR }
        ]
    },
    {
        index: "J",
        children: [
            { name: "贾宝玉", avatar: DEFAULT_AVATAR },
            { name: "姜子牙", avatar: DEFAULT_AVATAR },
            { name: "金克丝", avatar: DEFAULT_AVATAR }
        ]
    },
    {
        index: "L",
        children: [
            { name: "李白", avatar: DEFAULT_AVATAR },
            { name: "刘备", avatar: DEFAULT_AVATAR },
            { name: "鲁班七号", avatar: DEFAULT_AVATAR },
            { name: "林黛玉", avatar: DEFAULT_AVATAR },
            { name: "雷神", avatar: DEFAULT_AVATAR }
        ]
    },
    {
        index: "M",
        children: [
            { name: "马可波罗", avatar: DEFAULT_AVATAR },
            { name: "芈月", avatar: DEFAULT_AVATAR },
            { name: "莫甘娜", avatar: DEFAULT_AVATAR }
        ]
    },
    {
        index: "S",
        children: [
            { name: "孙悟空", avatar: DEFAULT_AVATAR },
            { name: "宋江", avatar: DEFAULT_AVATAR },
            { name: "司马懿", avatar: DEFAULT_AVATAR }
        ]
    },
    {
        index: "W",
        children: [
            { name: "王昭君", avatar: DEFAULT_AVATAR },
            { name: "武则天", avatar: DEFAULT_AVATAR },
            { name: "吴刚", avatar: DEFAULT_AVATAR }
        ]
    },
    {
        index: "X",
        children: [
            { name: "项羽", avatar: DEFAULT_AVATAR },
            { name: "许仙", avatar: DEFAULT_AVATAR },
            { name: "西门吹雪", avatar: DEFAULT_AVATAR }
        ]
    },
    {
        index: "Y",
        children: [
            { name: "杨过", avatar: DEFAULT_AVATAR },
            { name: "嬴政", avatar: DEFAULT_AVATAR },
            { name: "玉皇大帝", avatar: DEFAULT_AVATAR }
        ]
    },
    {
        index: "Z",
        children: [
            { name: "张三丰", avatar: DEFAULT_AVATAR },
            { name: "赵云", avatar: DEFAULT_AVATAR },
            { name: "诸葛亮", avatar: DEFAULT_AVATAR },
            { name: "甄姬", avatar: DEFAULT_AVATAR }
        ]
    }
]);

function onFuncTap(item: { nameKey: string }) {
    uni.showToast({ title: t(item.nameKey), icon: "none" });
}

function onContactTap(contact: Contact) {
    uni.showToast({ title: contact.name, icon: "none" });
}
</script>

<template>
    <view class="page">
        <uni-nav-bar status-bar fixed :title="t('contacts.title')" />

        <view class="contacts__content-box">
            <!-- 搜索栏 -->
            <uni-search-bar :placeholder="t('contacts.search_placeholder')" />

            <!-- 功能列表 -->
            <view class="contacts__func-list">
                <view v-for="(item, i) in funcList" :key="'f' + i" class="contacts__func-item" @tap="onFuncTap(item)">
                    <view class="contacts__func-icon-box">
                        <text class="contacts__func-icon">{{ item.icon }}</text>
                    </view>
                    <text class="contacts__func-name">{{ t(item.nameKey) }}</text>
                    <t-badge v-if="item.badge" :count="item.badge" :offset="[-8, 0]" />
                </view>
            </view>

            <!-- 通讯录（按字母分组 + 右侧索引） -->
            <t-indexes :sticky="true" :sticky-offset="120" class="contacts__indexes-wrap" :show-tips="false">
                <block v-for="(group, gi) in contactList" :key="'g' + gi">
                    <t-indexes-anchor :index="group.index" />
                    <t-cell-group>
                        <t-cell
                            v-for="(contact, ci) in group.children"
                            :key="'c' + ci"
                            hover
                            @click="onContactTap(contact)">
                            <template #left-icon>
                                <view class="contacts__avatar-box">
                                    <image class="contacts__avatar" :src="contact.avatar" mode="aspectFill" />
                                </view>
                            </template>
                            <template #title>
                                <text class="contacts__name">{{ contact.name }}</text>
                            </template>
                        </t-cell>
                    </t-cell-group>
                </block>
            </t-indexes>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: #f5f6f7;
}

.contacts__content-box {
    padding-top: var(--window-top);
    flex: 1;
    display: flex;
    flex-direction: column;
}

// =================================================
// 功能列表
// =================================================
.contacts__func-list {
    background: #fff;
    padding: 12rpx 0;
    display: flex;
    gap: 0;
}

.contacts__func-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx 0;
    position: relative;
}

.contacts__func-icon-box {
    width: 88rpx;
    height: 88rpx;
    border-radius: 20rpx;
    background: #f0f2f5;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10rpx;
}

.contacts__func-icon {
    font-size: 40rpx;
}

.contacts__func-name {
    font-size: 24rpx;
    color: #333;
}

// =================================================
// 通讯录
// =================================================
.contacts__indexes-wrap {
    flex: 1;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));

    // 隐藏中间字母提示框
    :deep(.t-indexes__tips) {
        display: none !important;
    }
}

.contacts__avatar-box {
    width: 72rpx;
    height: 72rpx;
    margin-right: 20rpx;
}

.contacts__avatar {
    width: 72rpx;
    height: 72rpx;
    border-radius: 12rpx;
}

.contacts__name {
    font-size: 30rpx;
    color: #333;
}
</style>
