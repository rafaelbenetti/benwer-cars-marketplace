"use client";

import { useQuery } from "@tanstack/react-query";
import { vehiclesApi } from "@/services/api";
import { QueryKeys } from "@/enums";

export function useVehicle(companySlug: string, vehicleId: string) {
  return useQuery({
    queryKey: [QueryKeys.VEHICLE, companySlug, vehicleId],
    queryFn: () => vehiclesApi.getById(companySlug, vehicleId),
    enabled: Boolean(companySlug) && Boolean(vehicleId),
  });
}
