import {
  RUNTIME_DISPOSITION_CATEGORIES,
  RUNTIME_FAILURE_REASON_CODES,
  type RuntimeDispositionCategory,
  type RuntimeFailureReasonCode,
} from "../src/types/runtimeFailureSemantics.js";
import { createRuntimeDisposition } from "../src/services/runtimeFailureSemantics.js";
import type { RuntimeReadinessStatus } from "../src/services/runtimeReadinessReport.js";

const assert: (value: unknown, message: string) => asserts value = (value, message) => {
  if (!value) throw Error(message);
};

const expected: Readonly<Record<RuntimeFailureReasonCode, RuntimeDispositionCategory>> = Object.freeze({
  INVALID_CLIENT_PROFILE: "FAIL_CLOSED",
  UNKNOWN_CONFIGURED_TOOL: "FAIL_CLOSED",
  INVALID_COMMERCIAL_POLICY: "FAIL_CLOSED",
  INVALID_RUNTIME_COMPOSITION: "FAIL_CLOSED",
  CHANNEL_DISABLED: "CONTROLLED_DENIAL",
  INPUT_TOO_LARGE: "CONTROLLED_DENIAL",
  HANDOFF_ACTIVE: "CONTROLLED_DENIAL",
  RATE_LIMITED: "CONTROLLED_DENIAL",
  CONCURRENCY_LIMITED: "CONTROLLED_DENIAL",
  TELEMETRY_FAILURE: "BEST_EFFORT_FAILURE",
  PROVIDER_FAILURE: "RUNTIME_ERROR",
  TOOL_EXECUTION_FAILURE: "RUNTIME_ERROR",
  CORE_EXECUTION_FAILURE: "RUNTIME_ERROR",
});

try {
  assert(new Set(RUNTIME_DISPOSITION_CATEGORIES).size === 4, "Failure categories must be distinct.");
  assert(RUNTIME_FAILURE_REASON_CODES.length === Object.keys(expected).length, "Every required reason code must be covered exactly once.");

  for (const reasonCode of RUNTIME_FAILURE_REASON_CODES) {
    const first = createRuntimeDisposition(reasonCode);
    const second = createRuntimeDisposition(reasonCode);
    assert(first.category === expected[reasonCode], `${reasonCode} has the wrong category.`);
    assert(JSON.stringify(first) === JSON.stringify(second), `${reasonCode} classification must be deterministic.`);
    assert(Object.isFrozen(first), `${reasonCode} disposition must be immutable.`);
    assert(first.safeMessage.length > 0 && first.safeMessage.length <= 160, `${reasonCode} safe message must be bounded.`);
    assert(Object.keys(first).every((key) => ["category", "reasonCode", "safeMessage"].includes(key)), `${reasonCode} contains an unsafe field.`);
  }

  const existingHandoff = createRuntimeDisposition("HUMAN_HANDOFF_ACTIVE");
  assert(existingHandoff.reasonCode === "HANDOFF_ACTIVE" && existingHandoff.category === "CONTROLLED_DENIAL", "Existing handoff outcome must normalize safely.");

  const serialized = JSON.stringify(RUNTIME_FAILURE_REASON_CODES.map(createRuntimeDisposition));
  assert(!/phone|email|token|secret|password|prompt|raw input|business record|external sender/i.test(serialized), "Safe results must not contain sensitive or raw data.");

  const readinessStatuses: readonly RuntimeReadinessStatus[] = ["READY", "DEGRADED", "NOT_READY"];
  assert(RUNTIME_DISPOSITION_CATEGORIES.every((category) => !readinessStatuses.includes(category as RuntimeReadinessStatus)), "Readiness and execution categories must remain separate.");

  console.info("Runtime Failure Semantics QA: PASS (neutral, bounded, zero network)");
} catch (error) {
  console.error(error);
  process.exit(1);
}
