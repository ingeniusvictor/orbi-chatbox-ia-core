import type { KnowledgeDomain } from "./knowledge.js";
import type { KnowledgeSourceAuthority, KnowledgeSourceStatus } from "./knowledgeSource.js";

export type StructuredKnowledgeEntry = {
  readonly id: string; readonly sourceId: string; readonly domain: KnowledgeDomain;
  readonly title: string; readonly content: string; readonly summary: string;
  readonly status: KnowledgeSourceStatus; readonly authority: KnowledgeSourceAuthority;
  readonly version: string; readonly updatedAt: string; readonly tags: readonly string[];
};
