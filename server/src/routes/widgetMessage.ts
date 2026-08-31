import { Router } from "express";
import { resolveAiProvider } from "../providers/aiProviderRegistry.js";
import { QwenLocalProviderError } from "../providers/qwenLocalProvider.js";
import { createSandboxError } from "../security/errorResponses.js";
import { buildConversationEnvelope } from "../services/conversationEnvelope.js";
import { getAssistantIdentity } from "../services/assistantIdentity.js";
import { composeAssistantInstruction } from "../services/assistantInstructionComposer.js";
import { composeCompactAssistantRuntimeInstruction } from "../services/assistantRuntimeInstructionComposer.js";
import { buildKnowledgeContext } from "../services/knowledgeContextBuilder.js";
import { processValidatedWidgetMessage } from "../services/widgetMessageProcessor.js";
import type { AiProvider, AiProviderMode, AiProviderRequest } from "../types/aiProvider.js";
import type { WidgetMessageResponse } from "../types/widget.js";
import { validateWidgetMessagePayload } from "../validation/widgetPayload.js";

const SANDBOX_GUARDRAILS = [
  "Sandbox local",
  "Sin WhatsApp real",
  "Sin datos reales",
  "Sin base de datos",
  "Sin IA externa",
];

export const createWidgetMessageRouter = (
  demoWidgetPublicKey: string,
  activeProviderMode: AiProviderMode,
  providerOverride?: AiProvider,
): Router => {
  const router = Router();

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

      const processed = processValidatedWidgetMessage(validation.payload);
      const knowledgeContext = buildKnowledgeContext(processed.normalizedMessage);
      const envelope = buildConversationEnvelope(validation.payload, processed, knowledgeContext);
      const assistantInstruction = composeAssistantInstruction(getAssistantIdentity());
      const assistantRuntimeInstruction = composeCompactAssistantRuntimeInstruction(assistantInstruction);
      const providerRequest: Readonly<AiProviderRequest> = Object.freeze({
        requestId: envelope.requestId,
        conversationId: envelope.conversationId,
        message: envelope.message.text,
        knowledgeContext: envelope.knowledgeContext,
        assistantInstruction,
        assistantRuntimeInstruction,
      });
      const provider = providerOverride ?? resolveAiProvider(activeProviderMode);
      const providerResponse = await provider.generate(providerRequest);
      const payload: WidgetMessageResponse = {
        ok: true,
        mode: "sandbox",
        received: true,
        leadCreated: false,
        handoffRecommended: false,
        message: providerResponse.text,
        responseMode: providerResponse.provider === "mock" ? "provider-mock" : "provider-qwen-local",
        provider: providerResponse.provider,
        grounded: providerResponse.grounded,
        sourceEntryIds: providerResponse.sourceEntryIds,
        guardrails: SANDBOX_GUARDRAILS,
        processedAt: envelope.runtime.receivedAt,
        normalizedChannel: envelope.source.channel,
        requestId: envelope.requestId,
        conversationId: envelope.conversationId,
        normalizedMessage: envelope.message.text,
        messageLength: envelope.message.length,
        processingMode: envelope.runtime.mode,
        intent: envelope.runtime.intent,
        knowledge: {
          source: envelope.knowledgeContext.source,
          matchCount: envelope.knowledgeContext.matchCount,
          entryIds: envelope.knowledgeContext.entries.map((entry) => entry.id),
          truncated: envelope.knowledgeContext.truncated,
        },
      };

      response.json(payload);
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
