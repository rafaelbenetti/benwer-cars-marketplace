import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, MapPin, UserRound } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { MarketplaceHeader } from "@/components/layout/MarketplaceHeader";
import { Footer } from "@/components/layout/Footer";
import { BrowseByLocation } from "@/components/features/BrowseByLocation";
import { CompanyListView } from "@/components/features/CompanyListView";
import { HowItWorks } from "@/components/features/HowItWorks";
import { MarketplaceHeroSearch } from "@/components/features/MarketplaceHeroSearch";
import { MarketplaceMapTeaser } from "@/components/features/MarketplaceMapTeaser";
import { NavRoutes } from "@/enums";

export async function generateMarketplaceHomeMetadata(): Promise<Metadata> {
  const t = await getTranslations("home");
  const tBrand = await getTranslations("brand");

  return {
    title: t("title"),
    description: t("subtitle"),
    openGraph: {
      title: `${tBrand("name")} — ${t("title")}`,
      description: t("subtitle"),
    },
  };
}

export async function MarketplaceHome() {
  const t = await getTranslations("home");
  const tActions = await getTranslations("actions");

  return (
    <>
      <MarketplaceHeader />
      <section className="relative w-full overflow-hidden border-b border-border bg-primary/5">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-24 md:px-6 md:pt-20 md:pb-28 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-wider text-primary">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
            {t("subtitle")}
          </p>
          <ul className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
            <li className="flex items-center gap-2 text-sm text-foreground">
              <BadgeCheck size={16} className="text-primary" aria-hidden />
              {t("trustLocal")}
            </li>
            <li className="flex items-center gap-2 text-sm text-foreground">
              <UserRound size={16} className="text-primary" aria-hidden />
              {t("trustGuest")}
            </li>
            <li className="flex items-center gap-2 text-sm text-foreground">
              <MapPin size={16} className="text-primary" aria-hidden />
              {t("trustArea")}
            </li>
          </ul>
        </div>
      </section>
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="-mt-12 md:-mt-14">
          <MarketplaceHeroSearch className="shadow-md" />
        </div>
      </div>
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-12 px-4 py-12 md:px-6 md:py-16 lg:px-8">
        <HowItWorks />
        <MarketplaceMapTeaser />
        <BrowseByLocation />
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold text-foreground">
                {t("companiesHeading")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("companiesSubtitle")}
              </p>
            </div>
            <Link
              href={NavRoutes.COMPANIES}
              className="cursor-pointer text-sm font-medium text-primary transition-colors hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {tActions("viewAll")}
            </Link>
          </div>
          <CompanyListView showSearchBar={false} />
        </section>
      </main>
      <Footer />
    </>
  );
}
