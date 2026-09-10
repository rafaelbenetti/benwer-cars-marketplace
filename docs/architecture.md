# Architecture

Frontend-only Next.js App Router app. The API, admin web, and mobile app are
separate repositories; **all clients share the same API**, and **all business rules
live in that API** — the marketplace presents data and requests changes only.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 ·
React Query · Radix primitives · lucide-react · next-intl.

## Two-mode rendering

One deployment, two entry-point experiences, determined by the request host:

```
host = "denver-cars.benwer.es"    →  tenant mode   →  slug = "denver-cars"
host = "marketplace.benwer.es"    →  global mode   →  slug = null
host = "localhost:3002"            →  global mode   →  slug = null (dev default)
```

The resolved `companySlug` is injected as a request header (`x-company-slug`) in
`src/middleware.ts`. Server Components read it via `headers()` without re-parsing
the host.

### Wildcard DNS

`*.benwer.es` must point to the marketplace deployment (wildcard `A`/`CNAME`).
`NEXT_PUBLIC_MARKETPLACE_DOMAIN=benwer.es` is the env var used by middleware to
distinguish subdomain requests from the main marketplace host.

## Route map

### Tenant subdomain (`denver-cars.benwer.es`)
```
/                         Company home — hero + car grid
/cars/[id]                Car detail + availability calendar + booking CTA
/book                     Booking form (query: carId, from, to)
/booking/[token]          Reservation status / confirmation
```

### Global marketplace (`marketplace.benwer.es`)
```
/                         Company search + featured listings
/companies                All companies
/companies/[slug]         Company page — their car grid
/companies/[slug]/cars/[id]  Car detail (company context from URL)
/book                     Booking form (query: companySlug, carId, from, to)
/booking/[token]          Reservation status / confirmation
```

`/book` and `/booking/[token]` are route-group-free — they work for both modes.

## Folder structure

```
src/
  app/
    (marketplace)/        Global marketplace routes (layout wraps these)
      page.tsx             Company search home
      companies/
        page.tsx
        [slug]/
          page.tsx
          cars/[id]/page.tsx
    (tenant)/             Tenant subdomain routes (layout reads x-company-slug)
      page.tsx             Company home
      cars/[id]/page.tsx
    book/
      page.tsx
    booking/[token]/
      page.tsx
    layout.tsx            Root layout — branding injection
    globals.css           Tailwind v4 entry + design tokens
  components/
    ui/                   Shared primitives (Button, Badge, Field, Skeleton, …)
    layout/               MarketplaceHeader, Footer, CompanyBanner
    features/             CarCard, CarGrid, BookingForm, ReservationStatus
  hooks/                  React Query hooks
  services/api/           One file per domain + index barrel + client
  enums/                  Business string constants
  types/                  Shared domain types
  lib/                    logger, utils (cn/cva), errors (ApiError, getErrorKey)
  i18n/                   next-intl routing + request config
  middleware.ts           Mode detection — host → company slug → x-company-slug header
messages/
  en-GB/  common.json  marketplace.json
  es-ES/  common.json  marketplace.json
public/
  mock-data/             JSON fixtures used by mockClient
```

## Rendering model

- **Server Components by default.** Route pages fetch data server-side and pass it
  down; use `HydrationBoundary` to seed React Query on the client.
- `"use client"` only for interactivity, browser APIs, React Query hooks, or local
  state — pushed to the **leaves**, not whole pages.

## Layers & data flow

```
Component  →  React Query hook (src/hooks)  →  API service (src/services/api)  →  client
```

- Components never call the client or `fetch()` directly.
- Hooks own caching, keys, and query/mutation state.
- Services own endpoints, grouped by domain.
- The **client** is the only place that touches the network.

### Current client

`src/services/api/client.ts` exposes:
- `mockClient.get<T>(path)` — fetches `public/mock-data/*.json`. Used in dev until the
  API public endpoints are live.
- `apiClient.get/post<T>` — real HTTP client targeting `NEXT_PUBLIC_API_URL`. Used for
  live reservation creation/lookup endpoints now; will replace `mockClient` entirely
  once the API is live.

## Per-tenant branding

In tenant subdomain mode the root layout fetches the company's branding and applies it
as CSS custom properties on `<html>`:

```tsx
// app/(tenant)/layout.tsx (Server Component)
const company = await companiesApi.getBySlug(slug);
return (
  <html
    style={{
      "--primary": company.branding.primaryColor,
    } as React.CSSProperties}
  >
    …
  </html>
);
```

All components use semantic tokens (`bg-primary`, `text-primary`, etc.) and
automatically adopt the company's colour with no component changes needed.

## State management

- **Server state → React Query** (caching, refetch, invalidation).
- **UI state → local component state**, lifted only as far as needed.
- **List state (filters, dates) → URL** via `nuqs`.
- **Cross-cutting → context** (Theme, Query). No global store.

## Auth

None. The marketplace is fully public. No middleware auth guard, no login page,
no `AuthContext`. Guest booking collects name/email/phone; the API returns a
confirmation token.

## Internationalization

User-facing text uses **next-intl** with **ICU MessageFormat**, namespaced as
`common` (shared) + `marketplace`. Locale comes from the `NEXT_LOCALE` cookie —
no locale-prefixed URLs. Two locales: **`en-GB`** and **`es-ES`**.

## Error handling

Errors are logged via `@/lib/logger` (wraps `console.error`; will forward to Sentry
when configured) and surfaced in the UI with the appropriate error state. Never
swallowed silently. See [engineering.md](./engineering.md#6-error-handling).
