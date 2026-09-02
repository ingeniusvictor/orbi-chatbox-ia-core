import type { VoiceInput } from "./voiceInput.js";

/** Bound applied to transcriptions before they can enter the existing Core message path. */
export const MAX_TRANSCRIPTION_CHARACTERS = 4_000;

export type SpeechToTextRequest = Readonly<{
  requestId: string;
  input: VoiceInput;
  language?: string;
}>;

export type SpeechToTextResult = Readonly<{
  requestId: string;
  text: string;
  language?: string;
  durationMs?: number;
  provider: string;
  confidence?: number;
}>;
