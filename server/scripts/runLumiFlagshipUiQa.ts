import { readFileSync } from "node:fs";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

try {
  const workspace = read("../../src/components/workspaces/ChatStudioWorkspace.tsx");
  const header = read("../../src/components/chat/LumiRuntimeStatus.tsx");
  const lumiMessage = read("../../src/components/chat/LumiMessageCard.tsx");
  const userMessage = read("../../src/components/chat/UserMessageCard.tsx");
  const player = read("../../src/components/chat/VoiceWaveformPlayer.tsx");
  const composer = read("../../src/components/chat/LumiVoiceComposer.tsx");
  const welcome = read("../../src/components/chat/LumiWelcomeState.tsx");
  const suggestions = read("../../src/components/chat/LumiSuggestionGrid.tsx");
  const identity = read("../../src/components/chat/LumiVisualIdentity.tsx");
  const css = read("../../src/index.css");
  assert(workspace.includes("LumiRuntimeStatus") && header.includes("Qwen Local") && header.includes("Voz: Dora") && header.includes("LUMI"), "Truthful premium runtime header is required.");
  assert(workspace.includes("LumiMessageCard") && workspace.includes("UserMessageCard") && lumiMessage.includes("Con conocimiento ORBI") && userMessage.includes("Mensaje por voz"), "Flagship message hierarchy is required.");
  assert(player.includes("progress") && player.includes("RotateCcw") && player.includes("lumi-wave-bar"), "Waveform progress and replay controls are required.");
  for (const state of ["listening", "capturing", "transcribing", "thinking", "synthesizing", "speaking", "error"]) assert(composer.includes(state), `Missing voice state ${state}.`);
  assert(workspace.includes("LumiWelcomeState") && welcome.includes("lumi-avatar") === false && welcome.includes("LumiVisualIdentity"), "Official LUMI welcome identity is required.");
  assert(suggestions.includes("grid-cols-2") && suggestions.includes("xl:grid-cols-4"), "Responsive suggestion cards are required.");
  assert(identity.includes("contextual") && welcome.includes("contextual"), "Welcome identity must stay contextual rather than duplicate the rail treatment.");
  assert(player.includes("lumi-waveform-track") && player.includes("title=") && composer.includes("aria-live") && composer.includes("data-voice-state"), "Polished replay and voice-state controls are required.");
  assert(workspace.includes("timelineRef") && workspace.includes("scrollTo({ top: 0"), "Welcome and conversation scrolling must remain stable.");
  assert(css.includes("prefers-reduced-motion") && css.includes("lumi-speaking-halo") && css.includes("lumi-wave") && css.includes("lumi-suggestion-card"), "Reduced-motion-aware microinteractions are required.");
  assert(!workspace.includes("localStorage") && !player.includes("localStorage") && !composer.includes("attachment"), "No persistence or unsupported controls may be added.");
  console.info("LUMI Flagship UI QA: PASS");
} catch (error) { console.error(error); process.exit(1); }
