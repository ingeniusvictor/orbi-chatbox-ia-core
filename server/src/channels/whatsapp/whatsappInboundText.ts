/** Meta-shaped types stay inside the WhatsApp boundary and are never Core contracts. */
export type WhatsAppInboundTextEvent = Readonly<{
  providerMessageId: string;
  externalUserId: string;
  externalConversationId: string;
  text: string;
  receivedAt: string;
}>;

export type WhatsAppWebhookEvent =
  | Readonly<{ kind: "inbound-text"; event: WhatsAppInboundTextEvent }>
  | Readonly<{ kind: "status-event" }>
  | Readonly<{ kind: "unsupported-message" }>
  | Readonly<{ kind: "irrelevant" }>
  | Readonly<{ kind: "malformed" }>;

const isRecord = (value: unknown): value is Readonly<Record<string, unknown>> => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const bounded = (value: unknown, limit = 120): value is string => typeof value === "string" && value.trim().length > 0 && value.length <= limit;
const timestamp = (value: unknown): string => {
  const seconds = typeof value === "string" && /^\d+$/.test(value) ? Number(value) : Number.NaN;
  const date = Number.isFinite(seconds) ? new Date(seconds * 1000) : new Date();
  return Number.isFinite(date.getTime()) ? date.toISOString() : new Date().toISOString();
};

/** Extracts only user text and external boundary identifiers from validated Meta JSON. */
export const classifyWhatsAppWebhookEvents = (value: unknown): readonly WhatsAppWebhookEvent[] => {
  if (!isRecord(value) || value.object !== "whatsapp_business_account" || !Array.isArray(value.entry)) return Object.freeze([Object.freeze({ kind: "malformed" })]);
  const events: WhatsAppWebhookEvent[] = [];
  for (const entry of value.entry) {
    if (!isRecord(entry) || !Array.isArray(entry.changes)) { events.push(Object.freeze({ kind: "malformed" })); continue; }
    for (const change of entry.changes) {
      const changeValue = isRecord(change) ? change.value : undefined;
      if (!isRecord(changeValue)) { events.push(Object.freeze({ kind: "malformed" })); continue; }
      const messages = Array.isArray(changeValue.messages) ? changeValue.messages : [];
      if (Array.isArray(changeValue.statuses)) events.push(Object.freeze({ kind: "status-event" }));
      if (messages.length === 0) { if (!Array.isArray(changeValue.statuses)) events.push(Object.freeze({ kind: "irrelevant" })); continue; }
      for (const message of messages) {
        if (!isRecord(message)) { events.push(Object.freeze({ kind: "malformed" })); continue; }
        if (message.type !== "text") { events.push(Object.freeze({ kind: "unsupported-message" })); continue; }
        const text = isRecord(message.text) ? message.text.body : undefined;
        if (!bounded(message.id) || !bounded(message.from) || !bounded(text, 2_000)) { events.push(Object.freeze({ kind: "malformed" })); continue; }
        // WhatsApp has no separate development thread id: this is an external-only scoped key.
        events.push(Object.freeze({ kind: "inbound-text", event: Object.freeze({ providerMessageId: message.id, externalUserId: message.from, externalConversationId: `whatsapp:${message.from}`, text, receivedAt: timestamp(message.timestamp) }) }));
      }
    }
  }
  return Object.freeze(events);
};
