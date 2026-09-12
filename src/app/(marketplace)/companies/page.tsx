import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { MarketplaceHeader } from "@/components/layout/MarketplaceHeader";
import { Footer } from "@/components/layout/Footer";
import { CompanyListView } from "@/components/features/CompanyListView";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("companies");

  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

async function CompaniesPage() {
  const t = await getTranslations("companies");

  return (
    <>
      <MarketplaceHeader />
      <section className="relative overflow-hidden border-b border-border bg-primary/5">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-16 md:px-6 md:pt-14 md:pb-20 lg:px-8">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {t("title")}
          </h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
            {t("subtitle")}
          </p>
        </div>
      </section>
      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-16 md:px-6 lg:px-8">
        <div className="relative z-10 -mt-8 md:-mt-10">
          <CompanyListView />
        </div>
      </main>
      <Footer />
    </>
  );
}

export default CompaniesPage;
