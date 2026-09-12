import { ORBI_WHATSAPP_COMMERCIAL_PROFILE } from "../config/whatsAppCommercialProfile.js";
import { defaultHumanHandoffService } from "../handoff/humanHandoffService.js";
import { DEFAULT_COMMERCIAL_RUNTIME_POLICY } from "./commercialRuntimeHardening.js";
import { CommercialRuntimeExecution } from "./commercialRuntimeExecution.js";

/**
 * Creates the dedicated ORBI/LUMI commercial runtime for WhatsApp.
 *
 * This composes policy, handoff ownership and the least-privilege WhatsApp
 * client profile. It does not configure Meta credentials or enable delivery.
 */
export const createWhatsAppCommercialRuntime = (): CommercialRuntimeExecution =>
  new CommercialRuntimeExecution({
    activeClient: ORBI_WHATSAPP_COMMERCIAL_PROFILE,
    policy: DEFAULT_COMMERCIAL_RUNTIME_POLICY,
    handoff: defaultHumanHandoffService,
  });
