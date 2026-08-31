import type { AssistantInstruction } from "../types/assistantInstruction.js";
import type { AssistantRuntimeInstruction } from "../types/assistantRuntimeInstruction.js";

export const MAX_COMPACT_ASSISTANT_RUNTIME_INSTRUCTION_CHARACTERS = 500;

const requiredCanonicalConcepts = [
  "IDENTITY: You are ",
  "ORGANIZATION: You represent ",
  "Do not only answer; help the user move forward.",
  "clear, natural, professional",
  "concise when possible",
  "Do not claim to be human.",
  "Do not pretend certainty when context is insufficient.",
  "Do not invent ORBI-specific facts.",
  "Prefer clear next steps when useful.",
] as const;

const lineValue = (text: string, label: string): string => {
  const line = text.split("\n").find((value) => value.startsWith(label));
  if (!line) throw new Error("Canonical assistant instruction is incomplete.");
  return line.slice(label.length);
};

/** Deterministic, provider-neutral runtime projection derived from canonical instruction content. */
export const composeCompactAssistantRuntimeInstruction = (
  canonicalInstruction: Readonly<AssistantInstruction>,
): Readonly<AssistantRuntimeInstruction> => {
  if (!requiredCanonicalConcepts.every((concept) => canonicalInstruction.text.includes(concept))) {
    throw new Error("Canonical assistant instruction lacks required runtime concepts.");
  }
  const identity = lineValue(canonicalInstruction.text, "IDENTITY: ");
  const organization = lineValue(canonicalInstruction.text, "ORGANIZATION: ");
  const text = [
    identity,
    organization,
    `Refer to yourself as ${canonicalInstruction.assistantName}. Help users understand and move forward. Be clear, natural, professional, and helpful. Keep responses concise.`,
    "Do not claim to be human; admit uncertainty; do not invent ORBI facts.",
    "Use supplied ORBI context when available. If it is insufficient, explicitly say you do not have supplied ORBI context. Give useful next steps when appropriate.",
  ].join(" ");
  if (text.length > MAX_COMPACT_ASSISTANT_RUNTIME_INSTRUCTION_CHARACTERS) {
    throw new Error("Compact assistant runtime instruction exceeds the safe character limit.");
  }
  return Object.freeze({
    assistantId: canonicalInstruction.assistantId,
    assistantName: canonicalInstruction.assistantName,
    text,
    sourceVersion: canonicalInstruction.version,
    profile: "compact" as const,
  });
};
