import { toApiLocation } from "@/data/malagaCities";
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
      },
    },
  });

  const companies = applyCompanyListFilters(mapCompanyList(data), {
    location: toApiLocation(filters?.location) ?? filters?.location,
    q: filters?.q,
  });

  if (!filters?.from || !filters.to) {
    return companies;
  }

  const { vehiclesApi } = await import("./vehicles");
  const fleets = await Promise.all(
    companies.map(async (company) => {
      const vehicles = await vehiclesApi.getByCompany(company.slug, {
        from: filters.from,
        to: filters.to,
      });
      return {
        company: {
          ...company,
          vehicleCount: vehicles.length,
        },
        vehicleCount: vehicles.length,
      };
    }),
  );

  return fleets
    .filter((fleet) => fleet.vehicleCount > 0)
    .map((fleet) => fleet.company);
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
