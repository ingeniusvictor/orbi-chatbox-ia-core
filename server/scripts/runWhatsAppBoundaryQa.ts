import { readFileSync } from "node:fs";
import { WhatsAppChannelAdapter } from "../src/adapters/whatsAppChannelAdapter.js";
import { loadWhatsAppRuntimeConfig } from "../src/config/whatsappRuntimeConfig.js";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const source = (path: string): string => readFileSync(new URL(path, import.meta.url), "utf8");

try {
  const adapter = new WhatsAppChannelAdapter(loadWhatsAppRuntimeConfig({ WHATSAPP_ENABLED: "true", WHATSAPP_VERIFY_TOKEN: "qa-token" }));
  assert(adapter.channel === "whatsapp" && adapter.status === "inbound-foundation" && adapter.readiness === "ready-for-webhook", "Adapter must remain a non-routable outbound development foundation.");
  assert(adapter.validateWebhookEnvelope({ object: "whatsapp_business_account", entry: [] }) !== undefined, "Meta-shaped raw envelope must be accepted only at adapter boundary.");
  const core = ["../src/services/coreWidgetMessageProcessor.ts", "../src/services/channelMessageBridge.ts", "../src/services/knowledgeContextBuilder.ts", "../src/services/assistantBehaviorPolicyComposer.ts", "../src/services/capabilityInvocationPolicy.ts"].map(source).join("\n");
  const boundary = ["../src/routes/whatsappWebhook.ts", "../src/adapters/whatsAppChannelAdapter.ts", "../src/channels/whatsapp/whatsappWebhookEnvelope.ts"].map(source).join("\n");
  assert(!/WhatsAppWebhookEnvelope|WHATSAPP_WEBHOOK|wa_id|phoneNumberId|WHATSAPP_ACCESS_TOKEN|fetch\(/.test(core), "Core/LUMI layers must not gain Meta details or outbound calls.");
  assert(!/fetch\(|https?:\/\/|accessToken.*(?:send|post)|graph\.facebook\.com/i.test(boundary), "Foundation boundary must not make Graph API requests or send messages.");
  console.info("WhatsApp Boundary QA: PASS (raw payload isolated, no identity mapping, no Core leakage, no outbound API)");
} catch (error) { console.error(error); process.exit(1); }
