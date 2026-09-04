import { X } from "lucide-react";
import type { ReactNode } from "react";

export const ChatDiagnosticsDrawer = ({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) => (
  <aside aria-label="Diagnósticos del Chat Studio" className={`absolute inset-x-0 top-0 z-20 mx-auto w-full max-w-md transition-all duration-300 lg:inset-x-auto lg:right-0 lg:w-[360px] ${open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0"}`}>
    <div className="max-h-[720px] overflow-y-auto rounded-3xl border border-cyan-300/20 bg-slate-950/95 p-4 shadow-[0_28px_80px_rgba(2,6,23,0.7)] backdrop-blur-xl"><div className="mb-4 flex items-center justify-between"><div><h3 className="text-sm font-bold text-slate-100">Diagnostics</h3><p className="text-[10px] text-slate-500">Sandbox y datos de desarrollo</p></div><button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white" aria-label="Cerrar diagnósticos"><X className="h-4 w-4" /></button></div>{children}</div>
  </aside>
);
