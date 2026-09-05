import { getConversationHistory } from "../src/services/ephemeralConversationHistory.js";
import { ChannelConversationCorrelator } from "../src/services/channelConversationCorrelator.js";
import { ControlledChannelRouter } from "../src/services/controlledChannelRouter.js";
import { createChannelAdapterRegistry } from "../src/services/channelAdapterRegistry.js";
import { InMemoryConversationCorrelationStore } from "../src/services/inMemoryConversationCorrelationStore.js";
import { ConversationCorrelationError } from "../src/types/conversationCorrelation.js";
import type { AiProvider } from "../src/types/aiProvider.js";
import type { InboundChannelMessage } from "../src/types/channelMessage.js";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const rawInput = (externalConversationId?: string) => Object.freeze({ text: "Consulta de integración sintética", externalConversationId, externalUserId: "external-user-must-not-reach-core", receivedAt: "2026-09-04T00:00:00.000Z" });
const inbound = (externalConversationId: string): InboundChannelMessage => Object.freeze({ channel: "web", externalConversationId, externalUserId: "external-user-must-not-reach-core", messageType: "text", text: "Consulta de integración sintética", receivedAt: "2026-09-04T00:00:00.000Z" });
const providerRequests: string[] = [];
const provider: AiProvider = Object.freeze({ mode: "mock", async generate(request) { providerRequests.push(request.conversationId); return Object.freeze({ provider: "mock", text: "Respuesta integrada", grounded: false, sourceEntryIds: [] }); } });
type RouteResult = Awaited<ReturnType<ControlledChannelRouter["route"]>>;
type SuccessfulRoute = Extract<RouteResult, { ok: true }>;
const requireSuccess = (result: RouteResult): SuccessfulRoute => {
  if ("errorCode" in result) throw new Error(`Expected successful route, received ${result.errorCode}.`);
  return result;
};

try {
  const store = new InMemoryConversationCorrelationStore();
  const correlator = new ChannelConversationCorrelator(store);
  const router = new ControlledChannelRouter(createChannelAdapterRegistry(), correlator);
  const route = (channel: "web" | "widget", externalConversationId?: string, orbiConversationId?: string) => router.route({ channel, rawInput: rawInput(externalConversationId), activeProviderMode: "mock", providerOverride: provider, orbiConversationId });

  const first = requireSuccess(await route("web", "external-route-1"));
  const repeated = requireSuccess(await route("web", "external-route-1"));
  assert(first.outbound.conversationId === repeated.outbound.conversationId && first.outbound.conversationId !== "external-route-1", "Repeated external key must resolve one opaque internal conversation.");

  const authoritative = requireSuccess(await route("web", "external-route-1", "orbi-authoritative-id"));
  const afterAuthority = requireSuccess(await route("web", "external-route-1"));
  assert(authoritative.outbound.conversationId === "orbi-authoritative-id", "Explicit ORBI conversation ID must be authoritative.");
  assert(afterAuthority.outbound.conversationId === first.outbound.conversationId, "Authority use must not silently rebind external correlation.");

  const crossChannel = requireSuccess(await route("widget", "external-route-1"));
  assert(crossChannel.outbound.conversationId !== first.outbound.conversationId, "Web and widget must isolate same external key by channel.");

  const preservedWidget = requireSuccess(await route("widget", undefined, "existing-widget-orbi-id"));
  assert(preservedWidget.outbound.conversationId === "existing-widget-orbi-id", "Existing widget internal conversation continuity must remain compatible.");

  assert(getConversationHistory(first.outbound.conversationId).turnCount === 6, "Core history must exist before correlation release.");
  assert(correlator.release(inbound("external-route-1")).status === "released", "Exact correlation release must succeed.");
  assert(getConversationHistory(first.outbound.conversationId).turnCount === 6, "Correlation release must not delete Core conversation history.");
  const freshAfterRelease = requireSuccess(await route("web", "external-route-1"));
  assert(freshAfterRelease.outbound.conversationId !== first.outbound.conversationId, "Released key may create a fresh correlation without deleting the old conversation.");

  const capacityStore = new InMemoryConversationCorrelationStore(2);
  const capacityCorrelator = new ChannelConversationCorrelator(capacityStore);
  const capacityRouter = new ControlledChannelRouter(createChannelAdapterRegistry(), capacityCorrelator);
  const capacityRoute = (externalConversationId: string) => capacityRouter.route({ channel: "web", rawInput: rawInput(externalConversationId), activeProviderMode: "mock", providerOverride: provider });
  const capacityOne = requireSuccess(await capacityRoute("capacity-1"));
  const capacityTwo = requireSuccess(await capacityRoute("capacity-2"));
  const capacityExisting = requireSuccess(await capacityRoute("capacity-1"));
  const capacityNew = await capacityRoute("capacity-3");
  assert("errorCode" in capacityNew && capacityNew.errorCode === "CHANNEL_CORRELATION_FAILED", "Router must translate capacity failure without leaking internals.");
  let exactCapacityCode = false;
  try { capacityCorrelator.correlate(inbound("capacity-3")); } catch (error) { exactCapacityCode = error instanceof ConversationCorrelationError && error.code === "CORRELATION_CAPACITY_REACHED"; }
  assert(exactCapacityCode, "Correlator must retain the bounded capacity error.");
  assert(capacityCorrelator.release(inbound("capacity-2")).status === "released", "Exact release must free capacity.");
  requireSuccess(await capacityRoute("capacity-3"));

  assert(providerRequests.every((conversationId) => conversationId !== "external-route-1" && conversationId !== "external-user-must-not-reach-core"), "Core/provider must receive no external identity.");
  console.info("Correlation Integration QA: PASS (router authority, continuity, release, capacity, channel isolation, Core invisibility)");
} catch (error) { console.error(error); process.exit(1); }
