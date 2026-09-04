import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Sparkles,
  User,
  Trash2,
  Copy,
  Check,
  PhoneCall,
  Mail,
  Building2,
  Clock,
  ShieldCheck,
  Settings2,
} from "lucide-react";
import { LumiPresenceRail } from "../chat/LumiPresenceRail";
import { ChatDiagnosticsDrawer } from "../chat/ChatDiagnosticsDrawer";
import { LumiRuntimeStatus } from "../chat/LumiRuntimeStatus";
import { LumiMessageCard } from "../chat/LumiMessageCard";
import { UserMessageCard } from "../chat/UserMessageCard";
import { LumiWelcomeState } from "../chat/LumiWelcomeState";
import { LumiSuggestionGrid } from "../chat/LumiSuggestionGrid";
import { LumiVoiceComposer } from "../chat/LumiVoiceComposer";
import { LumiVisualIdentity } from "../chat/LumiVisualIdentity";
import {
  CompanyProfile,
  LeadRecord,
  Message,
  LeadAnalysis,
  ContactExtraction,
  EMPTY_ANALYSIS,
  analyzeCustomerMessage,
  generateAssistantReply,
  buildLeadRecord,
  buildHumanHandoffText,
  PRIORITY_LABELS,
  CUSTOMER_TYPE_LABELS,
  extractEmail,
  extractPhone,
  extractCompany,
  extractName,
} from "../../data";
import {
  DEFAULT_PUBLIC_KEY,
  DEFAULT_RECEIVER_URL,
  sendMessageToBackendReceiver,
} from "../../services/backendReceiverClient";
import { synthesizeVoiceText, transcribeVoiceAudio } from "../../services/voiceReceiverClient";
import { appendRuntimeMessage, createBackendAssistantMessage, isSendableChatMessage, type RuntimeChatMessage } from "../../services/chatRuntimeState";
import { classifyLumiRuntimeState, getLumiRuntimeStateMessage } from "../../services/lumiRuntimeState";
import type { LumiRuntimeState } from "../../types";
import type { VoiceRuntimeState } from "../../types";

interface ChatStudioWorkspaceProps {
  companyProfile: CompanyProfile;
  leads: LeadRecord[];
  onAddLead: (lead: LeadRecord) => void;
}

const DEFAULT_WELCOME_MESSAGE: Message = {
  id: "msg-welcome",
  sender: "bot",
  text: "Hola, soy LUMI. Estoy lista para explorar ideas, resolver dudas y convertir tu próxima conversación en una acción clara para ORBI.",
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

type ResponseMode = "demo" | "backend";
type VoiceInputOption = { deviceId: string; label: string };
type VoiceCaptureDiagnostics = {
  trackLabel: string;
  trackEnabled: boolean;
  trackMuted: boolean;
  trackReadyState: MediaStreamTrackState;
  recorderMimeType: string;
  blobSize: number;
  recordingDurationMs: number;
  inputSignal: "active" | "silent";
  peakInputLevel: number;
};
type AssistantVoiceMetadata = { durationSeconds?: number };

const formatAudioDuration = (durationSeconds?: number): string => {
  if (!durationSeconds || !Number.isFinite(durationSeconds)) return "Audio local";
  const totalSeconds = Math.max(0, Math.round(durationSeconds));
  return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, "0")}`;
};

export const ChatStudioWorkspace: React.FC<ChatStudioWorkspaceProps> = ({
  companyProfile,
  leads,
  onAddLead,
}) => {
  const [messages, setMessages] = useState<RuntimeChatMessage[]>([DEFAULT_WELCOME_MESSAGE]);
  const [inputText, setInputText] = useState("");
  const [currentAnalysis, setCurrentAnalysis] = useState<LeadAnalysis>(EMPTY_ANALYSIS);
  const [currentContact, setCurrentContact] = useState<ContactExtraction>({});
  const [isTyping, setIsTyping] = useState(false);
  const [copiedHandoff, setCopiedHandoff] = useState(false);
  const [responseMode, setResponseMode] = useState<ResponseMode>("demo");
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [runtimeState, setRuntimeState] = useState<LumiRuntimeState>("ready");
  const [lastFailedMessage, setLastFailedMessage] = useState<string | undefined>();
  const [voiceState, setVoiceState] = useState<VoiceRuntimeState>("idle");
  const [voiceError, setVoiceError] = useState<string | undefined>();
  const [voiceInputs, setVoiceInputs] = useState<VoiceInputOption[]>([]);
  const [selectedVoiceInputId, setSelectedVoiceInputId] = useState("");
  const [voiceDiagnostics, setVoiceDiagnostics] = useState<VoiceCaptureDiagnostics | undefined>();
  const [voicePlaybackReady, setVoicePlaybackReady] = useState(false);
  const [assistantVoiceMetadata, setAssistantVoiceMetadata] = useState<Record<string, AssistantVoiceMetadata>>({});
  const [activeAssistantVoiceId, setActiveAssistantVoiceId] = useState<string | undefined>();
  const [activeAssistantVoiceProgress, setActiveAssistantVoiceProgress] = useState(0);
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [presenceRailCollapsed, setPresenceRailCollapsed] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const voiceChunksRef = useRef<Blob[]>([]);
  const voiceRecordingStartedAtRef = useRef<number | null>(null);
  const voiceInputPeakRef = useRef(0);
  const voiceInputFrameRef = useRef<number | null>(null);
  const voiceInputContextRef = useRef<AudioContext | null>(null);
  const pendingVoiceAudioRef = useRef<Blob | null>(null);
  const assistantVoiceAudioRef = useRef(new Map<string, Blob>());

  useEffect(() => {
    const hasConversation = messages.some((message) => message.id !== "msg-welcome");
    if (hasConversation || isTyping) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    else timelineRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [messages, isTyping]);

  const stopVoicePlayback = () => {
    const audio = audioRef.current;
    if (audio) { audio.onended = null; audio.onerror = null; audio.onloadedmetadata = null; audio.ontimeupdate = null; audio.pause(); audio.src = ""; audioRef.current = null; }
    if (audioUrlRef.current) { URL.revokeObjectURL(audioUrlRef.current); audioUrlRef.current = null; }
    setActiveAssistantVoiceId(undefined);
    setActiveAssistantVoiceProgress(0);
  };

  const stopVoiceSignalMonitor = () => {
    if (voiceInputFrameRef.current !== null) { cancelAnimationFrame(voiceInputFrameRef.current); voiceInputFrameRef.current = null; }
    const context = voiceInputContextRef.current;
    voiceInputContextRef.current = null;
    if (context && context.state !== "closed") void context.close();
  };

  const offerManualVoicePlayback = (voiceAudio: Blob, reason: string) => {
    stopVoicePlayback();
    pendingVoiceAudioRef.current = voiceAudio;
    setVoicePlaybackReady(true);
    setVoiceError(reason);
    setVoiceState("idle");
  };

  const playVoiceAudio = (voiceAudio: Blob, automatic = true, messageId?: string) => {
    stopVoicePlayback();
    setVoicePlaybackReady(false);
    try {
      const url = URL.createObjectURL(voiceAudio);
      const audio = new Audio(url);
      audioUrlRef.current = url;
      audioRef.current = audio;
      audio.onloadedmetadata = () => {
        if (messageId && Number.isFinite(audio.duration)) {
          setAssistantVoiceMetadata((current) => ({ ...current, [messageId]: { durationSeconds: audio.duration } }));
        }
      };
      audio.ontimeupdate = () => {
        const progress = audio.duration > 0 ? Math.min(100, (audio.currentTime / audio.duration) * 100) : 0;
        setActiveAssistantVoiceProgress(progress);
      };
      audio.onended = () => { stopVoicePlayback(); setVoiceState("idle"); };
      audio.onerror = () => {
        if (automatic) offerManualVoicePlayback(voiceAudio, "Respuesta de LUMI lista. Pulsa Reproducir voz.");
        else { stopVoicePlayback(); setVoiceError("No se pudo reproducir el audio de LUMI en este navegador."); setVoiceState("error"); }
      };
      if (messageId) setActiveAssistantVoiceId(messageId);
      setVoiceState("speaking");
      void audio.play().catch((error: unknown) => {
        const name = error instanceof DOMException ? error.name : "PlaybackError";
        console.info("ORBI local voice playback diagnostic", { name, automatic });
        if (automatic) offerManualVoicePlayback(voiceAudio, "Respuesta de LUMI lista. Pulsa Reproducir voz.");
        else { stopVoicePlayback(); setVoiceError("No se pudo reproducir el audio de LUMI en este navegador."); setVoiceState("error"); }
      });
    } catch { setVoiceError("No se pudo preparar el audio de LUMI."); setVoiceState("error"); }
  };

  const playPendingVoiceAudio = () => {
    const pending = pendingVoiceAudioRef.current;
    if (!pending) return;
    pendingVoiceAudioRef.current = null;
    setVoiceError(undefined);
    playVoiceAudio(pending, false);
  };

  const playAssistantVoice = (messageId: string) => {
    const audio = assistantVoiceAudioRef.current.get(messageId);
    if (!audio) {
      setVoiceError("El audio de esta respuesta ya no está disponible en esta sesión.");
      return;
    }
    setVoiceError(undefined);
    if (activeAssistantVoiceId === messageId) {
      stopVoicePlayback();
      setVoiceState("idle");
      return;
    }
    playVoiceAudio(audio, false, messageId);
  };

  const replayAssistantVoice = (messageId: string) => {
    const audio = assistantVoiceAudioRef.current.get(messageId);
    if (!audio) { setVoiceError("El audio de esta respuesta ya no está disponible en esta sesión."); return; }
    setVoiceError(undefined);
    playVoiceAudio(audio, false, messageId);
  };

  const clearAssistantVoiceAudio = () => {
    assistantVoiceAudioRef.current.clear();
    pendingVoiceAudioRef.current = null;
    setAssistantVoiceMetadata({});
    setVoicePlaybackReady(false);
  };

  useEffect(() => () => {
    mediaRecorderRef.current?.stop();
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    stopVoiceSignalMonitor();
    stopVoicePlayback();
    assistantVoiceAudioRef.current.clear();
  }, []);

  const handleSendMessage = async (textToSend?: string, retry = false, voiceTurn = false) => {
    const text = (textToSend || inputText).trim();
    if (!isSendableChatMessage(text) || isTyping) return;
    setLastFailedMessage(undefined);

    const userMsg: RuntimeChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      voiceOrigin: voiceTurn ? "voice" : undefined,
    };

    const newMessages = retry ? messages : appendRuntimeMessage(messages, userMsg);
    if (!retry) setMessages(newMessages);
    if (!textToSend) setInputText("");

    if (responseMode === "backend") {
      setIsTyping(true);
      setRuntimeState("processing");
      if (voiceTurn) setVoiceState("thinking");
      const result = await sendMessageToBackendReceiver({
        message: text,
        channel: "web_demo",
        visitorId: "local-sandbox-visitor",
        pageUrl: "http://localhost:3000",
        conversationId,
      });
      if (result.ok === true) {
        setConversationId(result.body.conversationId);
        setRuntimeState("ready");
        const sandboxAnalysis: LeadAnalysis = {
          ...EMPTY_ANALYSIS,
          mainNeed: "Validación del backend sandbox local.",
          aiSummary: "Lead sandbox generado tras validación del backend local.",
          recommendedAction: "Solo demo local: no realizar seguimiento real.",
        };
        const sandboxLead = buildLeadRecord({
          sourceMessage: text,
          conversation: newMessages,
          analysis: sandboxAnalysis,
          channel: "web_demo",
        });
        onAddLead({
          ...sandboxLead,
          name: "Lead sandbox local",
          detectedService: "Validación backend local",
          rawMessage: text,
          sandbox: {
            source: "backend_sandbox",
            status: "sandbox_validated",
            realData: false,
            backendStatus: 200,
            note: "Lead sandbox generado tras validación del backend local. No corresponde a un cliente real.",
          },
        });
      }
      if (result.ok === true) {
        const assistantMessageId = `msg-backend-${Date.now()}`;
        setMessages((prev) => appendRuntimeMessage(prev, createBackendAssistantMessage(assistantMessageId, new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), result.body)));
        if (voiceTurn) {
          setVoiceState("synthesizing");
          const synthesis = await synthesizeVoiceText(result.body.message);
          if (synthesis.ok) {
            assistantVoiceAudioRef.current.set(assistantMessageId, synthesis.audio);
            setAssistantVoiceMetadata((current) => ({ ...current, [assistantMessageId]: {} }));
            playVoiceAudio(synthesis.audio, true, assistantMessageId);
          }
          else { setVoiceError("LUMI respondió en texto, pero no se pudo generar su audio."); setVoiceState("error"); }
        }
      }
      else {
        setRuntimeState(classifyLumiRuntimeState(result)); setLastFailedMessage(text);
        if (voiceTurn) { setVoiceError("La transcripción se mostró, pero LUMI no pudo responder por voz."); setVoiceState("error"); }
      }
      setIsTyping(false);
      return;
    }

    // Analyze lead with smart rule engine
    const analysis = analyzeCustomerMessage(text, companyProfile);
    const contact: ContactExtraction = {
      customerName: extractName(text),
      customerEmail: extractEmail(text),
      customerPhone: extractPhone(text),
      customerCompany: extractCompany(text),
    };

    setCurrentAnalysis(analysis);
    setCurrentContact(contact);

    // If contact data detected or valid query, create/save lead record
    if (analysis.serviceInterest || contact.customerEmail || contact.customerPhone || contact.customerName) {
      const newLead = buildLeadRecord({
        sourceMessage: text,
        conversation: newMessages,
        analysis,
        channel: "web_demo",
        contactData: contact,
      });
      onAddLead(newLead);
    }

    // Simulate Bot response with knowledge & context
    setIsTyping(true);
    setRuntimeState("processing");
    setTimeout(() => {
      const botReplyText = generateAssistantReply(analysis, companyProfile);
      const botMsg: Message = {
        id: `msg-bot-${Date.now()}`,
        sender: "bot",
        text: botReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      setRuntimeState("ready");
    }, 600);
  };

  const stopVoiceCapture = () => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") { setVoiceState("capturing"); recorder.stop(); }
  };

  const startVoiceTurn = async () => {
    if (isTyping) return;
    if (responseMode !== "backend") { setVoiceError("Selecciona Backend sandbox para usar voz local."); setVoiceState("error"); return; }
    stopVoicePlayback();
    setVoiceError(undefined);
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") { setVoiceError("Este navegador no admite captura de micrófono."); setVoiceState("error"); return; }
    setVoiceState("listening");
    try {
      const audioConstraints: MediaTrackConstraints = {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        channelCount: 1,
      };
      if (selectedVoiceInputId) audioConstraints.deviceId = { exact: selectedVoiceInputId };
      const stream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints });
      mediaStreamRef.current = stream;
      const track = stream.getAudioTracks()[0];
      const devices = (await navigator.mediaDevices.enumerateDevices())
        .filter((device) => device.kind === "audioinput")
        .map((device, index) => ({ deviceId: device.deviceId, label: device.label || `Entrada de audio ${index + 1}` }));
      setVoiceInputs(devices);
      if (!selectedVoiceInputId && track?.getSettings().deviceId) setSelectedVoiceInputId(track.getSettings().deviceId);
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      voiceChunksRef.current = [];
      voiceRecordingStartedAtRef.current = Date.now();
      voiceInputPeakRef.current = 0;
      stopVoiceSignalMonitor();
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      voiceInputContextRef.current = audioContext;
      const samples = new Uint8Array(analyser.fftSize);
      const measureInput = () => {
        analyser.getByteTimeDomainData(samples);
        let squared = 0;
        for (const sample of samples) { const normalized = (sample - 128) / 128; squared += normalized * normalized; }
        voiceInputPeakRef.current = Math.max(voiceInputPeakRef.current, Math.sqrt(squared / samples.length));
        voiceInputFrameRef.current = requestAnimationFrame(measureInput);
      };
      void audioContext.resume().then(measureInput).catch(() => { setVoiceError("No se pudo verificar la señal del micrófono."); });
      const stopForUnavailableInput = (message: string) => {
        setVoiceError(message);
        setVoiceState("error");
        if (recorder.state !== "inactive") recorder.stop();
      };
      if (track) {
        track.onmute = () => stopForUnavailableInput("El micrófono seleccionado no está entregando audio. Revisa que no esté silenciado en Windows o en el dispositivo.");
        track.onunmute = () => { setVoiceError(undefined); };
        track.onended = () => stopForUnavailableInput("El micrófono seleccionado dejó de estar disponible.");
      }
      recorder.ondataavailable = (event) => { if (event.data.size > 0) voiceChunksRef.current.push(event.data); };
      recorder.onerror = () => { setVoiceError("No se pudo capturar el audio del micrófono."); setVoiceState("error"); };
      recorder.onstop = () => {
        const trackSnapshot = {
          trackLabel: track?.label || "Sin etiqueta",
          trackEnabled: track?.enabled ?? false,
          trackMuted: track?.muted ?? false,
          trackReadyState: track?.readyState ?? "ended" as MediaStreamTrackState,
        };
        stopVoiceSignalMonitor();
        if (track) { track.onmute = null; track.onunmute = null; track.onended = null; }
        stream.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null; mediaRecorderRef.current = null;
        void (async () => {
          const audio = new Blob(voiceChunksRef.current, { type: recorder.mimeType || "audio/webm" });
          const diagnostics: VoiceCaptureDiagnostics = {
            ...trackSnapshot,
            recorderMimeType: recorder.mimeType || "audio/webm",
            blobSize: audio.size,
            recordingDurationMs: Math.max(0, Date.now() - (voiceRecordingStartedAtRef.current ?? Date.now())),
            inputSignal: voiceInputPeakRef.current >= 0.01 ? "active" : "silent",
            peakInputLevel: Number(voiceInputPeakRef.current.toFixed(4)),
          };
          voiceRecordingStartedAtRef.current = null;
          setVoiceDiagnostics(diagnostics);
          console.info("ORBI local voice capture diagnostics", diagnostics);
          if (!diagnostics.trackEnabled || diagnostics.trackMuted || diagnostics.trackReadyState !== "live") { setVoiceError("El micrófono seleccionado no está entregando audio. Revisa que no esté silenciado en Windows o en el dispositivo."); setVoiceState("error"); return; }
          if (diagnostics.inputSignal !== "active") { setVoiceError("No se detectó señal de voz en el micrófono seleccionado. Revisa el nivel de entrada y vuelve a intentarlo."); setVoiceState("error"); return; }
          if (audio.size === 0 || audio.size > 5 * 1024 * 1024) { setVoiceError("La grabación debe pesar menos de 5 MiB."); setVoiceState("error"); return; }
          setVoiceState("transcribing");
          const transcription = await transcribeVoiceAudio(audio);
          if (!transcription.ok) { setVoiceError("No se pudo transcribir el audio local."); setVoiceState("error"); return; }
          setInputText(transcription.text);
          await handleSendMessage(transcription.text, false, true);
        })();
      };
      recorder.start();
      setVoiceState("capturing");
    } catch { setVoiceError("No se concedió acceso al micrófono. Puedes seguir escribiendo mensajes."); setVoiceState("error"); }
  };

  const handleClearChat = () => {
    setMessages([DEFAULT_WELCOME_MESSAGE]);
    setCurrentAnalysis(EMPTY_ANALYSIS);
    setCurrentContact({});
    setConversationId(undefined);
    setRuntimeState("ready");
    setLastFailedMessage(undefined);
    setVoiceError(undefined);
    setVoiceState("idle");
    stopVoicePlayback();
    clearAssistantVoiceAudio();
  };

  const handleCopyHandoff = async () => {
    const activeLead = buildLeadRecord({
      sourceMessage: messages.filter((m) => m.sender === "user").map((m) => m.text).join(" | "),
      conversation: messages,
      analysis: currentAnalysis,
      channel: "web_demo",
      contactData: currentContact,
    });
    const handoffText = buildHumanHandoffText(activeLead, companyProfile);
    try {
      await navigator.clipboard.writeText(handoffText);
      setCopiedHandoff(true);
      setTimeout(() => setCopiedHandoff(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="lumi-atmosphere -m-3 min-h-[760px] overflow-hidden rounded-[34px] border border-teal-200/10 p-4 sm:-m-4 sm:p-6 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="lumi-workspace-header flex flex-col justify-between gap-3 border-b border-cyan-500/15 pb-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 shadow-[0_0_28px_rgba(34,211,238,0.18)]"><MessageSquare className="w-4 h-4 text-cyan-300" /></span>
            <span>Chat Studio <span className="text-cyan-300">· LUMI</span></span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Conversación local con una presencia de voz diseñada para el ecosistema {companyProfile.companyName}.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto"><button type="button" onClick={() => setDiagnosticsOpen((open) => !open)} className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-100"><Settings2 className="h-3.5 w-3.5" />Diagnostics</button><button onClick={handleClearChat} className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-mono text-slate-400 transition hover:text-rose-400"><Trash2 className="h-3.5 w-3.5" /><span>Reiniciar</span></button></div>
      </div>

      {/* LUMI presence, dominant conversation, and on-demand development diagnostics. */}
      <div className="relative flex min-w-0 gap-4">
        <LumiPresenceRail assistantName={companyProfile.assistantName || "LUMI"} runtimeState={runtimeState} voiceState={voiceState} responseMode={responseMode} collapsed={presenceRailCollapsed} onToggle={() => setPresenceRailCollapsed((value) => !value)} />
        <div className="min-w-0 flex-1">
        {/* Chat Box Panel */}
          <div className="lumi-surface-raised flex h-[680px] flex-col overflow-hidden rounded-[30px] border">
          {/* Top Chat Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-300/10 bg-slate-950/45 px-4 py-3 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <LumiVisualIdentity compact ready={runtimeState === "ready"} />
              <div>
                <span className="block font-display text-base font-semibold tracking-tight text-slate-50">Chat Studio <span className="text-emerald-300">· LUMI</span></span>
                <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-cyan-100/55">ORBI Intelligent Companion</span>
              </div>
            </div>
            <LumiRuntimeStatus runtimeState={runtimeState} backendMode={responseMode === "backend"} />
          </div>

          {/* Messages Feed */}
          <div ref={timelineRef} className="lumi-timeline flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
            {messages.length === 1 && messages[0]?.id === "msg-welcome" ? <LumiWelcomeState /> : null}
            {messages.filter((message) => message.id !== "msg-welcome").map((message) => message.sender === "bot" ? <LumiMessageCard key={message.id} message={message} hasAudio={Boolean(assistantVoiceMetadata[message.id])} playing={activeAssistantVoiceId === message.id} progress={activeAssistantVoiceId === message.id ? activeAssistantVoiceProgress : 0} duration={formatAudioDuration(assistantVoiceMetadata[message.id]?.durationSeconds)} onTogglePlayback={() => playAssistantVoice(message.id)} onReplay={() => replayAssistantVoice(message.id)} /> : <UserMessageCard key={message.id} message={message} />)}

            {isTyping && (
              <div className="flex items-center gap-3 pl-14 text-xs text-cyan-100/65"><span className="flex gap-1"><i className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" /><i className="h-1.5 w-1.5 rounded-full bg-cyan-300 animate-pulse [animation-delay:120ms]" /><i className="h-1.5 w-1.5 rounded-full bg-teal-300 animate-pulse [animation-delay:240ms]" /></span><span>{getLumiRuntimeStateMessage("processing")}</span></div>
            )}
            {runtimeState !== "ready" && runtimeState !== "processing" && (
              <div role="alert" className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
                <p>{getLumiRuntimeStateMessage(runtimeState)}</p>
                {lastFailedMessage && (
                  <button type="button" onClick={() => void handleSendMessage(lastFailedMessage, true)} className="mt-2 rounded border border-amber-300/50 px-2 py-1 font-semibold text-amber-100 hover:bg-amber-500/10">
                    Reintentar
                  </button>
                )}
              </div>
            )}
            {voiceError && (
              <div role="alert" className="rounded-lg border border-violet-500/40 bg-violet-500/10 px-3 py-2 text-xs text-violet-100">
                {voiceError}
                {voicePlaybackReady && (
                  <button type="button" onClick={playPendingVoiceAudio} className="ml-2 rounded border border-violet-300/60 px-2 py-1 font-semibold text-violet-50 hover:bg-violet-500/20">
                    ▶ Reproducir voz
                  </button>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <LumiSuggestionGrid onSelect={(prompt) => void handleSendMessage(prompt)} />
          <LumiVoiceComposer value={inputText} onChange={setInputText} onSend={() => void handleSendMessage()} onVoiceAction={() => { if (voiceState === "capturing" || voiceState === "listening") stopVoiceCapture(); else void startVoiceTurn(); }} voiceState={voiceState} backendMode={responseMode === "backend"} disabled={isTyping} />
        </div>
        </div>

        <ChatDiagnosticsDrawer open={diagnosticsOpen} onClose={() => setDiagnosticsOpen(false)}>
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
            <div>
              <h3 className="text-sm font-bold text-amber-200">Receiver Bridge</h3>
              <p className="mt-1 text-xs text-slate-400">
                Selecciona el modo de respuesta para este chat local.
              </p>
            </div>
            <label className="block text-xs font-semibold text-slate-300">
              Modo de respuesta
              <select
                value={responseMode}
                onChange={(event) => setResponseMode(event.target.value as ResponseMode)}
                className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
              >
                <option value="demo">Demo local</option>
                <option value="backend">Backend sandbox</option>
              </select>
            </label>
            <p className="text-xs leading-relaxed text-slate-300">
              {responseMode === "demo"
                ? "Responde con la lógica simulada actual."
                : "Envía el mensaje al receiver local sandbox en localhost:8787. Al validar HTTP 200 puede registrar un lead demo local."}
            </p>
            <div className="space-y-1 rounded-xl bg-slate-950/60 p-3 font-mono text-[10px] text-slate-400">
              <p>Mode: <span className="text-white">{responseMode === "demo" ? "Demo local" : "Backend sandbox"}</span></p>
              <p>Receiver URL: <span className="text-white">{DEFAULT_RECEIVER_URL}</span></p>
              <p>Public key: <span className="text-white">{DEFAULT_PUBLIC_KEY}</span></p>
            </div>
            {responseMode === "backend" && (
              <label className="block text-xs font-semibold text-slate-300">
                Micrófono local
                <select
                  value={selectedVoiceInputId}
                  onChange={(event) => setSelectedVoiceInputId(event.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-violet-400"
                >
                  <option value="">Predeterminado del navegador</option>
                  {voiceInputs.map((input) => <option key={input.deviceId} value={input.deviceId}>{input.label}</option>)}
                </select>
                <span className="mt-1 block text-[10px] font-normal text-slate-500">Al iniciar una captura se muestran las entradas disponibles. Elige el micrófono físico, no Stereo Mix ni una entrada virtual.</span>
              </label>
            )}
            {voiceDiagnostics && (
              <div className="space-y-1 rounded-xl border border-violet-500/30 bg-violet-500/5 p-3 font-mono text-[10px] text-violet-100">
                <p>Voice capture diagnostic (solo metadatos)</p>
                <p>Track: {voiceDiagnostics.trackLabel} · enabled {String(voiceDiagnostics.trackEnabled)} · muted {String(voiceDiagnostics.trackMuted)} · {voiceDiagnostics.trackReadyState}</p>
                <p>Recorder: {voiceDiagnostics.recorderMimeType} · {voiceDiagnostics.blobSize} bytes · {(voiceDiagnostics.recordingDurationMs / 1000).toFixed(1)} s</p>
              </div>
            )}
            <ul className="space-y-1 text-[11px] text-amber-100">
              <li>• Local sandbox only</li>
              <li>• No WhatsApp real · No real DB</li>
              <li>• No external AI · No real customer data</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Extracción en Vivo (Lead Intelligence)</span>
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Rule Engine
              </span>
            </div>

            {/* Extracted Attributes */}
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-500">
                  Tipo de Cliente
                </span>
                <p className="text-xs font-semibold text-slate-200">
                  {CUSTOMER_TYPE_LABELS[currentAnalysis.customerType]}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-500">
                  Servicio Detectado
                </span>
                <p className="text-xs font-semibold text-cyan-400">
                  {currentAnalysis.customServiceName || currentAnalysis.serviceInterest}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-500">
                    Prioridad
                  </span>
                  <p className="text-xs font-bold text-amber-400 uppercase font-mono">
                    {PRIORITY_LABELS[currentAnalysis.priority]}
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-500">
                    Confianza
                  </span>
                  <p className="text-xs font-bold text-emerald-400 font-mono">
                    {currentAnalysis.serviceDetectionConfidence === "high" ? "95%" : currentAnalysis.serviceDetectionConfidence === "medium" ? "75%" : "50%"}
                  </p>
                </div>
              </div>

              {/* Contact Data Items */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-slate-400">Nombre:</span>
                  <span className="font-semibold text-white">
                    {currentContact.customerName || "No proporcionado"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-slate-400">Email:</span>
                  <span className="font-mono text-cyan-400">
                    {currentContact.customerEmail || "No proporcionado"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <PhoneCall className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-slate-400">Teléfono:</span>
                  <span className="font-mono text-slate-200">
                    {currentContact.customerPhone || "No proporcionado"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-slate-400">Empresa:</span>
                  <span className="font-semibold text-slate-200">
                    {currentContact.customerCompany || "No proporcionada"}
                  </span>
                </div>
              </div>
            </div>

            {/* Handoff Copy Button */}
            <button
              onClick={handleCopyHandoff}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition flex items-center justify-center gap-2 shadow-sm"
            >
              {copiedHandoff ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">¡Handoff Copiado al Portapapeles!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Copiar Ficha de Handoff Humano</span>
                </>
              )}
            </button>
          </div>
        </div>
        </ChatDiagnosticsDrawer>
      </div>
    </div>
  );
};
