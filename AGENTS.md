# AGENTS.md

## Project Overview

This is the **mobile frontend** for `spectra-admin` — a uni-app (Vue 3) project for cross-platform development (H5/WeChat Mini Program). Uses TypeScript, Vite, and pnpm.

- Backend API: `spectra-admin` (Spring Boot, port 4004)
- All API calls go to `VITE_API_BASE_URL` (defaults to `https://127.0.0.1:4004` in development)

## Development Commands

```bash
# Start development (H5)
pnpm start           # or: pnpm dev:h5

# WeChat Mini Program dev
pnpm dev:mp-weixin

# Build for production
pnpm build:h5
pnpm build:mp-weixin

# Type checking (runs before start)
pnpm type-check      # vue-tsc --noEmit

# Lint code
pnpm lint            # eslint .
pnpm lint:fix        # eslint . --fix

# Format code
pnpm format          # prettier --write .
pnpm format:check    # prettier --check .
```

## Code Style

- **Formatter**: Prettier with 4-space indentation, double quotes, 120 char width
- **No trailing commas**, semicolons required
- **End of line**: LF

## Project Structure

- `src/pages/` - Page components (main package)
- `src/subpackages/` - Sub-packages (split load for mini programs)
- `src/platform/` - **Platform abstraction layer** (see below)
- `src/stores/` - Pinia stores
- `src/services/` - API services
- `src/config/` - Configuration
- `src/utils/` - Utilities
- `src/locales/` - i18n translations
- `src/hooks/` - Vue composables

## Key Technologies

- **Framework**: uni-app (cross-platform Vue 3)
- **UI Library**: TDesign (`@tdesign/uniapp`)
- **State**: Pinia
- **i18n**: vue-i18n
- **CSS**: SCSS + Less

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

## Notes

- Path alias: `@/` → `src/`
- Node 24.14.0, pnpm 11.0.9 (via mise)
- Build outputs to `unpackage/`
- API endpoints and response formats are defined by `spectra-admin` — if the backend changes an endpoint, update the corresponding `src/services/` module here.
