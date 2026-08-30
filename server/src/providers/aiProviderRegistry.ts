import { mockAiProvider } from "./mockAiProvider.js";
import { qwenLocalProvider } from "./qwenLocalProvider.js";
import type { AiProvider, AiProviderMode } from "../types/aiProvider.js";

const PROVIDERS: Readonly<Record<AiProviderMode, AiProvider>> = Object.freeze({
  mock: mockAiProvider,
  "qwen-local": qwenLocalProvider,
});

export const REGISTERED_AI_PROVIDER_MODES: readonly AiProviderMode[] = Object.freeze(["mock", "qwen-local"]);

export const resolveAiProvider = (mode: AiProviderMode): AiProvider => {
  const provider = PROVIDERS[mode];
  if (!provider) {
    throw new Error("Unsupported AI provider mode.");
  }

  return provider;
};
