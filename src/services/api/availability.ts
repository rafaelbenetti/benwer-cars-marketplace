import type { AvailabilityRange } from "@/types/availability";
import { env } from "@/env";

export const availabilityApi = {
  check(
    _companySlug: string,
    _params: { from: string; to: string; vehicleId?: string },
  ): Promise<AvailabilityRange[]> {
    return fetch(`${env.NEXT_PUBLIC_APP_URL}/mock-data/availability.json`).then(
      (r) => r.json() as Promise<AvailabilityRange[]>,
    );
  },
};
