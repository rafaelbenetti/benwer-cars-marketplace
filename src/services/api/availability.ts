import type { AvailabilityRange } from "@/types/availability";
import { mockClient } from "./client";

export const availabilityApi = {
  check(
    _companySlug: string,
    _params: { from: string; to: string; vehicleId?: string },
  ): Promise<AvailabilityRange[]> {
    return mockClient.get<AvailabilityRange[]>(
      "/mock-data/availability.json",
    );
  },
};
