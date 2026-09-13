import type { Company, CompanyListFilters } from "@/types/company";
import { getOpenApiClient } from "./client";
import { withMockFallback } from "./fallback";
import { applyCompanyListFilters } from "./filters";
import { mapCompany, mapCompanyList } from "./mappers";
import { mockCompaniesApi } from "./mock";

async function fetchLiveCompanies(filters?: CompanyListFilters): Promise<Company[]> {
  const { data } = await getOpenApiClient().GET("/v1/public/companies", {
    params: {
      query: {
        q: filters?.q,
        location: filters?.location,
        from: filters?.from,
        to: filters?.to,
        cursor: filters?.cursor,
        limit: filters?.limit,
      },
    },
  });

  return applyCompanyListFilters(mapCompanyList(data), filters);
}

export const companiesApi = {
  getAll(filters?: CompanyListFilters): Promise<Company[]> {
    return withMockFallback(
      () => fetchLiveCompanies(filters),
      () => mockCompaniesApi.getAll(filters),
      "companies.list",
    );
  },

  getBySlug(slug: string): Promise<Company> {
    return withMockFallback(
      () =>
        getOpenApiClient()
          .GET("/v1/public/companies/{slug}", {
            params: { path: { slug } },
          })
          .then(({ data }) => mapCompany(data)),
      () => mockCompaniesApi.getBySlug(slug),
      "companies.detail",
    );
  },
};
