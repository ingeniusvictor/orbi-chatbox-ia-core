import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { loadLocalSpeechToTextRuntimeConfig, type LocalSpeechToTextRuntimeConfig } from "../config/localSpeechToText.js";
import { MAX_TRANSCRIPTION_CHARACTERS, type SpeechToTextRequest, type SpeechToTextResult } from "../types/speechToText.js";
import type { SpeechToTextProvider } from "../types/speechToTextProvider.js";
import { MAX_VOICE_INPUT_BYTES, type VoiceInput } from "../types/voiceInput.js";

const runFile = promisify(execFile);

export type LocalSpeechToTextErrorCode = "VOICE_STT_UNAVAILABLE" | "VOICE_STT_UNSUPPORTED_FORMAT" | "VOICE_STT_INVALID_AUDIO" | "VOICE_STT_TIMEOUT" | "VOICE_STT_FAILED" | "VOICE_STT_EMPTY_RESULT";

export class LocalSpeechToTextError extends Error {
  constructor(readonly code: LocalSpeechToTextErrorCode, message: string) { super(message); this.name = "LocalSpeechToTextError"; }
}

/** Implementation-only in-memory byte resolver; generic voice contracts retain metadata only. */
export type VoiceAudioReader = (input: VoiceInput) => Promise<Uint8Array>;

const normalizeText = (value: string): string => value.replace(/\s+/g, " ").trim();
const fail = (code: LocalSpeechToTextErrorCode, message: string): never => { throw new LocalSpeechToTextError(code, message); };

export class LocalSpeechToTextProvider implements SpeechToTextProvider {
  constructor(
    private readonly readAudio: VoiceAudioReader,
    private readonly config: LocalSpeechToTextRuntimeConfig = loadLocalSpeechToTextRuntimeConfig(),
  ) {}

  async transcribe(request: SpeechToTextRequest): Promise<SpeechToTextResult> {
    const { input } = request;
    if (!request.requestId.trim() || !input.id.trim() || input.byteLength <= 0 || input.byteLength > MAX_VOICE_INPUT_BYTES) fail("VOICE_STT_INVALID_AUDIO", "Voice audio is invalid or exceeds the allowed size.");
    if (!this.config.supportedFormats.includes(input.format)) fail("VOICE_STT_UNSUPPORTED_FORMAT", "Voice audio format is not supported by the local STT runtime.");

    const audio = await this.readAudio(input).catch(() => fail("VOICE_STT_INVALID_AUDIO", "Voice audio is not available for transcription."));
    if (audio.byteLength === 0 || audio.byteLength !== input.byteLength || audio.byteLength > MAX_VOICE_INPUT_BYTES) fail("VOICE_STT_INVALID_AUDIO", "Voice audio is invalid or exceeds the allowed size.");

    const directory = await mkdtemp(join(tmpdir(), "orbi-stt-"));
    const audioPath = join(directory, "input.wav");
    const outputPrefix = join(directory, "transcription");
    try {
      await writeFile(audioPath, audio);
      try {
        await runFile(this.config.command, ["-m", this.config.modelPath, "-f", audioPath, "-l", this.config.language, "--prompt", this.config.initialPrompt, "-nt", "-otxt", "-of", outputPrefix], { timeout: this.config.timeoutMs, maxBuffer: 16_384, windowsHide: true });
      } catch (error) {
        const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
        if (code === "ENOENT") fail("VOICE_STT_UNAVAILABLE", "Local STT runtime is unavailable.");
        if (code === "ETIMEDOUT") fail("VOICE_STT_TIMEOUT", "Local STT transcription timed out.");
        fail("VOICE_STT_FAILED", "Local STT transcription failed.");
      }
      const text = normalizeText(await readFile(`${outputPrefix}.txt`, "utf8").catch(() => fail("VOICE_STT_FAILED", "Local STT transcription output was unavailable.")));
      if (!text) fail("VOICE_STT_EMPTY_RESULT", "Local STT produced an empty transcription.");
      if (text.length > MAX_TRANSCRIPTION_CHARACTERS) fail("VOICE_STT_FAILED", "Local STT transcription exceeds the allowed size.");
      return Object.freeze({ requestId: request.requestId, text, language: this.config.language, provider: this.config.runtimeId });
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  }
}
