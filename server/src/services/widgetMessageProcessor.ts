import { randomUUID } from "node:crypto";
import type {
  NormalizedWidgetMessageRequest,
  WidgetMessageProcessingResult,
} from "../types/widget.js";

export const processValidatedWidgetMessage = (
  input: NormalizedWidgetMessageRequest,
): WidgetMessageProcessingResult => {
  const normalizedMessage = input.message.trim();

  return {
    requestId: randomUUID(),
    channel: input.channel,
    normalizedMessage,
    messageLength: normalizedMessage.length,
    consentAccepted: true,
    receivedAt: new Date().toISOString(),
    processingMode: "sandbox",
    intent: "unclassified",
  };
};
