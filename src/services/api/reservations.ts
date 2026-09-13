import type {
  CreateGuestReservationPayload,
  GuestReservation,
} from "@/types/reservation";
import { apiClient } from "./client";
import { withMockFallback } from "./fallback";
import { mapReservation } from "./mappers";
import { mockReservationsApi } from "./mock";
import { PublicApiPaths } from "./paths";

export const reservationsApi = {
  create(
    companySlug: string,
    payload: CreateGuestReservationPayload,
  ): Promise<GuestReservation> {
    return withMockFallback(
      () =>
        apiClient
          .post(PublicApiPaths.reservations(companySlug), payload)
          .then(mapReservation),
      () => mockReservationsApi.create(companySlug, payload),
      "reservations.create",
    );
  },

  getByToken(token: string): Promise<GuestReservation> {
    return withMockFallback(
      () =>
        apiClient
          .get(PublicApiPaths.reservationByToken(token))
          .then(mapReservation),
      () => mockReservationsApi.getByToken(token),
      "reservations.lookup",
    );
  },
};
