import { MarketplaceHeader } from "@/components/layout/MarketplaceHeader";
import { Footer } from "@/components/layout/Footer";
import { ReservationStatusSkeleton } from "@/components/features/ReservationStatus";

function BookingStatusLoading() {
  return (
    <>
      <MarketplaceHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 md:px-6">
        <ReservationStatusSkeleton />
      </main>
      <Footer />
    </>
  );
}

export default BookingStatusLoading;
