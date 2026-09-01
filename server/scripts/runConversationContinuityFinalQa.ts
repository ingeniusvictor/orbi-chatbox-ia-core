import { createServer } from "node:http";
import express from "express";
import { buildAssistantConversationHistory, MAX_ASSISTANT_HISTORY_CHARACTERS, MAX_ASSISTANT_HISTORY_TURNS } from "../src/services/assistantConversationHistoryBuilder.js";
import { createConversationTurn } from "../src/services/conversationTurn.js";
import { appendConversationTurn, clearConversationHistory, EphemeralConversationHistoryError, getConversationHistory, MAX_CONVERSATION_HISTORY_CHARACTERS, MAX_CONVERSATION_HISTORY_TURNS } from "../src/services/ephemeralConversationHistory.js";
import { QwenLocalProviderError } from "../src/providers/qwenLocalProvider.js";
import { createWidgetMessageRouter } from "../src/routes/widgetMessage.js";
import type { AiProvider, AiProviderRequest } from "../src/types/aiProvider.js";

const assert = (condition: unknown, message: string): void => { if (!condition) throw new Error(message); };
const makeTurn = (conversationId: string, sequence: number, content = `turn-${sequence}`) => createConversationTurn({ conversationId, role: sequence % 2 === 1 ? "user" : "assistant", content, sequence });
const start = async (provider: AiProvider): Promise<{ base: string; close: () => Promise<void> }> => {
  const app = express(); app.use(express.json()); app.use(createWidgetMessageRouter("key", "mock", provider));
  const server = createServer(app); await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address(); const port = typeof address === "object" && address ? address.port : 0;
  return { base: `http://127.0.0.1:${port}`, close: () => new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve())) };
};
const request = (conversationId: string, message: string): RequestInit => ({ method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ channel: "manual_test", conversationId, message, consentAccepted: true }) });

const main = async (): Promise<void> => {
  const countId = "continuity-final-count";
  const characterId = "continuity-final-character";
  for (let sequence = 1; sequence <= MAX_CONVERSATION_HISTORY_TURNS + 1; sequence += 1) appendConversationTurn(makeTurn(countId, sequence));
  appendConversationTurn(makeTurn(characterId, 1, "x".repeat(3_100)));
  appendConversationTurn(makeTurn(characterId, 2, "y".repeat(3_100)));
  const countSnapshot = getConversationHistory(countId);
  const characterSnapshot = getConversationHistory(characterId);
  const providerWindow = buildAssistantConversationHistory(countSnapshot);

  const captured: Readonly<AiProviderRequest>[] = [];
  let reply = 0;
  const provider: AiProvider = Object.freeze({ mode: "mock", async generate(input) {
    captured.push(input); reply += 1;
    return Object.freeze({ text: `reply-${reply}`, provider: "mock" as const, grounded: input.knowledgeContext.entries.length > 0, sourceEntryIds: Object.freeze(input.knowledgeContext.entries.map((entry) => entry.id)) });
  } });
  const failing: AiProvider = Object.freeze({ mode: "mock", async generate() { throw new QwenLocalProviderError("LOCAL_AI_RUNTIME_UNAVAILABLE"); } });
  const runtime = await start(provider);
  const failureRuntime = await start(failing);
  const conversationA = "continuity-final-a";
  const conversationB = "continuity-final-b";
  const conversationC = "continuity-final-c";
  const failureId = "continuity-final-failure";
  try {
    const firstA = await fetch(`${runtime.base}/api/public/widget/key/message`, request(conversationA, "My project code is ALPHA."));
    const secondA = await fetch(`${runtime.base}/api/public/widget/key/message`, request(conversationA, "What is my project code?"));
    const firstB = await fetch(`${runtime.base}/api/public/widget/key/message`, request(conversationB, "My project code is BETA."));
    const firstC = await fetch(`${runtime.base}/api/public/widget/key/message`, request(conversationC, "What is my project code?"));
    const knowledge = await fetch(`${runtime.base}/api/public/widget/key/message`, request(conversationA, "ORBI Core Knowledge"));
    const failed = await fetch(`${failureRuntime.base}/api/public/widget/key/message`, request(failureId, "must not persist"));
    const [firstABody, secondABody, knowledgeBody] = await Promise.all([firstA.json(), secondA.json(), knowledge.json()]) as [Record<string, unknown>, Record<string, unknown>, Record<string, unknown>];
    const aBeforeClear = getConversationHistory(conversationA);
    const bBeforeClear = getConversationHistory(conversationB);
    const cBeforeClear = getConversationHistory(conversationC);
    const clearedA = clearConversationHistory(conversationA);
    const historyForSecondA = captured[1]?.conversationHistory;
    const passed = countSnapshot.turnCount === MAX_CONVERSATION_HISTORY_TURNS
      && countSnapshot.turns[0]?.sequence === 2 && countSnapshot.turns.at(-1)?.sequence === 9
      && characterSnapshot.turnCount === 1 && characterSnapshot.turns[0]?.sequence === 2
      && characterSnapshot.turns.reduce((total, turn) => total + turn.content.length, 0) <= MAX_CONVERSATION_HISTORY_CHARACTERS
      && providerWindow.turns.length <= MAX_ASSISTANT_HISTORY_TURNS && providerWindow.turns.reduce((total, turn) => total + turn.content.length, 0) <= MAX_ASSISTANT_HISTORY_CHARACTERS
      && providerWindow.turns.map((turn) => turn.content).join(",") === countSnapshot.turns.slice(-MAX_ASSISTANT_HISTORY_TURNS).map((turn) => turn.content).join(",")
      && firstA.status === 200 && secondA.status === 200 && firstB.status === 200 && firstC.status === 200
      && historyForSecondA?.turns.map((turn) => turn.content).join(",") === "My project code is ALPHA.,reply-1"
      && !historyForSecondA?.turns.some((turn) => turn.content === "What is my project code?")
      && historyForSecondA?.turns.every((turn) => Object.keys(turn).join(",") === "role,content")
      && aBeforeClear.turnCount === 6 && bBeforeClear.turnCount === 2 && cBeforeClear.turnCount === 2
      && clearedA && getConversationHistory(conversationA).turnCount === 0 && getConversationHistory(conversationB).turnCount === 2 && getConversationHistory(conversationC).turnCount === 2
      && failed.status === 503 && getConversationHistory(failureId).turnCount === 0
      && firstABody.grounded === false && Array.isArray(firstABody.sourceEntryIds) && firstABody.sourceEntryIds.length === 0
      && secondABody.grounded === false && Array.isArray(secondABody.sourceEntryIds) && secondABody.sourceEntryIds.length === 0
      && knowledgeBody.grounded === true && Array.isArray(knowledgeBody.sourceEntryIds) && knowledgeBody.sourceEntryIds.includes("core-assistant-overview")
      && !knowledgeBody.sourceEntryIds.includes(aBeforeClear.turns[0]?.id);
    assert(passed, "Conversation Continuity Final QA: FAIL");
    console.info("Conversation Continuity Final QA: PASS (bounded ephemeral continuity only; no persistence or grounding from history)");
  } finally { await Promise.all([runtime.close(), failureRuntime.close()]); }
};

void main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : "Conversation Continuity Final QA failed."); process.exit(1); });
