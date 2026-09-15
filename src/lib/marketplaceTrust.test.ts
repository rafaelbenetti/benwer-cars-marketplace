import { describe, expect, it } from "vitest";
import { deriveMarketplaceTrustStats } from "./marketplaceTrust";
import type { Company } from "@/types/company";
import type { Vehicle } from "@/types/vehicle";
import { FuelType, TransmissionType, VehicleStatus, VehicleType } from "@/enums";

function company(partial: Partial<Company> & Pick<Company, "slug">): Company {
  return {
    id: partial.id ?? partial.slug,
    slug: partial.slug,
    name: partial.name ?? partial.slug,
    description: partial.description ?? null,
    location: partial.location ?? null,
    locationSlug: partial.locationSlug ?? null,
    latitude: partial.latitude ?? null,
    longitude: partial.longitude ?? null,
    vehicleCount: partial.vehicleCount ?? null,
    isPublic: partial.isPublic ?? true,
    websiteUrl: partial.websiteUrl ?? null,
    email: partial.email ?? null,
    phone: partial.phone ?? null,
    branding: partial.branding ?? { primaryColor: "", logoUrl: null },
  };
}

function vehicle(id: string): Vehicle {
  return {
    id,
    companySlug: "med-rentacar",
    brand: "Peugeot",
    model: "208",
    year: 2021,
    type: VehicleType.CAR,
    transmission: TransmissionType.MANUAL,
    fuel: FuelType.PETROL,
    seats: 5,
    pricePerDay: 33,
    currency: "EUR",
    status: VehicleStatus.AVAILABLE,
    isPublic: true,
    photos: [],
    description: null,
    color: null,
    deposit: null,
    category: null,
    mileage: null,
  };
}

describe("deriveMarketplaceTrustStats", () => {
  it("counts live companies, cars, and distinct pick-up areas", () => {
    const stats = deriveMarketplaceTrustStats(
      [
        company({ slug: "med-rentacar", locationSlug: "malaga", vehicleCount: 6 }),
        company({ slug: "benetti-cars", location: "Marbella", vehicleCount: 4 }),
      ],
      [vehicle("a"), vehicle("b"), vehicle("c")],
    );

    expect(stats).toEqual({
      companyCount: 2,
      carCount: 3,
      locationCount: 2,
    });
  });

  it("falls back to company vehicleCount when the car list is empty", () => {
    const stats = deriveMarketplaceTrustStats(
      [company({ slug: "med-rentacar", vehicleCount: 6 })],
      [],
    );

    expect(stats.carCount).toBe(6);
    expect(stats.locationCount).toBe(0);
  });

  it("returns zeros when both lists are empty", () => {
    expect(deriveMarketplaceTrustStats([], [])).toEqual({
      companyCount: 0,
      carCount: 0,
      locationCount: 0,
    });
  });
});
