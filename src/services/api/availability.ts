import type { AvailabilityQuery, AvailabilityRange } from "@/types/availability";
import { getOpenApiClient } from "./client";
import { withMockFallback } from "./fallback";
import { mapAvailability, mapAvailabilityList } from "./mappers";
import { mockAvailabilityApi } from "./mock";
import { vehiclesApi } from "./vehicles";

async function fetchLiveAvailability(
  companySlug: string,
  params: AvailabilityQuery,
): Promise<AvailabilityRange[]> {
  if (params.vehicleId) {
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

  const vehicles = await vehiclesApi.getByCompany(companySlug);
  const rows = await Promise.all(
    vehicles.map(async (vehicle) => {
      const { data } = await getOpenApiClient().GET(
        "/v1/public/companies/{slug}/availability",
        {
          params: {
            path: { slug: companySlug },
            query: {
              from: params.from,
              to: params.to,
              vehicleId: vehicle.id,
            },
          },
        },
      );

      return mapAvailability(data, params);
    }),
  );

  return rows.filter((row) => row.vehicleId);
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
