import { getKnowledgeSourceById } from "./knowledgeSourceRegistry.js";
import type { StructuredKnowledgeEntry } from "../types/structuredKnowledgeEntry.js";
export type StructuredKnowledgeEntryValidation = { readonly ok: true } | { readonly ok: false; readonly message: string };
const invalid = (message: string): StructuredKnowledgeEntryValidation => ({ ok: false, message });
const rank = { reference: 0, controlled: 1, official: 2 } as const;
const exactIso = (value: string): boolean => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString() === value;
export const validateStructuredKnowledgeEntry = (entry: Readonly<StructuredKnowledgeEntry>): StructuredKnowledgeEntryValidation => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.id) || entry.id.length > 80) return invalid("Invalid structured knowledge entry ID.");
  const source = getKnowledgeSourceById(entry.sourceId); if (!source) return invalid("Unknown structured knowledge source.");
  if (entry.domain !== source.domain) return invalid("Structured knowledge entry domain is incompatible with its source.");
  if (entry.title.trim().length === 0 || entry.title.length > 120) return invalid("Invalid structured knowledge entry title.");
  if (entry.summary.trim().length === 0 || entry.summary.length > 300) return invalid("Invalid structured knowledge entry summary.");
  if (entry.content.trim().length === 0 || entry.content.length > 4000) return invalid("Invalid structured knowledge entry content.");
  if (!["active", "inactive", "draft"].includes(entry.status)) return invalid("Invalid structured knowledge entry status.");
  if (!(entry.authority in rank) || rank[entry.authority] > rank[source.authority]) return invalid("Structured knowledge entry authority exceeds its source.");
  if (entry.version.trim().length === 0 || entry.version.length > 64 || !exactIso(entry.updatedAt)) return invalid("Invalid structured knowledge entry version or timestamp.");
  if (entry.tags.length === 0 || entry.tags.length > 12 || entry.tags.some((tag) => tag.trim().length === 0 || tag.length > 48) || new Set(entry.tags).size !== entry.tags.length) return invalid("Invalid structured knowledge entry tags.");
  return { ok: true };
};
