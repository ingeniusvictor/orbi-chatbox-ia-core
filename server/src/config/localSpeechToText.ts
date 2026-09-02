import { resolve } from "node:path";
import { ORBI_SPEECH_INITIAL_PROMPT } from "../data/orbiSpeechVocabulary.js";
import type { VoiceInputFormat } from "../types/voiceInput.js";

export type LocalSpeechToTextRuntimeConfig = Readonly<{
  runtimeId: "whisper-cpp-local";
  command: string;
  modelPath: string;
  language: "es";
  timeoutMs: number;
  supportedFormats: readonly VoiceInputFormat[];
  initialPrompt: string;
}>;

const runtimeRoot = resolve(process.cwd(), ".local-runtime", "whisper.cpp");

/** Local-only configuration; paths can be overridden for an already-installed runtime. */
export const loadLocalSpeechToTextRuntimeConfig = (
  env: Readonly<Record<string, string | undefined>> = process.env,
): LocalSpeechToTextRuntimeConfig => Object.freeze({
  runtimeId: "whisper-cpp-local",
  command: env.ORBI_LOCAL_STT_COMMAND?.trim() || resolve(runtimeRoot, "bin", "Release", "whisper-cli.exe"),
  modelPath: env.ORBI_LOCAL_STT_MODEL?.trim() || resolve(runtimeRoot, "models", "ggml-base.bin"),
  language: "es",
  timeoutMs: 30_000,
  supportedFormats: Object.freeze(["wav"] as const),
  initialPrompt: ORBI_SPEECH_INITIAL_PROMPT,
});
