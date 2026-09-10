import type { Vehicle, VehicleFilters } from "@/types/vehicle";
import { FuelType, TransmissionType, VehicleStatus, VehicleType } from "@/enums";
import { apiClient } from "./client";

interface ApiVehicle {
  id: string;
  companySlug?: string;
  companyName?: string;
  make: string;
  model: string;
  year: number;
  color: string;
  fuelType: string;
  category: string;
  dailyRate: number;
  deposit: number;
  seats: number | null;
  transmission: string | null;
  description: string | null;
  currency: string;
  photos: string[] | null;
  available: boolean;
}

function mapCategory(category: string): VehicleType {
  switch (category) {
    case "suv":
      return VehicleType.SUV;
    case "minivan":
    case "van":
      return VehicleType.VAN;
    default:
      return VehicleType.CAR;
  }
}

function mapFuel(fuel: string): FuelType {
  switch (fuel) {
    case "diesel":
      return FuelType.DIESEL;
    case "electric":
      return FuelType.ELECTRIC;
    case "hybrid":
    case "plugin_hybrid":
      return FuelType.HYBRID;
    default:
      return FuelType.PETROL;
  }
}

function mapVehicle(raw: ApiVehicle, fallbackSlug?: string): Vehicle {
  return {
    id: raw.id,
    companySlug: raw.companySlug ?? fallbackSlug ?? "",
    companyName: raw.companyName,
    brand: raw.make,
    model: raw.model,
    year: raw.year,
    type: mapCategory(raw.category),
    transmission:
      raw.transmission === "manual"
        ? TransmissionType.MANUAL
        : TransmissionType.AUTOMATIC,
    fuel: mapFuel(raw.fuelType),
    seats: raw.seats ?? 5,
    pricePerDay: raw.dailyRate,
    currency: raw.currency || "EUR",
    status: raw.available ? VehicleStatus.AVAILABLE : VehicleStatus.RESERVED,
    isPublic: true,
    photos: raw.photos ?? [],
    description: raw.description,
  };
}

function toQuery(filters?: VehicleFilters): string {
  if (!filters) return "";
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.type) params.set("type", filters.type);
  if (filters.seats) params.set("minSeats", String(filters.seats));
  if (filters.transmission) params.set("transmission", filters.transmission);
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const vehiclesApi = {
  getAll(filters?: VehicleFilters): Promise<Vehicle[]> {
    return apiClient
      .get<ApiVehicle[] | null>(`/v1/public/vehicles${toQuery(filters)}`)
      .then((rows) => (rows ?? []).map((row) => mapVehicle(row)));
  },

  getByCompany(
    companySlug: string,
    filters?: VehicleFilters,
  ): Promise<Vehicle[]> {
    return apiClient
      .get<ApiVehicle[] | null>(
        `/v1/public/companies/${companySlug}/vehicles${toQuery(filters)}`,
      )
      .then((rows) =>
        (rows ?? []).map((row) => mapVehicle(row, companySlug)),
      );
  },

  getById(companySlug: string, id: string): Promise<Vehicle> {
    return apiClient
      .get<ApiVehicle>(`/v1/public/companies/${companySlug}/vehicles/${id}`)
      .then((row) => mapVehicle(row, companySlug));
  },
};
