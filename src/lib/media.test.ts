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

  it("keeps https CDN and S3 URLs, including protocol-relative hosts", () => {
    expect(toPublicMediaSrc("https://d111111abcdef8.cloudfront.net/cars/7.jpg")).toBe(
      "https://d111111abcdef8.cloudfront.net/cars/7.jpg",
    );
    expect(
      toPublicMediaSrc(
        "https://public-benwer-cars.s3.eu-west-1.amazonaws.com/seed/cars/7.jpg",
      ),
    ).toBe("https://public-benwer-cars.s3.eu-west-1.amazonaws.com/seed/cars/7.jpg");
    expect(toPublicMediaSrc("//cdn.example/car.jpg")).toBe("https://cdn.example/car.jpg");
  });

  it("prefixes bare object keys only when a media origin is configured", () => {
    expect(toPublicMediaSrc("vehicles/bare-key.jpg")).toBeUndefined();
    expect(
      toPublicMediaSrc(
        "vehicles/bare-key.jpg",
        "https://d111111abcdef8.cloudfront.net",
      ),
    ).toBe("https://d111111abcdef8.cloudfront.net/vehicles/bare-key.jpg");
    expect(
      toPublicMediaSrc(
        "s3://public-benwer-cars/seed/cars/7.jpg",
        "https://d111111abcdef8.cloudfront.net",
      ),
    ).toBe("https://d111111abcdef8.cloudfront.net/seed/cars/7.jpg");
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
    expect(
      shouldSkipImageOptimization(
        "https://public-benwer-cars.s3.eu-west-1.amazonaws.com/seed/cars/7.jpg",
      ),
    ).toBe(true);
  });
});
