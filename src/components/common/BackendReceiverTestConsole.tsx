import React, { useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Send, Server, ShieldCheck } from "lucide-react";

const DEFAULT_RECEIVER_URL = "http://localhost:8787";
const DEFAULT_PUBLIC_KEY = "orbi_demo_widget_key";
const DEFAULT_MESSAGE = "Hola, quiero probar el receiver sandbox de ORBI ChatBox IA Core.";

type TestKind = "health" | "message";

const isAllowedReceiverUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return (
      url.protocol === "http:" &&
      (url.hostname === "localhost" || url.hostname === "127.0.0.1") &&
      Boolean(url.port)
    );
  } catch {
    return false;
  }
};

const readResponseBody = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return { nonJsonResponse: "El backend indicó JSON, pero la respuesta no pudo interpretarse." };
    }
  }

  const text = await response.text();
  return { nonJsonResponse: text || "La respuesta no contenía JSON." };
};

export const BackendReceiverTestConsole: React.FC = () => {
  const [receiverUrl, setReceiverUrl] = useState(DEFAULT_RECEIVER_URL);
  const [publicKey, setPublicKey] = useState(DEFAULT_PUBLIC_KEY);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [consentAccepted, setConsentAccepted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<unknown>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [lastStatus, setLastStatus] = useState<number | null>(null);
  const [lastTestedAt, setLastTestedAt] = useState<string | null>(null);

  const validationError = useMemo(() => {
    if (!receiverUrl.trim()) return "La URL del receiver es obligatoria.";
    if (!isAllowedReceiverUrl(receiverUrl.trim())) {
      return "Solo se permiten URLs locales para este receiver sandbox.";
    }
    if (!publicKey.trim()) return "La clave pública del widget es obligatoria.";
    if (!message.trim()) return "El mensaje sandbox es obligatorio.";
    if (message.length > 2_000) return "El mensaje sandbox no puede superar 2000 caracteres.";
    return null;
  }, [message, publicKey, receiverUrl]);

  const runTest = async (kind: TestKind) => {
    if (validationError) {
      setLastError(validationError);
      setLastResponse(null);
      return;
    }

    const baseUrl = receiverUrl.trim().replace(/\/+$/, "");
    setIsLoading(true);
    setLastError(null);
    setLastResponse(null);
    setLastStatus(null);
    setLastTestedAt(new Date().toLocaleString());

    try {
      const response = await fetch(
        kind === "health"
          ? `${baseUrl}/api/health`
          : `${baseUrl}/api/public/widget/${encodeURIComponent(publicKey.trim())}/message`,
        kind === "health"
          ? { method: "GET" }
          : {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                channel: "manual_test",
                visitorId: "local-sandbox-visitor",
                message: message.trim(),
                pageUrl: "http://localhost:3000",
                consentAccepted,
                timestamp: new Date().toISOString(),
              }),
            },
      );

      setLastStatus(response.status);
      setLastResponse(await readResponseBody(response));
      if (!response.ok) {
        setLastError(`El backend sandbox respondió con HTTP ${response.status}. Revisa el JSON de respuesta.`);
      }
    } catch {
      setLastError("No se pudo conectar con el backend local. Ejecuta npm run server:dev.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="space-y-4 rounded-2xl border border-amber-500/30 bg-slate-900/70 p-4 shadow-lg sm:p-5">
      <div className="flex flex-col gap-3 border-b border-slate-800 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <div className="rounded-xl bg-amber-500/15 p-2.5">
            <Server className="h-5 w-5 text-amber-300" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Backend Receiver Manual Test Console</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              Prueba manual del receiver local sandbox; no crea leads ni activa automatizaciones productivas.
            </p>
          </div>
        </div>
        <span className="w-fit rounded-full border border-amber-400/40 bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold tracking-wide text-amber-200">
          LOCAL SANDBOX ONLY
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <label className="space-y-1.5 text-xs font-semibold text-slate-300">
          Receiver URL
          <input value={receiverUrl} onChange={(event) => setReceiverUrl(event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-white outline-none transition focus:border-amber-400" />
        </label>
        <label className="space-y-1.5 text-xs font-semibold text-slate-300">
          Widget public key
          <input value={publicKey} onChange={(event) => setPublicKey(event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-white outline-none transition focus:border-amber-400" />
        </label>
      </div>

      <label className="block space-y-1.5 text-xs font-semibold text-slate-300">
        Mensaje sandbox
        <textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={2001} rows={3} className="w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none transition focus:border-amber-400" />
        <span className={`text-[10px] ${message.length > 2000 ? "text-rose-300" : "text-slate-500"}`}>{message.length}/2000 caracteres</span>
      </label>

      <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-300">
        <input type="checkbox" checked={consentAccepted} onChange={(event) => setConsentAccepted(event.target.checked)} className="accent-amber-400" />
        Enviar consentimiento aceptado al fixture (desmárcalo para probar el error controlado).
      </label>

      {validationError && <p className="flex items-center gap-2 text-xs text-amber-300"><AlertCircle className="h-4 w-4 shrink-0" />{validationError}</p>}

      <div className="flex flex-col gap-2 sm:flex-row">
        <button type="button" onClick={() => runTest("health")} disabled={isLoading || Boolean(validationError)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />} Probar health check
        </button>
        <button type="button" onClick={() => runTest("message")} disabled={isLoading || Boolean(validationError)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Enviar mensaje sandbox
        </button>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-xs">
        <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-400">
          <span>HTTP: <strong className="text-white">{lastStatus ?? "—"}</strong></span>
          <span>Prueba local: <strong className="text-white">{lastTestedAt ?? "—"}</strong></span>
        </div>
        {lastError && <p className="mb-2 flex items-center gap-2 text-rose-300"><AlertCircle className="h-4 w-4 shrink-0" />{lastError}</p>}
        {lastResponse !== null ? <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-slate-900 p-3 font-mono text-[11px] leading-relaxed text-cyan-200">{JSON.stringify(lastResponse, null, 2)}</pre> : <p className="text-slate-500">Aún no hay respuesta del backend sandbox.</p>}
      </div>

      <div className="flex items-start gap-2 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-[11px] leading-relaxed text-slate-400">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
        <p>Esta consola solo prueba el backend local en http://localhost:8787. No debe usarse con datos reales ni URLs públicas. Sin producción, WhatsApp real, IA externa ni base de datos.</p>
      </div>
    </section>
  );
};
