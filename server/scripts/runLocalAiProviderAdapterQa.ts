import {
  ACTIVE_AI_PROVIDER,
  ENABLED_AI_PROVIDERS,
  isAiProviderEnabled,
} from "../src/config/aiProvider.js";
import { LOCAL_AI_GENERATION_DISABLED, localAiProviderAdapter } from "../src/providers/localAiProviderAdapter.js";
import { LUMI_IDENTITY } from "../src/data/lumiIdentity.js";
import { composeAssistantInstruction } from "../src/services/assistantInstructionComposer.js";
import { REGISTERED_AI_PROVIDER_MODES } from "../src/providers/aiProviderRegistry.js";
import {
  mapAiProviderRequestToLocalAiProviderRequest,
  mapLocalAiProviderResponseToFutureResponse,
} from "../src/services/localAiProviderMapper.js";
import type { AiProviderRequest } from "../src/types/aiProvider.js";
import type { KnowledgeContext } from "../src/types/knowledge.js";
import type { LocalAiProviderResponse } from "../src/types/localAiProvider.js";

const context: Readonly<KnowledgeContext> = Object.freeze({
  query: "synthetic local provider request",
  source: "local-static",
  mode: "sandbox",
  matchCount: 1,
  entries: Object.freeze([Object.freeze({
    id: "synthetic-source-id", domain: "system" as const, title: "Synthetic source",
    content: "Bounded synthetic local knowledge.", score: 1,
  })]),
  totalCharacters: 34,
  truncated: false,
});
const request: Readonly<AiProviderRequest> = Object.freeze({
  requestId: "synthetic-request", conversationId: "synthetic-conversation",
  message: "synthetic normalized message", knowledgeContext: context,
  assistantInstruction: composeAssistantInstruction(LUMI_IDENTITY),
});
const response: Readonly<LocalAiProviderResponse> = Object.freeze({
  text: "future local response shape", model: "synthetic-local-model", grounded: true,
  sourceEntryIds: Object.freeze(["synthetic-source-id"]),
});

const main = async (): Promise<void> => {
  const mapped = mapAiProviderRequestToLocalAiProviderRequest(request, "synthetic-runtime", "synthetic-local-model");
  const repeated = mapAiProviderRequestToLocalAiProviderRequest(request, "synthetic-runtime", "synthetic-local-model");
  const projected = mapLocalAiProviderResponseToFutureResponse(response);
  let disabledError = "";
  try { await localAiProviderAdapter.generate(mapped); } catch (error) { disabledError = error instanceof Error ? error.message : ""; }

  const passed = mapped.message === request.message
    && mapped.requestId === request.requestId
    && mapped.conversationId === request.conversationId
    && mapped.knowledgeContext.entries.length === 1
    && mapped.knowledgeContext.entries[0]?.id === "synthetic-source-id"
    && mapped.assistantInstruction === request.assistantInstruction
    && Object.isFrozen(mapped)
    && Object.isFrozen(mapped.knowledgeContext)
    && Object.isFrozen(mapped.knowledgeContext.entries)
    && Object.isFrozen(mapped.knowledgeContext.entries[0])
    && mapped.message === repeated.message
    && mapped.knowledgeContext.entries[0]?.id === repeated.knowledgeContext.entries[0]?.id
    && projected.text === response.text
    && projected.model === response.model
    && projected.grounded === response.grounded
    && projected.sourceEntryIds.join(",") === "synthetic-source-id"
    && Object.isFrozen(projected)
    && Object.isFrozen(projected.sourceEntryIds)
    && disabledError === LOCAL_AI_GENERATION_DISABLED
    && ACTIVE_AI_PROVIDER === "mock"
    && ENABLED_AI_PROVIDERS.length === 2
    && ENABLED_AI_PROVIDERS[0] === "mock"
    && ENABLED_AI_PROVIDERS[1] === "qwen-local"
    && REGISTERED_AI_PROVIDER_MODES.length === 2
    && REGISTERED_AI_PROVIDER_MODES[0] === "mock"
    && REGISTERED_AI_PROVIDER_MODES[1] === "qwen-local"
    && isAiProviderEnabled("qwen-local")
    && !isAiProviderEnabled("gemma-local");

  if (!passed) { console.error("Local AI Provider Adapter QA: FAIL"); process.exit(1); }
  console.info("Local AI Provider Adapter QA: PASS (mapping and disabled placeholder only; no generation or network)");
};

void main();
