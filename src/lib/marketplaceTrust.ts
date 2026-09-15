import type { Company } from "@/types/company";
import type { Vehicle } from "@/types/vehicle";

export interface MarketplaceTrustStats {
  companyCount: number;
  carCount: number;
  locationCount: number;
}

export function deriveMarketplaceTrustStats(
  companies: Company[] | undefined,
  vehicles: Vehicle[] | undefined,
): MarketplaceTrustStats {
  const companyList = companies ?? [];
  const vehicleList = vehicles ?? [];
  const locations = new Set<string>();

  for (const company of companyList) {
    const key = company.locationSlug ?? company.location;
    if (key) {
      locations.add(key);
    }
  }

  const listedFleet = companyList.reduce(
    (sum, company) => sum + (company.vehicleCount ?? 0),
    0,
  );

  return {
    companyCount: companyList.length,
    carCount: vehicleList.length || listedFleet,
    locationCount: locations.size,
  };
}
