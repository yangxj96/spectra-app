import type { PushMessagePayload } from "@/types/push";

// 消息类型枚举
export enum PushMessageType {
    NOTIFICATION = "notification", // 通知消息
    CHAT = "chat", // 聊天消息
    ORDER = "order", // 订单消息
    SYSTEM = "system" // 系统消息
}

// 消息处理器接口
interface MessageHandler {
    (data: PushMessagePayload, type: string): void | Promise<void>;
}

class PushManager {
    private handlers: Map<string, MessageHandler[]> = new Map();

    constructor() {
        this.init();
    }

    // 初始化推送监听
    private init() {
        uni.onPushMessage(res => {
            console.log("[PushManager]收到推送消息:", res);
            this.handleMessage(res as unknown as PushMessagePayload);
        });
    }

    // 处理消息分发
    private handleMessage(res: PushMessagePayload) {
        const { type, data } = res;

        // 处理点击通知
        if (type === "click" && data) {
            this.handleNotificationClick(data);
        }

        // 处理收到消息
        if (type === "receive" && data) {
            this.handleReceiveMessage(data);
        }
    }

    // 处理通知点击
    private handleNotificationClick(data: Record<string, unknown>) {
        const messageType = (data.type as string) || PushMessageType.SYSTEM;
        console.log("[PushManager]点击通知", messageType, data);
        this.emit("click", { type: messageType, data } as PushMessagePayload);
    }

    // 处理收到的消息（App 前台时）
    private handleReceiveMessage(data: Record<string, unknown>) {
        const messageType = (data.type as string) || PushMessageType.SYSTEM;
        console.log("[PushManager]收到消息", messageType, data);
        // 触发事件
        this.emit("receive", { type: messageType, data } as PushMessagePayload);
    }

    // 事件订阅
    on(event: string, handler: MessageHandler) {
        if (!this.handlers.has(event)) {
            this.handlers.set(event, []);
        }
        this.handlers.get(event)!.push(handler);
    }

    // 触发事件
    private emit(event: string, data: PushMessagePayload) {
        const handlers = this.handlers.get(event);
        if (handlers) {
            handlers.forEach(handler => handler(data, event));
        }
    }

    // 移除事件监听
    off(event: string, handler?: MessageHandler) {
        if (!handler) {
            this.handlers.delete(event);
        } else {
            const handlers = this.handlers.get(event);
            if (handlers) {
                const index = handlers.indexOf(handler);
                if (index > -1) handlers.splice(index, 1);
            }
        }
    }
}

// 单例模式
export const pushManager = new PushManager();
