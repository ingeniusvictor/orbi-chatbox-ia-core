import { validateLocalAiRuntimeConfig } from "./localAiRuntimeConfig.js";
import type {
  LocalAiRuntimeProbeRequest,
  LocalAiRuntimeProbeResult,
  LocalAiRuntimeProbeResultInput,
  LocalAiRuntimeProbeResultValidation,
  LocalAiRuntimeReadiness,
} from "../types/localAiRuntime.js";

export const MAX_LOCAL_AI_PROBE_LATENCY_MS = 60_000;

const invalid = (reason: string): LocalAiRuntimeProbeResultValidation => Object.freeze({
  ok: false,
  reason,
});

export const createLocalAiRuntimeProbeRequest = (
  input: Readonly<LocalAiRuntimeProbeRequest>,
): Readonly<LocalAiRuntimeProbeRequest> => {
  const validation = validateLocalAiRuntimeConfig({ ...input, model: "probe-contract" });
  if (validation.ok === false) throw new Error(validation.reason);

  return Object.freeze({
    runtimeId: validation.config.runtimeId,
    endpoint: validation.config.endpoint,
    timeoutMs: validation.config.timeoutMs,
  });
};

export const createLocalAiRuntimeProbeResult = (
  input: Readonly<LocalAiRuntimeProbeResultInput>,
): LocalAiRuntimeProbeResultValidation => {
  if (!input.runtimeId.trim()) return invalid("Local AI runtime ID is required.");
  if (input.latencyMs !== null && (!Number.isFinite(input.latencyMs) || input.latencyMs < 0 || input.latencyMs > MAX_LOCAL_AI_PROBE_LATENCY_MS)) {
    return invalid("Local AI runtime probe latency is invalid.");
  }

  return Object.freeze({
    ok: true,
    result: Object.freeze({
      runtimeId: input.runtimeId,
      status: input.status,
      latencyMs: input.latencyMs,
      reason: input.reason,
    }),
  });
};

export const mapProbeResultToReadiness = (
  result: Readonly<LocalAiRuntimeProbeResult>,
): Readonly<LocalAiRuntimeReadiness> => Object.freeze({
  runtimeId: result.runtimeId,
  state: result.status === "reachable" ? "ready" : "unavailable",
  model: null,
  reason: result.reason,
});
