import { dehydrate, QueryClient } from "@tanstack/react-query";
import { availabilityApi } from "@/services/api";
import {
  availabilityCalendarWindow,
  availabilityQueryKey,
} from "@/lib/availability";

export async function prefetchAvailabilityState(
  companySlug: string,
  vehicleId: string,
) {
  const queryClient = new QueryClient();
  const window = availabilityCalendarWindow();
  const params = { ...window, vehicleId };

  try {
    await queryClient.prefetchQuery({
      queryKey: availabilityQueryKey(companySlug, params),
      queryFn: () => availabilityApi.check(companySlug, params),
    });
  } catch {
    /* calendar fetches on the client */
  }

  return dehydrate(queryClient);
}
