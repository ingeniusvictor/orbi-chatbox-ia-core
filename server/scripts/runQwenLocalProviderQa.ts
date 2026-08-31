import { createServer } from "node:http";
import { ACTIVE_AI_PROVIDER, ENABLED_AI_PROVIDERS, isAiProviderEnabled } from "../src/config/aiProvider.js";
import { mockAiProvider } from "../src/providers/mockAiProvider.js";
import { createQwenLocalProvider } from "../src/providers/qwenLocalProvider.js";
import { REGISTERED_AI_PROVIDER_MODES, resolveAiProvider } from "../src/providers/aiProviderRegistry.js";
import { generateWithOllama } from "../src/services/ollamaGenerationAdapter.js";
import { LUMI_IDENTITY } from "../src/data/lumiIdentity.js";
import { composeAssistantInstruction } from "../src/services/assistantInstructionComposer.js";
import { MAX_QWEN_LOCAL_PROMPT_CHARACTERS, buildQwenLocalPrompt } from "../src/services/qwenLocalPromptBuilder.js";
import type { AiProviderRequest } from "../src/types/aiProvider.js";
import type { KnowledgeContext } from "../src/types/knowledge.js";

const context = (entries: readonly Readonly<KnowledgeContext["entries"][number]>[]): Readonly<KnowledgeContext> => Object.freeze({
  query: "synthetic qwen query", source: "local-static", mode: "sandbox", matchCount: entries.length,
  entries: Object.freeze(entries), totalCharacters: entries.reduce((total, entry) => total + entry.content.length, 0), truncated: false,
});
const knownContext = context([Object.freeze({ id: "synthetic-qwen-source", domain: "system" as const, title: "Synthetic Qwen Source", content: "Use this synthetic local context.", score: 1 })]);
const request = (knowledgeContext: Readonly<KnowledgeContext>, message = "How does the synthetic local flow work?"): Readonly<AiProviderRequest> => Object.freeze({ requestId: "synthetic-qwen-request", conversationId: "synthetic-qwen-conversation", message, knowledgeContext, assistantInstruction: composeAssistantInstruction(LUMI_IDENTITY) });

const rejects = (providerId: string): boolean => {
  try { resolveAiProvider(providerId as never); return false; } catch (error) { return error instanceof Error && error.message === "Unsupported AI provider mode."; }
};

const main = async (): Promise<void> => {
  let sawAuthorization = false;
  const server = createServer((incoming, outgoing) => {
    sawAuthorization ||= typeof incoming.headers.authorization === "string";
    if (incoming.url === "/api/version" && incoming.method === "GET") { outgoing.writeHead(200, { "Content-Type": "application/json" }); outgoing.end('{"version":"synthetic"}'); return; }
    if (incoming.url !== "/api/generate" || incoming.method !== "POST") { outgoing.writeHead(404); outgoing.end(); return; }
    let raw = ""; incoming.on("data", (chunk: Buffer) => { raw += chunk; }); incoming.on("end", () => {
      const body = JSON.parse(raw) as Record<string, unknown>;
      if (body.model === "slow") { setTimeout(() => { outgoing.writeHead(200, { "Content-Type": "application/json" }); outgoing.end('{"response":"late"}'); }, 100); return; }
      if (body.model === "malformed") { outgoing.writeHead(200, { "Content-Type": "application/json" }); outgoing.end("{"); return; }
      if (body.model === "missing") { outgoing.writeHead(200, { "Content-Type": "application/json" }); outgoing.end("{}"); return; }
      if (body.model === "empty") { outgoing.writeHead(200, { "Content-Type": "application/json" }); outgoing.end('{"response":" "}'); return; }
      if (body.model === "redirect") { outgoing.writeHead(302, { Location: "http://example.invalid" }); outgoing.end(); return; }
      const valid = body.model === "synthetic-qwen" && body.stream === false && body.think === false && typeof body.prompt === "string";
      outgoing.writeHead(valid ? 200 : 400, { "Content-Type": "application/json" }); outgoing.end(valid ? '{"response":"synthetic qwen answer"}' : "{}");
    });
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address(); const port = typeof address === "object" && address ? address.port : 0;
  const config = Object.freeze({ runtimeId: "synthetic-qwen", endpoint: `http://127.0.0.1:${port}`, model: "synthetic-qwen", timeoutMs: 1_000 });
  try {
    const qwen = createQwenLocalProvider(config);
    const known = await qwen.generate(request(knownContext));
    const noContext = await qwen.generate(request(context([])));
    const prompt = buildQwenLocalPrompt(Object.freeze({ runtimeId: config.runtimeId, model: config.model, ...request(knownContext) }));
    const bounded = buildQwenLocalPrompt(Object.freeze({ runtimeId: config.runtimeId, model: config.model, ...request(knownContext, "x".repeat(MAX_QWEN_LOCAL_PROMPT_CHARACTERS + 100)) }));
    const failures = await Promise.all([
      generateWithOllama({ ...config, endpoint: "http://127.0.0.1:1" }, { model: config.model, prompt: "synthetic", stream: false, think: false }),
      generateWithOllama({ ...config, timeoutMs: 20 }, { model: "slow", prompt: "synthetic", stream: false, think: false }),
      generateWithOllama(config, { model: "malformed", prompt: "synthetic", stream: false, think: false }),
      generateWithOllama(config, { model: "missing", prompt: "synthetic", stream: false, think: false }),
      generateWithOllama(config, { model: "empty", prompt: "synthetic", stream: false, think: false }),
      generateWithOllama(config, { model: "redirect", prompt: "synthetic", stream: false, think: false }),
      generateWithOllama({ ...config, endpoint: "http://example.invalid" }, { model: config.model, prompt: "synthetic", stream: false, think: false }),
      generateWithOllama({ ...config, endpoint: "http://192.168.1.1" }, { model: config.model, prompt: "synthetic", stream: false, think: false }),
    ]);
    const mock = await mockAiProvider.generate(request(knownContext));
    const passed = port > 0
      && resolveAiProvider("qwen-local").mode === "qwen-local"
      && REGISTERED_AI_PROVIDER_MODES.join(",") === "mock,qwen-local"
      && ENABLED_AI_PROVIDERS.join(",") === "mock,qwen-local"
      && ACTIVE_AI_PROVIDER === "mock"
      && known.provider === "qwen-local" && known.text === "synthetic qwen answer" && known.grounded && known.sourceEntryIds.join(",") === "synthetic-qwen-source"
      && !noContext.grounded && noContext.sourceEntryIds.length === 0
      && prompt.includes("Synthetic Qwen Source") && prompt.includes("synthetic local context") && prompt.includes("[ASSISTANT INSTRUCTION]") && prompt.includes("LUMI")
      && bounded.length === MAX_QWEN_LOCAL_PROMPT_CHARACTERS
      && failures.every((result) => !result.ok)
      && !sawAuthorization
      && mock.provider === "mock"
      && rejects("gemma-local") && rejects("openai") && rejects("gemini")
      && !isAiProviderEnabled("gemma-local") && !isAiProviderEnabled("openai") && !isAiProviderEnabled("gemini");
    if (!passed) throw new Error("Qwen local provider assertions failed.");
    console.info("Qwen Local Provider QA: PASS (synthetic 127.0.0.1 Ollama generation only)");
  } finally { await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve())); }
};
void main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : "Qwen local provider QA failed."); process.exit(1); });
