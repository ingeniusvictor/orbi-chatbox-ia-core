import { readFileSync } from "node:fs";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

try {
  const chat = read("../../src/components/workspaces/ChatStudioWorkspace.tsx");
  const client = read("../../src/services/voiceReceiverClient.ts");
  const route = read("../src/routes/voice.ts");
  assert(chat.includes("navigator.mediaDevices?.getUserMedia") && chat.includes("new MediaRecorder(stream)"), "User-triggered browser capture is required.");
  assert(chat.includes("enumerateDevices()") && chat.includes("selectedVoiceInputId") && chat.includes("deviceId = { exact: selectedVoiceInputId }") && chat.includes("echoCancellation: true"), "Local microphone selection and exact safe capture constraints are required.");
  assert(chat.includes("track.onmute") && chat.includes("track.onunmute") && chat.includes("track.onended") && chat.includes("AudioContext") && chat.includes("inputSignal"), "Muted track handling and metadata-only input signal detection are required.");
  assert(chat.includes("diagnostics.trackMuted") && chat.includes("diagnostics.inputSignal !== \"active\"") && !chat.includes("handleSendMessage(\"[Música]"), "Muted or silent capture must block STT and avoid fabricated chat messages.");
  assert(chat.includes("recorder.stop()") && chat.includes("getTracks().forEach((track) => track.stop())"), "Capture stop and track cleanup are required.");
  assert(chat.includes("audio.size > 5 * 1024 * 1024"), "Voice capture size bound is required.");
  assert(chat.includes("transcribeVoiceAudio(audio)") && chat.includes("handleSendMessage(transcription.text, false, true)"), "Transcription must enter the normal chat path.");
  assert(chat.includes("synthesizeVoiceText(result.body.message)") && chat.includes("new Audio(url)") && chat.includes("URL.revokeObjectURL"), "Assistant text must precede synthesis and native playback cleanup.");
  assert(chat.includes("conversationId,") && !chat.includes("voiceConversation"), "Existing conversation ID must be reused without a voice store.");
  assert(client.includes("/api/voice/transcribe") && client.includes("/api/voice/synthesize"), "Local voice route client is required.");
  assert(client.includes("mimeType === \"audio/wav\"") && chat.includes("Reproducir voz") && chat.includes("URL.revokeObjectURL"), "WAV MIME verification and user-triggered playback fallback are required.");
  assert(route.includes("express.raw") && route.includes("convertVoiceAudioToWav") && route.includes("createTextToSpeechProvider"), "Bounded local route integration is required.");
  assert(!client.includes("whatsapp") && !route.includes("whatsapp"), "Voice UX must not integrate WhatsApp.");
  assert(!client.includes("openai") && !route.includes("openai"), "Voice UX must not call cloud speech providers.");
  console.info("Frontend Voice UX QA: PASS");
} catch (error) { console.error(error); process.exit(1); }
