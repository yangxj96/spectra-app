# Spectra App

Spectra 系统的 **移动端前端**，基于 uni-app (Vue 3 + TypeScript) 构建，支持 H5 和微信小程序。

| 项目                                                       | 说明                                |
| ---------------------------------------------------------- | ----------------------------------- |
| [spectra-admin](https://github.com/yangxj96/spectra-admin) | 后端 API（Spring Boot 4 + Java 25） |
| [spectra-ui](https://github.com/yangxj96/spectra-ui)       | Web 管理端（Vue 3 + Element Plus）  |
| **spectra-app**（本仓库）                                  | 移动端（uni-app，H5 / 微信小程序）  |

本项目通过 `VITE_API_BASE_URL` 连接 `spectra-admin` 作为 API 后端（开发环境默认 `https://127.0.0.1:4004`）。

## 技术栈

- **框架**: uni-app (Vue 3)
- **语言**: TypeScript
- **构建**: Vite
- **包管理**: pnpm
- **UI 库**: TDesign + uni-ui
- **状态管理**: Pinia
- **国际化**: vue-i18n
- **代码规范**: ESLint + Prettier + CommitLint

## 快速开始

### 环境要求

- Node.js >= 20
- pnpm >= 9

推荐使用 [mise](https://mise.jdx.dev/) 管理工具版本：

```bash
mise install
```

### 安装依赖

```bash
pnpm install
```

### 启动开发

```bash
# H5 开发
pnpm start

# 微信小程序开发
pnpm dev:mp-weixin
```

### 构建

```bash
pnpm build:h5
pnpm build:mp-weixin
```

## 开发命令

| 命令                   | 说明                   |
| ---------------------- | ---------------------- |
| `pnpm start`           | 启动 H5 开发服务器     |
| `pnpm dev:h5`          | 启动 H5 开发服务器     |
| `pnpm dev:mp-weixin`   | 启动微信小程序开发     |
| `pnpm build:h5`        | 构建 H5 生产版本       |
| `pnpm build:mp-weixin` | 构建微信小程序生产版本 |
| `pnpm type-check`      | TypeScript 类型检查    |
| `pnpm lint`            | ESLint 代码检查        |
| `pnpm lint:fix`        | ESLint 自动修复        |
| `pnpm format`          | Prettier 格式化代码    |
| `pnpm format:check`    | 检查代码格式           |

## 项目结构

```
src/
├── components/         # 全局组件
│   ├── loading/        # 加载遮罩
│   └── skeleton/       # 骨架屏
├── config/             # 配置文件
│   ├── default.ts      # 默认配置
│   └── env.ts          # 环境变量
├── helper/             # 辅助模块
│   ├── bootstrap/      # 启动引导
│   ├── error_handler/  # 错误处理
│   └── push_message/   # 推送消息
├── hooks/              # Vue 组合式函数
├── interceptor/        # 路由拦截器
├── locales/            # 国际化 (zh/en)
├── pages/              # 页面
│   ├── agreement/      # 协议页面
│   ├── contacts/       # 通讯录
│   ├── error/          # 错误页面
│   ├── login/          # 登录
│   ├── message/        # 消息
│   ├── mine/           # 我的
│   ├── splash/         # 启动页
│   └── workbench/      # 工作台
├── platform/           # 平台适配
├── services/           # HTTP 服务
├── static/             # 静态资源
├── stores/             # Pinia 状态
├── subpackages/        # 分包
├── types/              # TypeScript 类型
├── utils/              # 工具函数
├── App.vue             # 根组件
├── main.ts             # 入口文件
├── manifest.json       # uni-app 配置
├── pages.json          # 路由配置
└── uni.scss            # 全局样式变量
```

## 环境变量

在项目根目录创建 `.env` 文件（参考 `.env.example`）：

| 变量                | 说明         | 默认值                    |
| ------------------- | ------------ | ------------------------- |
| `VITE_API_BASE_URL` | API 基础地址 | `https://api.example.com` |
| `VITE_DEV_MODE`     | 开发模式开关 | `false`                   |
| `VITE_APP_TITLE`    | 应用标题     | `光谱`                    |

## 内置功能

- [x] 多环境配置 (dev/prod)
- [x] TypeScript 严格模式
- [x] ESLint + Prettier 代码规范
- [x] CommitLint 提交规范
- [x] 路由拦截 + 登录白名单
- [x] HTTP 请求封装 + Token 刷新
- [x] 国际化 (中文/英文)
- [x] Pinia 状态管理
- [x] 全局错误处理
- [x] 网络状态监听
- [x] 推送消息管理
- [x] 平台适配层 (Android/Web)
- [x] 404 / 网络错误页面
- [x] Loading / Skeleton 组件

## 提交规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

```
feat:     新功能
fix:      修复 bug
docs:     文档更新
style:    代码格式（不影响功能）
refactor: 重构
perf:     性能优化
test:     测试
chore:    构建/工具变更
```

示例：

```bash
feat: 添加用户头像上传功能
fix: 修复登录页面验证码刷新问题
docs: 更新 README 安装说明
```

## License

[Apache License 2.0](LICENSE)
