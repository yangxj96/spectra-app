<script setup lang="ts">
import { nextTick, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/** 联系人名称 */
const contactName = ref("张三");

interface ChatMessage {
    id: number;
    content: string;
    from: "self" | "other";
    time: string;
}

/** 模拟聊天记录 */
const messages = reactive<ChatMessage[]>([
    { id: 1, content: "你好，最近项目进展如何？", from: "other", time: "09:30" },
    { id: 2, content: "挺好的，需求文档已经写完了，正在做技术方案评审", from: "self", time: "09:32" },
    { id: 3, content: "好的，有什么需要我协助的吗？", from: "other", time: "09:33" },
    { id: 4, content: "有几个接口联调的问题想和你确认一下，方便开个会吗？", from: "self", time: "09:35" },
    { id: 5, content: "没问题，下午2点怎么样？", from: "other", time: "09:36" },
    { id: 6, content: "好的，我提前把问题整理一下发给你", from: "self", time: "09:38" },
    { id: 7, content: "嗯嗯，另外UI那边的设计稿也出来了，我并发你看看", from: "other", time: "09:40" },
    { id: 8, content: "太好了，这样联调的时候就有参照了 👍", from: "self", time: "09:42" },
    { id: 9, content: "对，这次的设计风格比较简洁，应该会很快通过评审", from: "other", time: "09:45" },
    { id: 10, content: "那我下午整理好问题列表，开会前发你", from: "self", time: "09:48" },
    { id: 11, content: "行，记得把优先级标一下，有些问题可以后面再优化", from: "other", time: "09:50" },
    { id: 12, content: "好的，我会按P0/P1/P2分类", from: "self", time: "09:51" },
    { id: 13, content: "对了，后端接口文档今晚能出来吗？前端这边好安排开发排期", from: "other", time: "10:02" },
    { id: 14, content: "接口文档已经在写了，核心接口明天上午可以先给出来", from: "self", time: "10:05" },
    { id: 15, content: "那太好了，我让前端同事明天下午开始对接口", from: "other", time: "10:06" },
    { id: 16, content: "没问题，有什么不清楚的随时沟通", from: "self", time: "10:08" },
    { id: 17, content: "另外测试这边需要提前准备测试用例，大概什么时候可以提测？", from: "other", time: "10:15" },
    { id: 18, content: "预计下周三可以提测，这周联调完下周一开始自测", from: "self", time: "10:18" },
    { id: 19, content: "好的，我这边协调测试资源，先安排两个人跟进", from: "other", time: "10:20" },
    { id: 20, content: "辛苦了 🙏", from: "self", time: "10:22" }
]);

const inputText = ref("");
let nextId = 21;

const goBack = () => {
    uni.navigateBack();
};

/** 发送消息 */
function sendMessage() {
    const text = inputText.value.trim();
    if (!text) return;

    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    messages.push({ id: nextId++, content: text, from: "self", time });
    inputText.value = "";
    scrollToBottom();

    // 模拟对方回复
    const replies = [
        "收到，我看看哈",
        "好的，明白了",
        "稍等，我确认一下",
        "没问题 👍",
        "这个我待会回复你",
        "嗯嗯，了解"
    ];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    setTimeout(
        () => {
            messages.push({
                id: nextId++,
                content: reply,
                from: "other",
                time: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes() + 1).padStart(2, "0")}`
            });
            scrollToBottom();
        },
        800 + Math.random() * 1200
    );
}

/** 滚动到的消息 id */
const scrollIntoView = ref("");

function scrollToBottom() {
    nextTick(() => {
        const last = messages[messages.length - 1];
        if (last) scrollIntoView.value = `msg-${last.id}`;
    });
}

// 初始化滚动
scrollToBottom();
</script>

<template>
    <view class="chat">
        <!-- 顶部导航 -->
        <uni-nav-bar status-bar fixed :title="contactName" left-icon="left" @click-left="goBack" />

        <!-- 消息列表 -->
        <scroll-view
            class="chat__msg-scroll"
            scroll-y
            scroll-with-animation
            :scroll-into-view="scrollIntoView"
            :show-scrollbar="false"
            enhanced>
            <view class="chat__msg-list">
                <!-- 时间标签 -->
                <view class="chat__time-tag">
                    <text class="chat__time-text">2026-06-25 09:30</text>
                </view>

                <view
                    v-for="msg in messages"
                    :id="'msg-' + msg.id"
                    :key="msg.id"
                    class="chat__msg-row"
                    :class="msg.from === 'self' ? 'chat__msg-row--self' : 'chat__msg-row--other'">
                    <!-- 对方头像 -->
                    <view v-if="msg.from === 'other'" class="chat__avatar-box">
                        <image class="chat__avatar" src="/static/default/avatar.png" mode="aspectFill" />
                    </view>

                    <!-- 气泡 -->
                    <view class="chat__msg-body">
                        <view
                            class="chat__bubble"
                            :class="msg.from === 'self' ? 'chat__bubble--self' : 'chat__bubble--other'">
                            <text class="chat__bubble-text">{{ msg.content }}</text>
                        </view>
                    </view>

                    <!-- 自己头像 -->
                    <view v-if="msg.from === 'self'" class="chat__avatar-box">
                        <image class="chat__avatar" src="/static/example/avatar.jpg" mode="aspectFill" />
                    </view>
                </view>
            </view>
        </scroll-view>

        <!-- 底部输入栏 -->
        <view class="chat__input-bar">
            <input
                v-model="inputText"
                class="chat__msg-input"
                :placeholder="t('chat.input_placeholder')"
                placeholder-style="color: #bbb"
                confirm-type="send"
                @confirm="sendMessage" />
            <button class="chat__send-btn" :disabled="!inputText.trim()" @tap="sendMessage">
                {{ t("chat.send") }}
            </button>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.chat {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: #ededed;
    overflow: hidden;
}

// 消息列表
.chat__msg-scroll {
    flex: 1;
    min-height: 0;
    padding: 20rpx 28rpx 0;
    box-sizing: border-box;

    // 隐藏滚动条 (H5)
    ::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
    }
}

// 底部输入栏
.chat__input-bar {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    padding: 16rpx 20rpx;
    padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
    background: #f7f7f7;
    border-top: 1rpx solid #e0e0e0;
    gap: 16rpx;
}

.chat__msg-list {
    padding-bottom: 20rpx;
}

// 时间标签
.chat__time-tag {
    display: flex;
    justify-content: center;
    margin: 16rpx 0 24rpx;
}

.chat__time-text {
    font-size: 22rpx;
    color: #b0b0b0;
    background: #dcdcdc;
    padding: 6rpx 20rpx;
    border-radius: 8rpx;
}

// 消息行
.chat__msg-row {
    display: flex;
    align-items: flex-start;
    margin-bottom: 24rpx;

    &--self {
        justify-content: flex-end;
    }

    &--other {
        justify-content: flex-start;
    }
}

.chat__avatar-box {
    flex-shrink: 0;
}

.chat__avatar {
    width: 72rpx;
    height: 72rpx;
    border-radius: 10rpx;
}

.chat__msg-body {
    max-width: 70%;
}

// 气泡
.chat__bubble {
    padding: 18rpx 24rpx;
    border-radius: 12rpx;
    position: relative;
    word-break: break-all;

    &--other {
        background: #fff;
        margin-left: 16rpx;
        border-top-left-radius: 4rpx;

        &::before {
            content: "";
            position: absolute;
            left: -12rpx;
            top: 20rpx;
            border-width: 12rpx 12rpx 12rpx 0;
            border-style: solid;
            border-color: transparent #fff transparent transparent;
        }
    }

    &--self {
        background: #95ec69;
        margin-right: 16rpx;
        border-top-right-radius: 4rpx;

        &::before {
            content: "";
            position: absolute;
            right: -12rpx;
            top: 20rpx;
            border-width: 12rpx 0 12rpx 12rpx;
            border-style: solid;
            border-color: transparent transparent transparent #95ec69;
        }
    }
}

.chat__bubble-text {
    font-size: 30rpx;
    color: #333;
    line-height: 1.5;
}

.chat__msg-input {
    flex: 1;
    height: 72rpx;
    background: #fff;
    border-radius: 12rpx;
    padding: 0 20rpx;
    font-size: 28rpx;
    color: #333;
}

.chat__send-btn {
    width: 120rpx;
    height: 72rpx;
    background: #07c160;
    color: #fff;
    font-size: 28rpx;
    font-weight: 500;
    border-radius: 12rpx;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;

    &[disabled] {
        background: #a8e6c1;
        color: rgba(255, 255, 255, 0.7);
    }
}
</style>
