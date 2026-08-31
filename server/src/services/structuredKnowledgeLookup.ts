import { getActiveKnowledgeSources } from "./knowledgeSourceRegistry.js";
import { getActiveStructuredKnowledgeEntries } from "./structuredKnowledgeEntryRegistry.js";
import type { StructuredKnowledgeLookupResult } from "../types/structuredKnowledgeLookup.js";
export const DEFAULT_STRUCTURED_KNOWLEDGE_LOOKUP_LIMIT = 5;
export const MAX_STRUCTURED_KNOWLEDGE_LOOKUP_LIMIT = 10;
const normalize = (value: string): string => value.trim().toLowerCase().replace(/[^a-z0-9áéíóúüñ]+/gi, " ").replace(/\s+/g, " ").trim();
const terms = (query: string): readonly string[] => Object.freeze([...new Set(normalize(query).split(" ").filter(Boolean))].slice(0, 12));
const authorityRank = { official: 2, controlled: 1, reference: 0 } as const;
export const lookupStructuredKnowledge = (query: string, options: Readonly<{ limit?: number }> = {}): readonly Readonly<StructuredKnowledgeLookupResult>[] => {
  const queryTerms = terms(query); if (queryTerms.length === 0) return Object.freeze([]);
  const limit = Number.isInteger(options.limit) && options.limit! > 0 ? Math.min(options.limit!, MAX_STRUCTURED_KNOWLEDGE_LOOKUP_LIMIT) : DEFAULT_STRUCTURED_KNOWLEDGE_LOOKUP_LIMIT;
  const activeSources = new Set(getActiveKnowledgeSources().map((source) => source.id));
  const results = getActiveStructuredKnowledgeEntries().filter((entry) => activeSources.has(entry.sourceId)).map((entry) => {
    const title = normalize(entry.title), summary = normalize(entry.summary), content = normalize(entry.content), tags = entry.tags.map(normalize);
    const matchedTerms = queryTerms.filter((term) => title.includes(term) || summary.includes(term) || content.includes(term) || tags.some((tag) => tag === term));
    const score = queryTerms.reduce((total, term) => total + (title.includes(term) ? 4 : 0) + (tags.some((tag) => tag === term) ? 3 : 0) + (summary.includes(term) ? 2 : 0) + (content.includes(term) ? 1 : 0), 0);
    return Object.freeze({ entry, score, matchedTerms: Object.freeze(matchedTerms) });
  }).filter((result) => result.score > 0).sort((left, right) => right.score - left.score || authorityRank[right.entry.authority] - authorityRank[left.entry.authority] || (left.entry.id < right.entry.id ? -1 : 1));
  return Object.freeze(results.slice(0, limit).map((result) => Object.freeze({ ...result, entry: Object.freeze({ ...result.entry, tags: Object.freeze([...result.entry.tags]) }), matchedTerms: Object.freeze([...result.matchedTerms]) })));
};
