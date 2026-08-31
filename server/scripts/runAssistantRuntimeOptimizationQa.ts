import { LUMI_IDENTITY } from "../src/data/lumiIdentity.js";
import { getAssistantIdentity } from "../src/services/assistantIdentity.js";
import { composeAssistantInstruction } from "../src/services/assistantInstructionComposer.js";
import { MAX_COMPACT_ASSISTANT_RUNTIME_INSTRUCTION_CHARACTERS, composeCompactAssistantRuntimeInstruction } from "../src/services/assistantRuntimeInstructionComposer.js";
import { mapAiProviderRequestToLocalAiProviderRequest } from "../src/services/localAiProviderMapper.js";
import { MAX_QWEN_LOCAL_PROMPT_CHARACTERS, buildQwenLocalPrompt } from "../src/services/qwenLocalPromptBuilder.js";
import { mockAiProvider } from "../src/providers/mockAiProvider.js";
import { LUMI_BEHAVIOR_POLICY } from "../src/data/lumiBehaviorPolicy.js";
import { composeAssistantBehaviorInstruction } from "../src/services/assistantBehaviorPolicyComposer.js";
import type { AiProviderRequest } from "../src/types/aiProvider.js";
import type { KnowledgeContext } from "../src/types/knowledge.js";

const knownContext: Readonly<KnowledgeContext> = Object.freeze({
  query: "synthetic compact context", source: "local-static", mode: "sandbox", matchCount: 1,
  entries: Object.freeze([Object.freeze({ id: "compact-source", domain: "orbi" as const, title: "Compact Context", content: "Synthetic approved ORBI content remains available.", score: 1 })]),
  totalCharacters: 49, truncated: false,
});
const emptyContext: Readonly<KnowledgeContext> = Object.freeze({ ...knownContext, matchCount: 0, entries: Object.freeze([]), totalCharacters: 0 });
const canonical = composeAssistantInstruction(getAssistantIdentity());
const compact = composeCompactAssistantRuntimeInstruction(canonical);
const behaviorInstruction = composeAssistantBehaviorInstruction(LUMI_BEHAVIOR_POLICY);
const request = (knowledgeContext: Readonly<KnowledgeContext>): Readonly<AiProviderRequest> => Object.freeze({
  requestId: "compact-runtime-request", conversationId: "compact-runtime-conversation", message: "How can I continue with this synthetic ORBI flow?", knowledgeContext,
  assistantInstruction: canonical, assistantRuntimeInstruction: compact, assistantBehaviorInstruction: behaviorInstruction,
});

const main = async (): Promise<void> => {
  const repeatedCanonical = composeAssistantInstruction(getAssistantIdentity());
  const repeatedCompact = composeCompactAssistantRuntimeInstruction(repeatedCanonical);
  const mapped = mapAiProviderRequestToLocalAiProviderRequest(request(knownContext), "synthetic-runtime", "synthetic-model");
  const prompt = buildQwenLocalPrompt(mapped);
  const knownResponse = await mockAiProvider.generate(request(knownContext));
  const unknownResponse = await mockAiProvider.generate(request(emptyContext));
  const required = ["LUMI", "ORBI Intelligent Companion", "ORBI Ecosystem", "Refer to yourself as LUMI", "move forward", "clear, natural, professional", "Keep responses concise", "Do not claim to be human", "admit uncertainty", "do not invent ORBI facts", "Use supplied ORBI context", "explicitly say you do not have supplied ORBI context", "useful next steps"];
  const forbidden = ["qwen", "ollama", "openai", "gemini", "gemma", "model"];
  const passed = getAssistantIdentity() === LUMI_IDENTITY
    && canonical.text === repeatedCanonical.text && canonical.characterCount === 849
    && compact.assistantId === canonical.assistantId && compact.assistantName === canonical.assistantName
    && compact.sourceVersion === canonical.version && compact.profile === "compact"
    && compact.text.length <= MAX_COMPACT_ASSISTANT_RUNTIME_INSTRUCTION_CHARACTERS
    && required.every((value) => compact.text.includes(value))
    && forbidden.every((value) => !compact.text.toLowerCase().includes(value))
    && compact.text === repeatedCompact.text && Object.isFrozen(compact)
    && mapped.assistantRuntimeInstruction === compact
    && prompt.includes(compact.text) && !prompt.includes(canonical.text)
    && prompt.includes("Compact Context") && prompt.includes("synthetic ORBI flow")
    && prompt.length <= MAX_QWEN_LOCAL_PROMPT_CHARACTERS
    && knownResponse.grounded && knownResponse.sourceEntryIds.join(",") === "compact-source"
    && !unknownResponse.grounded && unknownResponse.sourceEntryIds.length === 0;
  if (!passed) { console.error("Assistant Runtime Optimization QA: FAIL"); process.exit(1); }
  console.info("Assistant Runtime Optimization QA: PASS (compact provider-neutral instruction; unchanged grounding)");
};

void main();
