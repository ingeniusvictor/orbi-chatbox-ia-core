export type LocalAiRuntimeKind = "generic-local";

export type LocalAiRuntimeState = "ready" | "unavailable" | "misconfigured";

export type LocalAiRuntimeConfig = {
  readonly runtimeId: string;
  readonly endpoint: string;
  readonly model: string;
  readonly timeoutMs: number;
};

export type LocalAiRuntimeConfigInput = {
  readonly runtimeId?: unknown;
  readonly endpoint?: unknown;
  readonly model?: unknown;
  readonly timeoutMs?: unknown;
};

export type LocalAiRuntimeConfigValidation =
  | { readonly ok: true; readonly config: Readonly<LocalAiRuntimeConfig> }
  | { readonly ok: false; readonly reason: string };

export type LocalAiRuntimeReadiness = {
  readonly runtimeId: string | null;
  readonly state: LocalAiRuntimeState;
  readonly model: string | null;
  readonly reason: string | null;
};

export type LocalAiRuntimeProbeStatus = "reachable" | "unreachable" | "timeout" | "invalid-response";

export type LocalAiRuntimeProbeRequest = {
  readonly runtimeId: string;
  readonly endpoint: string;
  readonly timeoutMs: number;
};

export type LocalAiRuntimeProbeResult = {
  readonly runtimeId: string;
  readonly status: LocalAiRuntimeProbeStatus;
  readonly latencyMs: number | null;
  readonly reason: string | null;
};

export type LocalAiRuntimeProbeResultInput = LocalAiRuntimeProbeResult;

export type LocalAiRuntimeProbeResultValidation =
  | { readonly ok: true; readonly result: Readonly<LocalAiRuntimeProbeResult> }
  | { readonly ok: false; readonly reason: string };

export type LocalAiTransportMethod = "GET" | "POST";
export type LocalAiTransportRequest = { readonly runtimeId: string; readonly url: string; readonly method: LocalAiTransportMethod; readonly timeoutMs: number; readonly body?: unknown };
export type LocalAiTransportResponse = { readonly ok: true; readonly status: number; readonly body: unknown; readonly latencyMs: number };
export type LocalAiTransportFailure = { readonly ok: false; readonly failure: "timeout" | "unreachable" | "invalid-url" | "invalid-response" | "transport-error"; readonly reason: string };
export type LocalAiTransportResult = Readonly<LocalAiTransportResponse | LocalAiTransportFailure>;
