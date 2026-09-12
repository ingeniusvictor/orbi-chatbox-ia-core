import { createHmac } from "node:crypto";
import type { Server } from "node:http";
import { createApp } from "../src/app.js";
import type { ServerRuntimeEnv } from "../src/config/env.js";
import { loadWhatsAppRuntimeConfig } from "../src/config/whatsappRuntimeConfig.js";

const assert = (value: unknown, message: string): void => {
  if (!value) throw new Error(message);
};

const whatsapp = loadWhatsAppRuntimeConfig({
  WHATSAPP_ENABLED: "true",
  WHATSAPP_VERIFY_TOKEN: "qa-verify-token",
  WHATSAPP_APP_SECRET: "qa-app-secret",
});

const runtimeEnv: ServerRuntimeEnv = {
  nodeEnv: "test",
  port: 0,
  allowedOrigins: ["http://localhost:3000"],
  demoWidgetPublicKey: "qa-widget-key",
  rateLimitWindowMs: 60_000,
  rateLimitMaxRequests: 30,
  auditLogEnabled: false,
  activeAiProvider: "mock",
  whatsapp,
};

const start = async (): Promise<{ baseUrl: string; close: () => Promise<void> }> => {
  const app = createApp(runtimeEnv);
  const server = await new Promise<Server>((resolve) => {
    const value = app.listen(0, "127.0.0.1", () => resolve(value));
  });
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("QA listener unavailable.");
  return {
    baseUrl: `http://127.0.0.1:${address.port}`,
    close: async () =>
      new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      ),
  };
};

try {
  const runtime = await start();
  try {
    const raw = JSON.stringify({
      object: "whatsapp_business_account",
      entry: [
        {
          changes: [
            {
              value: {
                messages: [
                  {
                    id: "wamid.production-composition.qa",
                    from: "56912345678",
                    type: "text",
                    text: { body: "Hola LUMI" },
                    timestamp: "1789171200",
                  },
                ],
              },
            },
          ],
        },
      ],
    });
    const signature = `sha256=${createHmac("sha256", "qa-app-secret").update(raw).digest("hex")}`;

    const response = await fetch(`${runtime.baseUrl}/api/channels/whatsapp/webhook`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-hub-signature-256": signature,
      },
      body: raw,
    });
    const body = await response.json() as Record<string, unknown>;

    assert(response.status === 200, "Signed WhatsApp webhook must be acknowledged.");
    assert(body.accepted === true, "Webhook must remain accepted at the Meta boundary.");
    assert(
      body.processed === true && body.rejected === false,
      "Actual app composition must admit WhatsApp through its dedicated commercial runtime.",
    );
    assert(
      body.mode === "sandbox" && body.production === false,
      "0K-26D.3 must not enable production delivery yet.",
    );
    assert(
      !JSON.stringify(body).includes("56912345678") &&
        !JSON.stringify(body).includes("Hola LUMI"),
      "Webhook acknowledgement must not leak external identity or message content.",
    );
  } finally {
    await runtime.close();
  }

  console.info(
    "WhatsApp Production Webhook Composition QA: PASS (app runtime injection, signed ingress, zero outbound)",
  );
} catch (error) {
  console.error(error);
  process.exit(1);
}
