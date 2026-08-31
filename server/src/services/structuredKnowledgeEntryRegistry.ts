import { STRUCTURED_KNOWLEDGE_ENTRIES } from "../data/structuredKnowledgeEntries.js";
import { validateStructuredKnowledgeEntry } from "./structuredKnowledgeEntryValidator.js";
import type { StructuredKnowledgeEntry } from "../types/structuredKnowledgeEntry.js";
const copy = (entry: Readonly<StructuredKnowledgeEntry>): Readonly<StructuredKnowledgeEntry> => Object.freeze({ ...entry, tags: Object.freeze([...entry.tags]) });
for (const entry of STRUCTURED_KNOWLEDGE_ENTRIES) {
  const result = validateStructuredKnowledgeEntry(entry);
  if (result.ok === false) throw new Error(`Invalid structured knowledge entry: ${result.message}`);
}
if (new Set(STRUCTURED_KNOWLEDGE_ENTRIES.map((entry) => entry.id)).size !== STRUCTURED_KNOWLEDGE_ENTRIES.length) throw new Error("Structured knowledge entry IDs must be unique.");
export const getStructuredKnowledgeEntries = (): readonly Readonly<StructuredKnowledgeEntry>[] => Object.freeze(STRUCTURED_KNOWLEDGE_ENTRIES.map(copy));
export const getStructuredKnowledgeEntryById = (id: string): Readonly<StructuredKnowledgeEntry> | undefined => { const entry = STRUCTURED_KNOWLEDGE_ENTRIES.find((candidate) => candidate.id === id); return entry ? copy(entry) : undefined; };
export const getStructuredKnowledgeEntriesBySource = (sourceId: string): readonly Readonly<StructuredKnowledgeEntry>[] => Object.freeze(STRUCTURED_KNOWLEDGE_ENTRIES.filter((entry) => entry.sourceId === sourceId).map(copy));
export const getActiveStructuredKnowledgeEntries = (): readonly Readonly<StructuredKnowledgeEntry>[] => Object.freeze(STRUCTURED_KNOWLEDGE_ENTRIES.filter((entry) => entry.status === "active").map(copy));
