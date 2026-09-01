import type { AssistantCapabilityContext } from "../types/assistantCapabilityContext.js";
import type { CapabilityExecutionResult } from "../types/capabilityExecution.js";

export const MAX_ASSISTANT_CAPABILITY_CONTEXT_CHARACTERS = 1_200;

const bound = (value: string): string => value.length <= MAX_ASSISTANT_CAPABILITY_CONTEXT_CHARACTERS
  ? value
  : `${value.slice(0, MAX_ASSISTANT_CAPABILITY_CONTEXT_CHARACTERS - 3)}...`;

/** Converts only successful, bounded knowledge-search output into a compact provider-facing summary. */
export const buildAssistantCapabilityContext = (execution: Readonly<CapabilityExecutionResult>): Readonly<AssistantCapabilityContext> | undefined => {
  if (execution.status !== "success" || execution.capabilityId !== "knowledge-search" || !execution.output) return undefined;
  const resultIds = Object.freeze(execution.output.results.map((entry) => entry.entryId));
  const lines = execution.output.results.map((entry) => `- ${entry.title} [${entry.entryId}]: ${entry.summary}`);
  const text = bound(`Explicit capability result: knowledge-search\n${lines.length > 0 ? lines.join("\n") : "- No controlled matches found."}`);
  return Object.freeze({ capabilityId: "knowledge-search", status: "success", text, resultIds });
};
