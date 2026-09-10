import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MarketplaceHeader } from "@/components/layout/MarketplaceHeader";
import { Footer } from "@/components/layout/Footer";
import { BookingForm } from "@/components/features/BookingForm";
import { BookingSummary } from "@/components/features/BookingSummary";
import { vehiclesApi } from "@/services/api";

export const metadata: Metadata = {
  title: "Complete your booking",
  description: "Fill in your details to confirm your car rental reservation.",
};

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
      <main className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-8">
          Complete your booking
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <h2 className="text-base font-semibold text-foreground mb-4">
              Your details
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
