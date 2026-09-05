import type { ChannelId } from "./channelMessage.js";

export type ExternalConversationKey = Readonly<{
  channel: ChannelId;
  externalConversationId: string;
}>;

export type InternalConversationRef = Readonly<{
  conversationId: string;
}>;

export type ConversationCorrelationStatus = "preserved" | "resolved" | "created" | "released" | "not-applicable";

export type ConversationCorrelationResult = Readonly<{
  status: ConversationCorrelationStatus;
  internalRef?: InternalConversationRef;
}>;

export type ConversationCorrelationErrorCode =
  | "CORRELATION_KEY_INVALID"
  | "CORRELATION_CONFLICT"
  | "CORRELATION_CAPACITY_REACHED"
  | "CONVERSATION_ID_CREATION_FAILED";

export class ConversationCorrelationError extends Error {
  constructor(readonly code: ConversationCorrelationErrorCode, message: string) {
    super(message);
    this.name = "ConversationCorrelationError";
  }
}

export interface ConversationCorrelationStore {
  resolve(externalKey: Readonly<ExternalConversationKey>): InternalConversationRef | undefined;
  bind(externalKey: Readonly<ExternalConversationKey>, internalRef: Readonly<InternalConversationRef>): InternalConversationRef;
  /** Removes only this ephemeral correlation; it never removes ORBI conversation history. */
  release(externalKey: Readonly<ExternalConversationKey>): boolean;
}
