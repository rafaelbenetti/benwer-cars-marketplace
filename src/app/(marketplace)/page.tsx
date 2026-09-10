import type { Metadata } from "next";
import { MarketplaceHeader } from "@/components/layout/MarketplaceHeader";
import { Footer } from "@/components/layout/Footer";
import { CompanyListView } from "@/components/features/CompanyListView";

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

function MarketplaceHomePage() {
  return (
    <>
      <MarketplaceHeader />
      <section className="bg-primary/5 border-b border-border py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">
            Find your perfect car
          </h1>
          <p className="mt-3 text-base text-muted-foreground max-w-xl">
            Search across our network of trusted local rental companies.
          </p>
        </div>
      </section>
      <main className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-10">
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Rental companies
        </h2>
        <CompanyListView />
      </main>
      <Footer />
    </>
  );
}

export default MarketplaceHomePage;
