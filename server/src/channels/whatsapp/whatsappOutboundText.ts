const MAX_WHATSAPP_TEXT_LENGTH = 2_000;

export type WhatsAppOutboundTextPayload = Readonly<{
  messaging_product: "whatsapp";
  to: string;
  type: "text";
  text: Readonly<{ body: string }>;
}>;

export type WhatsAppOutboundDeliveryContext = Readonly<{ recipient: string }>;

const validRecipient = (value: string): boolean => /^\d{6,30}$/.test(value);

/** Provider-only schema. Recipient never crosses into the neutral Core response. */
export const createWhatsAppOutboundTextPayload = (
  context: Readonly<WhatsAppOutboundDeliveryContext>,
  text: string,
): Readonly<WhatsAppOutboundTextPayload> => {
  const body = text.trim();
  if (!validRecipient(context.recipient) || !body || body.length > MAX_WHATSAPP_TEXT_LENGTH) {
    throw new Error("WhatsApp outbound text payload is invalid.");
  }
  return Object.freeze({ messaging_product: "whatsapp", to: context.recipient, type: "text", text: Object.freeze({ body }) });
};
