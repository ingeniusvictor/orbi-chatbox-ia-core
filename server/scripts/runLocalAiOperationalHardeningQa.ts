import { createServer } from "node:http";
import express from "express";
import { ACTIVE_AI_PROVIDER } from "../src/config/aiProvider.js";
import { QWEN_LOCAL_RUNTIME_CONFIG } from "../src/config/qwenLocal.js";
import { mockAiProvider } from "../src/providers/mockAiProvider.js";
import { createQwenLocalProvider, QwenLocalProviderError } from "../src/providers/qwenLocalProvider.js";
import { createWidgetMessageRouter } from "../src/routes/widgetMessage.js";
import { LUMI_IDENTITY } from "../src/data/lumiIdentity.js";
import { composeAssistantInstruction } from "../src/services/assistantInstructionComposer.js";
import { composeCompactAssistantRuntimeInstruction } from "../src/services/assistantRuntimeInstructionComposer.js";
import type { AiProviderRequest } from "../src/types/aiProvider.js";
import type { KnowledgeContext } from "../src/types/knowledge.js";

type Scenario = "healthy" | "health-invalid" | "model-missing" | "timeout" | "malformed" | "empty" | "generation-failed";
const context: Readonly<KnowledgeContext> = Object.freeze({ query: "sandbox assistant", source: "local-static", mode: "sandbox", matchCount: 1, entries: Object.freeze([Object.freeze({ id: "source", domain: "system" as const, title: "Source", content: "Synthetic context.", score: 1 })]), totalCharacters: 18, truncated: false });
const request: Readonly<AiProviderRequest> = Object.freeze({ requestId: "hardening-request", conversationId: "hardening-conversation", message: "sandbox assistant", knowledgeContext: context, assistantInstruction: composeAssistantInstruction(LUMI_IDENTITY), assistantRuntimeInstruction: composeCompactAssistantRuntimeInstruction(composeAssistantInstruction(LUMI_IDENTITY)) });
const start = async (scenario: Scenario): Promise<{ provider: ReturnType<typeof createQwenLocalProvider>; base: string; close: () => Promise<void> }> => {
  const server = createServer((incoming, outgoing) => {
    if (incoming.url === "/api/version") { outgoing.writeHead(200, { "Content-Type": "application/json" }); outgoing.end(scenario === "health-invalid" ? "{}" : '{"version":"synthetic"}'); return; }
    if (incoming.url !== "/api/generate") { outgoing.writeHead(404); outgoing.end(); return; }
    if (scenario === "model-missing") { outgoing.writeHead(404, { "Content-Type": "application/json" }); outgoing.end('{"error":"raw model detail"}'); return; }
    if (scenario === "timeout") { setTimeout(() => { outgoing.writeHead(200, { "Content-Type": "application/json" }); outgoing.end('{"response":"late"}'); }, 100); return; }
    if (scenario === "malformed") { outgoing.writeHead(200, { "Content-Type": "application/json" }); outgoing.end("{"); return; }
    if (scenario === "empty") { outgoing.writeHead(200, { "Content-Type": "application/json" }); outgoing.end('{"response":" "}'); return; }
    if (scenario === "generation-failed") { outgoing.writeHead(500, { "Content-Type": "application/json" }); outgoing.end('{"error":"raw generation detail"}'); return; }
    outgoing.writeHead(200, { "Content-Type": "application/json" }); outgoing.end('{"response":"synthetic healthy response"}');
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address(); const port = typeof address === "object" && address ? address.port : 0;
  const config = Object.freeze({ runtimeId: "hardening", endpoint: `http://127.0.0.1:${port}`, model: QWEN_LOCAL_RUNTIME_CONFIG.model, timeoutMs: scenario === "timeout" ? 20 : 1_000 });
  return { provider: createQwenLocalProvider(config), base: `http://127.0.0.1:${port}`, close: () => new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve())) };
};
const failureCode = async (scenario: Scenario): Promise<string> => { const runtime = await start(scenario); try { await runtime.provider.generate(request); return ""; } catch (error) { return error instanceof QwenLocalProviderError ? error.code : ""; } finally { await runtime.close(); } };

const main = async (): Promise<void> => {
  const healthy = await start("healthy");
  let healthyResult = false;
  try { const result = await healthy.provider.generate(request); healthyResult = result.text === "synthetic healthy response" && result.provider === "qwen-local"; } finally { await healthy.close(); }
  const [healthInvalid, modelMissing, timeout, malformed, empty, generationFailed, unavailable] = await Promise.all([
    failureCode("health-invalid"), failureCode("model-missing"), failureCode("timeout"), failureCode("malformed"), failureCode("empty"), failureCode("generation-failed"),
    (async () => { try { await createQwenLocalProvider(Object.freeze({ runtimeId: "hardening", endpoint: "http://127.0.0.1:1", model: QWEN_LOCAL_RUNTIME_CONFIG.model, timeoutMs: 20 })).generate(request); return ""; } catch (error) { return error instanceof QwenLocalProviderError ? error.code : ""; } })(),
  ]);
  const httpRuntime = await start("model-missing"); const app = express(); app.use(express.json()); app.use(createWidgetMessageRouter("key", "qwen-local", httpRuntime.provider));
  const httpServer = createServer(app); await new Promise<void>((resolve) => httpServer.listen(0, "127.0.0.1", resolve)); const address = httpServer.address(); const port = typeof address === "object" && address ? address.port : 0;
  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/public/widget/key/message`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ channel: "manual_test", message: "sandbox assistant", consentAccepted: true }) });
    const body = await response.json() as Record<string, unknown>;
    const mock = await mockAiProvider.generate(request);
    const passed = healthyResult && healthInvalid === "LOCAL_AI_INVALID_RESPONSE" && modelMissing === "LOCAL_AI_MODEL_UNAVAILABLE" && timeout === "LOCAL_AI_TIMEOUT" && malformed === "LOCAL_AI_INVALID_RESPONSE" && empty === "LOCAL_AI_INVALID_RESPONSE" && generationFailed === "LOCAL_AI_GENERATION_FAILED" && unavailable === "LOCAL_AI_RUNTIME_UNAVAILABLE" && response.status === 503 && body.errorCode === "LOCAL_AI_MODEL_UNAVAILABLE" && !JSON.stringify(body).includes("raw model detail") && !JSON.stringify(body).includes("stack") && mock.provider === "mock" && ACTIVE_AI_PROVIDER === "mock" && QWEN_LOCAL_RUNTIME_CONFIG.model === "qwen3:1.7b";
    if (!passed) throw new Error("Local AI operational hardening assertions failed.");
    console.info("Local AI Operational Hardening QA: PASS (synthetic loopback only; controlled failures)");
  } finally { await Promise.all([httpRuntime.close(), new Promise<void>((resolve, reject) => httpServer.close((error) => error ? reject(error) : resolve()))]); }
};
void main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : "Local AI operational hardening QA failed."); process.exit(1); });
