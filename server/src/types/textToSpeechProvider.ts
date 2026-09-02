import type { TextToSpeechRequest, TextToSpeechResult } from "./textToSpeech.js";

/** Provider-neutral future boundary. No provider is registered or executable in 0K-24A.1. */
export interface TextToSpeechProvider {
  synthesize(request: TextToSpeechRequest): Promise<TextToSpeechResult>;
}
