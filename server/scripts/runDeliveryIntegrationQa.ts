import express from "express";
import { webChannelAdapter } from "../src/adapters/webChannelAdapter.js";
import { createWidgetMessageRouter } from "../src/routes/widgetMessage.js";
import { ChannelDeliveryService } from "../src/services/channelDeliveryService.js";
import { ChannelConversationCorrelator } from "../src/services/channelConversationCorrelator.js";
import { ControlledChannelRouter } from "../src/services/controlledChannelRouter.js";
import { InMemoryConversationCorrelationStore } from "../src/services/inMemoryConversationCorrelationStore.js";
import { InMemoryDeliveryLifecycleStore } from "../src/services/inMemoryDeliveryLifecycleStore.js";
import type { ChannelDeliveryAdapter } from "../src/types/channelDeliveryAdapter.js";
import type { AiProvider } from "../src/types/aiProvider.js";
import type { InboundChannelMessage } from "../src/types/channelMessage.js";
import type { OutboundDeliveryResult } from "../src/types/outboundDelivery.js";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const provider: AiProvider = Object.freeze({ mode: "mock", async generate(request) { return Object.freeze({ provider: "mock", text: `Respuesta para ${request.message}`, grounded: false, sourceEntryIds: [] }); } });
const rawInput = (externalConversationId = "external-integration"): Readonly<{ text: string; externalConversationId: string; receivedAt: string }> =>
  Object.freeze({ text: "Consulta integrada", externalConversationId, receivedAt: "2026-09-05T00:00:00.000Z" });
const inbound = (externalConversationId: string): InboundChannelMessage => Object.freeze({ channel: "web", externalConversationId, messageType: "text", text: "Consulta integrada", receivedAt: "2026-09-05T00:00:00.000Z" });
const successAdapter = (calls: { value: number }): ChannelDeliveryAdapter => Object.freeze({
  async deliver(request): Promise<Readonly<OutboundDeliveryResult>> {
    calls.value += 1;
    return Object.freeze({ deliveryId: request.deliveryId, channel: request.channel, status: "delivered", completedAt: "2026-09-05T00:00:01.000Z" });
  },
});
const requireSuccess = <T extends Awaited<ReturnType<ControlledChannelRouter["route"]>>>(result: T): Extract<T, { ok: true }> => {
  if ("errorCode" in result) throw new Error(`Expected router success, received ${result.errorCode}.`);
  return result as Extract<T, { ok: true }>;
};

const startHttp = async (): Promise<{ baseUrl: string; close: () => Promise<void> }> => {
  const app = express();
  app.use(express.json());
  app.use(createWidgetMessageRouter("key", "mock", provider));
  const server = await new Promise<import("node:http").Server>((resolve) => { const value = app.listen(0, "127.0.0.1", () => resolve(value)); });
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("HTTP test listener is unavailable.");
  return { baseUrl: `http://127.0.0.1:${address.port}`, close: async () => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())) };
};

try {
  const lifecycle = new InMemoryDeliveryLifecycleStore();
  const correlations = new InMemoryConversationCorrelationStore();
  const correlator = new ChannelConversationCorrelator(correlations);
  const delivery = new ChannelDeliveryService(lifecycle);
  const calls = { value: 0 };
  const router = new ControlledChannelRouter(undefined, correlator, successAdapter(calls), delivery);
  const first = requireSuccess(await router.route({ channel: "web", rawInput: rawInput(), activeProviderMode: "mock", providerOverride: provider }));
  assert(first.delivery.status === "delivered" && lifecycle.resolve(first.delivery.deliveryId)?.status === "delivered", "Canonical router must create and complete a delivery lifecycle.");
  assert(calls.value === 1 && first.delivery.deliveryId !== first.outbound.conversationId && first.delivery.deliveryId !== "external-integration", "Delivery ID must be internal and adapter executes once.");
  const repeated = requireSuccess(await router.route({ channel: "web", rawInput: rawInput(), activeProviderMode: "mock", providerOverride: provider }));
  assert(repeated.outbound.conversationId === first.outbound.conversationId, "Correlation must preserve internal conversation continuity independently of delivery IDs.");
  assert(repeated.delivery.deliveryId !== first.delivery.deliveryId && calls.value === 2, "Each new Core response creates one independent delivery.");

  const failureLifecycle = new InMemoryDeliveryLifecycleStore();
  const failingAdapter: ChannelDeliveryAdapter = Object.freeze({ async deliver(request): Promise<Readonly<OutboundDeliveryResult>> { return Object.freeze({ deliveryId: request.deliveryId, channel: request.channel, status: "failed", completedAt: "2026-09-05T00:00:01.000Z", errorCode: "DELIVERY_FAILED" }); } });
  const failureRouter = new ControlledChannelRouter(undefined, correlator, failingAdapter, new ChannelDeliveryService(failureLifecycle));
  const failed = await failureRouter.route({ channel: "web", rawInput: rawInput("external-failure"), activeProviderMode: "mock", providerOverride: provider });
  assert("errorCode" in failed && failed.errorCode === "CHANNEL_DELIVERY_FAILED", "Delivery failure must be controlled at the routing boundary.");
  assert(correlator.correlate(inbound("external-failure")).internalRef !== undefined, "Delivery failure must not mutate or remove correlation.");

  assert(delivery.release(first.delivery.deliveryId), "Delivery lifecycle release must succeed for the exact terminal record.");
  assert(lifecycle.resolve(first.delivery.deliveryId) === undefined, "Release must remove only the selected delivery lifecycle record.");
  assert(correlator.correlate(inbound("external-integration")).internalRef?.conversationId === first.outbound.conversationId, "Delivery release must not affect correlation.");
  assert(correlator.release(inbound("external-integration")).status === "released", "Correlation release must remain independent.");
  assert(lifecycle.resolve(repeated.delivery.deliveryId)?.status === "delivered", "Correlation release must not affect delivery lifecycle.");

  const capacity = new InMemoryDeliveryLifecycleStore(100);
  for (let index = 0; index < 100; index += 1) capacity.createPending({ deliveryId: `capacity-${index}`, channel: "web", conversationId: "orbi-capacity", responseType: "text", responseText: "Respuesta", createdAt: "2026-09-05T00:00:00.000Z" });
  let capacityRejected = false;
  try { capacity.createPending({ deliveryId: "capacity-overflow", channel: "web", conversationId: "orbi-capacity", responseType: "text", responseText: "Respuesta", createdAt: "2026-09-05T00:00:00.000Z" }); } catch (error) { capacityRejected = error instanceof Error && error.name === "DeliveryLifecycleError"; }
  assert(capacityRejected && capacity.resolve("capacity-0")?.status === "pending", "Capacity must reject new records without evicting existing records.");
  capacity.markDelivered("capacity-0", "2026-09-05T00:00:01.000Z");
  assert(capacity.release("capacity-0"), "Exact terminal release must restore capacity.");
  assert(capacity.createPending({ deliveryId: "capacity-reused", channel: "web", conversationId: "orbi-capacity", responseType: "text", responseText: "Respuesta", createdAt: "2026-09-05T00:00:00.000Z" }).status === "pending", "Released capacity must be reusable.");

  const http = await startHttp();
  try {
    const payload = { channel: "web_demo", visitorId: "local-web-visitor", conversationId: "orbi-http-continuity", message: "Consulta HTTP compatible", pageUrl: "http://localhost:3000", consentAccepted: true, timestamp: new Date().toISOString() };
    const firstHttp = await fetch(`${http.baseUrl}/api/public/widget/key/message`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    const firstBody = await firstHttp.json() as Record<string, unknown>;
    const secondHttp = await fetch(`${http.baseUrl}/api/public/widget/key/message`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    const secondBody = await secondHttp.json() as Record<string, unknown>;
    assert(firstHttp.status === 200 && firstBody.ok === true && firstBody.conversationId === "orbi-http-continuity", "Existing HTTP contract must remain compatible without a delivery ID field.");
    assert(secondHttp.status === 200 && secondBody.conversationId === "orbi-http-continuity" && !("deliveryId" in firstBody), "Frontend remains unaware of delivery lifecycle infrastructure.");
  } finally { await http.close(); }
  assert(webChannelAdapter.channel === "web", "Web adapter remains the canonical transport formatter.");
  console.info("Delivery Integration QA: PASS (canonical route, lifecycle, correlation separation, capacity, HTTP compatibility, no provider delivery)");
} catch (error) { console.error(error); process.exit(1); }
