import type { ConversationHistorySnapshot } from "../types/conversationHistory.js";
import type { ConversationTurn } from "../types/conversationTurn.js";
import { validateConversationTurn } from "./conversationTurn.js";

export const MAX_CONVERSATION_HISTORY_TURNS = 8;
export const MAX_CONVERSATION_HISTORY_CHARACTERS = 6_000;

export class EphemeralConversationHistoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EphemeralConversationHistoryError";
  }
}

const histories = new Map<string, readonly Readonly<ConversationTurn>[]>();

const copyTurn = (turn: Readonly<ConversationTurn>): Readonly<ConversationTurn> => Object.freeze({ ...turn });
const characterCount = (turns: readonly Readonly<ConversationTurn>[]): number => turns.reduce((total, turn) => total + turn.content.length, 0);

const snapshot = (conversationId: string, turns: readonly Readonly<ConversationTurn>[] = []): Readonly<ConversationHistorySnapshot> => {
  const copiedTurns = Object.freeze(turns.map(copyTurn));
  return Object.freeze({ conversationId, turns: copiedTurns, turnCount: copiedTurns.length });
};

export const appendConversationTurn = (turn: Readonly<ConversationTurn>): Readonly<ConversationHistorySnapshot> => {
  if (!validateConversationTurn(turn)) throw new EphemeralConversationHistoryError("Conversation turn is invalid.");
  const existing = histories.get(turn.conversationId) ?? [];
  const expectedSequence = existing.length === 0 ? 1 : existing[existing.length - 1]!.sequence + 1;
  if (turn.sequence !== expectedSequence) throw new EphemeralConversationHistoryError("Conversation turn sequence must be contiguous.");

  const retained = [...existing, copyTurn(turn)];
  while (retained.length > MAX_CONVERSATION_HISTORY_TURNS || characterCount(retained) > MAX_CONVERSATION_HISTORY_CHARACTERS) {
    retained.shift();
  }
  const stored = Object.freeze(retained.map(copyTurn));
  histories.set(turn.conversationId, stored);
  return snapshot(turn.conversationId, stored);
};

export const getConversationHistory = (conversationId: string): Readonly<ConversationHistorySnapshot> =>
  snapshot(conversationId, histories.get(conversationId));

export const clearConversationHistory = (conversationId: string): boolean => histories.delete(conversationId);
