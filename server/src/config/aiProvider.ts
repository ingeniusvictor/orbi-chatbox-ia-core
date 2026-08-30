import type {
  AiProviderDeployment,
  AiProviderId,
  AiProviderMode,
} from "../types/aiProvider.js";

/** Compile-time local control. Environment selection is intentionally unsupported. */
export const SUPPORTED_AI_PROVIDERS: readonly AiProviderId[] = Object.freeze([
  "mock",
  "qwen-local",
  "gemma-local",
  "openai",
  "gemini",
]);
export const ENABLED_AI_PROVIDERS: readonly AiProviderMode[] = Object.freeze(["mock"]);
export const ACTIVE_AI_PROVIDER: AiProviderMode = "mock";
const PROVIDER_DEPLOYMENTS: Readonly<Record<AiProviderId, AiProviderDeployment>> = Object.freeze({
  mock: "development",
  "qwen-local": "local",
  "gemma-local": "local",
  openai: "cloud",
  gemini: "cloud",
});

export const isAiProviderSupported = (providerId: string): providerId is AiProviderId =>
  SUPPORTED_AI_PROVIDERS.includes(providerId as AiProviderId);

export const isAiProviderEnabled = (providerId: string): providerId is AiProviderMode =>
  ENABLED_AI_PROVIDERS.includes(providerId as AiProviderMode);

export const getAiProviderDeployment = (
  providerId: AiProviderId,
): AiProviderDeployment => PROVIDER_DEPLOYMENTS[providerId];
