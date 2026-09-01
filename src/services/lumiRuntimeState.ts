import type { BackendReceiverSendResult } from "./backendReceiverClient";
import type { LumiRuntimeState } from "../types/lumiRuntimeState";

const LOCAL_AI_UNAVAILABLE_CODES = new Set([
  "LOCAL_AI_RUNTIME_UNAVAILABLE",
  "LOCAL_AI_MODEL_UNAVAILABLE",
]);

const TIMEOUT_CODES = new Set(["LOCAL_AI_TIMEOUT"]);

/** Maps controlled receiver outcomes to intentionally non-technical LUMI states. */
export const classifyLumiRuntimeState = (
  result: Extract<BackendReceiverSendResult, { ok: false }>,
): LumiRuntimeState => {
  if (result.status === null) return "backend-unavailable";
  if (result.errorCode && LOCAL_AI_UNAVAILABLE_CODES.has(result.errorCode)) return "local-ai-unavailable";
  if (result.errorCode && TIMEOUT_CODES.has(result.errorCode)) return "timeout";
  return "error";
};

export const getLumiRuntimeStateMessage = (state: LumiRuntimeState): string => {
  switch (state) {
    case "backend-unavailable":
      return "LUMI no puede conectarse al servicio local en este momento.";
    case "local-ai-unavailable":
      return "El motor local de LUMI no está disponible en este momento.";
    case "timeout":
      return "LUMI tardó más de lo esperado. Puedes intentarlo nuevamente.";
    case "error":
      return "LUMI encontró un problema al procesar la solicitud.";
    case "processing":
      return "LUMI está pensando…";
    case "ready":
      return "LUMI está lista.";
  }
};

export const getLumiRuntimeStateLabel = (state: LumiRuntimeState): string => {
  switch (state) {
    case "processing": return "LUMI · Procesando";
    case "backend-unavailable": return "LUMI · Servicio local no disponible";
    case "local-ai-unavailable": return "LUMI · Motor local no disponible";
    case "timeout": return "LUMI · Tiempo agotado";
    case "error": return "LUMI · Error controlado";
    case "ready": return "LUMI · Lista";
  }
};
