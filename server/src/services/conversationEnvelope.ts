import { randomUUID } from "node:crypto";
import type { ConversationEnvelope } from "../types/conversation.js";
import type { KnowledgeContext } from "../types/knowledge.js";
import type {
  NormalizedWidgetMessageRequest,
  WidgetMessageProcessingResult,
} from "../types/widget.js";

export const buildConversationEnvelope = (
  input: NormalizedWidgetMessageRequest,
  processed: WidgetMessageProcessingResult,
  knowledgeContext: Readonly<KnowledgeContext>,
): ConversationEnvelope => ({
  requestId: processed.requestId,
  conversationId: input.conversationId ?? randomUUID(),
  source: {
    visitorId: input.visitorId,
    channel: processed.channel,
    pageUrl: input.pageUrl,
    originalTimestamp: input.timestamp,
  },
  message: {
    text: processed.normalizedMessage,
    length: processed.messageLength,
  },
  runtime: {
    mode: processed.processingMode,
    intent: processed.intent,
    receivedAt: processed.receivedAt,
  },
  knowledgeContext,
});
