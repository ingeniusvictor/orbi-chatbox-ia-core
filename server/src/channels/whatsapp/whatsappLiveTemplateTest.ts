import type { WhatsAppRuntimeConfig } from "../../config/whatsappRuntimeConfig.js";
import { WhatsAppGraphClient, createNativeWhatsAppGraphTransport, type WhatsAppGraphTransport } from "./whatsappGraphClient.js";

export type WhatsAppLiveTemplateTestResult = Readonly<{ lines: readonly string[]; transportInvoked: boolean }>;

/** Separate, one-shot future template path. It never changes the free-form text test. */
export const runWhatsAppLiveTemplateTest = async (
  config: Readonly<WhatsAppRuntimeConfig>,
  transport: WhatsAppGraphTransport = createNativeWhatsAppGraphTransport(),
): Promise<WhatsAppLiveTemplateTestResult> => {
  if (config.templateLiveTestReadiness !== "template-live-test-ready" || config.testRecipientAllowlist.length !== 1) {
    return Object.freeze({ lines: Object.freeze(["LIVE_TEMPLATE_TEST_START", "SEND_FAILED", "WHATSAPP_LIVE_SEND_LOCKED", "LIVE_TEMPLATE_TEST_END"]), transportInvoked: false });
  }
  const result = await new WhatsAppGraphClient(config, transport).sendTemplate(Object.freeze({ recipient: config.testRecipientAllowlist[0] }));
  if (result.ok) return Object.freeze({ lines: Object.freeze(["LIVE_TEMPLATE_TEST_START", "CONFIG_READY", "RECIPIENT_AUTHORIZED", "TEMPLATE_CONFIG_READY", "SEND_ACCEPTED", "LIVE_TEMPLATE_TEST_END"]), transportInvoked: true });
  const errorCode = "errorCode" in result ? result.errorCode : "WHATSAPP_NETWORK_FAILED";
  return Object.freeze({ lines: Object.freeze(["LIVE_TEMPLATE_TEST_START", "CONFIG_READY", "RECIPIENT_AUTHORIZED", "TEMPLATE_CONFIG_READY", "SEND_FAILED", errorCode, "LIVE_TEMPLATE_TEST_END"]), transportInvoked: true });
};
