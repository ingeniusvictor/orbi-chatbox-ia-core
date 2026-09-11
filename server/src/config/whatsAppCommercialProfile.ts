import { validateClientProfile } from "./clientProfile.js";

/**
 * Dedicated least-privilege profile for ORBI/LUMI conversations arriving
 * through the official WhatsApp channel.
 *
 * WhatsApp remains intentionally absent from ORBI_DEFAULT_PROFILE. Enabling
 * this profile does not enable transport or native sends by itself.
 */
export const ORBI_WHATSAPP_COMMERCIAL_PROFILE = validateClientProfile({
  schemaVersion: 1,
  profileId: "orbi-whatsapp-commercial",
  organization: { displayName: "ORBI" },
  assistant: {
    displayName: "LUMI",
    locale: "es-CL",
  },
  capabilities: {
    allowedTools: ["search_knowledge", "request_human_handoff"],
  },
  channels: {
    enabled: ["whatsapp"],
  },
  knowledge: {
    enabled: true,
  },
});
