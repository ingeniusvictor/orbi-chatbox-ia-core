import { createServer } from "node:http";
import express from "express";
import { createWidgetMessageRouter } from "../src/routes/widgetMessage.js";
import { shouldInvokeKnowledgeSearch } from "../src/services/capabilityInvocationPolicy.js";
import { mapAiProviderRequestToLocalAiProviderRequest } from "../src/services/localAiProviderMapper.js";
import { buildQwenLocalPrompt } from "../src/services/qwenLocalPromptBuilder.js";
import { LUMI_IDENTITY } from "../src/data/lumiIdentity.js";
import { composeAssistantInstruction } from "../src/services/assistantInstructionComposer.js";
import { composeCompactAssistantRuntimeInstruction } from "../src/services/assistantRuntimeInstructionComposer.js";
import { composeAssistantBehaviorInstruction } from "../src/services/assistantBehaviorPolicyComposer.js";
import { LUMI_BEHAVIOR_POLICY } from "../src/data/lumiBehaviorPolicy.js";
import type { AiProvider, AiProviderRequest } from "../src/types/aiProvider.js";

const assert = (condition: unknown, message: string): void => { if (!condition) throw new Error(message); };
const start = async (provider: AiProvider): Promise<{ base: string; close: () => Promise<void> }> => {
  const app = express(); app.use(express.json()); app.use(createWidgetMessageRouter("key", "mock", provider));
  const server = createServer(app); await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address(); const port = typeof address === "object" && address ? address.port : 0;
  return { base: `http://127.0.0.1:${port}`, close: () => new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve())) };
};
const request = (message: string): RequestInit => ({ method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ channel: "manual_test", conversationId: `invocation-${message.length}`, message, consentAccepted: true }) });

const main = async (): Promise<void> => {
  const captured: Readonly<AiProviderRequest>[] = [];
  const provider: AiProvider = Object.freeze({ mode: "mock", async generate(input) { captured.push(input); return Object.freeze({ text: "synthetic response", provider: "mock" as const, grounded: input.knowledgeContext.entries.length > 0, sourceEntryIds: Object.freeze(input.knowledgeContext.entries.map((entry) => entry.id)) }); } });
  const runtime = await start(provider);
  try {
    const academyMessage = "Busca información en el conocimiento ORBI sobre Academy.";
    const academyResponse = await fetch(`${runtime.base}/api/public/widget/key/message`, request(academyMessage));
    const greetingResponse = await fetch(`${runtime.base}/api/public/widget/key/message`, request("Hola"));
    const identityResponse = await fetch(`${runtime.base}/api/public/widget/key/message`, request("¿Quién eres?"));
    const continuityResponse = await fetch(`${runtime.base}/api/public/widget/key/message`, request("¿Cómo me llamo?"));
    const servicesResponse = await fetch(`${runtime.base}/api/public/widget/key/message`, request("Consulta el conocimiento ORBI sobre Services."));
    const academyBody = await academyResponse.json() as Record<string, unknown>;
    const academy = captured[0]!;
    const prompt = buildQwenLocalPrompt(mapAiProviderRequestToLocalAiProviderRequest(academy, "synthetic", "synthetic"));
    const noInvocation = captured.slice(1, 4);
    const passed = shouldInvokeKnowledgeSearch(academyMessage) && shouldInvokeKnowledgeSearch("Consulta el conocimiento ORBI sobre Services.")
      && !shouldInvokeKnowledgeSearch("Hola") && !shouldInvokeKnowledgeSearch("¿Quién eres?") && !shouldInvokeKnowledgeSearch("¿Cómo me llamo?")
      && academyResponse.status === 200 && servicesResponse.status === 200 && greetingResponse.status === 200 && identityResponse.status === 200 && continuityResponse.status === 200
      && academy.assistantCapabilityContext?.capabilityId === "knowledge-search" && academy.assistantCapabilityContext.status === "success"
      && academy.assistantCapabilityContext.text.length <= 1_200 && academy.assistantCapabilityContext.resultIds.length > 0
      && noInvocation.every((input) => input.assistantCapabilityContext === undefined)
      && captured[4]?.assistantCapabilityContext?.capabilityId === "knowledge-search"
      && prompt.includes("CAPABILITY") && prompt.includes("knowledge-search") && !prompt.includes("CAPABILITY_REQUEST_BLOCKED")
      && academyBody.grounded === true && Array.isArray(academyBody.sourceEntryIds) && academyBody.sourceEntryIds.every((id) => typeof id === "string" && !id.includes("capability") && !id.includes("request"));
    assert(passed, "Controlled Capability Invocation QA: FAIL");
    console.info("Controlled Capability Invocation QA: PASS (Core-driven knowledge-search only; provider receives bounded result without tool authority)");
  } finally { await runtime.close(); }
};

void main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : "Controlled Capability Invocation QA failed."); process.exit(1); });
