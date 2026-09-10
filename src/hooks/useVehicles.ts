"use client";

import { useQuery } from "@tanstack/react-query";
import { vehiclesApi } from "@/services/api";
import { QueryKeys } from "@/enums";
import type { VehicleFilters } from "@/types/vehicle";

export function useVehicles(companySlug: string, filters?: VehicleFilters) {
  return useQuery({
    queryKey: [QueryKeys.VEHICLES, companySlug, filters],
    queryFn: () => vehiclesApi.getByCompany(companySlug, filters),
    enabled: Boolean(companySlug),
  });
}
