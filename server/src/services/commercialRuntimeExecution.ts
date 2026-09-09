import type { ClientProfile } from "../config/clientProfile.js";
import type { HumanHandoffService } from "../handoff/humanHandoffService.js";
import type { ChannelId } from "../types/channelMessage.js";
import type { RuntimeDisposition } from "../types/runtimeFailureSemantics.js";
import {
  ConversationExecutionCoordinator,
  ConversationRateLimiter,
  configurationFingerprint,
  guardInboundText,
  type CommercialRuntimePolicy,
} from "./commercialRuntimeHardening.js";
import { createRuntimeDisposition, RuntimeExecutionFailure } from "./runtimeFailureSemantics.js";
import { recordTelemetry, type TelemetrySink } from "./runtimeTelemetry.js";

export type CommercialRuntimeExecutionInput = Readonly<{
  channel: ChannelId;
  internalConversationId: string;
  text: string;
}>;

export type CommercialRuntimeExecutionResult<T> =
  | Readonly<{ ok: true; value: T }>
  | Readonly<{ ok: false; disposition: RuntimeDisposition }>;

export type CommercialRuntimeExecutionOptions = Readonly<{
  activeClient: ClientProfile;
  policy: CommercialRuntimePolicy;
  handoff: HumanHandoffService;
  telemetry?: TelemetrySink;
  now?: () => number;
}>;

/** Process-local commercial guard composition keyed only by internal conversation IDs. */
export class CommercialRuntimeExecution {
  private readonly limiter: ConversationRateLimiter;
  private readonly coordinator: ConversationExecutionCoordinator;
  private readonly now: () => number;
  private readonly fingerprint: string;
  private eventSequence = 0;

  constructor(private readonly options: CommercialRuntimeExecutionOptions) {
    this.now = options.now ?? (() => Date.now());
    this.limiter = new ConversationRateLimiter(options.policy, this.now);
    this.coordinator = new ConversationExecutionCoordinator(options.policy);
    this.fingerprint = configurationFingerprint({
      profileId: options.activeClient.profileId,
      schemaVersion: options.activeClient.schemaVersion,
      allowedTools: [...options.activeClient.capabilities.allowedTools].sort(),
      enabledChannels: [...options.activeClient.channels.enabled].sort(),
      knowledgeEnabled: options.activeClient.knowledge.enabled,
      policy: options.policy,
    });
  }

  private deny(reasonCode: "CHANNEL_DISABLED" | "INPUT_TOO_LARGE" | "HANDOFF_ACTIVE" | "RATE_LIMITED" | "CONCURRENCY_LIMITED", internalConversationId: string): CommercialRuntimeExecutionResult<never> {
    const disposition = createRuntimeDisposition(reasonCode);
    this.eventSequence += 1;
    recordTelemetry(this.options.telemetry, Object.freeze({
      eventId: `runtime-disposition-${this.eventSequence}`,
      eventType: "RUNTIME_DISPOSITION",
      timestamp: new Date(this.now()).toISOString(),
      internalConversationId,
      success: false,
      runtimeDisposition: disposition.category,
      reasonCode: disposition.reasonCode,
      profileId: this.options.activeClient.profileId,
      configurationFingerprint: this.fingerprint,
    }));
    return Object.freeze({ ok: false, disposition });
  }

  async execute<T>(input: CommercialRuntimeExecutionInput, work: () => Promise<T>): Promise<CommercialRuntimeExecutionResult<T>> {
    if (!this.options.activeClient.channels.enabled.includes(input.channel as "web" | "widget" | "whatsapp" | "voice")) return this.deny("CHANNEL_DISABLED", input.internalConversationId);
    if (!guardInboundText(input.text, this.options.policy).ok) return this.deny("INPUT_TOO_LARGE", input.internalConversationId);
    if (!this.options.handoff.canExecuteAi(input.internalConversationId)) return this.deny("HANDOFF_ACTIVE", input.internalConversationId);
    if (!this.limiter.allow(input.internalConversationId)) return this.deny("RATE_LIMITED", input.internalConversationId);

    const coordinated = await this.coordinator.run(input.internalConversationId, async (): Promise<CommercialRuntimeExecutionResult<T>> => {
      try {
        return Object.freeze({ ok: true, value: await work() });
      } catch (error) {
        const reasonCode = error instanceof RuntimeExecutionFailure ? error.reasonCode : "CORE_EXECUTION_FAILURE";
        return Object.freeze({ ok: false, disposition: createRuntimeDisposition(reasonCode) });
      }
    });
    if (!coordinated.ok) return this.deny("CONCURRENCY_LIMITED", input.internalConversationId);
    return coordinated.value;
  }
}
