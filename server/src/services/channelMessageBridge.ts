import type { AiProvider, AiProviderMode } from "../types/aiProvider.js";
import type { NormalizedWidgetMessageRequest } from "../types/widget.js";
import { processCoreWidgetMessage } from "./coreWidgetMessageProcessor.js";
import { ChannelConversationCorrelator } from "./channelConversationCorrelator.js";
import { validateInboundChannelMessage, validateOutboundChannelResponse, type InboundChannelMessage, type OutboundChannelResponse } from "../types/channelMessage.js";
import { defaultHumanHandoffService, type HumanHandoffService } from "../handoff/humanHandoffService.js";

export class HumanHandoffActiveError extends Error { constructor(){super("AI execution is suppressed by human handoff.");this.name="HumanHandoffActiveError";} }

export type ChannelBridgeOptions = Readonly<{ activeProviderMode: AiProviderMode; providerOverride?: AiProvider; orbiConversationId?: string; correlator?: ChannelConversationCorrelator; handoffService?: HumanHandoffService }>;

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
  if (!options.handoffService?.canExecuteAi(correlation.internalRef!.conversationId) && options.handoffService) throw new HumanHandoffActiveError();
  if (!options.handoffService && !defaultHumanHandoffService.canExecuteAi(correlation.internalRef!.conversationId)) throw new HumanHandoffActiveError();
  const legacyInput: NormalizedWidgetMessageRequest = {
    // The current Core ingress is the local sandbox receiver, not the source channel.
    channel: "web_demo",
    // External user IDs are correlation metadata, never Core visitor/user identity.
    visitorId: "channel-adapter-local",
    conversationId: correlation.internalRef?.conversationId,
    message: message.text,
    pageUrl: message.metadata?.pageUrl ?? "channel-adapter-local",
    consentAccepted: true,
    timestamp: message.receivedAt,
  };
  const coreResponse = await processCoreWidgetMessage(legacyInput, options.activeProviderMode, options.providerOverride);
  return validateOutboundChannelResponse({ channel: message.channel, conversationId: coreResponse.conversationId, responseType: "text", text: coreResponse.message, createdAt: coreResponse.processedAt, metadata: { grounded: coreResponse.grounded, sourceEntryIds: coreResponse.sourceEntryIds, provider: coreResponse.provider, requestId: coreResponse.requestId, normalizedMessage: coreResponse.normalizedMessage, messageLength: coreResponse.messageLength, processingMode: coreResponse.processingMode, intent: coreResponse.intent, knowledge: { source: coreResponse.knowledge.source, matchCount: coreResponse.knowledge.matchCount, truncated: coreResponse.knowledge.truncated } } });
};
