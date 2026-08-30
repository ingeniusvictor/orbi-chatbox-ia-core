import { QWEN_LOCAL_RUNTIME_CONFIG } from "../config/qwenLocal.js";
import { mapAiProviderRequestToLocalAiProviderRequest } from "../services/localAiProviderMapper.js";
import { generateWithOllama } from "../services/ollamaGenerationAdapter.js";
import { buildQwenLocalPrompt } from "../services/qwenLocalPromptBuilder.js";
import type { AiProvider, AiProviderRequest, AiProviderResponse } from "../types/aiProvider.js";
import type { LocalAiRuntimeConfig } from "../types/localAiRuntime.js";

const controlledFailure = (reason: string): Error => new Error(`qwen-local-unavailable: ${reason}`);

export const createQwenLocalProvider = (
  config: Readonly<LocalAiRuntimeConfig> = QWEN_LOCAL_RUNTIME_CONFIG,
): AiProvider => Object.freeze({
  mode: "qwen-local" as const,
  async generate(request: Readonly<AiProviderRequest>): Promise<Readonly<AiProviderResponse>> {
    const localRequest = mapAiProviderRequestToLocalAiProviderRequest(request, config.runtimeId, config.model);
    const result = await generateWithOllama(config, {
      model: localRequest.model,
      prompt: buildQwenLocalPrompt(localRequest),
      stream: false,
      think: false,
    });
    if (result.ok === false) throw controlledFailure(result.reason);
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
