export interface AvailabilityRange {
  vehicleId: string;
  unavailableDates: string[];
}

export interface AvailabilityQuery {
  from: string;
  to: string;
  vehicleId?: string;
}
