import { headers } from "next/headers";
import type { Metadata } from "next";
import { Building2 } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { MarketplaceHeader } from "@/components/layout/MarketplaceHeader";
import { TenantHeader } from "@/components/layout/TenantHeader";
import { CompanyBanner } from "@/components/layout/CompanyBanner";
import { Footer } from "@/components/layout/Footer";
import { CarListView } from "@/components/features/CarListView";
import { EmptyState } from "@/components/ui/EmptyState";
import { companiesApi } from "@/services/api";
import { NavRoutes } from "@/enums";
import { buildPageMetadata } from "@/lib/seo";

export async function generateTenantMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const slug = headersList.get("x-company-slug");
  const locale = await getLocale();
  const tMeta = await getTranslations("seo");
  const tBrand = await getTranslations("brand");

  if (!slug) {
    return buildPageMetadata({
      title: tMeta("companyFallback"),
      description: tBrand("name"),
      path: "/",
      siteName: tBrand("name"),
      locale,
    });
  }

  try {
    const company = await companiesApi.getBySlug(slug);
    const description = company.description
      ?? (company.location
        ? tMeta("companyDescription", {
            name: company.name,
            location: company.location,
          })
        : tMeta("companyDescriptionPlain", { name: company.name }));

    return buildPageMetadata({
      title: tMeta("companyTitle", { name: company.name }),
      description,
      path: "/",
      siteName: tBrand("name"),
      locale,
    });
  } catch {
    return buildPageMetadata({
      title: tMeta("companyFallback"),
      description: tBrand("name"),
      path: "/",
      siteName: tBrand("name"),
      locale,
    });
  }
}

export async function TenantHome() {
  const headersList = await headers();
  const companySlug = headersList.get("x-company-slug");
  const t = await getTranslations("tenant");
  const tNotFound = await getTranslations("notFound");

  if (!companySlug) {
    return (
      <>
        <MarketplaceHeader />
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-12 md:px-6 lg:px-8">
          <EmptyState
            icon={<Building2 size={40} />}
            title={t("notFoundTitle")}
            description={t("notFoundDescription")}
            actionLabel={tNotFound("action")}
            actionHref={NavRoutes.HOME}
          />
        </main>
        <Footer />
      </>
    );
  }

  let company = null;
  try {
    company = await companiesApi.getBySlug(companySlug);
  } catch {
    /* will fall back to slug-only display */
  }

  return (
    <>
      <TenantHeader
        companyName={company?.name ?? companySlug}
        logoUrl={company?.branding.logoUrl}
      />
      {company ? (
        <CompanyBanner
          name={company.name}
          logoUrl={company.branding.logoUrl}
          description={company.description}
          location={company.location}
        />
      ) : null}
      <main
        id="fleet"
        className="mx-auto w-full max-w-7xl scroll-mt-20 px-4 py-8 md:px-6 lg:px-8"
      >
        <CarListView companySlug={companySlug} hrefBase="/cars" />
      </main>
      <Footer />
    </>
  );
}
