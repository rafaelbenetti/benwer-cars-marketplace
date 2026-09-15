import { describe, expect, it } from "vitest";
import { VehicleType } from "@/enums";
import { toPublicVehicleListQuery, toPublicVehicleTypeQuery } from "./vehicleFilters";

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

describe("toPublicVehicleListQuery", () => {
  it("omits type and category when the UI filter is car", () => {
    expect(toPublicVehicleListQuery({ type: VehicleType.CAR })).toMatchObject({
      type: undefined,
      category: undefined,
    });
  });

  it("mirrors a valid type onto category", () => {
    expect(toPublicVehicleListQuery({ type: VehicleType.SUV, seats: 5 })).toMatchObject({
      type: "suv",
      category: "suv",
      seats: 5,
    });
  });
});
