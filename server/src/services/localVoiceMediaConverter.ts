import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { MAX_VOICE_INPUT_BYTES, type VoiceInputFormat } from "../types/voiceInput.js";
import { LocalSpeechToTextError } from "./localSpeechToTextProvider.js";

const runFile = promisify(execFile);

/** Converts browser WebM capture to the WAV-only local STT input in an auto-removed OS temp directory. */
export const convertVoiceAudioToWav = async (bytes: Uint8Array, format: VoiceInputFormat): Promise<Uint8Array> => {
  if (bytes.byteLength === 0 || bytes.byteLength > MAX_VOICE_INPUT_BYTES) throw new LocalSpeechToTextError("VOICE_STT_INVALID_AUDIO", "Voice audio is invalid or exceeds the allowed size.");
  if (format === "wav") return bytes;
  if (format !== "webm") throw new LocalSpeechToTextError("VOICE_STT_UNSUPPORTED_FORMAT", "Voice audio format is not supported by the local STT runtime.");
  const directory = await mkdtemp(join(tmpdir(), "orbi-voice-convert-"));
  const input = join(directory, "capture.webm"); const output = join(directory, "capture.wav");
  try {
    await writeFile(input, bytes);
    try { await runFile("ffmpeg", ["-nostdin", "-v", "error", "-y", "-i", input, "-ar", "16000", "-ac", "1", output], { timeout: 30_000, maxBuffer: 16_384, windowsHide: true }); }
    catch (error) {
      const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
      if (code === "ENOENT") throw new LocalSpeechToTextError("VOICE_STT_UNAVAILABLE", "Local voice conversion is unavailable.");
      if (code === "ETIMEDOUT") throw new LocalSpeechToTextError("VOICE_STT_TIMEOUT", "Local voice conversion timed out.");
      throw new LocalSpeechToTextError("VOICE_STT_FAILED", "Local voice conversion failed.");
    }
    const wav = new Uint8Array(await readFile(output).catch(() => { throw new LocalSpeechToTextError("VOICE_STT_FAILED", "Local voice conversion output was unavailable."); }));
    if (wav.byteLength === 0 || wav.byteLength > MAX_VOICE_INPUT_BYTES) throw new LocalSpeechToTextError("VOICE_STT_INVALID_AUDIO", "Converted voice audio is invalid or exceeds the allowed size.");
    return wav;
  } finally { await rm(directory, { recursive: true, force: true }); }
};
