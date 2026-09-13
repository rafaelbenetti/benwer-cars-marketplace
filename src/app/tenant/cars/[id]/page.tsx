import { headers } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MarketplaceHeader } from "@/components/layout/MarketplaceHeader";
import { TenantHeader } from "@/components/layout/TenantHeader";
import { Footer } from "@/components/layout/Footer";
import { CarPhotoGallery } from "@/components/features/CarPhotoGallery";
import { CarSpecsTable } from "@/components/features/CarSpecsTable";
import { BookingWidget } from "@/components/features/BookingWidget";
import { vehiclesApi, companiesApi } from "@/services/api";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [{ id }, headersList] = await Promise.all([params, headers()]);
  const slug = headersList.get("x-company-slug") ?? "";

  try {
    const vehicle = await vehiclesApi.getById(slug, id);
    return {
      title: `${vehicle.brand} ${vehicle.model} (${vehicle.year})`,
      description:
        vehicle.description ??
        `Rent a ${vehicle.brand} ${vehicle.model} — ${vehicle.seats} seats, ${vehicle.transmission}.`,
      openGraph: {
        title: `${vehicle.brand} ${vehicle.model}`,
        description: vehicle.description ?? undefined,
        images: vehicle.photos[0] ? [vehicle.photos[0]] : [],
      },
    };
  } catch {
    return { title: "Car detail" };
  }
}

async function TenantCarDetailPage({ params }: Props) {
  const [{ id }, headersList] = await Promise.all([params, headers()]);
  const companySlug = headersList.get("x-company-slug");

  if (!companySlug) notFound();

  let vehicle;
  try {
    vehicle = await vehiclesApi.getById(companySlug, id);
  } catch {
    notFound();
  }

  let company = null;
  try {
    company = await companiesApi.getBySlug(companySlug);
  } catch {
    /* fallback gracefully */
  }

  return (
    <>
      <TenantHeader
        companyName={company?.name ?? companySlug}
        logoUrl={company?.branding.logoUrl}
      />
      <main className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-8">
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
            <BookingWidget vehicle={vehicle} companySlug={companySlug} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default TenantCarDetailPage;
