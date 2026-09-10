import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en-GB", "es-ES"],
  defaultLocale: "en-GB",
  localeDetection: false,
  // Never add a locale segment to URLs (/en-GB/...). The locale is stored
  // in the NEXT_LOCALE cookie and resolved server-side via request.ts.
  localePrefix: "never",
});
