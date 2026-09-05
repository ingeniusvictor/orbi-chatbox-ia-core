import type { ChannelAdapter } from "../types/channelAdapter.js";
import type { InboundChannelMessage, OutboundChannelResponse } from "../types/channelMessage.js";
import type { WhatsAppRuntimeConfig } from "../config/whatsappRuntimeConfig.js";
import { parseWhatsAppWebhookEnvelope, type WhatsAppWebhookEnvelope } from "../channels/whatsapp/whatsappWebhookEnvelope.js";
import type { WhatsAppInboundTextEvent } from "../channels/whatsapp/whatsappInboundText.js";

/**
 * WhatsApp owns Meta translation. Its output is a neutral, bounded channel
 * message; provider identifiers never become ORBI identities.
 */
export class WhatsAppChannelAdapter implements ChannelAdapter<unknown, never> {
  readonly channel = "whatsapp" as const;
  readonly capabilities = Object.freeze({ textInbound: true, textOutbound: false, voiceInbound: false, voiceOutbound: false });
  readonly status = "inbound-foundation" as const;

  constructor(private readonly runtimeConfig: WhatsAppRuntimeConfig) {}

  get readiness() { return this.runtimeConfig.readiness; }
  validateWebhookEnvelope(input: unknown): WhatsAppWebhookEnvelope | undefined { return parseWhatsAppWebhookEnvelope(input); }
  normalizeInbound(input: WhatsAppInboundTextEvent): Readonly<InboundChannelMessage> {
    if (!input || typeof input !== "object" || !input.text || !input.providerMessageId || !input.externalUserId || !input.externalConversationId) throw new Error("WhatsApp inbound text is invalid.");
    return Object.freeze({ channel: "whatsapp", externalConversationId: input.externalConversationId, externalUserId: input.externalUserId, externalMessageId: input.providerMessageId, messageType: "text", text: input.text, receivedAt: input.receivedAt });
  }
  formatOutbound(_response: Readonly<OutboundChannelResponse>): never { throw new Error("WhatsApp outbound delivery is not implemented in A.2."); }
}
