"use client";

import { useQuery } from "@tanstack/react-query";
import { companiesApi } from "@/services/api";
import { companyQueryKey } from "@/lib/queryKeys";

export function useCompany(slug: string) {
  return useQuery({
    queryKey: companyQueryKey(slug),
    queryFn: () => companiesApi.getBySlug(slug),
    enabled: Boolean(slug),
  });
}
