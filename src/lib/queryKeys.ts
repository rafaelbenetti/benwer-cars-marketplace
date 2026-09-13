import { QueryKeys } from "@/enums";
import type { CompanyListFilters } from "@/types/company";
import type { VehicleFilters } from "@/types/vehicle";

export function companyQueryKey(slug: string) {
  return [QueryKeys.COMPANY, slug] as const;
}

export function companiesQueryKey(filters?: CompanyListFilters) {
  return [QueryKeys.COMPANIES, filters] as const;
}

export function vehiclesQueryKey(companySlug: string, filters?: VehicleFilters) {
  return [QueryKeys.VEHICLES, companySlug, filters] as const;
}
