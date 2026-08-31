import { STRUCTURED_KNOWLEDGE_ENTRIES } from "../src/data/structuredKnowledgeEntries.js";
import { getActiveStructuredKnowledgeEntries, getStructuredKnowledgeEntries, getStructuredKnowledgeEntriesBySource, getStructuredKnowledgeEntryById } from "../src/services/structuredKnowledgeEntryRegistry.js";
import { validateStructuredKnowledgeEntry } from "../src/services/structuredKnowledgeEntryValidator.js";
import { buildKnowledgeContext } from "../src/services/knowledgeContextBuilder.js";
import { searchLocalKnowledge } from "../src/services/localKnowledgeSearch.js";
const main = (): void => {
  const entries = getStructuredKnowledgeEntries(); const first = entries[0]!;
  const invalid = [
    { ...first, id: "Bad ID" }, { ...first, sourceId: "missing-source" }, { ...first, title: "" }, { ...first, content: "" }, { ...first, content: "x".repeat(4001) }, { ...first, domain: "system" as const }, { ...first, authority: "official" as const, sourceId: "orbi-services", domain: "services" as const }, { ...first, updatedAt: "bad" }, { ...first, tags: ["same", "same"] },
  ];
  const passed = entries.length === 5 && STRUCTURED_KNOWLEDGE_ENTRIES.length === 5
    && new Set(entries.map((entry) => entry.id)).size === 5 && entries.every((entry) => validateStructuredKnowledgeEntry(entry).ok)
    && entries.every((entry) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.id) && entry.sourceId.length > 0 && entry.title.length <= 120 && entry.summary.length <= 300 && entry.content.length <= 4000)
    && invalid.every((entry) => !validateStructuredKnowledgeEntry(Object.freeze({ ...entry, tags: Object.freeze([...entry.tags]) })).ok)
    && getStructuredKnowledgeEntryById("core-assistant-overview")?.sourceId === "orbi-core" && getStructuredKnowledgeEntryById("unknown") === undefined
    && getStructuredKnowledgeEntriesBySource("orbi-academy").length === 1 && getActiveStructuredKnowledgeEntries().length === 5
    && Object.isFrozen(entries) && Object.isFrozen(entries[0]) && Object.isFrozen(entries[0]?.tags)
    && searchLocalKnowledge("sandbox assistant").some((match) => match.entry.id === "orbi-sandbox-assistant") && buildKnowledgeContext("no-such-sandbox-query").entries.length === 0;
  if (!passed) { console.error("Structured Knowledge Entry QA: FAIL"); process.exit(1); }
  console.info("Structured Knowledge Entry QA: PASS (controlled provenance contract; runtime retrieval unchanged)");
}; main();
