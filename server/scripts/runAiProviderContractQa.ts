import type {
  AiProviderRequest,
  AiProviderResponse,
} from "../src/types/aiProvider.js";
import type { KnowledgeContext } from "../src/types/knowledge.js";

const context: Readonly<KnowledgeContext> = Object.freeze({
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
  knowledgeContext: context,
});
const sourceEntryIds = Object.freeze(["orbi-sandbox-assistant"]);
const response: Readonly<AiProviderResponse> = Object.freeze({
  text: "Synthetic structural contract response.",
  provider: "mock",
  grounded: true,
  sourceEntryIds,
});

const passed = request.requestId.length > 0
  && request.conversationId.length > 0
  && request.message.length > 0
  && Object.isFrozen(request.knowledgeContext)
  && response.provider === "mock"
  && typeof response.grounded === "boolean"
  && Object.isFrozen(response.sourceEntryIds)
  && response.sourceEntryIds.length === 1;

if (!passed) {
  console.error("AI Provider Contract QA: FAIL");
  process.exit(1);
}

console.info("AI Provider Contract QA: PASS (structural only; no provider execution)");
