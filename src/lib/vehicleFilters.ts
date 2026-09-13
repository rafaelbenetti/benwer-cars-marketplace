import { SearchParams, TransmissionType, VehicleType } from "@/enums";
import type { VehicleFilters } from "@/types/vehicle";

export const FILTER_VEHICLE_TYPES = [
  VehicleType.CAR,
  VehicleType.SUV,
  VehicleType.VAN,
  VehicleType.TRUCK,
  VehicleType.MOTORCYCLE,
] as const;

export const FILTER_SEAT_OPTIONS = [2, 4, 5, 7, 8, 9] as const;

const VEHICLE_TYPE_VALUES = new Set<string>(Object.values(VehicleType));
const TRANSMISSION_VALUES = new Set<string>(Object.values(TransmissionType));
const SEAT_VALUES = new Set<number>(FILTER_SEAT_OPTIONS);

function setOrDelete(params: URLSearchParams, key: string, value: string | undefined) {
  if (value) {
    params.set(key, value);
  } else {
    params.delete(key);
  }
}

function parseVehicleType(value: string | null): VehicleType | undefined {
  if (!value || !VEHICLE_TYPE_VALUES.has(value)) {
    return undefined;
  }

  return value as VehicleType;
}

function parseTransmission(value: string | null): TransmissionType | undefined {
  if (!value || !TRANSMISSION_VALUES.has(value)) {
    return undefined;
  }

  return value as TransmissionType;
}

function parseSeats(value: string | null): number | undefined {
  if (!value) {
    return undefined;
  }

  const seats = Number.parseInt(value, 10);
  if (!Number.isInteger(seats) || !SEAT_VALUES.has(seats)) {
    return undefined;
  }

  return seats;
}

export function parseVehicleFilters(
  searchParams: Pick<URLSearchParams, "get">,
): VehicleFilters {
  const from = searchParams.get(SearchParams.FROM) || undefined;
  const to = searchParams.get(SearchParams.TO) || undefined;
  const q = searchParams.get(SearchParams.Q) || undefined;

  return {
    type: parseVehicleType(searchParams.get(SearchParams.TYPE)),
    seats: parseSeats(searchParams.get(SearchParams.SEATS)),
    transmission: parseTransmission(searchParams.get(SearchParams.TRANSMISSION)),
    from,
    to,
    q,
    companySlug: searchParams.get(SearchParams.COMPANY_SLUG) || undefined,
  };
}

export function applyVehicleFilters(
  searchParams: Pick<URLSearchParams, "toString">,
  filters: VehicleFilters,
): URLSearchParams {
  const next = new URLSearchParams(searchParams.toString());

  setOrDelete(next, SearchParams.FROM, filters.from);
  setOrDelete(next, SearchParams.TO, filters.to);
  setOrDelete(next, SearchParams.TYPE, filters.type);
  setOrDelete(next, SearchParams.SEATS, filters.seats?.toString());
  setOrDelete(next, SearchParams.TRANSMISSION, filters.transmission);
  setOrDelete(next, SearchParams.Q, filters.q);
  setOrDelete(next, SearchParams.COMPANY_SLUG, filters.companySlug);

  return next;
}

export function hasActiveVehicleFilters(filters: VehicleFilters): boolean {
  return Boolean(
    filters.type ||
      filters.seats ||
      filters.transmission ||
      filters.from ||
      filters.to ||
      filters.q ||
      filters.companySlug,
  );
}

export function parseBrowseParams(searchParams: Pick<URLSearchParams, "get">): {
  location?: string;
  from?: string;
  to?: string;
} {
  return {
    location: searchParams.get(SearchParams.LOCATION) || undefined,
    from: searchParams.get(SearchParams.FROM) || undefined,
    to: searchParams.get(SearchParams.TO) || undefined,
  };
}
