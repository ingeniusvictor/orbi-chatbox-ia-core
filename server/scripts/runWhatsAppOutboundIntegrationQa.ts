import type { AiProvider, AiProviderRequest } from "../src/types/aiProvider.js";
import { WhatsAppDeliveryAdapter } from "../src/adapters/whatsAppDeliveryAdapter.js";
import { WhatsAppGraphClient, type WhatsAppGraphTransport } from "../src/channels/whatsapp/whatsappGraphClient.js";
import { loadWhatsAppRuntimeConfig } from "../src/config/whatsappRuntimeConfig.js";
import { createChannelAdapterRegistry } from "../src/services/channelAdapterRegistry.js";
import { ControlledChannelRouter } from "../src/services/controlledChannelRouter.js";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const config = loadWhatsAppRuntimeConfig({ WHATSAPP_ENABLED: "true", WHATSAPP_VERIFY_TOKEN: "qa-verify", WHATSAPP_APP_SECRET: "qa-app-secret", WHATSAPP_ACCESS_TOKEN: "qa-access-token", WHATSAPP_PHONE_NUMBER_ID: "0000000000", WHATSAPP_BUSINESS_ACCOUNT_ID: "business-qa", WHATSAPP_GRAPH_API_VERSION: "v99.0" });
const requests: AiProviderRequest[] = [];
const provider: AiProvider = Object.freeze({ mode: "mock", async generate(request) { requests.push(request); return Object.freeze({ provider: "mock", text: `LUMI:${request.message}`, grounded: false, sourceEntryIds: [] }); } });
const inbound = (id: string, sender: string, text: string) => Object.freeze({ providerMessageId: id, externalUserId: sender, externalConversationId: `whatsapp:${sender}`, text, receivedAt: "2026-09-05T00:00:00.000Z" });

try {
  let calls = 0;
  let capturedBody = "";
  const transport: WhatsAppGraphTransport = async (request) => { calls += 1; capturedBody = request.body; return Object.freeze({ status: 200, body: JSON.stringify({ messages: [{ id: "wamid.boundary-only" }] }) }); };
  const router = new ControlledChannelRouter(createChannelAdapterRegistry(config));
  const adapterFor = (sender: string) => new WhatsAppDeliveryAdapter(new WhatsAppGraphClient(config, transport, 1_000), () => Object.freeze({ recipient: sender }));
  const success = await router.routeInboundWithDelivery({ channel: "whatsapp", rawInput: inbound("wamid.success", "1111111111", "hola"), activeProviderMode: "mock", providerOverride: provider }, adapterFor("1111111111"));
  assert("delivery" in success && success.delivery.status === "delivered" && calls === 1, "Inbound response must use the injected WhatsApp delivery adapter once.");
  if (!("outbound" in success)) throw new Error("Successful controlled route must include neutral outbound response.");
  assert(JSON.parse(capturedBody).to === "1111111111" && !capturedBody.includes(success.outbound.conversationId), "Recipient must remain provider-boundary data, outside the neutral response.");
  assert(!JSON.stringify(success).includes("wamid.boundary-only"), "Provider message ID must remain outside the controlled route result.");
  const unavailable = loadWhatsAppRuntimeConfig({ WHATSAPP_ENABLED: "true", WHATSAPP_VERIFY_TOKEN: "qa-verify", WHATSAPP_APP_SECRET: "qa-app-secret" });
  let missingCalls = 0;
  const missingAdapter = new WhatsAppDeliveryAdapter(new WhatsAppGraphClient(unavailable, async () => { missingCalls += 1; return Object.freeze({ status: 200, body: "{}" }); }, 1_000), () => Object.freeze({ recipient: "2222222222" }));
  const missing = await new ControlledChannelRouter(createChannelAdapterRegistry(unavailable)).routeInboundWithDelivery({ channel: "whatsapp", rawInput: inbound("wamid.missing", "2222222222", "sin config"), activeProviderMode: "mock", providerOverride: provider }, missingAdapter);
  assert("errorCode" in missing && missing.errorCode === "CHANNEL_DELIVERY_FAILED" && missingCalls === 0, "Missing config must fail closed without transport execution.");
  let failureCalls = 0;
  const rejectedAdapter = new WhatsAppDeliveryAdapter(new WhatsAppGraphClient(config, async () => { failureCalls += 1; return Object.freeze({ status: 429, body: "provider-body-must-not-leak" }); }, 1_000), () => Object.freeze({ recipient: "3333333333" }));
  const beforeFailure = requests.length;
  const rejected = await router.routeInboundWithDelivery({ channel: "whatsapp", rawInput: inbound("wamid.failure", "3333333333", "rechazar"), activeProviderMode: "mock", providerOverride: provider }, rejectedAdapter);
  assert("errorCode" in rejected && rejected.errorCode === "CHANNEL_DELIVERY_FAILED" && failureCalls === 1 && requests.length === beforeFailure + 1, "Provider failure must mark delivery only, with no retry or Core reprocessing.");
  assert(requests.every((request) => !request.message.includes("1111111111") && !request.message.includes("2222222222") && !request.message.includes("3333333333")), "Core must not receive provider recipients.");
  console.info("WhatsApp Outbound Integration QA: PASS (injected adapter resolution, lifecycle, missing-config guard, failure isolation, no live call)");
} catch (error) { console.error(error); process.exit(1); }
