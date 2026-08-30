import React, { useState } from "react";
import {
  Globe,
  MessageSquare,
  ShieldCheck,
  Send,
  Sparkles,
  Bot,
  Copy,
  Check,
  Code2,
} from "lucide-react";
import {
  CompanyProfile,
  LeadRecord,
  LeadAnalysis,
  EMPTY_ANALYSIS,
  buildLeadRecord,
  CONTROLLED_EMBED_SNIPPETS,
  buildControlledEmbedInstructionSummary,
  CONTROLLED_EMBED_INSTRUCTION_ITEMS,
  orbiDemoInstallableWidgetConfig,
} from "../../data";
import {
  DEFAULT_PUBLIC_KEY,
  DEFAULT_RECEIVER_URL,
  sendMessageToBackendReceiver,
} from "../../services/backendReceiverClient";
import { UnifiedFloatingLauncher, WhatsAppFloatingWidget } from "../common";

interface WebWidgetWorkspaceProps {
  companyProfile: CompanyProfile;
  leads: LeadRecord[];
  onAddLead: (lead: LeadRecord) => void;
}

const WIDGET_THEMES = [
  { id: "cyan", name: "Cyan Tech", primaryColor: "#06b6d4", position: "bottom-right" },
  { id: "indigo", name: "Indigo Corporate", primaryColor: "#6366f1", position: "bottom-right" },
  { id: "emerald", name: "Emerald Pro", primaryColor: "#10b981", position: "bottom-left" },
];

type WidgetResponseMode = "demo" | "backend";

export const WebWidgetWorkspace: React.FC<WebWidgetWorkspaceProps> = ({
  companyProfile,
  leads,
  onAddLead,
}) => {
  const [selectedTheme, setSelectedTheme] = useState(WIDGET_THEMES[0]);
  const [widgetOpen, setWidgetOpen] = useState(true);
  const [widgetInput, setWidgetInput] = useState("");
  const [widgetMessages, setWidgetMessages] = useState<
    Array<{ id: string; sender: "user" | "bot"; text: string }>
  >([
    {
      id: "w1",
      sender: "bot",
      text: `¡Hola! Gracias por visitar ${companyProfile.companyName}. ¿Tienes alguna duda sobre nuestros productos o cotizaciones?`,
    },
  ]);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [responseMode, setResponseMode] = useState<WidgetResponseMode>("demo");
  const [isSending, setIsSending] = useState(false);
  const installableConfig = orbiDemoInstallableWidgetConfig;

  const embedSummary = React.useMemo(
    () => buildControlledEmbedInstructionSummary(CONTROLLED_EMBED_INSTRUCTION_ITEMS),
    []
  );

  const handleWidgetSend = async () => {
    if (!widgetInput.trim()) return;
    const userMsg = {
      id: `w-user-${Date.now()}`,
      sender: "user" as const,
      text: widgetInput.trim(),
    };
    setWidgetMessages((prev) => [...prev, userMsg]);
    setWidgetInput("");

    if (responseMode === "backend") {
      setIsSending(true);
      const result = await sendMessageToBackendReceiver({
        message: userMsg.text,
        channel: "web_demo",
        visitorId: "web-widget-local-sandbox-visitor",
        pageUrl: "http://localhost:3000/web-widget-preview",
      });
      const detail = result.ok === true
        ? `HTTP ${result.status}${result.normalizedChannel ? ` · channel: ${result.normalizedChannel}` : ""}${result.processedAt ? ` · ${result.processedAt}` : ""}`
        : result.errorCode || result.message;

      if (result.ok === true) {
        const sandboxAnalysis: LeadAnalysis = {
          ...EMPTY_ANALYSIS,
          mainNeed: "Validación del backend sandbox desde Web Widget.",
          aiSummary: "Lead sandbox generado desde Web Widget tras validación del backend local.",
          recommendedAction: "Solo demo local: no realizar seguimiento real.",
        };
        const sandboxLead = buildLeadRecord({
          sourceMessage: userMsg.text,
          conversation: [{ ...userMsg, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }],
          analysis: sandboxAnalysis,
          channel: "web_demo",
        });
        onAddLead({
          ...sandboxLead,
          name: "Lead sandbox web widget",
          detectedService: "Web Widget backend local",
          rawMessage: userMsg.text,
          sandbox: {
            source: "backend_sandbox",
            status: "sandbox_validated",
            realData: false,
            backendStatus: 200,
            note: "Lead sandbox generado desde Web Widget tras validación del backend local. No corresponde a un cliente real.",
          },
        });
      }

      setWidgetMessages((prev) => [
        ...prev,
        {
          id: `w-backend-${Date.now()}`,
          sender: "bot",
          text: result.ok
            ? `Mensaje validado por backend sandbox. Lead sandbox registrado.\n${detail}`
            : `El backend sandbox respondió con error controlado: ${detail}`,
        },
      ]);
      setIsSending(false);
      return;
    }

    setTimeout(() => {
      const botMsg = {
        id: `w-bot-${Date.now()}`,
        sender: "bot" as const,
        text: `Hemos registrado tu mensaje en ${companyProfile.companyName}. Un asesor especializado se comunicará contigo a la brevedad.`,
      };
      setWidgetMessages((prev) => [...prev, botMsg]);
    }, 500);
  };

  const embedCodeSnippet = `<!-- ORBI ChatBox IA Core — Web Widget Embed Script -->
<script 
  src="https://cdn.orbicore.io/v1/widget.js"
  data-tenant-id="tenant_${companyProfile.companyName.toLowerCase().replace(/\\s+/g, '_')}"
  data-primary-color="${selectedTheme.primaryColor}"
  data-position="${selectedTheme.position}"
  data-mode="sandbox"
  async>
</script>`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(embedCodeSnippet);
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Globe className="w-6 h-6 text-emerald-400" />
            <span>Web Widget Runtime Sandbox</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Simulador visual del widget embebible para sitios web con sandbox seguro y bridge postMessage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Bridge Seguro</span>
          </span>
        </div>
      </div>

      {/* Grid: Simulator & Embed Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Settings & Presets */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>Configuración del Widget</span>
            </h3>

            {/* Presets Selection */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase">
                Plantilla / Estilo
              </label>
              <div className="grid grid-cols-1 gap-2">
                {WIDGET_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme)}
                    className={`p-3 rounded-xl text-left border transition ${
                      selectedTheme.id === theme.id
                        ? "bg-cyan-500/10 border-cyan-500 text-cyan-300"
                        : "bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{theme.name}</span>
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: theme.primaryColor }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 font-mono">
                      Posición: {theme.position}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-800 pt-4">
              <div>
                <h4 className="text-xs font-mono font-bold uppercase text-cyan-300">
                  Unified Floating Launcher — Sandbox Preview
                </h4>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                  Chat IA está listo en sandbox; WhatsApp queda en configuración sin número y voz está desactivada.
                </p>
              </div>
              <UnifiedFloatingLauncher
                brandName={installableConfig.brand.brandName}
                mode={installableConfig.mode}
                enabled={true}
                channels={installableConfig.channels}
                whatsapp={{
                  phoneNumber: installableConfig.whatsapp.phoneNumber,
                  defaultMessage: installableConfig.whatsapp.defaultMessage,
                }}
                placement="inline-preview"
              />
            </div>

            <div className="space-y-2 border-t border-slate-800 pt-4">
              <h4 className="text-xs font-mono font-bold uppercase text-violet-300">
                Installable Client Config — Sandbox Template
              </h4>
              <div className="grid grid-cols-2 gap-2 rounded-xl border border-violet-400/20 bg-violet-400/5 p-3 text-[10px] font-mono text-slate-300">
                <p>Client ID: <span className="text-white">{installableConfig.brand.clientId}</span></p>
                <p>Mode: <span className="text-white">{installableConfig.mode}</span></p>
                <p>Web chat: <span className="text-white">{String(installableConfig.channels.webChat)}</span></p>
                <p>WhatsApp: <span className="text-white">{String(installableConfig.channels.whatsapp)}</span></p>
                <p>Voice: <span className="text-white">{String(installableConfig.channels.voice)}</span></p>
                <p>Real data: <span className="text-white">{String(installableConfig.chatbox.realDataAllowed)}</span></p>
                <p className="col-span-2">Production allowed: <span className="text-white">{String(installableConfig.guardrails.productionAllowed)}</span></p>
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-800 pt-4">
              <label className="text-xs font-mono text-slate-400 uppercase">
                Modo del widget
              </label>
              <select
                value={responseMode}
                onChange={(event) => setResponseMode(event.target.value as WidgetResponseMode)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
              >
                <option value="demo">Demo local</option>
                <option value="backend">Backend sandbox</option>
              </select>
              <p className="text-xs leading-relaxed text-slate-400">
                {responseMode === "demo"
                  ? "Simula respuesta local del widget."
                  : "Envía el mensaje al receiver local sandbox y puede registrar un lead demo."}
              </p>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 font-mono text-[10px] text-slate-400">
                <p>Mode: <span className="text-white">{responseMode === "demo" ? "Demo local" : "Backend sandbox"}</span></p>
                <p>Receiver: <span className="text-white">{DEFAULT_RECEIVER_URL}</span></p>
                <p>Public key: <span className="text-white">{DEFAULT_PUBLIC_KEY}</span></p>
                <p className="mt-1 text-emerald-200">Local sandbox only · No real data · No production</p>
              </div>
            </div>

            {/* Embed Code Box */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase">
                  Código de Embeber (HTML)
                </span>
                <button
                  onClick={handleCopyCode}
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  {copiedSnippet ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre">
                {embedCodeSnippet}
              </pre>
              <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-2 text-[11px] leading-relaxed text-amber-200">
                Embed productivo bloqueado. Usar sólo en sandbox/local hasta completar Web ORBI Embed Controlled Plan.
              </p>
            </div>

            <div className="space-y-2 border-t border-slate-800 pt-4">
              <div>
                <h4 className="text-xs font-mono font-bold uppercase text-emerald-300">
                  WhatsApp Floating Widget — Sandbox Preview
                </h4>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                  Preview interno manual. Sin número configurado, sin enlace externo y sin automatización.
                </p>
              </div>
              <WhatsAppFloatingWidget
                phoneNumber=""
                defaultMessage="Hola ORBI Ecosystem. Vengo desde la web y necesito información."
                brandName="ORBI Ecosystem"
                mode="sandbox"
                enabled={true}
                realAutomationAllowed={false}
                placement="inline-preview"
              />
            </div>
          </div>
        </div>

        {/* Right: Live Simulated Website with Floating Widget */}
        <div className="lg:col-span-2 relative min-h-[550px] rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 p-6 flex flex-col justify-between overflow-hidden shadow-2xl">
          {/* Simulated Web Page Background */}
          <div className="space-y-6 opacity-80 pointer-events-none">
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-xs font-mono text-slate-500 ml-2">
                https://www.{companyProfile.companyName.toLowerCase().replace(/\s+/g, "")}.com
              </span>
            </div>

            {/* Fake landing page content */}
            <div className="space-y-3 max-w-md">
              <div className="h-6 w-48 bg-slate-800 rounded-lg" />
              <div className="h-4 w-64 bg-slate-800/60 rounded" />
              <div className="h-4 w-52 bg-slate-800/40 rounded" />
              <div className="h-8 w-32 bg-cyan-600/40 rounded-lg mt-4" />
            </div>
          </div>

          {/* Interactive Floating Widget Box */}
          <div className="absolute bottom-6 right-6 flex flex-col items-end gap-3 z-30">
            {widgetOpen && (
              <div className="w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-200">
                {/* Widget Header */}
                <div
                  className="px-4 py-3 text-white flex items-center justify-between"
                  style={{ backgroundColor: selectedTheme.primaryColor }}
                >
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    <span className="text-xs font-bold">{companyProfile.companyName} Live Chat</span>
                  </div>
                  <button
                    onClick={() => setWidgetOpen(false)}
                    className="text-white/80 hover:text-white text-xs font-bold px-1.5 py-0.5 rounded"
                  >
                    &times;
                  </button>
                </div>

                {/* Widget Messages */}
                <div className="p-3 h-56 overflow-y-auto space-y-2.5 bg-slate-950/60">
                  {widgetMessages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${
                        m.sender === "bot" ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div
                        className={`text-xs px-3 py-2 rounded-xl max-w-[85%] ${
                          m.sender === "bot"
                            ? "bg-slate-800 text-slate-200"
                            : "bg-cyan-600 text-white"
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Widget Input */}
                <div className="p-2 bg-slate-900 border-t border-slate-800 flex items-center gap-1.5">
                  <input
                    type="text"
                    value={widgetInput}
                    onChange={(e) => setWidgetInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && void handleWidgetSend()}
                    placeholder="Escribe tu consulta..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={() => void handleWidgetSend()}
                    disabled={isSending || !widgetInput.trim()}
                    className="p-1.5 rounded-lg text-white font-medium disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ backgroundColor: selectedTheme.primaryColor }}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Floating Trigger Button */}
            <button
              onClick={() => setWidgetOpen(!widgetOpen)}
              className="w-12 h-12 rounded-full text-white shadow-xl flex items-center justify-center transition-transform hover:scale-105"
              style={{ backgroundColor: selectedTheme.primaryColor }}
            >
              <MessageSquare className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
