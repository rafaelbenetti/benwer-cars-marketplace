"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCompanies } from "@/hooks/useCompanies";
import { CompanyDirectory } from "./CompanyDirectory";
import { CompanyGridSkeleton, CompanyGridView } from "./CompanyGrid";
import {
  MarketplaceSearchBar,
  MarketplaceSearchBarFallback,
} from "./MarketplaceSearchBar";
import { SearchParams } from "@/enums";

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
  const searchParams = useSearchParams();
  const location = searchParams.get(SearchParams.LOCATION);
  const from = searchParams.get(SearchParams.FROM);
  const to = searchParams.get(SearchParams.TO);
  const { data, isPending, isError, error, refetch } = useCompanies(
    showSearchBar
      ? {
          location: location || undefined,
          from: from || undefined,
          to: to || undefined,
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
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <MarketplaceSearchBar />
      <CompanyDirectory
        companies={data}
        isPending={isPending}
        isError={isError}
        error={error}
        onRetry={refetch}
        location={location}
        from={from}
        to={to}
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
          {showSearchBar ? <MarketplaceSearchBarFallback /> : null}
          <CompanyGridSkeleton count={limit ?? 6} />
        </div>
      }
    >
      <CompanyResults showSearchBar={showSearchBar} limit={limit} />
    </Suspense>
  );
}
