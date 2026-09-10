import type { ReservationStatus } from "@/enums";

export interface CreateGuestReservationPayload {
  vehicleId: string;
  startDate: string;
  endDate: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
}

export interface GuestReservation {
  id: string;
  token: string;
  status: ReservationStatus;
  vehicleId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  currency: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  companySlug: string;
  createdAt: string;
}
