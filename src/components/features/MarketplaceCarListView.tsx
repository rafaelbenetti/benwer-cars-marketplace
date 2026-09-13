"use client";

import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useCompanies } from "@/hooks/useCompanies";
import { useMarketplaceVehicles } from "@/hooks/useMarketplaceVehicles";
import { CarGridSkeleton, CarGridView } from "./CarGrid";
import { FilterBar, FilterBarSkeleton } from "./FilterBar";
import {
  MarketplaceSearchBar,
  MarketplaceSearchBarFallback,
} from "./MarketplaceSearchBar";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  getCityBySlug,
  getCityDisplayName,
  isProvinceWideLocation,
  resolveCitySlug,
  toApiLocation,
} from "@/data/malagaCities";
import { NavRoutes, SearchParams } from "@/enums";
import { formatSearchDate, parseIsoDate } from "@/lib/dates";
import { appendSearchParams } from "@/lib/marketplaceSearch";
import {
  applyVehicleFilters,
  hasActiveVehicleFilters,
  parseBrowseParams,
  parseVehicleFilters,
} from "@/lib/vehicleFilters";
import type { MarketplaceVehicle } from "@/types/vehicle";
import type { Vehicle } from "@/types/vehicle";

function MarketplaceCarListContent() {
  const t = useTranslations("cars");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = parseVehicleFilters(searchParams);
  const browse = parseBrowseParams(searchParams);
  const location = resolveCitySlug(browse.location ?? null);
  const marketplaceFilters = {
    ...filters,
    location,
  };
  const { data, isPending, isError, error, refetch } = useMarketplaceVehicles(
    marketplaceFilters,
  );
  const companiesQuery = useCompanies({
    location: toApiLocation(location),
  });

  const hasFilters = hasActiveVehicleFilters({
    type: filters.type,
    seats: filters.seats,
    transmission: filters.transmission,
    q: filters.q,
    companySlug: filters.companySlug,
  });
  const fromDate = filters.from ? parseIsoDate(filters.from) : null;
  const toDate = filters.to ? parseIsoDate(filters.to) : null;
  const count = data?.length ?? 0;
  const city = !isProvinceWideLocation(location) ? getCityBySlug(location) : null;
  const placeLabel = city
    ? t("resultsInCity", {
        count,
        city: getCityDisplayName(city, locale),
      })
    : t("resultsInProvince", { count });
  const resultsLabel =
    fromDate && toDate
      ? t("resultsForDates", {
          count,
          from: formatSearchDate(fromDate, locale),
          to: formatSearchDate(toDate, locale),
        })
      : placeLabel;

  function handleChange(next: typeof filters) {
    const params = applyVehicleFilters(searchParams, next);
    if (location) {
      params.set(SearchParams.LOCATION, location);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function buildHref(vehicle: Vehicle): string {
    return appendSearchParams(`${NavRoutes.COMPANIES}/${vehicle.companySlug}/cars/${vehicle.id}`, {
      location,
      from: browse.from,
      to: browse.to,
    });
  }

  function companyFor(vehicle: Vehicle) {
    const marketplaceVehicle = vehicle as MarketplaceVehicle;
    return marketplaceVehicle.company ?? null;
  }

  function clearAdvancedFilters() {
    handleChange({
      from: filters.from,
      to: filters.to,
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <MarketplaceSearchBar />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-xl font-semibold text-foreground">{t("searchTitle")}</h2>
        {isPending ? (
          <Skeleton className="h-4 w-36" />
        ) : isError ? null : (
          <p className="text-sm text-muted-foreground">{resultsLabel}</p>
        )}
      </div>
      <FilterBar
        filters={filters}
        onChange={handleChange}
        companies={companiesQuery.data ?? []}
      />
      <CarGridView
        vehicles={data}
        isPending={isPending}
        isError={isError}
        error={error}
        onRetry={refetch}
        buildHref={buildHref}
        companyFor={companyFor}
        emptyTitle={t("searchEmptyTitle")}
        emptyHint={t("searchEmptyHint")}
        emptyActionLabel={hasFilters ? t("clearFilters") : undefined}
        onClearFilters={hasFilters ? clearAdvancedFilters : undefined}
      />
    </div>
  );
}

function MarketplaceCarListFallback() {
  return (
    <div className="flex flex-col gap-6">
      <MarketplaceSearchBarFallback />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-36" />
      </div>
      <FilterBarSkeleton />
      <CarGridSkeleton />
    </div>
  );
}

export function MarketplaceCarListView() {
  return (
    <Suspense fallback={<MarketplaceCarListFallback />}>
      <MarketplaceCarListContent />
    </Suspense>
  );
}
