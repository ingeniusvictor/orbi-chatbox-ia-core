import { readFileSync } from "node:fs";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

try {
  const chat = read("../../src/components/workspaces/ChatStudioWorkspace.tsx");
  const runtime = read("../../src/services/chatRuntimeState.ts");
  const client = read("../../src/services/voiceReceiverClient.ts");
  const message = read("../../src/components/chat/LumiMessageCard.tsx");
  const player = read("../../src/components/chat/VoiceWaveformPlayer.tsx");
  const userMessage = read("../../src/components/chat/UserMessageCard.tsx");
  assert(chat.includes("assistantVoiceAudioRef") && chat.includes("new Map<string, Blob>()"), "Assistant audio must remain runtime-only in memory.");
  assert(chat.includes("playAssistantVoice") && chat.includes("assistantVoiceAudioRef.current.get(messageId)"), "Per-message assistant replay is required.");
  assert(chat.includes("URL.createObjectURL") && chat.includes("URL.revokeObjectURL") && chat.includes("assistantVoiceAudioRef.current.clear()"), "Audio object URLs and runtime memory require cleanup.");
  assert(chat.includes("assistantVoiceMetadata[message.id]") && message.includes("VoiceWaveformPlayer") && player.includes("Voz LUMI") && chat.includes("formatAudioDuration"), "Compact assistant audio metadata is required.");
  assert(chat.includes("replayAssistantVoice") && player.includes("onReplay") && player.includes("RotateCcw"), "Replay must reuse runtime audio without synthesis.");
  assert(runtime.includes('voiceOrigin?: "voice"') && chat.includes('voiceOrigin: voiceTurn ? "voice" : undefined') && userMessage.includes("Mensaje por voz"), "Voice-origin messages must remain visibly marked.");
  assert(!chat.includes("localStorage") && !chat.includes("sessionStorage") && !player.includes("localStorage") && !client.includes("whatsapp"), "Voice replay must not persist audio or add a messaging channel.");
  console.info("Frontend Voice Replay QA: PASS");
} catch (error) { console.error(error); process.exit(1); }
