import { LOCAL_TEXT_TO_SPEECH_RUNTIME_CONFIG } from "../src/config/localTextToSpeech.js";
import { LocalTextToSpeechError, LocalTextToSpeechProvider } from "../src/services/localTextToSpeechProvider.js";
import { MAX_TEXT_TO_SPEECH_CHARACTERS, type TextToSpeechRequest } from "../src/types/textToSpeech.js";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const isWav = (bytes: Uint8Array): boolean => bytes.byteLength >= 44 && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WAVE";
const synthesize = async (requestId: string, text: string) => {
  const request: TextToSpeechRequest = { requestId, text, language: "es", format: "wav" };
  const startedAt = Date.now(); const result = await new LocalTextToSpeechProvider().synthesize(request);
  if (result.audio.kind !== "buffer") throw new Error("Generated audio must be an in-memory WAV buffer.");
  assert(isWav(result.audio.bytes) && result.audio.byteLength > 44, "Generated audio must be a non-empty WAV buffer.");
  return { byteLength: result.audio.byteLength, durationMs: result.durationMs ?? 0, latencyMs: Date.now() - startedAt };
};

try {
  assert(LOCAL_TEXT_TO_SPEECH_RUNTIME_CONFIG.runtimeId === "windows-sapi-local" && LOCAL_TEXT_TO_SPEECH_RUNTIME_CONFIG.language === "es-ES" && LOCAL_TEXT_TO_SPEECH_RUNTIME_CONFIG.format === "wav", "Spanish local WAV configuration is required.");
  const provider = new LocalTextToSpeechProvider();
  const invalid: TextToSpeechRequest = { requestId: "empty", text: "  ", language: "es" };
  try { await provider.synthesize(invalid); throw new Error("Empty TTS text was accepted."); } catch (error) { assert(error instanceof LocalTextToSpeechError && error.code === "VOICE_TTS_INVALID_TEXT", "Empty TTS text requires a controlled error."); }
  const oversized: TextToSpeechRequest = { requestId: "oversized", text: "x".repeat(MAX_TEXT_TO_SPEECH_CHARACTERS + 1), language: "es" };
  try { await provider.synthesize(oversized); throw new Error("Oversized TTS text was accepted."); } catch (error) { assert(error instanceof LocalTextToSpeechError && error.code === "VOICE_TTS_INVALID_TEXT", "Oversized TTS text requires a controlled error."); }
  const unsupported: TextToSpeechRequest = { requestId: "format", text: "Texto", language: "es", format: "mp3" };
  try { await provider.synthesize(unsupported); throw new Error("Unsupported TTS format was accepted."); } catch (error) { assert(error instanceof LocalTextToSpeechError && error.code === "VOICE_TTS_UNSUPPORTED_FORMAT", "Unsupported format requires a controlled error."); }
  const first = await synthesize("tts-one", "Hola, soy LUMI. Te escucho correctamente.");
  const second = await synthesize("tts-two", "ORBI Academy transforma conocimiento técnico en aprendizaje claro y práctico.");
  const third = await synthesize("tts-three", "Perfecto. La conversación por voz está funcionando.");
  assert(first.durationMs > 0 && second.durationMs > 0 && third.durationMs > 0, "Generated WAV duration is required.");
  console.info(`Local Text-to-Speech QA: PASS\nTest A: ${first.byteLength} bytes, ${first.durationMs} ms, ${first.latencyMs} ms\nTest B: ${second.byteLength} bytes, ${second.durationMs} ms, ${second.latencyMs} ms\nTest C: ${third.byteLength} bytes, ${third.durationMs} ms, ${third.latencyMs} ms`);
} catch (error) { console.error(error); process.exit(1); }
