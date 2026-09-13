import { MarketplaceHeader } from "@/components/layout/MarketplaceHeader";
import { Footer } from "@/components/layout/Footer";
import { BookingViewSkeleton } from "@/components/features/BookingView";

function BookLoading() {
  return (
    <>
      <MarketplaceHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 pb-28 md:px-6 lg:px-8 lg:pb-16">
        <BookingViewSkeleton />
      </main>
      <Footer />
    </>
  );
}

export default BookLoading;
