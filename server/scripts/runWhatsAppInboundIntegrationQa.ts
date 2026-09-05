import express from "express";
import { createHmac } from "node:crypto";
import type { AiProvider, AiProviderRequest } from "../src/types/aiProvider.js";
import { createWhatsAppWebhookRawBodyMiddleware } from "../src/middleware/whatsAppWebhookRawBody.js";
import { createWhatsAppWebhookRouter } from "../src/routes/whatsappWebhook.js";
import { loadWhatsAppRuntimeConfig } from "../src/config/whatsappRuntimeConfig.js";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const secret = "qa-app-secret";
const config = loadWhatsAppRuntimeConfig({ WHATSAPP_ENABLED: "true", WHATSAPP_VERIFY_TOKEN: "qa-verify", WHATSAPP_APP_SECRET: secret });
const calls: AiProviderRequest[] = [];
const provider: AiProvider = Object.freeze({ mode: "mock", async generate(request) {
  calls.push(request);
  if (request.message === "fallo controlado") throw new Error("test-only failure");
  return Object.freeze({ provider: "mock", text: `respuesta:${request.message}`, grounded: false, sourceEntryIds: [] });
} });

const signed = (body: unknown, signature = true): Readonly<{ raw: string; headers: Record<string, string> }> => {
  const raw = JSON.stringify(body);
  return Object.freeze({ raw, headers: { "content-type": "application/json", "x-hub-signature-256": signature ? `sha256=${createHmac("sha256", secret).update(raw).digest("hex")}` : "sha256=invalid" } });
};
const textEvent = (id: string, sender: string, text: string): object => ({ object: "whatsapp_business_account", entry: [{ changes: [{ value: { messages: [{ id, from: sender, timestamp: "1757030400", type: "text", text: { body: text } }] } }] }] });
const post = async (baseUrl: string, body: object, signature = true): Promise<{ status: number; payload: Record<string, unknown> }> => {
  const request = signed(body, signature);
  const response = await fetch(`${baseUrl}/api/channels/whatsapp/webhook`, { method: "POST", headers: request.headers, body: request.raw });
  return { status: response.status, payload: await response.json() as Record<string, unknown> };
};
const start = async (): Promise<{ baseUrl: string; close: () => Promise<void> }> => {
  const app = express();
  app.use("/api/channels/whatsapp/webhook", createWhatsAppWebhookRawBodyMiddleware());
  app.use(express.json());
  app.use(createWhatsAppWebhookRouter(config, "mock", provider));
  const server = await new Promise<import("node:http").Server>((resolve) => { const value = app.listen(0, "127.0.0.1", () => resolve(value)); });
  const address = server.address(); if (!address || typeof address === "string") throw new Error("Webhook listener unavailable.");
  return Object.freeze({ baseUrl: `http://127.0.0.1:${address.port}`, close: async () => new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve())) });
};

try {
  const runtime = await start();
  try {
    const invalid = await post(runtime.baseUrl, textEvent("wamid.invalid", "sender-a", "no debe llegar"), false);
    assert(invalid.status === 403 && calls.length === 0, "Invalid signature must stop before parser normalization and Core.");
    const missing = await fetch(`${runtime.baseUrl}/api/channels/whatsapp/webhook`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(textEvent("wamid.missing", "sender-a", "no debe llegar")) });
    assert(missing.status === 403 && calls.length === 0, "Missing signature must stop before Core.");
    const status = await post(runtime.baseUrl, { object: "whatsapp_business_account", entry: [{ changes: [{ value: { statuses: [{ id: "receipt" }] } }] }] });
    const media = await post(runtime.baseUrl, { object: "whatsapp_business_account", entry: [{ changes: [{ value: { messages: [{ id: "wamid.media", from: "sender-a", type: "image" }] } }] }] });
    assert(status.status === 200 && media.status === 200 && calls.length === 0, "Status and media events must be ack-only.");
    const malformed = await post(runtime.baseUrl, { object: "other" });
    assert(malformed.status === 400 && calls.length === 0, "Malformed payload must not mutate Core.");
    const first = await post(runtime.baseUrl, textEvent("wamid.a.1", "sender-a", "Mi clave es ALPHA."));
    const duplicate = await post(runtime.baseUrl, textEvent("wamid.a.1", "sender-a", "Mi clave es ALPHA."));
    const continuation = await post(runtime.baseUrl, textEvent("wamid.a.2", "sender-a", "¿Cuál es mi clave?"));
    const isolated = await post(runtime.baseUrl, textEvent("wamid.b.1", "sender-b", "Mi clave es BETA."));
    assert(first.status === 200 && first.payload.processed === true, "Signed inbound text must reach the controlled Core path.");
    assert(duplicate.status === 200 && duplicate.payload.duplicate === true && calls.length === 3, "Duplicate ID must acknowledge without a second Core execution.");
    assert(continuation.payload.processed === true && isolated.payload.processed === true, "New IDs must process normally.");
    assert(calls[0]?.conversationId === calls[1]?.conversationId, "Same sender must preserve its correlated internal conversation.");
    assert(calls[0]?.conversationId !== calls[2]?.conversationId, "Different senders must remain isolated.");
    assert(calls.every((call) => !call.message.includes("sender-a") && !call.message.includes("sender-b")), "Core prompt must not receive provider identity.");
    const failed = await post(runtime.baseUrl, textEvent("wamid.failure", "sender-c", "fallo controlado"));
    assert(failed.status === 200 && failed.payload.rejected === true && !("stack" in failed.payload), "Core failure must be a controlled acknowledgement without raw stack leakage.");
    assert(!("delivery" in first.payload) && !("message" in first.payload), "Webhook acknowledgement must not claim Meta delivery or expose a neutral Core response.");
  } finally { await runtime.close(); }
  console.info("WhatsApp Inbound Integration QA: PASS (signature gate, filtering, deduplication, continuity, isolation, Core boundary, no outbound delivery)");
} catch (error) { console.error(error); process.exit(1); }
