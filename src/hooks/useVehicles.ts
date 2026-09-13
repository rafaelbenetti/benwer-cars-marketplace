"use client";

import { useQuery } from "@tanstack/react-query";
import { vehiclesApi } from "@/services/api";
import { vehiclesQueryKey } from "@/lib/queryKeys";
import type { VehicleFilters } from "@/types/vehicle";

export function useVehicles(companySlug: string, filters?: VehicleFilters) {
  return useQuery({
    queryKey: vehiclesQueryKey(companySlug, filters),
    queryFn: () => vehiclesApi.getByCompany(companySlug, filters),
    enabled: Boolean(companySlug),
  });
}
