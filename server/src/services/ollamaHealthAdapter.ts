import { validateLocalAiRuntimeConfig } from "./localAiRuntimeConfig.js";
import { executeLocalAiTransportRequest } from "./localAiRuntimeTransport.js";
import { mapProbeResultToReadiness } from "./localAiRuntimeProbe.js";
import type { LocalAiRuntimeConfigInput, LocalAiRuntimeReadiness } from "../types/localAiRuntime.js";
import type { OllamaHealthInfo } from "../types/ollama.js";

export type OllamaHealthCheckResult = Readonly<{ readiness: Readonly<LocalAiRuntimeReadiness>; health: Readonly<OllamaHealthInfo> }>;
export const checkOllamaHealth = async (input: Readonly<LocalAiRuntimeConfigInput>): Promise<OllamaHealthCheckResult> => {
  const config = validateLocalAiRuntimeConfig(input);
  if (config.ok === false) return Object.freeze({ readiness: Object.freeze({ runtimeId: null, state: "misconfigured", model: null, reason: config.reason }), health: Object.freeze({ version: null }) });
  const url = new URL("/api/version", config.config.endpoint).toString();
  const transport = await executeLocalAiTransportRequest({ runtimeId: config.config.runtimeId, url, method: "GET", timeoutMs: config.config.timeoutMs });
  if (transport.ok === false) return Object.freeze({ readiness: mapProbeResultToReadiness({ runtimeId: config.config.runtimeId, status: transport.failure === "timeout" ? "timeout" : transport.failure === "invalid-response" ? "invalid-response" : "unreachable", latencyMs: null, reason: transport.reason }), health: Object.freeze({ version: null }) });
  const body = transport.body;
  const versionValue = typeof body === "object" && body !== null ? (body as Record<string, unknown>).version : undefined;
  const version = typeof versionValue === "string" ? versionValue.trim() : "";
  if (!version || transport.status < 200 || transport.status >= 300) return Object.freeze({ readiness: mapProbeResultToReadiness({ runtimeId: config.config.runtimeId, status: "invalid-response", latencyMs: transport.latencyMs, reason: "invalid-runtime-response" }), health: Object.freeze({ version: null }) });
  return Object.freeze({ readiness: mapProbeResultToReadiness({ runtimeId: config.config.runtimeId, status: "reachable", latencyMs: transport.latencyMs, reason: null }), health: Object.freeze({ version }) });
};
