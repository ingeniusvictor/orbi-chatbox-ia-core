import { createServer } from "node:http";
import express from "express";
import { getConversationHistory } from "../src/services/ephemeralConversationHistory.js";
import { mapAiProviderRequestToLocalAiProviderRequest } from "../src/services/localAiProviderMapper.js";
import { buildQwenLocalPrompt } from "../src/services/qwenLocalPromptBuilder.js";
import { createWidgetMessageRouter } from "../src/routes/widgetMessage.js";
import { QwenLocalProviderError } from "../src/providers/qwenLocalProvider.js";
import type { AiProvider, AiProviderRequest } from "../src/types/aiProvider.js";

const assert = (condition: unknown, message: string): void => { if (!condition) throw new Error(message); };
const start = async (provider: AiProvider): Promise<{ base: string; close: () => Promise<void> }> => {
  const app = express(); app.use(express.json()); app.use(createWidgetMessageRouter("key", "mock", provider));
  const server = createServer(app); await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address(); const port = typeof address === "object" && address ? address.port : 0;
  return { base: `http://127.0.0.1:${port}`, close: () => new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve())) };
};
const request = (conversationId: string, message: string): RequestInit => ({ method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ channel: "manual_test", conversationId, message, consentAccepted: true }) });

const main = async (): Promise<void> => {
  const captured: Readonly<AiProviderRequest>[] = [];
  let responseNumber = 0;
  const provider: AiProvider = Object.freeze({ mode: "mock", async generate(input) {
    captured.push(input); responseNumber += 1;
    return Object.freeze({ text: `synthetic assistant ${responseNumber}`, provider: "mock" as const, grounded: input.knowledgeContext.entries.length > 0, sourceEntryIds: Object.freeze(input.knowledgeContext.entries.map((entry) => entry.id)) });
  } });
  const failingProvider: AiProvider = Object.freeze({ mode: "mock", async generate() { throw new QwenLocalProviderError("LOCAL_AI_RUNTIME_UNAVAILABLE"); } });
  const runtime = await start(provider);
  const failedRuntime = await start(failingProvider);
  const conversationA = "runtime-qa-a";
  const conversationB = "runtime-qa-b";
  const failedConversation = "runtime-qa-failed";
  try {
    const emptyBefore = getConversationHistory(conversationA);
    const firstResponse = await fetch(`${runtime.base}/api/public/widget/key/message`, request(conversationA, "Mi nombre es Pedro."));
    const firstBody = await firstResponse.json() as Record<string, unknown>;
    const afterFirst = getConversationHistory(conversationA);
    const secondResponse = await fetch(`${runtime.base}/api/public/widget/key/message`, request(conversationA, "¿Cómo me llamo?"));
    const secondBody = await secondResponse.json() as Record<string, unknown>;
    const afterSecond = getConversationHistory(conversationA);
    const isolatedResponse = await fetch(`${runtime.base}/api/public/widget/key/message`, request(conversationB, "¿Cómo me llamo?"));
    const afterIsolated = getConversationHistory(conversationB);
    const knowledgeResponse = await fetch(`${runtime.base}/api/public/widget/key/message`, request(conversationA, "ORBI Core Knowledge"));
    const knowledgeBody = await knowledgeResponse.json() as Record<string, unknown>;
    const failedResponse = await fetch(`${failedRuntime.base}/api/public/widget/key/message`, request(failedConversation, "Do not store this."));
    const promptWithHistory = buildQwenLocalPrompt(mapAiProviderRequestToLocalAiProviderRequest(captured[1]!, "synthetic", "synthetic"));
    const promptWithoutHistory = buildQwenLocalPrompt(mapAiProviderRequestToLocalAiProviderRequest(captured[0]!, "synthetic", "synthetic"));
    const historyWindow = captured[1]?.conversationHistory;
    const passed = emptyBefore.turnCount === 0
      && firstResponse.status === 200 && afterFirst.turns.map((turn) => turn.sequence).join(",") === "1,2"
      && captured[0]?.conversationHistory?.turns.length === 0
      && secondResponse.status === 200 && historyWindow?.turns.map((turn) => turn.content).join(",") === "Mi nombre es Pedro.,synthetic assistant 1"
      && !historyWindow?.turns.some((turn) => turn.content === "¿Cómo me llamo?")
      && afterSecond.turns.map((turn) => turn.sequence).join(",") === "1,2,3,4"
      && afterSecond.turns.filter((turn) => turn.content === "synthetic assistant 2").length === 1
      && isolatedResponse.status === 200 && afterIsolated.turnCount === 2 && captured[2]?.conversationHistory?.turns.length === 0
      && failedResponse.status === 503 && getConversationHistory(failedConversation).turnCount === 0
      && promptWithHistory.includes("CONVERSATION\nUse prior turns to answer details") && promptWithHistory.includes("User: Mi nombre es Pedro.") && !promptWithoutHistory.includes("CONVERSATION")
      && (historyWindow?.turns.length ?? 0) <= 6 && (historyWindow?.turns.reduce((total, turn) => total + turn.content.length, 0) ?? 0) <= 2_500
      && firstBody.grounded === false && Array.isArray(firstBody.sourceEntryIds) && firstBody.sourceEntryIds.length === 0
      && secondBody.grounded === false && Array.isArray(secondBody.sourceEntryIds) && secondBody.sourceEntryIds.length === 0
      && knowledgeResponse.status === 200 && knowledgeBody.grounded === true && Array.isArray(knowledgeBody.sourceEntryIds) && knowledgeBody.sourceEntryIds.includes("core-assistant-overview")
      && !knowledgeBody.sourceEntryIds.includes(afterSecond.turns[0]?.id);
    assert(passed, "Conversation Runtime Integration QA: FAIL");
    console.info("Conversation Runtime Integration QA: PASS (previous turns only, bounded provider history, completed exchanges only)");
  } finally { await Promise.all([runtime.close(), failedRuntime.close()]); }
};

void main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : "Conversation Runtime Integration QA failed."); process.exit(1); });
