export type SandboxErrorCode =
  | "INVALID_PUBLIC_KEY"
  | "INVALID_JSON_BODY"
  | "INVALID_MESSAGE"
  | "MESSAGE_TOO_LONG"
  | "CONSENT_REQUIRED"
  | "ORIGIN_NOT_ALLOWED"
  | "RATE_LIMITED"
  | "ROUTE_NOT_FOUND"
  | "LOCAL_AI_PROVIDER_UNAVAILABLE"
  | "INTERNAL_SANDBOX_ERROR";

export type SandboxErrorResponse = {
  ok: false;
  mode: "sandbox";
  errorCode: SandboxErrorCode;
  message: string;
  production: false;
};

export const createSandboxError = (
  statusCode: number,
  errorCode: SandboxErrorCode,
  message: string,
): { statusCode: number; body: SandboxErrorResponse } => ({
  statusCode,
  body: {
    ok: false,
    mode: "sandbox",
    errorCode,
    message,
    production: false,
  },
});
