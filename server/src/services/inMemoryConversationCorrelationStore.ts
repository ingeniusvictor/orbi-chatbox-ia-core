import { CHANNEL_IDS } from "../types/channelMessage.js";
import { ConversationCorrelationError, type ConversationCorrelationStore, type ExternalConversationKey, type InternalConversationRef } from "../types/conversationCorrelation.js";

const MAX_EXTERNAL_CONVERSATION_ID_LENGTH = 120;
export const DEFAULT_MAX_CORRELATION_ENTRIES = 100;

const storageKeyFor = (externalKey: Readonly<ExternalConversationKey>): string => {
  const externalConversationId = externalKey.externalConversationId.trim();
  if (!CHANNEL_IDS.includes(externalKey.channel) || !externalConversationId || externalConversationId.length > MAX_EXTERNAL_CONVERSATION_ID_LENGTH) {
    throw new ConversationCorrelationError("CORRELATION_KEY_INVALID", "External conversation key is invalid.");
  }
  // The channel prefix makes same-valued external IDs independent by design.
  return `${externalKey.channel}\u0000${externalConversationId}`;
};

/** Process-local, ephemeral, non-production-only reference implementation. */
export class InMemoryConversationCorrelationStore implements ConversationCorrelationStore {
  private readonly references = new Map<string, InternalConversationRef>();

  constructor(private readonly maxEntries = DEFAULT_MAX_CORRELATION_ENTRIES) {
    if (!Number.isSafeInteger(maxEntries) || maxEntries < 1 || maxEntries > 10_000) {
      throw new ConversationCorrelationError("CORRELATION_KEY_INVALID", "Correlation capacity is invalid.");
    }
  }

  resolve(externalKey: Readonly<ExternalConversationKey>): InternalConversationRef | undefined {
    return this.references.get(storageKeyFor(externalKey));
  }

  bind(externalKey: Readonly<ExternalConversationKey>, internalRef: Readonly<InternalConversationRef>): InternalConversationRef {
    const key = storageKeyFor(externalKey);
    const existing = this.references.get(key);
    if (existing && existing.conversationId !== internalRef.conversationId) {
      throw new ConversationCorrelationError("CORRELATION_CONFLICT", "External conversation is already bound.");
    }
    if (existing) return existing;
    const conversationId = internalRef.conversationId.trim();
    if (!conversationId || conversationId.length > 120) {
      throw new ConversationCorrelationError("CORRELATION_KEY_INVALID", "Internal conversation ID is invalid.");
    }
    if (this.references.size >= this.maxEntries) {
      throw new ConversationCorrelationError("CORRELATION_CAPACITY_REACHED", "Correlation capacity is reached.");
    }
    const safeRef = Object.freeze({ conversationId });
    this.references.set(key, safeRef);
    return safeRef;
  }

  release(externalKey: Readonly<ExternalConversationKey>): boolean {
    return this.references.delete(storageKeyFor(externalKey));
  }
}
