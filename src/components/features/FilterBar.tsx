"use client";

import { useTranslations } from "next-intl";
import { DateRangePopover } from "./DateRangePopover";
import { FilterChip, FilterGroup } from "./FilterControls";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import {
  FILTER_SEAT_OPTIONS,
  FILTER_VEHICLE_TYPES,
  hasActiveVehicleFilters,
} from "@/lib/vehicleFilters";
import { TransmissionType } from "@/enums";
import type { VehicleFilters } from "@/types/vehicle";

interface FilterBarProps {
  filters: VehicleFilters;
  onChange: (filters: VehicleFilters) => void;
  className?: string;
}

export function FilterBar({ filters, onChange, className }: FilterBarProps) {
  const t = useTranslations("cars");
  const hasActiveFilters = hasActiveVehicleFilters(filters);

  function clearFilters() {
    onChange({});
  }

  return (
    <div
      role="search"
      aria-label={t("filters.title")}
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-border bg-surface p-2 shadow-md md:p-2.5",
        className,
      )}
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-stretch">
        <DateRangePopover
          from={filters.from ?? ""}
          to={filters.to ?? ""}
          onChange={(next) =>
            onChange({
              ...filters,
              from: next.from || undefined,
              to: next.to || undefined,
            })
          }
        />
        {hasActiveFilters ? (
          <Button
            type="button"
            variant="ghost"
            onClick={clearFilters}
            className="h-11 shrink-0 md:self-center"
          >
            {t("clearFilters")}
          </Button>
        ) : null}
      </div>

      <div className="flex flex-col gap-4 border-t border-border px-2 pt-3 pb-1">
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
      </div>
    </div>
  );
}

export function FilterBarSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-border bg-surface p-2 shadow-md md:p-2.5",
        className,
      )}
    >
      <div className="flex flex-col gap-2 md:flex-row">
        <Skeleton className="h-12 w-full md:flex-1" />
        <Skeleton className="h-12 w-full md:flex-1" />
      </div>
      <div className="flex flex-col gap-3 border-t border-border px-2 pt-3 pb-1">
        <div className="flex flex-wrap gap-1.5">
          <Skeleton className="h-8 w-16 rounded-full" />
          <Skeleton className="h-8 w-14 rounded-full" />
          <Skeleton className="h-8 w-16 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Skeleton className="h-8 w-10 rounded-full" />
          <Skeleton className="h-8 w-10 rounded-full" />
          <Skeleton className="h-8 w-10 rounded-full" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}
