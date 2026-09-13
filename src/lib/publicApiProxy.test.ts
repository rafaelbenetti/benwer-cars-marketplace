import { describe, expect, it } from "vitest";
import {
  SAME_ORIGIN_API_PREFIX,
  isAllowedPublicApiProxyPath,
  isSameOriginApiBase,
  isUnreachableError,
  normalizeApiBaseUrl,
  resolveBrowserApiBaseUrl,
  shouldUseMockFallback,
} from "./publicApiProxy";

describe("normalizeApiBaseUrl", () => {
  it("strips a trailing /v1 so OpenAPI paths are not doubled", () => {
    expect(normalizeApiBaseUrl("https://cars-api.benwer.es/v1")).toBe(
      "https://cars-api.benwer.es",
    );
    expect(normalizeApiBaseUrl("https://cars-api.benwer.es/v1/")).toBe(
      "https://cars-api.benwer.es",
    );
  });

  it("keeps a same-origin /api prefix", () => {
    expect(normalizeApiBaseUrl("http://localhost:3002/api")).toBe(
      "http://localhost:3002/api",
    );
    expect(normalizeApiBaseUrl("/api/")).toBe("/api");
  });
});

describe("resolveBrowserApiBaseUrl", () => {
  it("keeps a same-origin marketplace /api URL", () => {
    expect(
      resolveBrowserApiBaseUrl(
        "https://marketplace.benwer.es/api",
        "production",
        "https://marketplace.benwer.es",
      ),
    ).toBe("https://marketplace.benwer.es/api");
  });

  it("rewrites a cross-origin cars-api URL to the same-origin BFF", () => {
    expect(
      resolveBrowserApiBaseUrl(
        "https://cars-api.benwer.es/v1",
        "production",
        "https://marketplace.benwer.es",
      ),
    ).toBe(SAME_ORIGIN_API_PREFIX);
  });

  it("uses the BFF in production even when the public API URL is unset", () => {
    expect(
      resolveBrowserApiBaseUrl("", "production", "https://marketplace.benwer.es"),
    ).toBe(SAME_ORIGIN_API_PREFIX);
  });

  it("stays on mock in local when no API URL is configured", () => {
    expect(resolveBrowserApiBaseUrl("", "local", "http://localhost:3002")).toBe("");
  });

  it("treats a relative /api base as same-origin", () => {
    expect(isSameOriginApiBase("/api", "https://marketplace.benwer.es")).toBe(true);
  });
});

describe("shouldUseMockFallback", () => {
  it("allows mock JSON only in local development", () => {
    expect(shouldUseMockFallback("local")).toBe(true);
    expect(shouldUseMockFallback("staging")).toBe(false);
    expect(shouldUseMockFallback("production")).toBe(false);
  });
});

describe("isAllowedPublicApiProxyPath", () => {
  it("allows public catalogue and guest booking paths", () => {
    expect(isAllowedPublicApiProxyPath("GET", "v1/public/companies")).toBe(true);
    expect(
      isAllowedPublicApiProxyPath("GET", "/v1/public/companies/med-rentacar/vehicles"),
    ).toBe(true);
    expect(
      isAllowedPublicApiProxyPath("POST", "v1/public/med-rentacar/reservations"),
    ).toBe(true);
    expect(isAllowedPublicApiProxyPath("POST", "v1/contact")).toBe(true);
  });

  it("rejects authenticated or unknown API paths", () => {
    expect(isAllowedPublicApiProxyPath("GET", "v1/companies")).toBe(false);
    expect(isAllowedPublicApiProxyPath("DELETE", "v1/public/companies")).toBe(false);
    expect(isAllowedPublicApiProxyPath("POST", "v1/public/companies")).toBe(false);
  });
});

describe("isUnreachableError", () => {
  it("treats browser CORS and Node fetch failures as unreachable", () => {
    expect(isUnreachableError(new TypeError("Failed to fetch"))).toBe(true);
    expect(isUnreachableError(new TypeError("fetch failed"))).toBe(true);
  });

  it("does not treat mapper TypeErrors as an unreachable API", () => {
    expect(
      isUnreachableError(new TypeError("Cannot read properties of undefined")),
    ).toBe(false);
  });
});
