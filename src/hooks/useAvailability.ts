"use client";

import { useQuery } from "@tanstack/react-query";
import { availabilityApi } from "@/services/api";
import { QueryKeys } from "@/enums";
import type { AvailabilityQuery } from "@/types/availability";

export function useAvailability(companySlug: string, params: AvailabilityQuery) {
  return useQuery({
    queryKey: [QueryKeys.AVAILABILITY, companySlug, params],
    queryFn: () => availabilityApi.check(companySlug, params),
    enabled: Boolean(companySlug) && Boolean(params.from) && Boolean(params.to),
  });
}
