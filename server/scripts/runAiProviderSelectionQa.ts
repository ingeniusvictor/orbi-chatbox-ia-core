import { createServer } from "node:http";
import express from "express";
import { DEFAULT_AI_PROVIDER, resolveConfiguredAiProvider } from "../src/config/aiProviderSelection.js";
import { createQwenLocalProvider } from "../src/providers/qwenLocalProvider.js";
import { resolveAiProvider } from "../src/providers/aiProviderRegistry.js";
import { createWidgetMessageRouter } from "../src/routes/widgetMessage.js";

const rejects = (value: string): boolean => {
  try { resolveConfiguredAiProvider(value); return false; } catch { return true; }
};
const body = JSON.stringify({ channel: "manual_test", message: "sandbox assistant", consentAccepted: true, provider: "qwen-local" });

const start = async (router: express.Router): Promise<{ base: string; close: () => Promise<void> }> => {
  const app = express(); app.use(express.json()); app.use(router);
  const server = createServer(app); await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address(); const port = typeof address === "object" && address ? address.port : 0;
  return { base: `http://127.0.0.1:${port}`, close: () => new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve())) };
};

const main = async (): Promise<void> => {
  const syntheticOllama = createServer((request, response) => {
    if (request.url === "/api/version" && request.method === "GET") { response.writeHead(200, { "Content-Type": "application/json" }); response.end('{"version":"synthetic"}'); return; }
    if (request.url !== "/api/generate" || request.method !== "POST") { response.writeHead(404); response.end(); return; }
    response.writeHead(200, { "Content-Type": "application/json" }); response.end('{"response":"synthetic selected qwen"}');
  });
  await new Promise<void>((resolve) => syntheticOllama.listen(0, "127.0.0.1", resolve));
  const address = syntheticOllama.address(); const port = typeof address === "object" && address ? address.port : 0;
  const qwen = createQwenLocalProvider(Object.freeze({ runtimeId: "selection-qa", endpoint: `http://127.0.0.1:${port}`, model: "synthetic", timeoutMs: 1_000 }));
  const mockServer = await start(createWidgetMessageRouter("key", "mock"));
  const qwenServer = await start(createWidgetMessageRouter("key", "qwen-local", qwen));
  const unavailable = createQwenLocalProvider(Object.freeze({ runtimeId: "selection-qa", endpoint: "http://127.0.0.1:1", model: "synthetic", timeoutMs: 100 }));
  const unavailableServer = await start(createWidgetMessageRouter("key", "qwen-local", unavailable));
  try {
    const init = { method: "POST", headers: { "Content-Type": "application/json", "X-Orbi-Ai-Provider": "qwen-local" }, body };
    const [mockResponse, qwenResponse, unavailableResponse] = await Promise.all([
      fetch(`${mockServer.base}/api/public/widget/key/message?provider=qwen-local`, init),
      fetch(`${qwenServer.base}/api/public/widget/key/message`, init),
      fetch(`${unavailableServer.base}/api/public/widget/key/message`, init),
    ]);
    const [mockBody, qwenBody, unavailableBody] = await Promise.all([mockResponse.json(), qwenResponse.json(), unavailableResponse.json()]) as [Record<string, unknown>, Record<string, unknown>, Record<string, unknown>];
    const passed = resolveConfiguredAiProvider(undefined) === DEFAULT_AI_PROVIDER
      && resolveConfiguredAiProvider("mock") === "mock"
      && resolveConfiguredAiProvider("qwen-local") === "qwen-local"
      && rejects("") && rejects("   ") && rejects("gemma-local") && rejects("openai") && rejects("gemini") && rejects("unknown")
      && resolveAiProvider(resolveConfiguredAiProvider("mock")).mode === "mock"
      && resolveAiProvider(resolveConfiguredAiProvider("qwen-local")).mode === "qwen-local"
      && mockResponse.status === 200 && mockBody.provider === "mock" && mockBody.responseMode === "provider-mock"
      && qwenResponse.status === 200 && qwenBody.provider === "qwen-local" && qwenBody.responseMode === "provider-qwen-local" && qwenBody.message === "synthetic selected qwen"
      && unavailableResponse.status === 503 && unavailableBody.errorCode === "LOCAL_AI_RUNTIME_UNAVAILABLE" && unavailableBody.provider !== "mock";
    if (!passed) throw new Error("AI provider selection assertions failed.");
    console.info("AI Provider Selection QA: PASS (server-controlled mock/qwen-local selection only)");
  } finally {
    await Promise.all([mockServer.close(), qwenServer.close(), unavailableServer.close(), new Promise<void>((resolve, reject) => syntheticOllama.close((error) => error ? reject(error) : resolve()))]);
  }
};
void main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : "AI provider selection QA failed."); process.exit(1); });
