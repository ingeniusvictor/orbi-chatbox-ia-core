export type WhatsAppRuntimeReadiness = "disabled" | "missing-config" | "ready-for-webhook" | "ready-for-api" | "invalid-config";
export type WhatsAppOutboundReadiness = "disabled" | "missing-config" | "ready-for-outbound" | "invalid-config";
export type WhatsAppLiveTestReadiness = "disabled" | "config-incomplete" | "foundation-ready" | "live-send-locked" | "live-test-ready" | "invalid-config";
export type WhatsAppTemplateLiveTestReadiness = "disabled" | "config-incomplete" | "live-send-locked" | "template-config-missing" | "template-live-test-ready" | "invalid-config";

export type WhatsAppRuntimeConfig = Readonly<{
  enabled: boolean;
  liveSendEnabled: boolean;
  readiness: WhatsAppRuntimeReadiness;
  outboundReadiness: WhatsAppOutboundReadiness;
  liveTestReadiness: WhatsAppLiveTestReadiness;
  templateLiveTestReadiness: WhatsAppTemplateLiveTestReadiness;
  testRecipientAllowlist: readonly string[];
  testTemplateName?: string;
  testTemplateLanguageCode?: string;
  verifyToken?: string;
  appSecret?: string;
  accessToken?: string;
  phoneNumberId?: string;
  businessAccountId?: string;
  graphApiVersion?: string;
}>;

const trim = (value: string | undefined): string | undefined => value?.trim() || undefined;
const parseEnabled = (value: string | undefined): boolean | "invalid" => {
  if (value === undefined || value.trim() === "" || value.trim().toLowerCase() === "false") return false;
  return value.trim().toLowerCase() === "true" ? true : "invalid";
};
const validGraphVersion = (value: string | undefined): boolean => value === undefined || /^v\d+\.\d+$/.test(value);
const validBoundaryId = (value: string | undefined): boolean => value === undefined || /^[A-Za-z0-9_-]{1,120}$/.test(value);
const validRecipient = (value: string): boolean => /^\d{6,30}$/.test(value);
const validTemplateName = (value: string | undefined): boolean => value === undefined || /^[a-z0-9_]{1,512}$/.test(value);
const validTemplateLanguageCode = (value: string | undefined): boolean => value === undefined || /^[a-z]{2,3}(?:_[A-Z]{2})?$/.test(value);
const parseAllowlist = (value: string | undefined): readonly string[] | "invalid" => {
  if (value === undefined || value.trim() === "") return Object.freeze([]);
  const entries = value.split(",").map((entry) => entry.trim());
  if (entries.length > 20 || entries.some((entry) => !validRecipient(entry))) return "invalid";
  return Object.freeze([...new Set(entries)]);
};

/**
 * Development/test configuration only. Secrets stay in process environment and
 * are never returned by routes, diagnostics or Core-facing contracts.
 */
export const loadWhatsAppRuntimeConfig = (
  env: Readonly<Record<string, string | undefined>> = process.env,
): WhatsAppRuntimeConfig => {
  const enabled = parseEnabled(env.WHATSAPP_ENABLED);
  const liveSendEnabled = parseEnabled(env.WHATSAPP_LIVE_SEND_ENABLED);
  const verifyToken = trim(env.WHATSAPP_VERIFY_TOKEN);
  const appSecret = trim(env.WHATSAPP_APP_SECRET);
  const accessToken = trim(env.WHATSAPP_ACCESS_TOKEN);
  const phoneNumberId = trim(env.WHATSAPP_PHONE_NUMBER_ID);
  const businessAccountId = trim(env.WHATSAPP_BUSINESS_ACCOUNT_ID);
  const graphApiVersion = trim(env.WHATSAPP_GRAPH_API_VERSION);
  const testTemplateName = trim(env.WHATSAPP_TEST_TEMPLATE_NAME);
  const testTemplateLanguageCode = trim(env.WHATSAPP_TEST_TEMPLATE_LANGUAGE_CODE);
  const testRecipientAllowlist = parseAllowlist(env.WHATSAPP_TEST_RECIPIENT_ALLOWLIST);
  const outboundValues = [accessToken, phoneNumberId, graphApiVersion];
  const hasAnyOutboundValue = outboundValues.some(Boolean);
  const hasCompleteOutboundConfig = outboundValues.every(Boolean) && validGraphVersion(graphApiVersion);
  const invalid = enabled === "invalid" || !validGraphVersion(graphApiVersion) || !validBoundaryId(phoneNumberId) || !validBoundaryId(businessAccountId) || !validTemplateName(testTemplateName) || !validTemplateLanguageCode(testTemplateLanguageCode) || (hasAnyOutboundValue && !hasCompleteOutboundConfig);
  const readiness: WhatsAppRuntimeReadiness = invalid
    ? "invalid-config"
    : enabled === false
      ? "disabled"
      : !verifyToken
        ? "missing-config"
        : hasCompleteOutboundConfig
          ? "ready-for-api"
          : "ready-for-webhook";
  const outboundReadiness: WhatsAppOutboundReadiness = invalid
    ? "invalid-config"
    : enabled === false
      ? "disabled"
      : hasCompleteOutboundConfig
        ? "ready-for-outbound"
      : "missing-config";
  const liveTestReadiness: WhatsAppLiveTestReadiness = invalid || liveSendEnabled === "invalid" || testRecipientAllowlist === "invalid"
    ? "invalid-config"
    : enabled === false
      ? "disabled"
      : outboundReadiness !== "ready-for-outbound"
        ? "config-incomplete"
        : liveSendEnabled !== true || testRecipientAllowlist.length === 0
          ? "live-send-locked"
          : "live-test-ready";
  const templateLiveTestReadiness: WhatsAppTemplateLiveTestReadiness = invalid || liveSendEnabled === "invalid" || testRecipientAllowlist === "invalid"
    ? "invalid-config"
    : enabled === false
      ? "disabled"
      : outboundReadiness !== "ready-for-outbound"
        ? "config-incomplete"
        : liveSendEnabled !== true || testRecipientAllowlist.length !== 1
          ? "live-send-locked"
          : !testTemplateName || !testTemplateLanguageCode
            ? "template-config-missing"
            : "template-live-test-ready";

  return Object.freeze({
    enabled: enabled === true,
    liveSendEnabled: liveSendEnabled === true,
    readiness,
    outboundReadiness,
    liveTestReadiness,
    templateLiveTestReadiness,
    testRecipientAllowlist: testRecipientAllowlist === "invalid" ? Object.freeze([]) : testRecipientAllowlist,
    ...(testTemplateName ? { testTemplateName } : {}),
    ...(testTemplateLanguageCode ? { testTemplateLanguageCode } : {}),
    ...(verifyToken ? { verifyToken } : {}),
    ...(appSecret ? { appSecret } : {}),
    ...(accessToken ? { accessToken } : {}),
    ...(phoneNumberId ? { phoneNumberId } : {}),
    ...(businessAccountId ? { businessAccountId } : {}),
    ...(graphApiVersion ? { graphApiVersion } : {}),
  });
};
