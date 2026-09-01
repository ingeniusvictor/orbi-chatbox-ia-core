export type CapabilityRequestStatus = "requested" | "allowed" | "blocked" | "unavailable";
export type CapabilityRequestInput = Readonly<Record<string, string>>;
export type CapabilityRequestDecisionStatus = "allowed" | "blocked" | "unavailable";

/** Declarative intent only. A request never grants or performs capability execution. */
export type CapabilityRequest = {
  readonly id: string;
  readonly capabilityId: string;
  readonly reason: string;
  readonly input: CapabilityRequestInput;
  readonly status: CapabilityRequestStatus;
};

/** Eligibility result only; it intentionally contains no execution result. */
export type CapabilityRequestDecision = {
  readonly requestId: string;
  readonly capabilityId: string;
  readonly decision: CapabilityRequestDecisionStatus;
  readonly reason: string;
};
