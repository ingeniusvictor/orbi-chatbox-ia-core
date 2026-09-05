/** Raw Meta-shaped webhook data is intentionally confined to the WhatsApp boundary. */
export type WhatsAppWebhookEnvelope = Readonly<{
  object: "whatsapp_business_account";
  entry: readonly unknown[];
}>;

const isRecord = (value: unknown): value is Readonly<Record<string, unknown>> => Boolean(value) && typeof value === "object" && !Array.isArray(value);

export const parseWhatsAppWebhookEnvelope = (value: unknown): WhatsAppWebhookEnvelope | undefined => {
  if (!isRecord(value) || value.object !== "whatsapp_business_account" || !Array.isArray(value.entry)) return undefined;
  return Object.freeze({ object: "whatsapp_business_account", entry: Object.freeze([...value.entry]) });
};

/** This classification acknowledges only; it deliberately does not normalize or process conversations. */
export const classifyWhatsAppWebhookEvent = (envelope: Readonly<WhatsAppWebhookEnvelope>): "message-candidate" | "unsupported" =>
  envelope.entry.some((entry) => isRecord(entry) && Array.isArray(entry.changes) && entry.changes.some((change) => isRecord(change) && isRecord(change.value) && Array.isArray(change.value.messages)))
    ? "message-candidate"
    : "unsupported";
