import { env } from "@/env";
import { ApiError } from "@/lib/errors";
import { logError } from "@/lib/logger";
import { isUnreachableError, shouldUseMockFallback } from "@/lib/publicApiProxy";
import { isLiveApiConfigured } from "./client";

export async function withMockFallback<T>(
  live: () => Promise<T>,
  mock: () => Promise<T>,
  context: string,
): Promise<T> {
  const allowMock = shouldUseMockFallback(
    env.NEXT_PUBLIC_ENV,
    process.env.NODE_ENV,
  );

  if (!isLiveApiConfigured()) {
    if (!allowMock) {
      throw new ApiError(0, "network", [], `Live API is not configured (${context})`);
    }

    return mock();
  }

  try {
    return await live();
  } catch (error) {
    if (!allowMock || !isUnreachableError(error)) {
      throw error;
    }

    logError(error, { context, fallback: "mock" });
    return mock();
  }
}
