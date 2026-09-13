import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { MarketplaceHeader } from "@/components/layout/MarketplaceHeader";
import { Footer } from "@/components/layout/Footer";
import { CompanyListView } from "@/components/features/CompanyListView";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("companies");
  const tBrand = await getTranslations("brand");

  return buildPageMetadata({
    title: t("title"),
    description: t("subtitle"),
    path: "/companies",
    siteName: tBrand("name"),
    locale,
  });
}

async function CompaniesPage() {
  const t = await getTranslations("companies");

  return (
    <>
      <MarketplaceHeader />
      <section className="relative w-full overflow-hidden border-b border-border bg-gradient-to-br from-primary/5 via-background to-info/5">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 pt-8 pb-12 md:px-6 md:pt-14 md:pb-24 lg:px-8">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {t("title")}
          </h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
            {t("subtitle")}
          </p>
        </div>
      </section>
      <main className="mx-auto flex w-full max-w-7xl min-w-0 flex-1 flex-col gap-6 px-4 pb-12 md:gap-8 md:px-6 md:pb-16 lg:px-8">
        <div className="relative z-10 -mt-10 md:-mt-14">
          <CompanyListView />
        </div>
      </main>
      <Footer />
    </>
  );
}

export default CompaniesPage;
