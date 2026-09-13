"use client";

import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useVehicles } from "@/hooks/useVehicles";
import { CarGridSkeleton, CarGridView } from "./CarGrid";
import { FilterBar, FilterBarSkeleton } from "./FilterBar";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatSearchDate, parseIsoDate } from "@/lib/dates";
import { appendSearchParams } from "@/lib/marketplaceSearch";
import {
  applyVehicleFilters,
  hasActiveVehicleFilters,
  parseBrowseParams,
  parseVehicleFilters,
} from "@/lib/vehicleFilters";
import type { Vehicle } from "@/types/vehicle";

interface CarListViewProps {
  companySlug: string;
  hrefBase: string;
}

function CarListViewContent({ companySlug, hrefBase }: CarListViewProps) {
  const t = useTranslations("cars");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = parseVehicleFilters(searchParams);
  const browse = parseBrowseParams(searchParams);
  const { data, isPending, isError, error, refetch } = useVehicles(
    companySlug,
    filters,
  );

  const hasFilters = hasActiveVehicleFilters(filters);
  const fromDate = filters.from ? parseIsoDate(filters.from) : null;
  const toDate = filters.to ? parseIsoDate(filters.to) : null;
  const count = data?.length ?? 0;
  const resultsLabel =
    fromDate && toDate
      ? t("resultsForDates", {
          count,
          from: formatSearchDate(fromDate, locale),
          to: formatSearchDate(toDate, locale),
        })
      : t("resultsCount", { count });

  function handleChange(next: typeof filters) {
    const params = applyVehicleFilters(searchParams, next);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function buildHref(vehicle: Vehicle): string {
    return appendSearchParams(`${hrefBase}/${vehicle.id}`, {
      location: browse.location,
      from: browse.from,
      to: browse.to,
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-xl font-semibold text-foreground">{t("title")}</h2>
        {isPending ? (
          <Skeleton className="h-4 w-36" />
        ) : isError ? null : (
          <p className="text-sm text-muted-foreground">{resultsLabel}</p>
        )}
      </div>
      <FilterBar filters={filters} onChange={handleChange} />
      <CarGridView
        vehicles={data}
        isPending={isPending}
        isError={isError}
        error={error}
        onRetry={refetch}
        buildHref={buildHref}
        onClearFilters={hasFilters ? () => handleChange({}) : undefined}
      />
    </div>
  );
}

function CarListViewFallback() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-36" />
      </div>
      <FilterBarSkeleton />
      <CarGridSkeleton />
    </div>
  );
}

export function CarListView({ companySlug, hrefBase }: CarListViewProps) {
  return (
    <Suspense fallback={<CarListViewFallback />}>
      <CarListViewContent companySlug={companySlug} hrefBase={hrefBase} />
    </Suspense>
  );
}
