import { BookOpen, Compass, Sparkles, Waves } from "lucide-react";
import { LumiVisualIdentity } from "./LumiVisualIdentity";

export const LumiWelcomeState = () => (
  <section className="lumi-welcome-state mx-auto flex max-w-xl flex-col items-center px-5 py-10 text-center animate-in fade-in zoom-in-95 duration-500 sm:py-12">
    <LumiVisualIdentity ready contextual />
    <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-300/80">ORBI Intelligent Companion</p>
    <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-slate-50 sm:text-[28px]">Hola, soy <span className="text-emerald-300">LUMI</span></h3>
    <p className="mt-2 text-sm text-cyan-100/65">Tu asistente inteligente dentro de ORBI</p>
    <p className="mt-4 max-w-md text-sm leading-6 text-slate-400">Conversemos por texto o voz para explorar ORBI, su conocimiento y las soluciones disponibles en este entorno local.</p>
    <div className="mt-6 flex flex-wrap justify-center gap-2 text-[10px] text-slate-300"><span className="flex items-center gap-1 rounded-full border border-cyan-200/10 bg-cyan-300/5 px-2.5 py-1"><Compass className="h-3 w-3 text-cyan-300" />Explorar ORBI</span><span className="flex items-center gap-1 rounded-full border border-emerald-200/10 bg-emerald-300/5 px-2.5 py-1"><BookOpen className="h-3 w-3 text-emerald-300" />Conocimiento local</span><span className="flex items-center gap-1 rounded-full border border-violet-200/10 bg-violet-300/5 px-2.5 py-1"><Waves className="h-3 w-3 text-violet-300" />Conversación por voz</span><span className="flex items-center gap-1 rounded-full border border-teal-200/10 bg-teal-300/5 px-2.5 py-1"><Sparkles className="h-3 w-3 text-teal-300" />Asistencia contextual</span></div>
  </section>
);
