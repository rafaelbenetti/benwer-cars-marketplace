import type { Company, CompanyListFilters } from "@/types/company";
import { apiClient } from "./client";
import { withMockFallback } from "./fallback";
import { mapCompany, mapCompanyList } from "./mappers";
import { mockCompaniesApi } from "./mock";
import { PublicApiPaths } from "./paths";
import { toSearchParams } from "./query";

export const companiesApi = {
  getAll(filters?: CompanyListFilters): Promise<Company[]> {
    return withMockFallback(
      () =>
        apiClient
          .get(
            `${PublicApiPaths.companies}${toSearchParams({
              q: filters?.q,
              location: filters?.location,
              from: filters?.from,
              to: filters?.to,
              cursor: filters?.cursor,
              limit: filters?.limit,
            })}`,
          )
          .then(mapCompanyList),
      () => mockCompaniesApi.getAll(filters),
      "companies.list",
    );
  },

  getBySlug(slug: string): Promise<Company> {
    return withMockFallback(
      () => apiClient.get(PublicApiPaths.company(slug)).then(mapCompany),
      () => mockCompaniesApi.getBySlug(slug),
      "companies.detail",
    );
  },
};
