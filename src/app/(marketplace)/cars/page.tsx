import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { MarketplaceHeader } from "@/components/layout/MarketplaceHeader";
import { Footer } from "@/components/layout/Footer";
import { MarketplaceCarListView } from "@/components/features/MarketplaceCarListView";
import { MarketplaceSearchHeader } from "@/components/features/MarketplaceSearchHeader";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("home");
  const tBrand = await getTranslations("brand");

  return buildPageMetadata({
    title: t("title"),
    description: t("subtitle"),
    path: "/cars",
    siteName: tBrand("name"),
    locale,
  });
}

function CarsSearchPage() {
  return (
    <>
      <MarketplaceHeader />
      <MarketplaceSearchHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 md:px-6 md:py-10 lg:px-8">
        <MarketplaceCarListView />
      </main>
      <Footer />
    </>
  );
}

export default CarsSearchPage;
