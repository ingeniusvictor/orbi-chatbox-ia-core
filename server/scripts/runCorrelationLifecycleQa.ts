import { ChannelConversationCorrelator } from "../src/services/channelConversationCorrelator.js";
import { InMemoryConversationCorrelationStore } from "../src/services/inMemoryConversationCorrelationStore.js";
import { ConversationCorrelationError } from "../src/types/conversationCorrelation.js";
import type { InboundChannelMessage } from "../src/types/channelMessage.js";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const inbound = (channel: InboundChannelMessage["channel"], externalConversationId?: string): InboundChannelMessage => Object.freeze({ channel, externalConversationId, externalUserId: "external-user-only", messageType: "text", text: "Mensaje sintético", receivedAt: "2026-09-04T00:00:00.000Z" });

try {
  const store = new InMemoryConversationCorrelationStore();
  const correlator = new ChannelConversationCorrelator(store);
  const key = { channel: "web" as const, externalConversationId: "external-123" };
  const initialRef = { conversationId: "orbi-conversation-A" };
  const first = store.bind(key, initialRef);
  const repeated = store.bind(key, initialRef);
  let conflictRejected = false;
  try { store.bind(key, { conversationId: "orbi-conversation-B" }); } catch (error) { conflictRejected = error instanceof ConversationCorrelationError && error.code === "CORRELATION_CONFLICT"; }
  assert(first.conversationId === repeated.conversationId, "Same mapping must bind idempotently.");
  assert(conflictRejected, "Conflicting remap must be rejected.");
  assert(store.resolve(key)?.conversationId === "orbi-conversation-A", "Conflict must not silently replace a mapping.");
  const released = correlator.release(inbound("web", "external-123"));
  assert(released.status === "released" && !store.resolve(key), "Exact release must remove only the correlation mapping.");
  const web = correlator.correlate(inbound("web", "shared-id"));
  const whatsapp = correlator.correlate(inbound("whatsapp", "shared-id"));
  assert(web.internalRef?.conversationId !== whatsapp.internalRef?.conversationId, "Channel keys must remain isolated.");
  assert(correlator.release(inbound("web", "shared-id")).status === "released" && correlator.correlate(inbound("whatsapp", "shared-id")).status === "resolved", "Release on one channel must not affect another.");
  const authoritative = correlator.correlate(inbound("web", "shared-id"), "existing-orbi-conversation");
  assert(authoritative.status === "preserved" && authoritative.internalRef?.conversationId === "existing-orbi-conversation", "Explicit internal ORBI conversation must remain authoritative.");
  assert(correlator.correlate(inbound("web")).status === "not-applicable", "External user ID alone must not drive correlation.");
  console.info("Correlation Lifecycle QA: PASS (idempotent, conflict-safe, exact release, authority preserved)");
} catch (error) { console.error(error); process.exit(1); }
