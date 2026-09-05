import { createWhatsAppOutboundTextPayload } from "../src/channels/whatsapp/whatsappOutboundText.js";
import { loadWhatsAppRuntimeConfig } from "../src/config/whatsappRuntimeConfig.js";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
try {
  const missing = loadWhatsAppRuntimeConfig({ WHATSAPP_ENABLED: "true", WHATSAPP_VERIFY_TOKEN: "qa" });
  const ready = loadWhatsAppRuntimeConfig({ WHATSAPP_ENABLED: "true", WHATSAPP_ACCESS_TOKEN: "qa-access-token", WHATSAPP_PHONE_NUMBER_ID: "0000000000", WHATSAPP_BUSINESS_ACCOUNT_ID: "business-qa", WHATSAPP_GRAPH_API_VERSION: "v99.0" });
  assert(missing.outboundReadiness === "missing-config" && ready.outboundReadiness === "ready-for-outbound", "Outbound readiness must be explicit and config-only.");
  const payload = createWhatsAppOutboundTextPayload({ recipient: "0000000000" }, " Hola desde LUMI ");
  assert(payload.messaging_product === "whatsapp" && payload.type === "text" && payload.to === "0000000000" && payload.text.body === "Hola desde LUMI", "Text payload must be minimal and provider-shaped.");
  try { createWhatsAppOutboundTextPayload({ recipient: "recipient-unsafe" }, "texto"); throw new Error("Invalid recipient was accepted."); } catch (error) { assert(error instanceof Error, "Invalid recipient must remain boundary-local."); }
  assert(!("conversationId" in payload) && !Object.keys(payload).some((key) => /core|lumi|delivery/i.test(key)), "Core response data must not leak into payload.");
  console.info("WhatsApp Outbound Contract QA: PASS (config readiness, text-only payload, recipient/Core isolation)");
} catch (error) { console.error(error); process.exit(1); }
