import { readFileSync } from "node:fs";
import { validateClientProfile } from "../src/config/clientProfile.js";
import { defaultHumanHandoffService } from "../src/handoff/humanHandoffService.js";
import { CommercialRuntimeExecution } from "../src/services/commercialRuntimeExecution.js";
import { DEFAULT_COMMERCIAL_RUNTIME_POLICY } from "../src/services/commercialRuntimeHardening.js";
import { ChannelConversationCorrelator } from "../src/services/channelConversationCorrelator.js";
import { InMemoryConversationCorrelationStore } from "../src/services/inMemoryConversationCorrelationStore.js";
import { processInboundChannelMessage } from "../src/services/channelMessageBridge.js";
import type { AiProvider } from "../src/types/aiProvider.js";
import type { InboundChannelMessage } from "../src/types/channelMessage.js";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const inbound = (channel: InboundChannelMessage["channel"], externalConversationId: string): InboundChannelMessage => Object.freeze({ channel, externalConversationId, externalUserId: "external-user-001", messageType: "text", text: "Consulta sintética", receivedAt: "2026-09-04T00:00:00.000Z" });
const providerRequests: Array<{ conversationId: string; message: string }> = [];
const provider: AiProvider = Object.freeze({ mode: "mock", async generate(request) { providerRequests.push({ conversationId: request.conversationId, message: request.message }); return Object.freeze({ provider: "mock", text: "Respuesta sintética", grounded: false, sourceEntryIds: [] }); } });

try {
  const correlator = new ChannelConversationCorrelator(new InMemoryConversationCorrelationStore());

  const qaProfile = validateClientProfile({
    schemaVersion: 1,
    profileId: "channel-identity-qa",
    organization: { displayName: "ORBI QA" },
    assistant: { displayName: "LUMI", locale: "es-CL" },
    capabilities: { allowedTools: [] },
    channels: { enabled: ["web", "whatsapp"] },
    knowledge: { enabled: false },
  });

  const commercialRuntime = new CommercialRuntimeExecution({
    activeClient: qaProfile,
    policy: DEFAULT_COMMERCIAL_RUNTIME_POLICY,
    handoff: defaultHumanHandoffService,
  });
  const first = await processInboundChannelMessage(inbound("web", "visitor-001"), { activeProviderMode: "mock", providerOverride: provider, correlator, commercialRuntime });
  const repeated = await processInboundChannelMessage(inbound("web", "visitor-001"), { activeProviderMode: "mock", providerOverride: provider, correlator, commercialRuntime });
  const crossChannel = await processInboundChannelMessage(inbound("whatsapp", "visitor-001"), { activeProviderMode: "mock", providerOverride: provider, correlator, commercialRuntime });
  const bridgeSource = readFileSync(new URL("../src/services/channelMessageBridge.ts", import.meta.url), "utf8");
  const coreSources = ["coreWidgetMessageProcessor.ts", "conversationEnvelope.ts", "conversationTurn.ts"].map((name) => readFileSync(new URL(`../src/services/${name}`, import.meta.url), "utf8")).join("\n");
  const bannedProviderSpecificIds = /waId|phoneNumber|metaUserId|whatsappConversationId|telegramId|slackUserId/;
  assert(first.conversationId !== "visitor-001" && first.conversationId !== "external-user-001", "External identities must not become ORBI conversation IDs.");
  assert(repeated.conversationId === first.conversationId, "Bridge must preserve same-channel correlation continuity.");
  assert(crossChannel.conversationId !== first.conversationId, "Bridge must isolate cross-channel external ID collisions.");
  assert(providerRequests.every((request) => request.conversationId !== "visitor-001" && request.conversationId !== "external-user-001"), "Core/provider must receive only internal conversation IDs.");
  assert(bridgeSource.includes('visitorId: "channel-adapter-local"') && !coreSources.includes("externalConversationId") && !coreSources.includes("externalUserId"), "External IDs must remain outside Core identity processing.");
  assert(!bannedProviderSpecificIds.test(coreSources) && !/meta.*(?:token|api)|webhook|fetch\(/i.test(bridgeSource), "Core boundary must not acquire provider-specific IDs or external integration.");
  console.info("Channel Identity Boundary QA: PASS (external correlation data stays outside Core identity)");
} catch (error) { console.error(error); process.exit(1); }
