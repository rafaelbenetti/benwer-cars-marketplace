import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { MarketplaceHeader } from "@/components/layout/MarketplaceHeader";
import { Footer } from "@/components/layout/Footer";
import { MarketplaceCarListView } from "@/components/features/MarketplaceCarListView";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("cars");
  const tBrand = await getTranslations("brand");

  return buildPageMetadata({
    title: t("searchTitle"),
    description: t("searchSubtitle"),
    path: "/cars",
    siteName: tBrand("name"),
    locale,
  });
}

async function CarsSearchPage() {
  const t = await getTranslations("cars");

  return (
    <>
      <MarketplaceHeader />
      <section className="relative w-full overflow-hidden border-b border-border bg-primary/5">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 pt-10 pb-16 md:px-6 md:pt-14 md:pb-24 lg:px-8">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {t("searchTitle")}
          </h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
            {t("searchSubtitle")}
          </p>
        </div>
      </section>
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 pb-16 md:px-6 lg:px-8">
        <div className="relative z-10 -mt-10 md:-mt-14">
          <MarketplaceCarListView />
        </div>
      </main>
      <Footer />
    </>
  );
}

export default CarsSearchPage;
