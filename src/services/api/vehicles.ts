import type { Vehicle, VehicleFilters } from "@/types/vehicle";
import { apiClient } from "./client";
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
};
