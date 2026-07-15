# Spectra App

> Spectra 系统的移动端前端，基于 uni-app (Vue 3 + TypeScript)，支持 H5 和微信小程序。

## 技术栈

| 技术       | 版本   | 说明       |
| ---------- | ------ | ---------- |
| Vue        | 3.4.27 | 前端框架   |
| uni-app    | 3.0.0  | 跨平台框架 |
| Vite       | 5.2.8  | 构建工具   |
| TypeScript | 5.4.5  | 类型系统   |
| TDesign    | 0.8.1  | UI 组件库  |
| Pinia      | 2.1.7  | 状态管理   |
| vue-i18n   | 9.1.9  | 国际化     |
| ESLint     | 10.6.0 | 代码检查   |

## 支持平台

- H5（浏览器）
- 微信小程序
- Android / iOS（App）
- HarmonyOS

## 常用命令

| 命令                   | 说明                   |
| ---------------------- | ---------------------- |
| `pnpm start`           | 启动 H5 开发服务器     |
| `pnpm dev:mp-weixin`   | 启动微信小程序开发     |
| `pnpm build:h5`        | 构建 H5 生产版本       |
| `pnpm build:mp-weixin` | 构建微信小程序生产版本 |
| `pnpm type-check`      | TypeScript 类型检查    |
| `pnpm lint`            | ESLint 代码检查        |
| `pnpm format`          | Prettier 格式化        |

## 项目结构

```
src/
├── components/     # 全局组件
├── helper/         # 辅助模块（bootstrap, error_handler, push_message）
├── hooks/          # 组合式函数
├── interceptor/    # 路由拦截器
├── locales/        # 国际化（zh/en）
├── pages/          # 页面（login, workbench, mine, contacts 等）
├── platform/       # 平台适配层
├── services/       # HTTP 服务
├── stores/         # Pinia 状态
├── subpackages/    # 分包
└── utils/          # 工具函数
```

## 配置

| 变量                | 说明         | 默认值                    |
| ------------------- | ------------ | ------------------------- |
| `VITE_API_BASE_URL` | API 基础地址 | `https://api.example.com` |
| `VITE_DEV_MODE`     | 开发模式开关 | `false`                   |
| `VITE_APP_TITLE`    | 应用标题     | `光谱`                    |

## 文档

项目文档统一维护在根仓库 [spectra-docs](https://github.com/yangxj96/spectra-docs)：

| 文档             | 路径                                              |
| ---------------- | ------------------------------------------------- |
| spectra-app 详情 | `docs/20-前端/20-spectra-app.md`                  |
| 前端概述         | `docs/20-前端/00-前端总览.md`                     |
| 命名规范         | `docs/20-知识库/50-规范与参考/20-前端命名规范.md` |

## 许可证

Apache-2.0
