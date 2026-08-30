import type { KnowledgeEntry } from "../src/types/knowledge.js";
import {
  getAllKnowledgeEntries,
  getKnowledgeEntriesByDomain,
  getKnowledgeEntryById,
} from "../src/services/localKnowledgeRegistry.js";

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

  console.info(`Knowledge QA: PASS (${entries.length} sandbox entries)`);
};

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : "Unexpected knowledge QA error.";
  console.error(`Knowledge QA: FAIL — ${message}`);
  process.exit(1);
}
