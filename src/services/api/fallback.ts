import { ApiError } from "@/lib/errors";
import { logError } from "@/lib/logger";
import { isLiveApiConfigured } from "./client";

function isDomainApiError(error: unknown): boolean {
  return (
    error instanceof ApiError &&
    error.status >= 400 &&
    error.status < 500 &&
    error.code !== "unknown"
  );
}

export async function withMockFallback<T>(
  live: () => Promise<T>,
  mock: () => Promise<T>,
  context: string,
): Promise<T> {
  if (!isLiveApiConfigured()) {
    return mock();
  }

  try {
    return await live();
  } catch (error) {
    if (isDomainApiError(error)) {
      throw error;
    }

    logError(error, { context, fallback: "mock" });
    return mock();
  }
}
