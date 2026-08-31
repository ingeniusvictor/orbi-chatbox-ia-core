import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import express from "express";
import { LUMI_IDENTITY } from "../src/data/lumiIdentity.js";
import { mockAiProvider } from "../src/providers/mockAiProvider.js";
import { createWidgetMessageRouter } from "../src/routes/widgetMessage.js";
import { getAssistantIdentity } from "../src/services/assistantIdentity.js";
import { composeAssistantInstruction } from "../src/services/assistantInstructionComposer.js";
import { mapAiProviderRequestToLocalAiProviderRequest } from "../src/services/localAiProviderMapper.js";
import { MAX_QWEN_LOCAL_PROMPT_CHARACTERS, buildQwenLocalPrompt } from "../src/services/qwenLocalPromptBuilder.js";
import type { AiProvider, AiProviderRequest } from "../src/types/aiProvider.js";
import type { KnowledgeContext } from "../src/types/knowledge.js";

const knownContext: Readonly<KnowledgeContext> = Object.freeze({
  query: "synthetic LUMI knowledge", source: "local-static", mode: "sandbox", matchCount: 1,
  entries: Object.freeze([Object.freeze({ id: "synthetic-lumi-source", domain: "orbi" as const, title: "Synthetic LUMI Context", content: "Approved synthetic ORBI context.", score: 1 })]),
  totalCharacters: 32, truncated: false,
});
const emptyContext: Readonly<KnowledgeContext> = Object.freeze({ ...knownContext, query: "unknown synthetic context", matchCount: 0, entries: Object.freeze([]), totalCharacters: 0 });
const instruction = composeAssistantInstruction(getAssistantIdentity());
const request = (knowledgeContext: Readonly<KnowledgeContext>, message = "How does this controlled local flow work?"): Readonly<AiProviderRequest> => Object.freeze({
  requestId: "synthetic-lumi-request", conversationId: "synthetic-lumi-conversation", message, knowledgeContext, assistantInstruction: instruction,
});

const main = async (): Promise<void> => {
  let captured: Readonly<AiProviderRequest> | undefined;
  const capturingProvider: AiProvider = Object.freeze({
    mode: "mock" as const,
    async generate(providerRequest) {
      captured = providerRequest;
      return Object.freeze({ text: "synthetic runtime response", provider: "mock" as const, grounded: providerRequest.knowledgeContext.entries.length > 0, sourceEntryIds: Object.freeze(providerRequest.knowledgeContext.entries.map((entry) => entry.id)) });
    },
  });
  const app = express(); app.use(express.json()); app.use(createWidgetMessageRouter("synthetic-lumi-key", "mock", capturingProvider));
  const server = createServer(app);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address(); const port = typeof address === "object" && address ? address.port : 0;
  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/public/widget/synthetic-lumi-key/message`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ channel: "manual_test", message: "synthetic LUMI knowledge", consentAccepted: true }) });
    const body = await response.json() as Record<string, unknown>;
    const mapped = mapAiProviderRequestToLocalAiProviderRequest(request(knownContext), "synthetic-local", "synthetic-model");
    const prompt = buildQwenLocalPrompt(mapped);
    const repeatedPrompt = buildQwenLocalPrompt(mapped);
    const boundedPrompt = buildQwenLocalPrompt(mapAiProviderRequestToLocalAiProviderRequest(request(Object.freeze({ ...knownContext, entries: Object.freeze([Object.freeze({ ...knownContext.entries[0]!, content: "x".repeat(10_000) })]) }), "y".repeat(10_000)), "synthetic-local", "synthetic-model"));
    const knownMock = await mockAiProvider.generate(request(knownContext));
    const unknownMock = await mockAiProvider.generate(request(emptyContext));
    const [promptBuilderSource, providerSource] = await Promise.all([
      readFile(new URL("../src/services/qwenLocalPromptBuilder.ts", import.meta.url), "utf8"),
      readFile(new URL("../src/providers/qwenLocalProvider.ts", import.meta.url), "utf8"),
    ]);
    const passed = response.status === 200 && body.ok === true
      && captured?.assistantInstruction.assistantId === "lumi"
      && captured?.assistantInstruction.text === instruction.text
      && Object.isFrozen(captured?.assistantInstruction)
      && mapped.assistantInstruction === instruction
      && prompt.includes("[ASSISTANT INSTRUCTION]") && prompt.includes(instruction.text)
      && prompt.includes("[ORBI KNOWLEDGE CONTEXT]") && prompt.includes("Synthetic LUMI Context")
      && prompt.includes("[USER MESSAGE]") && prompt.includes("controlled local flow")
      && prompt === repeatedPrompt && prompt.length <= MAX_QWEN_LOCAL_PROMPT_CHARACTERS && boundedPrompt.length <= MAX_QWEN_LOCAL_PROMPT_CHARACTERS
      && knownMock.grounded && knownMock.sourceEntryIds.join(",") === "synthetic-lumi-source"
      && !unknownMock.grounded && unknownMock.sourceEntryIds.length === 0
      && !instruction.text.toLowerCase().match(/qwen|ollama|gemma|openai|gemini/)
      && !promptBuilderSource.match(/LUMI_IDENTITY|assistantIdentity|assistantInstructionComposer/)
      && !providerSource.match(/LUMI_IDENTITY|assistantIdentity|assistantInstructionComposer/)
      && instruction.assistantId === LUMI_IDENTITY.id;
    if (!passed) throw new Error("Assistant runtime integration assertions failed.");
    console.info("Assistant Runtime Integration QA: PASS (provider-neutral instruction, unchanged grounding, synthetic loopback only)");
  } finally { await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve())); }
};

void main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : "Assistant runtime integration QA failed."); process.exit(1); });
