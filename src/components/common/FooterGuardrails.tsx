import React from "react";
import { Shield, Lock, CheckCircle2, AlertTriangle } from "lucide-react";
import { ORBI_CHATBOX_APP_VERSION } from "../../data";

export const FooterGuardrails: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-800/80 bg-slate-950/60 py-8 px-4 text-center">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Producción Externa:</span>
            <span className="text-rose-400 font-semibold">Bloqueada (Offline/Sandbox)</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Multi-Tenant RBAC:</span>
            <span className="text-cyan-400 font-semibold">Blueprint 0K-12 Validado</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Persistencia:</span>
            <span className="text-emerald-400 font-semibold">Local Storage + In-Memory State</span>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-slate-500 max-w-2xl mx-auto leading-relaxed">
          ORBI ChatBox IA Core (v{ORBI_CHATBOX_APP_VERSION}) opera de forma segura sin endpoints reales,
          sin APIs externas no autorizadas y con estricta gobernanza de datos para demostraciones ejecutivas y prototipado controlado.
        </p>

        <p className="text-[11px] text-slate-600 font-mono">
          &copy; 2026 ORBI ChatBox IA Core &bull; Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};
