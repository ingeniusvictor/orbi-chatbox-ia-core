import express from "express";
import { createWidgetMessageRouter } from "../src/routes/widgetMessage.js";
import type { AiProvider } from "../src/types/aiProvider.js";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const provider: AiProvider = Object.freeze({ mode: "mock", async generate(request) { assert(request.message === "Prueba de integración de canal", "Route must send normalized adapter text to Core."); return Object.freeze({ provider: "mock", text: "Respuesta integrada", grounded: true, sourceEntryIds: ["orbi-sandbox-assistant"] }); } });

const start = async (): Promise<{ baseUrl: string; close: () => Promise<void> }> => {
  const app = express(); app.use(express.json()); app.use(createWidgetMessageRouter("key", "mock", provider));
  const server = await new Promise<import("node:http").Server>((resolve) => { const value = app.listen(0, "127.0.0.1", () => resolve(value)); });
  const address = server.address(); if (!address || typeof address === "string") throw new Error("Server address is unavailable.");
  return { baseUrl: `http://127.0.0.1:${address.port}`, close: async () => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())) };
};

try {
  const runtime = await start();
  try {
    const response = await fetch(`${runtime.baseUrl}/api/public/widget/key/message`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ channel: "web_demo", visitorId: "local-web-visitor", conversationId: "orbi-continuity", message: "Prueba de integración de canal", pageUrl: "http://localhost:3000", consentAccepted: true, timestamp: new Date().toISOString() }) });
    const body = await response.json() as Record<string, unknown>;
    assert(response.status === 200 && body.ok === true, "Existing HTTP route must remain successful.");
    assert(body.message === "Respuesta integrada" && body.conversationId === "orbi-continuity", "HTTP response shape and continuity must remain compatible.");
    assert(body.grounded === true && Array.isArray(body.sourceEntryIds), "Grounding metadata must remain compatible.");
  } finally { await runtime.close(); }
  console.info("Channel Routing Integration QA: PASS");
} catch (error) { console.error(error); process.exit(1); }
