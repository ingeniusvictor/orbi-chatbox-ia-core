import type {
  LocalAiRuntimeConfigInput,
  LocalAiRuntimeConfigValidation,
} from "../types/localAiRuntime.js";

export const DEFAULT_LOCAL_AI_TIMEOUT_MS = 10_000;
export const MAX_LOCAL_AI_TIMEOUT_MS = 60_000;

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

const nonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const invalid = (reason: string): LocalAiRuntimeConfigValidation => Object.freeze({
  ok: false,
  reason,
});

export const validateLocalAiRuntimeConfig = (
  input: Readonly<LocalAiRuntimeConfigInput>,
): LocalAiRuntimeConfigValidation => {
  if (!nonEmptyString(input.runtimeId)) return invalid("Local AI runtime ID is required.");
  if (!nonEmptyString(input.endpoint)) return invalid("Local AI runtime endpoint is required.");
  if (!nonEmptyString(input.model)) return invalid("Local AI runtime model is required.");
  const timeoutMs = input.timeoutMs;
  if (typeof timeoutMs !== "number" || !Number.isInteger(timeoutMs) || timeoutMs <= 0) {
    return invalid("Local AI runtime timeout must be a positive integer.");
  }
  if (timeoutMs > MAX_LOCAL_AI_TIMEOUT_MS) {
    return invalid("Local AI runtime timeout exceeds the safe maximum.");
  }

  try {
    const endpoint = new URL(input.endpoint);
    if (!LOOPBACK_HOSTS.has(endpoint.hostname.toLowerCase())) {
      return invalid("Local AI runtime endpoint must use a loopback host.");
    }
  } catch {
    return invalid("Local AI runtime endpoint is invalid.");
  }

  return Object.freeze({
    ok: true,
    config: Object.freeze({
      runtimeId: input.runtimeId.trim(),
      endpoint: input.endpoint.trim(),
      model: input.model.trim(),
      timeoutMs,
    }),
  });
};
