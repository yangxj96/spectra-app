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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: Record<string, any>;
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
