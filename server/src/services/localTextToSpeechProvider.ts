import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { LOCAL_TEXT_TO_SPEECH_RUNTIME_CONFIG, type LocalTextToSpeechRuntimeConfig } from "../config/localTextToSpeech.js";
import { MAX_TEXT_TO_SPEECH_CHARACTERS, type TextToSpeechRequest, type TextToSpeechResult } from "../types/textToSpeech.js";
import type { TextToSpeechProvider } from "../types/textToSpeechProvider.js";

const runFile = promisify(execFile);

export type LocalTextToSpeechErrorCode = "VOICE_TTS_UNAVAILABLE" | "VOICE_TTS_UNSUPPORTED_FORMAT" | "VOICE_TTS_UNSUPPORTED_LANGUAGE" | "VOICE_TTS_INVALID_TEXT" | "VOICE_TTS_TIMEOUT" | "VOICE_TTS_FAILED" | "VOICE_TTS_EMPTY_RESULT";

export class LocalTextToSpeechError extends Error {
  constructor(readonly code: LocalTextToSpeechErrorCode, message: string) { super(message); this.name = "LocalTextToSpeechError"; }
}

type WavMetadata = Readonly<{ durationMs: number; sampleRate: number; channels: number; bitsPerSample: number }>;
const fail = (code: LocalTextToSpeechErrorCode, message: string): never => { throw new LocalTextToSpeechError(code, message); };
const quote = (value: string): string => value.replace(/'/g, "''");

const parseWav = (bytes: Uint8Array): WavMetadata => {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const chunk = (offset: number): string => String.fromCharCode(...bytes.slice(offset, offset + 4));
  if (bytes.byteLength < 44 || chunk(0) !== "RIFF" || chunk(8) !== "WAVE") fail("VOICE_TTS_FAILED", "Local TTS returned invalid audio.");
  let offset = 12; let formatCode = 0; let sampleRate = 0; let channels = 0; let byteRate = 0; let bitsPerSample = 0; let dataBytes = 0;
  while (offset + 8 <= bytes.byteLength) {
    const id = chunk(offset); const size = view.getUint32(offset + 4, true); const body = offset + 8;
    if (body + size > bytes.byteLength) break;
    if (id === "fmt " && size >= 16) { formatCode = view.getUint16(body, true); channels = view.getUint16(body + 2, true); sampleRate = view.getUint32(body + 4, true); byteRate = view.getUint32(body + 8, true); bitsPerSample = view.getUint16(body + 14, true); }
    if (id === "data") { dataBytes = size; break; }
    offset = body + size + (size % 2);
  }
  if (formatCode !== 1 || !sampleRate || !channels || !byteRate || !bitsPerSample || !dataBytes) fail("VOICE_TTS_FAILED", "Local TTS returned invalid PCM WAV audio.");
  return Object.freeze({ durationMs: Math.round((dataBytes / byteRate) * 1000), sampleRate, channels, bitsPerSample });
};

export class LocalTextToSpeechProvider implements TextToSpeechProvider {
  constructor(private readonly config: LocalTextToSpeechRuntimeConfig = LOCAL_TEXT_TO_SPEECH_RUNTIME_CONFIG) {}

  async synthesize(request: TextToSpeechRequest): Promise<TextToSpeechResult> {
    const text = request.text.trim();
    if (!request.requestId.trim() || !text || text.length > MAX_TEXT_TO_SPEECH_CHARACTERS) fail("VOICE_TTS_INVALID_TEXT", "Voice synthesis text is invalid or exceeds the allowed size.");
    if (request.format !== undefined && request.format !== this.config.format) fail("VOICE_TTS_UNSUPPORTED_FORMAT", "Voice output format is not supported by the local TTS runtime.");
    if (!request.language.toLowerCase().startsWith("es")) fail("VOICE_TTS_UNSUPPORTED_LANGUAGE", "Voice synthesis language is not supported by the local TTS runtime.");

    const directory = await mkdtemp(join(tmpdir(), "orbi-tts-"));
    const outputPath = join(directory, "speech.wav");
    const encodedText = Buffer.from(text, "utf8").toString("base64");
    const script = [
      "Add-Type -AssemblyName System.Speech",
      `$text = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('${encodedText}'))`,
      "$s = [System.Speech.Synthesis.SpeechSynthesizer]::new()",
      `$s.SelectVoice('${quote(this.config.voice)}')`,
      `$s.SetOutputToWaveFile('${quote(outputPath)}')`,
      "try { $s.Speak($text) } finally { $s.Dispose() }",
    ].join("; ");
    try {
      try { await runFile(this.config.command, ["-NoProfile", "-NonInteractive", "-Command", script], { timeout: this.config.timeoutMs, maxBuffer: 16_384, windowsHide: true }); }
      catch (error) {
        const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
        if (code === "ENOENT") fail("VOICE_TTS_UNAVAILABLE", "Local TTS runtime is unavailable.");
        if (code === "ETIMEDOUT") fail("VOICE_TTS_TIMEOUT", "Local TTS synthesis timed out.");
        fail("VOICE_TTS_FAILED", "Local TTS synthesis failed.");
      }
      const bytes = new Uint8Array(await readFile(outputPath).catch(() => fail("VOICE_TTS_FAILED", "Local TTS audio output was unavailable.")));
      if (bytes.byteLength === 0) fail("VOICE_TTS_EMPTY_RESULT", "Local TTS produced empty audio.");
      const metadata = parseWav(bytes);
      return Object.freeze({ requestId: request.requestId, audio: Object.freeze({ kind: "buffer", bytes, byteLength: bytes.byteLength }), mimeType: "audio/wav", format: this.config.format, provider: this.config.runtimeId, durationMs: metadata.durationMs });
    } finally { await rm(directory, { recursive: true, force: true }); }
  }
}
