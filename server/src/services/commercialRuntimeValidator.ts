import type { ClientProfile } from "../config/clientProfile.js";
import type { CommercialRuntimePolicy } from "./commercialRuntimeHardening.js";
import { validateCommercialRuntimePolicy } from "./commercialRuntimeHardening.js";
import type { ToolRegistry } from "../tools/toolEngine.js";
import type { ConversationMemoryStore } from "../memory/conversationMemory.js";
import type { HumanHandoffService } from "../handoff/humanHandoffService.js";
import type { TelemetrySink } from "./runtimeTelemetry.js";
import type { AiProviderMode } from "../types/aiProvider.js";

export type CommercialRuntimeComponent = "activeClient" | "commercialPolicy" | "tools" | "channels" | "knowledge" | "memory" | "handoff" | "businessTools" | "telemetry" | "providerConfiguration";
export type CommercialRuntimeValidationFinding = Readonly<{ component: CommercialRuntimeComponent; valid: boolean; safeCode: string; safeMessage: string }>;
export type CommercialRuntimeValidationResult = Readonly<{ valid: boolean; findings: readonly CommercialRuntimeValidationFinding[] }>;
export type CommercialRuntimeComposition = Readonly<{
  activeClient?: ClientProfile;
  commercialPolicy?: CommercialRuntimePolicy;
  toolRegistry?: ToolRegistry;
  supportedChannels: readonly string[];
  memory?: ConversationMemoryStore;
  handoff?: HumanHandoffService;
  businessToolsAvailable?: boolean;
  telemetry?: TelemetrySink;
  provider?: Readonly<{ mode: AiProviderMode; endpoint?: string; model?: string }>;
}>;

const businessTools = new Set(["capture_lead", "create_service_request", "request_appointment"]);
const finding = (component: CommercialRuntimeComponent, valid: boolean, safeCode: string, safeMessage: string): CommercialRuntimeValidationFinding =>
  Object.freeze({ component, valid, safeCode, safeMessage: safeMessage.slice(0, 160) });

/** Structural validation only. It never probes providers or performs network I/O. */
export const validateCommercialRuntime = (runtime: CommercialRuntimeComposition): CommercialRuntimeValidationResult => {
  const findings: CommercialRuntimeValidationFinding[] = [];
  const profile = runtime.activeClient;
  findings.push(finding("activeClient", !!profile, profile ? "ACTIVE_CLIENT_READY" : "ACTIVE_CLIENT_MISSING", profile ? "Active client profile resolved." : "Active client profile is required."));
  let policyValid = false;
  try { if (runtime.commercialPolicy) { validateCommercialRuntimePolicy(runtime.commercialPolicy); policyValid = true; } } catch { policyValid = false; }
  findings.push(finding("commercialPolicy", policyValid, policyValid ? "COMMERCIAL_POLICY_READY" : "COMMERCIAL_POLICY_INVALID", policyValid ? "Commercial policy is valid." : "A valid commercial policy is required."));
  const allowedTools = profile?.capabilities.allowedTools ?? [];
  const registered = runtime.toolRegistry;
  const toolsValid = !!registered && allowedTools.every((name) => !!registered.get(name));
  findings.push(finding("tools", toolsValid, toolsValid ? "TOOLS_READY" : "TOOL_COMPOSITION_INVALID", toolsValid ? "Profile tools are registered and remain policy-controlled." : "A configured tool is unregistered or the registry is missing."));
  const channelsValid = !!profile && profile.channels.enabled.every((name) => runtime.supportedChannels.includes(name));
  findings.push(finding("channels", channelsValid, channelsValid ? "CHANNELS_READY" : "CHANNEL_UNSUPPORTED", channelsValid ? "Enabled channels are supported." : "An enabled channel is unsupported."));
  findings.push(finding("knowledge", !!profile, profile ? "KNOWLEDGE_POLICY_READY" : "KNOWLEDGE_POLICY_INVALID", profile ? "Knowledge enabled/disabled policy is supported." : "Knowledge policy requires an active client."));
  findings.push(finding("memory", !!runtime.memory, runtime.memory ? "MEMORY_READY" : "MEMORY_MISSING", runtime.memory ? "Conversation memory is composed." : "Conversation memory is required."));
  const needsHandoff = allowedTools.includes("request_human_handoff");
  findings.push(finding("handoff", !needsHandoff || !!runtime.handoff, !needsHandoff || runtime.handoff ? "HANDOFF_READY" : "HANDOFF_MISSING", !needsHandoff || runtime.handoff ? "Handoff dependency is satisfied." : "Handoff service is required."));
  const needsBusiness = allowedTools.some((name) => businessTools.has(name));
  findings.push(finding("businessTools", !needsBusiness || runtime.businessToolsAvailable === true, !needsBusiness || runtime.businessToolsAvailable ? "BUSINESS_TOOLS_READY" : "BUSINESS_TOOLS_MISSING", !needsBusiness || runtime.businessToolsAvailable ? "Business dependencies are satisfied." : "Business tool dependencies are required."));
  findings.push(finding("telemetry", true, runtime.telemetry ? "TELEMETRY_READY" : "TELEMETRY_OPTIONAL", runtime.telemetry ? "Optional telemetry is structurally composed." : "Telemetry is optional and absent."));
  const providerValid = !!runtime.provider && (runtime.provider.mode === "mock" || (!!runtime.provider.endpoint?.trim() && !!runtime.provider.model?.trim()));
  findings.push(finding("providerConfiguration", providerValid, providerValid ? "PROVIDER_CONFIGURATION_READY" : "PROVIDER_CONFIGURATION_INVALID", providerValid ? "Provider configuration is structurally complete." : "Provider configuration is incomplete."));
  return Object.freeze({ valid: findings.every((item) => item.valid), findings: Object.freeze(findings) });
};
