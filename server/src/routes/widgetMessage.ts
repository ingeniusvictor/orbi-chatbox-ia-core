import { Router } from "express";
import { createSandboxError } from "../security/errorResponses.js";
import { buildConversationEnvelope } from "../services/conversationEnvelope.js";
import { buildKnowledgeContext } from "../services/knowledgeContextBuilder.js";
import { processValidatedWidgetMessage } from "../services/widgetMessageProcessor.js";
import type { WidgetMessageResponse } from "../types/widget.js";
import { validateWidgetMessagePayload } from "../validation/widgetPayload.js";

const SANDBOX_GUARDRAILS = [
  "Sandbox local",
  "Sin WhatsApp real",
  "Sin datos reales",
  "Sin base de datos",
  "Sin IA externa",
];

export const createWidgetMessageRouter = (demoWidgetPublicKey: string): Router => {
  const router = Router();

  router.post("/api/public/widget/:publicKey/message", (request, response) => {
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
    const payload: WidgetMessageResponse = {
      ok: true,
      mode: "sandbox",
      received: true,
      leadCreated: false,
      handoffRecommended: false,
      message:
        "Mensaje recibido en modo sandbox. No se creó lead real ni se ejecutó automatización productiva.",
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
  });

  return router;
};
