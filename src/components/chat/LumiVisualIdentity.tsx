import lumiAvatar from "../../assets/lumi/lumi-avatar.png";

type Props = { compact?: boolean; ready: boolean; contextual?: boolean };

export const LumiVisualIdentity = ({ compact = false, ready, contextual = false }: Props) => (
  <div className={`flex flex-col items-center ${compact ? "gap-0" : contextual ? "lumi-identity-contextual gap-2" : "gap-3"}`}>
    <div className={`lumi-avatar-orb relative grid shrink-0 place-items-center rounded-full ${compact ? "h-11 w-11" : contextual ? "h-24 w-24 sm:h-28 sm:w-28" : "h-36 w-36"}`}>
      <span className="absolute inset-[4%] rounded-full border border-cyan-200/25" />
      <span className={`absolute inset-[-5%] rounded-full border ${ready ? "border-emerald-300/45" : "border-cyan-300/30"}`} />
      <img src={lumiAvatar} alt="LUMI, asistente inteligente de ORBI" className={`relative z-10 object-contain drop-shadow-[0_14px_20px_rgba(16,185,129,0.22)] ${compact ? "h-10 w-10" : contextual ? "h-[88%] w-[88%]" : "h-32 w-32"}`} />
      <span className={`absolute bottom-[2%] right-[8%] z-20 h-3.5 w-3.5 rounded-full border-2 border-slate-950 ${ready ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" : "bg-amber-300 animate-pulse"}`} />
    </div>
    {!compact && !contextual && <div className="text-center"><strong className="font-display text-3xl tracking-[0.12em] text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-teal-400">LUMI</strong><p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-100/65">ORBI Intelligent Companion</p><span className={`mt-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-semibold tracking-[0.1em] ${ready ? "border-emerald-300/25 bg-emerald-400/10 text-emerald-200" : "border-amber-300/25 bg-amber-400/10 text-amber-100"}`}><i className={`h-1.5 w-1.5 rounded-full ${ready ? "bg-emerald-300" : "bg-amber-300 animate-pulse"}`} />{ready ? "EN LÍNEA" : "PROCESANDO"}</span></div>}
  </div>
);
