"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { NavRoutes, StorageKeys } from "@/enums";

type CookieChoice = "all" | "necessary";

function readConsent(): CookieChoice | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.localStorage.getItem(StorageKeys.COOKIE_CONSENT);
  return value === "all" || value === "necessary" ? value : null;
}

export function CookieBanner() {
  const t = useTranslations("cookieBanner");
  const [choice, setChoice] = useState<CookieChoice | null | undefined>(undefined);

  useEffect(() => {
    setChoice(readConsent());
  }, []);

  if (choice !== null) {
    return null;
  }

  function accept(next: CookieChoice) {
    window.localStorage.setItem(StorageKeys.COOKIE_CONSENT, next);
    setChoice(next);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/95 px-4 py-4 shadow-[0_-12px_32px_color-mix(in_oklab,var(--foreground)_12%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 pb-[env(safe-area-inset-bottom)] md:flex-row md:items-center md:justify-between">
        <p className="max-w-2xl text-sm text-muted-foreground">
          {t("body")}{" "}
          <Link
            href={NavRoutes.COOKIES}
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            {t("policy")}
          </Link>
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="secondary" onClick={() => accept("necessary")}>
            {t("necessary")}
          </Button>
          <Button onClick={() => accept("all")}>{t("accept")}</Button>
        </div>
      </div>
    </div>
  );
}

export function hasAnalyticsConsent(): boolean {
  return readConsent() === "all";
}
