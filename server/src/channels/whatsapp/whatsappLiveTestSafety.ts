import type { WhatsAppRuntimeConfig } from "../../config/whatsappRuntimeConfig.js";

const validRecipient = (value: string): boolean => /^\d{6,30}$/.test(value);

/** Exact-match boundary guard; it trims formatting whitespace but never changes a phone identifier. */
export const normalizeWhatsAppRecipient = (recipient: string): string | undefined => {
  const normalized = recipient.trim();
  return validRecipient(normalized) ? normalized : undefined;
};

/** Only native Graph transport is subject to this lock. Injected test transports remain deterministic. */
export const canExecuteNativeWhatsAppSend = (config: Readonly<WhatsAppRuntimeConfig>, recipient: string): boolean => {
  const normalized = normalizeWhatsAppRecipient(recipient);
  return Boolean(normalized && config.enabled && config.liveSendEnabled && config.outboundReadiness === "ready-for-outbound" && config.liveTestReadiness === "live-test-ready" && config.testRecipientAllowlist.includes(normalized));
};

/** Template sends have the generic native lock plus explicit template readiness. */
export const canExecuteNativeWhatsAppTemplateSend = (config: Readonly<WhatsAppRuntimeConfig>, recipient: string): boolean =>
  canExecuteNativeWhatsAppSend(config, recipient) && config.templateLiveTestReadiness === "template-live-test-ready";

/** Safe status-only diagnostics: no token, secret, recipient, or phone-number identifier is exposed. */
export const getWhatsAppLiveTestDiagnostics = (config: Readonly<WhatsAppRuntimeConfig>) => Object.freeze({
  enabled: config.enabled,
  signatureReady: Boolean(config.verifyToken && config.appSecret),
  outboundConfigReady: config.outboundReadiness === "ready-for-outbound",
  allowlistConfigured: config.testRecipientAllowlist.length > 0,
  liveSendUnlocked: config.liveSendEnabled,
  liveTestReady: config.liveTestReadiness === "live-test-ready",
  templateLiveTestReady: config.templateLiveTestReadiness === "template-live-test-ready",
  readiness: config.liveTestReadiness,
});
