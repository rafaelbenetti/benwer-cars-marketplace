# Technology Decisions

Same stack as `benwer-cars-admin-web` unless noted. This doc calls out marketplace-specific
decisions and differences.

## Core (in repo)

| Area | Choice | Version |
| --- | --- | --- |
| Framework | Next.js (App Router, non-standard build) | 16 |
| UI runtime | React | 19 |
| Language | TypeScript (strict) | 5 |
| Styling | Tailwind CSS v4 + semantic CSS-variable tokens | 4 |
| Primitives | Radix UI + `cva`/`cn` | — |
| Server state | TanStack React Query | 5 |
| Icons | lucide-react | current |
| i18n | next-intl + ICU messages | current |
| Toasts | sonner | 2 |

## Planned additions

| Need | Choice | Why |
| --- | --- | --- |
| Forms + validation | react-hook-form + zod | Same as admin web. |
| Date picker | react-day-picker (or built on Radix) | Availability calendar needs a range picker with disabled dates. |
| List/filter URL state | nuqs | Filters, dates, sort live in the URL — shareable, bookmarkable. |
| Dates | date-fns + date-fns-tz | ISO 8601 UTC transport, format at the edge. |
| API mocking | MSW | Real client runs everywhere; MSW intercepts in dev + tests. |
| Unit tests | Vitest + @testing-library/react | Modern, fast, ESM-native. |
| a11y | @axe-core/playwright + eslint-plugin-jsx-a11y | Regression coverage. |
| Error monitoring | Sentry via `@/lib/logger` | Swap-able; call sites never import the vendor. |
| Env validation | @t3-oss/env-nextjs + zod | Fail fast on missing env at boot. |
| Typed API client | openapi-fetch (generated from API spec) | No hand-written DTOs; same spec as admin + mobile. |

## Do NOT use (rejected)

| Rejected | Use instead | Reason |
| --- | --- | --- |
| sweetalert2 | sonner (toasts) + Radix Dialog | Off-brand, heavy. |
| Raw `fetch()` in components | hook → service → client | Breaks the layered data flow. |
| Redux / MobX | React Query + URL + local state | No global store need. |
| CSS-in-JS / inline `style={{theme.colors}}` | Tailwind semantic tokens | Runtime cost, no `hover:`/`dark:` states. |
| Moment.js | date-fns | Unmaintained, heavy, mutable. |

## Marketplace-specific decisions

### No authentication

The marketplace is fully public. No login page, no session, no auth context, no
middleware auth guard. Guest checkout collects name/email/phone. The API issues a
`token` which the customer uses to look up their reservation.

### Subdomain routing

Next.js middleware reads the `host` header to detect which company's subdomain is
being served. The resolved `companySlug` is forwarded as an `x-company-slug` request
header so Server Components don't re-parse the host. This works on Vercel, Railway,
and Fly.io — any platform that preserves the `host` header.

### Per-tenant colour theming

Company brand colour is applied as a CSS custom property (`--primary`) on `<html>`
in the tenant layout's Server Component. All downstream components use semantic
Tailwind tokens; no component-level changes are needed to support any reasonable
brand colour.

### Guest reservation confirmation email

The API uses **Resend** to send a transactional confirmation email on reservation
creation. The email contains a link to `/booking/[token]`. This is an API
infrastructure concern, not a frontend concern.

### SEO

Consumer-facing pages require proper metadata. Every route exports `generateMetadata`
with per-page title, description, and Open Graph tags. Car detail pages include
JSON-LD structured data. The sitemap is generated at build time.
