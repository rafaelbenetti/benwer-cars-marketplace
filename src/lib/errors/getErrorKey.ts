import { ApiError } from "./ApiError";

export function getErrorKey(error: unknown): string {
  if (error instanceof ApiError) return `errors.${error.code}`;
  if (error instanceof TypeError) return "errors.network";
  return "errors.unknown";
}
