import React, { useEffect, useRef, useState } from "react";
import { WhatsAppFloatingWidget } from "./WhatsAppFloatingWidget";

export type UnifiedFloatingLauncherProps = {
  brandName?: string;
  mode?: "demo" | "sandbox" | "preview";
  enabled?: boolean;
  channels?: {
    webChat?: boolean;
    whatsapp?: boolean;
    voice?: boolean;
  };
  whatsapp?: {
    phoneNumber?: string;
    defaultMessage?: string;
  };
  onOpenWebChat?: () => void;
  placement?: "fixed" | "inline-preview";
};

export const UnifiedFloatingLauncher: React.FC<UnifiedFloatingLauncherProps> = ({
  brandName = "ORBI",
  mode = "sandbox",
  enabled = true,
  channels = { webChat: true, whatsapp: true, voice: false },
  whatsapp,
  onOpenWebChat,
  placement = "fixed",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatReady, setChatReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInlinePreview = placement === "inline-preview";
  const whatsappConfig = whatsapp ?? {};

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

  const handleOpenChat = () => {
    onOpenWebChat?.();
    setChatReady(true);
  };

  return (
    <div
      ref={containerRef}
      className={isInlinePreview ? "relative w-full" : "fixed bottom-6 right-6 z-40"}
    >
      {isOpen && (
        <section
          className={`mb-3 w-80 rounded-2xl border border-cyan-400/30 bg-slate-950 p-4 shadow-2xl ${
            isInlinePreview ? "" : "max-w-[calc(100vw-3rem)]"
          }`}
          aria-label="Panel de canales ORBI"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-white">{brandName} Contacto</p>
              <p className="mt-1 text-xs text-slate-400">Elige un canal disponible para este sandbox.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md px-2 py-1 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
              aria-label="Cerrar launcher de canales"
            >
              ×
            </button>
          </div>

          <p className="mt-3 rounded-lg border border-cyan-400/20 bg-cyan-400/5 px-3 py-2 text-[11px] font-medium text-cyan-200">
            Modo {mode} — sin producción
          </p>

          <div className="mt-3 space-y-2">
            {channels.webChat && (
              <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-3">
                <p className="text-xs font-bold text-white">Chat IA Web</p>
                <p className="mt-1 text-[11px] text-slate-400">Canal listo en sandbox; no inicia automatizaciones.</p>
                <button
                  type="button"
                  onClick={handleOpenChat}
                  className="mt-2 w-full rounded-lg bg-cyan-500 px-3 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400"
                >
                  Abrir Chat IA
                </button>
                {chatReady && (
                  <p className="mt-2 text-[11px] font-medium text-cyan-200">Chat IA listo en sandbox.</p>
                )}
              </div>
            )}

            {channels.whatsapp && (
              <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-3">
                <p className="text-xs font-bold text-white">WhatsApp manual</p>
                <p className="mt-1 text-[11px] text-slate-400">Canal manual, sin bot ni automatización.</p>
                <div className="mt-2">
                  <WhatsAppFloatingWidget
                    phoneNumber={whatsappConfig.phoneNumber}
                    defaultMessage={whatsappConfig.defaultMessage}
                    brandName={brandName}
                    mode={mode}
                    enabled={true}
                    realAutomationAllowed={false}
                    placement="inline-preview"
                  />
                </div>
              </div>
            )}

            {channels.voice && (
              <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-3">
                <p className="text-xs font-bold text-white">Voz</p>
                <p className="mt-1 text-[11px] text-slate-400">Voz próximamente. Canal no disponible en este sandbox.</p>
              </div>
            )}
          </div>

          <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
            Suite instalable en preparación. No usa datos reales ni automatizaciones productivas.
          </p>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-400 px-4 py-3 text-xs font-bold text-slate-950 shadow-lg transition hover:bg-cyan-300 ${
          isInlinePreview ? "w-full justify-center rounded-xl" : ""
        }`}
        aria-label="Abrir launcher de canales ORBI"
        aria-expanded={isOpen}
      >
        <span className="grid h-4 w-4 grid-cols-2 gap-0.5" aria-hidden="true">
          <span className="rounded-sm bg-slate-950" />
          <span className="rounded-sm bg-slate-950" />
          <span className="rounded-sm bg-slate-950" />
          <span className="rounded-sm bg-slate-950" />
        </span>
        <span>{isInlinePreview ? "Abrir launcher unificado" : "ORBI"}</span>
      </button>
    </div>
  );
};
