import { ORBI_DEFAULT_PROFILE } from "../src/config/clientProfile.js";
import { ORBI_WHATSAPP_COMMERCIAL_PROFILE } from "../src/config/whatsAppCommercialProfile.js";

const assert = (value: unknown, message: string): void => {
  if (!value) throw new Error(message);
};

try {
  assert(
    !ORBI_DEFAULT_PROFILE.channels.enabled.includes("whatsapp"),
    "ORBI default profile must not implicitly enable WhatsApp.",
  );

  assert(
    ORBI_WHATSAPP_COMMERCIAL_PROFILE.profileId === "orbi-whatsapp-commercial",
    "WhatsApp profile ID must remain explicit and stable.",
  );
  assert(
    ORBI_WHATSAPP_COMMERCIAL_PROFILE.organization.displayName === "ORBI" &&
      ORBI_WHATSAPP_COMMERCIAL_PROFILE.assistant.displayName === "LUMI" &&
      ORBI_WHATSAPP_COMMERCIAL_PROFILE.assistant.locale === "es-CL",
    "WhatsApp profile must preserve ORBI/LUMI identity and locale.",
  );
  assert(
    ORBI_WHATSAPP_COMMERCIAL_PROFILE.channels.enabled.length === 1 &&
      ORBI_WHATSAPP_COMMERCIAL_PROFILE.channels.enabled[0] === "whatsapp",
    "WhatsApp commercial profile must be channel-scoped.",
  );
  assert(
    ORBI_WHATSAPP_COMMERCIAL_PROFILE.knowledge.enabled,
    "WhatsApp commercial profile must keep ORBI knowledge enabled.",
  );

  const allowed = ORBI_WHATSAPP_COMMERCIAL_PROFILE.capabilities.allowedTools;
  assert(
    allowed.includes("search_knowledge") &&
      allowed.includes("request_human_handoff"),
    "WhatsApp commercial profile must expose only the initial safe support tools.",
  );
  assert(
    !allowed.includes("capture_lead") &&
      !allowed.includes("create_service_request") &&
      !allowed.includes("request_appointment"),
    "Business mutation tools must remain disabled until explicitly certified.",
  );

  console.info(
    "WhatsApp Commercial Profile QA: PASS (dedicated channel profile, least privilege, no transport enablement)",
  );
} catch (error) {
  console.error(error);
  process.exit(1);
}
