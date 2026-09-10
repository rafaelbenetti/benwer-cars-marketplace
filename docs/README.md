# Benwer Cars Marketplace — Documentation

A consumer-facing Next.js (App Router) application serving two modes from a single
codebase: per-company branded subdomains and a global multi-company marketplace.

This folder is the **source of truth** for how we build this frontend. When a rule
here conflicts with older code, the docs win and the code should be migrated.

## Read in this order

| Doc | Read it when you want to know… |
| --- | --- |
| [product.md](./product.md) | What we're building, for whom, and the two operating modes |
| [architecture.md](./architecture.md) | Middleware mode detection, routing, folder layout, data flow |
| [engineering.md](./engineering.md) | Non-negotiable coding conventions (TS, i18n, errors, data, enums) |
| [ui-guidelines.md](./ui-guidelines.md) | Design system: tokens, components, layout, states, a11y |
| [tech-decisions.md](./tech-decisions.md) | Libraries we use (and rejected) and why |
| [api-plan.md](./api-plan.md) | Public API contract the marketplace expects from the backend |
| [testing.md](./testing.md) | How we test (Playwright e2e + Vitest unit) |

## The 10-second version

- **Stack:** Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS v4 · React Query · next-intl.
- **Two modes, one codebase.** Middleware detects subdomain vs. global marketplace; injects `x-company-slug` header.
- **Server Components by default.** `"use client"` only for interactivity, browser APIs, React Query, or local state.
- **Layered data flow:** Component → React Query hook (`src/hooks`) → API service (`src/services/api`) → client.
- **No hardcoding:** colors from semantic Tailwind tokens; text from i18n; business strings from enums.
- **Every screen ships four states:** loading, empty, error, success.
- **No auth.** Fully public. Guest booking via name + email + phone; reservation tracked by confirmation token.
- **Git:** never commit to `main`. Pull latest, branch, open a PR.

## Current setup status (important for agents)

Several pieces are chosen but not yet scaffolded — do not import them until they exist:

- ❌ Sentry (via `@/lib/logger`) — scaffold exists as a `console.error` wrapper. Wire Sentry when configured.
- ❌ Vitest + React Testing Library — chosen for unit tests, not installed yet. See [testing.md](./testing.md).
- ❌ MSW — chosen mock/dev layer; not set up yet. Only a read-only `mockClient.get` over `public/mock-data/*.json` exists.
- ❌ Real HTTP client — `apiClient` is wired in `src/services/api/client.ts`; services switch to it once the API public endpoints are live.
- ✅ next-intl — wired with shared ICU messages under `messages/<locale>/{common,marketplace}.json`. Two locales: **British English (`en-GB`)** and **Spain Spanish (`es-ES`)**.
- ✅ Semantic Tailwind tokens — defined in `src/app/globals.css`; per-tenant `--primary` override supported.
- ✅ Middleware mode detection — `src/middleware.ts` injects `x-company-slug` from host header.
