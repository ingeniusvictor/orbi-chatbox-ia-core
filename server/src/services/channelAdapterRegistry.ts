import { webChannelAdapter } from "../adapters/webChannelAdapter.js";
import type { ChannelAdapter } from "../types/channelAdapter.js";
import { CHANNEL_DESCRIPTORS, type ChannelDescriptor, type ChannelId } from "../types/channelMessage.js";

export type ChannelRegistryEntry = Readonly<{ descriptor: ChannelDescriptor; adapter?: ChannelAdapter; reusesAdapterFrom?: ChannelId }>;
export type ChannelRegistryResolution =
  | Readonly<{ ok: true; channel: ChannelId; descriptor: ChannelDescriptor; adapter: ChannelAdapter; adapterChannel: ChannelId }>
  | Readonly<{ ok: false; channel?: string; errorCode: "CHANNEL_UNKNOWN" | "CHANNEL_NOT_IMPLEMENTED" | "CHANNEL_DISABLED" | "CHANNEL_ADAPTER_UNAVAILABLE" }>;

export class ChannelAdapterRegistry {
  private readonly entries = new Map<ChannelId, ChannelRegistryEntry>();

  constructor(entries: readonly ChannelRegistryEntry[]) {
    for (const entry of entries) {
      if (this.entries.has(entry.descriptor.channel)) throw new Error(`Duplicate channel descriptor: ${entry.descriptor.channel}`);
      if (entry.adapter && entry.adapter.channel !== entry.descriptor.channel && !entry.reusesAdapterFrom) throw new Error("Channel adapter must match its descriptor unless reuse is explicit.");
      this.entries.set(entry.descriptor.channel, Object.freeze({ ...entry }));
    }
  }

  describe(channel: string): Readonly<ChannelDescriptor> | undefined {
    return this.entries.get(channel as ChannelId)?.descriptor;
  }

  resolve(channel: string): ChannelRegistryResolution {
    const entry = this.entries.get(channel as ChannelId);
    if (!entry) return Object.freeze({ ok: false, channel, errorCode: "CHANNEL_UNKNOWN" });
    if (entry.descriptor.status === "planned") return Object.freeze({ ok: false, channel, errorCode: "CHANNEL_NOT_IMPLEMENTED" });
    if (entry.descriptor.status === "disabled" || entry.descriptor.availability === "disabled") return Object.freeze({ ok: false, channel, errorCode: "CHANNEL_DISABLED" });
    if (entry.descriptor.availability !== "available" || !entry.adapter) return Object.freeze({ ok: false, channel, errorCode: "CHANNEL_ADAPTER_UNAVAILABLE" });
    return Object.freeze({ ok: true, channel: entry.descriptor.channel, descriptor: entry.descriptor, adapter: entry.adapter, adapterChannel: entry.reusesAdapterFrom ?? entry.adapter.channel });
  }
}

const descriptor = (channel: ChannelId): ChannelDescriptor => {
  const value = CHANNEL_DESCRIPTORS.find((item) => item.channel === channel);
  if (!value) throw new Error(`Missing channel descriptor: ${channel}`);
  return value;
};

/** Static local composition. Adapters cannot be registered dynamically at runtime. */
export const createChannelAdapterRegistry = (): ChannelAdapterRegistry => new ChannelAdapterRegistry([
  { descriptor: descriptor("web"), adapter: webChannelAdapter },
  // Widget currently has the same local text representation as the web adapter.
  { descriptor: descriptor("widget"), adapter: webChannelAdapter, reusesAdapterFrom: "web" },
  { descriptor: descriptor("whatsapp") },
  { descriptor: descriptor("internal") },
]);
