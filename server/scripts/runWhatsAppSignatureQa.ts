import { createHmac } from "node:crypto";
import { verifyWhatsAppWebhookSignature } from "../src/channels/whatsapp/whatsappWebhookSignature.js";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
try {
  const body = Buffer.from('{"object":"whatsapp_business_account","accent":"¿Qué tal?"}', "utf8");
  const secret = "qa-app-secret";
  const signature = `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;
  assert(verifyWhatsAppWebhookSignature(body, signature, secret).ok, "Exact UTF-8 raw bytes must validate.");
  assert(!verifyWhatsAppWebhookSignature(Buffer.from(body.toString("utf8").replace("tal", "otra"), "utf8"), signature, secret).ok, "Changing raw bytes must invalidate the signature.");
  assert(!verifyWhatsAppWebhookSignature(body, undefined, secret).ok, "Missing required signature must reject.");
  assert(!verifyWhatsAppWebhookSignature(body, signature, undefined).ok, "Missing app secret must not claim verification.");
  console.info("WhatsApp Signature QA: PASS (exact bytes, invalid/missing rejection, built-in timing-safe verifier)");
} catch (error) { console.error(error); process.exit(1); }
