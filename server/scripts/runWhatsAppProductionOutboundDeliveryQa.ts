import { createHmac } from "node:crypto";
import type { Server } from "node:http";
import { createApp } from "../src/app.js";
import type { ServerRuntimeEnv } from "../src/config/env.js";
import { loadWhatsAppRuntimeConfig } from "../src/config/whatsappRuntimeConfig.js";
import type { WhatsAppGraphTransport } from "../src/channels/whatsapp/whatsappGraphClient.js";

const assert = (value: unknown, message: string): void => {
  if (!value) throw new Error(message);
};

const runtimeEnv = (
  env: Readonly<Record<string, string | undefined>>,
): ServerRuntimeEnv => ({
  nodeEnv: "test",
  port: 0,
  allowedOrigins: ["http://localhost:3000"],
  demoWidgetPublicKey: "qa-widget-key",
  rateLimitWindowMs: 60_000,
  rateLimitMaxRequests: 30,
  auditLogEnabled: false,
  activeAiProvider: "mock",
  whatsapp: loadWhatsAppRuntimeConfig(env),
});

const start = async (
  env: ServerRuntimeEnv,
  transport?: WhatsAppGraphTransport,
): Promise<{ baseUrl: string; close: () => Promise<void> }> => {
  const app = createApp(
    env,
    transport ? { whatsappGraphTransport: transport } : {},
  );
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

const postInbound = async (
  baseUrl: string,
  id: string,
  sender: string,
): Promise<Record<string, unknown>> => {
  const raw = JSON.stringify({
    object: "whatsapp_business_account",
    entry: [
      {
        changes: [
          {
            value: {
              messages: [
                {
                  id,
                  from: sender,
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
  const response = await fetch(`${baseUrl}/api/channels/whatsapp/webhook`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-hub-signature-256": signature,
    },
    body: raw,
  });
  assert(response.status === 200, "Webhook must acknowledge signed inbound traffic.");
  return await response.json() as Record<string, unknown>;
};

const base = {
  WHATSAPP_ENABLED: "true",
  WHATSAPP_VERIFY_TOKEN: "qa-verify-token",
  WHATSAPP_APP_SECRET: "qa-app-secret",
};

try {
  let disabledCalls = 0;
  const disabledTransport: WhatsAppGraphTransport = async () => {
    disabledCalls += 1;
    return Object.freeze({ status: 200, body: JSON.stringify({ messages: [{ id: "wamid.fake" }] }) });
  };
  const disabled = await start(
    runtimeEnv({
      ...base,
      WHATSAPP_ACCESS_TOKEN: "qa-access-token",
      WHATSAPP_PHONE_NUMBER_ID: "0000000000",
      WHATSAPP_GRAPH_API_VERSION: "v99.0",
    }),
    disabledTransport,
  );
  try {
    const body = await postInbound(disabled.baseUrl, "wamid.outbound-disabled", "56911111111");
    assert(body.processed === true && body.rejected === false, "Inbound-only fallback must remain operational.");
    assert(disabledCalls === 0, "Outbound delivery gate must default to zero transport calls.");
  } finally {
    await disabled.close();
  }

  let incompleteCalls = 0;
  const incompleteTransport: WhatsAppGraphTransport = async () => {
    incompleteCalls += 1;
    return Object.freeze({ status: 200, body: "{}" });
  };
  const incomplete = await start(
    runtimeEnv({
      ...base,
      WHATSAPP_OUTBOUND_DELIVERY_ENABLED: "true",
    }),
    incompleteTransport,
  );
  try {
    const body = await postInbound(incomplete.baseUrl, "wamid.outbound-incomplete", "56922222222");
    assert(body.processed === true && body.rejected === false, "Incomplete outbound config must not break inbound processing.");
    assert(incompleteCalls === 0, "Incomplete outbound config must never execute transport.");
  } finally {
    await incomplete.close();
  }

  let readyCalls = 0;
  let capturedEndpoint = "";
  let capturedBody = "";
  const fakeTransport: WhatsAppGraphTransport = async (request) => {
    readyCalls += 1;
    capturedEndpoint = request.endpoint;
    capturedBody = request.body;
    return Object.freeze({
      status: 200,
      body: JSON.stringify({ messages: [{ id: "wamid.fake-outbound" }] }),
    });
  };
  const ready = await start(
    runtimeEnv({
      ...base,
      WHATSAPP_OUTBOUND_DELIVERY_ENABLED: "true",
      WHATSAPP_ACCESS_TOKEN: "qa-access-token",
      WHATSAPP_PHONE_NUMBER_ID: "0000000000",
      WHATSAPP_GRAPH_API_VERSION: "v99.0",
    }),
    fakeTransport,
  );
  try {
    const body = await postInbound(ready.baseUrl, "wamid.outbound-ready", "56933333333");
    assert(body.processed === true && body.rejected === false, "Gated outbound composition must complete the controlled route.");
    assert(readyCalls === 1, "Ready outbound composition must execute exactly one injected transport call.");
    assert(
      capturedEndpoint === "https://graph.facebook.com/v99.0/0000000000/messages",
      "Outbound composition must target the validated Graph messages endpoint.",
    );
    const parsed = JSON.parse(capturedBody) as Record<string, unknown>;
    assert(parsed.to === "56933333333", "Recipient must be resolved only at the WhatsApp provider boundary.");
    assert(
      !JSON.stringify(body).includes("56933333333") &&
        !JSON.stringify(body).includes("wamid.fake-outbound"),
      "Webhook acknowledgement must not expose provider recipient or provider message ID.",
    );
  } finally {
    await ready.close();
  }

  console.info(
    "WhatsApp Production Outbound Delivery QA: PASS (explicit gate, incomplete-config fail-closed, injected delivery, zero live network)",
  );
} catch (error) {
  console.error(error);
  process.exit(1);
}
