import { createConversationTurn } from "../src/services/conversationTurn.js";
import { appendConversationTurn, clearConversationHistory, EphemeralConversationHistoryError, getConversationHistory, MAX_CONVERSATION_HISTORY_CHARACTERS, MAX_CONVERSATION_HISTORY_TURNS } from "../src/services/ephemeralConversationHistory.js";

const assert = (condition: unknown, message: string): void => { if (!condition) throw new Error(message); };
const turn = (conversationId: string, role: "user" | "assistant", content: string, sequence: number) => createConversationTurn({ conversationId, role, content, sequence });
const rejects = (candidate: ReturnType<typeof turn>): boolean => { try { appendConversationTurn(candidate); return false; } catch (error) { return error instanceof EphemeralConversationHistoryError; } };

const main = (): void => {
  const primary = "history-qa-primary";
  const isolated = "history-qa-isolated";
  const counted = "history-qa-counted";
  const bounded = "history-qa-bounded";
  const empty = getConversationHistory(primary);
  const first = appendConversationTurn(turn(primary, "user", "Hello", 1));
  const second = appendConversationTurn(turn(primary, "assistant", "Hello from LUMI", 2));
  const isolation = appendConversationTurn(turn(isolated, "user", "Other conversation", 1));
  const duplicate = rejects(turn(primary, "user", "duplicate", 2));
  const skipped = rejects(turn(primary, "user", "skipped", 4));
  const outOfOrder = rejects(turn(primary, "user", "old", 1));
  for (let sequence = 1; sequence <= MAX_CONVERSATION_HISTORY_TURNS + 1; sequence += 1) appendConversationTurn(turn(counted, sequence % 2 === 1 ? "user" : "assistant", `turn-${sequence}`, sequence));
  const countSnapshot = getConversationHistory(counted);
  appendConversationTurn(turn(bounded, "user", "x".repeat(3_100), 1));
  const charSnapshot = appendConversationTurn(turn(bounded, "assistant", "y".repeat(3_100), 2));
  const cleared = clearConversationHistory(primary);
  const clearedUnknown = clearConversationHistory("history-qa-unknown");
  const passed = empty.turnCount === 0
    && first.turnCount === 1
    && second.turns.map((item) => item.sequence).join(",") === "1,2"
    && duplicate && skipped && outOfOrder
    && isolation.turnCount === 1
    && getConversationHistory(isolated).turns[0]?.content === "Other conversation"
    && countSnapshot.turnCount === MAX_CONVERSATION_HISTORY_TURNS
    && countSnapshot.turns[0]?.sequence === 2
    && charSnapshot.turnCount === 1
    && charSnapshot.turns[0]?.sequence === 2
    && charSnapshot.turns[0]?.content.length === 3_100
    && charSnapshot.turns.reduce((total, item) => total + item.content.length, 0) <= MAX_CONVERSATION_HISTORY_CHARACTERS
    && Object.isFrozen(charSnapshot) && Object.isFrozen(charSnapshot.turns) && Object.isFrozen(charSnapshot.turns[0])
    && cleared && !clearedUnknown && getConversationHistory(primary).turnCount === 0
    && getConversationHistory(isolated).turnCount === 1;
  assert(passed, "Ephemeral Conversation History QA: FAIL");
  console.info("Ephemeral Conversation History QA: PASS (bounded in-memory store only; no provider integration or persistence)");
};

main();
