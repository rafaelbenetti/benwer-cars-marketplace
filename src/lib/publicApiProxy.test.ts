import createClient from "openapi-fetch";
import { describe, expect, it } from "vitest";
import {
  SAME_ORIGIN_API_PREFIX,
  collapseDuplicateV1Path,
  isAllowedPublicApiProxyPath,
  isSameOriginApiBase,
  isUnreachableError,
  joinApiUrl,
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
    expect(normalizeApiBaseUrl("https://cars-api.benwer.es/v1/v1")).toBe(
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

describe("joinApiUrl", () => {
  it("joins like openapi-fetch without producing /v1/v1", () => {
    expect(
      joinApiUrl(
        "https://cars-api.benwer.es/v1",
        "/v1/public/companies/med-rentacar",
      ),
    ).toBe("https://cars-api.benwer.es/v1/public/companies/med-rentacar");
    expect(
      joinApiUrl(
        "https://cars-api.benwer.es/v1",
        "/v1/public/companies/med-rentacar/vehicles",
      ),
    ).toBe("https://cars-api.benwer.es/v1/public/companies/med-rentacar/vehicles");
    expect(joinApiUrl("https://cars-api.benwer.es", "/v1/public/companies")).toBe(
      "https://cars-api.benwer.es/v1/public/companies",
    );
  });

  it("collapses a concatenated /v1/v1 path", () => {
    expect(
      collapseDuplicateV1Path(
        "https://cars-api.benwer.es/v1/v1/public/companies/med-rentacar",
      ),
    ).toBe("https://cars-api.benwer.es/v1/public/companies/med-rentacar");
  });

  it("openapi-fetch hits /v1/public once after the /v1 suffix is stripped", async () => {
    const seen: string[] = [];
    const client = createClient({
      baseUrl: normalizeApiBaseUrl("https://cars-api.benwer.es/v1"),
      fetch: async (input) => {
        seen.push(String(input instanceof Request ? input.url : input));
        return new Response("{}", {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    });

    await client.GET("/v1/public/companies/{slug}" as never, {
      params: { path: { slug: "med-rentacar" } },
    } as never);

    expect(seen[0]).toBe(
      "https://cars-api.benwer.es/v1/public/companies/med-rentacar",
    );
  });
});

describe("resolveBrowserApiBaseUrl", () => {
  it("keeps a same-origin marketplace /api URL", () => {
    expect(
      resolveBrowserApiBaseUrl(
        "https://marketplace.benwer.es/api",
        "production",
      ),
    ).toBe("https://marketplace.benwer.es/api");
  });

  it("uses the API origin when the env still has a /v1 suffix", () => {
    expect(
      resolveBrowserApiBaseUrl(
        "https://cars-api.benwer.es/v1",
        "production",
      ),
    ).toBe("https://cars-api.benwer.es");
  });

  it("uses the BFF in production even when the public API URL is unset", () => {
    expect(
      resolveBrowserApiBaseUrl("", "production"),
    ).toBe(SAME_ORIGIN_API_PREFIX);
  });

  it("stays on mock in local when no API URL is configured", () => {
    expect(resolveBrowserApiBaseUrl("", "local")).toBe("");
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
