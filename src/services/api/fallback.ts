import { logError } from "@/lib/logger";
import { isLiveApiConfigured } from "./client";

function isUnreachableError(error: unknown): boolean {
  if (error instanceof TypeError) {
    return true;
  }

  if (error instanceof DOMException && error.name === "AbortError") {
    return true;
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes("fetch failed") ||
      message.includes("network") ||
      message.includes("econnrefused") ||
      message.includes("enotfound") ||
      message.includes("etimedout") ||
      message.includes("aborted")
    );
  }

  return false;
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
    if (!isUnreachableError(error)) {
      throw error;
    }

    logError(error, { context, fallback: "mock" });
    return mock();
  }
}
