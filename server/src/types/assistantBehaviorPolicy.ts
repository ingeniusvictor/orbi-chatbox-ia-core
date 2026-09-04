/** Provider-neutral LUMI response behavior, separate from identity and knowledge. */
export type AssistantBehaviorPolicy = {
  readonly languageBehavior: string;
  readonly verbosityBehavior: string;
  readonly acknowledgementBehavior: string;
  readonly identityBehavior: string;
  readonly uncertaintyBehavior: string;
  readonly groundingBehavior: string;
  readonly nextStepBehavior: string;
  readonly toneBehavior: string;
};

export type AssistantBehaviorInstruction = {
  readonly assistantId: string;
  readonly text: string;
  readonly policyVersion: "1";
  readonly profile: "compact";
};
