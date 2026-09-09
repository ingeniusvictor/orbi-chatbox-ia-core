import { ORBI_DEFAULT_PROFILE, validateClientProfile, type ClientProfile } from "../src/config/clientProfile.js";
import { HumanHandoffService } from "../src/handoff/humanHandoffService.js";
import type { ConversationMemoryStore, ConversationRecord, StoredConversationTurn } from "../src/memory/conversationMemory.js";
import { MessageBurstBuffer } from "../src/messaging/messageBurstBuffer.js";
import { processInboundChannelMessage, CommercialRuntimeDispositionError } from "../src/services/channelMessageBridge.js";
import { CommercialRuntimeExecution } from "../src/services/commercialRuntimeExecution.js";
import { validateCommercialRuntimePolicy, type CommercialRuntimePolicy } from "../src/services/commercialRuntimeHardening.js";
import { BoundedInMemoryTelemetrySink, type TelemetryEvent, type TelemetrySink } from "../src/services/runtimeTelemetry.js";
import { ToolExecutor, ToolRegistry } from "../src/tools/toolEngine.js";
import { ToolInteractionLoop, type ToolPlanner } from "../src/tools/toolInteractionLoop.js";
import type { AiProvider } from "../src/types/aiProvider.js";
import type { InboundChannelMessage } from "../src/types/channelMessage.js";
import type { RuntimeFailureReasonCode } from "../src/types/runtimeFailureSemantics.js";

const assert: (value: unknown, message: string) => asserts value = (value, message) => { if (!value) throw Error(message); };

class CountingMemory implements ConversationMemoryStore {
  readonly records = new Map<string, StoredConversationTurn[]>();
  appendCalls = 0;
  appendTurn(id: string, turn: StoredConversationTurn): void { this.appendCalls += 1; this.records.set(id, [...(this.records.get(id) ?? []), turn]); }
  getConversation(id: string): ConversationRecord | undefined { const turns = this.records.get(id); return turns ? Object.freeze({ conversationId: id, turns: Object.freeze([...turns]) }) : undefined; }
  deleteConversation(id: string): boolean { return this.records.delete(id); }
  hasConversation(id: string): boolean { return this.records.has(id); }
}

const policy = (patch: Partial<CommercialRuntimePolicy> = {}): CommercialRuntimePolicy => validateCommercialRuntimePolicy({
  maxInboundCharacters: 200,
  rateLimitEnabled: false,
  maxRequestsPerWindow: 20,
  rateLimitWindowMs: 60_000,
  maxConcurrentExecutionsPerConversation: 1,
  ...patch,
});

const runtime = (options: Readonly<{ profile?: ClientProfile; policy?: CommercialRuntimePolicy; handoff?: HumanHandoffService; telemetry?: TelemetrySink; now?: () => number }> = {}) => new CommercialRuntimeExecution({
  activeClient: options.profile ?? ORBI_DEFAULT_PROFILE,
  policy: options.policy ?? policy(),
  handoff: options.handoff ?? new HumanHandoffService(),
  telemetry: options.telemetry,
  now: options.now,
});

const inbound = (text: string): InboundChannelMessage => Object.freeze({ channel: "web", messageType: "text", text, receivedAt: new Date(0).toISOString() });

const expectDisposition = async (promise: Promise<unknown>, reasonCode: RuntimeFailureReasonCode): Promise<void> => {
  try { await promise; throw Error(`Expected ${reasonCode}.`); }
  catch (error) {
    assert(error instanceof CommercialRuntimeDispositionError, `${reasonCode} must use the controlled runtime error boundary.`);
    assert(error.disposition.reasonCode === reasonCode, `${reasonCode} must remain normalized.`);
    assert(error.disposition.category === (reasonCode === "PROVIDER_FAILURE" ? "RUNTIME_ERROR" : "CONTROLLED_DENIAL"), `${reasonCode} category is invalid.`);
  }
};

const provider = (generate: AiProvider["generate"]): AiProvider => Object.freeze({ mode: "mock", generate });

try {
  const disabledProfile = validateClientProfile({ ...ORBI_DEFAULT_PROFILE, channels: { enabled: ["voice"] } });
  let downstreamCalls = 0;
  const blockedProvider = provider(async () => { downstreamCalls += 1; return Object.freeze({ provider: "mock", text: "unexpected", grounded: false, sourceEntryIds: [] }); });

  for (const [id, text, composed] of [
    ["guard-channel", "mensaje privado", runtime({ profile: disabledProfile })],
    ["guard-input", "á🙂abc", runtime({ policy: policy({ maxInboundCharacters: 3 }) })],
  ] as const) {
    const memory = new CountingMemory();
    await expectDisposition(processInboundChannelMessage(inbound(text), { activeProviderMode: "mock", providerOverride: blockedProvider, orbiConversationId: id, memoryStore: memory, commercialRuntime: composed }), id === "guard-channel" ? "CHANNEL_DISABLED" : "INPUT_TOO_LARGE");
    assert(memory.appendCalls === 0, `${id} must not complete memory.`);
  }
  assert(downstreamCalls === 0, "Channel and input denials must not reach Core, tools, or business actions.");

  const handoff = new HumanHandoffService(); handoff.requestHandoff("guard-handoff");
  const handoffMemory = new CountingMemory();
  await expectDisposition(processInboundChannelMessage(inbound("hola"), { activeProviderMode: "mock", providerOverride: blockedProvider, orbiConversationId: "guard-handoff", memoryStore: handoffMemory, commercialRuntime: runtime({ handoff }) }), "HANDOFF_ACTIVE");
  assert(handoffMemory.appendCalls === 0, "Handoff denial must not complete memory.");
  assert(downstreamCalls === 0, "Handoff denial must not reach Core, tools, or business actions.");

  let clock = 0;
  const rateRuntime = runtime({ policy: policy({ rateLimitEnabled: true, maxRequestsPerWindow: 1, rateLimitWindowMs: 100 }), now: () => clock });
  const rateMemory = new CountingMemory();
  await processInboundChannelMessage(inbound("primero"), { activeProviderMode: "mock", providerOverride: blockedProvider, orbiConversationId: "guard-rate", memoryStore: rateMemory, commercialRuntime: rateRuntime });
  await expectDisposition(processInboundChannelMessage(inbound("segundo"), { activeProviderMode: "mock", providerOverride: blockedProvider, orbiConversationId: "guard-rate", memoryStore: rateMemory, commercialRuntime: rateRuntime }), "RATE_LIMITED");
  assert(rateMemory.appendCalls === 1, "Rate denial must not add a completed turn."); clock = 101;

  let release!: () => void;
  const waiting = new Promise<void>((resolve) => { release = resolve; });
  let concurrentCalls = 0;
  const concurrentProvider = provider(async (request) => { concurrentCalls += 1; if (request.conversationId === "guard-concurrent") await waiting; return Object.freeze({ provider: "mock", text: "ok", grounded: false, sourceEntryIds: [] }); });
  const sharedRuntime = runtime();
  const first = processInboundChannelMessage(inbound("uno"), { activeProviderMode: "mock", providerOverride: concurrentProvider, orbiConversationId: "guard-concurrent", commercialRuntime: sharedRuntime });
  await Promise.resolve();
  await expectDisposition(processInboundChannelMessage(inbound("dos"), { activeProviderMode: "mock", providerOverride: concurrentProvider, orbiConversationId: "guard-concurrent", commercialRuntime: sharedRuntime }), "CONCURRENCY_LIMITED");
  const independent = await processInboundChannelMessage(inbound("otro"), { activeProviderMode: "mock", providerOverride: concurrentProvider, orbiConversationId: "guard-independent", commercialRuntime: sharedRuntime });
  assert(independent.text === "ok", "Different conversations must execute independently."); release(); await first;
  assert(concurrentCalls === 2, "Rejected concurrent work must not execute downstream.");

  const normalMemory = new CountingMemory(); let normalCalls = 0;
  const normalProvider = provider(async () => { normalCalls += 1; return Object.freeze({ provider: "mock", text: "normal", grounded: false, sourceEntryIds: [] }); });
  await processInboundChannelMessage(inbound("normal"), { activeProviderMode: "mock", providerOverride: normalProvider, orbiConversationId: "guard-normal", memoryStore: normalMemory, commercialRuntime: runtime() });
  assert(normalCalls === 1 && normalMemory.appendCalls === 1, "Normal execution must reach Core once and complete one logical turn.");

  const toolRegistry = new ToolRegistry(); let toolCalls = 0;
  toolRegistry.register({ name: "echo", description: "QA", validate: (value) => typeof value === "string", execute: (value) => { toolCalls += 1; return value; } });
  const toolExecutor = new ToolExecutor(toolRegistry); let plans = 0;
  const planner: ToolPlanner = { plan: async (input) => ++plans === 1 ? { kind: "TOOL_REQUEST", name: "echo", input: input.userText } : { kind: "FINAL_RESPONSE", text: input.results[0]?.value ?? "" } };
  const toolLoop = new ToolInteractionLoop(planner, toolExecutor, toolRegistry.list(), ["echo"]);
  const toolMemory = new CountingMemory();
  const toolProvider = provider(async (request) => Object.freeze({ provider: "mock", text: (await toolLoop.run(request.conversationId, request.message)).text ?? "", grounded: false, sourceEntryIds: [] }));
  await processInboundChannelMessage(inbound("herramienta"), { activeProviderMode: "mock", providerOverride: toolProvider, orbiConversationId: "guard-tool", memoryStore: toolMemory, commercialRuntime: runtime() });
  assert(toolCalls === 1 && toolMemory.appendCalls === 1, "Tool-assisted execution must remain one completed logical turn.");

  const failedMemory = new CountingMemory();
  let failProvider = true;
  const failedProvider = provider(async () => {
    if (failProvider) { failProvider = false; throw Error("private provider detail"); }
    return Object.freeze({ provider: "mock", text: "recovered", grounded: false, sourceEntryIds: [] });
  });
  const failureRuntime = runtime();
  await expectDisposition(processInboundChannelMessage(inbound("fallo"), { activeProviderMode: "mock", providerOverride: failedProvider, orbiConversationId: "guard-provider-failure", memoryStore: failedMemory, commercialRuntime: failureRuntime }), "PROVIDER_FAILURE");
  assert(failedMemory.appendCalls === 0, "Provider failure must not fabricate assistant memory.");
  const recovered = await processInboundChannelMessage(inbound("recuperado"), { activeProviderMode: "mock", providerOverride: failedProvider, orbiConversationId: "guard-provider-failure", memoryStore: failedMemory, commercialRuntime: failureRuntime });
  assert(recovered.text === "recovered" && Number(failedMemory.appendCalls) === 1, "Execution failure must release coordinator state for the next request.");

  let burstExecutions = 0; const burstMemory = new CountingMemory();
  const burstProvider = provider(async () => { burstExecutions += 1; return Object.freeze({ provider: "mock", text: "burst", grounded: false, sourceEntryIds: [] }); });
  const burstRuntime = runtime();
  const burst = new MessageBurstBuffer({ enabled: true, windowMs: 10_000, maxWaitMs: 20_000, maxConversations: 1, maxMessages: 3 }, async (item) => {
    await processInboundChannelMessage(inbound(item.text), { activeProviderMode: "mock", providerOverride: burstProvider, orbiConversationId: item.conversationId, memoryStore: burstMemory, commercialRuntime: burstRuntime });
  });
  await burst.push("guard-burst", "hola"); await burst.push("guard-burst", "consulta"); await burst.flush("guard-burst");
  assert(burstExecutions === 1 && burstMemory.appendCalls === 1, "Composed burst must remain one logical execution.");

  const privateText = "raw-private-message@example.test";
  const telemetry = new BoundedInMemoryTelemetrySink();
  await expectDisposition(processInboundChannelMessage(inbound(privateText), { activeProviderMode: "mock", providerOverride: blockedProvider, orbiConversationId: "guard-private", commercialRuntime: runtime({ profile: disabledProfile, telemetry }) }), "CHANNEL_DISABLED");
  const denialEvent = telemetry.snapshot()[0] as TelemetryEvent | undefined;
  assert(denialEvent?.eventType === "RUNTIME_DISPOSITION" && denialEvent.reasonCode === "CHANNEL_DISABLED", "Controlled denial telemetry must be metadata-only.");
  assert(!JSON.stringify(denialEvent).includes(privateText) && !JSON.stringify(denialEvent).includes("external"), "Denial telemetry must not contain raw or external identity.");

  const failingTelemetry: TelemetrySink = { record: () => { throw Error("sink failed"); }, snapshot: () => [], clear: () => undefined };
  await expectDisposition(processInboundChannelMessage(inbound("safe"), { activeProviderMode: "mock", providerOverride: blockedProvider, orbiConversationId: "guard-telemetry", commercialRuntime: runtime({ profile: disabledProfile, telemetry: failingTelemetry }) }), "CHANNEL_DISABLED");

  assert(Number(downstreamCalls) === 1, "Only the allowed rate-limit seed may reach the shared blocked provider.");
  console.info("Commercial Runtime Integration QA: PASS (guard order, memory semantics, privacy, zero network)");
} catch (error) {
  console.error(error);
  process.exit(1);
}
