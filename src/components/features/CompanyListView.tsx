"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCompanies } from "@/hooks/useCompanies";
import { CompanyGridSkeleton, CompanyGridView } from "./CompanyGrid";
import {
  MarketplaceSearchBar,
  MarketplaceSearchBarFallback,
} from "./MarketplaceSearchBar";
import { SearchParams } from "@/enums";
import type { Company } from "@/types/company";

interface CompanyListViewProps {
  showSearchBar?: boolean;
}

function filterByLocation(companies: Company[] | undefined, location: string | null) {
  if (!companies) {
    return companies;
  }

  if (!location) {
    return companies;
  }

  return companies.filter((company) => company.locationSlug === location);
}

function CompanyResults({ showSearchBar }: { showSearchBar: boolean }) {
  const searchParams = useSearchParams();
  const location = searchParams.get(SearchParams.LOCATION);
  const { data, isPending, isError, refetch } = useCompanies();
  const companies = showSearchBar ? filterByLocation(data, location) : data;

  return (
    <div className="flex flex-col gap-6">
      {showSearchBar ? <MarketplaceSearchBar /> : null}
      <CompanyGridView
        companies={companies}
        isPending={isPending}
        isError={isError}
        onRetry={refetch}
      />
    </div>
  );
}

export function CompanyListView({ showSearchBar = true }: CompanyListViewProps) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-6">
          {showSearchBar ? <MarketplaceSearchBarFallback /> : null}
          <CompanyGridSkeleton />
        </div>
      }
    >
      <CompanyResults showSearchBar={showSearchBar} />
    </Suspense>
  );
}
