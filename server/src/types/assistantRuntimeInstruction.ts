import type { AssistantInstruction } from "./assistantInstruction.js";

/** Bounded execution projection of the canonical assistant instruction. */
export type AssistantRuntimeInstruction = {
  readonly assistantId: string;
  readonly assistantName: string;
  readonly text: string;
  readonly sourceVersion: AssistantInstruction["version"];
  readonly profile: "compact";
};
