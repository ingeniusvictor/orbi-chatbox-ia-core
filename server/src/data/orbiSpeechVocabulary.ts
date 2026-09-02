/** Small, static STT recognition hint. It is not a Knowledge Engine source or a chat-message rewrite table. */
export const ORBI_SPEECH_VOCABULARY = Object.freeze([
  "ORBI",
  "LUMI",
  "ORBI Academy",
  "ORBI Services",
  "ORBI Development",
  "ORBI Corporate",
  "ORBI Ecosystem",
] as const);

export const ORBI_SPEECH_INITIAL_PROMPT = `Contexto de terminología ORBI: ${ORBI_SPEECH_VOCABULARY.join(", ")}.`;
