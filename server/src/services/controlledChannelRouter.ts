import type { AiProvider, AiProviderMode } from "../types/aiProvider.js";
import type { ChannelId } from "../types/channelMessage.js";
import { ChannelMessageValidationError } from "../types/channelMessage.js";
import { ConversationCorrelationError } from "../types/conversationCorrelation.js";
import { processInboundChannelMessage } from "./channelMessageBridge.js";
import { CommercialRuntimeDispositionError, HumanHandoffActiveError } from "./channelMessageBridge.js";
import { ChannelAdapterRegistry, createChannelAdapterRegistry } from "./channelAdapterRegistry.js";
import { ChannelConversationCorrelator } from "./channelConversationCorrelator.js";
import { ChannelDeliveryService, createOutboundDeliveryRequest } from "./channelDeliveryService.js";
import { webReferenceDeliveryAdapter } from "../adapters/webReferenceDeliveryAdapter.js";
import type { ChannelDeliveryAdapter } from "../types/channelDeliveryAdapter.js";
import type { OutboundDeliveryResult } from "../types/outboundDelivery.js";
import type { ConversationMemoryStore } from "../memory/conversationMemory.js";

export type ControlledChannelRouteInput = Readonly<{ channel: string; rawInput: unknown; activeProviderMode: AiProviderMode; providerOverride?: AiProvider; orbiConversationId?: string }>;
export type ControlledInboundOnlyRouteInput = ControlledChannelRouteInput;
export type ControlledChannelRouteResult<Formatted = unknown> =
  | Readonly<{ ok: true; channel: ChannelId; adapterChannel: ChannelId; outbound: import("../types/channelMessage.js").OutboundChannelResponse; output: Formatted; delivery: Readonly<OutboundDeliveryResult> }>
  | Readonly<{ ok: false; channel?: string; errorCode: "CHANNEL_UNKNOWN" | "CHANNEL_NOT_IMPLEMENTED" | "CHANNEL_DISABLED" | "CHANNEL_ADAPTER_UNAVAILABLE" | "CHANNEL_NORMALIZATION_FAILED" | "CHANNEL_CORRELATION_FAILED" | "CHANNEL_FORMAT_FAILED" | "CHANNEL_DELIVERY_FAILED" | "CHANNEL_CORE_FAILED" | "HUMAN_HANDOFF_ACTIVE" | "CHANNEL_RUNTIME_DENIED" | "CHANNEL_RUNTIME_ERROR"; disposition?: import("../types/runtimeFailureSemantics.js").RuntimeDisposition }>;
export type ControlledInboundOnlyRouteResult =
  | Readonly<{ ok: true; channel: ChannelId; adapterChannel: ChannelId; outbound: import("../types/channelMessage.js").OutboundChannelResponse }>
  | Extract<ControlledChannelRouteResult, { ok: false }>;
export type ControlledInboundDeliveryRouteResult =
  | Readonly<{ ok: true; channel: ChannelId; adapterChannel: ChannelId; outbound: import("../types/channelMessage.js").OutboundChannelResponse; delivery: Readonly<OutboundDeliveryResult> }>
  | Extract<ControlledChannelRouteResult, { ok: false }>;

/** Provider raw input is normalized by the selected adapter before it reaches ORBI Core. */
export class ControlledChannelRouter {
  constructor(
    private readonly registry: ChannelAdapterRegistry = createChannelAdapterRegistry(),
    private readonly correlator = new ChannelConversationCorrelator(),
    private readonly deliveryAdapter: ChannelDeliveryAdapter = webReferenceDeliveryAdapter,
    private readonly deliveryService = new ChannelDeliveryService(),
    private readonly memoryStore?: ConversationMemoryStore,
  ) {}

  async route(input: Readonly<ControlledChannelRouteInput>): Promise<ControlledChannelRouteResult> {
    const resolution = this.registry.resolve(input.channel);
    if (resolution.ok === false) return Object.freeze({ ok: false, channel: resolution.channel, errorCode: resolution.errorCode });
    try {
      const normalized = resolution.adapter.normalizeInbound(input.rawInput);
      const inbound = normalized.channel === resolution.channel ? normalized : Object.freeze({ ...normalized, channel: resolution.channel });
      const outbound = await processInboundChannelMessage(inbound, { activeProviderMode: input.activeProviderMode, providerOverride: input.providerOverride, orbiConversationId: input.orbiConversationId, correlator: this.correlator, memoryStore: this.memoryStore });
      let output: unknown;
      try {
        // A reused transport formats its own representation while routing retains the requested channel.
        output = resolution.adapter.formatOutbound(outbound.channel === resolution.adapterChannel ? outbound : Object.freeze({ ...outbound, channel: resolution.adapterChannel }));
      } catch { return Object.freeze({ ok: false, channel: resolution.channel, errorCode: "CHANNEL_FORMAT_FAILED" }); }
      try {
        const delivery = await this.deliveryService.deliver(createOutboundDeliveryRequest(outbound), this.deliveryAdapter);
        if (delivery.status !== "delivered") return Object.freeze({ ok: false, channel: resolution.channel, errorCode: "CHANNEL_DELIVERY_FAILED" });
        return Object.freeze({ ok: true, channel: resolution.channel, adapterChannel: resolution.adapterChannel, outbound, output, delivery });
      } catch { return Object.freeze({ ok: false, channel: resolution.channel, errorCode: "CHANNEL_DELIVERY_FAILED" }); }
    } catch (error) {
      if (error instanceof HumanHandoffActiveError) return Object.freeze({ ok: false, channel: resolution.channel, errorCode: "HUMAN_HANDOFF_ACTIVE", disposition: error.disposition });
      if (error instanceof CommercialRuntimeDispositionError) return Object.freeze({ ok: false, channel: resolution.channel, errorCode: error.disposition.category === "CONTROLLED_DENIAL" ? "CHANNEL_RUNTIME_DENIED" : "CHANNEL_RUNTIME_ERROR", disposition: error.disposition });
      if (error instanceof ChannelMessageValidationError) return Object.freeze({ ok: false, channel: resolution.channel, errorCode: "CHANNEL_NORMALIZATION_FAILED" });
      if (error instanceof ConversationCorrelationError) return Object.freeze({ ok: false, channel: resolution.channel, errorCode: "CHANNEL_CORRELATION_FAILED" });
      return Object.freeze({ ok: false, channel: resolution.channel, errorCode: "CHANNEL_CORE_FAILED" });
    }
  }

  /**
   * Controlled development ingress for an adapter with no outbound delivery
   * implementation. It intentionally stops before formatting and delivery.
   */
  async routeInboundOnly(input: Readonly<ControlledInboundOnlyRouteInput>): Promise<ControlledInboundOnlyRouteResult> {
    const resolution = this.registry.resolve(input.channel, { allowInboundFoundation: true });
    if (resolution.ok === false) return Object.freeze({ ok: false, channel: resolution.channel, errorCode: resolution.errorCode });
    try {
      const normalized = resolution.adapter.normalizeInbound(input.rawInput);
      const inbound = normalized.channel === resolution.channel ? normalized : Object.freeze({ ...normalized, channel: resolution.channel });
      const outbound = await processInboundChannelMessage(inbound, { activeProviderMode: input.activeProviderMode, providerOverride: input.providerOverride, orbiConversationId: input.orbiConversationId, correlator: this.correlator, memoryStore: this.memoryStore });
      return Object.freeze({ ok: true, channel: resolution.channel, adapterChannel: resolution.adapterChannel, outbound });
    } catch (error) {
      if (error instanceof HumanHandoffActiveError) return Object.freeze({ ok: false, channel: resolution.channel, errorCode: "HUMAN_HANDOFF_ACTIVE", disposition: error.disposition });
      if (error instanceof CommercialRuntimeDispositionError) return Object.freeze({ ok: false, channel: resolution.channel, errorCode: error.disposition.category === "CONTROLLED_DENIAL" ? "CHANNEL_RUNTIME_DENIED" : "CHANNEL_RUNTIME_ERROR", disposition: error.disposition });
      if (error instanceof ChannelMessageValidationError) return Object.freeze({ ok: false, channel: resolution.channel, errorCode: "CHANNEL_NORMALIZATION_FAILED" });
      if (error instanceof ConversationCorrelationError) return Object.freeze({ ok: false, channel: resolution.channel, errorCode: "CHANNEL_CORRELATION_FAILED" });
      return Object.freeze({ ok: false, channel: resolution.channel, errorCode: "CHANNEL_CORE_FAILED" });
    }
  }

  /**
   * Channel-bound composition for an inbound foundation that has an explicit,
   * injected delivery adapter. It never falls back to the web adapter.
   */
  async routeInboundWithDelivery(input: Readonly<ControlledInboundOnlyRouteInput>, deliveryAdapter: ChannelDeliveryAdapter): Promise<ControlledInboundDeliveryRouteResult> {
    const resolution = this.registry.resolve(input.channel, { allowInboundFoundation: true });
    if (resolution.ok === false) return Object.freeze({ ok: false, channel: resolution.channel, errorCode: resolution.errorCode });
    try {
      const normalized = resolution.adapter.normalizeInbound(input.rawInput);
      const inbound = normalized.channel === resolution.channel ? normalized : Object.freeze({ ...normalized, channel: resolution.channel });
      const outbound = await processInboundChannelMessage(inbound, { activeProviderMode: input.activeProviderMode, providerOverride: input.providerOverride, orbiConversationId: input.orbiConversationId, correlator: this.correlator, memoryStore: this.memoryStore });
      const delivery = await this.deliveryService.deliver(createOutboundDeliveryRequest(outbound), deliveryAdapter);
      if (delivery.status !== "delivered") return Object.freeze({ ok: false, channel: resolution.channel, errorCode: "CHANNEL_DELIVERY_FAILED" });
      return Object.freeze({ ok: true, channel: resolution.channel, adapterChannel: resolution.adapterChannel, outbound, delivery });
    } catch (error) {
      if (error instanceof HumanHandoffActiveError) return Object.freeze({ ok: false, channel: resolution.channel, errorCode: "HUMAN_HANDOFF_ACTIVE", disposition: error.disposition });
      if (error instanceof CommercialRuntimeDispositionError) return Object.freeze({ ok: false, channel: resolution.channel, errorCode: error.disposition.category === "CONTROLLED_DENIAL" ? "CHANNEL_RUNTIME_DENIED" : "CHANNEL_RUNTIME_ERROR", disposition: error.disposition });
      if (error instanceof ChannelMessageValidationError) return Object.freeze({ ok: false, channel: resolution.channel, errorCode: "CHANNEL_NORMALIZATION_FAILED" });
      if (error instanceof ConversationCorrelationError) return Object.freeze({ ok: false, channel: resolution.channel, errorCode: "CHANNEL_CORRELATION_FAILED" });
      return Object.freeze({ ok: false, channel: resolution.channel, errorCode: "CHANNEL_CORE_FAILED" });
    }
  }
}
