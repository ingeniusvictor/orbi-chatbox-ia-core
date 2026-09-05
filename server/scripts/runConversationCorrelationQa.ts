import { ChannelConversationCorrelator } from "../src/services/channelConversationCorrelator.js";
import { InMemoryConversationCorrelationStore } from "../src/services/inMemoryConversationCorrelationStore.js";
import { ConversationCorrelationError } from "../src/types/conversationCorrelation.js";
import type { InboundChannelMessage } from "../src/types/channelMessage.js";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const inbound = (channel: InboundChannelMessage["channel"], externalConversationId?: string): InboundChannelMessage => Object.freeze({ channel, externalConversationId, externalUserId: "external-user-only", messageType: "text", text: "Mensaje sintético", receivedAt: "2026-09-04T00:00:00.000Z" });

try {
  const store = new InMemoryConversationCorrelationStore();
  const correlator = new ChannelConversationCorrelator(store);
  const first = correlator.correlate(inbound("web", "visitor-001"));
  const repeated = correlator.correlate(inbound("web", "visitor-001"));
  const crossChannel = correlator.correlate(inbound("whatsapp", "visitor-001"));
  const noExternalKey = correlator.correlate(inbound("web"));
  const preserved = correlator.correlate(inbound("web", "ignored-external"), "orbi-internal-conversation");
  assert(first.status === "created" && first.internalRef, "First external key must create an internal reference.");
  assert(repeated.status === "resolved" && repeated.internalRef?.conversationId === first.internalRef.conversationId, "Same channel/key must preserve continuity.");
  assert(crossChannel.status === "created" && crossChannel.internalRef?.conversationId !== first.internalRef.conversationId, "Same external ID must not collide across channels.");
  assert(noExternalKey.status === "not-applicable" && !noExternalKey.internalRef, "External user identity alone must not become a correlation key.");
  assert(preserved.status === "preserved" && preserved.internalRef?.conversationId === "orbi-internal-conversation", "Existing ORBI IDs must remain authoritative for web/widget continuity.");
  let invalidKeyRejected = false;
  try { store.resolve({ channel: "web", externalConversationId: " " }); } catch (error) { invalidKeyRejected = error instanceof ConversationCorrelationError && error.code === "CORRELATION_KEY_INVALID"; }
  assert(invalidKeyRejected, "Invalid external keys must fail with a bounded error.");
  console.info("Conversation Correlation QA: PASS (ephemeral, channel-aware, no identity conversion)");
} catch (error) { console.error(error); process.exit(1); }
