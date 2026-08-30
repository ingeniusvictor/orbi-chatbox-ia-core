import { validateLocalAiRuntimeConfig } from "./localAiRuntimeConfig.js";
import type {
  LocalAiRuntimeConfigInput,
  LocalAiRuntimeReadiness,
} from "../types/localAiRuntime.js";

export const evaluateLocalAiRuntimeReadiness = (
  input: Readonly<LocalAiRuntimeConfigInput>,
): Readonly<LocalAiRuntimeReadiness> => {
  const validation = validateLocalAiRuntimeConfig(input);
  if (validation.ok === false) {
    return Object.freeze({
      runtimeId: typeof input.runtimeId === "string" && input.runtimeId.trim() ? input.runtimeId.trim() : null,
      state: "misconfigured",
      model: typeof input.model === "string" && input.model.trim() ? input.model.trim() : null,
      reason: validation.reason,
    });
  }

  return Object.freeze({
    runtimeId: validation.config.runtimeId,
    state: "unavailable",
    model: validation.config.model,
    reason: "Runtime readiness checks are not implemented in this module.",
  });
};
