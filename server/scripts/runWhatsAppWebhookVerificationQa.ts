import express from "express";
import { createHmac } from "node:crypto";
import { loadWhatsAppRuntimeConfig } from "../src/config/whatsappRuntimeConfig.js";
import { createWhatsAppWebhookRouter } from "../src/routes/whatsappWebhook.js";
import { createWhatsAppWebhookRawBodyMiddleware } from "../src/middleware/whatsAppWebhookRawBody.js";
import { createWhatsAppQaCommercialRuntime } from "./createWhatsAppQaCommercialRuntime.js";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const start = async (): Promise<{ baseUrl: string; close: () => Promise<void> }> => {
  const app = express(); app.use("/api/channels/whatsapp/webhook", createWhatsAppWebhookRawBodyMiddleware()); app.use(express.json()); app.use(createWhatsAppWebhookRouter(loadWhatsAppRuntimeConfig({ WHATSAPP_ENABLED: "true", WHATSAPP_VERIFY_TOKEN: "qa-verify-token", WHATSAPP_APP_SECRET: "qa-app-secret" }), "mock", undefined, undefined, createWhatsAppQaCommercialRuntime()));
  const server = await new Promise<import("node:http").Server>((resolve) => { const value = app.listen(0, "127.0.0.1", () => resolve(value)); });
  const address = server.address(); if (!address || typeof address === "string") throw new Error("Webhook QA listener is unavailable.");
  return { baseUrl: `http://127.0.0.1:${address.port}`, close: async () => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())) };
};

try {
  const runtime = await start();
  try {
    const verified = await fetch(`${runtime.baseUrl}/api/channels/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=qa-verify-token&hub.challenge=challenge-value`);
    assert(verified.status === 200 && await verified.text() === "challenge-value", "Valid verification must return only the challenge.");
    const rejected = await fetch(`${runtime.baseUrl}/api/channels/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=wrong&hub.challenge=challenge-value`);
    assert(rejected.status === 403, "Invalid verification token must reject safely.");
    const raw = JSON.stringify({ object: "whatsapp_business_account", entry: [{ changes: [{ value: { messages: [{ id: "external-message", from: "external-user", type: "text", text: { body: "Hola" }, timestamp: "1757030400" }] } }] }] });
    const signature = `sha256=${createHmac("sha256", "qa-app-secret").update(raw).digest("hex")}`;
    const validPost = await fetch(`${runtime.baseUrl}/api/channels/whatsapp/webhook`, { method: "POST", headers: { "content-type": "application/json", "x-hub-signature-256": signature }, body: raw });
    const validBody = await validPost.json() as Record<string, unknown>;
    assert(validPost.status === 200 && validBody.accepted === true && validBody.event === "message-candidate" && validBody.processed === true && !("entry" in validBody), "POST must acknowledge without leaking a raw payload or Meta reply.");
    const invalidRaw = JSON.stringify({ object: "other" });
    const invalidSignature = `sha256=${createHmac("sha256", "qa-app-secret").update(invalidRaw).digest("hex")}`;
    const invalidPost = await fetch(`${runtime.baseUrl}/api/channels/whatsapp/webhook`, { method: "POST", headers: { "content-type": "application/json", "x-hub-signature-256": invalidSignature }, body: invalidRaw });
    assert(invalidPost.status === 400, "Invalid webhook envelope must reject safely.");
  } finally { await runtime.close(); }
  console.info("WhatsApp Webhook Verification QA: PASS (GET challenge, invalid rejection, POST boundary acknowledgement)");
} catch (error) { console.error(error); process.exit(1); }
