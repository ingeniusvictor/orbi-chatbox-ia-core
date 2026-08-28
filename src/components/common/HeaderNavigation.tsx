import React from "react";
import {
  Bot,
  LayoutDashboard,
  MessageSquare,
  Globe,
  Smartphone,
  Sparkles,
  BookOpen,
  BarChart3,
  Activity,
  Server,
  Settings,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  OrbiPremiumWorkspaceId,
  OrbiWorkspaceViewMode,
  InterfaceMode,
  ORBI_PREMIUM_WORKSPACES_ORDER,
  ORBI_PREMIUM_WORKSPACE_LABELS,
  ORBI_CHATBOX_APP_VERSION,
} from "../../data";

interface HeaderNavigationProps {
  activeWorkspace: OrbiPremiumWorkspaceId;
  setActiveWorkspace: (ws: OrbiPremiumWorkspaceId) => void;
  viewMode: OrbiWorkspaceViewMode;
  setViewMode: (mode: OrbiWorkspaceViewMode) => void;
  interfaceMode: InterfaceMode;
  setInterfaceMode: (mode: InterfaceMode) => void;
  companyName: string;
  totalLeads: number;
}

const WORKSPACE_ICONS: Record<OrbiPremiumWorkspaceId, React.ReactNode> = {
  overview: <LayoutDashboard className="w-4 h-4" />,
  chat_studio: <MessageSquare className="w-4 h-4" />,
  web_widget: <Globe className="w-4 h-4" />,
  whatsapp_future: <Smartphone className="w-4 h-4" />,
  lead_intelligence: <Sparkles className="w-4 h-4" />,
  knowledge_base: <BookOpen className="w-4 h-4" />,
  reports: <BarChart3 className="w-4 h-4" />,
  diagnostics: <Activity className="w-4 h-4" />,
  backend_roadmap: <Server className="w-4 h-4" />,
  settings: <Settings className="w-4 h-4" />,
};

export const HeaderNavigation: React.FC<HeaderNavigationProps> = ({
  activeWorkspace,
  setActiveWorkspace,
  viewMode,
  setViewMode,
  interfaceMode,
  setInterfaceMode,
  companyName,
  totalLeads,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-bold text-lg">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base sm:text-lg tracking-tight">
                  ORBI ChatBox IA Core
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  v{ORBI_CHATBOX_APP_VERSION}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {companyName || "ORBI Core Sandbox"} &bull;{" "}
                <span className="text-emerald-400 font-mono">
                  {totalLeads} {totalLeads === 1 ? "Lead" : "Leads"}
                </span>
              </p>
            </div>
          </div>

          {/* Mode switch for mobile */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={() =>
                setInterfaceMode(
                  interfaceMode === "full_app" ? "web_widget" : "full_app"
                )
              }
              className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900 border border-slate-800 text-slate-300"
            >
              {interfaceMode === "full_app" ? "Widget Mode" : "Full App"}
            </button>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center flex-wrap gap-2 justify-end">
          {/* View Mode (Single vs Multi Workspace) */}
          <div className="inline-flex rounded-lg bg-slate-900 p-0.5 border border-slate-800">
            <button
              type="button"
              onClick={() => setViewMode("single")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                viewMode === "single"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Vista Individual
            </button>
            <button
              type="button"
              onClick={() => setViewMode("all")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                viewMode === "all"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Dashboard Completo
            </button>
          </div>

          {/* Interface Mode Switch */}
          <div className="hidden md:inline-flex rounded-lg bg-slate-900 p-0.5 border border-slate-800">
            <button
              type="button"
              onClick={() => setInterfaceMode("full_app")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                interfaceMode === "full_app"
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Consola Ejecutiva
            </button>
            <button
              type="button"
              onClick={() => setInterfaceMode("web_widget")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                interfaceMode === "web_widget"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Web Widget Sandbox
            </button>
          </div>

          {/* Guardrails Status Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Sandbox:</span>
            <span className="text-emerald-400 font-semibold">100% In-Memory</span>
          </div>
        </div>
      </div>

      {/* Workspaces Scrollable Nav Bar */}
      <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-slate-800/40 overflow-x-auto no-scrollbar">
        <nav className="flex items-center gap-1.5 min-w-max pb-1">
          {ORBI_PREMIUM_WORKSPACES_ORDER.map((wsId) => {
            const isActive = activeWorkspace === wsId;
            return (
              <button
                key={wsId}
                type="button"
                onClick={() => setActiveWorkspace(wsId)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition duration-150 ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent"
                }`}
              >
                {WORKSPACE_ICONS[wsId]}
                <span>{ORBI_PREMIUM_WORKSPACE_LABELS[wsId]}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
