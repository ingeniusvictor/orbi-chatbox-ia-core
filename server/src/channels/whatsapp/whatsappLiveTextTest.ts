import type { WhatsAppRuntimeConfig } from "../../config/whatsappRuntimeConfig.js";
import { WhatsAppGraphClient, createNativeWhatsAppGraphTransport, type WhatsAppGraphTransport } from "./whatsappGraphClient.js";

const LIVE_TEST_TEXT = "Hola, esta es una prueba de conexión de LUMI por WhatsApp.";

export type WhatsAppLiveTextTestResult = Readonly<{
  lines: readonly string[];
  transportInvoked: boolean;
}>;

/**
 * The sole future live-send path. It fail-closes before creating a request
 * unless one, and only one, exact allowlisted development recipient exists.
 */
export const runWhatsAppLiveTextTest = async (
  config: Readonly<WhatsAppRuntimeConfig>,
  transport: WhatsAppGraphTransport = createNativeWhatsAppGraphTransport(),
): Promise<WhatsAppLiveTextTestResult> => {
  const ready = config.enabled
    && config.liveSendEnabled
    && config.outboundReadiness === "ready-for-outbound"
    && config.liveTestReadiness === "live-test-ready"
    && config.testRecipientAllowlist.length === 1;
  if (!ready) {
    return Object.freeze({ lines: Object.freeze(["LIVE_TEST_START", "SEND_FAILED", "WHATSAPP_LIVE_SEND_LOCKED", "LIVE_TEST_END"]), transportInvoked: false });
  }

  const result = await new WhatsAppGraphClient(config, transport).sendText(
    Object.freeze({ recipient: config.testRecipientAllowlist[0] }),
    LIVE_TEST_TEXT,
  );
  if (result.ok) {
    return Object.freeze({ lines: Object.freeze(["LIVE_TEST_START", "CONFIG_READY", "RECIPIENT_AUTHORIZED", "SEND_ACCEPTED", "LIVE_TEST_END"]), transportInvoked: true });
  }
  const errorCode = "errorCode" in result ? result.errorCode : "WHATSAPP_NETWORK_FAILED";
  return Object.freeze({ lines: Object.freeze(["LIVE_TEST_START", "CONFIG_READY", "RECIPIENT_AUTHORIZED", "SEND_FAILED", errorCode, "LIVE_TEST_END"]), transportInvoked: true });
};
