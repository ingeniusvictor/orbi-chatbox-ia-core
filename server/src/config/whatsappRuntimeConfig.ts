export type WhatsAppRuntimeReadiness = "disabled" | "missing-config" | "ready-for-webhook" | "ready-for-api" | "invalid-config";

export type WhatsAppRuntimeConfig = Readonly<{
  enabled: boolean;
  readiness: WhatsAppRuntimeReadiness;
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

/**
 * Development/test configuration only. Secrets stay in process environment and
 * are never returned by routes, diagnostics or Core-facing contracts.
 */
export const loadWhatsAppRuntimeConfig = (
  env: Readonly<Record<string, string | undefined>> = process.env,
): WhatsAppRuntimeConfig => {
  const enabled = parseEnabled(env.WHATSAPP_ENABLED);
  const verifyToken = trim(env.WHATSAPP_VERIFY_TOKEN);
  const appSecret = trim(env.WHATSAPP_APP_SECRET);
  const accessToken = trim(env.WHATSAPP_ACCESS_TOKEN);
  const phoneNumberId = trim(env.WHATSAPP_PHONE_NUMBER_ID);
  const businessAccountId = trim(env.WHATSAPP_BUSINESS_ACCOUNT_ID);
  const graphApiVersion = trim(env.WHATSAPP_GRAPH_API_VERSION);
  const apiValues = [accessToken, phoneNumberId, businessAccountId, graphApiVersion];
  const hasAnyApiValue = apiValues.some(Boolean);
  const hasCompleteApiConfig = apiValues.every(Boolean) && validGraphVersion(graphApiVersion);
  const invalid = enabled === "invalid" || !validGraphVersion(graphApiVersion) || (hasAnyApiValue && !hasCompleteApiConfig);
  const readiness: WhatsAppRuntimeReadiness = invalid
    ? "invalid-config"
    : enabled === false
      ? "disabled"
      : !verifyToken
        ? "missing-config"
        : hasCompleteApiConfig
          ? "ready-for-api"
          : "ready-for-webhook";

  return Object.freeze({
    enabled: enabled === true,
    readiness,
    ...(verifyToken ? { verifyToken } : {}),
    ...(appSecret ? { appSecret } : {}),
    ...(accessToken ? { accessToken } : {}),
    ...(phoneNumberId ? { phoneNumberId } : {}),
    ...(businessAccountId ? { businessAccountId } : {}),
    ...(graphApiVersion ? { graphApiVersion } : {}),
  });
};
