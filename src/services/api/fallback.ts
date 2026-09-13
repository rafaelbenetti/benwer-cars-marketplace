import { env } from "@/env";
import { logError } from "@/lib/logger";
import { isUnreachableError, shouldUseMockFallback } from "@/lib/publicApiProxy";
import { isLiveApiConfigured } from "./client";

export async function withMockFallback<T>(
  live: () => Promise<T>,
  mock: () => Promise<T>,
  context: string,
): Promise<T> {
  const allowMock = shouldUseMockFallback(env.NEXT_PUBLIC_ENV);

  if (!isLiveApiConfigured()) {
    if (!allowMock) {
      throw new Error(`Live API is not configured (${context})`);
    }

    return mock();
  }

  try {
    return await live();
  } catch (error) {
    if (!isUnreachableError(error) || !allowMock) {
      throw error;
    }

    logError(error, { context, fallback: "mock" });
    return mock();
  }
}
