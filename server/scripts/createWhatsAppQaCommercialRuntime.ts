import { validateClientProfile } from "../src/config/clientProfile.js";
import { defaultHumanHandoffService } from "../src/handoff/humanHandoffService.js";
import { DEFAULT_COMMERCIAL_RUNTIME_POLICY } from "../src/services/commercialRuntimeHardening.js";
import { CommercialRuntimeExecution } from "../src/services/commercialRuntimeExecution.js";

export const createWhatsAppQaCommercialRuntime = (): CommercialRuntimeExecution =>
  new CommercialRuntimeExecution({
    activeClient: validateClientProfile({
      schemaVersion: 1,
      profileId: "whatsapp-qa",
      organization: { displayName: "ORBI QA" },
      assistant: { displayName: "LUMI", locale: "es-CL" },
      capabilities: { allowedTools: [] },
      channels: { enabled: ["whatsapp"] },
      knowledge: { enabled: false },
    }),
    policy: DEFAULT_COMMERCIAL_RUNTIME_POLICY,
    handoff: defaultHumanHandoffService,
  });
