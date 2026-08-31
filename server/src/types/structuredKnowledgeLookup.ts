import type { StructuredKnowledgeEntry } from "./structuredKnowledgeEntry.js";
export type StructuredKnowledgeLookupResult = { readonly entry: Readonly<StructuredKnowledgeEntry>; readonly score: number; readonly matchedTerms: readonly string[]; };
