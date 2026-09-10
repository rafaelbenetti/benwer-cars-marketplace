# Testing

Same stack as the admin web: **Playwright** for end-to-end and **Vitest + React
Testing Library** for unit tests. See [tech-decisions.md](./tech-decisions.md).

---

## Principles

- No comments in tests. Test names and locator names must say everything.
- Tests are independent and isolated — no shared mutable state.
- Prefer **web-first assertions** (`await expect(locator).toBeVisible()`).
- Cover the four UI states for each feature: loading, empty, error, success.
- Never assert hardcoded UI strings — always use translation keys.

---

## Locator strategy (priority order)

1. Semantic: `getByRole()`, `getByLabel()`, `getByText()`.
2. `getByTestId()` only when no semantic locator works.
3. CSS/XPath as last resort.

---

## File organization

```
e2e/
  fixtures/
    test-fixtures.ts
  i18n/
    translations.ts
  cars/
    cars.spec.ts
    cars.filters.spec.ts
  booking/
    booking.spec.ts
    booking.confirmation.spec.ts
  companies/
    companies.spec.ts
  reservation-status/
    reservation-status.spec.ts
```

---

## Two-mode testing

Both tenant subdomain and global marketplace modes must be tested. Use Playwright
projects to simulate each host:

```ts
// playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: "marketplace",
      use: {
        baseURL: "http://localhost:3002",
        extraHTTPHeaders: { host: "localhost:3002" },
      },
    },
    {
      name: "tenant",
      use: {
        baseURL: "http://localhost:3002",
        extraHTTPHeaders: { host: "denver-cars.benwer.es" },
      },
    },
  ],
});
```

---

## i18n testing

Loop over all supported locales:

```ts
// e2e/i18n/translations.ts
import enGB from "../../messages/en-GB/marketplace.json";
import esES from "../../messages/es-ES/marketplace.json";

export const translations = { "en-GB": enGB, "es-ES": esES } as const;
export type Language = keyof typeof translations;
export const languages: Language[] = ["en-GB", "es-ES"];
```

```ts
import { languages, getTranslation } from "../i18n/translations";
import { StorageKeys } from "../../src/enums";

languages.forEach((lang) => {
  const t = getTranslation(lang);

  test.describe(`Cars (${lang})`, () => {
    test.beforeEach(async ({ page, context }) => {
      await context.addCookies([
        { name: StorageKeys.LOCALE, value: lang, url: "http://localhost:3002" },
      ]);
      await page.goto("/");
    });

    test("should display the cars title", async ({ page }) => {
      await expect(
        page.getByRole("heading", { name: t.cars.title }),
      ).toBeVisible();
    });
  });
});
```

---

## Network mocking

- Prefer **MSW** handlers (shared with dev and unit tests).
- Fall back to `page.route()` for per-test overrides.
- Test both success and error scenarios (drive the UI error state).

---

## Booking flow e2e

The booking flow must be tested end-to-end with a real or mocked API response:

1. Navigate to a car detail page.
2. Select dates.
3. Click "Book now".
4. Fill in guest details.
5. Submit and assert the confirmation page shows the token.
6. Navigate to `/booking/[token]` and assert the status displays.

---

## Accessibility

Run `@axe-core/playwright` on key pages; fail on `serious`/`critical` violations.
Keep `eslint-plugin-jsx-a11y` green.
