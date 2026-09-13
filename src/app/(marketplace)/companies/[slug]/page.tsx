import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { MarketplaceHeader } from "@/components/layout/MarketplaceHeader";
import { CompanyBanner } from "@/components/layout/CompanyBanner";
import { Footer } from "@/components/layout/Footer";
import { CarListView } from "@/components/features/CarListView";
import { companiesApi } from "@/services/api";
import { NavRoutes } from "@/enums";
import { appendSearchParams } from "@/lib/marketplaceSearch";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    location?: string;
    from?: string;
    to?: string;
  }>;
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

async function CompanyPage({ params, searchParams }: Props) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const t = await getTranslations("companies");

  let company = null;
  try {
    company = await companiesApi.getBySlug(slug);
  } catch {
    /* fallback to slug-only display */
  }

  return (
    <>
      <MarketplaceHeader />
      <CompanyBanner
        name={company?.name ?? slug}
        description={company?.description}
        location={company?.location}
        backHref={appendSearchParams(NavRoutes.COMPANIES, {
          location: query.location,
          from: query.from,
          to: query.to,
        })}
        backLabel={t("backToList")}
      />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-6 lg:px-8">
        <CarListView
          companySlug={slug}
          hrefBase={`/companies/${slug}/cars`}
          initialFrom={query.from}
          initialTo={query.to}
        />
      </main>
      <Footer />
    </>
  );
}

export default CompanyPage;
