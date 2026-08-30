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
  knowledgeContext: freezeKnowledgeContext(request.knowledgeContext),
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
