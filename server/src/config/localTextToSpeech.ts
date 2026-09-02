import type { VoiceInputFormat } from "../types/voiceInput.js";

export type LocalTextToSpeechRuntimeConfig = Readonly<{
  runtimeId: "windows-sapi-local";
  command: "powershell.exe";
  voice: "Microsoft Helena Desktop";
  language: "es-ES";
  timeoutMs: number;
  format: VoiceInputFormat;
}>;

/** Windows-local SAPI only. It uses no API key, cloud provider, or network transport. */
export const LOCAL_TEXT_TO_SPEECH_RUNTIME_CONFIG: LocalTextToSpeechRuntimeConfig = Object.freeze({
  runtimeId: "windows-sapi-local",
  command: "powershell.exe",
  voice: "Microsoft Helena Desktop",
  language: "es-ES",
  timeoutMs: 30_000,
  format: "wav",
});
