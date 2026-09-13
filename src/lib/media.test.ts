import { describe, expect, it } from "vitest";
import {
  shouldSkipImageOptimization,
  toPublicMediaSrc,
} from "./media";

describe("toPublicMediaSrc", () => {
  it("rewrites live LocalStack SVG logo URLs to /localstack", () => {
    expect(
      toPublicMediaSrc(
        "http://localhost:4566/public-benwer-cars/seed/logos/med-rentacar.svg",
      ),
    ).toBe("/localstack/public-benwer-cars/seed/logos/med-rentacar.svg");
    expect(
      toPublicMediaSrc(
        "http://localhost:4566/public-benwer-cars/seed/logos/benetti-cars.svg",
      ),
    ).toBe("/localstack/public-benwer-cars/seed/logos/benetti-cars.svg");
  });

  it("rewrites 127.0.0.1 LocalStack hosts", () => {
    expect(
      toPublicMediaSrc(
        "http://127.0.0.1:4566/public-benwer-cars/seed/logos/denver.png",
      ),
    ).toBe("/localstack/public-benwer-cars/seed/logos/denver.png");
  });

  it("keeps same-origin public and /localstack paths", () => {
    expect(toPublicMediaSrc("/mock-data/logos/med-rentacar.svg")).toBe(
      "/mock-data/logos/med-rentacar.svg",
    );
    expect(
      toPublicMediaSrc("/localstack/public-benwer-cars/seed/logos/med-rentacar.svg"),
    ).toBe("/localstack/public-benwer-cars/seed/logos/med-rentacar.svg");
  });
});

describe("shouldSkipImageOptimization", () => {
  it("skips LocalStack paths and SVG logos", () => {
    expect(
      shouldSkipImageOptimization(
        "/localstack/public-benwer-cars/seed/logos/med-rentacar.svg",
      ),
    ).toBe(true);
    expect(shouldSkipImageOptimization("/mock-data/logos/denver-cars.svg")).toBe(
      true,
    );
    expect(shouldSkipImageOptimization("https://cdn.example/logo.png")).toBe(
      false,
    );
  });
});
