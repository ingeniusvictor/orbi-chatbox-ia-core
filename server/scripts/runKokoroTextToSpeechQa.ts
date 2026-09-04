import { KokoroTextToSpeechProvider } from "../src/services/kokoroTextToSpeechProvider.js";
import { normalizeTextForSpeech } from "../src/services/normalizeTextForSpeech.js";
import { MAX_TEXT_TO_SPEECH_CHARACTERS } from "../src/types/textToSpeech.js";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const run = async (id: string, text: string): Promise<number> => {
  const started = Date.now();
  const result = await new KokoroTextToSpeechProvider().synthesize({ requestId: id, text, language: "es", format: "wav" });
  if (result.audio.kind !== "buffer") throw new Error("WAV required");
  assert(result.audio.byteLength > 44, "WAV required");
  assert(String.fromCharCode(...result.audio.bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...result.audio.bytes.slice(8, 12)) === "WAVE", "Valid RIFF/WAVE required");
  return Date.now() - started;
};

try {
  const cases: ReadonlyArray<readonly [string, string, string]> = [
    ["markdown-bold", "**ORBI Academy** representa aprendizaje técnico.", "ORBI Academy representa aprendizaje técnico."],
    ["markdown-code", "`LUMI` está lista para ayudarte.", "LUMI está lista para ayudarte."],
    ["tilde", "ORBI ~ Ecosystem", "ORBI Ecosystem"],
    ["circumflex", "ORBI ^ Ecosystem", "ORBI Ecosystem"],
    ["question", "¿Qué representa ORBI Academy?", "¿Qué representa ORBI Academy?"],
    ["accents", "energía, instalación, técnico, español, niño", "energía, instalación, técnico, español, niño"],
  ];
  for (const [id, source, expected] of cases) assert(normalizeTextForSpeech(source) === expected, `Unexpected speech normalization for ${id}.`);
  const a = await run("a", "Hola, soy LUMI. Te escucho correctamente.");
  const b = await run("b", "ORBI Academy transforma conocimiento técnico en aprendizaje claro y práctico.");
  await run("formatting", "**ORBI Academy** representa aprendizaje técnico.");
  await run("shell", "hola && whoami $(calc) ; dir");
  try { await run("bound", "x".repeat(MAX_TEXT_TO_SPEECH_CHARACTERS + 1)); throw new Error("bound"); } catch { /* controlled rejection expected */ }
  console.info(`Kokoro TTS QA: PASS\nA: ${a} ms\nB: ${b} ms`);
} catch (error) { console.error(error); process.exit(1); }
