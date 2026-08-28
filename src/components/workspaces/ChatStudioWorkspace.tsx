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

export const ChatStudioWorkspace: React.FC<ChatStudioWorkspaceProps> = ({
  companyProfile,
  leads,
  onAddLead,
}) => {
  const [messages, setMessages] = useState<Message[]>([DEFAULT_WELCOME_MESSAGE]);
  const [inputText, setInputText] = useState("");
  const [currentAnalysis, setCurrentAnalysis] = useState<LeadAnalysis>(EMPTY_ANALYSIS);
  const [currentContact, setCurrentContact] = useState<ContactExtraction>({});
  const [isTyping, setIsTyping] = useState(false);
  const [copiedHandoff, setCopiedHandoff] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!textToSend) setInputText("");

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
    }, 600);
  };

  const handleClearChat = () => {
    setMessages([DEFAULT_WELCOME_MESSAGE]);
    setCurrentAnalysis(EMPTY_ANALYSIS);
    setCurrentContact({});
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
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-200">
                {companyProfile.assistantName || companyProfile.companyName} (IA Online)
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Canal: Web Demo Sandbox
            </span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                    <p className="whitespace-pre-wrap">{msg.text}</p>
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
                <span>ORBI IA está escribiendo respuesta...</span>
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
                onClick={() => handleSendMessage(q)}
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
              handleSendMessage();
            }}
            className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe un mensaje de prueba (ej: Me llamo Carlos, mi correo es carlos@empresa.com y busco cotización)..."
              className="flex-1 bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:hover:bg-cyan-600 text-white font-medium transition flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Real-time AI Lead Extraction Card */}
        <div className="space-y-4">
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
