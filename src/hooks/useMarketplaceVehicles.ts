"use client";

import { useQuery } from "@tanstack/react-query";
import { vehiclesApi } from "@/services/api";
import { marketplaceVehiclesQueryKey } from "@/lib/queryKeys";
import type { MarketplaceSearchFilters } from "@/types/vehicle";

export function useMarketplaceVehicles(
  filters: MarketplaceSearchFilters | undefined,
  enabled = true,
) {
  return useQuery({
    queryKey: marketplaceVehiclesQueryKey(filters),
    queryFn: () => vehiclesApi.searchMarketplace(filters),
    enabled,
  });
}
