import { buildConversationEnvelope } from "./conversationEnvelope.js";
import { getAssistantIdentity } from "./assistantIdentity.js";
import { composeAssistantInstruction } from "./assistantInstructionComposer.js";
import { composeCompactAssistantRuntimeInstruction } from "./assistantRuntimeInstructionComposer.js";
import { composeAssistantBehaviorInstruction } from "./assistantBehaviorPolicyComposer.js";
import { LUMI_BEHAVIOR_POLICY } from "../data/lumiBehaviorPolicy.js";
import { buildKnowledgeContext } from "./knowledgeContextBuilder.js";
import { buildAssistantConversationHistory } from "./assistantConversationHistoryBuilder.js";
import { appendConversationTurn, getConversationHistory } from "./ephemeralConversationHistory.js";
import { createConversationTurn } from "./conversationTurn.js";
import { processValidatedWidgetMessage } from "./widgetMessageProcessor.js";
import { createControlledKnowledgeSearchRequest } from "./capabilityInvocationPolicy.js";
import { executeInternalCapability } from "./internalCapabilityExecutor.js";
import { buildAssistantCapabilityContext } from "./assistantCapabilityContextBuilder.js";
import { resolveAiProvider } from "../providers/aiProviderRegistry.js";
import type { AiProvider, AiProviderMode, AiProviderRequest } from "../types/aiProvider.js";
import type { NormalizedWidgetMessageRequest, WidgetMessageResponse } from "../types/widget.js";
import type { ConversationMemoryStore } from "../memory/conversationMemory.js";
import { selectConversationContext } from "../memory/conversationMemory.js";

const SANDBOX_GUARDRAILS = ["Sandbox local", "Sin WhatsApp real", "Sin datos reales", "Sin base de datos", "Sin IA externa"];

/** Existing ORBI Core path, extracted from the HTTP route so every adapter reuses it once. */
export const processCoreWidgetMessage = async (
  input: NormalizedWidgetMessageRequest,
  activeProviderMode: AiProviderMode,
  providerOverride?: AiProvider,
  memoryStore?: ConversationMemoryStore,
): Promise<WidgetMessageResponse> => {
  const processed = processValidatedWidgetMessage(input);
  const knowledgeContext = buildKnowledgeContext(processed.normalizedMessage);
  const envelope = buildConversationEnvelope(input, processed, knowledgeContext);
  const previousHistory = getConversationHistory(envelope.conversationId);
  const assistantInstruction = composeAssistantInstruction(getAssistantIdentity());
  const assistantRuntimeInstruction = composeCompactAssistantRuntimeInstruction(assistantInstruction);
  const assistantBehaviorInstruction = composeAssistantBehaviorInstruction(LUMI_BEHAVIOR_POLICY, assistantInstruction.assistantId);
  const capabilityRequest = createControlledKnowledgeSearchRequest(envelope.message.text);
  const assistantCapabilityContext = capabilityRequest ? buildAssistantCapabilityContext(executeInternalCapability(capabilityRequest)) : undefined;
  const durableRecord = memoryStore ? await memoryStore.getConversation(envelope.conversationId) : undefined;
  const durableContext = selectConversationContext(durableRecord, 3, 2_500).flatMap((turn) => [Object.freeze({ role: "user" as const, content: turn.userText }), Object.freeze({ role: "assistant" as const, content: turn.assistantText })]);
  const conversationHistory = durableContext.length > 0 ? Object.freeze({ turns: Object.freeze(durableContext) }) : buildAssistantConversationHistory(previousHistory);
  const providerRequest: Readonly<AiProviderRequest> = Object.freeze({ requestId: envelope.requestId, conversationId: envelope.conversationId, message: envelope.message.text, conversationHistory, knowledgeContext: envelope.knowledgeContext, assistantInstruction, assistantRuntimeInstruction, assistantBehaviorInstruction, assistantCapabilityContext });
  const provider = providerOverride ?? resolveAiProvider(activeProviderMode);
  const providerResponse = await provider.generate(providerRequest);
  const userTurn = createConversationTurn({ conversationId: envelope.conversationId, role: "user", content: envelope.message.text, sequence: previousHistory.turnCount === 0 ? 1 : previousHistory.turns[previousHistory.turnCount - 1]!.sequence + 1 });
  const assistantTurn = createConversationTurn({ conversationId: envelope.conversationId, role: "assistant", content: providerResponse.text, sequence: userTurn.sequence + 1 });
  appendConversationTurn(userTurn); appendConversationTurn(assistantTurn);
  if (memoryStore) await memoryStore.appendTurn(envelope.conversationId, Object.freeze({ turnId: envelope.requestId, userText: envelope.message.text, assistantText: providerResponse.text, createdAt: envelope.runtime.receivedAt }));
  return { ok: true, mode: "sandbox", received: true, leadCreated: false, handoffRecommended: false, message: providerResponse.text, responseMode: providerResponse.provider === "mock" ? "provider-mock" : "provider-qwen-local", provider: providerResponse.provider, grounded: providerResponse.grounded, sourceEntryIds: providerResponse.sourceEntryIds, guardrails: SANDBOX_GUARDRAILS, processedAt: envelope.runtime.receivedAt, normalizedChannel: envelope.source.channel, requestId: envelope.requestId, conversationId: envelope.conversationId, normalizedMessage: envelope.message.text, messageLength: envelope.message.length, processingMode: envelope.runtime.mode, intent: envelope.runtime.intent, knowledge: { source: envelope.knowledgeContext.source, matchCount: envelope.knowledgeContext.matchCount, entryIds: envelope.knowledgeContext.entries.map((entry) => entry.id), truncated: envelope.knowledgeContext.truncated } };
};
