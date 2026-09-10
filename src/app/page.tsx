import { headers } from "next/headers";
import type { Metadata } from "next";
import { MarketplaceHeader } from "@/components/layout/MarketplaceHeader";
import { TenantHeader } from "@/components/layout/TenantHeader";
import { CompanyBanner } from "@/components/layout/CompanyBanner";
import { Footer } from "@/components/layout/Footer";
import { CarListView } from "@/components/features/CarListView";
import { CompanyListView } from "@/components/features/CompanyListView";
import { companiesApi } from "@/services/api";
import type { Vehicle } from "@/types/vehicle";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const slug = headersList.get("x-company-slug");
  if (!slug) {
    return {
      title: "Find Your Perfect Car",
      description:
        "Browse and book cars from local rental companies near you.",
      openGraph: {
        title: "Benwer Cars — Find Your Perfect Car",
        description:
          "Browse and book cars from local rental companies. Search across our network.",
      },
    };
  }
  try {
    const company = await companiesApi.getBySlug(slug);
    return {
      title: `${company.name} — Car Rentals`,
      description:
        company.description ?? `Rent a car from ${company.name}.`,
      openGraph: { title: company.name },
    };
  } catch {
    return { title: "Cars" };
  }
}

export default async function HomePage() {
  const headersList = await headers();
  const companySlug = headersList.get("x-company-slug");

  if (!companySlug) {
    return <MarketplaceHome />;
  }

  return <TenantHome companySlug={companySlug} />;
}

function MarketplaceHome() {
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

async function TenantHome({ companySlug }: { companySlug: string }) {
  let company = null;
  try {
    company = await companiesApi.getBySlug(companySlug);
  } catch {
    /* fall back to slug-only display */
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
