import { QWEN_LOCAL_RUNTIME_CONFIG } from "../config/qwenLocal.js";
import { mapAiProviderRequestToLocalAiProviderRequest } from "../services/localAiProviderMapper.js";
import { checkOllamaHealth } from "../services/ollamaHealthAdapter.js";
import { generateWithOllama } from "../services/ollamaGenerationAdapter.js";
import { buildQwenLocalPrompt } from "../services/qwenLocalPromptBuilder.js";
import type { AiProvider, AiProviderRequest, AiProviderResponse } from "../types/aiProvider.js";
import type { LocalAiRuntimeConfig } from "../types/localAiRuntime.js";

export type QwenLocalProviderFailureCode =
  | "LOCAL_AI_RUNTIME_UNAVAILABLE"
  | "LOCAL_AI_MODEL_UNAVAILABLE"
  | "LOCAL_AI_TIMEOUT"
  | "LOCAL_AI_INVALID_RESPONSE"
  | "LOCAL_AI_GENERATION_FAILED";

export class QwenLocalProviderError extends Error {
  constructor(readonly code: QwenLocalProviderFailureCode) {
    super(code);
    this.name = "QwenLocalProviderError";
  }
}

const mapGenerationFailure = (code: Exclude<Awaited<ReturnType<typeof generateWithOllama>>, { ok: true }> ["code"]): QwenLocalProviderFailureCode => {
  if (code === "model-unavailable") return "LOCAL_AI_MODEL_UNAVAILABLE";
  if (code === "timeout") return "LOCAL_AI_TIMEOUT";
  if (code === "invalid-response") return "LOCAL_AI_INVALID_RESPONSE";
  if (code === "generation-failed") return "LOCAL_AI_GENERATION_FAILED";
  return "LOCAL_AI_RUNTIME_UNAVAILABLE";
};

export const createQwenLocalProvider = (
  config: Readonly<LocalAiRuntimeConfig> = QWEN_LOCAL_RUNTIME_CONFIG,
): AiProvider => Object.freeze({
  mode: "qwen-local" as const,
  async generate(request: Readonly<AiProviderRequest>): Promise<Readonly<AiProviderResponse>> {
    const health = await checkOllamaHealth(config);
    if (health.readiness.state !== "ready") {
      throw new QwenLocalProviderError(
        health.readiness.reason === "invalid-runtime-response"
          ? "LOCAL_AI_INVALID_RESPONSE"
          : "LOCAL_AI_RUNTIME_UNAVAILABLE",
      );
    }
    const localRequest = mapAiProviderRequestToLocalAiProviderRequest(request, config.runtimeId, config.model);
    const result = await generateWithOllama(config, {
      model: localRequest.model,
      prompt: buildQwenLocalPrompt(localRequest),
      stream: false,
      think: false,
    });
    if (result.ok === false) throw new QwenLocalProviderError(mapGenerationFailure(result.code));
    const sourceEntryIds = Object.freeze(localRequest.knowledgeContext.entries.map((entry) => entry.id));
    return Object.freeze({
      text: result.text,
      provider: "qwen-local" as const,
      grounded: sourceEntryIds.length > 0,
      sourceEntryIds,
    });
  },
});

export const qwenLocalProvider: AiProvider = createQwenLocalProvider();
