export type ConversationTurnRole = "user" | "assistant";

/** A bounded in-process turn contract; it has no persistence or history ownership. */
export type ConversationTurn = {
  readonly id: string;
  readonly conversationId: string;
  readonly role: ConversationTurnRole;
  readonly content: string;
  readonly sequence: number;
};

export type ConversationTurnInput = {
  readonly conversationId: string;
  readonly role: ConversationTurnRole;
  readonly content: string;
  readonly sequence: number;
};
