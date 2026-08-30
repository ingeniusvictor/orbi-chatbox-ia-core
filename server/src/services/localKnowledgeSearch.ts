import {
  getAllKnowledgeEntries,
} from "./localKnowledgeRegistry.js";
import type {
  KnowledgeEntry,
  KnowledgeMatch,
  KnowledgeMatchField,
} from "../types/knowledge.js";

const DEFAULT_LIMIT = 3;
const MAX_LIMIT = 10;

export const normalizeKnowledgeQuery = (value: string): string =>
  value.trim().toLowerCase().replace(/\s+/g, " ");

const tokenizeQuery = (query: string): readonly string[] =>
  [...new Set(normalizeKnowledgeQuery(query).split(" ").filter(Boolean))];

const resolveLimit = (value: number): number =>
  Number.isSafeInteger(value) && value > 0 ? Math.min(value, MAX_LIMIT) : DEFAULT_LIMIT;

const includesToken = (value: string, token: string): boolean =>
  normalizeKnowledgeQuery(value).includes(token);

const buildMatch = (entry: Readonly<KnowledgeEntry>, query: string, tokens: readonly string[]): KnowledgeMatch | undefined => {
  const matchedFields = new Set<KnowledgeMatchField>();
  let score = normalizeKnowledgeQuery(entry.id) === query ? 100 : 0;
  if (score > 0) matchedFields.add("id");

  for (const token of tokens) {
    if (includesToken(entry.title, token)) {
      score += 20;
      matchedFields.add("title");
    }
    if (entry.tags.some((tag) => normalizeKnowledgeQuery(tag) === token)) {
      score += 15;
      matchedFields.add("tags");
    }
    if (includesToken(entry.id, token)) {
      score += 10;
      matchedFields.add("id");
    }
    if (includesToken(entry.content, token)) {
      score += 5;
      matchedFields.add("content");
    }
  }

  return score > 0
    ? Object.freeze({
        entry,
        score,
        matchedFields: Object.freeze([...matchedFields]),
      })
    : undefined;
};

export const searchLocalKnowledge = (
  query: string,
  limit = DEFAULT_LIMIT,
): readonly Readonly<KnowledgeMatch>[] => {
  const normalizedQuery = normalizeKnowledgeQuery(query);
  if (!normalizedQuery) return Object.freeze([]);

  const tokens = tokenizeQuery(normalizedQuery);
  return Object.freeze(
    getAllKnowledgeEntries()
      .map((entry) => buildMatch(entry, normalizedQuery, tokens))
      .filter((match): match is Readonly<KnowledgeMatch> => match !== undefined)
      .sort((left, right) => right.score - left.score || (left.entry.id < right.entry.id ? -1 : left.entry.id > right.entry.id ? 1 : 0))
      .slice(0, resolveLimit(limit)),
  );
};
