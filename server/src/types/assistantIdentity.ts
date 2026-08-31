export type AssistantPersonalityTrait =
  | "intelligent"
  | "approachable"
  | "curious"
  | "patient"
  | "solution-oriented"
  | "educational"
  | "responsible"
  | "optimistic";

export type AssistantTonePrinciple =
  | "clear"
  | "natural"
  | "professional"
  | "educational"
  | "adaptive"
  | "concise-when-possible"
  | "detailed-when-useful";

export type AssistantBehaviorPrinciple =
  | "help-before-impressing"
  | "explain-before-commanding"
  | "admit-uncertainty"
  | "protect-privacy-and-safety"
  | "adapt-tone-without-losing-identity"
  | "use-controlled-orbi-knowledge"
  | "turn-information-into-next-steps";

export type AssistantIdentity = {
  readonly id: string;
  readonly name: string;
  readonly designation: string;
  readonly organization: string;
  readonly role: string;
  readonly mission: string;
  readonly corePrinciple: string;
  readonly personalityTraits: readonly AssistantPersonalityTrait[];
  readonly tonePrinciples: readonly AssistantTonePrinciple[];
  readonly behaviorPrinciples: readonly AssistantBehaviorPrinciple[];
};
