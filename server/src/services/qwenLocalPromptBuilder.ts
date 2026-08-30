import type { LocalAiProviderRequest } from "../types/localAiProvider.js";

export const MAX_QWEN_LOCAL_PROMPT_CHARACTERS = 6_000;

const bound = (value: string): string => value.length <= MAX_QWEN_LOCAL_PROMPT_CHARACTERS
  ? value
  : `${value.slice(0, MAX_QWEN_LOCAL_PROMPT_CHARACTERS - 3)}...`;

/** Deterministic, neutral prompt with only the already-bounded local knowledge context. */
export const buildQwenLocalPrompt = (request: Readonly<LocalAiProviderRequest>): string => {
  const context = request.knowledgeContext.entries.length === 0
    ? "No approved ORBI context was found."
    : request.knowledgeContext.entries
      .map((entry) => `[${entry.id}] ${entry.title}\n${entry.content}`)
      .join("\n\n");
  return bound([
    "Answer using the provided ORBI context. If context is insufficient, say so. Do not invent facts.",
    "CONTEXT:",
    context,
    "USER:",
    request.message,
  ].join("\n\n"));
};
