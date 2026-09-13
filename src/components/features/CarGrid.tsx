"use client";

import { Car } from "lucide-react";
import { useTranslations } from "next-intl";
import { CarCard } from "./CarCard";
import { CarCardSkeleton } from "./CarCardSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { getErrorKey } from "@/lib/errors";
import type { Company } from "@/types/company";
import type { Vehicle } from "@/types/vehicle";
import { cn } from "@/lib/utils";

interface CarGridLoadingProps {
  count?: number;
  className?: string;
}

export function CarGridSkeleton({ count = 8, className }: CarGridLoadingProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <CarCardSkeleton key={i} />
      ))}
    </div>
  );
}

interface CarGridProps {
  vehicles: Vehicle[];
  buildHref: (vehicle: Vehicle) => string;
  companyFor?: (vehicle: Vehicle) => Pick<Company, "name" | "slug" | "branding"> | null;
  onClearFilters?: () => void;
  emptyTitle?: string;
  emptyHint?: string;
  emptyActionLabel?: string;
  className?: string;
}

export function CarGrid({
  vehicles,
  buildHref,
  companyFor,
  onClearFilters,
  emptyTitle,
  emptyHint,
  emptyActionLabel,
  className,
}: CarGridProps) {
  const t = useTranslations("cars");

  if (vehicles.length === 0) {
    return (
      <EmptyState
        icon={<Car size={40} />}
        title={emptyTitle ?? (onClearFilters ? t("noResults") : t("emptyTitle"))}
        description={emptyHint ?? (onClearFilters ? t("noResultsHint") : t("emptyHint"))}
        actionLabel={
          emptyActionLabel ?? (onClearFilters ? t("clearFilters") : undefined)
        }
        onAction={onClearFilters}
        className="rounded-2xl border border-dashed border-border bg-surface px-6"
      />
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {vehicles.map((vehicle, index) => (
        <CarCard
          key={`${vehicle.companySlug}-${vehicle.id}`}
          vehicle={vehicle}
          href={buildHref(vehicle)}
          company={companyFor?.(vehicle)}
          priority={index === 0}
        />
      ))}
    </div>
  );
}

interface CarGridViewProps {
  vehicles: Vehicle[] | undefined;
  isPending: boolean;
  isError: boolean;
  error?: unknown;
  onRetry: () => void;
  buildHref: (vehicle: Vehicle) => string;
  companyFor?: (vehicle: Vehicle) => Pick<Company, "name" | "slug" | "branding"> | null;
  onClearFilters?: () => void;
  emptyTitle?: string;
  emptyHint?: string;
  emptyActionLabel?: string;
}

export function CarGridView({
  vehicles,
  isPending,
  isError,
  error,
  onRetry,
  buildHref,
  companyFor,
  onClearFilters,
  emptyTitle,
  emptyHint,
  emptyActionLabel,
}: CarGridViewProps) {
  const t = useTranslations();

  if (isPending) return <CarGridSkeleton />;
  if (isError) {
    return <ErrorState message={t(getErrorKey(error))} onRetry={onRetry} />;
  }
  return (
    <CarGrid
      vehicles={vehicles ?? []}
      buildHref={buildHref}
      companyFor={companyFor}
      onClearFilters={onClearFilters}
      emptyTitle={emptyTitle}
      emptyHint={emptyHint}
      emptyActionLabel={emptyActionLabel}
    />
  );
}
