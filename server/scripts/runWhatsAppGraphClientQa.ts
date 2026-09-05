import { buildWhatsAppGraphMessagesEndpoint, WhatsAppGraphClient, type WhatsAppGraphTransport, type WhatsAppGraphTransportRequest } from "../src/channels/whatsapp/whatsappGraphClient.js";
import { loadWhatsAppRuntimeConfig } from "../src/config/whatsappRuntimeConfig.js";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const config = loadWhatsAppRuntimeConfig({ WHATSAPP_ENABLED: "true", WHATSAPP_ACCESS_TOKEN: "qa-access-token", WHATSAPP_PHONE_NUMBER_ID: "0000000000", WHATSAPP_BUSINESS_ACCOUNT_ID: "business-qa", WHATSAPP_GRAPH_API_VERSION: "v99.0" });
const context = Object.freeze({ recipient: "0000000000" });
try {
  const endpoint = buildWhatsAppGraphMessagesEndpoint(config);
  assert(endpoint === "https://graph.facebook.com/v99.0/0000000000/messages", "Endpoint must be canonical and config-built.");
  let captured: WhatsAppGraphTransportRequest | undefined;
  const successTransport: WhatsAppGraphTransport = async (request) => { captured = request; return Object.freeze({ status: 200, body: JSON.stringify({ messages: [{ id: "wamid.synthetic" }] }) }); };
  const success = await new WhatsAppGraphClient(config, successTransport, 1_000).sendText(context, "Mensaje de prueba");
  assert(success.ok && success.providerMessageId === "wamid.synthetic", "Success must parse only provider message ID at boundary.");
  assert(captured?.method === "POST" && captured.headers.authorization === "Bearer qa-access-token" && captured.headers["content-type"] === "application/json", "Transport request must use POST and bounded headers.");
  assert(JSON.parse(captured.body).text.body === "Mensaje de prueba" && !captured.body.includes("conversationId"), "Payload must preserve text without Core data.");
  const mapped = async (status: number) => new WhatsAppGraphClient(config, async () => Object.freeze({ status, body: "{}" }), 1_000).sendText(context, "Texto");
  const auth = await mapped(401); const rate = await mapped(429); const rejected = await mapped(400);
  assert("errorCode" in auth && auth.errorCode === "WHATSAPP_AUTH_FAILED", "401 must normalize safely.");
  assert("errorCode" in rate && rate.errorCode === "WHATSAPP_RATE_LIMITED" && "errorCode" in rejected && rejected.errorCode === "WHATSAPP_REQUEST_REJECTED", "Provider status errors must normalize.");
  const invalid = await new WhatsAppGraphClient(config, async () => Object.freeze({ status: 200, body: "not-json" }), 1_000).sendText(context, "Texto");
  assert("errorCode" in invalid && invalid.errorCode === "WHATSAPP_INVALID_RESPONSE", "Invalid provider JSON must be controlled.");
  const network = await new WhatsAppGraphClient(config, async () => { throw new Error("network"); }, 1_000).sendText(context, "Texto");
  const timeout = await new WhatsAppGraphClient(config, async () => { throw new DOMException("aborted", "AbortError"); }, 1_000).sendText(context, "Texto");
  assert("errorCode" in network && network.errorCode === "WHATSAPP_NETWORK_FAILED" && "errorCode" in timeout && timeout.errorCode === "WHATSAPP_TIMEOUT", "Network and timeout failures must normalize.");
  assert(!JSON.stringify({ success, invalid, network, timeout }).includes("qa-access-token"), "Token must not appear in client result diagnostics.");
  console.info("WhatsApp Graph Client QA: PASS (fake transport only, endpoint, auth boundary, success/error normalization, no live call)");
} catch (error) { console.error(error); process.exit(1); }
