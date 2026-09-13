"use server";

import { cookies } from "next/headers";
import { StorageKeys } from "@/enums";
import { routing } from "@/i18n/routing";

type AppLocale = (typeof routing.locales)[number];

function isAppLocale(value: string): value is AppLocale {
  return (routing.locales as readonly string[]).includes(value);
}

export async function setLocaleCookie(locale: string) {
  if (!isAppLocale(locale)) {
    return;
  }

  const store = await cookies();
  store.set(StorageKeys.LOCALE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
