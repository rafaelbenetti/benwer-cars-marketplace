import type { Metadata } from "next";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { MarketplaceHeader } from "@/components/layout/MarketplaceHeader";
import { Footer } from "@/components/layout/Footer";
import { BrowseByLocation } from "@/components/features/BrowseByLocation";
import { CompanyListView } from "@/components/features/CompanyListView";
import { HowItWorks } from "@/components/features/HowItWorks";
import { MarketplaceMapTeaser } from "@/components/features/MarketplaceMapTeaser";
import { MarketplaceSearchHeader } from "@/components/features/MarketplaceSearchHeader";
import { NavRoutes } from "@/enums";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMarketplaceHomeMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("home");
  const tBrand = await getTranslations("brand");

  return buildPageMetadata({
    title: t("title"),
    description: t("subtitle"),
    path: "/",
    siteName: tBrand("name"),
    locale,
  });
}

export async function MarketplaceHome() {
  const t = await getTranslations("home");

  return (
    <>
      <MarketplaceHeader />
      <MarketplaceSearchHeader />
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
              className="inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-md border border-border bg-surface px-4 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:h-auto sm:w-auto sm:justify-start sm:border-0 sm:bg-transparent sm:px-0 sm:text-primary sm:hover:bg-transparent sm:hover:text-primary-hover"
            >
              {t("viewAllCompanies")}
            </Link>
          </div>
          <CompanyListView showSearchBar={false} limit={6} />
        </section>
      </main>
      <Footer />
    </>
  );
}
