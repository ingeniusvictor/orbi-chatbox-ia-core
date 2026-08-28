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
  CONTROLLED_EMBED_SNIPPETS,
  buildControlledEmbedInstructionSummary,
  CONTROLLED_EMBED_INSTRUCTION_ITEMS,
} from "../../data";

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

  const embedSummary = React.useMemo(
    () => buildControlledEmbedInstructionSummary(CONTROLLED_EMBED_INSTRUCTION_ITEMS),
    []
  );

  const handleWidgetSend = () => {
    if (!widgetInput.trim()) return;
    const userMsg = {
      id: `w-user-${Date.now()}`,
      sender: "user" as const,
      text: widgetInput.trim(),
    };
    setWidgetMessages((prev) => [...prev, userMsg]);
    setWidgetInput("");

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
                    onKeyDown={(e) => e.key === "Enter" && handleWidgetSend()}
                    placeholder="Escribe tu consulta..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={handleWidgetSend}
                    className="p-1.5 rounded-lg text-white font-medium"
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
