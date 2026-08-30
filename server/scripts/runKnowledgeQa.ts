import type { KnowledgeEntry } from "../src/types/knowledge.js";
import {
  getAllKnowledgeEntries,
  getKnowledgeEntriesByDomain,
  getKnowledgeEntryById,
} from "../src/services/localKnowledgeRegistry.js";
import { searchLocalKnowledge } from "../src/services/localKnowledgeSearch.js";
import {
  buildKnowledgeContext,
  MAX_CONTEXT_CHARACTERS,
  MAX_CONTEXT_ENTRIES,
} from "../src/services/knowledgeContextBuilder.js";

const assert = (condition: unknown, message: string): void => {
  if (!condition) {
    throw new Error(message);
  }
};

const main = (): void => {
  const entries = getAllKnowledgeEntries();
  assert(entries.length > 0, "Registry must not be empty.");
  assert(new Set(entries.map((entry) => entry.id)).size === entries.length, "Registry IDs must be unique.");

  for (const entry of entries) {
    assert(entry.id.length > 0, "Entry ID must be non-empty.");
    assert(entry.title.length > 0, `Entry ${entry.id} must have a title.`);
    assert(entry.content.length > 0, `Entry ${entry.id} must have content.`);
    assert(Array.isArray(entry.tags) && entry.tags.length > 0, `Entry ${entry.id} must have tags.`);
    assert(entry.status === "sandbox", `Entry ${entry.id} must remain sandbox-only.`);
    assert(Object.isFrozen(entry) && Object.isFrozen(entry.tags), `Entry ${entry.id} must be immutable.`);
  }

  const knownEntry = getKnowledgeEntryById("orbi-sandbox-assistant");
  assert(knownEntry?.id === "orbi-sandbox-assistant", "Known ID lookup must succeed.");
  assert(getKnowledgeEntryById("unknown-entry") === undefined, "Unknown ID lookup must return undefined.");

  const systemEntries = getKnowledgeEntriesByDomain("system");
  assert(systemEntries.length > 0 && systemEntries.every((entry) => entry.domain === "system"), "Domain lookup must preserve its domain.");

  const beforeLength = entries.length;
  try {
    (entries as KnowledgeEntry[]).push(entries[0]);
  } catch {
    // Frozen output is expected to reject mutation.
  }
  const rereadEntries = getAllKnowledgeEntries();
  assert(rereadEntries.length === beforeLength, "Returned values must not mutate the canonical registry.");
  assert(rereadEntries[0] !== entries[0], "Registry reads must return protected copies.");

  assert(searchLocalKnowledge("").length === 0, "Empty query must return no matches.");
  assert(searchLocalKnowledge("   \t ").length === 0, "Whitespace-only query must return no matches.");

  const assistantMatches = searchLocalKnowledge("Sandbox   Assistant");
  assert(assistantMatches.some((match) => match.entry.id === "orbi-sandbox-assistant"), "Assistant query must find the sandbox assistant.");
  assert(assistantMatches.every((match) => match.score > 0), "Matches must have a positive deterministic score.");

  const tagMatches = searchLocalKnowledge("guardrails");
  assert(tagMatches.some((match) => match.entry.id === "development-local-workflow"), "Tag query must find the expected entry.");
  assert(searchLocalKnowledge("no-such-sandbox-query").length === 0, "Unknown query must return no matches.");

  const rankedMatches = searchLocalKnowledge("sandbox", 10);
  for (let index = 1; index < rankedMatches.length; index += 1) {
    const previous = rankedMatches[index - 1];
    const current = rankedMatches[index];
    assert(
      previous.score > current.score || (previous.score === current.score && previous.entry.id <= current.entry.id),
      "Results must use stable score and ID ordering.",
    );
  }
  assert(searchLocalKnowledge("sandbox", 1).length <= 1, "Result limit must be respected.");
  assert(searchLocalKnowledge("sandbox", 99).length <= 10, "Result limit must remain bounded.");

  const repeatedMatches = searchLocalKnowledge("sandbox", 10);
  assert(
    rankedMatches.map((match) => `${match.entry.id}:${match.score}`).join("|")
      === repeatedMatches.map((match) => `${match.entry.id}:${match.score}`).join("|"),
    "Repeated queries must return equivalent ordering and scores.",
  );
  assert(Object.isFrozen(assistantMatches[0]?.entry), "Search results must protect returned entries.");

  const assistantContext = buildKnowledgeContext("Sandbox   Assistant");
  assert(assistantContext.entries.length > 0, "Known query must build a non-empty context.");
  assert(assistantContext.query === "sandbox assistant", "Context must expose the shared normalized query.");
  assert(assistantContext.source === "local-static", "Context source must be local-static.");
  assert(assistantContext.mode === "sandbox", "Context mode must remain sandbox.");

  const unknownContext = buildKnowledgeContext("no-such-sandbox-query");
  assert(unknownContext.entries.length === 0 && unknownContext.matchCount === 0, "Unknown query must build an empty context.");
  const emptyContext = buildKnowledgeContext("   ");
  assert(emptyContext.entries.length === 0 && emptyContext.totalCharacters === 0, "Empty query must build a safe empty context.");

  const sandboxContext = buildKnowledgeContext("sandbox");
  const sandboxSearch = searchLocalKnowledge("sandbox", 10);
  assert(sandboxContext.matchCount === sandboxSearch.length, "Context match count must represent ranked search matches.");
  assert(sandboxContext.entries.length <= MAX_CONTEXT_ENTRIES, "Context entries must remain bounded.");
  assert(sandboxContext.totalCharacters <= MAX_CONTEXT_CHARACTERS, "Context character budget must remain bounded.");
  assert(
    sandboxContext.entries.map((entry) => entry.id).join("|")
      === sandboxSearch.slice(0, sandboxContext.entries.length).map((match) => match.entry.id).join("|"),
    "Context entry order must preserve search ranking.",
  );
  assert(
    sandboxContext.totalCharacters
      === sandboxContext.entries.reduce((total, entry) => total + entry.title.length + entry.content.length, 0),
    "Context character accounting must match included content.",
  );
  assert(sandboxContext.truncated === (sandboxContext.matchCount > sandboxContext.entries.length), "Context truncation must report excluded matches.");

  const repeatedContext = buildKnowledgeContext("sandbox");
  assert(
    JSON.stringify(sandboxContext) === JSON.stringify(repeatedContext),
    "Repeated queries must produce equivalent contexts.",
  );
  assert(Object.isFrozen(sandboxContext) && Object.isFrozen(sandboxContext.entries), "Context must be immutable.");
  assert(Object.isFrozen(sandboxContext.entries[0]), "Context entries must be immutable.");

  console.info(`Knowledge QA: PASS (${entries.length} sandbox entries, lookup and bounded context verified)`);
};

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : "Unexpected knowledge QA error.";
  console.error(`Knowledge QA: FAIL — ${message}`);
  process.exit(1);
}
