import { resolveConfiguredAiProvider } from "./aiProviderSelection.js";
import { validateLocalAiRuntimeConfig } from "../services/localAiRuntimeConfig.js";
import type { AiProviderMode } from "../types/aiProvider.js";
import type { LocalAiRuntimeConfig } from "../types/localAiRuntime.js";

export type PostMvpRuntimeConfig = Readonly<{ provider: AiProviderMode; localAi: Readonly<LocalAiRuntimeConfig>; think: false; stream: false }>;
export const DEFAULT_POST_MVP_RUNTIME_CONFIG: PostMvpRuntimeConfig = Object.freeze({ provider: "mock", localAi: Object.freeze({ runtimeId: "qwen-local-ollama", endpoint: "http://127.0.0.1:11434", model: "qwen3:1.7b", timeoutMs: 30_000 }), think: false, stream: false });
export const loadPostMvpRuntimeConfig = (env: Readonly<Record<string, string | undefined>> = process.env): PostMvpRuntimeConfig => {
  const candidate = { ...DEFAULT_POST_MVP_RUNTIME_CONFIG.localAi, endpoint: env.ORBI_LOCAL_AI_URL?.trim() || DEFAULT_POST_MVP_RUNTIME_CONFIG.localAi.endpoint, model: env.ORBI_LOCAL_AI_MODEL?.trim() || DEFAULT_POST_MVP_RUNTIME_CONFIG.localAi.model };
  const valid = validateLocalAiRuntimeConfig(candidate); if (!valid.ok) throw new Error(valid.reason);
  return Object.freeze({ provider: resolveConfiguredAiProvider(env.ORBI_AI_PROVIDER), localAi: valid.config, think: false, stream: false });
};
