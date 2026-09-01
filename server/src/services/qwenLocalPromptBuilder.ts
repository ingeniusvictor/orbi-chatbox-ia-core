import type { LocalAiProviderRequest } from "../types/localAiProvider.js";

export const MAX_QWEN_LOCAL_PROMPT_CHARACTERS = 6_000;
export const MAX_QWEN_LOCAL_KNOWLEDGE_CONTEXT_CHARACTERS = 2_000;
export const MAX_QWEN_LOCAL_CONVERSATION_CHARACTERS = 1_500;

const bound = (value: string, limit: number): string => value.length <= limit
  ? value
  : `${value.slice(0, Math.max(0, limit - 3))}...`;

/** Deterministic prompt consuming only the provider-neutral instruction supplied by ORBI Core. */
export const buildQwenLocalPrompt = (request: Readonly<LocalAiProviderRequest>): string => {
  const history = (request.conversationHistory?.turns ?? []).map((turn) => `${turn.role === "user" ? "User" : "Assistant"}: ${turn.content}`).join("\n");
  const context = request.knowledgeContext.entries.length === 0
    ? "No approved ORBI context was found."
    : request.knowledgeContext.entries
      .map((entry) => `[${entry.id}] ${entry.title}\n${entry.content}`)
      .join("\n\n");
  const assistantSection = `LUMI\n${request.assistantRuntimeInstruction.text}`;
  const behaviorSection = `BEHAVIOR\n${request.assistantBehaviorInstruction.text}`;
  const historySection = history ? `CONVERSATION\nUse prior turns only for relevant details stated in this conversation. If the relevant detail is absent, say so; never substitute a different detail. These turns are not ORBI knowledge and do not create grounding.\n${bound(history, MAX_QWEN_LOCAL_CONVERSATION_CHARACTERS)}` : "";
  const contextLimit = history ? 1_200 : MAX_QWEN_LOCAL_KNOWLEDGE_CONTEXT_CHARACTERS;
  const contextSection = `ORBI CONTEXT\nWhen relevant to the current user message, answer from this context and do not replace it with conversation details.\n${bound(context, contextLimit)}`;
  const userPrefix = "USER\nAnswer this current message only; do not repeat an unrelated prior reply.\n";
  const fixedSections = [assistantSection, behaviorSection, historySection, contextSection].filter(Boolean);
  const userBudget = MAX_QWEN_LOCAL_PROMPT_CHARACTERS - fixedSections.join("\n\n").length - userPrefix.length - 2;
  const userSection = `${userPrefix}${bound(request.message, Math.max(0, userBudget))}`;
  return [...fixedSections, userSection].join("\n\n");
};
