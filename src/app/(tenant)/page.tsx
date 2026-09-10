import { headers } from "next/headers";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const slug = headersList.get("x-company-slug") ?? "company";
  return {
    title: `Cars — ${slug}`,
    description: `Browse available cars from ${slug}.`,
  };
}

async function TenantHomePage() {
  const headersList = await headers();
  const companySlug = headersList.get("x-company-slug");

  return (
    <main className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        Available cars
      </h1>
      <p className="text-muted-foreground text-sm mt-2">
        Company: {companySlug ?? "—"}
      </p>
    </main>
  );
}

export default TenantHomePage;
