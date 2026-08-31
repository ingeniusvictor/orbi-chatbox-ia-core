import { ORBI_KNOWLEDGE_SOURCES } from "../src/data/orbiKnowledgeSources.js";
import { STRUCTURED_KNOWLEDGE_ENTRIES } from "../src/data/structuredKnowledgeEntries.js";
import { LUMI_BEHAVIOR_POLICY } from "../src/data/lumiBehaviorPolicy.js";
import { mockAiProvider } from "../src/providers/mockAiProvider.js";
import { composeAssistantBehaviorInstruction } from "../src/services/assistantBehaviorPolicyComposer.js";
import { getAssistantIdentity } from "../src/services/assistantIdentity.js";
import { composeAssistantInstruction } from "../src/services/assistantInstructionComposer.js";
import { composeCompactAssistantRuntimeInstruction } from "../src/services/assistantRuntimeInstructionComposer.js";
import { buildKnowledgeContext, MAX_CONTEXT_CHARACTERS, MAX_CONTEXT_ENTRIES } from "../src/services/knowledgeContextBuilder.js";
import { mapStructuredKnowledgeResultToContextEntry } from "../src/services/structuredKnowledgeContextMapper.js";
import { lookupStructuredKnowledge } from "../src/services/structuredKnowledgeLookup.js";
import { validateKnowledgeSource } from "../src/services/knowledgeSourceValidator.js";
import { validateStructuredKnowledgeEntry } from "../src/services/structuredKnowledgeEntryValidator.js";

const assert = (condition: unknown, message: string): void => {
  if (!condition) throw new Error(message);
};

const main = async (): Promise<void> => {
  const identity = getAssistantIdentity();
  const assistantInstruction = composeAssistantInstruction(identity);
  const assistantRuntimeInstruction = composeCompactAssistantRuntimeInstruction(assistantInstruction);
  const assistantBehaviorInstruction = composeAssistantBehaviorInstruction(LUMI_BEHAVIOR_POLICY, identity.id);
  const core = buildKnowledgeContext("ORBI Core Knowledge");
  const local = buildKnowledgeContext("sandbox assistant");
  const mixed = buildKnowledgeContext("ORBI Core");
  const empty = buildKnowledgeContext("zzqv-unmatched-knowledge");
  const unsupported = buildKnowledgeContext("¿Cuál es la política de precios 2027 de O.R.B.I.?");
  const repeatedCore = buildKnowledgeContext("ORBI Core Knowledge");
  const lookup = lookupStructuredKnowledge("ORBI Core Knowledge");
  const mapped = lookup[0] ? mapStructuredKnowledgeResultToContextEntry(lookup[0]) : undefined;
  const emptyResponse = await mockAiProvider.generate(Object.freeze({
    requestId: "knowledge-engine-final-qa", conversationId: "knowledge-engine-final-qa", message: "¿Quién eres?", knowledgeContext: empty,
    assistantInstruction, assistantRuntimeInstruction, assistantBehaviorInstruction,
  }));
  const coreResponse = await mockAiProvider.generate(Object.freeze({
    requestId: "knowledge-engine-final-qa-core", conversationId: "knowledge-engine-final-qa", message: "ORBI Core Knowledge", knowledgeContext: core,
    assistantInstruction, assistantRuntimeInstruction, assistantBehaviorInstruction,
  }));

  assert(ORBI_KNOWLEDGE_SOURCES.length === 5, "Expected five canonical knowledge sources.");
  assert(STRUCTURED_KNOWLEDGE_ENTRIES.length === 5, "Expected five controlled structured entries.");
  assert(ORBI_KNOWLEDGE_SOURCES.every((source) => validateKnowledgeSource(source).ok && source.sourceType === "static"), "Sources must be valid controlled static descriptors.");
  assert(STRUCTURED_KNOWLEDGE_ENTRIES.every((entry) => validateStructuredKnowledgeEntry(entry).ok), "Structured entries must be valid.");
  assert(STRUCTURED_KNOWLEDGE_ENTRIES.every((entry) => ORBI_KNOWLEDGE_SOURCES.some((source) => source.id === entry.sourceId)), "Structured entries must not be orphaned.");
  assert(JSON.stringify(lookup) === JSON.stringify(lookupStructuredKnowledge("ORBI Core Knowledge")), "Structured lookup must be deterministic.");
  assert(lookupStructuredKnowledge("no").length === 0, "Short tokens must not create structured false positives.");
  assert(lookupStructuredKnowledge("zzqv-unmatched-knowledge").length === 0, "Unsupported structured lookup must be empty.");
  assert(mapped?.id === "core-assistant-overview" && mapped.sourceId === "orbi-core" && mapped.sourceType === "structured", "Structured mapping must preserve provenance.");
  assert(local.entries.some((entry) => entry.id === "orbi-sandbox-assistant" && entry.sourceType === "local-static"), "Legacy local mapping must remain available.");
  assert(core.entries[0]?.id === "core-assistant-overview" && core.entries[0]?.sourceType === "structured", "Structured entries must have merge priority.");
  assert(mixed.entries.some((entry) => entry.sourceType === "structured") && mixed.entries.some((entry) => entry.sourceType === "local-static"), "Local entries must fill merged structured context.");
  for (const context of [core, local, mixed, empty, unsupported]) {
    assert(context.entries.length <= MAX_CONTEXT_ENTRIES, "Context entry limit exceeded.");
    assert(context.totalCharacters <= MAX_CONTEXT_CHARACTERS, "Context character limit exceeded.");
    assert(new Set(context.entries.map((entry) => entry.id)).size === context.entries.length, "Context contains duplicate entry IDs.");
  }
  assert(JSON.stringify(core) === JSON.stringify(repeatedCore), "Repeated pipeline must produce an equivalent context.");
  assert(coreResponse.grounded === true && coreResponse.sourceEntryIds.every((id) => core.entries.some((entry) => entry.id === id)), "Grounding must derive from actual context entries.");
  assert(empty.entries.length === 0 && emptyResponse.grounded === false && emptyResponse.sourceEntryIds.length === 0, "Empty context, identity, and behavior instructions must not ground a response.");
  assert(unsupported.entries.length === 0, "Unsupported ORBI facts must not gain local context from short tokens.");
  assert(Object.isFrozen(ORBI_KNOWLEDGE_SOURCES) && Object.isFrozen(STRUCTURED_KNOWLEDGE_ENTRIES) && Object.isFrozen(core.entries), "Knowledge registries and context must be immutable.");
  console.info("Knowledge Engine Final QA: PASS (bounded deterministic local knowledge only; no external retrieval or persistence)");
};

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Knowledge Engine Final QA: FAIL");
  process.exit(1);
});
