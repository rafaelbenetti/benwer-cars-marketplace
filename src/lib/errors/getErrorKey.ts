import { ErrorMessages } from "@/enums";
import { ApiError } from "./ApiError";

const KNOWN_KEYS = new Set<string>(Object.values(ErrorMessages));

export function getErrorKey(error: unknown): ErrorMessages {
  if (error instanceof ApiError) {
    const key = `errors.${error.code}`;
    if (KNOWN_KEYS.has(key)) {
      return key as ErrorMessages;
    }
  }

  if (error instanceof TypeError) {
    return ErrorMessages.NETWORK;
  }

  if (error instanceof DOMException && error.name === "AbortError") {
    return ErrorMessages.NETWORK;
  }

  return ErrorMessages.UNKNOWN;
}
