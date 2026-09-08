import { loadWhatsAppRuntimeConfig } from "../src/config/whatsappRuntimeConfig.js";
import { getWhatsAppLiveTestDiagnostics } from "../src/channels/whatsapp/whatsappLiveTestSafety.js";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
try {
  const disabled = loadWhatsAppRuntimeConfig({});
  const incomplete = loadWhatsAppRuntimeConfig({ WHATSAPP_ENABLED: "true" });
  const locked = loadWhatsAppRuntimeConfig({ WHATSAPP_ENABLED: "true", WHATSAPP_ACCESS_TOKEN: "qa-access-token", WHATSAPP_PHONE_NUMBER_ID: "0000000000", WHATSAPP_GRAPH_API_VERSION: "v99.0" });
  const ready = loadWhatsAppRuntimeConfig({ WHATSAPP_ENABLED: "true", WHATSAPP_VERIFY_TOKEN: "qa-verify", WHATSAPP_APP_SECRET: "qa-app-secret", WHATSAPP_ACCESS_TOKEN: "qa-access-token", WHATSAPP_PHONE_NUMBER_ID: "0000000000", WHATSAPP_GRAPH_API_VERSION: "v99.0", WHATSAPP_LIVE_SEND_ENABLED: "true", WHATSAPP_TEST_RECIPIENT_ALLOWLIST: "1111111111" });
  assert(disabled.liveTestReadiness === "disabled" && incomplete.liveTestReadiness === "config-incomplete" && locked.liveTestReadiness === "live-send-locked" && ready.liveTestReadiness === "live-test-ready", "Live readiness states must be truthful and bounded.");
  const diagnostics = getWhatsAppLiveTestDiagnostics(ready);
  assert(diagnostics.enabled && diagnostics.signatureReady && diagnostics.outboundConfigReady && diagnostics.allowlistConfigured && diagnostics.liveSendUnlocked && diagnostics.liveTestReady, "Ready diagnostics must expose booleans only.");
  assert(!Object.values(diagnostics).some((value) => String(value).includes("qa-")), "Diagnostics must not include secret values.");
  console.info("WhatsApp Live Readiness QA: PASS (bounded state model and secret/recipient-free diagnostics)");
} catch (error) { console.error(error); process.exit(1); }
