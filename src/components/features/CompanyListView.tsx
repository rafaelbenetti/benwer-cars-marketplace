"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCompanies } from "@/hooks/useCompanies";
import { CompanyDirectory } from "./CompanyDirectory";
import { CompanyGridSkeleton, CompanyGridView } from "./CompanyGrid";
import {
  MarketplaceSearchBar,
  MarketplaceSearchBarFallback,
} from "./MarketplaceSearchBar";
import { NavRoutes, SearchParams } from "@/enums";
import type { Company } from "@/types/company";

interface CompanyListViewProps {
  showSearchBar?: boolean;
  limit?: number;
  initialCompanies?: Company[];
}

function FeaturedCompanyResults({
  limit,
  initialCompanies,
}: {
  limit?: number;
  initialCompanies?: Company[];
}) {
  const t = useTranslations("companies");
  const { data, isPending, isError, error, refetch } = useCompanies();
  const companies = data ?? initialCompanies;
  const waiting = isPending && !initialCompanies;

  return (
    <CompanyGridView
      companies={limit && companies ? companies.slice(0, limit) : companies}
      isPending={waiting}
      isError={isError && !companies}
      error={error}
      onRetry={refetch}
      emptyTitle={t("featuredEmpty")}
      emptyHint={t("featuredEmptyHint")}
      emptyActionLabel={t("browseCars")}
      emptyActionHref={NavRoutes.CARS}
    />
  );
}

function SearchableCompanyResults() {
  const searchParams = useSearchParams();
  const location = searchParams.get(SearchParams.LOCATION);
  const { data, isPending, isError, error, refetch } = useCompanies(
    location ? { location } : undefined,
  );

  return (
    <div className="flex flex-col gap-6">
      <MarketplaceSearchBar target="companies" />
      <CompanyDirectory
        companies={data}
        isPending={isPending}
        isError={isError}
        error={error}
        onRetry={refetch}
        location={location}
      />
    </div>
  );
}

export function CompanyListView({
  showSearchBar = true,
  limit,
  initialCompanies,
}: CompanyListViewProps) {
  if (!showSearchBar) {
    return (
      <FeaturedCompanyResults limit={limit} initialCompanies={initialCompanies} />
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-6">
          <MarketplaceSearchBarFallback target="companies" />
          <CompanyGridSkeleton count={limit ?? 6} />
        </div>
      }
    >
      <SearchableCompanyResults />
    </Suspense>
  );
}
