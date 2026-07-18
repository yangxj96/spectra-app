# AGENTS.md

## 项目概述

`spectra-admin` 的**移动端前端**——基于 uni-app（Vue 3）的跨平台项目（H5/微信小程序）。使用 TypeScript、Vite 和 pnpm。

- 后端 API：`spectra-admin`（Spring Boot，端口 4004）
- 所有 API 调用指向 `VITE_API_BASE_URL`（开发环境默认 `https://127.0.0.1:4004`）

编码规范由 `spectra/spectra-app-spec` skill 控制（修改前端代码时自动加载）。

## 开发命令

```bash
# 启动开发（H5）
pnpm start           # 或: pnpm dev:h5

# 微信小程序开发
pnpm dev:mp-weixin

# 生产构建
pnpm build:h5
pnpm build:mp-weixin

# 类型检查（启动前执行）
pnpm type-check      # vue-tsc --noEmit

# 代码检查
pnpm lint            # eslint .
pnpm lint:fix        # eslint . --fix

# 代码格式化
pnpm format          # prettier --write .
pnpm format:check    # prettier --check .
```

## 项目结构

- `src/pages/` - 页面组件（主包）
- `src/subpackages/` - 分包（小程序分包加载）
- `src/platform/` - **平台抽象层**（详见下方）
- `src/stores/` - Pinia 状态管理
- `src/services/` - API 服务
- `src/config/` - 配置
- `src/utils/` - 工具函数
- `src/locales/` - i18n 多语言
- `src/hooks/` - Vue 组合式函数

## 核心技术

- **框架**：uni-app（跨平台 Vue 3）
- **UI 库**：TDesign（`@tdesign/uniapp`）
- **状态管理**：Pinia
- **国际化**：vue-i18n
- **CSS**：SCSS + Less

## 平台抽象

详见 `spectra/spectra-app-spec` skill（修改前端代码时自动加载）。

## 备注

- 路径别名：`@/` → `src/`
- 构建输出到 `unpackage/`
- Node/pnpm 版本及 npm 镜像配置见根 `AGENTS.md`
- API 端点和响应格式由 `spectra-admin` 定义——若后端更改端点，需同步更新此处的 `src/services/` 模块。
