import { getCapabilities } from "../src/services/capabilityRegistry.js";
import { createCapabilityRequest, evaluateCapabilityEligibility, evaluateCapabilityRequest, MAX_CAPABILITY_INPUT_KEYS, MAX_CAPABILITY_INPUT_KEY_CHARACTERS, MAX_CAPABILITY_INPUT_VALUE_CHARACTERS, MAX_CAPABILITY_REQUEST_REASON_CHARACTERS } from "../src/services/capabilityRequest.js";
import type { CapabilityDefinition } from "../src/types/capability.js";

const throws = (operation: () => unknown): boolean => {
  try { operation(); return false; } catch { return true; }
};

const main = (): void => {
  const registryBefore = JSON.stringify(getCapabilities());
  const knowledge = createCapabilityRequest({ capabilityId: "knowledge-search", reason: " Search controlled ORBI knowledge relevant to the current question. ", input: { query: "orbi core" } });
  const conversation = createCapabilityRequest({ capabilityId: "conversation-context", reason: "Use recent conversation context to resolve the user's reference." });
  const system = createCapabilityRequest({ capabilityId: "system-status", reason: "Check known system availability." });
  const external = createCapabilityRequest({ capabilityId: "external-action", reason: "Represent a future external action request." });
  const unknown = createCapabilityRequest({ capabilityId: "unknown-capability", reason: "Represent an unknown capability request." });
  const knowledgeDecision = evaluateCapabilityRequest(knowledge);
  const conversationDecision = evaluateCapabilityRequest(conversation);
  const systemDecision = evaluateCapabilityRequest(system);
  const externalDecision = evaluateCapabilityRequest(external);
  const unknownDecision = evaluateCapabilityRequest(unknown);
  const tooManyInput = Object.fromEntries(Array.from({ length: MAX_CAPABILITY_INPUT_KEYS + 1 }, (_, index) => [`key${index}`, "value"]));
  const restrictedEnabled = Object.freeze({ id: "synthetic-restricted", name: "Synthetic Restricted", description: "Synthetic QA-only descriptor.", category: "action", status: "enabled", risk: "restricted", executionMode: "internal", version: "1" }) as Readonly<CapabilityDefinition>;
  const writeEnabled = Object.freeze({ ...restrictedEnabled, id: "synthetic-write", risk: "controlled-write" }) as Readonly<CapabilityDefinition>;
  const externalEnabled = Object.freeze({ ...restrictedEnabled, id: "synthetic-external", risk: "read-only", executionMode: "external" }) as Readonly<CapabilityDefinition>;
  const passed = knowledge.id.length > 0 && knowledge.id !== conversation.id
    && knowledge.capabilityId === "knowledge-search" && knowledge.reason === "Search controlled ORBI knowledge relevant to the current question."
    && knowledge.input.query === "orbi core" && Object.isFrozen(knowledge) && Object.isFrozen(knowledge.input)
    && Object.isFrozen(knowledgeDecision)
    && throws(() => createCapabilityRequest({ capabilityId: "knowledge-search", reason: "   " }))
    && throws(() => createCapabilityRequest({ capabilityId: "knowledge-search", reason: "a".repeat(MAX_CAPABILITY_REQUEST_REASON_CHARACTERS + 1) }))
    && throws(() => createCapabilityRequest({ capabilityId: "knowledge-search", reason: "Valid reason.", input: tooManyInput }))
    && throws(() => createCapabilityRequest({ capabilityId: "knowledge-search", reason: "Valid reason.", input: { ["k".repeat(MAX_CAPABILITY_INPUT_KEY_CHARACTERS + 1)]: "value" } }))
    && throws(() => createCapabilityRequest({ capabilityId: "knowledge-search", reason: "Valid reason.", input: { key: "v".repeat(MAX_CAPABILITY_INPUT_VALUE_CHARACTERS + 1) } }))
    && knowledgeDecision.decision === "allowed" && conversationDecision.decision === "allowed"
    && systemDecision.decision === "unavailable" && externalDecision.decision === "blocked" && unknownDecision.decision === "blocked"
    && evaluateCapabilityEligibility(restrictedEnabled) === "blocked"
    && evaluateCapabilityEligibility(writeEnabled) === "blocked"
    && evaluateCapabilityEligibility(externalEnabled) === "blocked"
    && registryBefore === JSON.stringify(getCapabilities());
  if (!passed) { console.error("Capability Request Contract QA: FAIL"); process.exit(1); }
  console.info("Capability Request Contract QA: PASS (declarative eligibility only; no capability execution or external calls)");
};

main();
