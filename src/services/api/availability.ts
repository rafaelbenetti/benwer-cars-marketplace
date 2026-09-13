import type { AvailabilityQuery, AvailabilityRange } from "@/types/availability";
import { getOpenApiClient } from "./client";
import { withMockFallback } from "./fallback";
import { mapAvailabilityList } from "./mappers";
import { mockAvailabilityApi } from "./mock";

async function fetchLiveAvailability(
  companySlug: string,
  params: AvailabilityQuery,
): Promise<AvailabilityRange[]> {
  const { data } = await getOpenApiClient().GET(
    "/v1/public/companies/{slug}/availability",
    {
      params: {
        path: { slug: companySlug },
        query: {
          from: params.from,
          to: params.to,
          vehicleId: params.vehicleId,
        },
      },
    },
  );

  return mapAvailabilityList(data, params);
}

export const availabilityApi = {
  check(companySlug: string, params: AvailabilityQuery): Promise<AvailabilityRange[]> {
    return withMockFallback(
      () => fetchLiveAvailability(companySlug, params),
      () => mockAvailabilityApi.check(companySlug, params),
      "availability.check",
    );
  },
};
