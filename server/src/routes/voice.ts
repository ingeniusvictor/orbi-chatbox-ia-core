import express, { Router, type ErrorRequestHandler } from "express";
import { createSandboxError } from "../security/errorResponses.js";
import { convertVoiceAudioToWav } from "../services/localVoiceMediaConverter.js";
import { LocalSpeechToTextError, LocalSpeechToTextProvider } from "../services/localSpeechToTextProvider.js";
import { LocalTextToSpeechError } from "../services/localTextToSpeechProvider.js";
import { createTextToSpeechProvider } from "../services/createTextToSpeechProvider.js";
import type { VoiceInputFormat } from "../types/voiceInput.js";

const audioFormat = (contentType: string | undefined): VoiceInputFormat | undefined => {
  const type = contentType?.split(";", 1)[0]?.trim().toLowerCase();
  if (type === "audio/webm") return "webm";
  if (type === "audio/wav" || type === "audio/wave" || type === "audio/x-wav") return "wav";
  return undefined;
};

const sttFailure = (error: LocalSpeechToTextError) => createSandboxError(
  error.code === "VOICE_STT_UNAVAILABLE" ? 503 : error.code === "VOICE_STT_TIMEOUT" ? 504 : 400,
  error.code,
  "Local voice transcription could not be completed.",
);
const ttsFailure = (error: LocalTextToSpeechError) => createSandboxError(
  error.code === "VOICE_TTS_UNAVAILABLE" ? 503 : error.code === "VOICE_TTS_TIMEOUT" ? 504 : 400,
  error.code,
  "Local voice synthesis could not be completed.",
);

/** Local-only voice boundary. It exposes transcription and synthesis, never a separate Core conversation path. */
export const createVoiceRouter = (): Router => {
  const router = Router();
  router.post("/api/voice/transcribe", express.raw({ type: "audio/*", limit: "5mb" }), async (request, response, next) => {
    try {
      const format = audioFormat(request.get("content-type"));
      if (!format || !Buffer.isBuffer(request.body)) {
        const error = createSandboxError(400, "VOICE_STT_UNSUPPORTED_FORMAT", "Unsupported voice audio format."); response.status(error.statusCode).json(error.body); return;
      }
      const inputBytes = new Uint8Array(request.body);
      const wav = await convertVoiceAudioToWav(inputBytes, format);
      const provider = new LocalSpeechToTextProvider(async () => wav);
      const result = await provider.transcribe({ requestId: crypto.randomUUID(), input: { id: crypto.randomUUID(), mimeType: "audio/wav", format: "wav", byteLength: wav.byteLength, source: "web" }, language: "es" });
      response.json({ ok: true, text: result.text, language: result.language, provider: result.provider });
    } catch (error) {
      if (error instanceof LocalSpeechToTextError) { const failure = sttFailure(error); response.status(failure.statusCode).json(failure.body); return; }
      next(error);
    }
  });
  router.post("/api/voice/synthesize", async (request, response, next) => {
    try {
      const body = request.body as { text?: unknown; language?: unknown };
      const result = await createTextToSpeechProvider().synthesize({ requestId: crypto.randomUUID(), text: typeof body?.text === "string" ? body.text : "", language: typeof body?.language === "string" ? body.language : "es", format: "wav" });
      if (result.audio.kind !== "buffer") throw new LocalTextToSpeechError("VOICE_TTS_FAILED", "Local TTS returned no audio buffer.");
      response.type(result.mimeType).setHeader("Content-Length", String(result.audio.byteLength)).send(Buffer.from(result.audio.bytes));
    } catch (error) {
      if (error instanceof LocalTextToSpeechError) { const failure = ttsFailure(error); response.status(failure.statusCode).json(failure.body); return; }
      next(error);
    }
  });
  const bodyErrorHandler: ErrorRequestHandler = (error, _request, response, next) => {
    if (error && typeof error === "object" && "type" in error && error.type === "entity.too.large") { const failure = createSandboxError(400, "VOICE_STT_INVALID_AUDIO", "Voice audio exceeds the allowed size."); response.status(failure.statusCode).json(failure.body); return; }
    next(error);
  };
  router.use(bodyErrorHandler);
  return router;
};
