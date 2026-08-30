import { Router } from "express";
import { createSandboxError } from "../security/errorResponses.js";
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
    const payload: WidgetMessageResponse = {
      ok: true,
      mode: "sandbox",
      received: true,
      leadCreated: false,
      handoffRecommended: false,
      message:
        "Mensaje recibido en modo sandbox. No se creó lead real ni se ejecutó automatización productiva.",
      guardrails: SANDBOX_GUARDRAILS,
      processedAt: processed.receivedAt,
      normalizedChannel: processed.channel,
      requestId: processed.requestId,
      normalizedMessage: processed.normalizedMessage,
      messageLength: processed.messageLength,
      processingMode: processed.processingMode,
      intent: processed.intent,
    };

    response.json(payload);
  });

  return router;
};
