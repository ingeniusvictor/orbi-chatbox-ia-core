import type { StructuredKnowledgeLookupResult } from "../types/structuredKnowledgeLookup.js";
import type { KnowledgeContextEntry } from "../types/knowledge.js";
export const mapStructuredKnowledgeResultToContextEntry = (result: Readonly<StructuredKnowledgeLookupResult>): Readonly<KnowledgeContextEntry> => Object.freeze({ id: result.entry.id, sourceId: result.entry.sourceId, sourceType: "structured", domain: result.entry.domain, title: result.entry.title, content: result.entry.content, score: result.score });
