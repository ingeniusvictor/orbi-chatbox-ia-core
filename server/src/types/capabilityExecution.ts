export type CapabilityExecutionStatus = "success" | "blocked" | "unavailable" | "failed";
export type KnowledgeSearchCapabilityResult = {
  readonly entryId: string;
  readonly title: string;
  readonly summary: string;
  readonly sourceId?: string;
  readonly sourceType: "structured" | "local-static";
};
export type KnowledgeSearchCapabilityOutput = {
  readonly query: string;
  readonly results: readonly Readonly<KnowledgeSearchCapabilityResult>[];
};

/** Bounded result from the controlled internal boundary; it never represents an external side effect. */
export type CapabilityExecutionResult = {
  readonly requestId: string;
  readonly capabilityId: string;
  readonly status: CapabilityExecutionStatus;
  readonly output: Readonly<KnowledgeSearchCapabilityOutput> | null;
  readonly errorCode?: "CAPABILITY_REQUEST_BLOCKED" | "CAPABILITY_UNAVAILABLE" | "CAPABILITY_INPUT_INVALID" | "CAPABILITY_EXECUTION_FAILED";
};
