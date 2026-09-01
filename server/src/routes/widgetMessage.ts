import { Router } from "express";
import { resolveAiProvider } from "../providers/aiProviderRegistry.js";
import { QwenLocalProviderError } from "../providers/qwenLocalProvider.js";
import { createSandboxError } from "../security/errorResponses.js";
import { buildConversationEnvelope } from "../services/conversationEnvelope.js";
import { getAssistantIdentity } from "../services/assistantIdentity.js";
import { composeAssistantInstruction } from "../services/assistantInstructionComposer.js";
import { composeCompactAssistantRuntimeInstruction } from "../services/assistantRuntimeInstructionComposer.js";
import { composeAssistantBehaviorInstruction } from "../services/assistantBehaviorPolicyComposer.js";
import { LUMI_BEHAVIOR_POLICY } from "../data/lumiBehaviorPolicy.js";
import { buildKnowledgeContext } from "../services/knowledgeContextBuilder.js";
import { buildAssistantConversationHistory } from "../services/assistantConversationHistoryBuilder.js";
import { appendConversationTurn, getConversationHistory } from "../services/ephemeralConversationHistory.js";
import { createConversationTurn } from "../services/conversationTurn.js";
import { processValidatedWidgetMessage } from "../services/widgetMessageProcessor.js";
import { createControlledKnowledgeSearchRequest } from "../services/capabilityInvocationPolicy.js";
import { executeInternalCapability } from "../services/internalCapabilityExecutor.js";
import { buildAssistantCapabilityContext } from "../services/assistantCapabilityContextBuilder.js";
import type { AiProvider, AiProviderMode, AiProviderRequest } from "../types/aiProvider.js";
import type { WidgetMessageResponse } from "../types/widget.js";
import { validateWidgetMessagePayload } from "../validation/widgetPayload.js";

const SANDBOX_GUARDRAILS = [
  "Sandbox local",
  "Sin WhatsApp real",
  "Sin datos reales",
  "Sin base de datos",
  "Sin IA externa",
];

export const createWidgetMessageRouter = (
  demoWidgetPublicKey: string,
  activeProviderMode: AiProviderMode,
  providerOverride?: AiProvider,
): Router => {
  const router = Router();

  router.post("/api/public/widget/:publicKey/message", async (request, response, next) => {
    try {
      if (request.params.publicKey !== demoWidgetPublicKey) {
        const error = createSandboxError(403, "INVALID_PUBLIC_KEY", "Invalid demo widget public key.");
        response.status(error.statusCode).json(error.body);
        return;
      }

      const validation = validateWidgetMessagePayload(request.body);
      if (validation.ok === false) {
        const error = createSandboxError(
          validation.statusCode,
          validation.errorCode,
          validation.message,
        );
        response.status(error.statusCode).json(error.body);
        return;
      }

      const processed = processValidatedWidgetMessage(validation.payload);
      const knowledgeContext = buildKnowledgeContext(processed.normalizedMessage);
      const envelope = buildConversationEnvelope(validation.payload, processed, knowledgeContext);
      const previousHistory = getConversationHistory(envelope.conversationId);
      const assistantInstruction = composeAssistantInstruction(getAssistantIdentity());
      const assistantRuntimeInstruction = composeCompactAssistantRuntimeInstruction(assistantInstruction);
      const assistantBehaviorInstruction = composeAssistantBehaviorInstruction(LUMI_BEHAVIOR_POLICY, assistantInstruction.assistantId);
      const capabilityRequest = createControlledKnowledgeSearchRequest(envelope.message.text);
      const assistantCapabilityContext = capabilityRequest
        ? buildAssistantCapabilityContext(executeInternalCapability(capabilityRequest))
        : undefined;
      const providerRequest: Readonly<AiProviderRequest> = Object.freeze({
        requestId: envelope.requestId,
        conversationId: envelope.conversationId,
        message: envelope.message.text,
        conversationHistory: buildAssistantConversationHistory(previousHistory),
        knowledgeContext: envelope.knowledgeContext,
        assistantInstruction,
        assistantRuntimeInstruction,
        assistantBehaviorInstruction,
        assistantCapabilityContext,
      });
      const provider = providerOverride ?? resolveAiProvider(activeProviderMode);
      const providerResponse = await provider.generate(providerRequest);
      const userTurn = createConversationTurn({ conversationId: envelope.conversationId, role: "user", content: envelope.message.text, sequence: previousHistory.turnCount === 0 ? 1 : previousHistory.turns[previousHistory.turnCount - 1]!.sequence + 1 });
      const assistantTurn = createConversationTurn({ conversationId: envelope.conversationId, role: "assistant", content: providerResponse.text, sequence: userTurn.sequence + 1 });
      appendConversationTurn(userTurn);
      appendConversationTurn(assistantTurn);
      const payload: WidgetMessageResponse = {
        ok: true,
        mode: "sandbox",
        received: true,
        leadCreated: false,
        handoffRecommended: false,
        message: providerResponse.text,
        responseMode: providerResponse.provider === "mock" ? "provider-mock" : "provider-qwen-local",
        provider: providerResponse.provider,
        grounded: providerResponse.grounded,
        sourceEntryIds: providerResponse.sourceEntryIds,
        guardrails: SANDBOX_GUARDRAILS,
        processedAt: envelope.runtime.receivedAt,
        normalizedChannel: envelope.source.channel,
        requestId: envelope.requestId,
        conversationId: envelope.conversationId,
        normalizedMessage: envelope.message.text,
        messageLength: envelope.message.length,
        processingMode: envelope.runtime.mode,
        intent: envelope.runtime.intent,
        knowledge: {
          source: envelope.knowledgeContext.source,
          matchCount: envelope.knowledgeContext.matchCount,
          entryIds: envelope.knowledgeContext.entries.map((entry) => entry.id),
          truncated: envelope.knowledgeContext.truncated,
        },
      };

      response.json(payload);
    } catch (error) {
      if (error instanceof QwenLocalProviderError) {
        const providerError = createSandboxError(
          error.code === "LOCAL_AI_INVALID_RESPONSE" ? 502 : 503,
          error.code,
          "Configured local AI provider is unavailable.",
        );
        response.status(providerError.statusCode).json(providerError.body);
        return;
      }
      next(error);
    }
  });

  return router;
};
