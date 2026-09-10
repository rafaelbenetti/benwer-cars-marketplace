import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MarketplaceHeader } from "@/components/layout/MarketplaceHeader";
import { Footer } from "@/components/layout/Footer";
import { CarPhotoGallery } from "@/components/features/CarPhotoGallery";
import { CarSpecsTable } from "@/components/features/CarSpecsTable";
import { BookingWidget } from "@/components/features/BookingWidget";
import { vehiclesApi, companiesApi } from "@/services/api";

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
      <main className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-8">
        {company ? (
          <p className="text-xs text-muted-foreground mb-6">
            <a href={`/companies/${slug}`} className="hover:text-foreground transition-colors">
              {company.name}
            </a>
            {" / "}
            {vehicle.brand} {vehicle.model}
          </p>
        ) : null}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
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
              <p className="text-sm text-muted-foreground leading-relaxed">
                {vehicle.description}
              </p>
            ) : null}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                Specifications
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
