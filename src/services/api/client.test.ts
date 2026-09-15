import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/lib/errors";
import { MOCK_CATALOGUE_OPT_IN_ENV } from "@/lib/publicApiProxy";

const envState = vi.hoisted(() => ({
  NEXT_PUBLIC_ENV: "local" as "local" | "staging" | "production",
  NEXT_PUBLIC_APP_URL: "http://localhost:3002",
  API_ORIGIN: undefined as string | undefined,
  NEXT_PUBLIC_API_URL: undefined as string | undefined,
}));

vi.mock("@/env", () => ({
  env: envState,
}));

import { mockClient, getOpenApiClient } from "./client";

describe("mockClient", () => {
  beforeEach(() => {
    delete process.env[MOCK_CATALOGUE_OPT_IN_ENV];
    envState.NEXT_PUBLIC_ENV = "local";
  });

  afterEach(() => {
    delete process.env[MOCK_CATALOGUE_OPT_IN_ENV];
  });

  it("refuses to read mock catalogue JSON without an explicit test opt-in", async () => {
    await expect(mockClient.get("/mock-data/vehicles.json")).rejects.toThrow(
      "Mock catalogue is disabled",
    );
  });
});

describe("getOpenApiClient", () => {
  it("throws a network error instead of reading mock JSON when the live API is unset", () => {
    expect(() => getOpenApiClient()).toThrow(ApiError);
    try {
      getOpenApiClient();
    } catch (error) {
      expect(error).toMatchObject({
        status: 0,
        code: "network",
        detail: "Live API is not configured",
      });
    }
  });
});
