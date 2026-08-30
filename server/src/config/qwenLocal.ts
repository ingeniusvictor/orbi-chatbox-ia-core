import type { LocalAiRuntimeConfig } from "../types/localAiRuntime.js";

/** Compile-time development configuration. No model installation or pull is performed. */
export const QWEN_LOCAL_RUNTIME_CONFIG: Readonly<LocalAiRuntimeConfig> = Object.freeze({
  runtimeId: "qwen-local-ollama",
  endpoint: "http://127.0.0.1:11434",
  model: "qwen3:4b",
  timeoutMs: 30_000,
});
