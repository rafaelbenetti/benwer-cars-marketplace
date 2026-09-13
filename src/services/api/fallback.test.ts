import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/lib/errors";

vi.mock("./client", () => ({
  isLiveApiConfigured: vi.fn(() => true),
}));

import { isLiveApiConfigured } from "./client";
import { withMockFallback } from "./fallback";

describe("withMockFallback", () => {
  beforeEach(() => {
    vi.mocked(isLiveApiConfigured).mockReturnValue(true);
  });

  it("surfaces HTTP errors from a reachable API instead of serving mock cars", async () => {
    const mock = vi.fn(async () => [{ id: "mock" }]);

    await expect(
      withMockFallback(
        async () => {
          throw new ApiError(403, "unknown");
        },
        mock,
        "vehicles.list",
      ),
    ).rejects.toBeInstanceOf(ApiError);

    expect(mock).not.toHaveBeenCalled();
  });

  it("does not treat a /v1/v1 404 as an excuse to show mock stock photos", async () => {
    const mock = vi.fn(async () => [{ id: "v-med-1" }]);

    await expect(
      withMockFallback(
        async () => {
          throw new ApiError(404, "unknown");
        },
        mock,
        "vehicles.detail",
      ),
    ).rejects.toBeInstanceOf(ApiError);

    expect(mock).not.toHaveBeenCalled();
  });

  it("does not treat mapper TypeErrors as an excuse to show mock stock photos", async () => {
    const mock = vi.fn(async () => [{ id: "mock" }]);

    await expect(
      withMockFallback(
        async () => {
          throw new TypeError("Cannot read properties of undefined");
        },
        mock,
        "vehicles.list",
      ),
    ).rejects.toBeInstanceOf(TypeError);

    expect(mock).not.toHaveBeenCalled();
  });
});
