import { readFile } from "node:fs/promises";
import { LUMI_BEHAVIOR_POLICY } from "../src/data/lumiBehaviorPolicy.js";
import { composeAssistantBehaviorInstruction, MAX_ASSISTANT_BEHAVIOR_INSTRUCTION_CHARACTERS } from "../src/services/assistantBehaviorPolicyComposer.js";
import { composeAssistantInstruction } from "../src/services/assistantInstructionComposer.js";
import { getAssistantIdentity } from "../src/services/assistantIdentity.js";
import { composeCompactAssistantRuntimeInstruction } from "../src/services/assistantRuntimeInstructionComposer.js";
import { mapAiProviderRequestToLocalAiProviderRequest } from "../src/services/localAiProviderMapper.js";
import { buildQwenLocalPrompt } from "../src/services/qwenLocalPromptBuilder.js";
import { mockAiProvider } from "../src/providers/mockAiProvider.js";
import type { AiProviderRequest } from "../src/types/aiProvider.js";
import type { KnowledgeContext } from "../src/types/knowledge.js";

const knownContext: Readonly<KnowledgeContext> = Object.freeze({
  query: "synthetic behavior context", source: "local-static", mode: "sandbox", matchCount: 1,
  entries: Object.freeze([Object.freeze({ id: "behavior-source", domain: "orbi" as const, title: "Behavior Context", content: "Synthetic approved ORBI behavior context.", score: 1 })]),
  totalCharacters: 42, truncated: false,
});
const emptyContext: Readonly<KnowledgeContext> = Object.freeze({ ...knownContext, matchCount: 0, entries: Object.freeze([]), totalCharacters: 0 });
const canonical = composeAssistantInstruction(getAssistantIdentity());
const runtime = composeCompactAssistantRuntimeInstruction(canonical);
const behavior = composeAssistantBehaviorInstruction(LUMI_BEHAVIOR_POLICY, canonical.assistantId);
const request = (knowledgeContext: Readonly<KnowledgeContext>): Readonly<AiProviderRequest> => Object.freeze({
  requestId: "behavior-request", conversationId: "behavior-conversation", message: "Explain this synthetic behavior context.", knowledgeContext,
  assistantInstruction: canonical, assistantRuntimeInstruction: runtime, assistantBehaviorInstruction: behavior,
});

const main = async (): Promise<void> => {
  const repeated = composeAssistantBehaviorInstruction(LUMI_BEHAVIOR_POLICY, canonical.assistantId);
  const mapped = mapAiProviderRequestToLocalAiProviderRequest(request(knownContext), "synthetic-runtime", "synthetic-model");
  const prompt = buildQwenLocalPrompt(mapped);
  const [known, unknown, promptSource] = await Promise.all([
    mockAiProvider.generate(request(knownContext)), mockAiProvider.generate(request(emptyContext)),
    readFile(new URL("../src/services/qwenLocalPromptBuilder.ts", import.meta.url), "utf8"),
  ]);
  const policySource = Object.values(LUMI_BEHAVIOR_POLICY).join(" ").toLowerCase();
  const requiredPolicy = ["user's language", "spanish", "only when directly asked", "never claim to be human", "concise", "detailed when useful", "insufficient", "do not invent orbi-specific facts", "supplied orbi knowledge", "next steps only when material", "generic offers", "natural, professional, approachable"];
  const requiredInstruction = ["Use user's language", "Spanish", "LUMI only when asked", "never claim human feelings", "concise", "detail when useful", "if insufficient, say so in user's language", "Do not invent facts, examples, URLs, configs", "next steps only", "Natural, professional, approachable"];
  const forbidden = ["qwen", "ollama", "openai", "gemini", "gemma", "model"];
  const passed = Object.isFrozen(LUMI_BEHAVIOR_POLICY)
    && requiredPolicy.every((value) => policySource.includes(value))
    && behavior.assistantId === "lumi" && behavior.policyVersion === "1" && behavior.profile === "compact"
    && behavior.text.length <= MAX_ASSISTANT_BEHAVIOR_INSTRUCTION_CHARACTERS
    && requiredInstruction.every((value) => behavior.text.includes(value))
    && forbidden.every((value) => !behavior.text.toLowerCase().includes(value))
    && behavior.text === repeated.text && Object.isFrozen(behavior)
    && mapped.assistantBehaviorInstruction === behavior
    && prompt.includes("BEHAVIOR") && prompt.includes(behavior.text)
    && !promptSource.match(/LUMI_BEHAVIOR_POLICY|assistantBehaviorPolicyComposer|lumiBehaviorPolicy/)
    && known.grounded && known.sourceEntryIds.join(",") === "behavior-source"
    && !unknown.grounded && unknown.sourceEntryIds.length === 0;
  if (!passed) { console.error("Assistant Behavior Policy QA: FAIL"); process.exit(1); }
  console.info("Assistant Behavior Policy QA: PASS (compact provider-neutral policy; unchanged grounding)");
};

void main();
