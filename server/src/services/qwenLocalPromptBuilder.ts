import type { LocalAiProviderRequest } from "../types/localAiProvider.js";

export const MAX_QWEN_LOCAL_PROMPT_CHARACTERS = 6_000;
export const MAX_QWEN_LOCAL_KNOWLEDGE_CONTEXT_CHARACTERS = 2_000;

const bound = (value: string, limit: number): string => value.length <= limit
  ? value
  : `${value.slice(0, Math.max(0, limit - 3))}...`;

/** Deterministic prompt consuming only the provider-neutral instruction supplied by ORBI Core. */
export const buildQwenLocalPrompt = (request: Readonly<LocalAiProviderRequest>): string => {
  const context = request.knowledgeContext.entries.length === 0
    ? "No approved ORBI context was found."
    : request.knowledgeContext.entries
      .map((entry) => `[${entry.id}] ${entry.title}\n${entry.content}`)
      .join("\n\n");
  const assistantSection = `[ASSISTANT INSTRUCTION]\n${request.assistantInstruction.text}`;
  const contextSection = `[ORBI KNOWLEDGE CONTEXT]\n${bound(context, MAX_QWEN_LOCAL_KNOWLEDGE_CONTEXT_CHARACTERS)}`;
  const userPrefix = "[USER MESSAGE]\n";
  const userBudget = MAX_QWEN_LOCAL_PROMPT_CHARACTERS - assistantSection.length - contextSection.length - userPrefix.length - 4;
  const userSection = `${userPrefix}${bound(request.message, Math.max(0, userBudget))}`;
  return [assistantSection, contextSection, userSection].join("\n\n");
};
