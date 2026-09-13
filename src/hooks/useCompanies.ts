"use client";

import { useQuery } from "@tanstack/react-query";
import { companiesApi } from "@/services/api";
import { companiesQueryKey } from "@/lib/queryKeys";
import type { CompanyListFilters } from "@/types/company";

export function useCompanies(filters?: CompanyListFilters) {
  return useQuery({
    queryKey: companiesQueryKey(filters),
    queryFn: () => companiesApi.getAll(filters),
  });
}
