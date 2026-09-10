# Product

## What Benwer Cars Marketplace is

A consumer-facing platform where end customers browse available rental cars and make
reservations. It is part of the Benwer Cars ecosystem alongside the admin platform
(where rental companies manage their fleet) and the API (shared backend).

## Two operating modes

### 1. Tenant subdomain (`denver-cars.benwer.es`)

A rental company activates their branded storefront. Customers see only that company's
available cars, styled with the company's brand colours. The URL is their company slug
as a subdomain.

### 2. Global marketplace (`marketplace.benwer.es`)

A single marketplace listing cars from all participating companies. Customers can
search by company, location, or car type, then book from any company.

Both modes use the **same components, hooks, and booking flow**. The only difference is
how the active company context is resolved (from subdomain vs. from the URL path).

## Who uses it

End customers of rental companies — people who want to rent a car. They are not
operators and have no account. The experience must be simple, visual, and fast.

## Pages

| Page | Mode | Purpose |
| --- | --- | --- |
| **Home** | Tenant | Company hero + car grid + date search |
| **Home** | Marketplace | Company search + featured listings |
| **Companies** | Marketplace | Browse all participating companies |
| **Company page** | Marketplace | One company's car grid (same layout as tenant home) |
| **Car detail** | Both | Photos, specs, price, availability calendar, booking CTA |
| **Book** | Both | Guest booking form (name, email, phone, dates) |
| **Booking confirmation** | Both | Post-booking summary + confirmation token |
| **Booking status** | Both | Reservation lookup via token from confirmation email |

## Guest booking flow

No account required. Customer:

1. Selects a car and dates.
2. Fills in name, email, and phone number.
3. Confirms. The API creates the reservation and sends a confirmation email.
4. The email contains a link to `/booking/[token]` where the customer can track status.

## Branding

Each company has a `primaryColor` and optional `logoUrl` stored in the API. In tenant
subdomain mode these are applied as CSS variables on `<html>` so all semantic token
classes (`bg-primary`, `text-primary`, etc.) automatically adopt the company's brand.
In global marketplace mode the Benwer Cars brand is used.

## Not in scope

Payments, invoices, customer accounts/login, real-time chat, reviews. Build these only
when explicitly specified.

## Domain status values

Resolved from enums in `src/enums` — never hardcode these strings.

- **Vehicle:** `available` · `reserved` · `rented` · `maintenance`
- **Reservation:** `draft` · `confirmed` · `active` · `completed` · `cancelled`
- Only vehicles where `status = available` and `isPublic = true` are shown.

> Business rules (overlap prevention, availability math, status transitions) are
> enforced by the **API**. The marketplace presents data and sends requests only.

## Publish controls (set in admin web)

- **Company level** — `isPublic: boolean`: whether the company appears on the
  global marketplace. A company can have their subdomain active without being listed
  globally.
- **Vehicle level** — `isPublic: boolean`: whether a specific car is listed publicly.
  A vehicle can be internal-only (visible in admin) without appearing on the
  marketplace.
