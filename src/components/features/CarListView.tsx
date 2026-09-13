"use client";

import { useState } from "react";
import { useVehicles } from "@/hooks/useVehicles";
import { CarGridView } from "./CarGrid";
import { FilterBar } from "./FilterBar";
import type { VehicleFilters, Vehicle } from "@/types/vehicle";

interface CarListViewProps {
  companySlug: string;
  hrefBase: string;
}

export function CarListView({ companySlug, hrefBase }: CarListViewProps) {
  const [filters, setFilters] = useState<VehicleFilters>({});
  const { data, isPending, isError, refetch } = useVehicles(companySlug, filters);

  return (
    <div className="flex flex-col gap-6">
      <FilterBar filters={filters} onChange={setFilters} />
      <CarGridView
        vehicles={data}
        isPending={isPending}
        isError={isError}
        onRetry={refetch}
        buildHref={(vehicle: Vehicle) => `${hrefBase}/${vehicle.id}`}
        onClearFilters={() => setFilters({})}
      />
    </div>
  );
}
