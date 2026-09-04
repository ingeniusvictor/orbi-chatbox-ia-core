import type { ChannelAdapter } from "../types/channelAdapter.js";
import { validateInboundChannelMessage, validateOutboundChannelResponse, type InboundChannelMessage, type OutboundChannelResponse } from "../types/channelMessage.js";

export type WebReferenceInbound = Readonly<{ text: string; externalConversationId?: string; externalUserId?: string; externalMessageId?: string; receivedAt?: string; pageUrl?: string }>;
export type WebReferenceOutbound = Readonly<{ text: string; conversationId: string; createdAt: string; grounded?: boolean }>;

export const webChannelAdapter: ChannelAdapter<WebReferenceInbound, WebReferenceOutbound> = Object.freeze({
  channel: "web",
  capabilities: Object.freeze({ textInbound: true, textOutbound: true, voiceInbound: true, voiceOutbound: true }),
  status: "implemented",
  normalizeInbound: (input): Readonly<InboundChannelMessage> => validateInboundChannelMessage({ channel: "web", externalConversationId: input.externalConversationId, externalUserId: input.externalUserId, externalMessageId: input.externalMessageId, messageType: "text", text: input.text, receivedAt: input.receivedAt ?? new Date().toISOString(), metadata: input.pageUrl ? { pageUrl: input.pageUrl } : undefined }),
  formatOutbound: (response): WebReferenceOutbound => {
    const safe = validateOutboundChannelResponse(response);
    if (safe.channel !== "web") throw new Error("Web adapter can only format web responses.");
    return Object.freeze({ text: safe.text, conversationId: safe.conversationId, createdAt: safe.createdAt, ...(safe.metadata?.grounded !== undefined ? { grounded: safe.metadata.grounded } : {}) });
  },
});
