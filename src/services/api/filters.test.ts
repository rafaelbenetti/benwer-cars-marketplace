import { describe, expect, it } from "vitest";
import { mapCompany } from "./mappers";
import { applyCompanyListFilters } from "./filters";

function company(overrides: Record<string, unknown>) {
  return mapCompany({
    slug: "demo",
    name: "Demo",
    isPublic: true,
    branding: { primaryColor: "#0e7490", logoUrl: null },
    ...overrides,
  });
}

describe("applyCompanyListFilters", () => {
  const companies = [
    company({ slug: "med-rentacar", locationSlug: "malaga", location: "Málaga" }),
    company({ slug: "costa-wheels", locationSlug: "torremolinos", location: "Torremolinos" }),
  ];

  it("does not city-filter province-wide malaga", () => {
    const filtered = applyCompanyListFilters(companies, { location: "malaga" });
    expect(filtered.map((row) => row.slug)).toEqual([
      "med-rentacar",
      "costa-wheels",
    ]);
  });

  it("keeps a specific city filter", () => {
    const filtered = applyCompanyListFilters(companies, { location: "torremolinos" });
    expect(filtered.map((row) => row.slug)).toEqual(["costa-wheels"]);
  });
});
