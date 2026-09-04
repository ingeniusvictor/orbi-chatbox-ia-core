import { readFile } from "node:fs/promises";
import { webChannelAdapter } from "../src/adapters/webChannelAdapter.js";
import { processInboundChannelMessage } from "../src/services/channelMessageBridge.js";
import type { AiProvider } from "../src/types/aiProvider.js";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };

const provider: AiProvider = Object.freeze({ mode: "mock", async generate(request) { assert(request.message === "Mensaje web de prueba", "Bridge must send normalized text to the existing Core."); return Object.freeze({ provider: "mock", text: "Respuesta LUMI", grounded: true, sourceEntryIds: ["orbi-sandbox-assistant"] }); } });

try {
  const inbound = webChannelAdapter.normalizeInbound({ text: "Mensaje web de prueba", externalConversationId: "external-conversation", externalUserId: "external-user", externalMessageId: "external-message", pageUrl: "http://localhost:3000" });
  const outbound = await processInboundChannelMessage(inbound, { activeProviderMode: "mock", providerOverride: provider, orbiConversationId: "orbi-session-only" });
  const formatted = webChannelAdapter.formatOutbound(outbound);
  assert(outbound.channel === "web" && formatted.text === "Respuesta LUMI", "Web reference adapter must round-trip the neutral contracts.");
  assert(formatted.conversationId === "orbi-session-only", "Only explicit ORBI conversation IDs may enter the Core bridge.");
  const [bridge, adapter, contracts] = await Promise.all([
    readFile(new URL("../src/services/channelMessageBridge.ts", import.meta.url), "utf8"),
    readFile(new URL("../src/adapters/webChannelAdapter.ts", import.meta.url), "utf8"),
    readFile(new URL("../src/types/channelMessage.ts", import.meta.url), "utf8"),
  ]);
  assert(bridge.includes("processCoreWidgetMessage") && !bridge.match(/whatsapp cloud|meta(?:\s|[-_]?api|cloud)|webhook|token|ogg|webm/i), "Bridge must reuse Core without provider or media leakage.");
  assert(!adapter.match(/meta(?:\s|[-_]?api|cloud)|webhook|token|fetch\(|https?:\/\//i), "Reference adapter must remain local and provider-free.");
  assert(!contracts.match(/Record<string,\s*(any|unknown)>|rawMedia|audioBytes/i), "Contracts must not become a provider payload or media dump.");
  console.info("Channel Adapter Boundary QA: PASS");
} catch (error) { console.error(error); process.exit(1); }
