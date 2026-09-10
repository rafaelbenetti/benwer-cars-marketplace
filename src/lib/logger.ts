type LogContext = Record<string, unknown>;

export function logError(error: unknown, context?: LogContext): void {
  console.error("[marketplace]", error, context ?? {});
}

export function logMessage(message: string, context?: LogContext): void {
  console.log("[marketplace]", message, context ?? {});
}
