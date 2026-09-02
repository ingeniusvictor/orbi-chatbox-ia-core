import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  Copy,
  Check,
  PhoneCall,
  Mail,
  Building2,
  Clock,
  ShieldCheck,
  Mic,
  Square,
} from "lucide-react";
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
import { classifyLumiRuntimeState, getLumiRuntimeStateLabel, getLumiRuntimeStateMessage } from "../../services/lumiRuntimeState";
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
  text: "¡Hola! Bienvenido a nuestro asistente virtual inteligente. ¿En qué podemos ayudarte hoy? Cuéntanos qué servicio o solución necesitas.",
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

const SUGGESTED_QUESTIONS = [
  "Hola, me interesa una cotización de desarrollo web para mi empresa.",
  "Quiero automatizar la atención a clientes por WhatsApp con IA.",
  "¿Cuáles son sus planes de precios y tiempos de entrega?",
  "Necesito soporte urgente para integrar mi pasarela de pago.",
];

type ResponseMode = "demo" | "backend";

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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const voiceChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const stopVoicePlayback = () => {
    const audio = audioRef.current;
    if (audio) { audio.pause(); audio.src = ""; audioRef.current = null; }
    if (audioUrlRef.current) { URL.revokeObjectURL(audioUrlRef.current); audioUrlRef.current = null; }
  };

  const playVoiceAudio = (voiceAudio: Blob) => {
    stopVoicePlayback();
    try {
      const url = URL.createObjectURL(voiceAudio);
      const audio = new Audio(url);
      audioUrlRef.current = url;
      audioRef.current = audio;
      audio.onended = () => { stopVoicePlayback(); setVoiceState("idle"); };
      audio.onerror = () => { stopVoicePlayback(); setVoiceError("No se pudo reproducir el audio de LUMI."); setVoiceState("error"); };
      setVoiceState("speaking");
      void audio.play().catch(() => { stopVoicePlayback(); setVoiceError("El navegador bloqueó la reproducción de audio."); setVoiceState("error"); });
    } catch { setVoiceError("No se pudo preparar el audio de LUMI."); setVoiceState("error"); }
  };

  useEffect(() => () => {
    mediaRecorderRef.current?.stop();
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    stopVoicePlayback();
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
        setMessages((prev) => appendRuntimeMessage(prev, createBackendAssistantMessage(`msg-backend-${Date.now()}`, new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), result.body)));
        if (voiceTurn) {
          setVoiceState("synthesizing");
          const synthesis = await synthesizeVoiceText(result.body.message);
          if (synthesis.ok) playVoiceAudio(synthesis.audio);
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
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      voiceChunksRef.current = [];
      recorder.ondataavailable = (event) => { if (event.data.size > 0) voiceChunksRef.current.push(event.data); };
      recorder.onerror = () => { setVoiceError("No se pudo capturar el audio del micrófono."); setVoiceState("error"); };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null; mediaRecorderRef.current = null;
        void (async () => {
          const audio = new Blob(voiceChunksRef.current, { type: recorder.mimeType || "audio/webm" });
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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-cyan-400" />
            <span>Chat Studio &bull; Simulador Inteligente</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Prueba en tiempo real el flujo conversacional y la extracción automática de datos para {companyProfile.companyName}.
          </p>
        </div>

        <button
          onClick={handleClearChat}
          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-400 hover:text-rose-400 transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Reiniciar Conversación</span>
        </button>
      </div>

      {/* Main Grid: Chat Panel + AI Live Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Box Panel */}
        <div className="lg:col-span-2 flex flex-col h-[600px] rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl overflow-hidden">
          {/* Top Chat Bar */}
          <div className="px-4 py-3 bg-slate-950/70 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-3 h-3 rounded-full ${runtimeState === "ready" ? "bg-emerald-500 animate-pulse" : "bg-amber-400"}`} />
              <span className="text-xs font-bold text-slate-200">
                {companyProfile.assistantName || companyProfile.companyName}
              </span>
              <span className="text-[10px] font-mono text-slate-400">{getLumiRuntimeStateLabel(runtimeState)}</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Canal: {responseMode === "demo" ? "Web Demo Sandbox" : "Backend Receiver Sandbox"}
            </span>
            {voiceState !== "idle" && <span className="text-[10px] font-mono text-violet-300">Voz: {voiceState}</span>}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-sm text-slate-400">
                <span className="font-semibold text-slate-200">LUMI está lista para conversar.</span> Pregunta sobre ORBI o continúa una conversación activa.
              </div>
            )}
            {messages.map((msg) => {
              const isBot = msg.sender === "bot";
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${
                    isBot ? "justify-start" : "justify-end"
                  }`}
                >
                  {isBot && (
                    <div className="w-8 h-8 rounded-lg bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-400 flex-shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      isBot
                        ? "bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-tl-none"
                        : "bg-cyan-600 text-white rounded-tr-none shadow-md"
                    }`}
                  >
                    {isBot && <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-cyan-300">LUMI</span>}
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    {isBot && msg.backend && (
                      <span className="mt-1 block text-[10px] text-slate-400">
                        LUMI · {msg.backend.provider}{msg.backend.grounded ? " · Con conocimiento ORBI" : ""}
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-mono mt-1 block ${
                        isBot ? "text-slate-400" : "text-cyan-100"
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>

                  {!isBot && (
                    <div className="w-8 h-8 rounded-lg bg-indigo-600/40 border border-indigo-500/40 flex items-center justify-center text-indigo-300 flex-shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
                <Bot className="w-4 h-4 text-cyan-400 animate-spin" />
                <span>{getLumiRuntimeStateMessage("processing")}</span>
              </div>
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
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Suggestions */}
          <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-800/60 overflow-x-auto no-scrollbar flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase flex-shrink-0">
              Sugerencias:
            </span>
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => void handleSendMessage(q)}
                className="px-2.5 py-1 rounded-full text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 whitespace-nowrap transition"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSendMessage();
            }}
            className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center gap-2"
          >
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void handleSendMessage(); } }}
              aria-label="Mensaje para LUMI"
              placeholder="Escribe un mensaje de prueba (ej: Me llamo Carlos, mi correo es carlos@empresa.com y busco cotización)..."
              rows={1}
              className="flex-1 resize-none bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition"
            />
            <button
              type="button"
              onClick={() => { if (voiceState === "capturing" || voiceState === "listening") stopVoiceCapture(); else void startVoiceTurn(); }}
              disabled={isTyping || (responseMode !== "backend" && voiceState !== "capturing")}
              aria-label={voiceState === "capturing" || voiceState === "listening" ? "Detener grabación de voz" : "Iniciar mensaje de voz para LUMI"}
              title={responseMode === "backend" ? "Mensaje de voz local" : "La voz requiere Backend sandbox"}
              className="px-3 py-2.5 rounded-xl border border-violet-500/50 bg-violet-500/15 hover:bg-violet-500/25 disabled:opacity-40 text-violet-100 transition flex items-center"
            >
              {voiceState === "capturing" || voiceState === "listening" ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              aria-label="Enviar mensaje a LUMI"
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:hover:bg-cyan-600 text-white font-medium transition flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Real-time AI Lead Extraction Card */}
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
      </div>
    </div>
  );
};
