import { env } from "@/env";
import { ApiError } from "@/lib/errors";

function baseUrl(): string {
  if (typeof window === "undefined") {
    return env.API_ORIGIN;
  }
  return env.NEXT_PUBLIC_API_URL;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl()}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      (body as { code?: string }).code ?? "unknown",
      (body as { errors?: { field: string; code: string }[] }).errors ?? [],
      (body as { detail?: string }).detail,
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
