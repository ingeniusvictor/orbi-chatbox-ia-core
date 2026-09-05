import { WhatsAppDeliveryAdapter } from "../src/adapters/whatsAppDeliveryAdapter.js";
import { WhatsAppGraphClient, type WhatsAppGraphTransport } from "../src/channels/whatsapp/whatsappGraphClient.js";
import { loadWhatsAppRuntimeConfig } from "../src/config/whatsappRuntimeConfig.js";
import { ChannelDeliveryService } from "../src/services/channelDeliveryService.js";
import type { OutboundDeliveryRequest } from "../src/types/outboundDelivery.js";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const config = loadWhatsAppRuntimeConfig({ WHATSAPP_ENABLED: "true", WHATSAPP_ACCESS_TOKEN: "qa-access-token", WHATSAPP_PHONE_NUMBER_ID: "0000000000", WHATSAPP_BUSINESS_ACCOUNT_ID: "business-qa", WHATSAPP_GRAPH_API_VERSION: "v99.0" });
const request: OutboundDeliveryRequest = Object.freeze({ deliveryId: "orbi-delivery-qa", channel: "whatsapp", conversationId: "orbi-conversation-qa", response: Object.freeze({ channel: "whatsapp", conversationId: "orbi-conversation-qa", responseType: "text", text: "Respuesta LUMI", createdAt: "2026-09-05T00:00:00.000Z" }), createdAt: "2026-09-05T00:00:00.000Z" });
try {
  let calls = 0;
  const transport: WhatsAppGraphTransport = async () => { calls += 1; return Object.freeze({ status: 200, body: JSON.stringify({ messages: [{ id: "wamid.provider-only" }] }) }); };
  const adapter = new WhatsAppDeliveryAdapter(new WhatsAppGraphClient(config, transport, 1_000), () => Object.freeze({ recipient: "0000000000" }));
  const delivered = await new ChannelDeliveryService().deliver(request, adapter);
  assert(delivered.status === "delivered" && delivered.deliveryId === request.deliveryId && delivered.channel === "whatsapp" && calls === 1, "Adapter must preserve ORBI lifecycle identity and execute injected transport once.");
  assert(!JSON.stringify(delivered).includes("wamid.provider-only"), "Provider message ID must not cross the neutral delivery result.");
  const unavailable = await new WhatsAppDeliveryAdapter(new WhatsAppGraphClient(config, transport, 1_000), () => undefined).deliver({ ...request, deliveryId: "orbi-delivery-no-recipient" });
  assert(unavailable.status === "failed" && unavailable.errorCode === "DELIVERY_CHANNEL_UNAVAILABLE", "Recipient context must remain adapter-side and required.");
  console.info("WhatsApp Delivery Adapter QA: PASS (ChannelDeliveryAdapter/lifecycle reuse, recipient isolation, provider ID stays local)");
} catch (error) { console.error(error); process.exit(1); }
