import type { KnowledgeDomain } from "../types/knowledge.js";
import type { KnowledgeSource, KnowledgeSourceAuthority, KnowledgeSourceStatus, KnowledgeSourceType } from "../types/knowledgeSource.js";

const domains: readonly KnowledgeDomain[] = ["orbi", "academy", "news", "corporate", "development", "services", "games", "sleep", "system"];
const sourceTypes: readonly KnowledgeSourceType[] = ["static", "document", "dataset"];
const authorities: readonly KnowledgeSourceAuthority[] = ["official", "controlled", "reference"];
const statuses: readonly KnowledgeSourceStatus[] = ["active", "inactive", "draft"];
const MAX_SOURCE_ID_LENGTH = 64;
const MAX_SOURCE_TAGS = 12;
const MAX_TAG_LENGTH = 48;

export type KnowledgeSourceValidation = { readonly ok: true } | { readonly ok: false; readonly message: string };

const invalid = (message: string): KnowledgeSourceValidation => ({ ok: false, message });
const isExactIsoTimestamp = (value: string): boolean => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)
  && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString() === value;

/** Pure validation for bounded, connector-neutral source descriptors. */
export const validateKnowledgeSource = (source: Readonly<KnowledgeSource>): KnowledgeSourceValidation => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(source.id) || source.id.length > MAX_SOURCE_ID_LENGTH) return invalid("Invalid knowledge source ID.");
  if (source.name.trim().length === 0 || source.name.length > 160) return invalid("Invalid knowledge source name.");
  if (!domains.includes(source.domain)) return invalid("Invalid knowledge source domain.");
  if (!sourceTypes.includes(source.sourceType)) return invalid("Invalid knowledge source type.");
  if (!authorities.includes(source.authority)) return invalid("Invalid knowledge source authority.");
  if (!statuses.includes(source.status)) return invalid("Invalid knowledge source status.");
  if (source.description.trim().length === 0 || source.description.length > 600) return invalid("Invalid knowledge source description.");
  if (source.version.trim().length === 0 || source.version.length > 64) return invalid("Invalid knowledge source version.");
  if (!isExactIsoTimestamp(source.updatedAt)) return invalid("Invalid knowledge source timestamp.");
  if (source.tags.length === 0 || source.tags.length > MAX_SOURCE_TAGS) return invalid("Invalid knowledge source tags.");
  if (source.tags.some((tag) => tag.trim().length === 0 || tag.length > MAX_TAG_LENGTH)) return invalid("Invalid knowledge source tag.");
  if (new Set(source.tags).size !== source.tags.length) return invalid("Knowledge source tags must be unique.");
  return { ok: true };
};
