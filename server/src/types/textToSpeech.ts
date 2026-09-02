import type { VoiceInputFormat } from "./voiceInput.js";

/** Bound applied to Core assistant text before a future TTS adapter can consume it. */
export const MAX_TEXT_TO_SPEECH_CHARACTERS = 4_000;

export type TextToSpeechRequest = Readonly<{
  requestId: string;
  text: string;
  language: string;
  voice?: string;
  format?: VoiceInputFormat;
}>;

/** A future adapter may return a reference or bounded binary metadata; no audio is persisted by this contract. */
export type TextToSpeechAudio =
  | Readonly<{ kind: "reference"; value: string }>
  | Readonly<{ kind: "buffer"; bytes: Uint8Array; byteLength: number }>;

export type TextToSpeechResult = Readonly<{
  requestId: string;
  audio: TextToSpeechAudio;
  mimeType: string;
  format: VoiceInputFormat;
  provider: string;
  durationMs?: number;
}>;
