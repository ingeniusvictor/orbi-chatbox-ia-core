import type { KnowledgeContext } from "../types/knowledge.js";
import type { KnowledgeResponse } from "../types/response.js";

export const MAX_KNOWLEDGE_RESPONSE_CHARACTERS = 600;
export const NO_KNOWLEDGE_RESPONSE_TEXT =
  "No encontré información local disponible para esa consulta en este sandbox.";

const boundResponseText = (text: string): string =>
  text.length <= MAX_KNOWLEDGE_RESPONSE_CHARACTERS
    ? text
    : `${text.slice(0, MAX_KNOWLEDGE_RESPONSE_CHARACTERS - 3)}...`;

export const composeKnowledgeResponse = (
  knowledgeContext: Readonly<KnowledgeContext>,
): Readonly<KnowledgeResponse> => {
  const entry = knowledgeContext.entries[0];
  if (!entry) {
    return Object.freeze({
      text: NO_KNOWLEDGE_RESPONSE_TEXT,
      mode: "knowledge-deterministic" as const,
      grounded: false,
      sourceEntryIds: Object.freeze([]),
    });
  }

  return Object.freeze({
    text: boundResponseText(`${entry.title}: ${entry.content}`),
    mode: "knowledge-deterministic" as const,
    grounded: true,
    sourceEntryIds: Object.freeze([entry.id]),
  });
};
