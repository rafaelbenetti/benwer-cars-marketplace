import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Your Perfect Car",
  description: "Search across our network of local car rental companies.",
};

function MarketplaceHomePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        Find your perfect car
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Search across our network of local rental companies
      </p>
    </main>
  );
}

export default MarketplaceHomePage;
