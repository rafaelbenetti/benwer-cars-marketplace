export enum VehicleStatus {
  AVAILABLE = "available",
  RESERVED = "reserved",
  RENTED = "rented",
  MAINTENANCE = "maintenance",
}

export enum ReservationStatus {
  DRAFT = "draft",
  CONFIRMED = "confirmed",
  ACTIVE = "active",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum VehicleType {
  CAR = "car",
  SUV = "suv",
  VAN = "van",
  TRUCK = "truck",
  MOTORCYCLE = "motorcycle",
}

export enum TransmissionType {
  AUTOMATIC = "automatic",
  MANUAL = "manual",
}

export enum FuelType {
  PETROL = "petrol",
  DIESEL = "diesel",
  ELECTRIC = "electric",
  HYBRID = "hybrid",
}

export enum QueryKeys {
  COMPANIES = "companies",
  COMPANY = "company",
  VEHICLES = "vehicles",
  VEHICLE = "vehicle",
  AVAILABILITY = "availability",
  RESERVATION = "reservation",
}

export enum StorageKeys {
  LOCALE = "NEXT_LOCALE",
}

export enum NavRoutes {
  HOME = "/",
  COMPANIES = "/companies",
  COMPANY = "/companies/:slug",
  CAR_DETAIL = "/cars/:id",
  BOOK = "/book",
  BOOKING_STATUS = "/booking/:token",
}

export enum ErrorMessages {
  UNKNOWN = "errors.unknown",
  NETWORK = "errors.network",
  VEHICLE_NOT_FOUND = "errors.vehicle.not_found",
  COMPANY_NOT_FOUND = "errors.company.not_found",
  RESERVATION_OVERLAP = "errors.reservation.overlap",
  RESERVATION_NOT_FOUND = "errors.reservation.not_found",
}
