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

Query params: `?q=` (search by name/location), `?cursor=&limit=`.

Returns companies where `isPublic = true`.

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

Response: `{ vehicleId: string, unavailableDates: string[] }[]`

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
