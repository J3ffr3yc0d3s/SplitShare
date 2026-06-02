# SplitShare Status

## ✅ Current project status

- UI theme: light/dark mode working
- Routing and navigation: working
- DM Sans font: applied
- Zustand stores: auth and UI stores implemented and confirmed
- TanStack Query: confirmed working
- Next.js traces: removed
- Mock/real API toggle: completed for all 7 services
- Shared API client: `src/lib/apiClient.ts` created
- Environment typing: `vite-env.d.ts` added

## 🔧 Dev mode note

The app currently supports mock mode for frontend development. Once the backend and database are connected, `VITE_USE_MOCK` should be set to `false`, and the mock toggle / dev-only service paths can be removed or disabled in production.

## 🚀 Backend + database integration

### Frontend changes

1. Set the API target in `.env`:

```env
VITE_USE_MOCK=false
VITE_API_URL=https://your-nest-api.com
```

2. Ensure frontend requests use the shared client in `src/lib/apiClient.ts`.
3. Keep all mock service logic behind the `VITE_USE_MOCK` flag until the backend is ready.

### NestJS backend

1. Scaffold a NestJS app with auth, expense, balance, friend, settlement, activity, and dashboard endpoints.
2. Create controllers and services that mirror the frontend API routes used by the client.
3. Add JWT auth or session handling so the frontend can send `Authorization: Bearer <token>`.

### Database integration

1. Use Prisma to connect to your Supabase Postgres database.
2. Add `DATABASE_URL` to NestJS environment variables, pointing to the Supabase Postgres URL.
3. Model users, expenses, balances, friends, settlements, and activity in `schema.prisma`.
4. Use Prisma client inside your NestJS services to fetch and mutate data.

### Supabase role

- Supabase is only the database provider for the NestJS backend.
- The frontend should never communicate directly with Supabase.
- All frontend data access goes through NestJS.

## 🧭 What to build next

1. **Implement real feature pages** — build Expenses, Friends, Balances UI using the existing mock-backed API flow.
2. **Write tests** — add unit tests for stores and component tests for auth pages with Vitest.
3. **Start NestJS backend** — scaffold the NestJS API and connect Prisma to Supabase so you can flip `VITE_USE_MOCK=false`.
