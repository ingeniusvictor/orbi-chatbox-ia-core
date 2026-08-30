import { LOCAL_KNOWLEDGE_ENTRIES } from "../data/localKnowledge.js";
import type { KnowledgeDomain, KnowledgeEntry } from "../types/knowledge.js";

const copyEntry = (entry: Readonly<KnowledgeEntry>): Readonly<KnowledgeEntry> =>
  Object.freeze({ ...entry, tags: Object.freeze([...entry.tags]) });

export const getAllKnowledgeEntries = (): readonly Readonly<KnowledgeEntry>[] =>
  Object.freeze(LOCAL_KNOWLEDGE_ENTRIES.map(copyEntry));

export const getKnowledgeEntryById = (id: string): Readonly<KnowledgeEntry> | undefined => {
  const entry = LOCAL_KNOWLEDGE_ENTRIES.find((candidate) => candidate.id === id);
  return entry ? copyEntry(entry) : undefined;
};

export const getKnowledgeEntriesByDomain = (
  domain: KnowledgeDomain,
): readonly Readonly<KnowledgeEntry>[] =>
  Object.freeze(
    LOCAL_KNOWLEDGE_ENTRIES
      .filter((entry) => entry.domain === domain)
      .map(copyEntry),
  );
