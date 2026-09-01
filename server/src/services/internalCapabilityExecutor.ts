import { searchLocalKnowledge } from "./localKnowledgeSearch.js";
import { evaluateCapabilityRequest } from "./capabilityRequest.js";
import { lookupStructuredKnowledge } from "./structuredKnowledgeLookup.js";
import type { CapabilityRequest } from "../types/capabilityRequest.js";
import type { CapabilityExecutionResult, KnowledgeSearchCapabilityResult } from "../types/capabilityExecution.js";

export const MAX_CAPABILITY_KNOWLEDGE_RESULTS = 5;
export const MAX_CAPABILITY_KNOWLEDGE_QUERY_CHARACTERS = 1000;
const MAX_CAPABILITY_KNOWLEDGE_SUMMARY_CHARACTERS = 600;

const result = (
  request: Readonly<CapabilityRequest>,
  status: CapabilityExecutionResult["status"],
  output: CapabilityExecutionResult["output"],
  errorCode?: CapabilityExecutionResult["errorCode"],
): Readonly<CapabilityExecutionResult> => Object.freeze({ requestId: request.id, capabilityId: request.capabilityId, status, output, ...(errorCode ? { errorCode } : {}) });

const boundedSummary = (value: string): string => value.slice(0, MAX_CAPABILITY_KNOWLEDGE_SUMMARY_CHARACTERS);

const executeKnowledgeSearch = (request: Readonly<CapabilityRequest>): Readonly<CapabilityExecutionResult> => {
  const query = request.input.query?.trim();
  if (!query || query.length > MAX_CAPABILITY_KNOWLEDGE_QUERY_CHARACTERS) {
    return result(request, "failed", null, "CAPABILITY_INPUT_INVALID");
  }

  const results: KnowledgeSearchCapabilityResult[] = [];
  const seenEntryIds = new Set<string>();
  const structured = lookupStructuredKnowledge(query, { limit: MAX_CAPABILITY_KNOWLEDGE_RESULTS });
  const legacy = searchLocalKnowledge(query, MAX_CAPABILITY_KNOWLEDGE_RESULTS);
  const add = (candidate: KnowledgeSearchCapabilityResult): void => {
    if (results.length < MAX_CAPABILITY_KNOWLEDGE_RESULTS && !seenEntryIds.has(candidate.entryId)) {
      seenEntryIds.add(candidate.entryId);
      results.push(Object.freeze(candidate));
    }
  };

  for (const match of structured) {
    add({ entryId: match.entry.id, title: match.entry.title, summary: boundedSummary(match.entry.summary), sourceId: match.entry.sourceId, sourceType: "structured" });
  }
  for (const match of legacy) {
    add({ entryId: match.entry.id, title: match.entry.title, summary: boundedSummary(match.entry.content), sourceType: "local-static" });
  }
  const output = Object.freeze({ query, results: Object.freeze(results) });
  return result(request, "success", output);
};

/** Executes only the explicitly whitelisted internal read-only knowledge search capability. */
export const executeInternalCapability = (request: Readonly<CapabilityRequest>): Readonly<CapabilityExecutionResult> => {
  const decision = evaluateCapabilityRequest(request);
  if (decision.decision === "blocked") return result(request, "blocked", null, "CAPABILITY_REQUEST_BLOCKED");
  if (decision.decision === "unavailable") return result(request, "unavailable", null, "CAPABILITY_UNAVAILABLE");

  try {
    switch (request.capabilityId) {
      case "knowledge-search": return executeKnowledgeSearch(request);
      default: return result(request, "blocked", null, "CAPABILITY_REQUEST_BLOCKED");
    }
  } catch {
    return result(request, "failed", null, "CAPABILITY_EXECUTION_FAILED");
  }
};
