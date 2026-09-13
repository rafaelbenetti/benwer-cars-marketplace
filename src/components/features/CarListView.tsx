"use client";

import { useState } from "react";
import { useVehicles } from "@/hooks/useVehicles";
import { CarGridView } from "./CarGrid";
import { FilterBar } from "./FilterBar";
import type { VehicleFilters, Vehicle } from "@/types/vehicle";

interface CarListViewProps {
  companySlug: string;
  carHrefPrefix: string;
}

export function CarListView({ companySlug, carHrefPrefix }: CarListViewProps) {
  const [filters, setFilters] = useState<VehicleFilters>({});
  const { data, isPending, isError, refetch } = useVehicles(companySlug, filters);

  function buildHref(vehicle: Vehicle) {
    return `${carHrefPrefix}/${vehicle.id}`;
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
