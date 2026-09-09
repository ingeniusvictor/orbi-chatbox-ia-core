import type { AiProvider, AiProviderMode } from "../types/aiProvider.js";
import type { NormalizedWidgetMessageRequest } from "../types/widget.js";
import { processCoreWidgetMessage } from "./coreWidgetMessageProcessor.js";
import { ChannelConversationCorrelator } from "./channelConversationCorrelator.js";
import { validateInboundChannelMessage, validateOutboundChannelResponse, type InboundChannelMessage, type OutboundChannelResponse } from "../types/channelMessage.js";
import { defaultHumanHandoffService, type HumanHandoffService } from "../handoff/humanHandoffService.js";
import type { ConversationMemoryStore } from "../memory/conversationMemory.js";
import { ORBI_DEFAULT_PROFILE } from "../config/clientProfile.js";
import { DEFAULT_COMMERCIAL_RUNTIME_POLICY } from "./commercialRuntimeHardening.js";
import { CommercialRuntimeExecution } from "./commercialRuntimeExecution.js";
import { createRuntimeDisposition } from "./runtimeFailureSemantics.js";
import { createInternalConversationRef } from "./internalConversationIdentity.js";
import type { RuntimeDisposition } from "../types/runtimeFailureSemantics.js";

export class CommercialRuntimeDispositionError extends Error { constructor(readonly disposition: RuntimeDisposition){super(disposition.safeMessage);this.name="CommercialRuntimeDispositionError";} }
export class HumanHandoffActiveError extends CommercialRuntimeDispositionError { constructor(){super(createRuntimeDisposition("HANDOFF_ACTIVE"));this.name="HumanHandoffActiveError";} }

export type ChannelBridgeOptions = Readonly<{ activeProviderMode: AiProviderMode; providerOverride?: AiProvider; orbiConversationId?: string; correlator?: ChannelConversationCorrelator; handoffService?: HumanHandoffService; memoryStore?: ConversationMemoryStore; commercialRuntime?: CommercialRuntimeExecution }>;

const defaultCommercialRuntime = new CommercialRuntimeExecution({ activeClient: ORBI_DEFAULT_PROFILE, policy: DEFAULT_COMMERCIAL_RUNTIME_POLICY, handoff: defaultHumanHandoffService });

/**
 * Maps one already-normalized message into the existing local Core. External
 * channel IDs remain adapter metadata: they are not authentication, users or
 * ORBI conversation identities. Future adapters own any mapping outside Core.
 */
export const processInboundChannelMessage = async (
  inbound: Readonly<InboundChannelMessage>,
  options: Readonly<ChannelBridgeOptions>,
): Promise<Readonly<OutboundChannelResponse>> => {
  const message = validateInboundChannelMessage(inbound);
  const correlation = (options.correlator ?? new ChannelConversationCorrelator()).correlate(message, options.orbiConversationId);
  const internalRef = correlation.internalRef ?? createInternalConversationRef();
  const internalConversationId = internalRef.conversationId;
  const runtime = options.commercialRuntime ?? (options.handoffService
    ? new CommercialRuntimeExecution({ activeClient: ORBI_DEFAULT_PROFILE, policy: DEFAULT_COMMERCIAL_RUNTIME_POLICY, handoff: options.handoffService })
    : defaultCommercialRuntime);
  const legacyInput: NormalizedWidgetMessageRequest = {
    // The current Core ingress is the local sandbox receiver, not the source channel.
    channel: "web_demo",
    // External user IDs are correlation metadata, never Core visitor/user identity.
    visitorId: "channel-adapter-local",
    conversationId: internalConversationId,
    message: message.text,
    pageUrl: message.metadata?.pageUrl ?? "channel-adapter-local",
    consentAccepted: true,
    timestamp: message.receivedAt,
  };
  const execution = await runtime.execute({ channel: message.channel, internalConversationId, text: message.text }, () =>
    processCoreWidgetMessage(legacyInput, options.activeProviderMode, options.providerOverride, options.memoryStore),
  );
  if (execution.ok === false) {
    if (execution.disposition.reasonCode === "HANDOFF_ACTIVE") throw new HumanHandoffActiveError();
    throw new CommercialRuntimeDispositionError(execution.disposition);
  }
  const coreResponse = execution.value;
  return validateOutboundChannelResponse({ channel: message.channel, conversationId: coreResponse.conversationId, responseType: "text", text: coreResponse.message, createdAt: coreResponse.processedAt, metadata: { grounded: coreResponse.grounded, sourceEntryIds: coreResponse.sourceEntryIds, provider: coreResponse.provider, requestId: coreResponse.requestId, normalizedMessage: coreResponse.normalizedMessage, messageLength: coreResponse.messageLength, processingMode: coreResponse.processingMode, intent: coreResponse.intent, knowledge: { source: coreResponse.knowledge.source, matchCount: coreResponse.knowledge.matchCount, truncated: coreResponse.knowledge.truncated } } });
};
