import type { Metadata } from "next";
import { MarketplaceHeader } from "@/components/layout/MarketplaceHeader";
import { Footer } from "@/components/layout/Footer";
import { ReservationStatus } from "@/components/features/ReservationStatus";

export const metadata: Metadata = {
  title: "Your reservation",
  description: "View the status of your car rental reservation.",
};

interface Props {
  params: Promise<{ token: string }>;
}

async function BookingStatusPage({ params }: Props) {
  const { token } = await params;

  return (
    <>
      <MarketplaceHeader />
      <main className="mx-auto max-w-2xl px-4 md:px-6 py-12">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-8">
          Your reservation
        </h1>
        <ReservationStatus token={token} />
      </main>
      <Footer />
    </>
  );
}

export default BookingStatusPage;
