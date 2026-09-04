import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { createApp } from "../src/app.js";
import { loadServerRuntimeEnv } from "../src/config/env.js";
import { ORBI_SPEECH_VOCABULARY } from "../src/data/orbiSpeechVocabulary.js";

const runFile = promisify(execFile);
const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const wav = (bytes: Uint8Array): boolean => bytes.byteLength >= 44 && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WAVE";

const createFixture = async (directory: string): Promise<Uint8Array> => {
  const path = join(directory, "academy.wav");
  const script = `Add-Type -AssemblyName System.Speech; $s = [System.Speech.Synthesis.SpeechSynthesizer]::new(); $s.SelectVoice('Microsoft Helena Desktop'); $s.SetOutputToWaveFile('${path.replace(/'/g, "''")}'); $s.Speak('¿Qué representa ORBI Academy?'); $s.Dispose()`;
  await runFile("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", script], { windowsHide: true });
  return new Uint8Array(await readFile(path));
};

try {
  assert(ORBI_SPEECH_VOCABULARY.length === 7 && ORBI_SPEECH_VOCABULARY.includes("ORBI Academy"), "Bounded STT vocabulary is required.");
  const app = createApp(loadServerRuntimeEnv());
  const server = createServer(app);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address(); assert(address && typeof address !== "string", "Local voice test server is required.");
  const baseUrl = `http://127.0.0.1:${(address as AddressInfo).port}`;
  const directory = await mkdtemp(join(tmpdir(), "orbi-voice-e2e-"));
  try {
    const fixture = await createFixture(directory);
    const transcriptionResponse = await fetch(`${baseUrl}/api/voice/transcribe`, { method: "POST", headers: { "Content-Type": "audio/wav" }, body: fixture });
    const transcription = await transcriptionResponse.json() as { ok?: unknown; text?: unknown };
    assert(transcriptionResponse.ok && transcription.ok === true && typeof transcription.text === "string" && transcription.text.toLowerCase().includes("orbi academy"), "ORBI Academy must be transcribed before entering Core.");
    const chatResponse = await fetch(`${baseUrl}/api/public/widget/orbi_demo_widget_key/message`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ channel: "web_demo", visitorId: "voice-e2e-synthetic", message: transcription.text, pageUrl: "http://localhost:3000", consentAccepted: true, timestamp: new Date().toISOString() }) });
    const chat = await chatResponse.json() as { ok?: unknown; message?: unknown; grounded?: unknown; sourceEntryIds?: unknown; conversationId?: unknown };
    assert(chatResponse.ok && chat.ok === true && chat.grounded === true && Array.isArray(chat.sourceEntryIds) && chat.sourceEntryIds.length > 0 && typeof chat.conversationId === "string", "Transcription must use the existing grounded Core response path.");
    const synthesisResponse = await fetch(`${baseUrl}/api/voice/synthesize`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: chat.message, language: "es" }) });
    const audio = new Uint8Array(await synthesisResponse.arrayBuffer());
    assert(synthesisResponse.ok && wav(audio), "Local TTS must return a valid WAV response.");
    console.info(`Voice End-to-End Final QA: PASS\nTranscription: ${transcription.text}\nGrounded: ${chat.grounded}\nSource IDs: ${(chat.sourceEntryIds as string[]).join(",")}\nWAV bytes: ${audio.byteLength}`);
  } finally { await rm(directory, { recursive: true, force: true }); await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve())); }
} catch (error) { console.error(error); process.exit(1); }
