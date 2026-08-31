import { normalizeKnowledgeQuery, searchLocalKnowledge } from "./localKnowledgeSearch.js";
import { lookupStructuredKnowledge } from "./structuredKnowledgeLookup.js";
import { mapStructuredKnowledgeResultToContextEntry } from "./structuredKnowledgeContextMapper.js";
import type { KnowledgeContext, KnowledgeContextEntry } from "../types/knowledge.js";

export const MAX_CONTEXT_ENTRIES = 3;
export const MAX_CONTEXT_CHARACTERS = 1_200;

const entryCharacterCount = (entry: KnowledgeContextEntry): number =>
  entry.title.length + entry.content.length;

const createContextEntry = (
  id: string,
  domain: KnowledgeContextEntry["domain"],
  title: string,
  content: string,
  score: number,
): Readonly<KnowledgeContextEntry> =>
  Object.freeze({ id, sourceType: "local-static", domain, title, content, score });

export const buildKnowledgeContext = (query: string): Readonly<KnowledgeContext> => {
  const normalizedQuery = normalizeKnowledgeQuery(query);
  const matches = searchLocalKnowledge(normalizedQuery, 10);
  const structured = lookupStructuredKnowledge(normalizedQuery, { limit: 10 }).map(mapStructuredKnowledgeResultToContextEntry);
  const entries: Readonly<KnowledgeContextEntry>[] = [];
  let totalCharacters = 0;
  let truncated = false;

  const candidates = [
    ...structured,
    ...matches.map((match) => createContextEntry(match.entry.id, match.entry.domain, match.entry.title, match.entry.content, match.score)),
  ];
  const seenEntryIds = new Set<string>();

  for (const entry of candidates) {
    if (seenEntryIds.has(entry.id)) {
      continue;
    }

    seenEntryIds.add(entry.id);
    const characterCount = entryCharacterCount(entry);

    if (
      entries.length >= MAX_CONTEXT_ENTRIES
      || totalCharacters + characterCount > MAX_CONTEXT_CHARACTERS
    ) {
      truncated = true;
      break;
    }

    entries.push(entry);
    totalCharacters += characterCount;
  }

  return Object.freeze({
    query: normalizedQuery,
    source: "local-static",
    mode: "sandbox",
    matchCount: matches.length + structured.length,
    entries: Object.freeze(entries),
    totalCharacters,
    truncated,
  });
};
