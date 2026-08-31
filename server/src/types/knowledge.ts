export type KnowledgeDomain =
  | "orbi"
  | "academy"
  | "news"
  | "corporate"
  | "development"
  | "services"
  | "games"
  | "sleep"
  | "system";

export type KnowledgeEntry = {
  readonly id: string;
  readonly domain: KnowledgeDomain;
  readonly title: string;
  readonly content: string;
  readonly tags: readonly string[];
  readonly status: "sandbox";
};

export type KnowledgeMatchField = "id" | "title" | "tags" | "content";

export type KnowledgeMatch = {
  readonly entry: Readonly<KnowledgeEntry>;
  readonly score: number;
  readonly matchedFields: readonly KnowledgeMatchField[];
};

export type KnowledgeContextEntry = {
  readonly id: string;
  readonly sourceId?: string;
  readonly sourceType?: "local-static" | "structured";
  readonly domain: KnowledgeDomain;
  readonly title: string;
  readonly content: string;
  readonly score: number;
};

export type KnowledgeContext = {
  readonly query: string;
  readonly source: "local-static";
  readonly mode: "sandbox";
  readonly matchCount: number;
  readonly entries: readonly Readonly<KnowledgeContextEntry>[];
  readonly totalCharacters: number;
  readonly truncated: boolean;
};
