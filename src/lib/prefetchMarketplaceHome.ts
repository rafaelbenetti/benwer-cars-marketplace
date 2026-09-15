import { dehydrate, QueryClient } from "@tanstack/react-query";
import { companiesApi, vehiclesApi } from "@/services/api";
import { logError } from "@/lib/logger";
import { companiesQueryKey, marketplaceVehiclesQueryKey } from "@/lib/queryKeys";

export async function prefetchMarketplaceHomeState() {
  const queryClient = new QueryClient();

  try {
    const companies = await companiesApi.getAll();
    queryClient.setQueryData(companiesQueryKey(undefined), companies);
  } catch (error) {
    logError(error, { context: "homepage_companies_prefetch" });
  }

  try {
    const vehicles = await vehiclesApi.searchMarketplace({});
    queryClient.setQueryData(marketplaceVehiclesQueryKey({}), vehicles);
  } catch (error) {
    logError(error, { context: "homepage_featured_cars_prefetch" });
  }

  return dehydrate(queryClient);
}
