import createClient, { type Middleware } from "openapi-fetch";
import { env } from "@/env";
import {
  collapseDuplicateV1Path,
  normalizeApiBaseUrl,
  resolveBrowserApiBaseUrl,
} from "@/lib/publicApiProxy";
import { ApiError, type FieldError } from "@/lib/errors";
import { logError } from "@/lib/logger";
import type { paths } from "./schema";

const LIVE_TIMEOUT_MS = 25000;

interface ProblemBody {
  code?: string;
  detail?: string;
  errors?: { field?: string; code?: string }[];
}

const FIELD_ALIASES: Record<string, string> = {
  vehicleID: "vehicleId",
  vehicle_id: "vehicleId",
};

const CODE_ALIASES: Record<string, string> = {
  after_start: "reservation.invalid_dates",
  invalid_dates: "reservation.invalid_dates",
};

export function liveApiBaseUrl(): string {
  if (typeof window === "undefined") {
    return normalizeApiBaseUrl(env.API_ORIGIN ?? env.NEXT_PUBLIC_API_URL ?? "");
  }

  return resolveBrowserApiBaseUrl(
    env.NEXT_PUBLIC_API_URL ?? "",
    env.NEXT_PUBLIC_ENV,
  );
}

export function isLiveApiConfigured(): boolean {
  return Boolean(liveApiBaseUrl());
}

function normalizeFieldError(error: { field?: string; code?: string }): FieldError {
  const field = error.field ? (FIELD_ALIASES[error.field] ?? error.field) : "";
  const code = error.code ? (CODE_ALIASES[error.code] ?? error.code) : "unknown";
  return { field, code };
}

function problemCode(status: number, body: ProblemBody): string {
  if (body.code) {
    return body.code;
  }

  if (status === 409) {
    return "reservation.overlap";
  }

  return "unknown";
}

export function throwApiError(status: number, body: ProblemBody): never {
  throw new ApiError(
    status,
    problemCode(status, body),
    (body.errors ?? []).map(normalizeFieldError),
    body.detail,
  );
}

const problemMiddleware: Middleware = {
  onRequest({ request }) {
    const headers = new Headers(request.headers);
    if (!headers.has("Accept")) {
      headers.set("Accept", "application/json");
    }

    const url = collapseDuplicateV1Path(request.url);
    if (url !== request.url) {
      logError(new Error("collapsed duplicate /v1 in public API URL"), {
        context: "api_base_url",
        from: request.url,
        to: url,
      });
    }
    const source = url === request.url ? request : new Request(url, request);

    return new Request(source, {
      headers,
      cache: "no-store",
      signal: request.signal ?? AbortSignal.timeout(LIVE_TIMEOUT_MS),
    });
  },
  async onResponse({ response }) {
    if (response.ok) {
      return response;
    }

    const body = (await response.clone().json().catch(() => ({}))) as ProblemBody;
    throwApiError(response.status, body);
  },
};

let cached:
  | { baseUrl: string; client: ReturnType<typeof createClient<paths>> }
  | null = null;

export function getOpenApiClient() {
  const baseUrl = liveApiBaseUrl();
  if (cached && cached.baseUrl === baseUrl) {
    return cached.client;
  }

  const client = createClient<paths>({ baseUrl });
  client.use(problemMiddleware);
  cached = { baseUrl, client };
  return client;
}

function mockUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (typeof window !== "undefined") {
    return path;
  }

  return new URL(path, env.NEXT_PUBLIC_APP_URL).toString();
}

export const mockClient = {
  get<T>(path: string): Promise<T> {
    return fetch(mockUrl(path), { cache: "no-store" }).then((response) => {
      if (!response.ok) {
        throw new ApiError(response.status, "unknown");
      }

      return response.json() as Promise<T>;
    });
  },
};
