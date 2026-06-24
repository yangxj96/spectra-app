# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"光谱" (Spectra) — a cross-platform instant messaging/social app built with uni-app (Vue 3 + TypeScript), targeting Android, iOS, Web (H5), WeChat Mini Program, Harmony, and other platforms from a single codebase.

## Commands

```bash
# Development
pnpm start              # H5 dev server (default)
pnpm run dev:h5         # H5 dev server
pnpm run dev:mp-weixin  # WeChat Mini Program dev

# Build
pnpm run build:h5            # Build for H5
pnpm run build:mp-weixin     # Build for WeChat Mini Program

# Quality
pnpm run format         # Format all files with Prettier
pnpm run format:check   # Check formatting (CI)
pnpm run type-check     # TypeScript type checking (vue-tsc --noEmit)
```

There are **no test commands** configured — no Jest, Vitest, or Cypress.

## Tech Stack

- **Framework**: uni-app 3.x with Vue 3.4 (Composition API, `<script setup>`)
- **State**: Pinia (with typed store, `isLoggedIn` getter, `clearAuth` action)
- **UI**: `@dcloudio/uni-ui` + `@tdesign/uniapp` (TDesign mobile)
- **Build**: Vite 5 + `@dcloudio/vite-plugin-uni`
- **CSS**: SCSS (with `sass`) + LESS (for TDesign theme)
- **i18n**: `vue-i18n` 9.x (configured, `zh`/`en` translation files ready)
- **TypeScript**: strict mode, `@/*` path alias → `src/`

## Architecture

### App Startup & Bootstrap

`src/main.ts` → creates Pinia + i18n + SSR app → imports iconfont + TDesign theme → registers route interceptors.

Splash page (`pages/splash/index.vue`) calls `bootstrap()`:
```
initUpdateCheck → initConfig → initUser → appStore.setReady(true)
```

`initUser` reads token from storage. If no token, user stays unauthenticated; splash navigates to login or message page accordingly.

### Environment & Configuration

Environment variables via Vite (`import.meta.env.VITE_*`), centralized in `src/config/env.ts`:

| Variable | Purpose |
|---|---|
| `API_BASE_URL` | Backend API base URL |
| `DEV_MODE` | Development bypass toggle (auth guard, mock data) |
| `APP_TITLE` | Application display title |
| `STORAGE_KEY_TOKEN` | Local storage key for auth token |
| `STORAGE_KEY_REFRESH_TOKEN` | Local storage key for refresh token |

`.env.development` / `.env.production` / `.env` (local, gitignored) for per-environment values.

### HTTP Layer

`src/services/http.ts` — core request engine:
- **Request pipeline**: build URL (GET params → query string) → inject `Authorization: Bearer` header → send via `uni.request`
- **Response pipeline**: unwrap `{ code, data, msg }` → `code === 0` resolves data, otherwise throws `ApiError`
- **401 handling**: auto-refresh token via `POST /auth/refresh` → retry original request. Concurrent 401s share a single refresh attempt (dedup queue).
- **Loading**: optional `showLoading`/`loadingText` per request

`src/services/request.ts` — typed convenience methods:
- `get<T>()`, `post<T>()`, `put<T>()`, `del<T>()` — standard CRUD
- `upload<T>()` — file upload with progress callback
- `download()` — file download with progress callback
- `withLoading()` — wrap a promise with loading overlay
- `getPage<T>()` — typed pagination helper

Dev mode: `requestMock<T>(data, delay)` for mock responses when backend is unavailable.

### Route Interceptor (Auth Guard)

`src/interceptor/route.ts` intercepts all 4 navigation methods. Flow:

```
navigation → whitelist? → pass
           → DEV_MODE? → pass
           → validateToken() → pass
           → reLaunch to /pages/login/index?redirect=...
```

`validateToken()` checks token existence in storage (JWT expiry check and refresh logic are documented with TODO stubs — the actual refresh is handled by HTTP layer 401 interception).

Whitelist: `/pages/splash/index`, `/pages/login/index`.

### Global Error Handling

`src/helper/error_handler.ts` + App.vue lifecycle hooks:
- `onError` — Vue component errors → `reportError()`
- `onUnhandledRejection` — unhandled Promise rejections
- `onPageNotFound` — 404 → redirect to message page
- `reportError()` — stub ready for Sentry/custom log service integration

### Platform Abstraction Layer

`src/platform/app/` and `src/platform/device/` use **conditional compilation** (`#ifdef APP-ANDROID`, `#ifdef WEB`, etc.):

Pattern: `types.ts` (interface) → `android.ts`/`web.ts` (implementations) → `index.ts` (conditional re-export).

### State Management

`src/stores/app.ts` — Pinia store with typed `UserInfo`:

| Field | Type | Purpose |
|---|---|---|
| `ready` | `boolean` | Bootstrap complete |
| `token` | `string` | Auth token |
| `userInfo` | `UserInfo \| null` | Current user |
| `isFirstLaunch` | `boolean` | First-launch flag |
| `push_id` | `string` | uniPush client ID |

Getter: `isLoggedIn`, Action: `clearAuth()`.

### Utility Modules

| Module | Purpose |
|---|---|
| `src/utils/storage.ts` | Typed storage wrapper (`getItem<T>`, `setItem`, `getJSON`, `setJSON`) + `STORAGE_KEYS` constants |
| `src/utils/toast.ts` | Unified toast/loading: `showToast`, `toastSuccess`, `toastError`, `withLoading` (nesting-safe) |
| `src/utils/permission.ts` | Android runtime permission request helpers |
| `src/hooks/useNetwork.ts` | Network status composable + `setupNetworkListener()` for App.vue |
| `src/hooks/useAuthGuard.ts` | Page-level auth guard (calls `checkToken` on `onShow`) |

### i18n

`src/locales/index.ts` — `createI18n` instance with `zh` and `en` messages. Registered in `main.ts`. Usage: `{{ $t("login.title") }}` in templates or `useI18n()` in setup.

### Subpackage Structure

WeChat Mini Program subpackages under `subpackages/message/` (chat, group). Preloaded when entering message tab (`pages.json` → `preloadRule`).

### Component Auto-Import (easycom)

`<uni-*>` → `@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue`
`<t-*>` → `@tdesign/uniapp/$1/$1.vue`

No manual imports needed in pages.

## Page Map

```
/pages/splash/index      → Splash/boot screen
/pages/login/index       → Login (username/password/captcha, API-ready)
/pages/message/index     → Tab 1: Message list
/pages/contacts/index    → Tab 2: Contacts (shell)
/pages/workbench/index   → Tab 3: Workbench (shell)
/pages/mine/index        → Tab 4: Mine/Profile (shell)
/subpackages/message/chat/index   → Chat page
/subpackages/message/group/index  → Group chat page
```

## Code Conventions

- **Prettier**: 4-space tabs, semicolons, double quotes, no trailing commas, 120 char print width, LF line endings
- **TypeScript**: strict mode, `verbatimModuleSyntax`, `@/*` alias for `src/*`
- **Vue**: Composition API with `<script setup>`, typed store with `UserInfo`
- **Conditional compilation**: uni-app preprocessor directives (`#ifdef`, `#ifndef`, `#endif`) for platform-specific code
- **Imports**: use `@/` path alias, barrel exports from `@/types` and `@/utils`

## Key Constraints

- **DEV_MODE** (env `VITE_DEV_MODE=true`) controls: auth guard bypass, mock login, mock user data, verbose logging
- API endpoints are **TODO stubs** — search for `TODO` in http.ts, login/index.vue, and bootstrap files to find integration points
- No testing infrastructure — add Vitest when coverage is needed
- WeChat Mini Program builds require subpackage awareness — keep chat/group pages under `subpackages/message/`
- Conditional compilation (`#ifdef`/`#endif`) is compile-time — dead code stripped per platform build
- `unpackage/` is gitignored (uni-app build output)
