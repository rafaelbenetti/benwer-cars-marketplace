# Engineering Conventions

Same non-negotiable conventions as the admin web, adapted for a fully-public,
consumer-facing Next.js app. When in doubt, defer to the admin web's
[engineering.md](../../benwer-cars-admin-web/docs/engineering.md) — this doc calls
out the marketplace-specific differences.

---

## 1. Language & framework

- **Next.js 16 App Router** with **Server Components by default**.
- Add `"use client"` only when the component needs: interactivity/events, browser
  APIs, React Query, React state/effects, or a context hook.
- Keep `"use client"` at the leaves. Don't make a whole page a client component
  to satisfy one interactive button — extract the button.
- Read `node_modules/next/dist/docs/` before writing any Next.js-specific code
  (non-standard build — see `AGENTS.md`).
- Validate environment variables at boot with `@t3-oss/env-nextjs` + zod via
  `src/env.ts`; never read `process.env` ad hoc.

---

## 2. TypeScript

- **No `any`.** Use precise domain types.
- Enable `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride` in `tsconfig.json`.
- Prefer **explicit domain types** kept close to their feature; promote shared
  types to `src/types/*`.
- Use **`null`** for intentional absence.
- Model request/response shapes as interfaces in `src/types` or service files.
- Prefer discriminated unions over boolean flags for mutually exclusive state.

---

## Comments

**Do not comment code unless truly necessary.** Prefer names, types, and structure.
No narrating comments. Exception: a non-obvious constraint the next reader would get
wrong without it.

---

## 3. Naming & file structure

- Components: `PascalCase.tsx`. Hooks: `useThing.ts`. Services: `thing.ts`. Types: `thing.ts`.
- One component per file; co-locate tiny sub-components only if private to that file.
- **Pages must extract a named component** — never export an anonymous default:

  ```tsx
  function CarsPage() {
    return <CarListView />;
  }

  export default CarsPage;
  ```

- Folder map: see [architecture.md](./architecture.md).

---

## 4. No hardcoding — colors, text, business strings

| Never hardcode | Use instead | Source |
| --- | --- | --- |
| Colors (`#fff`, `rgb()`) | Semantic Tailwind tokens (`bg-primary`, `text-foreground`) | [ui-guidelines.md](./ui-guidelines.md#theming--tokens) |
| User-facing text | `t("some.key")` from i18n | `messages/<locale>/{common,marketplace}.json` |
| Business strings (statuses, query keys) | Enums/constants | `src/enums` |

i18n uses **next-intl** with ICU messages:

```tsx
import { useTranslations } from "next-intl";

const t = useTranslations("cars");
return <h1>{t("title")}</h1>;
```

- Keys are namespaced: shared `common` + per-app `marketplace`.
- Two locales: **`en-GB`** and **`es-ES`** under `messages/<locale>/`.
- Never hardcode a language code. Locale comes from the `NEXT_LOCALE` cookie.
- Never concatenate translated fragments — use ICU interpolation/plurals.

---

## 5. Data fetching — the layered architecture

```
Component → React Query hook → API service → client
```

Rules:

- **Never call `fetch()` (or the client) directly from a component or page.**
- Components consume a **custom hook** from `src/hooks`.
- Hooks call an **API service** from `src/services/api`.
- Services call the shared **client** (`./client`).
- Always type request and response shapes.

**API service** (one file per domain):

```ts
// src/services/api/vehicles.ts
import type { Vehicle } from "@/types/vehicle";
import { mockClient } from "./client";

export const vehiclesApi = {
  getByCompany(companySlug: string): Promise<Vehicle[]> {
    return mockClient.get<Vehicle[]>("/mock-data/vehicles.json");
  },
};
```

**React Query hook**:

```ts
// src/hooks/useVehicles.ts
import { vehiclesApi } from "@/services/api";
import { QueryKeys } from "@/enums";
import { useQuery } from "@tanstack/react-query";

export function useVehicles(companySlug: string) {
  return useQuery({
    queryKey: [QueryKeys.VEHICLES, companySlug],
    queryFn: () => vehiclesApi.getByCompany(companySlug),
  });
}
```

**Component** handles all states:

```tsx
const { data, isPending, isError, refetch } = useVehicles(companySlug);

if (isPending) return <CarGridSkeleton />;
if (isError) return <ErrorState onRetry={refetch} />;
if (!data?.length) return <EmptyState />;
return <CarGrid vehicles={data} />;
```

Query-key conventions:
- Arrays, namespaced by entity: `[QueryKeys.VEHICLES, slug]`, `[QueryKeys.VEHICLE, slug, id]`.
- Include every dependency that changes the result.
- Add reusable keys to the `QueryKeys` enum.

**Server prefetch** (RSC + React Query):

```tsx
const queryClient = new QueryClient();
await queryClient.prefetchQuery({
  queryKey: [QueryKeys.VEHICLES, companySlug],
  queryFn: () => vehiclesApi.getByCompany(companySlug),
});

return (
  <HydrationBoundary state={dehydrate(queryClient)}>
    <CarListView companySlug={companySlug} />
  </HydrationBoundary>
);
```

---

## 6. Error handling

- **Never silently swallow an error.** Catch → log with context → re-throw if
  the caller must react.
- Surface failures in the UI with an error state.
- Put domain error messages in the `ErrorMessages` enum, not inline strings.
- Always log through `@/lib/logger` (`logError`, `logMessage`).

The API returns RFC 9457 Problem Details with a stable `code`. The `code` is the
i18n key:

```jsonc
// messages/en-GB/common.json
{
  "errors": {
    "reservation": { "overlap": "This vehicle is already booked for those dates." }
  }
}
```

`ApiError` (in `src/lib/errors/ApiError.ts`) carries the parsed details:
`status`, `code`, `fieldErrors`, `detail` (logs only — never displayed).

`getErrorKey(error)` maps any error to an i18n key with fallbacks.

**Booking form errors:**

```ts
useMutation({
  mutationFn: (payload) => reservationsApi.create(companySlug, payload),
  onError: (error) => {
    logError(error, { context: "reservation_create" });
    if (!applyFieldErrors(error, setError, t)) toast.error(getMessage(error));
  },
});
```

---

## 7. Performance

- Server Components by default; keep client bundles small.
- **Never use raw `<img>`** — use `next/image` with explicit dimensions.
  Car photos come from CloudFront; `remotePatterns` is configured in `next.config.ts`.
- One LCP image per page (hero car photo) gets `priority`.
- `next/font` with `display: "swap"`; no CSS `@import` fonts.
- Defer booking form and calendar with `next/dynamic`.

---

## 8. Accessibility (baseline)

- Every interactive element is keyboard reachable with a visible focus ring.
- Use semantic elements (`button`, `a`, `nav`); add ARIA only to fill gaps.
- Label icon-only controls (`aria-label` from i18n).
- All clickable elements show `cursor-pointer`.
- Respect `prefers-reduced-motion`.
- WCAG AA contrast in light and dark.

---

## 9. Definition of done (per feature)

- [ ] Server/Client boundary is correct and minimal.
- [ ] Data goes through hook → service → client; types defined.
- [ ] Loading, empty, error, and success states are handled.
- [ ] No hardcoded colors, text, or business strings.
- [ ] Keyboard accessible with visible focus.
- [ ] `npm run lint` passes; no `any`; no dead code or stray comments.
- [ ] Work is on a branch from latest `main` and shipped as a **pull request**.

---

## 10. Git workflow

Never commit directly to `main`. Always `git fetch` and update `main`,
branch from it, commit on the feature branch, and **open a pull request**.
Do not merge unless asked.
