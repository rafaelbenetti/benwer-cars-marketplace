import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en-GB", "es-ES"],
  defaultLocale: "en-GB",
  localeDetection: false,
});
