import React, { useState } from "react";
import {
  PhoneCall,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  Code2,
  Copy,
  Check,
  AlertCircle,
} from "lucide-react";
import {
  CompanyProfile,
  LeadRecord,
  SimulatedWhatsAppConversation,
  INITIAL_SIMULATED_WHATSAPP_CONVERSATIONS,
  PRIORITY_LABELS,
  buildLeadRecord,
  analyzeCustomerMessage,
} from "../../data";

interface WhatsAppFutureWorkspaceProps {
  companyProfile: CompanyProfile;
  leads: LeadRecord[];
  onAddLead: (lead: LeadRecord) => void;
}

export const WhatsAppFutureWorkspace: React.FC<WhatsAppFutureWorkspaceProps> = ({
  companyProfile,
  leads,
  onAddLead,
}) => {
  const [conversations, setConversations] = useState<
    SimulatedWhatsAppConversation[]
  >(INITIAL_SIMULATED_WHATSAPP_CONVERSATIONS);
  const [activeConv, setActiveConv] = useState<SimulatedWhatsAppConversation>(
    INITIAL_SIMULATED_WHATSAPP_CONVERSATIONS[0]
  );
  const [replyText, setReplyText] = useState("");
  const [copiedPayload, setCopiedPayload] = useState(false);

  const sampleWebhook = {
    object: "whatsapp_business_account",
    entry: [
      {
        id: "WHATSAPP_BUSINESS_ACCOUNT_ID",
        changes: [
          {
            value: {
              messaging_product: "whatsapp",
              metadata: {
                display_phone_number: companyProfile.publicPhone || "+15551234567",
                phone_number_id: "PHONE_NUMBER_ID",
              },
              contacts: [
                {
                  profile: { name: activeConv.contactName },
                  wa_id: activeConv.phone.replace(/[^0-9]/g, ""),
                },
              ],
              messages: [
                {
                  from: activeConv.phone.replace(/[^0-9]/g, ""),
                  id: `wamid.HBgL${Date.now()}`,
                  timestamp: Math.floor(Date.now() / 1000).toString(),
                  text: { body: activeConv.lastMessage },
                  type: "text",
                },
              ],
            },
            field: "messages",
          },
        ],
      },
    ],
  };

  const handleCopyPayload = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(sampleWebhook, null, 2));
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSimulateWebhookIntake = (conv: SimulatedWhatsAppConversation) => {
    const analysis = analyzeCustomerMessage(conv.lastMessage, companyProfile);
    const newLead = buildLeadRecord({
      sourceMessage: conv.lastMessage,
      conversation: [
        {
          id: `wa-sim-${Date.now()}`,
          sender: "user",
          text: conv.lastMessage,
          timestamp: conv.receivedAt,
        },
      ],
      analysis,
      channel: "whatsapp_future",
      contactData: {
        customerName: conv.contactName,
        customerPhone: conv.phone,
      },
    });
    onAddLead(newLead);
    alert(`¡Conversación de ${conv.contactName} importada exitosamente a Lead Intelligence!`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <PhoneCall className="w-6 h-6 text-emerald-400" />
            <span>WhatsApp Business API Future Sandbox</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Entorno simulado para preparación de webhooks de Meta WhatsApp Cloud API sin llamadas salientes reales.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Sin API Key Requerida (Simulación)</span>
          </span>
        </div>
      </div>

      {/* Main Grid: WhatsApp Interface + Webhook Payload Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase text-slate-400">
            Bandeja Simulada ({conversations.length})
          </h3>

          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-2 space-y-1.5">
            {conversations.map((c) => {
              const isSelected = activeConv.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setActiveConv(c)}
                  className={`p-3 rounded-xl cursor-pointer border transition ${
                    isSelected
                      ? "bg-emerald-500/10 border-emerald-500/40 text-white"
                      : "bg-slate-950/40 border-slate-800/80 hover:border-slate-700 text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{c.contactName}</span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {c.receivedAt}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">
                    {c.lastMessage}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/40 text-[10px] font-mono">
                    <span className="text-slate-400">{c.phone}</span>
                    <span className="text-amber-400 uppercase font-bold">
                      {PRIORITY_LABELS[c.priorityHint]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* WhatsApp Mobile View Mockup */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 space-y-3 shadow-xl flex flex-col justify-between h-[520px]">
          {/* Top Contact Bar */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs">
                {activeConv.contactName.charAt(0)}
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  {activeConv.contactName}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {activeConv.phone}
                </span>
              </div>
            </div>
            <button
              onClick={() => handleSimulateWebhookIntake(activeConv)}
              className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold transition"
            >
              Procesar como Lead
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-950/40 rounded-xl">
            <div className="flex justify-start">
              <div className="bg-slate-800 text-slate-200 p-3 rounded-2xl rounded-tl-none max-w-[85%] text-xs shadow">
                <p>{activeConv.lastMessage}</p>
                <span className="text-[9px] text-slate-400 block text-right mt-1">
                  {activeConv.receivedAt}
                </span>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="bg-emerald-800/80 text-emerald-100 p-3 rounded-2xl rounded-tr-none max-w-[85%] text-xs shadow border border-emerald-700/50">
                <p>
                  ¡Hola {activeConv.contactName}! Gracias por comunicarte con {companyProfile.companyName}. Con gusto te asesoramos.
                </p>
                <span className="text-[9px] text-emerald-300 block text-right mt-1">
                  Respuesta Simulada
                </span>
              </div>
            </div>
          </div>

          {/* Fake Input */}
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Simular mensaje saliente por WhatsApp..."
              className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none px-2"
            />
            <button
              onClick={() => {
                alert("Simulación de envío: En fase sandbox las respuestas quedan registradas localmente.");
                setReplyText("");
              }}
              className="p-1.5 rounded-lg bg-emerald-600 text-white"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Meta Webhook Payload JSON Viewer */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 space-y-3 shadow-xl flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Meta Webhook Payload Contract</span>
              </h4>
              <button
                onClick={handleCopyPayload}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                {copiedPayload ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copiar JSON</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Estructura JSON estándar emitida por Meta Cloud API al recibir un mensaje entrante.
            </p>
          </div>

          <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-cyan-300 overflow-x-auto whitespace-pre max-h-[380px]">
            {JSON.stringify(sampleWebhook, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};
