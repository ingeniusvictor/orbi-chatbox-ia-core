/** UI/runtime progress only. This state never selects an AI, STT, or TTS provider. */
export const VOICE_RUNTIME_STATES = ["idle", "listening", "capturing", "transcribing", "thinking", "synthesizing", "speaking", "error"] as const;
export type VoiceRuntimeState = (typeof VOICE_RUNTIME_STATES)[number];
