import type { Metadata } from "next";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { MarketplaceHeader } from "@/components/layout/MarketplaceHeader";
import { Footer } from "@/components/layout/Footer";
import { CompanyListView } from "@/components/features/CompanyListView";
import { HowItWorks } from "@/components/features/HowItWorks";
import { MarketplaceSearchHeader } from "@/components/features/MarketplaceSearchHeader";
import { PartnersInvite } from "@/components/features/PartnersInvite";
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
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-12 px-4 py-10 md:gap-24 md:px-6 md:py-20 lg:px-8">
        <HowItWorks />
        <section className="flex flex-col gap-8">
          <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-2">
            <div className="min-w-0 flex flex-col gap-1">
              <h2 className="text-xl font-semibold text-foreground">
                {t("companiesHeading")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("companiesSubtitle")}
              </p>
            </div>
            <Link
              href={NavRoutes.COMPANIES}
              className="shrink-0 cursor-pointer text-sm font-medium text-primary transition-colors hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {t("viewAllCompanies")}
            </Link>
          </div>
          <CompanyListView showSearchBar={false} limit={6} />
        </section>
        <PartnersInvite />
      </main>
      <Footer />
    </>
  );
}
