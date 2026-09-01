import { readFileSync } from "node:fs";
import { mockAiProvider } from "../src/providers/mockAiProvider.js";
import { LUMI_IDENTITY } from "../src/data/lumiIdentity.js";
import { composeAssistantBehaviorInstruction } from "../src/services/assistantBehaviorPolicyComposer.js";
import { composeAssistantInstruction } from "../src/services/assistantInstructionComposer.js";
import { composeCompactAssistantRuntimeInstruction } from "../src/services/assistantRuntimeInstructionComposer.js";
import { LUMI_BEHAVIOR_POLICY } from "../src/data/lumiBehaviorPolicy.js";
import { buildAssistantCapabilityContext, MAX_ASSISTANT_CAPABILITY_CONTEXT_CHARACTERS } from "../src/services/assistantCapabilityContextBuilder.js";
import { shouldInvokeKnowledgeSearch } from "../src/services/capabilityInvocationPolicy.js";
import { getCapabilities } from "../src/services/capabilityRegistry.js";
import { createCapabilityRequest, evaluateCapabilityEligibility, evaluateCapabilityRequest } from "../src/services/capabilityRequest.js";
import { getConversationHistory } from "../src/services/ephemeralConversationHistory.js";
import { executeInternalCapability, MAX_CAPABILITY_KNOWLEDGE_QUERY_CHARACTERS, MAX_CAPABILITY_KNOWLEDGE_RESULTS } from "../src/services/internalCapabilityExecutor.js";
import { MAX_QWEN_LOCAL_PROMPT_CHARACTERS, buildQwenLocalPrompt } from "../src/services/qwenLocalPromptBuilder.js";
import { mapAiProviderRequestToLocalAiProviderRequest } from "../src/services/localAiProviderMapper.js";
import type { CapabilityDefinition } from "../src/types/capability.js";
import type { KnowledgeContext } from "../src/types/knowledge.js";

const assert = (condition: unknown, message: string): void => { if (!condition) throw new Error(message); };
const emptyKnowledgeContext = (): Readonly<KnowledgeContext> => Object.freeze({ query: "", source: "local-static", mode: "sandbox", matchCount: 0, entries: Object.freeze([]), totalCharacters: 0, truncated: false });

const main = async (): Promise<void> => {
  const registryBefore = JSON.stringify(getCapabilities());
  const knowledgeRequest = createCapabilityRequest({ capabilityId: "knowledge-search", reason: "Validate final controlled knowledge boundary.", input: { query: "Academy" } });
  const knowledgeExecution = executeInternalCapability(knowledgeRequest);
  const repeatedExecution = executeInternalCapability(knowledgeRequest);
  const capabilityContext = buildAssistantCapabilityContext(knowledgeExecution);
  const conversationBefore = getConversationHistory("capability-boundary-final");
  const conversation = executeInternalCapability(createCapabilityRequest({ capabilityId: "conversation-context", reason: "Validate closed execution path." }));
  const system = executeInternalCapability(createCapabilityRequest({ capabilityId: "system-status", reason: "Validate unavailable execution path." }));
  const external = executeInternalCapability(createCapabilityRequest({ capabilityId: "external-action", reason: "Validate blocked execution path." }));
  const unknown = executeInternalCapability(createCapabilityRequest({ capabilityId: "unknown-capability", reason: "Validate unknown execution path." }));
  const invalidInput = executeInternalCapability(Object.freeze({ id: "final-invalid-query", capabilityId: "knowledge-search", reason: "Validate input boundary.", input: Object.freeze({ query: "q".repeat(MAX_CAPABILITY_KNOWLEDGE_QUERY_CHARACTERS + 1) }), status: "requested" }));
  const unsafe = Object.freeze({ id: "final-unsafe", name: "Final Unsafe", description: "Synthetic final QA descriptor.", category: "action", status: "enabled", risk: "restricted", executionMode: "external", version: "1" }) as Readonly<CapabilityDefinition>;
  const writeUnsafe = Object.freeze({ ...unsafe, id: "final-write", risk: "controlled-write", executionMode: "internal" }) as Readonly<CapabilityDefinition>;
  const localRequest = Object.freeze({ requestId: "final-provider-request", conversationId: "capability-boundary-final", message: "Hola", knowledgeContext: emptyKnowledgeContext(), assistantInstruction: composeAssistantInstruction(LUMI_IDENTITY), assistantRuntimeInstruction: composeCompactAssistantRuntimeInstruction(composeAssistantInstruction(LUMI_IDENTITY)), assistantBehaviorInstruction: composeAssistantBehaviorInstruction(LUMI_BEHAVIOR_POLICY), assistantCapabilityContext: capabilityContext });
  const mockResponse = await mockAiProvider.generate(localRequest);
  const qwenPrompt = buildQwenLocalPrompt(mapAiProviderRequestToLocalAiProviderRequest(localRequest, "synthetic", "synthetic"));
  const qwenBuilderSource = readFileSync(new URL("../src/services/qwenLocalPromptBuilder.ts", import.meta.url), "utf8");
  const qwenProviderSource = readFileSync(new URL("../src/providers/qwenLocalProvider.ts", import.meta.url), "utf8");
  const passed = knowledgeExecution.status === "success" && knowledgeExecution.output !== null
    && evaluateCapabilityRequest(knowledgeRequest).decision === "allowed"
    && knowledgeExecution.output.results.length <= MAX_CAPABILITY_KNOWLEDGE_RESULTS
    && capabilityContext?.text.length !== undefined && capabilityContext.text.length <= MAX_ASSISTANT_CAPABILITY_CONTEXT_CHARACTERS
    && JSON.stringify(knowledgeExecution) === JSON.stringify(repeatedExecution)
    && conversation.status === "blocked" && system.status === "unavailable" && external.status === "blocked" && unknown.status === "blocked"
    && invalidInput.status === "failed" && invalidInput.errorCode === "CAPABILITY_INPUT_INVALID"
    && evaluateCapabilityEligibility(unsafe) === "blocked" && evaluateCapabilityEligibility(writeUnsafe) === "blocked"
    && shouldInvokeKnowledgeSearch("Busca información en ORBI sobre Academy.") && shouldInvokeKnowledgeSearch("Consulta el conocimiento ORBI sobre Services.")
    && !shouldInvokeKnowledgeSearch("Hola") && !shouldInvokeKnowledgeSearch("¿Quién eres?") && !shouldInvokeKnowledgeSearch("¿Cómo me llamo?") && !shouldInvokeKnowledgeSearch("Gracias") && !shouldInvokeKnowledgeSearch("Busca restaurantes cerca de mí.") && !shouldInvokeKnowledgeSearch("Consulta el clima.")
    && mockResponse.grounded === false && mockResponse.sourceEntryIds.length === 0
    && qwenPrompt.includes("CAPABILITY") && qwenPrompt.length <= MAX_QWEN_LOCAL_PROMPT_CHARACTERS
    && !/capabilityRegistry|capabilityRequest|internalCapabilityExecutor|capabilityInvocationPolicy/.test(qwenBuilderSource)
    && !/capabilityRegistry|capabilityRequest|internalCapabilityExecutor|capabilityInvocationPolicy|tool_call|function_call/.test(qwenProviderSource)
    && getConversationHistory("capability-boundary-final").turnCount === conversationBefore.turnCount
    && registryBefore === JSON.stringify(getCapabilities());
  assert(passed, "Capability Boundary Final QA: FAIL");
  console.info("Capability Boundary Final QA: PASS (knowledge-search is the sole Core-controlled executable capability; provider has bounded context only)");
};

void main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : "Capability Boundary Final QA failed."); process.exit(1); });
