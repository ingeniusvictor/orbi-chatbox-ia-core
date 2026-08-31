import {
  ACTIVE_AI_PROVIDER,
  ENABLED_AI_PROVIDERS,
  getAiProviderDeployment,
  isAiProviderEnabled,
  isAiProviderSupported,
  SUPPORTED_AI_PROVIDERS,
} from "../src/config/aiProvider.js";
import {
  REGISTERED_AI_PROVIDER_MODES,
  resolveAiProvider,
} from "../src/providers/aiProviderRegistry.js";
import { MAX_KNOWLEDGE_RESPONSE_CHARACTERS, NO_KNOWLEDGE_RESPONSE_TEXT } from "../src/services/knowledgeResponseComposer.js";
import { LUMI_IDENTITY } from "../src/data/lumiIdentity.js";
import { composeAssistantInstruction } from "../src/services/assistantInstructionComposer.js";
import type { AiProviderRequest } from "../src/types/aiProvider.js";
import type { KnowledgeContext } from "../src/types/knowledge.js";

const knownContext: Readonly<KnowledgeContext> = Object.freeze({
  query: "sandbox assistant",
  source: "local-static",
  mode: "sandbox",
  matchCount: 1,
  entries: Object.freeze([
    Object.freeze({
      id: "orbi-sandbox-assistant",
      domain: "orbi" as const,
      title: "ORBI Sandbox Assistant",
      content: "Synthetic sandbox knowledge for controlled local assistant testing.",
      score: 1,
    }),
  ]),
  totalCharacters: 78,
  truncated: false,
});

const request: Readonly<AiProviderRequest> = Object.freeze({
  requestId: "synthetic-request-id",
  conversationId: "synthetic-conversation-id",
  message: "sandbox assistant",
  knowledgeContext: knownContext,
  assistantInstruction: composeAssistantInstruction(LUMI_IDENTITY),
});
const noMatchContext: Readonly<KnowledgeContext> = Object.freeze({
  ...knownContext,
  query: "unmatched synthetic query",
  matchCount: 0,
  entries: Object.freeze([]),
  totalCharacters: 0,
});
const longContext: Readonly<KnowledgeContext> = Object.freeze({
  ...knownContext,
  entries: Object.freeze([
    Object.freeze({
      id: "long-sandbox-entry",
      domain: "system" as const,
      title: "Long Sandbox Entry",
      content: "x".repeat(MAX_KNOWLEDGE_RESPONSE_CHARACTERS + 20),
      score: 1,
    }),
  ]),
});

const main = async (): Promise<void> => {
  const provider = resolveAiProvider(ACTIVE_AI_PROVIDER);
  let invalidProviderRejected = false;
  const rejectsRuntimeProvider = (providerId: string): boolean => {
    try {
      resolveAiProvider(providerId as never);
      return false;
    } catch (error) {
      return error instanceof Error && error.message === "Unsupported AI provider mode.";
    }
  };
  try {
    resolveAiProvider("invalid-provider" as never);
  } catch (error) {
    invalidProviderRejected = error instanceof Error && error.message === "Unsupported AI provider mode.";
  }
  const knownResponse = await provider.generate(request);
  const repeatedResponse = await provider.generate(request);
  const noMatchResponse = await provider.generate(Object.freeze({
    ...request,
    knowledgeContext: noMatchContext,
  }));
  const longResponse = await provider.generate(Object.freeze({
    ...request,
    knowledgeContext: longContext,
  }));

  const passed = ACTIVE_AI_PROVIDER === "mock"
    && SUPPORTED_AI_PROVIDERS.join(",") === "mock,qwen-local,gemma-local,openai,gemini"
    && ENABLED_AI_PROVIDERS.length === 2
    && ENABLED_AI_PROVIDERS[0] === "mock"
    && ENABLED_AI_PROVIDERS[1] === "qwen-local"
    && Object.isFrozen(SUPPORTED_AI_PROVIDERS)
    && Object.isFrozen(ENABLED_AI_PROVIDERS)
    && isAiProviderSupported("mock")
    && isAiProviderEnabled("mock")
    && getAiProviderDeployment("mock") === "development"
    && isAiProviderSupported("qwen-local")
    && isAiProviderEnabled("qwen-local")
    && getAiProviderDeployment("qwen-local") === "local"
    && isAiProviderSupported("gemma-local")
    && !isAiProviderEnabled("gemma-local")
    && getAiProviderDeployment("gemma-local") === "local"
    && isAiProviderSupported("openai")
    && !isAiProviderEnabled("openai")
    && getAiProviderDeployment("openai") === "cloud"
    && isAiProviderSupported("gemini")
    && !isAiProviderEnabled("gemini")
    && getAiProviderDeployment("gemini") === "cloud"
    && REGISTERED_AI_PROVIDER_MODES.length === 2
    && REGISTERED_AI_PROVIDER_MODES[0] === "mock"
    && REGISTERED_AI_PROVIDER_MODES[1] === "qwen-local"
    && Object.isFrozen(REGISTERED_AI_PROVIDER_MODES)
    && provider.mode === "mock"
    && invalidProviderRejected
    && rejectsRuntimeProvider("gemma-local")
    && rejectsRuntimeProvider("openai")
    && rejectsRuntimeProvider("gemini")
    && request.requestId.length > 0
    && request.conversationId.length > 0
    && Object.isFrozen(request.knowledgeContext)
    && knownResponse.provider === "mock"
    && knownResponse.grounded === true
    && knownResponse.sourceEntryIds.length === 1
    && knownResponse.sourceEntryIds[0] === "orbi-sandbox-assistant"
    && knownResponse.text === "ORBI Sandbox Assistant: Synthetic sandbox knowledge for controlled local assistant testing."
    && knownResponse.text === repeatedResponse.text
    && knownResponse.sourceEntryIds.join(",") === repeatedResponse.sourceEntryIds.join(",")
    && Object.isFrozen(knownResponse)
    && Object.isFrozen(knownResponse.sourceEntryIds)
    && noMatchResponse.grounded === false
    && noMatchResponse.sourceEntryIds.length === 0
    && noMatchResponse.text === NO_KNOWLEDGE_RESPONSE_TEXT
    && longResponse.text.length === MAX_KNOWLEDGE_RESPONSE_CHARACTERS
    && longResponse.text.endsWith("...");

  if (!passed) {
    console.error("AI Provider Contract QA: FAIL");
    process.exit(1);
  }

  console.info("AI Provider Contract QA: PASS (mock active; qwen-local enabled; remaining providers disabled-future)");
};

void main();
