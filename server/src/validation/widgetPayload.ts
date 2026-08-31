import type { SandboxErrorCode } from "../security/errorResponses.js";
import type {
  NormalizedWidgetMessageRequest,
  WidgetChannel,
  WidgetMessageRequest,
} from "../types/widget.js";

export type WidgetPayloadValidationResult =
  | { ok: true; payload: NormalizedWidgetMessageRequest }
  | { ok: false; statusCode: number; errorCode: SandboxErrorCode; message: string };

const WIDGET_CHANNELS: readonly WidgetChannel[] = [
  "web_demo",
  "manual_test",
  "whatsapp_future",
];

const isWidgetChannel = (value: unknown): value is WidgetChannel =>
  typeof value === "string" && WIDGET_CHANNELS.includes(value as WidgetChannel);

const invalidBody = (message: string): WidgetPayloadValidationResult => ({
  ok: false,
  statusCode: 400,
  errorCode: "INVALID_JSON_BODY",
  message,
});

export const validateWidgetMessagePayload = (body: unknown): WidgetPayloadValidationResult => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return invalidBody("Request body must be a JSON object.");
  }

  const payload = body as WidgetMessageRequest;

  if (typeof payload.message !== "string" || payload.message.trim().length === 0) {
    return { ok: false, statusCode: 400, errorCode: "INVALID_MESSAGE", message: "Message must be a non-empty string." };
  }
  if (payload.message.length > 2_000) {
    return { ok: false, statusCode: 400, errorCode: "MESSAGE_TOO_LONG", message: "Message must not exceed 2000 characters." };
  }
  if (payload.consentAccepted !== true) {
    return { ok: false, statusCode: 400, errorCode: "CONSENT_REQUIRED", message: "Consent must be accepted in sandbox mode." };
  }
  if (payload.channel !== undefined && !isWidgetChannel(payload.channel)) {
    return invalidBody("Channel must be web_demo, manual_test, or whatsapp_future.");
  }
  if (payload.visitorId !== undefined && (typeof payload.visitorId !== "string" || payload.visitorId.length > 120)) {
    return invalidBody("Visitor ID must be a string with at most 120 characters.");
  }
  if (payload.conversationId !== undefined && (typeof payload.conversationId !== "string" || payload.conversationId.trim().length === 0 || payload.conversationId.length > 120)) {
    return invalidBody("Conversation ID must be a non-empty string with at most 120 characters.");
  }
  if (payload.pageUrl !== undefined && (typeof payload.pageUrl !== "string" || payload.pageUrl.length > 500)) {
    return invalidBody("Page URL must be a string with at most 500 characters.");
  }
  if (payload.timestamp !== undefined && (typeof payload.timestamp !== "string" || payload.timestamp.length > 80)) {
    return invalidBody("Timestamp must be a string with at most 80 characters.");
  }

  return {
    ok: true,
    payload: {
      channel: isWidgetChannel(payload.channel) ? payload.channel : "manual_test",
      visitorId: payload.visitorId ?? "anonymous-local-sandbox-visitor",
      conversationId: payload.conversationId?.trim(),
      message: payload.message.trim(),
      pageUrl: payload.pageUrl ?? "unknown-local-page",
      consentAccepted: true,
      timestamp: payload.timestamp ?? new Date().toISOString(),
    },
  };
};
