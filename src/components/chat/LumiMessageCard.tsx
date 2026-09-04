import { Sparkles } from "lucide-react";
import type { FC } from "react";
import type { RuntimeChatMessage } from "../../services/chatRuntimeState";
import { LumiVisualIdentity } from "./LumiVisualIdentity";
import { VoiceWaveformPlayer } from "./VoiceWaveformPlayer";

type Props = { message: RuntimeChatMessage; hasAudio: boolean; playing: boolean; progress: number; duration: string; onTogglePlayback: () => void; onReplay: () => void };

export const LumiMessageCard: FC<Props> = ({ message, hasAudio, playing, progress, duration, onTogglePlayback, onReplay }) => (
  <article className={`group lumi-message-card flex max-w-[92%] items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 sm:max-w-[80%] ${playing ? "lumi-speaking" : ""}`}>
    <div className="mt-1 shrink-0"><LumiVisualIdentity compact ready /></div>
    <div className={`min-w-0 flex-1 rounded-[24px] rounded-tl-md border bg-gradient-to-br from-[rgba(8,35,48,0.96)] to-[rgba(3,15,30,0.96)] px-4 py-4 shadow-[inset_0_1px_rgba(207,250,254,0.04),0_18px_45px_rgba(0,8,18,0.28)] transition duration-200 sm:px-5 sm:py-[18px] ${playing ? "border-emerald-300/30 shadow-[0_0_36px_rgba(16,185,129,0.10)]" : "border-cyan-200/15"}`}>
      <header className="mb-2.5 flex items-center justify-between gap-4"><span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-300"><Sparkles className="h-3 w-3" />LUMI</span><time className="shrink-0 text-[10px] text-slate-500">{message.timestamp}</time></header>
      <p className="whitespace-pre-wrap text-[14px] leading-[1.7] text-slate-100 sm:text-[15px]">{message.text}</p>
      {message.backend?.grounded ? <span className="mt-3 inline-flex items-center gap-1 rounded-full border border-emerald-300/15 bg-emerald-400/8 px-2.5 py-1 text-[10px] font-medium text-emerald-200"><Sparkles className="h-3 w-3" />Con conocimiento ORBI</span> : null}
      {hasAudio ? <VoiceWaveformPlayer playing={playing} progress={progress} duration={duration} onToggle={onTogglePlayback} onReplay={onReplay} /> : null}
    </div>
  </article>
);
