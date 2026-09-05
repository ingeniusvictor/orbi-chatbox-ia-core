import express from "express";
import { createHmac } from "node:crypto";
import type { AiProvider, AiProviderRequest } from "../src/types/aiProvider.js";
import { WhatsAppDeliveryAdapter } from "../src/adapters/whatsAppDeliveryAdapter.js";
import { WhatsAppGraphClient, type WhatsAppGraphTransport } from "../src/channels/whatsapp/whatsappGraphClient.js";
import { loadWhatsAppRuntimeConfig } from "../src/config/whatsappRuntimeConfig.js";
import { createWhatsAppWebhookRawBodyMiddleware } from "../src/middleware/whatsAppWebhookRawBody.js";
import { createWhatsAppWebhookRouter } from "../src/routes/whatsappWebhook.js";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const secret = "qa-app-secret";
const config = loadWhatsAppRuntimeConfig({ WHATSAPP_ENABLED: "true", WHATSAPP_VERIFY_TOKEN: "qa-verify", WHATSAPP_APP_SECRET: secret, WHATSAPP_ACCESS_TOKEN: "qa-access-token", WHATSAPP_PHONE_NUMBER_ID: "0000000000", WHATSAPP_BUSINESS_ACCOUNT_ID: "business-qa", WHATSAPP_GRAPH_API_VERSION: "v99.0" });
const coreCalls: AiProviderRequest[] = [];
const provider: AiProvider = Object.freeze({ mode: "mock", async generate(request) { coreCalls.push(request); return Object.freeze({ provider: "mock", text: `respuesta:${request.message}`, grounded: false, sourceEntryIds: [] }); } });
const payload = (id: string, sender: string, text: string): object => ({ object: "whatsapp_business_account", entry: [{ changes: [{ value: { messages: [{ id, from: sender, timestamp: "1757030400", type: "text", text: { body: text } }] } }] }] });
const sign = (body: object): Readonly<{ raw: string; signature: string }> => { const raw = JSON.stringify(body); return Object.freeze({ raw, signature: `sha256=${createHmac("sha256", secret).update(raw).digest("hex")}` }); };

try {
  const sent: Array<Readonly<{ recipient: string; body: string }>> = [];
  const transport: WhatsAppGraphTransport = async (request) => { const body = JSON.parse(request.body) as { to: string; text: { body: string } }; sent.push(Object.freeze({ recipient: body.to, body: body.text.body })); return Object.freeze({ status: 200, body: JSON.stringify({ messages: [{ id: `wamid.synthetic.${sent.length}` }] }) }); };
  const app = express();
  app.use("/api/channels/whatsapp/webhook", createWhatsAppWebhookRawBodyMiddleware());
  app.use(express.json());
  app.use(createWhatsAppWebhookRouter(config, "mock", provider, Object.freeze({ createDeliveryAdapter: (event) => new WhatsAppDeliveryAdapter(new WhatsAppGraphClient(config, transport, 1_000), () => Object.freeze({ recipient: event.externalUserId })) })));
  const server = await new Promise<import("node:http").Server>((resolve) => { const value = app.listen(0, "127.0.0.1", () => resolve(value)); });
  try {
    const address = server.address(); if (!address || typeof address === "string") throw new Error("Listener unavailable.");
    const post = async (body: object) => { const request = sign(body); const response = await fetch(`http://127.0.0.1:${address.port}/api/channels/whatsapp/webhook`, { method: "POST", headers: { "content-type": "application/json", "x-hub-signature-256": request.signature }, body: request.raw }); return Object.freeze({ status: response.status, body: await response.json() as Record<string, unknown> }); };
    const first = await post(payload("wamid.a.1", "1111111111", "Mi clave es ALPHA."));
    const duplicate = await post(payload("wamid.a.1", "1111111111", "Mi clave es ALPHA."));
    const continuation = await post(payload("wamid.a.2", "1111111111", "¿Cuál es mi clave?"));
    const otherSender = await post(payload("wamid.b.1", "2222222222", "Mi clave es BETA."));
    assert(first.status === 200 && duplicate.status === 200 && continuation.status === 200 && otherSender.status === 200, "Webhook must retain its simple acknowledgement boundary.");
    assert(coreCalls.length === 3 && sent.length === 3 && duplicate.body.duplicate === true, "Duplicate inbound IDs must not execute Core or send a second outbound message.");
    assert(coreCalls[0]?.conversationId === coreCalls[1]?.conversationId && coreCalls[0]?.conversationId !== coreCalls[2]?.conversationId, "Same sender must continue while different senders remain isolated.");
    assert(sent[0]?.recipient === "1111111111" && sent[1]?.recipient === "1111111111" && sent[2]?.recipient === "2222222222", "Each response must retain its boundary-local recipient without cross-send.");
    assert(coreCalls.every((call) => !call.message.includes("1111111111") && !call.message.includes("2222222222")), "Core must remain recipient-unaware.");
    assert(!JSON.stringify(first.body).includes("respuesta:") && !JSON.stringify(first.body).includes("wamid.synthetic"), "Webhook acknowledgement must not expose Core text or provider results.");
  } finally { await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve())); }
  console.info("WhatsApp Text Loop QA: PASS (signed inbound, correlation, fake outbound, isolation, duplicate protection, no live call)");
} catch (error) { console.error(error); process.exit(1); }
