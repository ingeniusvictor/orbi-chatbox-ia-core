import { loadWhatsAppRuntimeConfig } from "../src/config/whatsappRuntimeConfig.js";
import { canExecuteNativeWhatsAppSend, getWhatsAppLiveTestDiagnostics, normalizeWhatsAppRecipient } from "../src/channels/whatsapp/whatsappLiveTestSafety.js";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
try {
  const config = loadWhatsAppRuntimeConfig({ WHATSAPP_ENABLED: "true", WHATSAPP_ACCESS_TOKEN: "qa-access-token", WHATSAPP_PHONE_NUMBER_ID: "0000000000", WHATSAPP_GRAPH_API_VERSION: "v99.0", WHATSAPP_LIVE_SEND_ENABLED: "true", WHATSAPP_TEST_RECIPIENT_ALLOWLIST: "1111111111, 2222222222" });
  assert(config.testRecipientAllowlist.length === 2 && config.liveTestReadiness === "live-test-ready", "Bounded exact allowlist must make a complete fake config live-test ready.");
  assert(normalizeWhatsAppRecipient(" 1111111111 ") === "1111111111", "Only outer whitespace may be normalized.");
  assert(normalizeWhatsAppRecipient("+1111111111") === undefined && normalizeWhatsAppRecipient("111111") === "111111", "Recipient validation must not invent dialing conversion.");
  assert(canExecuteNativeWhatsAppSend(config, "1111111111") && !canExecuteNativeWhatsAppSend(config, "111111111") && !canExecuteNativeWhatsAppSend(config, "11111111110"), "Allowlist matching must be exact, never partial.");
  const empty = loadWhatsAppRuntimeConfig({ WHATSAPP_ENABLED: "true", WHATSAPP_ACCESS_TOKEN: "qa-access-token", WHATSAPP_PHONE_NUMBER_ID: "0000000000", WHATSAPP_GRAPH_API_VERSION: "v99.0", WHATSAPP_LIVE_SEND_ENABLED: "true" });
  assert(empty.liveTestReadiness === "live-send-locked" && !canExecuteNativeWhatsAppSend(empty, "1111111111"), "Empty allowlist must deny native send.");
  const malformed = loadWhatsAppRuntimeConfig({ WHATSAPP_ENABLED: "true", WHATSAPP_LIVE_SEND_ENABLED: "true", WHATSAPP_TEST_RECIPIENT_ALLOWLIST: "*" });
  assert(malformed.liveTestReadiness === "invalid-config", "Wildcards and malformed allowlist values must be rejected.");
  const diagnostics = JSON.stringify(getWhatsAppLiveTestDiagnostics(config));
  assert(!diagnostics.includes("1111111111") && !diagnostics.includes("qa-access-token"), "Diagnostics must not expose recipients or credentials.");
  console.info("WhatsApp Recipient Allowlist QA: PASS (env-only exact matching, empty/partial/malformed denial, safe diagnostics)");
} catch (error) { console.error(error); process.exit(1); }
