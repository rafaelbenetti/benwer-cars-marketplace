"use client";

import { useMutation } from "@tanstack/react-query";
import { reservationsApi } from "@/services/api";
import { logError } from "@/lib/logger";
import type { CreateGuestReservationPayload, GuestReservation } from "@/types/reservation";

interface UseCreateReservationOptions {
  companySlug: string;
  onSuccess: (reservation: GuestReservation) => void;
}

export function useCreateReservation({
  companySlug,
  onSuccess,
}: UseCreateReservationOptions) {
  return useMutation({
    mutationFn: (payload: CreateGuestReservationPayload) =>
      reservationsApi.create(companySlug, payload),
    onSuccess,
    onError: (error) => {
      logError(error, { context: "reservation_create", companySlug });
    },
  });
}
