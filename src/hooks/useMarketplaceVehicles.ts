"use client";

import { useQuery } from "@tanstack/react-query";
import { vehiclesApi } from "@/services/api";
import { QueryKeys } from "@/enums";
import type { MarketplaceSearchFilters } from "@/types/vehicle";

export function useMarketplaceVehicles(
  filters: MarketplaceSearchFilters | undefined,
  enabled = true,
) {
  return useQuery({
    queryKey: [QueryKeys.VEHICLES, "marketplace", filters],
    queryFn: () => vehiclesApi.searchMarketplace(filters),
    enabled,
  });
}
