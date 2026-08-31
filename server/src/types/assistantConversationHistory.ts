export type AssistantConversationTurn = {
  readonly role: "user" | "assistant";
  readonly content: string;
};

/** Provider-neutral projection of previous ephemeral conversation turns. */
export type AssistantConversationHistory = {
  readonly turns: readonly Readonly<AssistantConversationTurn>[];
};
