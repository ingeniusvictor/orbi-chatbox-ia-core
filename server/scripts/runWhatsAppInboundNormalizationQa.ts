import { WhatsAppChannelAdapter } from "../src/adapters/whatsAppChannelAdapter.js";
import { classifyWhatsAppWebhookEvents } from "../src/channels/whatsapp/whatsappInboundText.js";
import { loadWhatsAppRuntimeConfig } from "../src/config/whatsappRuntimeConfig.js";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
try {
  const payload = { object: "whatsapp_business_account", entry: [{ changes: [{ value: { messages: [{ id: "wamid.qa.1", from: "56912345678", timestamp: "1757030400", type: "text", text: { body: "¿Qué representa ORBI Academy?" } }, { id: "wamid.qa.2", from: "56912345678", type: "image" }], statuses: [{ id: "receipt" }] } }] }] };
  const events = classifyWhatsAppWebhookEvents(payload);
  const text = events.find((event) => event.kind === "inbound-text");
  assert(text?.kind === "inbound-text", "A valid text event must be classified.");
  assert(events.some((event) => event.kind === "unsupported-message") && events.some((event) => event.kind === "status-event"), "Media and status events must remain filtered.");
  if (text?.kind !== "inbound-text") throw new Error("Text event missing.");
  const inbound = new WhatsAppChannelAdapter(loadWhatsAppRuntimeConfig({ WHATSAPP_ENABLED: "true", WHATSAPP_VERIFY_TOKEN: "qa", WHATSAPP_APP_SECRET: "secret" })).normalizeInbound(text.event);
  assert(inbound.channel === "whatsapp" && inbound.messageType === "text" && inbound.text === "¿Qué representa ORBI Academy?", "Only text must enter the neutral contract.");
  assert(inbound.externalMessageId === "wamid.qa.1" && inbound.externalUserId === "56912345678", "Provider identifiers must remain external fields.");
  assert(inbound.externalConversationId === "whatsapp:56912345678" && inbound.externalConversationId !== inbound.externalMessageId, "External conversation key must be separate and channel scoped.");
  assert(!("raw" in inbound) && !Object.values(inbound).some((value) => value === payload), "Raw Meta payload must not leak downstream.");
  console.info("WhatsApp Inbound Normalization QA: PASS (text-only, external identity boundary, status/media filtering)");
} catch (error) { console.error(error); process.exit(1); }
