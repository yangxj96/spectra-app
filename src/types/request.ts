/**
 * HTTP 请求相关类型定义
 */

/** 请求方法 */
export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

/** 请求配置 */
export interface RequestOptions {
    /** 请求路径（相对 BASE_URL） */
    url: string;
    /** 请求方法 */
    method?: RequestMethod;
    /** 请求参数（GET 时为 query params，POST/PUT 时为 body） */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: Record<string, any>;
    /** 自定义请求头 */
    header?: Record<string, string>;
    /** 超时时间（毫秒），默认 15000 */
    timeout?: number;
    /** 是否显示 loading，默认 false */
    showLoading?: boolean;
    /** loading 提示文字 */
    loadingText?: string;
    /** 是否跳过 token 注入，默认 false */
    skipAuth?: boolean;
    /** 接口无响应体，仅通过 HTTP 状态码判断成功，默认 false */
    noBody?: boolean;
}

/** 标准 API 响应结构 */
export interface ApiResponse<T = unknown> {
    /** 业务状态码：0 表示成功，非 0 表示失败 */
    code: number;
    /** 响应数据 */
    data: T;
    /** 提示信息 */
    msg: string;
}

/** 分页请求参数 */
export interface PageRequest {
    page: number;
    pageSize: number;
}

/** 分页响应结构 */
export interface PageResponse<T = unknown> {
    /** 数据列表 */
    list: T[];
    /** 总条数 */
    total: number;
    /** 当前页码 */
    page: number;
    /** 每页条数 */
    pageSize: number;
}

/** API 业务错误 */
export class ApiError extends Error {
    code: number;

    constructor(code: number, msg: string) {
        super(msg);
        this.code = code;
        this.name = "ApiError";
    }
}
