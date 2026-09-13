import type { Metadata } from "next";
import { Building2 } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { MarketplaceHeader } from "@/components/layout/MarketplaceHeader";
import { CompanyBanner } from "@/components/layout/CompanyBanner";
import { Footer } from "@/components/layout/Footer";
import { CarListView } from "@/components/features/CarListView";
import { EmptyState } from "@/components/ui/EmptyState";
import { companiesApi } from "@/services/api";
import { NavRoutes } from "@/enums";
import { ApiError } from "@/lib/errors";
import { appendSearchParams } from "@/lib/marketplaceSearch";
import { buildCompanySiteHref } from "@/lib/companySite";
import { buildPageMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    location?: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const tMeta = await getTranslations("seo");
  const tBrand = await getTranslations("brand");
  const path = `/companies/${slug}`;

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
      path,
      siteName: tBrand("name"),
      locale,
    });
  } catch {
    return buildPageMetadata({
      title: tMeta("companyFallback"),
      description: tBrand("name"),
      path,
      siteName: tBrand("name"),
      locale,
    });
  }
}

async function CompanyPage({ params, searchParams }: Props) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const t = await getTranslations("companies");

  let company = null;
  let companyMissing = false;
  try {
    company = await companiesApi.getBySlug(slug);
  } catch (error) {
    companyMissing =
      error instanceof ApiError && error.code === "company.not_found";
  }

  if (companyMissing) {
    return (
      <>
        <MarketplaceHeader />
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-16 md:px-6 lg:px-8">
          <EmptyState
            icon={<Building2 size={28} />}
            title={t("notFoundTitle")}
            description={t("notFoundDescription")}
            actionLabel={t("backToList")}
            actionHref={NavRoutes.COMPANIES}
          />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <MarketplaceHeader />
      <CompanyBanner
        name={company?.name ?? slug}
        logoUrl={company?.branding.logoUrl}
        description={company?.description}
        location={company?.location}
        websiteHref={buildCompanySiteHref({
          slug,
          websiteUrl: company?.websiteUrl,
        })}
        websiteLabel={t("visitWebsite")}
        email={company?.email}
        phone={company?.phone}
        contactLabel={t("contact")}
        backHref={appendSearchParams(NavRoutes.COMPANIES, {
          location: query.location,
        })}
        backLabel={t("backToList")}
      />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-6 lg:px-8">
        <CarListView
          companySlug={slug}
          hrefBase={`/companies/${slug}/cars`}
          showDirectoryEmptyAction
        />
      </main>
      <Footer />
    </>
  );
}

export default CompanyPage;
