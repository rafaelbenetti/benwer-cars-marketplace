"use client";

import { Car } from "lucide-react";
import { CarCard } from "./CarCard";
import { CarCardSkeleton } from "./CarCardSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
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
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5",
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
  onClearFilters?: () => void;
  className?: string;
}

export function CarGrid({
  vehicles,
  buildHref,
  onClearFilters,
  className,
}: CarGridProps) {
  if (vehicles.length === 0) {
    return (
      <EmptyState
        icon={<Car size={40} />}
        title="No cars available"
        description="No cars match your current filters."
        actionLabel={onClearFilters ? "Clear filters" : undefined}
        onAction={onClearFilters}
      />
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5",
        className,
      )}
    >
      {vehicles.map((vehicle) => (
        <CarCard
          key={vehicle.id}
          vehicle={vehicle}
          href={buildHref(vehicle)}
        />
      ))}
    </div>
  );
}

interface CarGridViewProps {
  vehicles: Vehicle[] | undefined;
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
  buildHref: (vehicle: Vehicle) => string;
  onClearFilters?: () => void;
}

export function CarGridView({
  vehicles,
  isPending,
  isError,
  onRetry,
  buildHref,
  onClearFilters,
}: CarGridViewProps) {
  if (isPending) return <CarGridSkeleton />;
  if (isError) return <ErrorState onRetry={onRetry} />;
  return (
    <CarGrid
      vehicles={vehicles ?? []}
      buildHref={buildHref}
      onClearFilters={onClearFilters}
    />
  );
}
