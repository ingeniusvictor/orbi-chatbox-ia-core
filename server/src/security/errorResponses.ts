export type SandboxErrorCode =
  | "INVALID_PUBLIC_KEY"
  | "INVALID_JSON_BODY"
  | "INVALID_MESSAGE"
  | "MESSAGE_TOO_LONG"
  | "CONSENT_REQUIRED"
  | "ORIGIN_NOT_ALLOWED"
  | "RATE_LIMITED"
  | "ROUTE_NOT_FOUND"
  | "LOCAL_AI_RUNTIME_UNAVAILABLE"
  | "LOCAL_AI_MODEL_UNAVAILABLE"
  | "LOCAL_AI_TIMEOUT"
  | "LOCAL_AI_INVALID_RESPONSE"
  | "LOCAL_AI_GENERATION_FAILED"
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
