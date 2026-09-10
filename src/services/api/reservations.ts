import type { GuestReservation, CreateGuestReservationPayload } from "@/types/reservation";
import { apiClient } from "./client";

export const reservationsApi = {
  create(
    companySlug: string,
    payload: CreateGuestReservationPayload,
  ): Promise<GuestReservation> {
    return apiClient.post<GuestReservation>(
      `/v1/public/companies/${companySlug}/reservations`,
      payload,
    );
  },

  getByToken(token: string): Promise<GuestReservation> {
    return apiClient.get<GuestReservation>(`/v1/public/reservations/${token}`);
  },
};
