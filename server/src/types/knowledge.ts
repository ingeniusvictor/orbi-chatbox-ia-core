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
