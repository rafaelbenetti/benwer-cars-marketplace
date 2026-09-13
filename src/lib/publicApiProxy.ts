export const SAME_ORIGIN_API_PREFIX = "/api";

export function normalizeApiBaseUrl(raw: string): string {
  return raw.trim().replace(/\/+$/, "").replace(/\/v1$/i, "");
}

export function isSameOriginApiBase(base: string, pageOrigin: string): boolean {
  if (!base) {
    return false;
  }

  if (base.startsWith("/")) {
    return true;
  }

  try {
    return new URL(base, pageOrigin).origin === new URL(pageOrigin).origin;
  } catch {
    return false;
  }
}

export function resolveBrowserApiBaseUrl(
  configured: string,
  publicEnv: "local" | "staging" | "production",
  pageOrigin: string,
): string {
  const base = normalizeApiBaseUrl(configured);
  if (base && isSameOriginApiBase(base, pageOrigin)) {
    return base;
  }

  if (base || publicEnv !== "local") {
    return SAME_ORIGIN_API_PREFIX;
  }

  return "";
}

export function shouldUseMockFallback(
  publicEnv: "local" | "staging" | "production",
): boolean {
  return publicEnv === "local";
}

export function isAllowedPublicApiProxyPath(method: string, path: string): boolean {
  const normalized = path.replace(/^\/+/, "");
  const verb = method.toUpperCase();

  if (verb === "GET" && /^v1\/public(?:\/|$)/.test(normalized)) {
    return true;
  }

  if (verb === "POST" && normalized === "v1/contact") {
    return true;
  }

  if (verb === "POST" && /^v1\/public\/[^/]+\/reservations$/.test(normalized)) {
    return true;
  }

  return false;
}

export function isUnreachableError(error: unknown): boolean {
  if (error instanceof TypeError) {
    const message = error.message.toLowerCase();
    return (
      message.includes("fetch") ||
      message.includes("network") ||
      message.includes("failed to")
    );
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
