import type {
  CreateGuestReservationPayload,
  GuestReservation,
} from "@/types/reservation";
import { getOpenApiClient } from "./client";
import { withMockFallback } from "./fallback";
import { mapReservation } from "./mappers";
import { mockReservationsApi } from "./mock";

export const reservationsApi = {
  create(
    companySlug: string,
    payload: CreateGuestReservationPayload,
  ): Promise<GuestReservation> {
    return withMockFallback(
      () =>
        getOpenApiClient()
          .POST("/v1/public/companies/{slug}/reservations", {
            params: { path: { slug: companySlug } },
            body: payload,
          })
          .then(({ data }) => mapReservation(data, companySlug)),
      () => mockReservationsApi.create(companySlug, payload),
      "reservations.create",
    );
  },

  getByToken(token: string): Promise<GuestReservation> {
    return withMockFallback(
      () =>
        getOpenApiClient()
          .GET("/v1/public/reservations/{token}", {
            params: { path: { token } },
          })
          .then(({ data }) => mapReservation(data)),
      () => mockReservationsApi.getByToken(token),
      "reservations.lookup",
    );
  },
};
