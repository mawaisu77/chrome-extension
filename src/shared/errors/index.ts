export type ErrorCode =
  | "SESSION_STREAMLINE_EXPIRED"
  | "SESSION_EDPLAN_EXPIRED"
  | "API_UNAUTHORIZED"
  | "API_RATE_LIMITED"
  | "API_NETWORK"
  | "API_INVALID_PAYLOAD"
  | "DOM_ELEMENT_NOT_FOUND"
  | "DOM_AMBIGUOUS_MATCH"
  | "DOM_NO_MATCH"
  | "USER_CANCELLED"
  | "UNKNOWN";

export type AppError = {
  code: ErrorCode;
  message: string;
  recoverable: boolean;
  details?: Record<string, unknown>;
};

export function toAppError(error: unknown, fallback: AppError): AppError {
  if (typeof error === "object" && error && "code" in error && "message" in error) {
    return error as AppError;
  }
  return fallback;
}
