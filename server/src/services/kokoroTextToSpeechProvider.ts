import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { LOCAL_TEXT_TO_SPEECH_RUNTIME_CONFIG } from "../config/localTextToSpeech.js";
import { MAX_TEXT_TO_SPEECH_CHARACTERS, type TextToSpeechRequest, type TextToSpeechResult } from "../types/textToSpeech.js";
import type { TextToSpeechProvider } from "../types/textToSpeechProvider.js";
import { LocalTextToSpeechError } from "./localTextToSpeechProvider.js";
import { normalizeTextForSpeech } from "./normalizeTextForSpeech.js";

const root = resolve(process.cwd(), "server/runtime/kokoro");
const python = join(root, ".venv", "Scripts", "python.exe");
const script = join(root, "synthesize.py");
const isWav = (bytes: Uint8Array) => bytes.byteLength > 44 && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WAVE";

export class KokoroTextToSpeechProvider implements TextToSpeechProvider {
  async synthesize(request: TextToSpeechRequest): Promise<TextToSpeechResult> {
    const inputText = request.text.trim();
    if (!request.requestId.trim() || !inputText || inputText.length > MAX_TEXT_TO_SPEECH_CHARACTERS) throw new LocalTextToSpeechError("VOICE_TTS_INVALID_TEXT", "Voice synthesis text is invalid or exceeds the allowed size.");
    if (!request.language.toLowerCase().startsWith("es")) throw new LocalTextToSpeechError("VOICE_TTS_UNSUPPORTED_LANGUAGE", "Voice synthesis language is not supported.");
    const text = normalizeTextForSpeech(inputText);
    if (!text) throw new LocalTextToSpeechError("VOICE_TTS_INVALID_TEXT", "Voice synthesis text is invalid or exceeds the allowed size.");
    const directory = await mkdtemp(join(tmpdir(), "orbi-kokoro-")); const output = join(directory, "speech.wav");
    try {
      await new Promise<void>((resolvePromise, reject) => {
        const child = spawn(python, [script], { shell: false, windowsHide: true, stdio: ["pipe", "ignore", "ignore"] });
        const timer = setTimeout(() => { child.kill(); reject(new LocalTextToSpeechError("VOICE_TTS_TIMEOUT", "Local Kokoro synthesis timed out.")); }, LOCAL_TEXT_TO_SPEECH_RUNTIME_CONFIG.timeoutMs);
        child.on("error", () => { clearTimeout(timer); reject(new LocalTextToSpeechError("VOICE_TTS_UNAVAILABLE", "Local Kokoro runtime is unavailable.")); });
        child.on("exit", (code) => { clearTimeout(timer); code === 0 ? resolvePromise() : reject(new LocalTextToSpeechError("VOICE_TTS_FAILED", "Local Kokoro synthesis failed.")); });
        child.stdin.end(JSON.stringify({ text, outputPath: output }));
      });
      const bytes = new Uint8Array(await readFile(output));
      if (!isWav(bytes)) throw new LocalTextToSpeechError("VOICE_TTS_FAILED", "Local Kokoro returned invalid audio.");
      return Object.freeze({ requestId: request.requestId, audio: Object.freeze({ kind: "buffer", bytes, byteLength: bytes.byteLength }), mimeType: "audio/wav", format: "wav", provider: "kokoro-local", durationMs: undefined });
    } finally { await rm(directory, { recursive: true, force: true }); }
  }
}
