import { Router } from "express";
import { QwenLocalProviderError } from "../providers/qwenLocalProvider.js";
import { createSandboxError } from "../security/errorResponses.js";
import { ControlledChannelRouter } from "../services/controlledChannelRouter.js";
import type { AiProvider, AiProviderMode } from "../types/aiProvider.js";
import { validateWidgetMessagePayload } from "../validation/widgetPayload.js";

export const createWidgetMessageRouter = (
  demoWidgetPublicKey: string,
  activeProviderMode: AiProviderMode,
  providerOverride?: AiProvider,
): Router => {
  const router = Router();
  const channelRouter = new ControlledChannelRouter();

  router.post("/api/public/widget/:publicKey/message", async (request, response, next) => {
    try {
      if (request.params.publicKey !== demoWidgetPublicKey) {
        const error = createSandboxError(403, "INVALID_PUBLIC_KEY", "Invalid demo widget public key.");
        response.status(error.statusCode).json(error.body);
        return;
      }

      const validation = validateWidgetMessagePayload(request.body);
      if (validation.ok === false) {
        const error = createSandboxError(
          validation.statusCode,
          validation.errorCode,
          validation.message,
        );
        response.status(error.statusCode).json(error.body);
        return;
      }

      const routed = await channelRouter.route({
        channel: "web",
        rawInput: {
          text: validation.payload.message,
          externalUserId: validation.payload.visitorId,
          receivedAt: validation.payload.timestamp,
          pageUrl: validation.payload.pageUrl,
        },
        activeProviderMode,
        providerOverride,
        // This field is an existing ORBI conversation ID from the local client, never an external ID.
        orbiConversationId: validation.payload.conversationId,
      });
      if (routed.ok === false) {
        const error = createSandboxError(
          routed.errorCode === "CHANNEL_NORMALIZATION_FAILED" ? 400 : 503,
          routed.errorCode === "CHANNEL_NORMALIZATION_FAILED" ? "INVALID_MESSAGE" : "INTERNAL_SANDBOX_ERROR",
          routed.errorCode === "CHANNEL_NORMALIZATION_FAILED" ? "Channel message is invalid." : "Channel routing is unavailable in this local sandbox.",
        );
        response.status(error.statusCode).json(error.body);
        return;
      }
      const metadata = routed.outbound.metadata;
      response.json({
        ok: true,
        mode: "sandbox",
        received: true,
        leadCreated: false,
        handoffRecommended: false,
        message: routed.outbound.text,
        responseMode: metadata?.provider === "qwen-local" ? "provider-qwen-local" : "provider-mock",
        provider: metadata?.provider ?? "mock",
        grounded: metadata?.grounded ?? false,
        sourceEntryIds: metadata?.sourceEntryIds ?? [],
        guardrails: ["Sandbox local", "Sin WhatsApp real", "Sin datos reales", "Sin base de datos", "Sin IA externa"],
        processedAt: routed.outbound.createdAt,
        normalizedChannel: validation.payload.channel,
        requestId: metadata?.requestId ?? "channel-routing-request",
        conversationId: routed.outbound.conversationId,
        normalizedMessage: metadata?.normalizedMessage ?? validation.payload.message,
        messageLength: metadata?.messageLength ?? validation.payload.message.length,
        processingMode: metadata?.processingMode ?? "sandbox",
        intent: metadata?.intent ?? "unclassified",
        knowledge: {
          source: metadata?.knowledge?.source ?? "local-static",
          matchCount: metadata?.knowledge?.matchCount ?? 0,
          entryIds: metadata?.sourceEntryIds ?? [],
          truncated: metadata?.knowledge?.truncated ?? false,
        },
      });
    } catch (error) {
      if (error instanceof QwenLocalProviderError) {
        const providerError = createSandboxError(
          error.code === "LOCAL_AI_INVALID_RESPONSE" ? 502 : 503,
          error.code,
          "Configured local AI provider is unavailable.",
        );
        response.status(providerError.statusCode).json(providerError.body);
        return;
      }
      next(error);
    }
  });

  return router;
};
