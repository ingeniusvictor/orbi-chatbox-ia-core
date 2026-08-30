export type OllamaGenerationRequest = {
  readonly model: string;
  readonly prompt: string;
  readonly stream: false;
  /** Disable Qwen3 reasoning mode for bounded, direct local responses. */
  readonly think: false;
};

export type OllamaGenerationResponse = {
  readonly response: string;
};

export type OllamaGenerationResult =
  | { readonly ok: true; readonly text: string }
  | {
    readonly ok: false;
    readonly code: "runtime-unavailable" | "model-unavailable" | "timeout" | "invalid-response" | "generation-failed";
    readonly reason: string;
  };
