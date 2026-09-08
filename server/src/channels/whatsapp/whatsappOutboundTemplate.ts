import type { WhatsAppOutboundDeliveryContext } from "./whatsappOutboundText.js";

export type WhatsAppOutboundTemplatePayload = Readonly<{
  messaging_product: "whatsapp";
  to: string;
  type: "template";
  template: Readonly<{ name: string; language: Readonly<{ code: string }> }>;
}>;

const validRecipient = (value: string): boolean => /^\d{6,30}$/.test(value);
const validName = (value: string): boolean => /^[a-z0-9_]{1,512}$/.test(value);
const validLanguage = (value: string): boolean => /^[a-z]{2,3}(?:_[A-Z]{2})?$/.test(value);

/** Provider-only, parameter-free first-contact template payload. */
export const createWhatsAppOutboundTemplatePayload = (
  context: Readonly<WhatsAppOutboundDeliveryContext>,
  name: string,
  languageCode: string,
): Readonly<WhatsAppOutboundTemplatePayload> => {
  if (!validRecipient(context.recipient) || !validName(name) || !validLanguage(languageCode)) throw new Error("WhatsApp outbound template payload is invalid.");
  return Object.freeze({ messaging_product: "whatsapp", to: context.recipient, type: "template", template: Object.freeze({ name, language: Object.freeze({ code: languageCode }) }) });
};
