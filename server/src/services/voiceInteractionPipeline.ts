import type { VoiceInputSource } from "../types/voiceInput.js";
import type { SpeechToTextResult } from "../types/speechToText.js";
import type { TextToSpeechResult } from "../types/textToSpeech.js";

/**
 * Non-executable handoff into the existing controlled text Core. It carries no
 * extra capabilities, grounding, conversation store, audio data, or provider choice.
 */
export type VoiceCoreTextHandoff = Readonly<{
  conversationId?: string;
  text: string;
  source: VoiceInputSource;
}>;

/** Documentation-level composition of the future adapter flow; this service performs no STT/TTS. */
export type VoiceInteractionPipelineBoundary = Readonly<{
  transcription: SpeechToTextResult;
  coreRequest: VoiceCoreTextHandoff;
  assistantText: string;
  synthesis: TextToSpeechResult;
}>;

export const createVoiceCoreTextHandoff = (
  transcription: SpeechToTextResult,
  source: VoiceInputSource,
  conversationId?: string,
): VoiceCoreTextHandoff => Object.freeze({
  ...(conversationId ? { conversationId } : {}),
  text: transcription.text,
  source,
});
