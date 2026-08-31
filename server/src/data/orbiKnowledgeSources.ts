import type { KnowledgeSource } from "../types/knowledgeSource.js";

const freezeSource = (source: KnowledgeSource): Readonly<KnowledgeSource> => Object.freeze({ ...source, tags: Object.freeze([...source.tags]) });

/** Controlled source descriptors only. They contain no imported or real knowledge content. */
export const ORBI_KNOWLEDGE_SOURCES: readonly Readonly<KnowledgeSource>[] = Object.freeze([
  freezeSource({ id: "orbi-core", name: "ORBI Core Knowledge", domain: "orbi", sourceType: "static", authority: "official", status: "active", description: "Controlled descriptor for core ORBI knowledge scope.", version: "1", updatedAt: "2026-08-30T00:00:00.000Z", tags: ["orbi", "core", "controlled"] }),
  freezeSource({ id: "orbi-academy", name: "ORBI Academy", domain: "academy", sourceType: "static", authority: "official", status: "active", description: "Controlled descriptor for Academy learning material scope.", version: "1", updatedAt: "2026-08-30T00:00:00.000Z", tags: ["academy", "learning", "controlled"] }),
  freezeSource({ id: "orbi-services", name: "ORBI Services", domain: "services", sourceType: "static", authority: "controlled", status: "active", description: "Controlled descriptor for services documentation scope.", version: "1", updatedAt: "2026-08-30T00:00:00.000Z", tags: ["services", "documentation", "controlled"] }),
  freezeSource({ id: "orbi-development", name: "ORBI Development", domain: "development", sourceType: "static", authority: "official", status: "active", description: "Controlled descriptor for development documentation scope.", version: "1", updatedAt: "2026-08-30T00:00:00.000Z", tags: ["development", "system", "controlled"] }),
  freezeSource({ id: "orbi-corporate", name: "ORBI Corporate", domain: "corporate", sourceType: "static", authority: "controlled", status: "active", description: "Controlled descriptor for corporate information scope.", version: "1", updatedAt: "2026-08-30T00:00:00.000Z", tags: ["corporate", "information", "controlled"] }),
]);
