import type { WidgetChannel } from "./widget.js";
import type { KnowledgeContext } from "./knowledge.js";

export type ConversationEnvelope = {
  requestId: string;
  /** Local-only identifier for this request; it is never persisted. */
  conversationId: string;
  source: {
    visitorId: string;
    channel: WidgetChannel;
    pageUrl: string;
    originalTimestamp: string;
  };
  message: {
    text: string;
    length: number;
  };
  runtime: {
    mode: "sandbox";
    intent: "unclassified";
    receivedAt: string;
  };
  knowledgeContext: Readonly<KnowledgeContext>;
};
