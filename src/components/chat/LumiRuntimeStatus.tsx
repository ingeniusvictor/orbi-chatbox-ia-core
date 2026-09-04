import { AudioLines, Cpu, Sparkles } from "lucide-react";
import type { LumiRuntimeState } from "../../types/lumiRuntimeState";

const statusCards = [
  { key: "llm", icon: Cpu, title: "Qwen Local" },
  { key: "voice", icon: AudioLines, title: "Voz: Dora" },
] as const;

export const LumiRuntimeStatus = ({ runtimeState, backendMode }: { runtimeState: LumiRuntimeState; backendMode: boolean }) => (
  <div className="flex flex-wrap items-center justify-end gap-2" aria-label="Estado local de LUMI">
    {statusCards.map(({ key, icon: Icon, title }) => <div key={key} className="lumi-status-card hidden min-w-[116px] items-center gap-2 rounded-2xl border border-teal-200/10 px-3 py-2 sm:flex"><span className="grid h-7 w-7 place-items-center rounded-xl bg-emerald-400/10 text-emerald-300"><Icon className="h-3.5 w-3.5" /></span><span><b className="block text-[11px] font-semibold text-slate-100">{title}</b><small className="block text-[8px] font-semibold uppercase tracking-[0.12em] text-emerald-300/80">{key === "llm" ? (backendMode ? "LLM activo" : "Sandbox listo") : "Kokoro local"}</small></span></div>)}
    <div className="lumi-status-card flex min-w-[108px] items-center gap-2 rounded-2xl border border-teal-200/10 px-3 py-2"><span className={`grid h-7 w-7 place-items-center rounded-xl ${runtimeState === "ready" ? "bg-cyan-400/10 text-cyan-200" : "bg-amber-400/10 text-amber-200"}`}><Sparkles className="h-3.5 w-3.5" /></span><span><b className="block text-[11px] font-semibold text-slate-100">LUMI</b><small className={`block text-[8px] font-semibold uppercase tracking-[0.12em] ${runtimeState === "ready" ? "text-cyan-200/80" : "text-amber-200"}`}>{runtimeState === "ready" ? "Lista" : "Procesando"}</small></span></div>
  </div>
);
