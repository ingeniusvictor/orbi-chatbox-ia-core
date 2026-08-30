import { MAX_LOCAL_AI_TIMEOUT_MS } from "./localAiRuntimeConfig.js";
import { validateLocalAiRuntimeUrl } from "./localAiRuntimeUrl.js";
import type { LocalAiTransportRequest, LocalAiTransportResult } from "../types/localAiRuntime.js";

export const MAX_LOCAL_AI_TRANSPORT_RESPONSE_BYTES = 65_536;
const failure = (kind: Extract<LocalAiTransportResult, { ok: false }>["failure"], reason: string): LocalAiTransportResult => Object.freeze({ ok: false, failure: kind, reason });

export const executeLocalAiTransportRequest = async (request: Readonly<LocalAiTransportRequest>): Promise<LocalAiTransportResult> => {
  const url = validateLocalAiRuntimeUrl(request.url);
  if (!url) return failure("invalid-url", "Local AI transport URL is not allowed.");
  if (!Number.isInteger(request.timeoutMs) || request.timeoutMs <= 0 || request.timeoutMs > MAX_LOCAL_AI_TIMEOUT_MS) return failure("invalid-url", "Local AI transport timeout is invalid.");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), request.timeoutMs);
  const startedAt = Date.now();
  try {
    const response = await fetch(url, { method: request.method, body: request.body === undefined ? undefined : JSON.stringify(request.body), headers: request.body === undefined ? undefined : { "Content-Type": "application/json" }, redirect: "manual", credentials: "omit", signal: controller.signal });
    if (response.status >= 300 && response.status < 400) return failure("invalid-response", "Local AI transport redirects are not followed.");
    const contentLength = Number(response.headers.get("content-length"));
    if (Number.isFinite(contentLength) && contentLength > MAX_LOCAL_AI_TRANSPORT_RESPONSE_BYTES) return failure("invalid-response", "Local AI transport response exceeds the size limit.");
    const text = await response.text();
    if (new TextEncoder().encode(text).length > MAX_LOCAL_AI_TRANSPORT_RESPONSE_BYTES) return failure("invalid-response", "Local AI transport response exceeds the size limit.");
    let body: unknown = text;
    if ((response.headers.get("content-type") || "").includes("application/json")) {
      try { body = JSON.parse(text); } catch { return failure("invalid-response", "Local AI transport returned invalid JSON."); }
    }
    return Object.freeze({ ok: true, status: response.status, body, latencyMs: Date.now() - startedAt });
  } catch (error) {
    return failure(error instanceof Error && error.name === "AbortError" ? "timeout" : "unreachable", "Local AI transport request was not completed.");
  } finally { clearTimeout(timer); }
};
