import { Router } from "express";
import type { WhatsAppRuntimeConfig } from "../config/whatsappRuntimeConfig.js";
import { classifyWhatsAppWebhookEvent, parseWhatsAppWebhookEnvelope } from "../channels/whatsapp/whatsappWebhookEnvelope.js";
import { classifyWhatsAppWebhookEvents } from "../channels/whatsapp/whatsappInboundText.js";
import { InMemoryWhatsAppInboundDeduplicationStore } from "../channels/whatsapp/inMemoryWhatsAppInboundDeduplicationStore.js";
import { verifyWhatsAppWebhookSignature } from "../channels/whatsapp/whatsappWebhookSignature.js";
import { createChannelAdapterRegistry } from "../services/channelAdapterRegistry.js";
import { ControlledChannelRouter } from "../services/controlledChannelRouter.js";
import { createSandboxError } from "../security/errorResponses.js";
import type { AiProvider, AiProviderMode } from "../types/aiProvider.js";
import type { ChannelDeliveryAdapter } from "../types/channelDeliveryAdapter.js";
import type { WhatsAppInboundTextEvent } from "../channels/whatsapp/whatsappInboundText.js";

const verifyMode = "subscribe";
const webhookReady = (config: WhatsAppRuntimeConfig): boolean => config.readiness === "ready-for-webhook" || config.readiness === "ready-for-api";
const rawBody = (value: unknown): Buffer | undefined => Buffer.isBuffer(value) ? value : undefined;

/** Explicit test/local composition only. Absent by default, so webhook ACKs never send outbound traffic. */
export type WhatsAppOutboundDeliveryIntegration = Readonly<{
  createDeliveryAdapter: (event: Readonly<WhatsAppInboundTextEvent>) => ChannelDeliveryAdapter;
}>;

/** Development/test-only webhook boundary. It acknowledges inbound text but never sends Meta replies. */
export const createWhatsAppWebhookRouter = (
  config: WhatsAppRuntimeConfig,
  activeProviderMode: AiProviderMode = "mock",
  providerOverride?: AiProvider,
  outboundIntegration?: Readonly<WhatsAppOutboundDeliveryIntegration>,
): Router => {
  const router = Router();
  const routerService = new ControlledChannelRouter(createChannelAdapterRegistry(config));
  const deduplication = new InMemoryWhatsAppInboundDeduplicationStore();

  router.get("/api/channels/whatsapp/webhook", (request, response) => {
    if (!webhookReady(config)) {
      const error = createSandboxError(503, "WHATSAPP_CHANNEL_UNAVAILABLE", "WhatsApp webhook is not configured for development.");
      response.status(error.statusCode).json(error.body);
      return;
    }
    const mode = typeof request.query["hub.mode"] === "string" ? request.query["hub.mode"] : "";
    const token = typeof request.query["hub.verify_token"] === "string" ? request.query["hub.verify_token"] : "";
    const challenge = typeof request.query["hub.challenge"] === "string" ? request.query["hub.challenge"] : "";
    if (mode !== verifyMode || !challenge || token !== config.verifyToken) {
      const error = createSandboxError(403, "WHATSAPP_WEBHOOK_VERIFICATION_FAILED", "Webhook verification was rejected.");
      response.status(error.statusCode).json(error.body);
      return;
    }
    response.type("text/plain").status(200).send(challenge);
  });

  router.post("/api/channels/whatsapp/webhook", async (request, response) => {
    if (!webhookReady(config)) {
      const error = createSandboxError(503, "WHATSAPP_CHANNEL_UNAVAILABLE", "WhatsApp webhook is not configured for development.");
      response.status(error.statusCode).json(error.body); return;
    }
    const raw = rawBody(request.body);
    if (!raw || !config.appSecret) {
      const error = createSandboxError(503, "WHATSAPP_WEBHOOK_SIGNATURE_UNAVAILABLE", "Webhook signature verification is not configured.");
      response.status(error.statusCode).json(error.body); return;
    }
    const signature = request.header("x-hub-signature-256") ?? undefined;
    if (!verifyWhatsAppWebhookSignature(raw, signature, config.appSecret).ok) {
      const error = createSandboxError(403, "WHATSAPP_WEBHOOK_SIGNATURE_INVALID", "Webhook signature was rejected.");
      response.status(error.statusCode).json(error.body); return;
    }
    let payload: unknown;
    try { payload = JSON.parse(raw.toString("utf8")); } catch {
      const error = createSandboxError(400, "WHATSAPP_WEBHOOK_INVALID_PAYLOAD", "Webhook payload is invalid.");
      response.status(error.statusCode).json(error.body); return;
    }
    const envelope = parseWhatsAppWebhookEnvelope(payload);
    if (!envelope) {
      const error = createSandboxError(400, "WHATSAPP_WEBHOOK_INVALID_PAYLOAD", "Webhook payload is invalid.");
      response.status(error.statusCode).json(error.body); return;
    }
    let processed = 0;
    let duplicate = 0;
    let rejected = 0;
    for (const event of classifyWhatsAppWebhookEvents(payload)) {
      if (event.kind !== "inbound-text") continue;
      const reservation = deduplication.reserve(event.event.providerMessageId);
      if (reservation === "duplicate") { duplicate += 1; continue; }
      if (reservation === "capacity") { rejected += 1; continue; }
      const routed = outboundIntegration
        ? await routerService.routeInboundWithDelivery({ channel: "whatsapp", rawInput: event.event, activeProviderMode, providerOverride }, outboundIntegration.createDeliveryAdapter(event.event))
        : await routerService.routeInboundOnly({ channel: "whatsapp", rawInput: event.event, activeProviderMode, providerOverride });
      if (routed.ok) processed += 1;
      else { deduplication.release(event.event.providerMessageId); rejected += 1; }
    }
    // Envelope and provider identifiers are discarded here; no provider reply is attempted.
    response.status(200).json(Object.freeze({ ok: true, mode: "sandbox", accepted: true, event: classifyWhatsAppWebhookEvent(envelope), processed: processed > 0, duplicate: duplicate > 0, rejected: rejected > 0, production: false }));
  });

  return router;
};
