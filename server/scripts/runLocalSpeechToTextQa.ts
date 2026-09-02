import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { loadLocalSpeechToTextRuntimeConfig } from "../src/config/localSpeechToText.js";
import { LocalSpeechToTextError, LocalSpeechToTextProvider } from "../src/services/localSpeechToTextProvider.js";
import type { SpeechToTextRequest } from "../src/types/speechToText.js";
import { MAX_VOICE_INPUT_BYTES, type VoiceInput } from "../src/types/voiceInput.js";

const runFile = promisify(execFile);
const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };

const fixture = async (directory: string, name: string, phrase: string): Promise<Uint8Array> => {
  const path = join(directory, `${name}.wav`);
  const script = `Add-Type -AssemblyName System.Speech; $s = [System.Speech.Synthesis.SpeechSynthesizer]::new(); $s.SelectVoiceByHints([System.Speech.Synthesis.VoiceGender]::Female, [System.Speech.Synthesis.VoiceAge]::Adult, 0, [System.Globalization.CultureInfo]::GetCultureInfo('es-ES')); $s.SetOutputToWaveFile('${path.replace(/'/g, "''")}'); $s.Speak('${phrase.replace(/'/g, "''")}'); $s.Dispose()`;
  await runFile("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", script], { windowsHide: true });
  return new Uint8Array(await readFile(path));
};

const transcribe = async (id: string, bytes: Uint8Array): Promise<{ text: string; latencyMs: number }> => {
  const input: VoiceInput = { id, mimeType: "audio/wav", format: "wav", byteLength: bytes.byteLength, source: "internal-test" };
  const request: SpeechToTextRequest = { requestId: `${id}-request`, input, language: "es" };
  const provider = new LocalSpeechToTextProvider(async (candidate) => candidate.id === id ? bytes : new Uint8Array());
  const startedAt = Date.now(); const result = await provider.transcribe(request);
  return { text: result.text, latencyMs: Date.now() - startedAt };
};

try {
  const config = loadLocalSpeechToTextRuntimeConfig();
  assert(config.runtimeId === "whisper-cpp-local" && config.language === "es" && config.supportedFormats.length === 1 && config.supportedFormats[0] === "wav", "Local-only Spanish WAV runtime config is required.");
  const provider = new LocalSpeechToTextProvider(async () => new Uint8Array());
  const empty: SpeechToTextRequest = { requestId: "empty", input: { id: "empty", mimeType: "audio/wav", format: "wav", byteLength: 0, source: "internal-test" } };
  try { await provider.transcribe(empty); throw new Error("Empty audio was accepted."); } catch (error) { assert(error instanceof LocalSpeechToTextError && error.code === "VOICE_STT_INVALID_AUDIO", "Empty audio needs a controlled error."); }
  const unsupported: SpeechToTextRequest = { requestId: "format", input: { id: "format", mimeType: "audio/mp3", format: "mp3", byteLength: 1, source: "internal-test" } };
  try { await provider.transcribe(unsupported); throw new Error("Unsupported format was accepted."); } catch (error) { assert(error instanceof LocalSpeechToTextError && error.code === "VOICE_STT_UNSUPPORTED_FORMAT", "Unsupported format needs a controlled error."); }
  const oversized: SpeechToTextRequest = { requestId: "oversized", input: { id: "oversized", mimeType: "audio/wav", format: "wav", byteLength: MAX_VOICE_INPUT_BYTES + 1, source: "internal-test" } };
  try { await provider.transcribe(oversized); throw new Error("Oversized audio was accepted."); } catch (error) { assert(error instanceof LocalSpeechToTextError && error.code === "VOICE_STT_INVALID_AUDIO", "Oversized audio needs a controlled error."); }
  const directory = await mkdtemp(join(tmpdir(), "orbi-stt-qa-"));
  try {
    const first = await transcribe("spanish-one", await fixture(directory, "one", "Hola LUMI, esta es una prueba de voz."));
    const second = await transcribe("spanish-two", await fixture(directory, "two", "ORBI Academy ofrece conocimiento y aprendizaje."));
    assert(first.text.length > 0 && second.text.length > 0, "Real Spanish transcriptions must be non-empty.");
    console.info(`Local Speech-to-Text QA: PASS\nTest 1: ${first.text} (${first.latencyMs} ms)\nTest 2: ${second.text} (${second.latencyMs} ms)`);
  } finally { await rm(directory, { recursive: true, force: true }); }
} catch (error) { console.error(error); process.exit(1); }
