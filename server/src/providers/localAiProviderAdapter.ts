import type {
  LocalAiProviderAdapter,
  LocalAiProviderRequest,
  LocalAiProviderResponse,
} from "../types/localAiProvider.js";

export const LOCAL_AI_GENERATION_DISABLED = "local-ai-generation-not-enabled";

/**
 * Deliberately non-executable placeholder. It does not call transport or a model runtime.
 * Registration remains limited to the mock provider.
 */
export const localAiProviderAdapter: LocalAiProviderAdapter = Object.freeze({
  async generate(_request: Readonly<LocalAiProviderRequest>): Promise<Readonly<LocalAiProviderResponse>> {
    throw new Error(LOCAL_AI_GENERATION_DISABLED);
  },
});
