import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rental Companies",
  description: "Browse all local car rental companies on Benwer Cars.",
};

function CompaniesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        Rental companies
      </h1>
    </main>
  );
}

export default CompaniesPage;
