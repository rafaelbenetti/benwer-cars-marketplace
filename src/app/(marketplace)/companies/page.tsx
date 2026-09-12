import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { MarketplaceHeader } from "@/components/layout/MarketplaceHeader";
import { Footer } from "@/components/layout/Footer";
import { CompanyListView } from "@/components/features/CompanyListView";

export const metadata: Metadata = {
  title: "Rental Companies",
  description: "Browse all local car rental companies on Benwer Cars.",
};

async function CompaniesPage() {
  const t = await getTranslations("companies");

  return (
    <>
      <MarketplaceHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {t("title")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <CompanyListView />
      </main>
      <Footer />
    </>
  );
}

export default CompaniesPage;
