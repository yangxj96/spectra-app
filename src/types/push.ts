/**
 * 推送消息相关类型定义
 */

/**
 * 推送消息类型枚举
 */
export enum PushMessageType {
    SYSTEM = "system",
    ACTIVITY = "activity",
    CHAT = "chat"
}

/**
 * 推送消息载荷
 */
export interface PushMessagePayload {
    type: string;
    data?: Record<string, string | number | boolean | null | undefined>;
    [key: string]: unknown;
}

/**
 * 推送消息结果
 */
export interface PushMessageResult {
    type: "click" | "receive";
    data: PushMessagePayload;
}

/**
 * 消息处理器函数类型
 */
export type MessageHandler = (data: PushMessagePayload, type: string) => void | Promise<void>;
