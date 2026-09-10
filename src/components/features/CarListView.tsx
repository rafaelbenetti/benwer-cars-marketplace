"use client";

import { useState } from "react";
import { useVehicles } from "@/hooks/useVehicles";
import { CarGridView } from "./CarGrid";
import { FilterBar } from "./FilterBar";
import type { VehicleFilters, Vehicle } from "@/types/vehicle";

interface CarListViewProps {
  companySlug?: string;
  tenant?: boolean;
}

export function CarListView({ companySlug, tenant = false }: CarListViewProps) {
  const [filters, setFilters] = useState<VehicleFilters>({});
  const { data, isPending, isError, refetch } = useVehicles(companySlug, filters);

  function buildHref(vehicle: Vehicle) {
    if (tenant) return `/cars/${vehicle.id}`;
    const slug = vehicle.companySlug || companySlug;
    return `/companies/${slug}/cars/${vehicle.id}`;
  }

  return (
    <div className="flex flex-col gap-6">
      <FilterBar filters={filters} onChange={setFilters} />
      <CarGridView
        vehicles={data}
        isPending={isPending}
        isError={isError}
        onRetry={refetch}
        buildHref={buildHref}
        onClearFilters={() => setFilters({})}
      />
    </div>
  );
}
