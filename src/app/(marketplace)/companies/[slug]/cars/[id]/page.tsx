import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { HydrationBoundary } from "@tanstack/react-query";
import { MarketplaceHeader } from "@/components/layout/MarketplaceHeader";
import { Footer } from "@/components/layout/Footer";
import { CarDetailView } from "@/components/features/CarDetailView";
import { vehiclesApi, companiesApi } from "@/services/api";
import { NavRoutes } from "@/enums";
import { prefetchAvailabilityState } from "@/lib/prefetchAvailability";

interface Props {
  params: Promise<{ slug: string; id: string }>;
  searchParams: Promise<{
    from?: string;
    to?: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, id } = await params;
  const t = await getTranslations("carDetail");
  try {
    const [vehicle, company] = await Promise.all([
      vehiclesApi.getById(slug, id),
      companiesApi.getBySlug(slug),
    ]);
    return {
      title: `${vehicle.brand} ${vehicle.model} — ${company.name}`,
      description:
        vehicle.description ??
        `Rent a ${vehicle.brand} ${vehicle.model} from ${company.name}.`,
      openGraph: {
        title: `${vehicle.brand} ${vehicle.model} — ${company.name}`,
        description: vehicle.description ?? undefined,
        images: vehicle.photos[0] ? [vehicle.photos[0]] : [],
      },
    };
  } catch {
    return { title: t("metaTitle") };
  }
}

async function CompanyCarDetailPage({ params, searchParams }: Props) {
  const [{ slug, id }, query] = await Promise.all([params, searchParams]);
  const t = await getTranslations("carDetail");
  const tNav = await getTranslations("nav");

  let vehicle;
  try {
    vehicle = await vehiclesApi.getById(slug, id);
  } catch {
    notFound();
  }

  let company = null;
  try {
    company = await companiesApi.getBySlug(slug);
  } catch {
    /* fallback gracefully */
  }

  const dehydratedState = await prefetchAvailabilityState(slug, id);

  return (
    <>
      <MarketplaceHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 pb-28 md:px-6 lg:px-8 lg:pb-16">
        <nav
          aria-label={t("breadcrumbAria")}
          className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground"
        >
          <Link
            href={NavRoutes.COMPANIES}
            className="cursor-pointer transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {tNav("companies")}
          </Link>
          {company ? (
            <>
              <span aria-hidden>/</span>
              <Link
                href={`/companies/${slug}`}
                className="cursor-pointer transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {company.name}
              </Link>
            </>
          ) : null}
          <span aria-hidden>/</span>
          <span className="text-foreground">
            {vehicle.brand} {vehicle.model}
          </span>
        </nav>
        <HydrationBoundary state={dehydratedState}>
          <CarDetailView
            vehicle={vehicle}
            companySlug={slug}
            initialFrom={query.from}
            initialTo={query.to}
          />
        </HydrationBoundary>
      </main>
      <Footer />
    </>
  );
}

export default CompanyCarDetailPage;
