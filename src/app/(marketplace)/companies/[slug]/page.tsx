import type { Metadata } from "next";
import { MarketplaceHeader } from "@/components/layout/MarketplaceHeader";
import { CompanyBanner } from "@/components/layout/CompanyBanner";
import { Footer } from "@/components/layout/Footer";
import { CarListView } from "@/components/features/CarListView";
import { companiesApi } from "@/services/api";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
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
    return { title: slug };
  }
}

async function CompanyPage({ params }: Props) {
  const { slug } = await params;

  let company = null;
  try {
    company = await companiesApi.getBySlug(slug);
  } catch {
    /* fallback to slug-only display */
  }

  return (
    <>
      <MarketplaceHeader />
      {company ? (
        <CompanyBanner
          name={company.name}
          description={company.description}
          location={company.location}
        />
      ) : null}
      <main className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-8">
        <CarListView companySlug={slug} />
      </main>
      <Footer />
    </>
  );
}

export default CompanyPage;
