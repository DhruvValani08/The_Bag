# Testing Strategy

## Current Testing Setup
- **Type Checking**: TypeScript static analysis executed via `tsc -b` during Vite build (`npm run build`).
- **Linter**: Oxlint configured via `.oxlintrc.json` in the `frontend` root.

## Automated Verification Steps
- Run TypeScript build check: `npm run build` in `frontend/`.
