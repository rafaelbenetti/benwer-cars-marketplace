"use client";

import { useTranslations } from "next-intl";
import { CompanyFilterGroup } from "./CompanyFilterGroup";
import { FilterChip, FilterGroup } from "./FilterControls";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { TransmissionType } from "@/enums";
import {
  FILTER_SEAT_OPTIONS,
  FILTER_VEHICLE_TYPES,
  countAdvancedFilters,
  hasActiveAdvancedFilters,
} from "@/lib/vehicleFilters";
import { cn } from "@/lib/utils";
import type { Company } from "@/types/company";
import type { VehicleFilters } from "@/types/vehicle";

interface FilterRailProps {
  filters: VehicleFilters;
  onChange: (filters: VehicleFilters) => void;
  companies: Company[];
  idPrefix?: string;
  className?: string;
}

export function FilterRail({
  filters,
  onChange,
  companies,
  idPrefix = "desktop",
  className,
}: FilterRailProps) {
  const t = useTranslations("cars");
  const appliedCount = countAdvancedFilters(filters);
  const hasFilters = hasActiveAdvancedFilters(filters);

  function clearAdvancedFilters() {
    onChange({
      from: filters.from,
      to: filters.to,
    });
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-5 rounded-2xl border border-border bg-surface p-4",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">{t("filters.title")}</h3>
          {appliedCount ? (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {t("filters.appliedCount", { count: appliedCount })}
            </span>
          ) : null}
        </div>
        {hasFilters ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearAdvancedFilters}
            className="h-auto px-1.5 py-0.5 text-xs"
          >
            {t("clearFilters")}
          </Button>
        ) : null}
      </div>

      <FilterGroup legend={t("filters.type")}>
        {FILTER_VEHICLE_TYPES.map((value) => (
          <FilterChip
            key={value}
            pressed={filters.type === value}
            onClick={() =>
              onChange({
                ...filters,
                type: filters.type === value ? undefined : value,
              })
            }
          >
            {t(`types.${value}`)}
          </FilterChip>
        ))}
      </FilterGroup>

      <FilterGroup legend={t("filters.transmission")}>
        {[TransmissionType.AUTOMATIC, TransmissionType.MANUAL].map((value) => (
          <FilterChip
            key={value}
            pressed={filters.transmission === value}
            onClick={() =>
              onChange({
                ...filters,
                transmission: filters.transmission === value ? undefined : value,
              })
            }
          >
            {t(`transmission.${value}`)}
          </FilterChip>
        ))}
      </FilterGroup>

      <FilterGroup legend={t("filters.seats")}>
        {FILTER_SEAT_OPTIONS.map((seats) => (
          <FilterChip
            key={seats}
            pressed={filters.seats === seats}
            onClick={() =>
              onChange({
                ...filters,
                seats: filters.seats === seats ? undefined : seats,
              })
            }
          >
            {t("seatsPlus", { count: seats })}
          </FilterChip>
        ))}
      </FilterGroup>

      <CompanyFilterGroup
        companies={companies}
        selectedSlugs={filters.companySlugs ?? []}
        idPrefix={idPrefix}
        onChange={(companySlugs) =>
          onChange({
            ...filters,
            companySlugs,
            companySlug: companySlugs?.[0],
          })
        }
      />
    </div>
  );
}

export function FilterRailSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 rounded-2xl border border-border bg-surface p-4",
        className,
      )}
    >
      <Skeleton className="h-5 w-20" />
      <div className="flex flex-wrap gap-1.5">
        <Skeleton className="h-8 w-16 rounded-full" />
        <Skeleton className="h-8 w-14 rounded-full" />
        <Skeleton className="h-8 w-16 rounded-full" />
      </div>
      <div className="flex flex-wrap gap-1.5">
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
      <div className="flex flex-wrap gap-1.5">
        <Skeleton className="h-8 w-10 rounded-full" />
        <Skeleton className="h-8 w-10 rounded-full" />
        <Skeleton className="h-8 w-10 rounded-full" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}
