import { Router } from "express";
import type { WidgetMessageRequest, WidgetMessageResponse } from "../types/widget.js";

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
      response.status(403).json({
        ok: false,
        mode: "sandbox",
        message: "Invalid demo widget public key.",
      });
      return;
    }

    const body = request.body as WidgetMessageRequest | undefined;

    if (
      !body ||
      typeof body.message !== "string" ||
      body.message.trim().length === 0 ||
      body.message.length > 2_000
    ) {
      response.status(400).json({
        ok: false,
        mode: "sandbox",
        message: "Message must be a non-empty string with at most 2000 characters.",
      });
      return;
    }

    if (body.consentAccepted !== true) {
      response.status(400).json({
        ok: false,
        mode: "sandbox",
        message: "Consent must be accepted in sandbox mode.",
      });
      return;
    }

    const payload: WidgetMessageResponse = {
      ok: true,
      mode: "sandbox",
      received: true,
      leadCreated: false,
      handoffRecommended: false,
      message:
        "Mensaje recibido en modo sandbox. No se creó lead real ni se ejecutó automatización productiva.",
      guardrails: SANDBOX_GUARDRAILS,
    };

    response.json(payload);
  });

  return router;
};
