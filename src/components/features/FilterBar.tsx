"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { VehicleType, TransmissionType } from "@/enums";
import type { VehicleFilters } from "@/types/vehicle";

interface FilterBarProps {
  filters: VehicleFilters;
  onChange: (filters: VehicleFilters) => void;
  className?: string;
}

const VEHICLE_TYPES = [
  VehicleType.CAR,
  VehicleType.SUV,
  VehicleType.VAN,
  VehicleType.TRUCK,
  VehicleType.MOTORCYCLE,
] as const;

const SEAT_OPTIONS = [2, 4, 5, 7, 8, 9];

export function FilterBar({ filters, onChange, className }: FilterBarProps) {
  const t = useTranslations("cars");
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters =
    Boolean(filters.type) ||
    Boolean(filters.seats) ||
    Boolean(filters.transmission) ||
    Boolean(filters.from) ||
    Boolean(filters.to) ||
    Boolean(filters.q);

  function clearFilters() {
    onChange({});
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-border bg-surface p-2 shadow-md md:p-2.5",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <Input
          type="search"
          placeholder={t("searchPlaceholder")}
          value={filters.q ?? ""}
          onChange={(e) => onChange({ ...filters, q: e.target.value || undefined })}
          className="h-11 flex-1"
          aria-label={t("searchPlaceholder")}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded((v) => !v)}
          aria-label={isExpanded ? t("hideFilters") : t("showFilters")}
          aria-expanded={isExpanded}
          className="h-11 w-11 shrink-0"
        >
          <SlidersHorizontal size={16} aria-hidden />
        </Button>
        {hasActiveFilters ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearFilters}
            aria-label={t("clearFilters")}
            className="h-11 w-11 shrink-0"
          >
            <X size={16} aria-hidden />
          </Button>
        ) : null}
      </div>

      {isExpanded ? (
        <div className="grid grid-cols-2 gap-4 border-t border-border px-2 pt-3 pb-1 md:grid-cols-4">
          <fieldset>
            <legend className="mb-1.5 text-xs font-medium text-muted-foreground">
              {t("filters.type")}
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {VEHICLE_TYPES.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...filters,
                      type: filters.type === value ? undefined : value,
                    })
                  }
                  className={cn(
                    "cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    filters.type === value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-surface text-muted-foreground hover:border-border-strong hover:text-foreground",
                  )}
                >
                  {t(`types.${value}`)}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-1.5 text-xs font-medium text-muted-foreground">
              {t("filters.seats")}
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {SEAT_OPTIONS.map((seats) => (
                <button
                  key={seats}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...filters,
                      seats: filters.seats === seats ? undefined : seats,
                    })
                  }
                  className={cn(
                    "cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    filters.seats === seats
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-surface text-muted-foreground hover:border-border-strong hover:text-foreground",
                  )}
                >
                  {seats}+
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-1.5 text-xs font-medium text-muted-foreground">
              {t("filters.transmission")}
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {[TransmissionType.AUTOMATIC, TransmissionType.MANUAL].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...filters,
                      transmission: filters.transmission === value ? undefined : value,
                    })
                  }
                  className={cn(
                    "cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    filters.transmission === value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-surface text-muted-foreground hover:border-border-strong hover:text-foreground",
                  )}
                >
                  {t(`transmission.${value}`)}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-medium text-muted-foreground">{t("filters.dates")}</p>
            <div className="flex gap-2">
              <Input
                type="date"
                value={filters.from ?? ""}
                onChange={(e) => onChange({ ...filters, from: e.target.value || undefined })}
                aria-label={t("filters.from")}
                className="h-11 flex-1"
              />
              <Input
                type="date"
                value={filters.to ?? ""}
                onChange={(e) => onChange({ ...filters, to: e.target.value || undefined })}
                aria-label={t("filters.to")}
                className="h-11 flex-1"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
