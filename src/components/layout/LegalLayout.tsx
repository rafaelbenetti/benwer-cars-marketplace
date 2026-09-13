import type { ReactNode } from "react";
import { headers } from "next/headers";
import { MarketplaceHeader } from "./MarketplaceHeader";
import { TenantHeader } from "./TenantHeader";
import { Footer } from "./Footer";
import { companiesApi } from "@/services/api";
import { cn } from "@/lib/utils";

interface LegalLayoutProps {
  children: ReactNode;
  width?: "article" | "form";
}

export async function LegalLayout({
  children,
  width = "article",
}: LegalLayoutProps) {
  const tenantSlug = (await headers()).get("x-company-slug");
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
      {tenantSlug ? (
        <TenantHeader companyName={companyName} logoUrl={logoUrl} />
      ) : (
        <MarketplaceHeader />
      )}
      <main
        className={cn(
          "mx-auto w-full flex-1 px-4 py-10 md:px-6 md:py-14 lg:px-8",
          width === "form" ? "max-w-xl" : "max-w-3xl",
        )}
      >
        {children}
      </main>
      <Footer />
    </>
  );
}
