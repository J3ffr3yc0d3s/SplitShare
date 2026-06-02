# Technical Debt Report

## Summary

The project is in a usable Vite-driven state, but it still has several areas to clean up before backend integration and production hardening.

Current progress:

- Theme system is working and uses CSS vars for light/dark mode
- Routing is functional and the UI shell is in place
- Zustand auth + UI stores are implemented
- TanStack Query is working with current service flow
- Legacy Next.js artifacts have been removed
- Central mock/real toggle exists across all service modules
- Shared API client is implemented
- Environment typing is added

## Remaining technical debt

### 1. Feature wiring and UI completion

- Many pages are still effectively placeholders and need full data integration:
  - Expenses
  - Friends
  - Balances
  - Settlements
  - Activity
  - Dashboard
  - Settings
- Frontend pages should consume the service layer via query hooks and render real state instead of stub content.
- Severity: High

### 2. Mock mode dependency and production readiness

- The app currently depends on `VITE_USE_MOCK` to decide between mock and backend behavior.
- Once NestJS + database are connected, mock mode should be removed and the fallback branches cleaned up.
- Severity: Medium

### 3. Backend contract and auth flow

- Backend endpoints need to be scaffolded to match the client route expectations.
- Auth flow should use JWT/session handling consistently and ensure `apiClient.ts` can pass auth headers.
- Severity: High

### 4. Database integration path

- The NestJS backend should connect to Supabase Postgres via Prisma.
- The frontend should never call Supabase directly.
- Severity: Medium

### 5. Dev-only artifacts and debug code

- Any dev/debug-only UI or tooling should be removed or gated before production deployment.
- This includes temporary panels, logs, or any mock-specific UI.
- Severity: Low

## Recommended cleanup actions

1. Remove remaining mock-only logic after NestJS backend is available.
2. Add explicit backend endpoint contracts and ensure routes match the frontend API client.
3. Build or wire real feature pages for: Expenses, Friends, Balances, Settlements, Activity, Dashboard, Settings.
4. Add auth guard behavior and route fallback handling.
5. Trim unused dependencies and remove unreferenced legacy or template files.
6. Verify `vite-env.d.ts` and `apiClient.ts` across the app for consistent behavior.

## Notes for integration

- Set `VITE_USE_MOCK=false` and `VITE_API_URL=https://your-nest-api.com` once the backend is ready.
- NestJS should expose endpoints for auth, expenses, friends, balances, settlements, activity, and dashboard metrics.
- Prisma in NestJS should use Supabase Postgres via `DATABASE_URL`.
- Frontend should remain API-driven and not reference Supabase directly.
