import { loadWhatsAppRuntimeConfig } from "../src/config/whatsappRuntimeConfig.js";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };

try {
  const disabled = loadWhatsAppRuntimeConfig({});
  const missing = loadWhatsAppRuntimeConfig({ WHATSAPP_ENABLED: "true" });
  const webhook = loadWhatsAppRuntimeConfig({ WHATSAPP_ENABLED: "true", WHATSAPP_VERIFY_TOKEN: "development-verify-token" });
  const api = loadWhatsAppRuntimeConfig({ WHATSAPP_ENABLED: "true", WHATSAPP_VERIFY_TOKEN: "development-verify-token", WHATSAPP_APP_SECRET: "development-app-secret", WHATSAPP_ACCESS_TOKEN: "development-access-token", WHATSAPP_PHONE_NUMBER_ID: "phone-id", WHATSAPP_BUSINESS_ACCOUNT_ID: "business-id", WHATSAPP_GRAPH_API_VERSION: "v99.0" });
  const invalid = loadWhatsAppRuntimeConfig({ WHATSAPP_ENABLED: "true", WHATSAPP_VERIFY_TOKEN: "development-verify-token", WHATSAPP_ACCESS_TOKEN: "partial" });
  assert(disabled.readiness === "disabled" && !disabled.enabled, "Unset configuration must stay disabled.");
  assert(missing.readiness === "missing-config", "Enabled webhook without verify token must be controlled.");
  assert(webhook.readiness === "ready-for-webhook" && webhook.verifyToken !== webhook.accessToken, "Verify token must be separate from an access token.");
  assert(api.readiness === "ready-for-api", "Complete development config must report API readiness without connecting.");
  assert(invalid.readiness === "invalid-config", "Partial API config must be invalid, not ready.");
  assert(api.appSecret !== api.accessToken && api.appSecret !== api.verifyToken, "App, access and verify secrets must remain separate.");
  console.info("WhatsApp Config QA: PASS (env-only config, controlled readiness, separate verification token)");
} catch (error) { console.error(error); process.exit(1); }
