/** Metadata-only voice input contract. Audio bytes are intentionally not retained here. */
export const VOICE_INPUT_FORMATS = ["wav", "webm", "ogg", "mp3", "m4a"] as const;
export type VoiceInputFormat = (typeof VOICE_INPUT_FORMATS)[number];

export const VOICE_INPUT_SOURCES = ["web", "whatsapp", "internal-test"] as const;
export type VoiceInputSource = (typeof VOICE_INPUT_SOURCES)[number];

/** Conservative contract limits; adapters must reject input exceeding them before processing. */
export const MAX_VOICE_INPUT_BYTES = 5 * 1024 * 1024;

export type VoiceInput = Readonly<{
  id: string;
  conversationId?: string;
  mimeType: string;
  format: VoiceInputFormat;
  byteLength: number;
  source: VoiceInputSource;
}>;
