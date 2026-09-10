import type { VehicleStatus, VehicleType, TransmissionType, FuelType } from "@/enums";

export interface Vehicle {
  id: string;
  companySlug: string;
  companyName?: string;
  brand: string;
  model: string;
  year: number;
  type: VehicleType;
  transmission: TransmissionType;
  fuel: FuelType;
  seats: number;
  pricePerDay: number;
  currency: string;
  status: VehicleStatus;
  isPublic: boolean;
  photos: string[];
  description: string | null;
}

export interface VehicleFilters {
  type?: VehicleType;
  seats?: number;
  transmission?: TransmissionType;
  from?: string;
  to?: string;
  q?: string;
}
