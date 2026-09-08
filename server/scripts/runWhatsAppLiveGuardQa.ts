import { WhatsAppGraphClient, type WhatsAppGraphTransport } from "../src/channels/whatsapp/whatsappGraphClient.js";
import { loadWhatsAppRuntimeConfig } from "../src/config/whatsappRuntimeConfig.js";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const context = Object.freeze({ recipient: "1111111111" });
const nativeSpy = (calls: { value: number }): WhatsAppGraphTransport => Object.assign(async () => { calls.value += 1; return Object.freeze({ status: 200, body: JSON.stringify({ messages: [{ id: "wamid.fake" }] }) }); }, Object.freeze({ kind: "native" as const }));
try {
  const base = { WHATSAPP_ENABLED: "true", WHATSAPP_ACCESS_TOKEN: "qa-access-token", WHATSAPP_PHONE_NUMBER_ID: "0000000000", WHATSAPP_GRAPH_API_VERSION: "v99.0" };
  const lockedCalls = { value: 0 };
  const locked = await new WhatsAppGraphClient(loadWhatsAppRuntimeConfig(base), nativeSpy(lockedCalls), 1_000).sendText(context, "Texto");
  assert("errorCode" in locked && locked.errorCode === "WHATSAPP_LIVE_SEND_LOCKED" && lockedCalls.value === 0, "Default live-send lock must deny before native transport.");
  const missingCalls = { value: 0 };
  const missing = await new WhatsAppGraphClient(loadWhatsAppRuntimeConfig({ WHATSAPP_ENABLED: "true", WHATSAPP_LIVE_SEND_ENABLED: "true", WHATSAPP_TEST_RECIPIENT_ALLOWLIST: "1111111111" }), nativeSpy(missingCalls), 1_000).sendText(context, "Texto");
  assert("errorCode" in missing && missing.errorCode === "WHATSAPP_NOT_CONFIGURED" && missingCalls.value === 0, "Incomplete outbound config must deny before native transport.");
  const unapprovedCalls = { value: 0 };
  const ready = loadWhatsAppRuntimeConfig({ ...base, WHATSAPP_LIVE_SEND_ENABLED: "true", WHATSAPP_TEST_RECIPIENT_ALLOWLIST: "2222222222" });
  const unapproved = await new WhatsAppGraphClient(ready, nativeSpy(unapprovedCalls), 1_000).sendText(context, "Texto");
  assert("errorCode" in unapproved && unapproved.errorCode === "WHATSAPP_LIVE_SEND_LOCKED" && unapprovedCalls.value === 0, "Unapproved recipients must deny before native transport.");
  const eligibleCalls = { value: 0 };
  const eligible = await new WhatsAppGraphClient(loadWhatsAppRuntimeConfig({ ...base, WHATSAPP_LIVE_SEND_ENABLED: "true", WHATSAPP_TEST_RECIPIENT_ALLOWLIST: "1111111111" }), nativeSpy(eligibleCalls), 1_000).sendText(context, "Texto");
  assert(eligible.ok && eligibleCalls.value === 1, "Only complete fake live requirements may make native execution eligible; this QA still uses a spy.");
  console.info("WhatsApp Live Guard QA: PASS (default lock, incomplete/unapproved denial, fake native eligibility without network)");
} catch (error) { console.error(error); process.exit(1); }
