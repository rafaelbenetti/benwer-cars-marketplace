# API Plan — Public Endpoints

Requirements for the **public surface** of `benwer-cars-api` that serves this
marketplace. All endpoints are **unauthenticated**. They must be added under
`/v1/public/` to keep them separate from the authenticated tenant routes.

This is a frontend-authored contract — the API lives in its own repository.

---

## 1. Principles

- All endpoints under `/v1/public/` — no auth required, no session cookie.
- Rate-limited: `429 + Retry-After` to prevent abuse.
- Same RFC 9457 Problem Details error shape as authenticated routes.
- Only companies with `isPublic = true` are returned.
- Only vehicles with `isPublic = true` AND `status = available` are returned.
- Locale-independent: returns codes/enums; clients localize.

---

## 2. Company `slug` field (API change required)

Every company needs a stable, URL-safe, unique `slug` field:
- Set on company creation (from the company name, slugified).
- Immutable via self-service; changeable by platform admin only.
- Validated unique across all tenants.
- Used for: subdomain (`denver-cars.benwer.es`), URL paths (`/companies/denver-cars`),
  and all public API paths (`/v1/public/companies/denver-cars/…`).

Add `slug` to the `Company` resource in the OpenAPI spec.

---

## 3. Publish controls (API changes required)

Two new boolean fields, both default `false`:

**On `Company`:** `isPublic: boolean`
- When `true`, the company appears on the global marketplace.
- A company can have their subdomain active while `isPublic = false` (private storefront).

**On `Vehicle`:** `isPublic: boolean`
- When `true`, the vehicle is listed on the public marketplace.
- Independent of the internal `status` field.

Both are settable by `owner` or `manager` roles from admin web Settings.

---

## 4. Endpoints

### Companies (global marketplace)

```
GET  /v1/public/companies
```

Response: `{ data: Company[], page: { total, nextCursor } }`

Query params: `?q=` (search by name/location), `?location=&from=&to=`, `?cursor=&limit=`.

Returns companies where `isPublic = true`. The current API seed exposes **3 `isPublic` companies** (2 in Málaga
province). A sparse marketplace directory is expected until more companies
are published — not a client filter bug. Seed companies for
`location=malaga` include `med-rentacar` and `benetti-cars`.

Company fields include `slug`, branding, `location` / `locationSlug`, optional
`latitude` / `longitude`, and `vehicleCount`. The marketplace map prefers API
coordinates and falls back to `src/data/malagaCityCoordinates.ts` city
centroids when lat/lng are omitted. The mock layer still derives `vehicleCount`
from listed vehicles (and the current `from`/`to` window).

---

```
GET  /v1/public/companies/{slug}
```

Response: `Company & { branding: { primaryColor, logoUrl } }`

Returns the company profile + branding for layout injection. Used by both subdomain
and global marketplace modes. Returns `404` for unknown slug or `isPublic = false`
(unless the subdomain was accessed directly — treat as private storefront, show
company data but not on global listing).

---

### Vehicles

```
GET  /v1/public/companies/{slug}/vehicles
```

Response: `{ data: Vehicle[], page: { total, nextCursor } }`

Query params: `?type=&seats=&transmission=&from=&to=&q=&sort=pricePerDay:asc&cursor=&limit=`

Returns vehicles where `isPublic = true` AND `status = available`. When `from`/`to`
are provided, also excludes vehicles with conflicting confirmed/active reservations.

---

```
GET  /v1/public/companies/{slug}/vehicles/{id}
```

Response: `Vehicle` (full detail including `photos`, `description`).

---

### Availability

```
GET  /v1/public/companies/{slug}/availability
```

Query params: `?from=&to=&vehicleId=` (vehicleId optional — if omitted, returns for
all public vehicles in the company).

Response: `[{ vehicleId, unavailableDates, available }]` (required `from`/`to`;
`vehicleId` optional). Clients also accept a `{ data, page }` envelope.

---

### Reservations (guest booking)

```
POST /v1/public/companies/{slug}/reservations
```

Request body:
```json
{
  "vehicleId": "string",
  "startDate": "2026-09-15",
  "endDate": "2026-09-20",
  "guestName": "string",
  "guestEmail": "string",
  "guestPhone": "string"
}
```

Response: `GuestReservation` (includes `token`, `totalPrice`, `currency`).

On success:
- API creates the reservation with `status = confirmed`.
- Sends a confirmation email via **Resend** to `guestEmail` with:
  - Reservation summary (vehicle, dates, total).
  - Link to `GET /booking/[token]` on the marketplace.
- Returns the full `GuestReservation` object.

Errors:
- `409 reservation.overlap` — dates conflict with existing reservation.
- `400` field validation errors with per-field `errors[]`.
- `404 vehicle.not_found` — vehicle doesn't exist or isn't public.

---

```
GET  /v1/public/reservations/{token}
```

Response: `GuestReservation & { vehicle: Vehicle, company: Company }`

Returns the full reservation with vehicle and company detail for the status page.
Returns `404 reservation.not_found` for unknown or expired tokens.

---

## 5. Error shape

Same RFC 9457 Problem Details as authenticated routes:
```json
{
  "type": "https://benwer.es/errors/reservation.overlap",
  "title": "Reservation conflict",
  "status": 409,
  "code": "reservation.overlap",
  "detail": "Vehicle v1 has a confirmed reservation from 2026-09-15 to 2026-09-18."
}
```

`code` maps 1:1 to i18n keys (`errors.reservation.overlap`) on the frontend.

---

## 6. Infrastructure

### Email (Resend)

The API uses **Resend** for transactional emails. Required on reservation creation.
Configure via env var: `RESEND_API_KEY`.

### Rate limiting

Public endpoints are rate-limited per IP:
- `GET` endpoints: 100 req/min.
- `POST /reservations`: 10 req/min (stricter to prevent spam bookings).

### CORS

Allow the marketplace origins: `marketplace.benwer.es`, `*.benwer.es`, and
`localhost:3002` (dev). Credentials not required (no cookies).

---

## 7. Deliverables checklist (for the API repo)

- [ ] `slug` field on `Company` resource (unique, immutable, in OpenAPI spec).
- [ ] `isPublic` on `Company` and `Vehicle` (default `false`, settable by manager/owner).
- [ ] All `/v1/public/` endpoints implemented, rate-limited, CORS-allowed.
- [ ] Resend integration for guest reservation confirmation email.
- [ ] Public endpoints in the OpenAPI spec (for client generation).

---

## 8. Live API notes (marketplace client)

**Source of truth (in flight):** [benwer-cars-api#20](https://github.com/rafaelbenetti/benwer-cars-api/pull/20)
(open — do not assume merged). That PR fills public `photos[]` / `photoUrl` from
the same attachments (`kind=vehicle_photo`) + stock_photo fallback admin uses,
maps invalid `type=car` to economy/sedan/other, and fixes CORS 403 on
`/v1/public/*` for `marketplace.benwer.es`. Until it ships, public vehicles may
still return `photos: []`. **Never run `db/seed/seed.sql` on production** (it
truncates). Image upload only: `./db/seed/upload-seed-images-to-s3.sh` per the
API `db/seed/README.md`.

The marketplace prefers the live API whenever `API_ORIGIN` / `NEXT_PUBLIC_API_URL`
is set. Mock JSON is used only when `NEXT_PUBLIC_ENV=local` **and**
`NODE_ENV` is not `production` and those URLs are unset or the API is unreachable
(network / CORS `Failed to fetch`). Staging and production never substitute mock
cars — CORS/API failure must surface as an error or empty catalogue, never
`/mock-data/cars/*.jpg`.

| Contract | Marketplace handling |
| --- | --- |
| List endpoints return `{ data, page }`, not raw arrays. | `unwrapList` reads `payload.data` first. Raw arrays (older deploys) still unwrap. `public/mock-data/*.json` uses the same envelope. |
| Companies accept `location`, `from`/`to`, `q`, cursor pagination. Fields include `slug`, branding, `location`/`locationSlug`, optional lat/lng, `vehicleCount`. `location=malaga` seeds include `med-rentacar` and `benetti-cars`. | Live client sends those query params, including province-wide `malaga`. Client-side city filtering skips `malaga`. Map pins prefer API coordinates. |
| Vehicle `type`/`category` query values are `economy\|sedan\|suv\|minivan\|van\|other`. `type=car` is invalid on current API (empty list). | Marketplace never sends `type=car`. UI “Car” omits the query and filters economy/sedan/other/`car` client-side after mapping. SUV/van send `suv`/`van`. |
| Vehicles expose aliases `brand`, `type`, `pricePerDay`, `fuel` plus admin names (`make`, `category`, `dailyRate`, `fuelType`). Photos may be `photos[]`, `photoUrl`, or attachments `kind=vehicle_photo` (stock_photo fallback). CDN/S3 URLs, protocol-relative hosts, signed URLs, or object keys. | Mapper prefers marketplace aliases, then admin names. Attachment `vehicle_photo` wins over `stock_photo`. `http(s)` and `//host/...` photo URLs are passed to `next/image`. Bare keys and `s3://bucket/key` are prefixed with `NEXT_PUBLIC_MEDIA_ORIGIN` when set; otherwise they are dropped and the UI shows the photo empty-state (never a mock Corolla/SUV/Tesla jpg). LocalStack hosts (`localhost:4566`, `127.0.0.1:4566`) are rewritten to same-origin `/localstack/...`. |
| Empty public fleets (`is_public=false` on vehicles) are expected. Admin still cannot set that flag on create/update. | Company page is not an error: empty state explains the fleet is not public yet. |
| Availability: required `from`/`to`; optional `vehicleId`; shape `[{ vehicleId, unavailableDates, available }]`. | One GET; `mapAvailabilityList` accepts a raw array, `{ data }`, or a single legacy `{ available, vehicleId, conflicts }` object. |
| Guest POST reservations + GET by token with nested `vehicle` + `company`. `409 reservation.overlap`. RFC 9457 validation. | `mapReservation` reads nested resources, `grandTotal`/`totalAmount`, and `customer`. Field aliases (`vehicleID`, `after_start`). Empty 409 → `reservation.overlap`. |
| CORS allows `localhost:3002` and, after API #20, `marketplace.benwer.es`. Production previously got CORS 403 on `/v1/public/*` and the client fell back to mock jpgs. | Set `API_ORIGIN` to the API **origin** (`https://cars-api.benwer.es`), never `…/v1`. The client strips `/v1` and collapses `/v1/v1`. In production the browser prefers the same-origin `/api` BFF when `NEXT_PUBLIC_API_URL` is cross-origin. CORS failure still must not revive mock photos. |

`npm run generate:api` uses `openapi/public.json` until production swagger
includes `/public/` paths. Keep the raw-array unwrap so an older Railway
deploy does not blank the marketplace.
