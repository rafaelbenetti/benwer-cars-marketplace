import {
  FuelType,
  ReservationStatus,
  TransmissionType,
  VehicleStatus,
  VehicleType,
} from "@/enums";
import type { AvailabilityRange } from "@/types/availability";
import type { Company } from "@/types/company";
import type { GuestReservation } from "@/types/reservation";
import type { Vehicle } from "@/types/vehicle";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function readNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function readBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function readStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  return value.filter((item): item is string => typeof item === "string");
}

export function unwrapList<T>(payload: unknown): T[] {
  if (payload == null) {
    return [];
  }

  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (isRecord(payload) && Array.isArray(payload.data)) {
    return payload.data as T[];
  }

  return [];
}

function mapVehicleType(value: string | undefined): VehicleType {
  switch (value) {
    case VehicleType.SUV:
    case "suv":
      return VehicleType.SUV;
    case VehicleType.VAN:
    case "van":
    case "minivan":
      return VehicleType.VAN;
    case VehicleType.TRUCK:
    case "truck":
      return VehicleType.TRUCK;
    case VehicleType.MOTORCYCLE:
    case "motorcycle":
      return VehicleType.MOTORCYCLE;
    default:
      return VehicleType.CAR;
  }
}

function mapFuel(value: string | undefined): FuelType {
  switch (value) {
    case FuelType.DIESEL:
    case "diesel":
      return FuelType.DIESEL;
    case FuelType.ELECTRIC:
    case "electric":
      return FuelType.ELECTRIC;
    case FuelType.HYBRID:
    case "hybrid":
    case "plugin_hybrid":
      return FuelType.HYBRID;
    default:
      return FuelType.PETROL;
  }
}

function mapTransmission(value: string | undefined): TransmissionType {
  return value === TransmissionType.MANUAL || value === "manual"
    ? TransmissionType.MANUAL
    : TransmissionType.AUTOMATIC;
}

function mapVehicleStatus(
  status: string | undefined,
  available: boolean | undefined,
): VehicleStatus {
  if (status && Object.values(VehicleStatus).includes(status as VehicleStatus)) {
    return status as VehicleStatus;
  }

  return available === false ? VehicleStatus.RESERVED : VehicleStatus.AVAILABLE;
}

function mapReservationStatus(status: string | undefined): ReservationStatus {
  if (status && Object.values(ReservationStatus).includes(status as ReservationStatus)) {
    return status as ReservationStatus;
  }

  return ReservationStatus.CONFIRMED;
}

export function mapCompany(raw: unknown): Company {
  const row = isRecord(raw) ? raw : {};
  const branding = isRecord(row.branding) ? row.branding : {};

  return {
    id: readString(row.id) ?? readString(row.slug) ?? "",
    slug: readString(row.slug) ?? "",
    name: readString(row.name) ?? readString(row.slug) ?? "",
    description: readString(row.description) ?? null,
    location: readString(row.location) ?? null,
    locationSlug: readString(row.locationSlug) ?? null,
    vehicleCount: readNumber(row.vehicleCount) ?? readNumber(row.fleetSize) ?? null,
    isPublic: readBoolean(row.isPublic) ?? true,
    branding: {
      primaryColor: readString(branding.primaryColor) ?? "",
      logoUrl: readString(branding.logoUrl) ?? null,
    },
  };
}

export function mapVehicle(raw: unknown, fallbackSlug?: string): Vehicle {
  const row = isRecord(raw) ? raw : {};

  return {
    id: readString(row.id) ?? "",
    companySlug: readString(row.companySlug) ?? fallbackSlug ?? "",
    brand: readString(row.brand) ?? readString(row.make) ?? "",
    model: readString(row.model) ?? "",
    year: readNumber(row.year) ?? 0,
    type: mapVehicleType(readString(row.type) ?? readString(row.category)),
    transmission: mapTransmission(readString(row.transmission)),
    fuel: mapFuel(readString(row.fuel) ?? readString(row.fuelType)),
    seats: readNumber(row.seats) ?? 5,
    pricePerDay: readNumber(row.pricePerDay) ?? readNumber(row.dailyRate) ?? 0,
    currency: readString(row.currency) || "EUR",
    status: mapVehicleStatus(readString(row.status), readBoolean(row.available)),
    isPublic: readBoolean(row.isPublic) ?? true,
    photos: readStringArray(row.photos) ?? [],
    description: readString(row.description) ?? null,
  };
}

export function mapReservation(raw: unknown): GuestReservation {
  const row = isRecord(raw) ? raw : {};

  return {
    id: readString(row.id) ?? readString(row.token) ?? "",
    token: readString(row.token) ?? "",
    status: mapReservationStatus(readString(row.status)),
    vehicleId: readString(row.vehicleId) ?? "",
    startDate: readString(row.startDate) ?? "",
    endDate: readString(row.endDate) ?? "",
    totalPrice: readNumber(row.totalPrice) ?? readNumber(row.total) ?? 0,
    currency: readString(row.currency) || "EUR",
    guestName: readString(row.guestName) ?? "",
    guestEmail: readString(row.guestEmail) ?? "",
    guestPhone: readString(row.guestPhone) ?? "",
    companySlug: readString(row.companySlug) ?? "",
    createdAt: readString(row.createdAt) ?? new Date().toISOString(),
    vehicle: row.vehicle ? mapVehicle(row.vehicle, readString(row.companySlug)) : null,
    company: row.company ? mapCompany(row.company) : null,
  };
}

export function mapAvailability(raw: unknown): AvailabilityRange {
  const row = isRecord(raw) ? raw : {};

  return {
    vehicleId: readString(row.vehicleId) ?? "",
    unavailableDates: readStringArray(row.unavailableDates) ?? [],
  };
}

export function mapCompanyList(payload: unknown): Company[] {
  return unwrapList(payload)
    .map(mapCompany)
    .filter((company) => company.slug && company.isPublic);
}

export function mapVehicleList(payload: unknown, fallbackSlug?: string): Vehicle[] {
  return unwrapList(payload)
    .map((row) => mapVehicle(row, fallbackSlug))
    .filter((vehicle) => vehicle.id && vehicle.isPublic);
}

export function mapAvailabilityList(payload: unknown): AvailabilityRange[] {
  return unwrapList(payload)
    .map(mapAvailability)
    .filter((row) => row.vehicleId);
}
