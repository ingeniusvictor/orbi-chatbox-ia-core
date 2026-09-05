import express from "express";
import { createHmac } from "node:crypto";
import { createWhatsAppWebhookRawBodyMiddleware } from "../src/middleware/whatsAppWebhookRawBody.js";
import { createWhatsAppWebhookRouter } from "../src/routes/whatsappWebhook.js";
import { loadWhatsAppRuntimeConfig } from "../src/config/whatsappRuntimeConfig.js";
import { ControlledChannelRouter } from "../src/services/controlledChannelRouter.js";
import { createChannelAdapterRegistry } from "../src/services/channelAdapterRegistry.js";
import { InMemoryWhatsAppInboundDeduplicationStore } from "../src/channels/whatsapp/inMemoryWhatsAppInboundDeduplicationStore.js";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const config = loadWhatsAppRuntimeConfig({ WHATSAPP_ENABLED: "true", WHATSAPP_VERIFY_TOKEN: "qa", WHATSAPP_APP_SECRET: "qa-app-secret" });
const inbound = Object.freeze({ providerMessageId: "wamid.boundary.1", externalUserId: "56912345678", externalConversationId: "whatsapp:56912345678", text: "Hola LUMI", receivedAt: "2026-09-05T00:00:00.000Z" });
const start = async (): Promise<{ baseUrl: string; close: () => Promise<void> }> => {
  const app = express(); app.use("/api/channels/whatsapp/webhook", createWhatsAppWebhookRawBodyMiddleware()); app.use(express.json()); app.use(createWhatsAppWebhookRouter(config));
  const server = await new Promise<import("node:http").Server>((resolve) => { const value = app.listen(0, "127.0.0.1", () => resolve(value)); });
  const address = server.address(); if (!address || typeof address === "string") throw new Error("Listener unavailable.");
  return { baseUrl: `http://127.0.0.1:${address.port}`, close: async () => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())) };
};
try {
  const router = new ControlledChannelRouter(createChannelAdapterRegistry(config));
  const result = await router.routeInboundOnly({ channel: "whatsapp", rawInput: inbound, activeProviderMode: "mock" });
  assert(result.ok && result.outbound.channel === "whatsapp" && result.outbound.conversationId !== inbound.externalConversationId, "Router must correlate external identity before Core and return only neutral output.");
  const dedup = new InMemoryWhatsAppInboundDeduplicationStore(1);
  assert(dedup.reserve("a") === "accepted" && dedup.reserve("a") === "duplicate" && dedup.reserve("b") === "capacity", "Inbound deduplication must be bounded and process-local.");
  const runtime = await start();
  try {
    const raw = JSON.stringify({ object: "whatsapp_business_account", entry: [{ changes: [{ value: { messages: [{ id: "wamid.http.1", from: "56912345678", type: "text", text: { body: "Hola LUMI" }, timestamp: "1757030400" }] } }] }] });
    const signature = `sha256=${createHmac("sha256", "qa-app-secret").update(raw).digest("hex")}`;
    const first = await fetch(`${runtime.baseUrl}/api/channels/whatsapp/webhook`, { method: "POST", headers: { "content-type": "application/json", "x-hub-signature-256": signature }, body: raw });
    const firstBody = await first.json() as Record<string, unknown>;
    const second = await fetch(`${runtime.baseUrl}/api/channels/whatsapp/webhook`, { method: "POST", headers: { "content-type": "application/json", "x-hub-signature-256": signature }, body: raw });
    const secondBody = await second.json() as Record<string, unknown>;
    assert(first.status === 200 && firstBody.processed === true && !("message" in firstBody), "Validated text must be processed without a Meta reply or Core payload.");
    assert(second.status === 200 && secondBody.duplicate === true && secondBody.processed === false, "Duplicate provider message must not reprocess Core.");
  } finally { await runtime.close(); }
  console.info("WhatsApp Inbound Boundary QA: PASS (signature-before-parse, router/correlation reuse, no outbound send, bounded deduplication)");
} catch (error) { console.error(error); process.exit(1); }
