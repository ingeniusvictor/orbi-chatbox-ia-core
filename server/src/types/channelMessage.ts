export const CHANNEL_IDS = ["web", "widget", "whatsapp", "internal"] as const;
export type ChannelId = (typeof CHANNEL_IDS)[number];

export const CHANNEL_MESSAGE_TYPES = ["text", "voice-transcript"] as const;
export type ChannelMessageType = (typeof CHANNEL_MESSAGE_TYPES)[number];

export const CHANNEL_RESPONSE_TYPES = ["text"] as const;
export type ChannelResponseType = (typeof CHANNEL_RESPONSE_TYPES)[number];

export type ChannelMessageMetadata = Readonly<{
  locale?: "es";
  pageUrl?: string;
}>;

export type ChannelResponseMetadata = Readonly<{
  grounded?: boolean;
  sourceEntryIds?: readonly string[];
  provider?: "mock" | "qwen-local";
  requestId?: string;
  normalizedMessage?: string;
  messageLength?: number;
  processingMode?: "sandbox";
  intent?: "unclassified";
  knowledge?: Readonly<{ source: "local-static"; matchCount: number; truncated: boolean }>;
}>;

/** External identifiers are adapter metadata only; they are never ORBI user identities. */
export type InboundChannelMessage = Readonly<{
  channel: ChannelId;
  externalConversationId?: string;
  externalUserId?: string;
  externalMessageId?: string;
  messageType: ChannelMessageType;
  text: string;
  receivedAt: string;
  metadata?: ChannelMessageMetadata;
}>;

export type OutboundChannelResponse = Readonly<{
  channel: ChannelId;
  conversationId: string;
  responseType: ChannelResponseType;
  text: string;
  createdAt: string;
  metadata?: ChannelResponseMetadata;
}>;

export type ChannelCapabilities = Readonly<{
  textInbound: boolean;
  textOutbound: boolean;
  voiceInbound: boolean;
  voiceOutbound: boolean;
}>;

export type ChannelImplementationStatus = "implemented" | "planned" | "disabled";
export type ChannelRuntimeAvailability = "available" | "unavailable" | "disabled";

export type ChannelDescriptor = Readonly<{
  channel: ChannelId;
  capabilities: ChannelCapabilities;
  status: ChannelImplementationStatus;
  availability: ChannelRuntimeAvailability;
}>;

export const CHANNEL_DESCRIPTORS: readonly ChannelDescriptor[] = Object.freeze([
  { channel: "web", capabilities: { textInbound: true, textOutbound: true, voiceInbound: true, voiceOutbound: true }, status: "implemented", availability: "available" },
  { channel: "widget", capabilities: { textInbound: true, textOutbound: true, voiceInbound: false, voiceOutbound: false }, status: "implemented", availability: "available" },
  { channel: "whatsapp", capabilities: { textInbound: false, textOutbound: false, voiceInbound: false, voiceOutbound: false }, status: "planned", availability: "unavailable" },
  { channel: "internal", capabilities: { textInbound: true, textOutbound: true, voiceInbound: false, voiceOutbound: false }, status: "disabled", availability: "disabled" },
]);

export class ChannelMessageValidationError extends Error {
  constructor(message: string) { super(message); this.name = "ChannelMessageValidationError"; }
}

const isBoundedId = (value: string | undefined): boolean => value === undefined || (value.trim().length > 0 && value.length <= 120);

export const validateInboundChannelMessage = (input: Readonly<InboundChannelMessage>): Readonly<InboundChannelMessage> => {
  if (!CHANNEL_IDS.includes(input.channel)) throw new ChannelMessageValidationError("Channel is invalid.");
  if (!CHANNEL_MESSAGE_TYPES.includes(input.messageType)) throw new ChannelMessageValidationError("Message type is invalid.");
  if (!input.text.trim() || input.text.length > 2_000) throw new ChannelMessageValidationError("Channel message text is invalid.");
  if (!Number.isFinite(Date.parse(input.receivedAt))) throw new ChannelMessageValidationError("Received timestamp is invalid.");
  if (![input.externalConversationId, input.externalUserId, input.externalMessageId].every(isBoundedId)) throw new ChannelMessageValidationError("External channel identifiers are invalid.");
  if (input.metadata?.pageUrl !== undefined && input.metadata.pageUrl.length > 500) throw new ChannelMessageValidationError("Channel page URL is invalid.");
  return Object.freeze({ ...input, text: input.text.trim(), metadata: input.metadata ? Object.freeze({ ...input.metadata }) : undefined });
};

export const validateOutboundChannelResponse = (input: Readonly<OutboundChannelResponse>): Readonly<OutboundChannelResponse> => {
  if (!CHANNEL_IDS.includes(input.channel)) throw new ChannelMessageValidationError("Response channel is invalid.");
  if (!CHANNEL_RESPONSE_TYPES.includes(input.responseType)) throw new ChannelMessageValidationError("Response type is invalid.");
  if (!input.conversationId.trim() || !input.text.trim() || !Number.isFinite(Date.parse(input.createdAt))) throw new ChannelMessageValidationError("Channel response is invalid.");
  if (input.metadata?.sourceEntryIds && !input.metadata.sourceEntryIds.every((id) => typeof id === "string" && id.length <= 120)) throw new ChannelMessageValidationError("Response metadata is invalid.");
  if (input.metadata?.requestId !== undefined && input.metadata.requestId.length > 120) throw new ChannelMessageValidationError("Response request ID is invalid.");
  if (input.metadata?.normalizedMessage !== undefined && input.metadata.normalizedMessage.length > 2_000) throw new ChannelMessageValidationError("Response normalized message is invalid.");
  return Object.freeze({ ...input, text: input.text.trim(), metadata: input.metadata ? Object.freeze({ ...input.metadata, sourceEntryIds: input.metadata.sourceEntryIds ? Object.freeze([...input.metadata.sourceEntryIds]) : undefined, knowledge: input.metadata.knowledge ? Object.freeze({ ...input.metadata.knowledge }) : undefined }) : undefined });
};
