import { getCapabilities } from "../src/services/capabilityRegistry.js";
import { createCapabilityRequest, evaluateCapabilityEligibility } from "../src/services/capabilityRequest.js";
import { executeInternalCapability, MAX_CAPABILITY_KNOWLEDGE_QUERY_CHARACTERS, MAX_CAPABILITY_KNOWLEDGE_RESULTS } from "../src/services/internalCapabilityExecutor.js";
import type { CapabilityDefinition } from "../src/types/capability.js";
import type { CapabilityRequest } from "../src/types/capabilityRequest.js";

const main = (): void => {
  const registryBefore = JSON.stringify(getCapabilities());
  const structuredRequest = createCapabilityRequest({ capabilityId: "knowledge-search", reason: "Retrieve controlled structured ORBI knowledge.", input: { query: "ORBI Core Knowledge" } });
  const legacyRequest = createCapabilityRequest({ capabilityId: "knowledge-search", reason: "Retrieve controlled legacy sandbox knowledge.", input: { query: "sandbox assistant" } });
  const structured = executeInternalCapability(structuredRequest);
  const legacy = executeInternalCapability(legacyRequest);
  const repeated = executeInternalCapability(structuredRequest);
  const empty = executeInternalCapability(createCapabilityRequest({ capabilityId: "knowledge-search", reason: "Validate safe empty query handling.", input: { query: "   " } }));
  const oversizedRequest = Object.freeze({ id: "synthetic-oversized-query", capabilityId: "knowledge-search", reason: "Validate safe oversized query handling.", input: Object.freeze({ query: "q".repeat(MAX_CAPABILITY_KNOWLEDGE_QUERY_CHARACTERS + 1) }), status: "requested" }) as Readonly<CapabilityRequest>;
  const oversized = executeInternalCapability(oversizedRequest);
  const conversation = executeInternalCapability(createCapabilityRequest({ capabilityId: "conversation-context", reason: "Confirm conversation execution remains closed." }));
  const system = executeInternalCapability(createCapabilityRequest({ capabilityId: "system-status", reason: "Confirm unavailable status remains controlled." }));
  const external = executeInternalCapability(createCapabilityRequest({ capabilityId: "external-action", reason: "Confirm restricted external action remains blocked." }));
  const unknown = executeInternalCapability(createCapabilityRequest({ capabilityId: "unknown-capability", reason: "Confirm unknown capability remains blocked." }));
  const syntheticRequest = Object.freeze({ id: "synthetic-allowed-request", capabilityId: "external-action", reason: "Do not trust caller status.", input: Object.freeze({ query: "orbi" }), status: "allowed" }) as Readonly<CapabilityRequest>;
  const syntheticBlocked = executeInternalCapability(syntheticRequest);
  const restrictedEnabled = Object.freeze({ id: "synthetic-restricted", name: "Synthetic Restricted", description: "Synthetic QA-only descriptor.", category: "action", status: "enabled", risk: "restricted", executionMode: "internal", version: "1" }) as Readonly<CapabilityDefinition>;
  const writeEnabled = Object.freeze({ ...restrictedEnabled, id: "synthetic-write", risk: "controlled-write" }) as Readonly<CapabilityDefinition>;
  const externalEnabled = Object.freeze({ ...restrictedEnabled, id: "synthetic-external", risk: "read-only", executionMode: "external" }) as Readonly<CapabilityDefinition>;
  const output = structured.output;
  const passed = structured.status === "success" && structured.requestId === structuredRequest.id && structured.capabilityId === "knowledge-search"
    && output?.results.length !== undefined && output.results.length <= MAX_CAPABILITY_KNOWLEDGE_RESULTS && output.results[0]?.entryId === "core-assistant-overview"
    && output.results.every((entry) => entry.summary.length <= 600)
    && new Set(output.results.map((entry) => entry.entryId)).size === output.results.length
    && Object.isFrozen(structured) && Object.isFrozen(output) && Object.isFrozen(output?.results) && Object.isFrozen(output?.results[0])
    && legacy.status === "success" && legacy.output?.results.some((entry) => entry.entryId === "orbi-sandbox-assistant" && entry.sourceType === "local-static")
    && JSON.stringify(structured) === JSON.stringify(repeated)
    && empty.status === "failed" && empty.errorCode === "CAPABILITY_INPUT_INVALID"
    && oversized.status === "failed" && oversized.errorCode === "CAPABILITY_INPUT_INVALID"
    && conversation.status === "blocked" && system.status === "unavailable" && external.status === "blocked" && unknown.status === "blocked" && syntheticBlocked.status === "blocked"
    && evaluateCapabilityEligibility(restrictedEnabled) === "blocked" && evaluateCapabilityEligibility(writeEnabled) === "blocked" && evaluateCapabilityEligibility(externalEnabled) === "blocked"
    && registryBefore === JSON.stringify(getCapabilities());
  if (!passed) { console.error("Internal Capability Executor QA: FAIL"); process.exit(1); }
  console.info("Internal Capability Executor QA: PASS (knowledge-search only; local read-only retrieval with no provider or external side effects)");
};

main();
