"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
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

const VEHICLE_TYPES: { value: VehicleType; label: string }[] = [
  { value: VehicleType.CAR, label: "Car" },
  { value: VehicleType.SUV, label: "SUV" },
  { value: VehicleType.VAN, label: "Van" },
  { value: VehicleType.TRUCK, label: "Truck" },
  { value: VehicleType.MOTORCYCLE, label: "Motorcycle" },
];

const SEAT_OPTIONS = [2, 4, 5, 7, 8, 9];

export function FilterBar({ filters, onChange, className }: FilterBarProps) {
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
        "rounded-xl border border-border bg-surface p-4 flex flex-col gap-4",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <Input
          type="search"
          placeholder="Search cars…"
          value={filters.q ?? ""}
          onChange={(e) => onChange({ ...filters, q: e.target.value || undefined })}
          className="flex-1"
          aria-label="Search cars"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded((v) => !v)}
          aria-label={isExpanded ? "Hide filters" : "Show filters"}
          aria-expanded={isExpanded}
        >
          <SlidersHorizontal size={16} aria-hidden />
        </Button>
        {hasActiveFilters ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearFilters}
            aria-label="Clear all filters"
          >
            <X size={16} aria-hidden />
          </Button>
        ) : null}
      </div>

      {isExpanded ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-border">
          <fieldset>
            <legend className="text-xs font-medium text-muted-foreground mb-1.5">
              Type
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {VEHICLE_TYPES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() =>
                    onChange({
                      ...filters,
                      type: filters.type === value ? undefined : value,
                    })
                  }
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium border transition-colors cursor-pointer",
                    filters.type === value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-surface text-muted-foreground border-border hover:border-border-strong hover:text-foreground",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-xs font-medium text-muted-foreground mb-1.5">
              Seats
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {SEAT_OPTIONS.map((seats) => (
                <button
                  key={seats}
                  onClick={() =>
                    onChange({
                      ...filters,
                      seats: filters.seats === seats ? undefined : seats,
                    })
                  }
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium border transition-colors cursor-pointer",
                    filters.seats === seats
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-surface text-muted-foreground border-border hover:border-border-strong hover:text-foreground",
                  )}
                >
                  {seats}+
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-xs font-medium text-muted-foreground mb-1.5">
              Transmission
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {[
                { value: TransmissionType.AUTOMATIC, label: "Auto" },
                { value: TransmissionType.MANUAL, label: "Manual" },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() =>
                    onChange({
                      ...filters,
                      transmission: filters.transmission === value ? undefined : value,
                    })
                  }
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium border transition-colors cursor-pointer",
                    filters.transmission === value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-surface text-muted-foreground border-border hover:border-border-strong hover:text-foreground",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-medium text-muted-foreground">Dates</p>
            <div className="flex gap-2">
              <Input
                type="date"
                value={filters.from ?? ""}
                onChange={(e) => onChange({ ...filters, from: e.target.value || undefined })}
                aria-label="Pick-up date"
                className="flex-1 text-xs"
              />
              <Input
                type="date"
                value={filters.to ?? ""}
                onChange={(e) => onChange({ ...filters, to: e.target.value || undefined })}
                aria-label="Drop-off date"
                className="flex-1 text-xs"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
