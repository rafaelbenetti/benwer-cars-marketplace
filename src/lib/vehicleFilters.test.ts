import { describe, expect, it } from "vitest";
import { VehicleType } from "@/enums";
import { toPublicVehicleTypeQuery } from "./vehicleFilters";

describe("toPublicVehicleTypeQuery", () => {
  it("never sends type=car to the public API", () => {
    expect(toPublicVehicleTypeQuery(VehicleType.CAR)).toBeUndefined();
    expect(toPublicVehicleTypeQuery("car")).toBeUndefined();
    expect(toPublicVehicleTypeQuery(undefined)).toBeUndefined();
  });

  it("sends only API categories economy|sedan|suv|minivan|van|other", () => {
    expect(toPublicVehicleTypeQuery(VehicleType.SUV)).toBe("suv");
    expect(toPublicVehicleTypeQuery(VehicleType.VAN)).toBe("van");
    expect(toPublicVehicleTypeQuery("minivan")).toBe("minivan");
    expect(toPublicVehicleTypeQuery("economy")).toBe("economy");
    expect(toPublicVehicleTypeQuery("sedan")).toBe("sedan");
    expect(toPublicVehicleTypeQuery("other")).toBe("other");
    expect(toPublicVehicleTypeQuery(VehicleType.TRUCK)).toBeUndefined();
    expect(toPublicVehicleTypeQuery(VehicleType.MOTORCYCLE)).toBeUndefined();
  });
});
