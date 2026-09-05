import type { AiProvider, AiProviderMode } from "../types/aiProvider.js";
import type { ChannelId } from "../types/channelMessage.js";
import { ChannelMessageValidationError } from "../types/channelMessage.js";
import { ConversationCorrelationError } from "../types/conversationCorrelation.js";
import { processInboundChannelMessage } from "./channelMessageBridge.js";
import { ChannelAdapterRegistry, createChannelAdapterRegistry } from "./channelAdapterRegistry.js";
import { ChannelConversationCorrelator } from "./channelConversationCorrelator.js";

export type ControlledChannelRouteInput = Readonly<{ channel: string; rawInput: unknown; activeProviderMode: AiProviderMode; providerOverride?: AiProvider; orbiConversationId?: string }>;
export type ControlledChannelRouteResult<Formatted = unknown> =
  | Readonly<{ ok: true; channel: ChannelId; adapterChannel: ChannelId; outbound: import("../types/channelMessage.js").OutboundChannelResponse; output: Formatted }>
  | Readonly<{ ok: false; channel?: string; errorCode: "CHANNEL_UNKNOWN" | "CHANNEL_NOT_IMPLEMENTED" | "CHANNEL_DISABLED" | "CHANNEL_ADAPTER_UNAVAILABLE" | "CHANNEL_NORMALIZATION_FAILED" | "CHANNEL_CORRELATION_FAILED" | "CHANNEL_FORMAT_FAILED" | "CHANNEL_CORE_FAILED" }>;

/** Provider raw input is normalized by the selected adapter before it reaches ORBI Core. */
export class ControlledChannelRouter {
  constructor(
    private readonly registry: ChannelAdapterRegistry = createChannelAdapterRegistry(),
    private readonly correlator = new ChannelConversationCorrelator(),
  ) {}

  async route(input: Readonly<ControlledChannelRouteInput>): Promise<ControlledChannelRouteResult> {
    const resolution = this.registry.resolve(input.channel);
    if (resolution.ok === false) return Object.freeze({ ok: false, channel: resolution.channel, errorCode: resolution.errorCode });
    try {
      const normalized = resolution.adapter.normalizeInbound(input.rawInput);
      const inbound = normalized.channel === resolution.channel ? normalized : Object.freeze({ ...normalized, channel: resolution.channel });
      const outbound = await processInboundChannelMessage(inbound, { activeProviderMode: input.activeProviderMode, providerOverride: input.providerOverride, orbiConversationId: input.orbiConversationId, correlator: this.correlator });
      try {
        // A reused transport formats its own representation while routing retains the requested channel.
        const output = resolution.adapter.formatOutbound(outbound.channel === resolution.adapterChannel ? outbound : Object.freeze({ ...outbound, channel: resolution.adapterChannel }));
        return Object.freeze({ ok: true, channel: resolution.channel, adapterChannel: resolution.adapterChannel, outbound, output });
      } catch { return Object.freeze({ ok: false, channel: resolution.channel, errorCode: "CHANNEL_FORMAT_FAILED" }); }
    } catch (error) {
      if (error instanceof ChannelMessageValidationError) return Object.freeze({ ok: false, channel: resolution.channel, errorCode: "CHANNEL_NORMALIZATION_FAILED" });
      if (error instanceof ConversationCorrelationError) return Object.freeze({ ok: false, channel: resolution.channel, errorCode: "CHANNEL_CORRELATION_FAILED" });
      return Object.freeze({ ok: false, channel: resolution.channel, errorCode: "CHANNEL_CORE_FAILED" });
    }
  }
}
