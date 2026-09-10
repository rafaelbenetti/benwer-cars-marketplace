import type { Metadata } from "next";

interface Props {
  params: Promise<{ token: string }>;
}

export const metadata: Metadata = {
  title: "Your reservation",
  description: "View the status of your car rental reservation.",
};

async function BookingStatusPage({ params }: Props) {
  const { token } = await params;

  return (
    <main className="mx-auto max-w-3xl px-4 md:px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        Your reservation
      </h1>
      <p className="text-muted-foreground text-sm mt-2">Token: {token}</p>
    </main>
  );
}

export default BookingStatusPage;
