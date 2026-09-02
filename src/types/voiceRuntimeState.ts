export const VOICE_RUNTIME_STATES = ["idle", "listening", "capturing", "transcribing", "thinking", "synthesizing", "speaking", "error"] as const;
export type VoiceRuntimeState = (typeof VOICE_RUNTIME_STATES)[number];
