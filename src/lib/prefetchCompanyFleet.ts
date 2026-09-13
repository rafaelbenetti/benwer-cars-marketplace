import { dehydrate, QueryClient } from "@tanstack/react-query";
import { vehiclesApi } from "@/services/api";
import { logError } from "@/lib/logger";
import { companyQueryKey, vehiclesQueryKey } from "@/lib/queryKeys";
import type { Company } from "@/types/company";
import type { VehicleFilters } from "@/types/vehicle";

export async function prefetchCompanyFleetState(
  company: Company,
  filters?: VehicleFilters,
) {
  const queryClient = new QueryClient();
  queryClient.setQueryData(companyQueryKey(company.slug), company);

  try {
    const vehicles = await vehiclesApi.getByCompany(company.slug, filters);
    queryClient.setQueryData(vehiclesQueryKey(company.slug, filters), vehicles);
  } catch (error) {
    logError(error, { context: "company_fleet_prefetch", slug: company.slug });
  }

  return dehydrate(queryClient);
}

export function searchRecordToURLSearchParams(
  query: Record<string, string | string[] | undefined>,
): URLSearchParams {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item) {
          params.append(key, item);
        }
      }
    } else if (value) {
      params.set(key, value);
    }
  }

  return params;
}
