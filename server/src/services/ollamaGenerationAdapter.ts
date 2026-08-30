import { validateLocalAiRuntimeConfig } from "./localAiRuntimeConfig.js";
import { executeLocalAiTransportRequest } from "./localAiRuntimeTransport.js";
import type { LocalAiRuntimeConfigInput } from "../types/localAiRuntime.js";
import type { OllamaGenerationRequest, OllamaGenerationResult } from "../types/ollamaGeneration.js";

const failed = (reason: string): Readonly<OllamaGenerationResult> => Object.freeze({ ok: false, reason });

/** Local-only `/api/generate` boundary. It exposes no raw runtime payload. */
export const generateWithOllama = async (
  configInput: Readonly<LocalAiRuntimeConfigInput>,
  request: Readonly<OllamaGenerationRequest>,
): Promise<Readonly<OllamaGenerationResult>> => {
  const config = validateLocalAiRuntimeConfig(configInput);
  if (config.ok === false) return failed(config.reason);
  const transport = await executeLocalAiTransportRequest({
    runtimeId: config.config.runtimeId,
    url: new URL("/api/generate", config.config.endpoint).toString(),
    method: "POST",
    timeoutMs: config.config.timeoutMs,
    body: request,
  });
  if (transport.ok === false) return failed(transport.reason);
  if (transport.status < 200 || transport.status >= 300) return failed("Ollama generation returned a non-success status.");
  const responseValue = typeof transport.body === "object" && transport.body !== null
    ? (transport.body as Record<string, unknown>).response : undefined;
  const text = typeof responseValue === "string" ? responseValue.trim() : "";
  return text ? Object.freeze({ ok: true, text }) : failed("Ollama generation returned an invalid response.");
};
