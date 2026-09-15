import { ApiError } from "@/lib/errors";
import { toPublicVehicleListQuery } from "@/lib/vehicleFilters";
import type {
  MarketplaceSearchFilters,
  MarketplaceVehicle,
  Vehicle,
  VehicleFilters,
} from "@/types/vehicle";
import { getOpenApiClient } from "./client";
import { companiesApi } from "./companies";
import { applyVehicleListFilters } from "./filters";
import { mapVehicle, mapVehicleList } from "./mappers";

function decodeVehicleId(id: string): string {
  try {
    return decodeURIComponent(id);
  } catch {
    return id;
  }
}

async function fetchLiveVehicles(
  companySlug: string,
  filters?: VehicleFilters,
): Promise<Vehicle[]> {
  const { data } = await getOpenApiClient().GET(
    "/v1/public/companies/{slug}/vehicles",
    {
      params: {
        path: { slug: companySlug },
        query: toPublicVehicleListQuery(filters),
      },
    },
  );

  return applyVehicleListFilters(
    mapVehicleList(data, { companySlug }),
    filters,
  );
}

async function fetchLiveVehicle(
  companySlug: string,
  vehicleId: string,
): Promise<Vehicle> {
  try {
    const { data } = await getOpenApiClient().GET(
      "/v1/public/companies/{slug}/vehicles/{id}",
      {
        params: { path: { slug: companySlug, id: vehicleId } },
      },
    );
    const vehicle = mapVehicle(data, { companySlug });
    if (!vehicle.id) {
      throw new ApiError(404, "vehicle.not_found");
    }
    return vehicle;
  } catch (error) {
    if (
      !(error instanceof ApiError) ||
      (error.status !== 404 && error.code !== "vehicle.not_found")
    ) {
      throw error;
    }

    try {
      const listed = await fetchLiveVehicles(companySlug);
      const found = listed.find((vehicle) => vehicle.id === vehicleId);
      if (found) {
        return found;
      }
    } catch {
      throw error;
    }

    throw error;
  }
}

export const vehiclesApi = {
  getByCompany(companySlug: string, filters?: VehicleFilters): Promise<Vehicle[]> {
    return fetchLiveVehicles(companySlug, filters);
  },

  getById(companySlug: string, id: string): Promise<Vehicle> {
    return fetchLiveVehicle(companySlug, decodeVehicleId(id));
  },

  searchMarketplace(
    filters?: MarketplaceSearchFilters,
  ): Promise<MarketplaceVehicle[]> {
    return searchLiveMarketplace(filters);
  },
};

async function searchLiveMarketplace(
  filters?: MarketplaceSearchFilters,
): Promise<MarketplaceVehicle[]> {
  const location = filters?.location;
  const selectedSlugs = filters?.companySlugs?.length
    ? filters.companySlugs
    : filters?.companySlug
      ? [filters.companySlug]
      : [];
  const companies = selectedSlugs.length
    ? (
        await Promise.all(
          selectedSlugs.map((slug) =>
            companiesApi.getBySlug(slug).catch(() => null),
          ),
        )
      ).flatMap((company) => (company ? [company] : []))
    : await companiesApi.getAll({
        location,
        from: filters?.from,
        to: filters?.to,
        q: filters?.q,
      });

  const fleets = await Promise.all(
    companies.map(async (company) => {
      const vehicles = await vehiclesApi.getByCompany(company.slug, {
        type: filters?.type,
        seats: filters?.seats,
        transmission: filters?.transmission,
        from: filters?.from,
        to: filters?.to,
        q: filters?.q,
        sort: filters?.sort,
      });
      return vehicles.map((vehicle) => ({ ...vehicle, company }));
    }),
  );

  return fleets.flat();
}
