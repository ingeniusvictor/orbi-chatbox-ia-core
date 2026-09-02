import type { SpeechToTextRequest, SpeechToTextResult } from "./speechToText.js";

/** Provider-neutral future boundary. No provider is registered or executable in 0K-24A.1. */
export interface SpeechToTextProvider {
  transcribe(request: SpeechToTextRequest): Promise<SpeechToTextResult>;
}
