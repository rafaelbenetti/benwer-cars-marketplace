import type { Vehicle, VehicleFilters } from "@/types/vehicle";
import { mockClient } from "./client";

export const vehiclesApi = {
  getByCompany(
    _companySlug: string,
    _filters?: VehicleFilters,
  ): Promise<Vehicle[]> {
    return mockClient.get<Vehicle[]>("/mock-data/vehicles.json");
  },

  getById(_companySlug: string, _id: string): Promise<Vehicle> {
    return mockClient.get<Vehicle[]>("/mock-data/vehicles.json").then((vehicles) => {
      const found = vehicles.find((v) => v.id === _id);
      if (!found) throw new Error("Vehicle not found");
      return found;
    });
  },
};
