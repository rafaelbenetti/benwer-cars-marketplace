import { describe, expect, it } from "vitest";
import { mapCompany } from "@/services/api/mappers";
import { toCompanyMapPins } from "./companyMap";

describe("toCompanyMapPins", () => {
  it("prefers API latitude and longitude over city centroids", () => {
    const company = mapCompany({
      id: "c1",
      slug: "med-rentacar",
      name: "Med",
      location: "Málaga",
      locationSlug: "malaga",
      latitude: 36.5,
      longitude: -4.5,
      branding: { primaryColor: "#7c3aed", logoUrl: null },
    });

    const pins = toCompanyMapPins([company], () => "/companies/med-rentacar");
    expect(pins).toHaveLength(1);
    expect(pins[0]?.lat).toBe(36.5);
    expect(pins[0]?.lng).toBe(-4.5);
  });
});
