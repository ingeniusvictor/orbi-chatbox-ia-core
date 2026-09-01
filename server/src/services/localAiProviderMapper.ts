import type { AiProviderRequest } from "../types/aiProvider.js";
import type { KnowledgeContext } from "../types/knowledge.js";
import type {
  LocalAiProviderFutureResponse,
  LocalAiProviderRequest,
  LocalAiProviderResponse,
} from "../types/localAiProvider.js";

const freezeKnowledgeContext = (context: Readonly<KnowledgeContext>): Readonly<KnowledgeContext> => Object.freeze({
  ...context,
  entries: Object.freeze(context.entries.map((entry) => Object.freeze({ ...entry }))),
});
const freezeConversationHistory = (history: Readonly<AiProviderRequest>["conversationHistory"]) => Object.freeze({
  turns: Object.freeze((history?.turns ?? []).map((turn) => Object.freeze({ ...turn }))),
});
const freezeAssistantCapabilityContext = (context: Readonly<AiProviderRequest>["assistantCapabilityContext"]) => context
  ? Object.freeze({ ...context, resultIds: Object.freeze([...context.resultIds]) })
  : undefined;

/** Pure mapping boundary from the active provider pipeline to a future local provider. */
export const mapAiProviderRequestToLocalAiProviderRequest = (
  request: Readonly<AiProviderRequest>,
  runtimeId: string,
  model: string,
): Readonly<LocalAiProviderRequest> => Object.freeze({
  runtimeId,
  model,
  requestId: request.requestId,
  conversationId: request.conversationId,
  message: request.message,
  conversationHistory: freezeConversationHistory(request.conversationHistory),
  knowledgeContext: freezeKnowledgeContext(request.knowledgeContext),
  assistantInstruction: request.assistantInstruction,
  assistantRuntimeInstruction: request.assistantRuntimeInstruction,
  assistantBehaviorInstruction: request.assistantBehaviorInstruction,
  assistantCapabilityContext: freezeAssistantCapabilityContext(request.assistantCapabilityContext),
});

/**
 * This intentionally does not return AiProviderResponse: only mock is executable today.
 * It preserves a minimal, provider-neutral result for a future explicit activation module.
 */
export const mapLocalAiProviderResponseToFutureResponse = (
  response: Readonly<LocalAiProviderResponse>,
): Readonly<LocalAiProviderFutureResponse> => Object.freeze({
  text: response.text,
  model: response.model,
  grounded: response.grounded,
  sourceEntryIds: Object.freeze([...response.sourceEntryIds]),
});
