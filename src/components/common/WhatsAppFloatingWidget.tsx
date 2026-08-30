import React, { useEffect, useRef, useState } from "react";

export type WhatsAppFloatingWidgetProps = {
  phoneNumber?: string;
  defaultMessage?: string;
  brandName?: string;
  mode?: "demo" | "sandbox" | "preview";
  enabled?: boolean;
  realAutomationAllowed?: boolean;
  placement?: "fixed" | "inline-preview";
};

const sanitizePhoneNumber = (phoneNumber?: string) => (phoneNumber || "").replace(/\D/g, "");

export const WhatsAppFloatingWidget: React.FC<WhatsAppFloatingWidgetProps> = ({
  phoneNumber,
  defaultMessage = "Hola. Vengo desde la web y necesito información.",
  brandName = "ORBI",
  mode = "sandbox",
  enabled = true,
  realAutomationAllowed = false,
  placement = "fixed",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sanitizedPhoneNumber = sanitizePhoneNumber(phoneNumber);
  const hasValidPhoneNumber = sanitizedPhoneNumber.length >= 8;
  const modeLabel = mode === "demo" ? "demo" : mode === "preview" ? "preview" : "sandbox";
  const manualLink = hasValidPhoneNumber
    ? `https://wa.me/${sanitizedPhoneNumber}?text=${encodeURIComponent(defaultMessage)}`
    : undefined;

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!enabled) return null;

  const isInlinePreview = placement === "inline-preview";

  return (
    <div
      ref={containerRef}
      className={isInlinePreview ? "relative w-full" : "fixed bottom-6 left-6 z-40"}
    >
      {isOpen && (
        <section
          className={`mb-3 w-80 rounded-2xl border border-emerald-400/30 bg-slate-950 p-4 shadow-2xl ${
            isInlinePreview ? "" : "max-w-[calc(100vw-3rem)]"
          }`}
          aria-label="Panel de contacto por WhatsApp"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-white">Contacto por WhatsApp</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">
                Conversemos directamente por WhatsApp. Esta atención es manual y no corresponde a un bot automatizado.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md px-2 py-1 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
              aria-label="Cerrar contacto por WhatsApp"
            >
              ×
            </button>
          </div>

          <p className="mt-3 rounded-lg border border-emerald-400/20 bg-emerald-400/5 px-3 py-2 text-[11px] font-medium text-emerald-200">
            Modo {modeLabel} — sin automatización real
          </p>

          {manualLink ? (
            <a
              href={manualLink}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex w-full items-center justify-center rounded-xl bg-emerald-500 px-3 py-2 text-xs font-bold text-slate-950 transition hover:bg-emerald-400"
              aria-label={`Abrir WhatsApp para contactar a ${brandName}`}
            >
              Abrir WhatsApp
            </a>
          ) : (
            <div className="mt-3 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs font-semibold text-amber-100">
              WhatsApp en configuración
            </div>
          )}

          <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
            No se envían mensajes automáticos desde ORBI ChatBox.
            {realAutomationAllowed ? " La automatización permanece deshabilitada en este módulo." : ""}
          </p>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-500 px-4 py-3 text-xs font-bold text-slate-950 shadow-lg transition hover:bg-emerald-400 ${
          isInlinePreview ? "w-full justify-center rounded-xl" : ""
        }`}
        aria-label="Abrir contacto por WhatsApp"
        aria-expanded={isOpen}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="currentColor">
          <path d="M12 2a9.75 9.75 0 0 0-8.32 14.84L2.5 21.5l4.81-1.15A9.75 9.75 0 1 0 12 2Zm0 17.7a7.94 7.94 0 0 1-4.04-1.1l-.29-.17-2.86.69.76-2.78-.19-.29A7.94 7.94 0 1 1 12 19.7Zm4.35-5.96c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.01-.37.1-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.46-.39-.4-.54-.4h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.1.15 1.52.09.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
        </svg>
        <span>{isInlinePreview ? "Ver preview de WhatsApp manual" : "WhatsApp"}</span>
      </button>
    </div>
  );
};
