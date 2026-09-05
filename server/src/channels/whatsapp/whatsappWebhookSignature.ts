import { createHmac, timingSafeEqual } from "node:crypto";

export type WhatsAppWebhookSignatureResult = Readonly<{ ok: true }> | Readonly<{ ok: false; reason: "missing" | "invalid" }>;

/** Validates Meta's x-hub-signature-256 over the untouched webhook bytes. */
export const verifyWhatsAppWebhookSignature = (
  rawBody: Buffer,
  signatureHeader: string | undefined,
  appSecret: string | undefined,
): WhatsAppWebhookSignatureResult => {
  if (!appSecret || !signatureHeader) return Object.freeze({ ok: false, reason: "missing" });
  const expected = `sha256=${createHmac("sha256", appSecret).update(rawBody).digest("hex")}`;
  const actualBuffer = Buffer.from(signatureHeader, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");
  if (actualBuffer.length !== expectedBuffer.length) return Object.freeze({ ok: false, reason: "invalid" });
  return timingSafeEqual(actualBuffer, expectedBuffer) ? Object.freeze({ ok: true }) : Object.freeze({ ok: false, reason: "invalid" });
};
