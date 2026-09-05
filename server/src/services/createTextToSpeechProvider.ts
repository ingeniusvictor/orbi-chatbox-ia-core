import type { TextToSpeechProvider } from "../types/textToSpeechProvider.js";
import type { TextToSpeechRequest } from "../types/textToSpeech.js";
import { LocalTextToSpeechProvider } from "./localTextToSpeechProvider.js";
import { KokoroTextToSpeechProvider } from "./kokoroTextToSpeechProvider.js";
import { LocalTextToSpeechError } from "./localTextToSpeechProvider.js";

/** Canonical local TTS composition point: Kokoro primary with explicit local SAPI fallback. */
export const createTextToSpeechProvider = (): TextToSpeechProvider => {
  const primary = new KokoroTextToSpeechProvider(); const fallback = new LocalTextToSpeechProvider();
  return Object.freeze({ async synthesize(request: TextToSpeechRequest) {
    try { return await primary.synthesize(request); }
    catch (error) {
      if (!(error instanceof LocalTextToSpeechError) || !["VOICE_TTS_UNAVAILABLE", "VOICE_TTS_TIMEOUT", "VOICE_TTS_FAILED"].includes(error.code)) throw error;
      console.info("ORBI local TTS fallback", { provider: "sapi-local", voice: "Microsoft Helena Desktop", fallbackUsed: true });
      return fallback.synthesize(request);
    }
  }});
};
