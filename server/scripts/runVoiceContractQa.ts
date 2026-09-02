import { readFileSync } from "node:fs";
import { MAX_TRANSCRIPTION_CHARACTERS, type SpeechToTextRequest } from "../src/types/speechToText.js";
import { MAX_TEXT_TO_SPEECH_CHARACTERS, type TextToSpeechRequest } from "../src/types/textToSpeech.js";
import { MAX_VOICE_INPUT_BYTES, VOICE_INPUT_SOURCES, type VoiceInput } from "../src/types/voiceInput.js";
import { VOICE_RUNTIME_STATES } from "../src/types/voiceRuntime.js";
import { createVoiceCoreTextHandoff } from "../src/services/voiceInteractionPipeline.js";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };

try {
  const input: VoiceInput = { id: "voice-contract-qa", conversationId: "shared-conversation", mimeType: "audio/webm", format: "webm", byteLength: 1, source: "web" };
  const stt: SpeechToTextRequest = { requestId: "stt-contract-qa", input };
  const tts: TextToSpeechRequest = { requestId: "tts-contract-qa", text: "Synthetic assistant response.", language: "en" };
  const handoff = createVoiceCoreTextHandoff({ requestId: stt.requestId, text: "Synthetic transcription.", provider: "future-provider" }, input.source, input.conversationId);
  assert(input.conversationId === handoff.conversationId, "Voice must reuse an optional existing conversation ID.");
  assert(VOICE_INPUT_SOURCES.includes("web") && VOICE_INPUT_SOURCES.includes("whatsapp"), "Generic future sources are required.");
  assert(MAX_VOICE_INPUT_BYTES > 0 && MAX_TRANSCRIPTION_CHARACTERS > 0 && MAX_TEXT_TO_SPEECH_CHARACTERS > 0, "Voice bounds are required.");
  assert(VOICE_RUNTIME_STATES.includes("idle") && VOICE_RUNTIME_STATES.includes("error"), "Voice runtime states are required.");
  assert(stt.input.id.length > 0 && tts.text.length > 0 && handoff.text.length > 0, "Provider-neutral contracts are required.");
  const routeSource = readFileSync(new URL("../src/routes/widgetMessage.ts", import.meta.url), "utf8");
  const capabilitySource = readFileSync(new URL("../src/services/capabilityInvocationPolicy.ts", import.meta.url), "utf8");
  assert(routeSource.includes("getConversationHistory") && routeSource.includes("buildKnowledgeContext"), "Existing Core path must remain unchanged.");
  assert(capabilitySource.includes('"knowledge-search"'), "Capability boundary must remain knowledge-search only.");
  console.info("Voice Contract QA: PASS");
} catch (error) { console.error(error); process.exit(1); }
