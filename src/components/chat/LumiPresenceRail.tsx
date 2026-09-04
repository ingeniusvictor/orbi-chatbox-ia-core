import { AudioLines, CircleDot, MessageSquare, Mic } from "lucide-react";
import type { LumiRuntimeState } from "../../types/lumiRuntimeState";
import type { VoiceRuntimeState } from "../../types/voiceRuntimeState";
import { LumiVisualIdentity } from "./LumiVisualIdentity";

type Props = { assistantName: string; runtimeState: LumiRuntimeState; voiceState: VoiceRuntimeState; responseMode: "demo" | "backend"; collapsed: boolean; onToggle: () => void };
const voiceLabel: Record<VoiceRuntimeState, string> = { idle: "Voz lista", listening: "Escuchando", capturing: "Grabando", transcribing: "Transcribiendo", thinking: "Pensando", synthesizing: "Preparando voz", speaking: "Hablando", error: "Revisar voz" };

export const LumiPresenceRail = ({ assistantName, runtimeState, voiceState, responseMode, collapsed, onToggle }: Props) => (
  <aside className={`lumi-surface-glass lumi-presence-rail hidden shrink-0 overflow-hidden rounded-[30px] border p-3 transition-all duration-300 lg:flex lg:flex-col ${collapsed ? "w-[72px]" : "w-[238px]"}`}>
    <button type="button" onClick={onToggle} className={`group rounded-2xl text-left transition hover:bg-cyan-400/5 ${collapsed ? "p-0" : "px-2 pb-3 pt-5"}`} aria-label="Alternar panel de presencia de LUMI" title={assistantName}>
      <LumiVisualIdentity compact={collapsed} ready={runtimeState === "ready"} />
    </button>
    {!collapsed && <>
      <nav className="mt-5 space-y-2 border-t border-teal-200/10 pt-5 text-xs"><p className="px-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-cyan-100/45">Interacción</p><span className="flex items-center gap-2 rounded-xl border border-cyan-300/15 bg-cyan-400/10 px-3 py-2.5 font-medium text-cyan-100 shadow-[inset_0_1px_rgba(207,250,254,0.04)]"><MessageSquare className="h-3.5 w-3.5" />Chat inteligente</span><span className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 ${voiceState === "idle" ? "border-transparent text-slate-400" : "border-emerald-300/15 bg-emerald-400/10 text-emerald-100"}`}><Mic className="h-3.5 w-3.5" />{voiceLabel[voiceState]}</span></nav>
      <div className="mt-auto space-y-2 rounded-2xl border border-teal-200/10 bg-slate-950/35 p-3 text-[10px] text-slate-400"><p className="flex items-center gap-1.5 text-slate-200"><AudioLines className="h-3.5 w-3.5 text-emerald-300" />Voz local · Dora</p><p className="flex items-center gap-1.5"><CircleDot className="h-3 w-3 text-cyan-300" />{responseMode === "backend" ? "Conexión sandbox local" : "Modo demo local"}</p></div>
    </>}
  </aside>
);
