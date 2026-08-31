import { ORBI_KNOWLEDGE_SOURCES } from "../data/orbiKnowledgeSources.js";
import { validateKnowledgeSource } from "./knowledgeSourceValidator.js";
import type { KnowledgeSource } from "../types/knowledgeSource.js";

const copySource = (source: Readonly<KnowledgeSource>): Readonly<KnowledgeSource> => Object.freeze({ ...source, tags: Object.freeze([...source.tags]) });

for (const source of ORBI_KNOWLEDGE_SOURCES) {
  const validation = validateKnowledgeSource(source);
  if (validation.ok === false) throw new Error(`Invalid registered knowledge source: ${validation.message}`);
}
if (new Set(ORBI_KNOWLEDGE_SOURCES.map((source) => source.id)).size !== ORBI_KNOWLEDGE_SOURCES.length) {
  throw new Error("Registered knowledge source IDs must be unique.");
}

export const getKnowledgeSources = (): readonly Readonly<KnowledgeSource>[] => Object.freeze(ORBI_KNOWLEDGE_SOURCES.map(copySource));
export const getKnowledgeSourceById = (id: string): Readonly<KnowledgeSource> | undefined => {
  const source = ORBI_KNOWLEDGE_SOURCES.find((candidate) => candidate.id === id);
  return source ? copySource(source) : undefined;
};
export const getActiveKnowledgeSources = (): readonly Readonly<KnowledgeSource>[] => Object.freeze(
  ORBI_KNOWLEDGE_SOURCES.filter((source) => source.status === "active").map(copySource),
);
