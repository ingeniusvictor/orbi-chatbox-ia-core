import type { ChannelCapabilities, ChannelId, ChannelImplementationStatus, InboundChannelMessage, OutboundChannelResponse } from "./channelMessage.js";

/** An adapter owns provider translation. The Core receives only normalized contracts. */
export interface ChannelAdapter<RawInbound = unknown, RawOutbound = unknown> {
  readonly channel: ChannelId;
  readonly capabilities: ChannelCapabilities;
  readonly status: ChannelImplementationStatus;
  normalizeInbound(input: RawInbound): Readonly<InboundChannelMessage>;
  formatOutbound(response: Readonly<OutboundChannelResponse>): RawOutbound;
}
