import type {
  MarketplaceSearchFilters,
  MarketplaceVehicle,
  Vehicle,
  VehicleFilters,
} from "@/types/vehicle";
import { getOpenApiClient } from "./client";
import { companiesApi } from "./companies";
import { withMockFallback } from "./fallback";
import { applyVehicleListFilters } from "./filters";
import { mapVehicle, mapVehicleList } from "./mappers";
import { mockVehiclesApi } from "./mock";

async function fetchLiveVehicles(
  companySlug: string,
  filters?: VehicleFilters,
): Promise<Vehicle[]> {
  const { data } = await getOpenApiClient().GET(
    "/v1/public/companies/{slug}/vehicles",
    {
      params: {
        path: { slug: companySlug },
        query: {
          q: filters?.q,
          type: filters?.type,
          seats: filters?.seats,
          transmission: filters?.transmission,
          from: filters?.from,
          to: filters?.to,
          sort: filters?.sort,
          cursor: filters?.cursor,
          limit: filters?.limit,
        },
      },
    },
  );

  return applyVehicleListFilters(
    mapVehicleList(data, { companySlug }),
    filters,
  );
}

export const vehiclesApi = {
  getByCompany(companySlug: string, filters?: VehicleFilters): Promise<Vehicle[]> {
    return withMockFallback(
      () => fetchLiveVehicles(companySlug, filters),
      () => mockVehiclesApi.getByCompany(companySlug, filters),
      "vehicles.list",
    );
  },

  getById(companySlug: string, id: string): Promise<Vehicle> {
    return withMockFallback(
      () =>
        getOpenApiClient()
          .GET("/v1/public/companies/{slug}/vehicles/{id}", {
            params: { path: { slug: companySlug, id } },
          })
          .then(({ data }) => mapVehicle(data, { companySlug })),
      () => mockVehiclesApi.getById(companySlug, id),
      "vehicles.detail",
    );
  },

  searchMarketplace(
    filters?: MarketplaceSearchFilters,
  ): Promise<MarketplaceVehicle[]> {
    return withMockFallback(
      () => searchLiveMarketplace(filters),
      () => mockVehiclesApi.searchMarketplace(filters),
      "vehicles.search",
    );
  },
};

async function searchLiveMarketplace(
  filters?: MarketplaceSearchFilters,
): Promise<MarketplaceVehicle[]> {
  const location = filters?.location;
  const selectedSlugs = filters?.companySlugs?.length
    ? filters.companySlugs
    : filters?.companySlug
      ? [filters.companySlug]
      : [];
  const companies = selectedSlugs.length
    ? (
        await Promise.all(
          selectedSlugs.map((slug) =>
            companiesApi.getBySlug(slug).catch(() => null),
          ),
        )
      ).flatMap((company) => (company ? [company] : []))
    : await companiesApi.getAll({
        location,
        from: filters?.from,
        to: filters?.to,
        q: filters?.q,
      });

  const fleets = await Promise.all(
    companies.map(async (company) => {
      const vehicles = await vehiclesApi.getByCompany(company.slug, {
        type: filters?.type,
        seats: filters?.seats,
        transmission: filters?.transmission,
        from: filters?.from,
        to: filters?.to,
        q: filters?.q,
        sort: filters?.sort,
      });
      return vehicles.map((vehicle) => ({ ...vehicle, company }));
    }),
  );

  return fleets.flat();
}
