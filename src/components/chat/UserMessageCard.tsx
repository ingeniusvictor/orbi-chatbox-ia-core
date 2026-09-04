import { Mic, User } from "lucide-react";
import type { FC } from "react";
import type { RuntimeChatMessage } from "../../services/chatRuntimeState";

export const UserMessageCard: FC<{ message: RuntimeChatMessage }> = ({ message }) => (
  <article className="lumi-user-message ml-auto flex max-w-[88%] items-start justify-end gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 sm:max-w-[68%]">
    <div className="rounded-[22px] rounded-tr-md border border-cyan-200/15 bg-gradient-to-br from-cyan-700/80 to-blue-950/90 px-4 py-3.5 shadow-[inset_0_1px_rgba(207,250,254,0.06),0_16px_34px_rgba(1,10,25,0.3)]"><p className="whitespace-pre-wrap text-[14px] leading-[1.65] text-cyan-50 sm:text-[15px]">{message.text}</p><footer className="mt-2.5 flex flex-wrap items-center justify-end gap-2 text-[10px] text-cyan-100/60">{message.voiceOrigin === "voice" ? <span className="flex items-center gap-1 rounded-full bg-cyan-100/8 px-2 py-0.5 text-cyan-100/80"><Mic className="h-3 w-3" />Mensaje por voz</span> : null}<time>{message.timestamp}</time></footer></div>
    <span className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-cyan-300/25 bg-cyan-400/10 text-cyan-200"><User className="h-4 w-4" /></span>
  </article>
);
