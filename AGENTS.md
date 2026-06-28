# AGENTS.md

## Project Overview

This is a **uni-app** (Vue 3) project for cross-platform development (H5/WeChat Mini Program). Uses TypeScript, Vite, and pnpm.

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

## Notes

- Path alias: `@/` → `src/`
- Node 24.14.0, pnpm 11.0.9 (via mise)
- Build outputs to `unpackage/`
