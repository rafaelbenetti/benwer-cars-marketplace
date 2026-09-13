import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { MarketplaceHeader } from "@/components/layout/MarketplaceHeader";
import { Footer } from "@/components/layout/Footer";
import { ReservationStatus } from "@/components/features/ReservationStatus";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("reservationStatus");
  return {
    title: t("title"),
    description: t("title"),
  };
}

interface Props {
  params: Promise<{ token: string }>;
}

async function BookingStatusPage({ params }: Props) {
  const { token } = await params;
  const t = await getTranslations("reservationStatus");

  return (
    <>
      <MarketplaceHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 md:px-6">
        <h1 className="mb-8 text-3xl font-semibold tracking-tight text-foreground">
          {t("title")}
        </h1>
        <ReservationStatus token={token} />
      </main>
      <Footer />
    </>
  );
}

export default BookingStatusPage;
