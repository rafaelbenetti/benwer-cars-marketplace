import { env } from "@/env";
import { ApiError } from "@/lib/errors";

const LIVE_TIMEOUT_MS = 8000;

function liveApiBaseUrl(): string {
  if (typeof window === "undefined") {
    return env.API_ORIGIN ?? env.NEXT_PUBLIC_API_URL ?? "";
  }

  return env.NEXT_PUBLIC_API_URL ?? "";
}

export function isLiveApiConfigured(): boolean {
  return Boolean(liveApiBaseUrl());
}

interface ProblemBody {
  code?: string;
  detail?: string;
  errors?: { field: string; code: string }[];
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${liveApiBaseUrl()}${path}`, {
    cache: "no-store",
    signal: options?.signal ?? AbortSignal.timeout(LIVE_TIMEOUT_MS),
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ProblemBody;
    throw new ApiError(
      response.status,
      body.code ?? "unknown",
      body.errors ?? [],
      body.detail,
    );
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  get<T>(path: string, options?: RequestInit): Promise<T> {
    return request<T>(path, { method: "GET", ...options });
  },
  post<T>(path: string, body: unknown, options?: RequestInit): Promise<T> {
    return request<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
      ...options,
    });
  },
};

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
