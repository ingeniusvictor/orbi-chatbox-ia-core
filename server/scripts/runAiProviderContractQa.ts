import { mockAiProvider } from "../src/providers/mockAiProvider.js";
import { MAX_KNOWLEDGE_RESPONSE_CHARACTERS, NO_KNOWLEDGE_RESPONSE_TEXT } from "../src/services/knowledgeResponseComposer.js";
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
  const knownResponse = await mockAiProvider.generate(request);
  const repeatedResponse = await mockAiProvider.generate(request);
  const noMatchResponse = await mockAiProvider.generate(Object.freeze({
    ...request,
    knowledgeContext: noMatchContext,
  }));
  const longResponse = await mockAiProvider.generate(Object.freeze({
    ...request,
    knowledgeContext: longContext,
  }));

  const passed = mockAiProvider.mode === "mock"
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

  console.info("AI Provider Contract QA: PASS (local deterministic mock only)");
};

void main();
