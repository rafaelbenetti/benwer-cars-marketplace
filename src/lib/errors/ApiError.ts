export interface FieldError {
  field: string;
  code: string;
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    readonly fieldErrors: FieldError[] = [],
    readonly detail?: string,
  ) {
    super(code);
  }
}
