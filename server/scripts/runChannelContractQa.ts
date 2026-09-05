import { CHANNEL_DESCRIPTORS, ChannelMessageValidationError, validateInboundChannelMessage, validateOutboundChannelResponse } from "../src/types/channelMessage.js";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };

try {
  assert(CHANNEL_DESCRIPTORS.map((item) => item.channel).join(",") === "web,widget,whatsapp,internal", "Channel IDs must remain bounded.");
  assert(CHANNEL_DESCRIPTORS.find((item) => item.channel === "web")?.status === "implemented", "Web must remain implemented.");
  assert(CHANNEL_DESCRIPTORS.find((item) => item.channel === "whatsapp")?.status === "inbound-foundation" && CHANNEL_DESCRIPTORS.find((item) => item.channel === "whatsapp")?.availability === "unavailable", "WhatsApp must remain a non-public inbound development foundation.");
  const inbound = validateInboundChannelMessage({ channel: "web", externalConversationId: "external-thread", externalUserId: "external-user", externalMessageId: "external-message", messageType: "voice-transcript", text: " Hola LUMI ", receivedAt: new Date().toISOString(), metadata: { locale: "es", pageUrl: "http://localhost:3000" } });
  assert(inbound.text === "Hola LUMI" && inbound.externalUserId === "external-user", "Inbound contract must preserve bounded normalized text and external metadata.");
  const outbound = validateOutboundChannelResponse({ channel: "web", conversationId: "orbi-conversation", responseType: "text", text: "Respuesta local", createdAt: new Date().toISOString(), metadata: { grounded: true, sourceEntryIds: ["orbi-sandbox-assistant"] } });
  assert(outbound.conversationId === "orbi-conversation" && outbound.metadata?.grounded === true, "Outbound contract must remain separate and valid.");
  try { validateInboundChannelMessage({ ...inbound, channel: "whatsapp", text: "x".repeat(2_001) }); throw new Error("Oversized input was accepted."); } catch (error) { assert(error instanceof ChannelMessageValidationError, "Inbound contract must reject invalid data."); }
  console.info("Channel Contract QA: PASS");
} catch (error) { console.error(error); process.exit(1); }
