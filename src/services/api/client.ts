import { ApiError } from "@/lib/errors";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
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

export const mockClient = {
  get<T>(path: string): Promise<T> {
    return fetch(path).then((r) => r.json() as Promise<T>);
  },
};
