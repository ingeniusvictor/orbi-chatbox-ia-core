export const RUNTIME_DISPOSITION_CATEGORIES = [
  "FAIL_CLOSED",
  "CONTROLLED_DENIAL",
  "BEST_EFFORT_FAILURE",
  "RUNTIME_ERROR",
] as const;

export type RuntimeDispositionCategory = typeof RUNTIME_DISPOSITION_CATEGORIES[number];

export const RUNTIME_FAILURE_REASON_CODES = [
  "INVALID_CLIENT_PROFILE",
  "UNKNOWN_CONFIGURED_TOOL",
  "INVALID_COMMERCIAL_POLICY",
  "INVALID_RUNTIME_COMPOSITION",
  "CHANNEL_DISABLED",
  "INPUT_TOO_LARGE",
  "HANDOFF_ACTIVE",
  "RATE_LIMITED",
  "CONCURRENCY_LIMITED",
  "TELEMETRY_FAILURE",
  "PROVIDER_FAILURE",
  "TOOL_EXECUTION_FAILURE",
  "CORE_EXECUTION_FAILURE",
] as const;

export type RuntimeFailureReasonCode = typeof RUNTIME_FAILURE_REASON_CODES[number];

/**
 * Existing boundary outcomes accepted by the neutral classifier. The router's
 * canonical handoff outcome is normalized without changing that boundary.
 */
export type RuntimeDispositionInputCode = RuntimeFailureReasonCode | "HUMAN_HANDOFF_ACTIVE";

export type RuntimeDisposition = Readonly<{
  category: RuntimeDispositionCategory;
  reasonCode: RuntimeFailureReasonCode;
  safeMessage: string;
}>;
