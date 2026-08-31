import type { ConversationTurn } from "./conversationTurn.js";

/** Copy-safe view of one in-process conversation; no store internals are exposed. */
export type ConversationHistorySnapshot = {
  readonly conversationId: string;
  readonly turns: readonly Readonly<ConversationTurn>[];
  readonly turnCount: number;
};
