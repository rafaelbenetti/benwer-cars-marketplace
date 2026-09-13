import { headers } from "next/headers";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { MarketplaceHeader } from "@/components/layout/MarketplaceHeader";
import { TenantHeader } from "@/components/layout/TenantHeader";
import { Footer } from "@/components/layout/Footer";
import { ReservationStatus } from "@/components/features/ReservationStatus";
import { companiesApi } from "@/services/api";
import { NavRoutes } from "@/enums";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("reservationStatus");
  return {
    title: t("title"),
    description: t("successTitle"),
  };
}

interface Props {
  params: Promise<{ token: string }>;
}

async function BookingStatusPage({ params }: Props) {
  const { token } = await params;
  const headersList = await headers();
  const tenantSlug = headersList.get("x-company-slug");
  const isTenant = Boolean(tenantSlug);

  let companyName = tenantSlug ?? "";
  let logoUrl: string | null = null;
  if (tenantSlug) {
    try {
      const company = await companiesApi.getBySlug(tenantSlug);
      companyName = company.name;
      logoUrl = company.branding.logoUrl;
    } catch {
      companyName = tenantSlug;
    }
  }

  return (
    <>
      {isTenant ? (
        <TenantHeader companyName={companyName} logoUrl={logoUrl} />
      ) : (
        <MarketplaceHeader />
      )}
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 md:px-6">
        <ReservationStatus
          token={token}
          browseHref={isTenant ? NavRoutes.HOME : null}
        />
      </main>
      <Footer />
    </>
  );
}

export default BookingStatusPage;
