"use client";

import { useQuery } from "@tanstack/react-query";
import { companiesApi } from "@/services/api";
import { QueryKeys } from "@/enums";
import type { CompanyListFilters } from "@/types/company";

export function useCompanies(filters?: CompanyListFilters) {
  return useQuery({
    queryKey: [QueryKeys.COMPANIES, filters],
    queryFn: () => companiesApi.getAll(filters),
  });
}
