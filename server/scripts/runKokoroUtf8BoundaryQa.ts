import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import express from "express";
import { createServer } from "node:http";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { createVoiceRouter } from "../src/routes/voice.js";
import { KokoroTextToSpeechProvider } from "../src/services/kokoroTextToSpeechProvider.js";
import { LocalSpeechToTextProvider } from "../src/services/localSpeechToTextProvider.js";
import type { VoiceInput } from "../src/types/voiceInput.js";

const EXACT = "Hola, estoy en modo de respuesta. ¿Cómo te gustaría que te ayudara hoy?";
const ACCENTED = "¿Qué información técnica necesita LUMI para ayudarte con energía, instalación y análisis?";
const UNICODE_SENTINEL = "¿Qué pidió el niño? Energía, instalación, análisis, Perú y pingüino.";
const FORBIDDEN = /\b(?:tilde|circunflejo|circunflex|conflejo|atile|copy|ray)\b/iu;
const python = resolve(process.cwd(), "server/runtime/kokoro/.venv/Scripts/python.exe");
const synthesisSource = resolve(process.cwd(), "server/runtime/kokoro/synthesize.py");

const assert: (value: unknown, message: string) => asserts value = (value, message) => { if (!value) throw new Error(message); };
const isWav = (bytes: Uint8Array): boolean => bytes.byteLength > 44
  && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF"
  && String.fromCharCode(...bytes.slice(8, 12)) === "WAVE";
const hash = (bytes: Uint8Array): string => createHash("sha256").update(bytes).digest("hex");
const normalizedWords = (value: string): string => value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

const pipeToPython = (program: string, payload: string): Promise<string> => new Promise((resolvePromise, reject) => {
  const child = spawn(python, ["-c", program], { shell: false, windowsHide: true, stdio: ["pipe", "pipe", "pipe"] });
  let stdout = ""; let stderr = "";
  child.stdout.setEncoding("utf8"); child.stderr.setEncoding("utf8");
  child.stdout.on("data", (chunk: string) => { stdout += chunk; });
  child.stderr.on("data", (chunk: string) => { stderr += chunk; });
  child.on("error", reject);
  child.on("exit", (code) => code === 0 ? resolvePromise(stdout) : reject(new Error(stderr || `UTF-8 probe exited ${code}`)));
  child.stdin.end(payload);
});

const transcribe = async (id: string, bytes: Uint8Array): Promise<string> => {
  const input: VoiceInput = { id, mimeType: "audio/wav", format: "wav", byteLength: bytes.byteLength, source: "internal-test" };
  const provider = new LocalSpeechToTextProvider(async (candidate) => candidate.id === id ? bytes : new Uint8Array());
  return (await provider.transcribe({ requestId: `${id}-request`, input, language: "es" })).text;
};

const synthesize = async (id: string, text: string): Promise<Uint8Array> => {
  const result = await new KokoroTextToSpeechProvider().synthesize({ requestId: id, text, language: "es", format: "wav" });
  if (result.provider !== "kokoro-local" || result.audio.kind !== "buffer") throw new Error("Direct synthesis must use the Kokoro provider.");
  const bytes = result.audio.bytes;
  assert(isWav(bytes), "Direct synthesis must return a non-empty RIFF/WAVE buffer.");
  return bytes;
};

const startHttp = async (): Promise<{ baseUrl: string; close: () => Promise<void> }> => {
  const app = express(); app.use(express.json()); app.use(createVoiceRouter());
  const server = createServer(app);
  await new Promise<void>((resolvePromise, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolvePromise); });
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("HTTP QA server did not bind.");
  return { baseUrl: `http://127.0.0.1:${address.port}`, close: () => new Promise<void>((resolvePromise, reject) => server.close((error) => error ? reject(error) : resolvePromise())) };
};

const main = async (): Promise<void> => {
  const source = await readFile(synthesisSource, "utf8");
  const stdinConfig = source.indexOf('sys.stdin.reconfigure(encoding="utf-8")');
  const stdinRead = source.indexOf("sys.stdin.read()");
  assert(stdinConfig >= 0 && stdinConfig < stdinRead, "Kokoro stdin must be configured as UTF-8 before JSON is read.");
  assert(source.includes('sys.stdout.reconfigure(encoding="utf-8")'), "Kokoro stdout must be explicitly UTF-8.");
  assert(source.includes('EspeakG2P(language="es")') && source.includes('is_phonemes=True') && source.includes('"ef_dora"'), "Spanish G2P, phoneme mode, and ef_dora must remain unchanged.");
  assert(!source.includes("chcp") && !source.includes("shell=True"), "The UTF-8 boundary must not depend on a shell code page.");

  const probeProgram = "import json,sys; sys.stdin.reconfigure(encoding='utf-8'); sys.stdout.reconfigure(encoding='utf-8'); d=json.loads(sys.stdin.read()); print(json.dumps({'text':d['text'],'points':[ord(c) for c in d['text']]},ensure_ascii=False))";
  const probe = JSON.parse(await pipeToPython(probeProgram, JSON.stringify({ text: UNICODE_SENTINEL }))) as { text: string; points: number[] };
  assert(probe.text === UNICODE_SENTINEL, "Node-to-Python UTF-8 text changed at stdin.");
  for (const character of ["¿", "é", "ó", "í", "ú", "ñ"]) assert(probe.points.includes(character.codePointAt(0)!), `${character} was not preserved at the UTF-8 boundary.`);
  assert(!/[ÂÃ]/u.test(probe.text), "Mojibake characters reached Python.");

  const directory = await mkdtemp(join(tmpdir(), "orbi-kokoro-utf8-"));
  try {
    const direct = await synthesize("utf8-direct", EXACT);
    const directTranscript = await transcribe("utf8-direct", direct);
    assert(!FORBIDDEN.test(directTranscript), "Direct provider transcript contains a forbidden artifact term.");
    assert(normalizedWords(directTranscript).includes("modo de respuesta") && normalizedWords(directTranscript).includes("ayudara hoy"), "Direct provider transcript lost the intended sentence.");

    const accented = await synthesize("utf8-accented", ACCENTED);
    const accentedTranscript = await transcribe("utf8-accented", accented);
    assert(!FORBIDDEN.test(accentedTranscript), "Accented Spanish transcript contains a forbidden artifact term.");
    const accentedWords = normalizedWords(accentedTranscript);
    for (const expected of ["informacion", "tecnica", "energia", "instalacion", "analisis"]) assert(accentedWords.includes(expected), `Accented Spanish transcript lost ${expected}.`);

    const runtime = await startHttp();
    try {
      const response = await fetch(`${runtime.baseUrl}/api/voice/synthesize`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text: EXACT, language: "es" }) });
      const httpBytes = new Uint8Array(await response.arrayBuffer());
      assert(response.status === 200 && response.headers.get("content-type")?.startsWith("audio/wav") && isWav(httpBytes), "HTTP synthesis must return HTTP 200 audio/wav RIFF/WAVE.");
      assert(hash(httpBytes) === hash(direct), "HTTP synthesis must match deterministic direct Kokoro output without fallback.");
      const httpTranscript = await transcribe("utf8-http", httpBytes);
      assert(!FORBIDDEN.test(httpTranscript), "HTTP transcript contains a forbidden artifact term.");
      assert(normalizedWords(httpTranscript).includes("modo de respuesta") && normalizedWords(httpTranscript).includes("ayudara hoy"), "HTTP transcript lost the intended sentence.");
      console.info(`Kokoro UTF-8 Boundary QA: PASS\nDirect STT: ${directTranscript}\nHTTP STT: ${httpTranscript}\nAccented STT: ${accentedTranscript}`);
    } finally { await runtime.close(); }
  } finally { await rm(directory, { recursive: true, force: true }); }
};

void main().catch((error: unknown) => { console.error(error); process.exit(1); });
