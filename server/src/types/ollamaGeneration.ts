export type OllamaGenerationRequest = {
  readonly model: string;
  readonly prompt: string;
  readonly stream: false;
};

export type OllamaGenerationResponse = {
  readonly response: string;
};

export type OllamaGenerationResult =
  | { readonly ok: true; readonly text: string }
  | { readonly ok: false; readonly reason: string };
