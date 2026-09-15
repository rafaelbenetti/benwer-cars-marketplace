import { describe, expect, it } from "vitest";
import {
  companiesQueryKey,
  marketplaceVehiclesQueryKey,
  vehiclesQueryKey,
} from "./queryKeys";

describe("query keys", () => {
  it("omits undefined filter slots so keys survive RSC serialization", () => {
    expect(companiesQueryKey()).toEqual(["companies"]);
    expect(companiesQueryKey(undefined)).toEqual(["companies"]);
    expect(companiesQueryKey({ location: undefined })).toEqual(["companies"]);
    expect(JSON.stringify(companiesQueryKey())).toBe('["companies"]');

    expect(vehiclesQueryKey("denver-cars")).toEqual(["vehicles", "denver-cars"]);
    expect(vehiclesQueryKey("denver-cars", undefined)).toEqual([
      "vehicles",
      "denver-cars",
    ]);

    expect(marketplaceVehiclesQueryKey()).toEqual(["vehicles", "marketplace"]);
    expect(marketplaceVehiclesQueryKey({})).toEqual(["vehicles", "marketplace"]);
  });

  it("keeps defined filter values in the key", () => {
    expect(companiesQueryKey({ location: "marbella" })).toEqual([
      "companies",
      { location: "marbella" },
    ]);
    expect(marketplaceVehiclesQueryKey({ location: "malaga" })).toEqual([
      "vehicles",
      "marketplace",
      { location: "malaga" },
    ]);
  });
});
