import { randomUUID } from "node:crypto";
import type { ConversationTurn, ConversationTurnInput, ConversationTurnRole } from "../types/conversationTurn.js";

export const MAX_CONVERSATION_TURN_CHARACTERS = 4_000;

export class ConversationTurnValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConversationTurnValidationError";
  }
}

const isRole = (value: unknown): value is ConversationTurnRole => value === "user" || value === "assistant";

const validateInput = (input: Readonly<ConversationTurnInput>): void => {
  if (input.conversationId.trim().length === 0) throw new ConversationTurnValidationError("Conversation ID is required.");
  if (!isRole(input.role)) throw new ConversationTurnValidationError("Conversation turn role is invalid.");
  const content = input.content.trim();
  if (!content) throw new ConversationTurnValidationError("Conversation turn content is required.");
  if (content.length > MAX_CONVERSATION_TURN_CHARACTERS) throw new ConversationTurnValidationError("Conversation turn content exceeds the maximum length.");
  if (!Number.isSafeInteger(input.sequence) || input.sequence < 1) throw new ConversationTurnValidationError("Conversation turn sequence must be a positive integer.");
};

export const createConversationTurn = (input: Readonly<ConversationTurnInput>): Readonly<ConversationTurn> => {
  validateInput(input);
  return Object.freeze({
    id: randomUUID(),
    conversationId: input.conversationId.trim(),
    role: input.role,
    content: input.content.trim(),
    sequence: input.sequence,
  });
};

export const validateConversationTurn = (turn: Readonly<ConversationTurn>): boolean => {
  try {
    if (!turn.id.trim()) return false;
    validateInput(turn);
    return true;
  } catch {
    return false;
  }
};
