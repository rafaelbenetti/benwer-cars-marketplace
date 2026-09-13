import { toApiLocation } from "@/data/malagaCities";
import type {
  MarketplaceSearchFilters,
  MarketplaceVehicle,
  Vehicle,
  VehicleFilters,
} from "@/types/vehicle";
import { apiClient } from "./client";
import { companiesApi } from "./companies";
import { withMockFallback } from "./fallback";
import { mapVehicle, mapVehicleList } from "./mappers";
import { mockVehiclesApi } from "./mock";
import { PublicApiPaths } from "./paths";
import { toSearchParams } from "./query";

function vehicleQuery(filters?: VehicleFilters): string {
  return toSearchParams({
    type: filters?.type,
    seats: filters?.seats,
    minSeats: filters?.seats,
    transmission: filters?.transmission,
    from: filters?.from,
    to: filters?.to,
    q: filters?.q,
    sort: filters?.sort,
    cursor: filters?.cursor,
    limit: filters?.limit,
  });
}

export const vehiclesApi = {
  getByCompany(companySlug: string, filters?: VehicleFilters): Promise<Vehicle[]> {
    return withMockFallback(
      () =>
        apiClient
          .get(`${PublicApiPaths.vehicles(companySlug)}${vehicleQuery(filters)}`)
          .then((payload) => mapVehicleList(payload, companySlug)),
      () => mockVehiclesApi.getByCompany(companySlug, filters),
      "vehicles.list",
    );
  },

  getById(companySlug: string, id: string): Promise<Vehicle> {
    return withMockFallback(
      () =>
        apiClient
          .get(PublicApiPaths.vehicle(companySlug, id))
          .then((payload) => mapVehicle(payload, companySlug)),
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
  const location = toApiLocation(filters?.location);
  const companies = filters?.companySlug
    ? await companiesApi
        .getBySlug(filters.companySlug)
        .then((company) => [company])
        .catch(() => [])
    : await companiesApi.getAll({
        location,
        from: filters?.from,
        to: filters?.to,
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
