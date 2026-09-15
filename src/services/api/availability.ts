import type { AvailabilityQuery, AvailabilityRange } from "@/types/availability";
import { getOpenApiClient } from "./client";
import { mapAvailabilityList } from "./mappers";

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
    return fetchLiveAvailability(companySlug, params);
  },
};
