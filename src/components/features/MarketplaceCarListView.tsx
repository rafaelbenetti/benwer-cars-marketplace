"use client";

import { Suspense, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CalendarDays, SlidersHorizontal } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCompanies } from "@/hooks/useCompanies";
import { useMarketplaceVehicles } from "@/hooks/useMarketplaceVehicles";
import { CarGridSkeleton, CarGridView } from "./CarGrid";
import { FilterRail, FilterRailSkeleton } from "./FilterRail";
import {
  MarketplaceSearchBar,
  MarketplaceSearchBarFallback,
} from "./MarketplaceSearchBar";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Sheet } from "@/components/ui/Sheet";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  getCityBySlug,
  getCityDisplayName,
  isProvinceWideLocation,
  resolveCitySlug,
  toApiLocation,
} from "@/data/malagaCities";
import { NavRoutes, SearchParams } from "@/enums";
import { formatSearchDate, hasCompleteSearchDates, parseIsoDate } from "@/lib/dates";
import { appendSearchParams } from "@/lib/marketplaceSearch";
import {
  applyVehicleFilters,
  countAdvancedFilters,
  hasActiveAdvancedFilters,
  parseBrowseParams,
  parseVehicleFilters,
} from "@/lib/vehicleFilters";
import type { MarketplaceVehicle } from "@/types/vehicle";
import type { Vehicle } from "@/types/vehicle";

const RESULTS_GRID_CLASS = "sm:grid-cols-2 xl:grid-cols-3";

function MarketplaceCarListContent() {
  const t = useTranslations("cars");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = parseVehicleFilters(searchParams);
  const browse = parseBrowseParams(searchParams);
  const location = resolveCitySlug(browse.location ?? null);
  const hasDates = hasCompleteSearchDates(filters.from, filters.to);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [datesOpen, setDatesOpen] = useState(false);
  const marketplaceFilters = {
    ...filters,
    location,
  };
  const { data, isPending, isError, error, refetch } = useMarketplaceVehicles(
    marketplaceFilters,
    hasDates,
  );
  const companiesQuery = useCompanies(
    hasDates
      ? {
          location: toApiLocation(location),
          from: filters.from,
          to: filters.to,
        }
      : undefined,
  );

  const hasFilters = hasActiveAdvancedFilters(filters);
  const appliedCount = countAdvancedFilters(filters);
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

  const filterRail = (
    prefix: string,
    className?: string,
  ) => (
    <FilterRail
      filters={filters}
      onChange={handleChange}
      companies={companiesQuery.data ?? []}
      idPrefix={prefix}
      className={className}
    />
  );

  return (
    <div className="flex flex-col gap-6">
      <MarketplaceSearchBar
        datesOpen={datesOpen}
        onDatesOpenChange={setDatesOpen}
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-xl font-semibold text-foreground">{t("searchTitle")}</h2>
        {hasDates ? (
          <div className="flex items-center justify-between gap-3">
            {isPending ? (
              <Skeleton className="h-4 w-36" />
            ) : isError ? null : (
              <p className="text-sm text-muted-foreground">{resultsLabel}</p>
            )}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setFiltersOpen(true)}
              className="lg:hidden"
              aria-label={t("filters.openAria", { count: appliedCount })}
            >
              <SlidersHorizontal size={16} aria-hidden />
              {t("filters.title")}
              {appliedCount ? (
                <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                  {appliedCount}
                </span>
              ) : null}
            </Button>
          </div>
        ) : null}
      </div>
      {hasDates ? (
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <aside className="hidden lg:block lg:w-72 lg:shrink-0 xl:w-80">
            <div className="sticky top-20">{filterRail("desktop")}</div>
          </aside>
          <div className="min-w-0 flex-1">
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
              className={RESULTS_GRID_CLASS}
            />
          </div>
        </div>
      ) : (
        <EmptyState
          icon={<CalendarDays size={40} />}
          title={t("datesNeededTitle")}
          description={t("datesNeededHint")}
          actionLabel={t("addDates")}
          onAction={() => setDatesOpen(true)}
          className="rounded-2xl border border-dashed border-border bg-surface px-6"
        />
      )}
      <Sheet
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        title={t("filters.title")}
        description={
          appliedCount ? t("filters.appliedCount", { count: appliedCount }) : undefined
        }
        closeLabel={t("filters.close")}
        footer={
          <div className="flex items-center justify-between gap-3">
            {hasFilters ? (
              <Button type="button" variant="ghost" onClick={clearAdvancedFilters}>
                {t("clearFilters")}
              </Button>
            ) : (
              <span />
            )}
            <Button type="button" onClick={() => setFiltersOpen(false)}>
              {t("filters.done")}
            </Button>
          </div>
        }
      >
        {filterRail("mobile", "border-0 p-0 shadow-none")}
      </Sheet>
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
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="hidden lg:block lg:w-72 xl:w-80">
          <FilterRailSkeleton />
        </div>
        <div className="min-w-0 flex-1">
          <CarGridSkeleton className={RESULTS_GRID_CLASS} />
        </div>
      </div>
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
