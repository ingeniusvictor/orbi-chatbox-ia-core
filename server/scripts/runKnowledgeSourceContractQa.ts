import { ORBI_KNOWLEDGE_SOURCES } from "../src/data/orbiKnowledgeSources.js";
import { getActiveKnowledgeSources, getKnowledgeSourceById, getKnowledgeSources } from "../src/services/knowledgeSourceRegistry.js";
import { validateKnowledgeSource } from "../src/services/knowledgeSourceValidator.js";
import { buildKnowledgeContext } from "../src/services/knowledgeContextBuilder.js";
import { searchLocalKnowledge } from "../src/services/localKnowledgeSearch.js";
import type { KnowledgeSource } from "../src/types/knowledgeSource.js";

const main = (): void => {
  const sources = getKnowledgeSources();
  const expectedIds = ["orbi-core", "orbi-academy", "orbi-services", "orbi-development", "orbi-corporate"];
  const sourceIds = sources.map((source) => source.id);
  const invalid = validateKnowledgeSource(Object.freeze({ ...sources[0]!, id: "Invalid Source", tags: Object.freeze(["duplicate", "duplicate"]) }) as Readonly<KnowledgeSource>);
  const repeated = getKnowledgeSources();
  const active = getActiveKnowledgeSources();
  const knownLookup = searchLocalKnowledge("sandbox assistant");
  const unknownContext = buildKnowledgeContext("no-such-sandbox-query");
  const passed = ORBI_KNOWLEDGE_SOURCES.length === 5
    && sourceIds.join(",") === expectedIds.join(",")
    && new Set(sourceIds).size === sources.length
    && sources.every((source) => validateKnowledgeSource(source).ok)
    && sources.every((source) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(source.id) && source.name.length > 0 && source.description.length > 0 && source.version.length > 0)
    && sources.every((source) => source.sourceType === "static" && ["official", "controlled", "reference"].includes(source.authority) && ["active", "inactive", "draft"].includes(source.status))
    && sources.every((source) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(source.updatedAt) && source.tags.length > 0 && source.tags.length <= 12 && new Set(source.tags).size === source.tags.length)
    && getKnowledgeSourceById("orbi-core")?.name === "ORBI Core Knowledge" && getKnowledgeSourceById("unknown-source") === undefined
    && active.length === sources.length && active.every((source) => source.status === "active")
    && JSON.stringify(sources) === JSON.stringify(repeated)
    && sources[0] !== repeated[0] && Object.isFrozen(sources) && Object.isFrozen(sources[0]) && Object.isFrozen(sources[0]?.tags)
    && invalid.ok === false
    && knownLookup.some((match) => match.entry.id === "orbi-sandbox-assistant")
    && unknownContext.entries.length === 0 && unknownContext.matchCount === 0;
  if (!passed) { console.error("Knowledge Source Contract QA: FAIL"); process.exit(1); }
  console.info("Knowledge Source Contract QA: PASS (controlled metadata only; lookup and grounding foundation unchanged)");
};

main();
