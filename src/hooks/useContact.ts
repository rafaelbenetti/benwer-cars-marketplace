"use client";

import { useMutation } from "@tanstack/react-query";
import { contactApi, type ContactPayload } from "@/services/api/contact";
import { logError } from "@/lib/logger";

export function useContact(onSuccess: () => void) {
  return useMutation({
    mutationFn: (payload: ContactPayload) => contactApi.send(payload),
    onSuccess,
    onError: (error) => {
      logError(error, { context: "contact_send", source: "marketplace" });
    },
  });
}
