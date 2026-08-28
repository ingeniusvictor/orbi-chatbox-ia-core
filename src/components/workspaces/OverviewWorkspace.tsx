import React from "react";
import {
  LayoutDashboard,
  TrendingUp,
  ChevronRight,
  Sparkles,
  Bot,
} from "lucide-react";
import {
  CompanyProfile,
  LeadRecord,
  OrbiPremiumWorkspaceId,
  ORBI_CHATBOX_APP_VERSION,
  ORBI_PREMIUM_WORKSPACE_LABELS,
  ORBI_PREMIUM_WORKSPACE_DESCRIPTIONS,
  ORBI_PREMIUM_WORKSPACES_ORDER,
  ORBI_CHATBOX_MODULE_REGISTRY,
  buildOrbiModuleRegistrySummary,
  MVP_SECURITY_GATE_BASE_ITEMS,
  buildMvpSecurityGateBaseSummary,
  MVP_ROADMAP_PHASES,
} from "../../data";

interface OverviewWorkspaceProps {
  companyProfile: CompanyProfile;
  leads: LeadRecord[];
  setActiveWorkspace: (ws: OrbiPremiumWorkspaceId) => void;
}

export const OverviewWorkspace: React.FC<OverviewWorkspaceProps> = ({
  companyProfile,
  leads,
  setActiveWorkspace,
}) => {
  const moduleSummary = React.useMemo(
    () => buildOrbiModuleRegistrySummary(ORBI_CHATBOX_MODULE_REGISTRY),
    []
  );
  const securityGateSummary = React.useMemo(
    () => buildMvpSecurityGateBaseSummary(MVP_SECURITY_GATE_BASE_ITEMS),
    []
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Executive Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                ORBI AI Core v{ORBI_CHATBOX_APP_VERSION}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Sandbox 100% Operativo
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30">
                Producción Bloqueada
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Consola Ejecutiva &bull; {companyProfile.companyName}
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Plataforma de inteligencia conversacional, captura automatizada de leads B2B/B2C y gobernanza de datos multi-tenant para arquitectura modular.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => setActiveWorkspace("chat_studio")}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2"
            >
              <Bot className="w-4 h-4" />
              <span>Abrir Chat Studio</span>
            </button>
            <button
              onClick={() => setActiveWorkspace("lead_intelligence")}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-sm transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Lead Intelligence ({leads.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
            Total Leads Capturados
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {leads.length}
          </p>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" /> Persistidos en LocalStorage
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
            Módulos de Sistema
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">
            {moduleSummary.completed}/{moduleSummary.total}
          </p>
          <span className="text-[11px] text-slate-400 font-medium">
            {Math.round((moduleSummary.completed / moduleSummary.total) * 100)}% Completitud Core
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
            Security Gates
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-mono">
            {securityGateSummary.approved}/{securityGateSummary.total}
          </p>
          <span className="text-[11px] text-emerald-400 font-medium">
            100% Gates de Seguridad Aprobados
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
            Fases del Roadmap
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">
            {MVP_ROADMAP_PHASES.length} Fases
          </p>
          <span className="text-[11px] text-purple-400 font-medium">
            0K-1 a 0K-12 Documentadas
          </span>
        </div>
      </div>

      {/* Workspaces Direct Access Bento Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-cyan-400" />
          <span>Workspaces y Centros de Control Disponibles</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ORBI_PREMIUM_WORKSPACES_ORDER.filter((w) => w !== "overview").map(
            (wsId) => {
              return (
                <div
                  key={wsId}
                  onClick={() => setActiveWorkspace(wsId)}
                  className="group cursor-pointer p-5 rounded-2xl bg-slate-900/50 hover:bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-all duration-200 space-y-3 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                      {ORBI_PREMIUM_WORKSPACE_LABELS[wsId]}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition transform group-hover:translate-x-1" />
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {ORBI_PREMIUM_WORKSPACE_DESCRIPTIONS[wsId]}
                  </p>
                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span className="text-cyan-500/80">Abrir Consola &rarr;</span>
                    <span className="text-emerald-500/80">Sandbox Listo</span>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};
