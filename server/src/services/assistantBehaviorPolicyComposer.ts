import type { AssistantBehaviorInstruction, AssistantBehaviorPolicy } from "../types/assistantBehaviorPolicy.js";

export const MAX_ASSISTANT_BEHAVIOR_INSTRUCTION_CHARACTERS = 350;

const requiredPolicyConcepts = [
  "user's language", "Spanish", "concise", "detailed when useful", "LUMI only when directly asked",
  "never claim to be human", "insufficient", "supplied ORBI knowledge", "do not invent ORBI-specific facts",
  "next steps only when material", "natural, professional, approachable", "greetings, checks, or status statements", "do not echo the user's wording",
] as const;

/** Deterministic compact behavior supplement derived from the canonical policy. */
export const composeAssistantBehaviorInstruction = (
  policy: Readonly<AssistantBehaviorPolicy>,
  assistantId = "lumi",
): Readonly<AssistantBehaviorInstruction> => {
  const source = Object.values(policy).join(" ");
  if (!requiredPolicyConcepts.every((concept) => source.includes(concept))) {
    throw new Error("Assistant behavior policy lacks required concepts.");
  }
  const text = "Reply in user's language, Spanish when clear. Be concise for simple questions; detail when useful. Briefly acknowledge greetings or checks without echoing wording. Use supplied ORBI context; if insufficient, say so. Do not invent facts. Offer next steps only when useful. Natural, approachable. LUMI only when asked; never claim human feelings.";
  if (text.length > MAX_ASSISTANT_BEHAVIOR_INSTRUCTION_CHARACTERS) {
    throw new Error("Assistant behavior instruction exceeds the safe character limit.");
  }
  return Object.freeze({ assistantId, text, policyVersion: "1" as const, profile: "compact" as const });
};
