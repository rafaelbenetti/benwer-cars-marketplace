import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { MarketplaceHeader } from "@/components/layout/MarketplaceHeader";
import { Footer } from "@/components/layout/Footer";
import { CarPhotoGallery } from "@/components/features/CarPhotoGallery";
import { CarSpecsTable } from "@/components/features/CarSpecsTable";
import { BookingWidget } from "@/components/features/BookingWidget";
import { vehiclesApi, companiesApi } from "@/services/api";
import { NavRoutes } from "@/enums";

interface Props {
  params: Promise<{ slug: string; id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, id } = await params;
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
    return { title: "Car detail" };
  }
}

async function CompanyCarDetailPage({ params }: Props) {
  const { slug, id } = await params;
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

  return (
    <>
      <MarketplaceHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-6 lg:px-8">
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
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                {vehicle.brand} {vehicle.model}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {vehicle.year}
              </p>
            </div>
            <CarPhotoGallery
              photos={vehicle.photos}
              alt={`${vehicle.brand} ${vehicle.model}`}
            />
            {vehicle.description ? (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {vehicle.description}
              </p>
            ) : null}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-foreground">
                {t("specs")}
              </h2>
              <CarSpecsTable vehicle={vehicle} />
            </div>
          </div>
          <div>
            <BookingWidget vehicle={vehicle} companySlug={slug} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default CompanyCarDetailPage;
