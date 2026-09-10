import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as "en-GB" | "es-ES")) {
    locale = routing.defaultLocale;
  }

  const [common, marketplace] = await Promise.all([
    import(`../../messages/${locale}/common.json`),
    import(`../../messages/${locale}/marketplace.json`),
  ]);

  return {
    locale,
    messages: {
      ...common.default,
      ...marketplace.default,
    },
  };
});
