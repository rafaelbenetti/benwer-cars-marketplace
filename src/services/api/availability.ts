import type { AvailabilityQuery, AvailabilityRange } from "@/types/availability";
import { apiClient } from "./client";
import { withMockFallback } from "./fallback";
import { mapAvailabilityList } from "./mappers";
import { mockAvailabilityApi } from "./mock";
import { PublicApiPaths } from "./paths";
import { toSearchParams } from "./query";

export const availabilityApi = {
  check(companySlug: string, params: AvailabilityQuery): Promise<AvailabilityRange[]> {
    return withMockFallback(
      () =>
        apiClient
          .get(
            `${PublicApiPaths.availability(companySlug)}${toSearchParams({
              from: params.from,
              to: params.to,
              vehicleId: params.vehicleId,
            })}`,
          )
          .then(mapAvailabilityList),
      () => mockAvailabilityApi.check(companySlug, params),
      "availability.check",
    );
  },
};
