import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complete your booking",
  description: "Fill in your details to confirm your car rental reservation.",
};

function BookPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        Complete your booking
      </h1>
    </main>
  );
}

export default BookPage;
