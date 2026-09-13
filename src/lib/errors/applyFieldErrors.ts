import { ErrorMessages } from "@/enums";
import { ApiError } from "./ApiError";
import { getErrorKey } from "./getErrorKey";

export function applyFieldErrors<TField extends string>(
  error: unknown,
  setError: (field: TField, error: { message: string }) => void,
  translate: (key: ErrorMessages) => string,
): boolean {
  if (!(error instanceof ApiError) || error.fieldErrors.length === 0) {
    return false;
  }

  for (const fieldError of error.fieldErrors) {
    setError(fieldError.field as TField, {
      message: translate(getErrorKey(new ApiError(400, fieldError.code))),
    });
  }

  return true;
}
