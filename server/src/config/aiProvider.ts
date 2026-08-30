import type { AiProviderId, AiProviderMode } from "../types/aiProvider.js";

/** Compile-time local control. Environment selection is intentionally unsupported. */
export const SUPPORTED_AI_PROVIDERS: readonly AiProviderId[] = Object.freeze([
  "mock",
  "openai",
  "gemini",
]);
export const ENABLED_AI_PROVIDERS: readonly AiProviderMode[] = Object.freeze(["mock"]);
export const ACTIVE_AI_PROVIDER: AiProviderMode = "mock";

export const isAiProviderSupported = (providerId: string): providerId is AiProviderId =>
  SUPPORTED_AI_PROVIDERS.includes(providerId as AiProviderId);

export const isAiProviderEnabled = (providerId: string): providerId is AiProviderMode =>
  ENABLED_AI_PROVIDERS.includes(providerId as AiProviderMode);
