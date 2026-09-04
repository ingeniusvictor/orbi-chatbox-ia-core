import { webChannelAdapter } from "../src/adapters/webChannelAdapter.js";
import { ChannelAdapterRegistry, createChannelAdapterRegistry } from "../src/services/channelAdapterRegistry.js";
import { CHANNEL_DESCRIPTORS } from "../src/types/channelMessage.js";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };

try {
  const registry = createChannelAdapterRegistry();
  const web = registry.resolve("web"); const widget = registry.resolve("widget");
  assert(web.ok && web.adapter === webChannelAdapter && web.adapterChannel === "web", "Web adapter must resolve deterministically.");
  assert(widget.ok && widget.adapter === webChannelAdapter && widget.adapterChannel === "web", "Widget must reuse the web adapter without duplicate implementation.");
  const whatsapp = registry.resolve("whatsapp"); const internal = registry.resolve("internal"); const unknown = registry.resolve("unknown");
  assert(whatsapp.ok === false && whatsapp.errorCode === "CHANNEL_NOT_IMPLEMENTED", "WhatsApp must stay planned and unavailable.");
  assert(internal.ok === false && internal.errorCode === "CHANNEL_DISABLED", "Internal channel must remain disabled.");
  assert(unknown.ok === false && unknown.errorCode === "CHANNEL_UNKNOWN", "Unknown channels must not fall back.");
  const descriptor = CHANNEL_DESCRIPTORS.find((item) => item.channel === "web")!;
  try { new ChannelAdapterRegistry([{ descriptor, adapter: webChannelAdapter }, { descriptor, adapter: webChannelAdapter }]); throw new Error("Duplicate registry entry was accepted."); } catch (error) { assert(error instanceof Error && error.message.includes("Duplicate"), "Duplicate registration must be rejected."); }
  console.info("Channel Adapter Registry QA: PASS");
} catch (error) { console.error(error); process.exit(1); }
