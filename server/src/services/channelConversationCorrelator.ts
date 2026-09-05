import type { InboundChannelMessage } from "../types/channelMessage.js";
import type { ConversationCorrelationResult, ConversationCorrelationStore, ExternalConversationKey } from "../types/conversationCorrelation.js";
import { createInternalConversationRef, toInternalConversationRef } from "./internalConversationIdentity.js";
import { InMemoryConversationCorrelationStore } from "./inMemoryConversationCorrelationStore.js";

/** Correlation boundary only: it never exposes external identifiers to ORBI Core. */
export class ChannelConversationCorrelator {
  constructor(private readonly store: ConversationCorrelationStore = new InMemoryConversationCorrelationStore()) {}

  correlate(inbound: Readonly<InboundChannelMessage>, existingInternalConversationId?: string): ConversationCorrelationResult {
    if (existingInternalConversationId) {
      // Existing web/widget clients already hold an ORBI-generated conversation ID.
      return Object.freeze({ status: "preserved", internalRef: toInternalConversationRef(existingInternalConversationId) });
    }
    if (!inbound.externalConversationId) return Object.freeze({ status: "not-applicable" });

    const externalKey: ExternalConversationKey = Object.freeze({
      channel: inbound.channel,
      externalConversationId: inbound.externalConversationId,
    });
    const resolved = this.store.resolve(externalKey);
    if (resolved) return Object.freeze({ status: "resolved", internalRef: resolved });

    const created = createInternalConversationRef();
    return Object.freeze({ status: "created", internalRef: this.store.bind(externalKey, created) });
  }

  release(inbound: Readonly<InboundChannelMessage>): ConversationCorrelationResult {
    if (!inbound.externalConversationId) return Object.freeze({ status: "not-applicable" });
    const externalKey: ExternalConversationKey = Object.freeze({ channel: inbound.channel, externalConversationId: inbound.externalConversationId });
    return this.store.release(externalKey) ? Object.freeze({ status: "released" }) : Object.freeze({ status: "not-applicable" });
  }
}
