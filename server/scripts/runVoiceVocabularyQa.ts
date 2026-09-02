import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { ORBI_SPEECH_INITIAL_PROMPT, ORBI_SPEECH_VOCABULARY } from "../src/data/orbiSpeechVocabulary.js";
import { loadLocalSpeechToTextRuntimeConfig } from "../src/config/localSpeechToText.js";
import { LocalSpeechToTextProvider } from "../src/services/localSpeechToTextProvider.js";
import type { SpeechToTextRequest } from "../src/types/speechToText.js";
import type { VoiceInput } from "../src/types/voiceInput.js";

const runFile = promisify(execFile);
const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const fold = (value: string): string => value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

const fixture = async (directory: string, id: string, phrase: string): Promise<Uint8Array> => {
  const path = join(directory, `${id}.wav`);
  const script = `Add-Type -AssemblyName System.Speech; $s = [System.Speech.Synthesis.SpeechSynthesizer]::new(); $s.SelectVoice('Microsoft Helena Desktop'); $s.SetOutputToWaveFile('${path.replace(/'/g, "''")}'); $s.Speak('${phrase.replace(/'/g, "''")}'); $s.Dispose()`;
  await runFile("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", script], { windowsHide: true });
  return new Uint8Array(await readFile(path));
};

const transcribe = async (id: string, bytes: Uint8Array): Promise<{ text: string; latencyMs: number }> => {
  const input: VoiceInput = { id, mimeType: "audio/wav", format: "wav", byteLength: bytes.byteLength, source: "internal-test" };
  const request: SpeechToTextRequest = { requestId: `${id}-request`, input, language: "es" };
  const startedAt = Date.now(); const result = await new LocalSpeechToTextProvider(async () => bytes).transcribe(request);
  return { text: result.text, latencyMs: Date.now() - startedAt };
};

try {
  const config = loadLocalSpeechToTextRuntimeConfig();
  assert(ORBI_SPEECH_VOCABULARY.length === 7 && ORBI_SPEECH_VOCABULARY.includes("ORBI Academy") && ORBI_SPEECH_VOCABULARY.includes("LUMI"), "Bounded canonical vocabulary is required.");
  assert(config.initialPrompt === ORBI_SPEECH_INITIAL_PROMPT && config.initialPrompt.length < 220, "Bounded local STT prompt is required.");
  const directory = await mkdtemp(join(tmpdir(), "orbi-vocabulary-qa-"));
  try {
    const academyRuns = await Promise.all(["academy-one", "academy-two", "academy-three"].map(async (id) => transcribe(id, await fixture(directory, id, "¿Qué representa ORBI Academy?"))));
    const lumi = await transcribe("lumi", await fixture(directory, "lumi", "Hola LUMI."));
    const services = await transcribe("services", await fixture(directory, "services", "ORBI Services."));
    const ordinaryOne = await transcribe("ordinary-one", await fixture(directory, "ordinary-one", "Hola, esta es una prueba normal de reconocimiento de voz."));
    const ordinaryTwo = await transcribe("ordinary-two", await fixture(directory, "ordinary-two", "Hoy quiero aprender sobre energía solar."));
    const academySuccesses = academyRuns.filter((run) => fold(run.text).includes("orbi academy")).length;
    assert(academySuccesses === academyRuns.length, "ORBI Academy must be recognizable in all controlled runs.");
    assert(fold(lumi.text).includes("lumi"), "LUMI must be recognizable.");
    assert(fold(services.text).includes("orbi services"), "ORBI Services must be recognizable.");
    assert(!fold(ordinaryOne.text).includes("orbi") && !fold(ordinaryTwo.text).includes("orbi"), "Vocabulary context must not insert ORBI into ordinary speech.");
    console.info(`Voice Vocabulary QA: PASS\nAcademy: ${academyRuns.map((run) => `${run.text} (${run.latencyMs} ms)`).join(" | ")}\nLUMI: ${lumi.text}\nServices: ${services.text}\nOrdinary: ${ordinaryOne.text} | ${ordinaryTwo.text}`);
  } finally { await rm(directory, { recursive: true, force: true }); }
} catch (error) { console.error(error); process.exit(1); }
