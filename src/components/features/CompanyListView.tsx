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

interface CompanyListViewProps {
  showSearchBar?: boolean;
  limit?: number;
}

function CompanyResults({
  showSearchBar,
  limit,
}: {
  showSearchBar: boolean;
  limit?: number;
}) {
  const t = useTranslations("companies");
  const searchParams = useSearchParams();
  const location = searchParams.get(SearchParams.LOCATION);
  const { data, isPending, isError, error, refetch } = useCompanies(
    showSearchBar
      ? {
          location: location || undefined,
        }
      : undefined,
  );

  if (!showSearchBar) {
    return (
      <CompanyGridView
        companies={limit ? data?.slice(0, limit) : data}
        isPending={isPending}
        isError={isError}
        error={error}
        onRetry={refetch}
        emptyTitle={t("featuredEmpty")}
        emptyHint={t("featuredEmptyHint")}
        emptyActionLabel={t("browseCars")}
        emptyActionHref={NavRoutes.CARS}
      />
    );
  }

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
}: CompanyListViewProps) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-6">
          {showSearchBar ? <MarketplaceSearchBarFallback target="companies" /> : null}
          <CompanyGridSkeleton count={limit ?? 6} />
        </div>
      }
    >
      <CompanyResults showSearchBar={showSearchBar} limit={limit} />
    </Suspense>
  );
}
