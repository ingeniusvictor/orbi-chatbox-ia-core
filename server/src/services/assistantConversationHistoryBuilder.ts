import type { ConversationHistorySnapshot } from "../types/conversationHistory.js";
import type { AssistantConversationHistory, AssistantConversationTurn } from "../types/assistantConversationHistory.js";

export const MAX_ASSISTANT_HISTORY_TURNS = 6;
export const MAX_ASSISTANT_HISTORY_CHARACTERS = 2_500;

export const buildAssistantConversationHistory = (
  snapshot: Readonly<ConversationHistorySnapshot>,
): Readonly<AssistantConversationHistory> => {
  const selected: Readonly<AssistantConversationTurn>[] = [];
  let characters = 0;
  for (let index = snapshot.turns.length - 1; index >= 0 && selected.length < MAX_ASSISTANT_HISTORY_TURNS; index -= 1) {
    const turn = snapshot.turns[index]!;
    if (characters + turn.content.length > MAX_ASSISTANT_HISTORY_CHARACTERS) continue;
    selected.unshift(Object.freeze({ role: turn.role, content: turn.content }));
    characters += turn.content.length;
  }
  return Object.freeze({ turns: Object.freeze(selected.map((turn) => Object.freeze({ ...turn }))) });
};
