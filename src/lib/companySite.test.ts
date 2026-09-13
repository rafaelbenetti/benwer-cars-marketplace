import { describe, expect, it } from "vitest";
import { buildCompanySiteHref, buildCompanySiteOrigin } from "./companySite";

describe("buildCompanySiteOrigin", () => {
  it("builds https://{slug}.{marketplaceDomain} for public domains", () => {
    expect(buildCompanySiteOrigin("med-rentacar")).toBe(
      "https://med-rentacar.benwer.es",
    );
  });
});

describe("buildCompanySiteHref", () => {
  it("prefers an absolute website URL and appends dates", () => {
    expect(
      buildCompanySiteHref({
        slug: "med-rentacar",
        websiteUrl: "https://med.example/fleet",
        from: "2026-09-20",
        to: "2026-09-24",
      }),
    ).toBe("https://med.example/fleet?from=2026-09-20&to=2026-09-24");
  });

  it("falls back to the company subdomain and tenant car path", () => {
    expect(
      buildCompanySiteHref({
        slug: "denver-cars",
        path: "/cars/v1",
        from: "2026-09-20",
        to: "2026-09-24",
      }),
    ).toBe("https://denver-cars.benwer.es/cars/v1?from=2026-09-20&to=2026-09-24");
  });
});
