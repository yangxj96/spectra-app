# AGENTS.md

This file provides guidance to the AI agent when working with code in this repository.

## Project Overview

Cross-platform app ("光谱/Spectra") built with **uni-app + Vue 3 + TypeScript**. Targets H5 (web) and WeChat Mini Program. Uses Pinia for state, TDesign (`@tdesign/uniapp`) and uni-ui for components.

## Commands

```bash
pnpm dev:h5            # H5 dev server
pnpm dev:mp-weixin     # WeChat Mini Program dev (output in dist/dev/mp-weixin, open with WeChat DevTools)
pnpm build:h5          # H5 production build
pnpm build:mp-weixin   # WeChat Mini Program production build
pnpm type-check        # vue-tsc --noEmit (no test framework configured)
pnpm format            # prettier --write .
```

## Critical: uni-app, Not Standard Vue

- Use `uni.*` APIs for storage (`uni.getStorageSync`), navigation (`uni.navigateTo`), requests (`uni.request`), etc. Do NOT use browser APIs like `localStorage`, `window.location`, or `fetch`.
- Routes are declared in `src/pages.json`, not Vue Router. Add pages there before using them.
- Subpackages (`src/subpackages/`) enable code splitting for mini programs. Register in `pages.json` under `subPackages`.

## Component Auto-Registration (easycom)

Components from uni-ui and TDesign are auto-registered — do NOT import them manually:
- `<uni-xxx>` → `@dcloudio/uni-ui` (e.g. `<uni-icons>`)
- `<t-xxx>` → `@tdesign/uniapp` (e.g. `<t-button>`)

## API Convention

All API responses follow `{ code: number, data: T, msg: string }`. Code `0` means success; non-zero is an error. Use `get()`, `post()`, etc. from `src/services/request.ts` — never call `uni.request` directly in business code.

## Path Alias

`@/` maps to `src/`. Configured in both `vite.config.ts` and `tsconfig.json`.

## Code Style (Prettier — differs from defaults)

4-space indent, 120 print width, double quotes, no trailing commas, LF line endings. Run `pnpm format` to apply.

## Environment Variables

Defined in `.env.development` / `.env.production`, accessed via `src/config/env.ts`. Key vars: `VITE_API_BASE_URL`, `VITE_DEV_MODE` (skips auth checks), `VITE_APP_TITLE`. Business code imports from `@/config/env`, never reads `import.meta.env` directly.

## Auth Flow

Token stored via `uni.setStorageSync("token", ...)`. Route interceptor in `src/interceptor/route.ts` guards navigation. HTTP layer in `src/services/http.ts` handles 401 with automatic token refresh. White-listed routes (splash, login) skip auth.

## Toolchain

- Node 24.14.0 / pnpm 11.0.9 (pinned in `mise.toml`)
- Vue 3.4.27, TypeScript ~5.4.5, Vite 5.2.8
