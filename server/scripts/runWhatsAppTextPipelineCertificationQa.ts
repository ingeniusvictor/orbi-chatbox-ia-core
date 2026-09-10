import express from "express";
import { createHmac } from "node:crypto";
import type { AiProvider, AiProviderRequest } from "../src/types/aiProvider.js";
import type { ChannelDeliveryAdapter } from "../src/types/channelDeliveryAdapter.js";
import { WhatsAppDeliveryAdapter } from "../src/adapters/whatsAppDeliveryAdapter.js";
import { WhatsAppGraphClient, type WhatsAppGraphTransport } from "../src/channels/whatsapp/whatsappGraphClient.js";
import { loadWhatsAppRuntimeConfig } from "../src/config/whatsappRuntimeConfig.js";
import { createWhatsAppWebhookRawBodyMiddleware } from "../src/middleware/whatsAppWebhookRawBody.js";
import { createWhatsAppWebhookRouter } from "../src/routes/whatsappWebhook.js";
import { createChannelAdapterRegistry } from "../src/services/channelAdapterRegistry.js";
import { ControlledChannelRouter } from "../src/services/controlledChannelRouter.js";
import { createWhatsAppQaCommercialRuntime } from "./createWhatsAppQaCommercialRuntime.js";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const secret = "qa-app-secret";
const config = loadWhatsAppRuntimeConfig({ WHATSAPP_ENABLED: "true", WHATSAPP_VERIFY_TOKEN: "qa-verify", WHATSAPP_APP_SECRET: secret, WHATSAPP_ACCESS_TOKEN: "qa-access-token", WHATSAPP_PHONE_NUMBER_ID: "0000000000", WHATSAPP_GRAPH_API_VERSION: "v99.0" });
const coreCalls: AiProviderRequest[] = [];
const provider: AiProvider = Object.freeze({ mode: "mock", async generate(request) { coreCalls.push(request); return Object.freeze({ provider: "mock", text: `respuesta:${request.message}`, grounded: false, sourceEntryIds: [] }); } });
const event = (id: string, sender: string, text: string) => Object.freeze({ providerMessageId: id, externalUserId: sender, externalConversationId: `whatsapp:${sender}`, text, receivedAt: "2026-09-05T00:00:00.000Z" });
const payload = (id: string, sender: string, text: string): object => ({ object: "whatsapp_business_account", entry: [{ changes: [{ value: { messages: [{ id, from: sender, timestamp: "1757030400", type: "text", text: { body: text } }] } }] }] });
const signed = (body: object): Readonly<{ raw: string; signature: string }> => { const raw = JSON.stringify(body); return Object.freeze({ raw, signature: `sha256=${createHmac("sha256", secret).update(raw).digest("hex")}` }); };

try {
  const recipients: string[] = [];
  const deliveryIds: string[] = [];
  let graphCalls = 0;
  const transport: WhatsAppGraphTransport = async (request) => { graphCalls += 1; recipients.push((JSON.parse(request.body) as { to: string }).to); return Object.freeze({ status: 200, body: JSON.stringify({ messages: [{ id: `wamid.fake.${graphCalls}` }] }) }); };
  const app = express();
  app.use("/api/channels/whatsapp/webhook", createWhatsAppWebhookRawBodyMiddleware());
  app.use(express.json());
  app.use(createWhatsAppWebhookRouter(config, "mock", provider, Object.freeze({ createDeliveryAdapter: (inbound): ChannelDeliveryAdapter => {
    const delegate = new WhatsAppDeliveryAdapter(new WhatsAppGraphClient(config, transport, 1_000), () => Object.freeze({ recipient: inbound.externalUserId }));
    return Object.freeze({ deliver: async (request) => { deliveryIds.push(request.deliveryId); return delegate.deliver(request); } });
  } }), createWhatsAppQaCommercialRuntime()));
  const server = await new Promise<import("node:http").Server>((resolve) => { const value = app.listen(0, "127.0.0.1", () => resolve(value)); });
  try {
    const address = server.address(); if (!address || typeof address === "string") throw new Error("Webhook listener unavailable.");
    const post = async (body: object) => { const request = signed(body); const response = await fetch(`http://127.0.0.1:${address.port}/api/channels/whatsapp/webhook`, { method: "POST", headers: { "content-type": "application/json", "x-hub-signature-256": request.signature }, body: request.raw }); return Object.freeze({ status: response.status, body: await response.json() as Record<string, unknown> }); };
    const first = await post(payload("wamid.a.1", "1111111111", "Mi clave es ALPHA."));
    const duplicate = await post(payload("wamid.a.1", "1111111111", "Mi clave es ALPHA."));
    const second = await post(payload("wamid.a.2", "1111111111", "¿Cuál es mi clave?"));
    const senderB = await post(payload("wamid.b.1", "2222222222", "Mi clave es BETA."));
    assert(first.status === 200 && duplicate.status === 200 && second.status === 200 && senderB.status === 200, "Signed webhook text must retain acknowledgement semantics.");
    assert(coreCalls.length === 3 && graphCalls === 3 && deliveryIds.length === 3 && duplicate.body.duplicate === true, "Duplicate inbound must execute Core and outbound delivery exactly once.");
    assert(coreCalls[0]?.conversationId === coreCalls[1]?.conversationId && coreCalls[0]?.conversationId !== coreCalls[2]?.conversationId, "Same sender continuity and multi-sender isolation must hold.");
    assert(new Set(deliveryIds).size === 3 && recipients.join(",") === "1111111111,1111111111,2222222222", "Each new response needs its own delivery ID and boundary-local recipient.");
    assert(coreCalls.every((request) => !request.message.includes("1111111111") && !request.message.includes("2222222222")), "Core must remain Meta-recipient unaware.");
    assert(!JSON.stringify(first.body).includes("respuesta:") && !JSON.stringify(first.body).includes("wamid.fake"), "Webhook acknowledgement must not expose Core text or provider result.");
  } finally { await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve())); }
  let failureCalls = 0;
  const failureRouter = new ControlledChannelRouter(createChannelAdapterRegistry(config), undefined, undefined, undefined, undefined, createWhatsAppQaCommercialRuntime());
  const failedAdapter = new WhatsAppDeliveryAdapter(new WhatsAppGraphClient(config, async () => { failureCalls += 1; return Object.freeze({ status: 500, body: "private-provider-error" }); }, 1_000), () => Object.freeze({ recipient: "3333333333" }));
  const beforeFailure = coreCalls.length;
  const failed = await failureRouter.routeInboundWithDelivery({ channel: "whatsapp", rawInput: event("wamid.failure", "3333333333", "fallo"), activeProviderMode: "mock", providerOverride: provider }, failedAdapter);
  assert("errorCode" in failed && failed.errorCode === "CHANNEL_DELIVERY_FAILED" && failureCalls === 1 && coreCalls.length === beforeFailure + 1, "Delivery failure must be controlled, terminal, and must not reprocess Core.");
  console.info("WhatsApp Text Pipeline Certification QA: PASS (signed loop, continuity, isolation, deduplication, delivery IDs, failure isolation, fake transport only)");
} catch (error) { console.error(error); process.exit(1); }
