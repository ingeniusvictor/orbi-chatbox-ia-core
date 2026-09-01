import { MAX_CAPABILITY_KNOWLEDGE_QUERY_CHARACTERS } from "./internalCapabilityExecutor.js";
import { createCapabilityRequest } from "./capabilityRequest.js";
import type { CapabilityRequest } from "../types/capabilityRequest.js";

const explicitSearchPhrase = /\b(busca|buscar|consulta|consultar)\b|informaci[oó]n sobre|conocimiento sobre/i;
const orbiReference = /\borbi\b/i;

/** Conservative Core policy: only explicit ORBI knowledge searches are eligible for invocation. */
export const shouldInvokeKnowledgeSearch = (message: string): boolean => {
  const normalized = message.trim();
  return normalized.length > 0
    && normalized.length <= MAX_CAPABILITY_KNOWLEDGE_QUERY_CHARACTERS
    && explicitSearchPhrase.test(normalized)
    && orbiReference.test(normalized);
};

const extractKnowledgeQuery = (message: string): string => {
  const match = message.trim().match(/\bsobre\s+(.+)$/i);
  return (match?.[1] ?? message).trim().replace(/[.?!]+$/, "").trim();
};

export const createControlledKnowledgeSearchRequest = (message: string): Readonly<CapabilityRequest> | undefined => {
  const normalizedMessage = message.trim();
  const query = extractKnowledgeQuery(normalizedMessage);
  return shouldInvokeKnowledgeSearch(normalizedMessage)
    ? createCapabilityRequest({ capabilityId: "knowledge-search", reason: "Search controlled ORBI knowledge explicitly requested by the user.", input: { query } })
    : undefined;
};
