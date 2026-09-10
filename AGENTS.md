<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

---

# Benwer Cars Marketplace — Agent Orientation

Consumer-facing marketplace for Benwer Cars: a single Next.js app serving
per-company branded storefronts (tenant subdomains) and a global multi-company
marketplace. **Frontend only** — the API and other clients live in separate
repositories.

## Before you code

**Do not write or edit code until these are read.** Nested docs are the source of
truth; do not start from generic Next/React memory.

1. Read [`docs/README.md`](./docs/README.md) — it indexes everything below.
2. Match the rule docs to your task:
   - [`docs/engineering.md`](./docs/engineering.md) — coding conventions (TS, i18n, data, errors, enums).
   - [`docs/ui-guidelines.md`](./docs/ui-guidelines.md) — design system, components, states, a11y.
   - [`docs/architecture.md`](./docs/architecture.md) — folders, layers, mode detection, data flow.
   - [`docs/tech-decisions.md`](./docs/tech-decisions.md) — which libraries we use (and rejected).
   - [`docs/api-plan.md`](./docs/api-plan.md) — what the backend API must provide (public endpoints).
   - [`docs/product.md`](./docs/product.md) — what & why, two modes, guest booking flow.
   - [`docs/testing.md`](./docs/testing.md) — Playwright e2e + Vitest unit.

## Hard rules (the short list)

- **Server Components by default**; `"use client"` only when truly needed, at the leaves.
- **Never** hardcode colors (use semantic theme tokens), user text (use i18n `t()`), or business strings (use `src/enums`).
- **Never** `fetch()` in a component: Component → hook (`src/hooks`) → service (`src/services/api`) → client.
- Every screen handles **loading, empty, error, success**.
- No `any`. Self-documenting code; **do not comment code** unless truly necessary.
- Pages export a **named** component, never an anonymous default.
- **Never use raw `<img>`** — use `next/image` with explicit dimensions or `fill`.
- **Env vars** — new vars need a sample in `.env.example` and in the `.env.local` block below.
- **Git** — never commit to `main`. Pull latest `main`, branch from it, open a PR.

## Commands

```bash
npm run dev        # dev server (port 3002)
npm run build      # production build
npm run lint       # eslint
npm run test:e2e   # Playwright
```

## Local development (mandatory for agents)

This marketplace talks to **`benwer-cars-api`** on `http://localhost:8080/v1`.

### 1. Start the API (sibling repo)

```bash
cd ../benwer-cars-api
docker compose -f docker-compose-local.yml up --build
```

Confirm: `curl -s http://localhost:8080/healthz`

### 2. Start the marketplace

```bash
cd ../benwer-cars-marketplace
npm run dev
```

Open `http://localhost:3002`. Copy `.env.example` → `.env.local`. Sample:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3002/api
API_ORIGIN=http://localhost:8080
NEXT_PUBLIC_APP_URL=http://localhost:3002
NEXT_PUBLIC_MARKETPLACE_DOMAIN=benwer.es
NEXT_PUBLIC_ENV=local
```

In local dev, middleware detects `localhost` and defaults to **global marketplace
mode** (no subdomain). To test tenant mode locally, set a custom `hosts` entry:
`127.0.0.1 denver-cars.localhost` and update `NEXT_PUBLIC_MARKETPLACE_DOMAIN=localhost`.

### When to rebuild what

| You changed… | Do this |
| --- | --- |
| API Go code / migrations | `docker compose … up --build` in `benwer-cars-api` |
| API routes / swagger | `make swag` in API, then `npm run generate:api` here |
| Marketplace UI only | `npm run dev` (API can stay running) |

## Not yet scaffolded — build before importing

- ❌ **MSW** — not set up; current client is `mockClient.get` over `public/mock-data/*.json`.
- ❌ **Real typed API client** — `apiClient` shell exists; generate from OpenAPI spec once public endpoints are live.
- ❌ **Vitest + RTL** — install before writing unit tests.
- ❌ **Sentry** — `@/lib/logger` exists as a `console.error` wrapper; wire Sentry when configured.
- ❌ **react-hook-form + zod** — install before building `BookingForm`.
- ❌ **nuqs** — install before adding URL-synced filters.
- ❌ **date-fns** — install before adding date formatting or the availability calendar.
- ❌ **shadcn/ui `cn()` / `cva`** — scaffolded in `src/lib/utils.ts`; install `class-variance-authority` and `clsx` before importing.
