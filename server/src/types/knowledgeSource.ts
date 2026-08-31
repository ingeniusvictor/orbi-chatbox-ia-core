import type { KnowledgeDomain } from "./knowledge.js";

export type KnowledgeSourceType = "static" | "document" | "dataset";
export type KnowledgeSourceAuthority = "official" | "controlled" | "reference";
export type KnowledgeSourceStatus = "active" | "inactive" | "draft";

/** Controlled metadata descriptor; it is not a knowledge document or ingestion connector. */
export type KnowledgeSource = {
  readonly id: string;
  readonly name: string;
  readonly domain: KnowledgeDomain;
  readonly sourceType: KnowledgeSourceType;
  readonly authority: KnowledgeSourceAuthority;
  readonly status: KnowledgeSourceStatus;
  readonly description: string;
  readonly version: string;
  readonly updatedAt: string;
  readonly tags: readonly string[];
};
