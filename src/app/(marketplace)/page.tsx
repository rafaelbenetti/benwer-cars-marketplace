import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { MarketplaceHeader } from "@/components/layout/MarketplaceHeader";
import { Footer } from "@/components/layout/Footer";
import { BrowseByLocation } from "@/components/features/BrowseByLocation";
import { CompanyListView } from "@/components/features/CompanyListView";
import { MarketplaceHeroSearch } from "@/components/features/MarketplaceHeroSearch";

export const metadata: Metadata = {
  title: "Find Your Perfect Car",
  description:
    "Browse and book cars from local rental companies near you. Search across our network of trusted operators.",
  openGraph: {
    title: "Benwer Cars — Find Your Perfect Car",
    description:
      "Browse and book cars from local rental companies. Search across our network.",
  },
};

async function MarketplaceHomePage() {
  const t = await getTranslations("home");

  return (
    <>
      <MarketplaceHeader />
      <section className="relative border-b border-border bg-primary/5 pt-16 pb-20 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">
            {t("title")}
          </h1>
          <p className="mt-3 max-w-xl text-base text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>
      </section>
      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="-mt-8 md:-mt-10">
          <MarketplaceHeroSearch />
        </div>
      </div>
      <main className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-10 md:px-6 lg:px-8">
        <BrowseByLocation />
        <section className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold text-foreground">
            {t("companiesHeading")}
          </h2>
          <CompanyListView showSearchBar={false} />
        </section>
      </main>
      <Footer />
    </>
  );
}

export default MarketplaceHomePage;
