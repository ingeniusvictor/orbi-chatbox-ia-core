import { BookOpen, Compass, Lightbulb, Sparkles } from "lucide-react";

const suggestions = [
  { icon: Compass, title: "Conocer ORBI", detail: "Qué representa el ecosistema", prompt: "¿Qué representa ORBI Ecosystem?" },
  { icon: BookOpen, title: "Explorar Academy", detail: "Aprendizaje y conocimiento", prompt: "¿Qué representa ORBI Academy?" },
  { icon: Sparkles, title: "Consultar servicios", detail: "Soluciones disponibles", prompt: "¿Qué servicios y soluciones ofrece ORBI?" },
  { icon: Lightbulb, title: "Resolver una idea", detail: "Conversemos sobre tu necesidad", prompt: "Quiero explorar una solución para mi proyecto." },
] as const;

export const LumiSuggestionGrid = ({ onSelect }: { onSelect: (prompt: string) => void }) => (
  <section className="border-t border-cyan-200/8 bg-slate-950/30 px-4 py-3"><p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-cyan-100/45">Sugerencias para ti</p><div className="grid grid-cols-2 gap-2 xl:grid-cols-4">{suggestions.map(({ icon: Icon, title, detail, prompt }) => <button key={title} type="button" onClick={() => onSelect(prompt)} className="lumi-suggestion-card group min-w-0 rounded-2xl border border-teal-200/10 bg-gradient-to-br from-cyan-300/[0.055] to-slate-950/30 p-3 text-left transition duration-200 hover:-translate-y-0.5 hover:border-emerald-300/25 hover:bg-emerald-300/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"><span className="mb-2 grid h-7 w-7 place-items-center rounded-xl bg-cyan-300/8 text-cyan-200 transition group-hover:bg-emerald-300/10 group-hover:text-emerald-200"><Icon className="h-3.5 w-3.5" /></span><b className="block text-[11px] leading-4 text-slate-100">{title}</b><small className="mt-0.5 block text-[9px] leading-4 text-slate-500">{detail}</small></button>)}</div></section>
);
