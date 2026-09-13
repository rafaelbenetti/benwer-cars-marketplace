import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { MarketplaceHeader } from "@/components/layout/MarketplaceHeader";
import { Footer } from "@/components/layout/Footer";
import { BookingForm } from "@/components/features/BookingForm";
import { BookingSummary } from "@/components/features/BookingSummary";
import { vehiclesApi } from "@/services/api";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("booking");
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

interface Props {
  searchParams: Promise<{
    carId?: string;
    companySlug?: string;
    from?: string;
    to?: string;
  }>;
}

async function BookPage({ searchParams }: Props) {
  const { carId, companySlug, from, to } = await searchParams;
  const t = await getTranslations("booking");

  if (!carId || !companySlug) notFound();

  let vehicle;
  try {
    vehicle = await vehiclesApi.getById(companySlug, carId);
  } catch {
    notFound();
  }

  return (
    <>
      <MarketplaceHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 md:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-semibold tracking-tight text-foreground">
          {t("title")}
        </h1>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <h2 className="mb-4 text-base font-semibold text-foreground">
              {t("details")}
            </h2>
            <BookingForm
              vehicle={vehicle}
              companySlug={companySlug}
              defaultFrom={from ?? ""}
              defaultTo={to ?? ""}
            />
          </div>
          <div className="lg:col-span-2">
            <BookingSummary
              vehicle={vehicle}
              from={from}
              to={to}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default BookPage;
