export type KnowledgeResponse = {
  readonly text: string;
  readonly mode: "knowledge-deterministic";
  readonly grounded: boolean;
  readonly sourceEntryIds: readonly string[];
};
