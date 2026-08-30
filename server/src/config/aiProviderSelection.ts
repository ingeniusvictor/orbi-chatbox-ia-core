import { ENABLED_AI_PROVIDERS } from "./aiProvider.js";
import type { AiProviderMode } from "../types/aiProvider.js";

export const DEFAULT_AI_PROVIDER: AiProviderMode = "mock";

export class AiProviderConfigurationError extends Error {
  constructor() {
    super("Unsupported or disabled AI provider configuration.");
    this.name = "AiProviderConfigurationError";
  }
}

/** Resolves only server-start configuration; HTTP inputs are never considered here. */
export const resolveConfiguredAiProvider = (rawValue: string | undefined): AiProviderMode => {
  if (rawValue === undefined) return DEFAULT_AI_PROVIDER;
  const value = rawValue.trim();
  if (!value || !ENABLED_AI_PROVIDERS.includes(value as AiProviderMode)) {
    throw new AiProviderConfigurationError();
  }
  return value as AiProviderMode;
};
