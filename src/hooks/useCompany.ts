"use client";

import { useQuery } from "@tanstack/react-query";
import { companiesApi } from "@/services/api";
import { QueryKeys } from "@/enums";

export function useCompany(slug: string) {
  return useQuery({
    queryKey: [QueryKeys.COMPANY, slug],
    queryFn: () => companiesApi.getBySlug(slug),
    enabled: Boolean(slug),
  });
}
