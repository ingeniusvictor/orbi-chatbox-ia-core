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
