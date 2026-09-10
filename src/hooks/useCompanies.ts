"use client";

import { useQuery } from "@tanstack/react-query";
import { companiesApi } from "@/services/api";
import { QueryKeys } from "@/enums";

export function useCompanies() {
  return useQuery({
    queryKey: [QueryKeys.COMPANIES],
    queryFn: () => companiesApi.getAll(),
  });
}
