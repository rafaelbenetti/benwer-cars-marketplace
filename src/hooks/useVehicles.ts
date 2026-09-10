"use client";

import { useQuery } from "@tanstack/react-query";
import { vehiclesApi } from "@/services/api";
import { QueryKeys } from "@/enums";
import type { VehicleFilters } from "@/types/vehicle";

export function useVehicles(companySlug: string | undefined, filters?: VehicleFilters) {
  return useQuery({
    queryKey: [QueryKeys.VEHICLES, companySlug ?? "all", filters],
    queryFn: () =>
      companySlug
        ? vehiclesApi.getByCompany(companySlug, filters)
        : vehiclesApi.getAll(filters),
  });
}
