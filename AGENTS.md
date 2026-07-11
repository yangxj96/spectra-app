# AGENTS.md

## 项目概述

`spectra-admin` 的**移动端前端**——基于 uni-app（Vue 3）的跨平台项目（H5/微信小程序）。使用 TypeScript、Vite 和 pnpm。

- 后端 API：`spectra-admin`（Spring Boot，端口 4004）
- 所有 API 调用指向 `VITE_API_BASE_URL`（开发环境默认 `https://127.0.0.1:4004`）

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

## 代码规范

- **格式化工具**：Prettier，4 空格缩进，双引号，120 字符行宽
- **无尾逗号**，必须分号
- **换行符**：LF

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

## Platform Abstraction (`src/platform/`)

uni-app 需要同时运行在 H5、Android、微信小程序等平台。当某个功能在不同平台有**不同的实现逻辑**（而非仅仅是样式差异）时，必须通过 `platform/` 目录进行抽象。

### 目录结构

```
platform/
  app/              # App 基础能力（退出、返回键、版本信息）
  device/           # 设备信息（设备ID、系统信息）
  permission/       # 运行时权限（Android 权限请求）
  {feature}/        # 新增平台差异功能放这里
    types.ts        # 类型定义（统一接口）
    base.ts         # 基础实现（可选，供各平台复用）
    index.ts        # 条件编译入口（#ifdef 导出对应平台实现）
    android.ts      # Android 原生实现
    web.ts          # Web/H5 实现
```

### 使用方式

业务代码统一从 `@/platform/{feature}` 导入，**不要**在业务代码中直接写 `#ifdef` 调用原生 API：

```typescript
// ✅ 正确：通过 platform 抽象调用
import { permission } from "@/platform/permission";
const granted = await permission.requestPermission("android.permission.CAMERA");

// ❌ 错误：在业务代码中直接写条件编译
// #ifdef APP-ANDROID
plus.android.requestPermissions(["android.permission.CAMERA"]);
// #endif
```

### 何时使用 platform/ vs 模板内 #ifdef

| 场景                                    | 做法                                                    |
| --------------------------------------- | ------------------------------------------------------- |
| 调用原生 API（权限、设备、推送等）      | 放入 `platform/{feature}/`                              |
| APP 需要 `scroll-view` 包裹而 H5 不需要 | 模板内直接用 `<!-- #ifdef APP -->` 即可                 |
| 微信小程序特有的组件/逻辑               | 模板内用 `<!-- #ifdef MP-WEIXIN -->` 或放入 `platform/` |

## 备注

- 路径别名：`@/` → `src/`
- Node 24.14.0, pnpm 11.0.9（通过 mise）
- 构建输出到 `unpackage/`
- API 端点和响应格式由 `spectra-admin` 定义——若后端更改端点，需同步更新此处的 `src/services/` 模块。
