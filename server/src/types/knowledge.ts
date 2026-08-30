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
