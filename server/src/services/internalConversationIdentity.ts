import { randomUUID } from "node:crypto";
import { ConversationCorrelationError, type InternalConversationRef } from "../types/conversationCorrelation.js";

const MAX_CONVERSATION_ID_LENGTH = 120;

export const createInternalConversationRef = (): InternalConversationRef => {
  try {
    // This preserves the existing ORBI convention: opaque UUID conversation IDs.
    return Object.freeze({ conversationId: randomUUID() });
  } catch {
    throw new ConversationCorrelationError("CONVERSATION_ID_CREATION_FAILED", "Internal conversation ID is unavailable.");
  }
};

export const toInternalConversationRef = (conversationId: string): InternalConversationRef => {
  const normalized = conversationId.trim();
  if (!normalized || normalized.length > MAX_CONVERSATION_ID_LENGTH) {
    throw new ConversationCorrelationError("CORRELATION_KEY_INVALID", "Internal conversation ID is invalid.");
  }
  return Object.freeze({ conversationId: normalized });
};
