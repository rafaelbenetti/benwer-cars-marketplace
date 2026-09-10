import type { Metadata } from "next";
import { MarketplaceHeader } from "@/components/layout/MarketplaceHeader";
import { Footer } from "@/components/layout/Footer";
import { CompanyListView } from "@/components/features/CompanyListView";

export const metadata: Metadata = {
  title: "Rental Companies",
  description: "Browse all local car rental companies on Benwer Cars.",
};

function CompaniesPage() {
  return (
    <>
      <MarketplaceHeader />
      <main className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Rental companies
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Browse our network of trusted local operators
          </p>
        </div>
        <CompanyListView />
      </main>
      <Footer />
    </>
  );
}

export default CompaniesPage;
