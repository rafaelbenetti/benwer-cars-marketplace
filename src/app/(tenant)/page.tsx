import { headers } from "next/headers";
import type { Metadata } from "next";
import { MarketplaceHeader } from "@/components/layout/MarketplaceHeader";
import { TenantHeader } from "@/components/layout/TenantHeader";
import { CompanyBanner } from "@/components/layout/CompanyBanner";
import { Footer } from "@/components/layout/Footer";
import { CarListView } from "@/components/features/CarListView";
import { companiesApi } from "@/services/api";
import type { Vehicle } from "@/types/vehicle";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const slug = headersList.get("x-company-slug");
  if (!slug) return { title: "Cars" };

  try {
    const company = await companiesApi.getBySlug(slug);
    return {
      title: `${company.name} — Car Rentals`,
      description: company.description ?? `Rent a car from ${company.name}.`,
      openGraph: {
        title: company.name,
        description: company.description ?? undefined,
      },
    };
  } catch {
    return { title: "Cars" };
  }
}

async function TenantHomePage() {
  const headersList = await headers();
  const companySlug = headersList.get("x-company-slug");

  if (!companySlug) {
    return (
      <>
        <MarketplaceHeader />
        <main className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-12">
          <p className="text-muted-foreground text-sm">Company not found.</p>
        </main>
        <Footer />
      </>
    );
  }

  let company = null;
  try {
    company = await companiesApi.getBySlug(companySlug);
  } catch {
    /* will fall back to slug-only display */
  }

  function buildCarHref(vehicle: Vehicle) {
    return `/cars/${vehicle.id}`;
  }

  return (
    <>
      <TenantHeader
        companyName={company?.name ?? companySlug}
        logoUrl={company?.branding.logoUrl}
      />
      {company ? (
        <CompanyBanner
          name={company.name}
          description={company.description}
          location={company.location}
        />
      ) : null}
      <main className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-8">
        <CarListView companySlug={companySlug} buildHref={buildCarHref} />
      </main>
      <Footer />
    </>
  );
}

export default TenantHomePage;
