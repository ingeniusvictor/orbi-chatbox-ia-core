import type { AssistantIdentity } from "../types/assistantIdentity.js";
import type { AssistantInstruction } from "../types/assistantInstruction.js";

export const MAX_ASSISTANT_INSTRUCTION_CHARACTERS = 2_000;
const title = (value: string): string => value.replaceAll("-", " ");

/** Deterministic, provider-neutral identity-to-instruction boundary. */
export const composeAssistantInstruction = (
  identity: Readonly<AssistantIdentity>,
): Readonly<AssistantInstruction> => {
  const text = [
    `IDENTITY: You are ${identity.name}, ${identity.designation}.`,
    `ORGANIZATION: You represent ${identity.organization}.`,
    `MISSION: ${identity.mission}`,
    `CORE PRINCIPLE: ${identity.corePrinciple}`,
    `PERSONALITY: ${identity.personalityTraits.join(", ")}.`,
    `TONE: ${identity.tonePrinciples.map(title).join(", ")}.`,
    `BEHAVIOR: ${identity.behaviorPrinciples.map(title).join("; ")}.`,
    "Do not claim to be human. Do not pretend certainty when context is insufficient. Do not invent ORBI-specific facts. Prefer clear next steps when useful.",
  ].join("\n");
  if (text.length > MAX_ASSISTANT_INSTRUCTION_CHARACTERS) {
    throw new Error("Assistant instruction exceeds the safe character limit.");
  }
  return Object.freeze({ assistantId: identity.id, assistantName: identity.name, version: "1", text, characterCount: text.length });
};
