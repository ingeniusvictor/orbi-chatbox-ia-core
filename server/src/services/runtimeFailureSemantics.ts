import type {
  RuntimeDisposition,
  RuntimeDispositionCategory,
  RuntimeDispositionInputCode,
  RuntimeFailureReasonCode,
} from "../types/runtimeFailureSemantics.js";

type RuntimeDispositionDefinition = Readonly<{
  category: RuntimeDispositionCategory;
  safeMessage: string;
}>;

const DEFINITIONS: Readonly<Record<RuntimeFailureReasonCode, RuntimeDispositionDefinition>> = Object.freeze({
  INVALID_CLIENT_PROFILE: Object.freeze({ category: "FAIL_CLOSED", safeMessage: "The active client profile is invalid." }),
  UNKNOWN_CONFIGURED_TOOL: Object.freeze({ category: "FAIL_CLOSED", safeMessage: "A configured tool is not registered." }),
  INVALID_COMMERCIAL_POLICY: Object.freeze({ category: "FAIL_CLOSED", safeMessage: "The commercial runtime policy is invalid." }),
  INVALID_RUNTIME_COMPOSITION: Object.freeze({ category: "FAIL_CLOSED", safeMessage: "The runtime composition is invalid." }),
  CHANNEL_DISABLED: Object.freeze({ category: "CONTROLLED_DENIAL", safeMessage: "The requested channel is disabled." }),
  INPUT_TOO_LARGE: Object.freeze({ category: "CONTROLLED_DENIAL", safeMessage: "The inbound message exceeds the allowed size." }),
  HANDOFF_ACTIVE: Object.freeze({ category: "CONTROLLED_DENIAL", safeMessage: "Automated execution is paused for human handoff." }),
  RATE_LIMITED: Object.freeze({ category: "CONTROLLED_DENIAL", safeMessage: "The request limit has been reached." }),
  CONCURRENCY_LIMITED: Object.freeze({ category: "CONTROLLED_DENIAL", safeMessage: "The conversation execution limit has been reached." }),
  TELEMETRY_FAILURE: Object.freeze({ category: "BEST_EFFORT_FAILURE", safeMessage: "Optional telemetry could not be recorded." }),
  PROVIDER_FAILURE: Object.freeze({ category: "RUNTIME_ERROR", safeMessage: "The configured provider could not complete execution." }),
  TOOL_EXECUTION_FAILURE: Object.freeze({ category: "RUNTIME_ERROR", safeMessage: "A runtime tool could not complete execution." }),
  CORE_EXECUTION_FAILURE: Object.freeze({ category: "RUNTIME_ERROR", safeMessage: "The runtime could not complete execution." }),
});

const normalizeReasonCode = (reasonCode: RuntimeDispositionInputCode): RuntimeFailureReasonCode =>
  reasonCode === "HUMAN_HANDOFF_ACTIVE" ? "HANDOFF_ACTIVE" : reasonCode;

/**
 * Classifies known, bounded runtime outcomes without carrying raw errors or
 * request data across the neutral runtime boundary.
 */
export const createRuntimeDisposition = (reasonCode: RuntimeDispositionInputCode): RuntimeDisposition => {
  const normalizedReasonCode = normalizeReasonCode(reasonCode);
  const definition = DEFINITIONS[normalizedReasonCode];
  return Object.freeze({
    category: definition.category,
    reasonCode: normalizedReasonCode,
    safeMessage: definition.safeMessage.slice(0, 160),
  });
};
