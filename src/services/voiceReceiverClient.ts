import { DEFAULT_RECEIVER_URL, isAllowedLocalReceiverUrl } from "./backendReceiverClient";

type VoiceSuccess = { ok: true };
type VoiceFailure = { ok: false; message: string };
export type VoiceTranscriptionResult = VoiceSuccess & { text: string } | VoiceFailure;
export type VoiceSynthesisResult = VoiceSuccess & { audio: Blob } | VoiceFailure;

const endpoint = (path: string, receiverUrl = DEFAULT_RECEIVER_URL): string | undefined => isAllowedLocalReceiverUrl(receiverUrl) ? `${receiverUrl.replace(/\/+$/, "")}${path}` : undefined;
const errorMessage = async (response: Response, fallback: string): Promise<string> => {
  try { const body = await response.json() as { message?: unknown }; return typeof body.message === "string" ? body.message : fallback; } catch { return fallback; }
};

export const transcribeVoiceAudio = async (audio: Blob, receiverUrl?: string): Promise<VoiceTranscriptionResult> => {
  const url = endpoint("/api/voice/transcribe", receiverUrl); if (!url) return { ok: false, message: "La voz requiere un backend sandbox local." };
  try {
    const response = await fetch(url, { method: "POST", headers: { "Content-Type": audio.type || "audio/webm" }, body: audio });
    if (!response.ok) return { ok: false, message: await errorMessage(response, "No se pudo transcribir el audio local.") };
    const body = await response.json() as { ok?: unknown; text?: unknown };
    return body.ok === true && typeof body.text === "string" && body.text.trim() ? { ok: true, text: body.text.trim() } : { ok: false, message: "La transcripción local no devolvió texto." };
  } catch { return { ok: false, message: "El servicio local de transcripción no está disponible." }; }
};

export const synthesizeVoiceText = async (text: string, receiverUrl?: string): Promise<VoiceSynthesisResult> => {
  const url = endpoint("/api/voice/synthesize", receiverUrl); if (!url) return { ok: false, message: "La voz requiere un backend sandbox local." };
  try {
    const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, language: "es" }) });
    if (!response.ok) return { ok: false, message: await errorMessage(response, "No se pudo sintetizar la respuesta local." ) };
    const mimeType = response.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();
    const bytes = await response.arrayBuffer();
    const audio = new Blob([bytes], { type: "audio/wav" });
    return mimeType === "audio/wav" && audio.size > 44 ? { ok: true, audio } : { ok: false, message: "El audio local no es válido." };
  } catch { return { ok: false, message: "El servicio local de voz no está disponible." }; }
};
