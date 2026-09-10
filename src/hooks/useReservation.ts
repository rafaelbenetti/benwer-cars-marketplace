"use client";

import { useQuery } from "@tanstack/react-query";
import { reservationsApi } from "@/services/api";
import { QueryKeys } from "@/enums";

export function useReservation(token: string) {
  return useQuery({
    queryKey: [QueryKeys.RESERVATION, token],
    queryFn: () => reservationsApi.getByToken(token),
    enabled: Boolean(token),
  });
}
