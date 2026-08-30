import React, { useState } from "react";
import {
  Server,
  Database,
  Lock,
  Shield,
  Layers,
  Code2,
  Copy,
  Check,
  ChevronRight,
  FileCode,
  AlertCircle,
} from "lucide-react";
import { BackendReceiverTestConsole } from "../common";
import {
  CompanyProfile,
  BACKEND_ARCHITECTURE_COMPONENTS,
  MULTI_TENANT_DATA_MODEL_ENTITIES,
  ACCESS_ROLE_DEFINITIONS,
  API_CONTRACTS,
  BACKEND_RECEIVER_FILE_PLAN_ITEMS,
  BACKEND_RECEIVER_12_READINESS_ITEMS,
  buildBackendArchitectureBlueprintText,
  buildBackendArchitectureSummary,
  buildMultiTenantDataModelText,
  buildMultiTenantDataModelSummary,
  buildAccessMatrixText,
  buildAccessMatrixSummary,
  buildApiContractsText,
  buildApiContractsSummary,
} from "../../data";

interface BackendRoadmapWorkspaceProps {
  companyProfile: CompanyProfile;
}

export const BackendRoadmapWorkspace: React.FC<BackendRoadmapWorkspaceProps> = ({
  companyProfile,
}) => {
  const [activeTab, setActiveTab] = useState<
    "architecture" | "schema" | "rbac" | "api" | "receiver_plan"
  >("architecture");
  const [copiedText, setCopiedText] = useState(false);

  const handleCopyCurrent = async () => {
    let text = "";
    if (activeTab === "architecture") {
      const summary = buildBackendArchitectureSummary(BACKEND_ARCHITECTURE_COMPONENTS);
      text = buildBackendArchitectureBlueprintText({
        profile: companyProfile,
        components: BACKEND_ARCHITECTURE_COMPONENTS,
        summary,
      });
    } else if (activeTab === "schema") {
      const summary = buildMultiTenantDataModelSummary(MULTI_TENANT_DATA_MODEL_ENTITIES);
      text = buildMultiTenantDataModelText({
        profile: companyProfile,
        entities: MULTI_TENANT_DATA_MODEL_ENTITIES,
        summary,
      });
    } else if (activeTab === "rbac") {
      const summary = buildAccessMatrixSummary(ACCESS_ROLE_DEFINITIONS);
      text = buildAccessMatrixText({
        profile: companyProfile,
        roles: ACCESS_ROLE_DEFINITIONS,
        summary,
      });
    } else {
      const summary = buildApiContractsSummary(API_CONTRACTS);
      text = buildApiContractsText({
        profile: companyProfile,
        contracts: API_CONTRACTS,
        summary,
      });
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
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
            <Server className="w-6 h-6 text-purple-400" />
            <span>Roadmap Backend 0K-12 &bull; Arquitectura Multi-Tenant</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Blueprints técnicos desacoplados, contratos de API y modelos de datos para la fase backend futura.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCurrent}
            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition flex items-center gap-1.5"
          >
            {copiedText ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copiar Blueprint</span>
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 shadow-lg">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-bold text-emerald-200">Functional MVP Demo</h3>
            <p className="mt-1 text-xs text-slate-300">
              Chat Studio → Backend sandbox → Sandbox Lead → Lead Intelligence
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs font-bold text-emerald-300">READY</p>
            <p className="font-mono text-[10px] text-slate-400">v0.13.0-functional-mvp-demo</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-bold text-amber-200">Controlled Preview Execution Inputs</h3>
            <p className="mt-1 text-xs text-slate-300">Plantilla documental de valores necesarios antes de una ejecución preview.</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs font-bold text-amber-300">INPUT TEMPLATE READY / VALUES PENDING / PRODUCTION NO-GO</p>
            <p className="font-mono text-[10px] text-slate-400">Next: Controlled Preview Dry Run Plan</p>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80">
        <button
          onClick={() => setActiveTab("architecture")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === "architecture"
              ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
              : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Arquitectura General ({BACKEND_ARCHITECTURE_COMPONENTS.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("schema")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === "schema"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
              : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Modelo Multi-Tenant ({MULTI_TENANT_DATA_MODEL_ENTITIES.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("rbac")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === "rbac"
              ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
              : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Matriz de Acceso RBAC ({ACCESS_ROLE_DEFINITIONS.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("api")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === "api"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
              : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Contratos de API ({API_CONTRACTS.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("receiver_plan")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === "receiver_plan"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Plan 0K-12B Receiver ({BACKEND_RECEIVER_FILE_PLAN_ITEMS.length})</span>
        </button>
      </div>

      {/* Tab Content Display */}
      {activeTab === "architecture" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BACKEND_ARCHITECTURE_COMPONENTS.map((comp) => (
            <div
              key={comp.id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{comp.title}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30 uppercase">
                  {comp.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {comp.description}
              </p>
              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Prioridad: {comp.priority}</span>
                <span className="text-emerald-400 font-semibold uppercase">{comp.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "schema" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MULTI_TENANT_DATA_MODEL_ENTITIES.map((entity) => (
            <div
              key={entity.id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 shadow-lg"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <span className="text-xs font-bold text-cyan-400 font-mono">
                    {entity.entityName}
                  </span>
                  <p className="text-xs font-bold text-white mt-0.5">{entity.title}</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {entity.type}
                </span>
              </div>
              <p className="text-xs text-slate-400">{entity.description}</p>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  Campos ({entity.fields.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {entity.fields.slice(0, 6).map((f, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300"
                    >
                      {f.name}
                    </span>
                  ))}
                  {entity.fields.length > 6 && (
                    <span className="text-[10px] font-mono text-slate-500 self-center">
                      +{entity.fields.length - 6} más
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "rbac" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ACCESS_ROLE_DEFINITIONS.map((role) => (
            <div
              key={role.id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 shadow-lg"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <span className="text-xs font-bold text-indigo-400 font-mono">
                    {role.id}
                  </span>
                  <p className="text-xs font-bold text-white mt-0.5">{role.title}</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 uppercase">
                  Riesgo: {role.riskLevel}
                </span>
              </div>
              <p className="text-xs text-slate-400">{role.description}</p>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  Permisos Asignados ({role.permissions.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300"
                    >
                      {p.area}: {p.level}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "api" && (
        <div className="space-y-3">
          {API_CONTRACTS.map((contract) => (
            <div
              key={contract.id}
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 shadow-lg"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-mono font-bold uppercase ${
                      contract.method === "GET"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : contract.method === "POST"
                        ? "bg-cyan-500/20 text-cyan-300"
                        : contract.method === "PUT"
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-rose-500/20 text-rose-300"
                    }`}
                  >
                    {contract.method}
                  </span>
                  <span className="text-xs font-mono font-bold text-white">
                    {contract.path}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  Auth: {contract.authRequirement}
                </span>
              </div>
              <p className="text-xs text-slate-400">{contract.description}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "receiver_plan" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Plan de Archivos 0K-12B:</strong> Define la arquitectura de servidor mínima que recibirá webhooks e interacciones web sin habilitar endpoints en el cliente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {BACKEND_RECEIVER_FILE_PLAN_ITEMS.map((file) => (
              <div
                key={file.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    {file.path}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    {file.area}
                  </span>
                </div>
                <p className="text-xs font-bold text-white">{file.title}</p>
                <p className="text-[11px] text-slate-400">{file.purpose}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3 border-t border-amber-500/30 pt-6">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-amber-500/30" />
              <h3 className="text-sm font-bold uppercase tracking-wide text-amber-200">
                Backend Receiver Manual Test Console
              </h3>
              <div className="h-px flex-1 bg-amber-500/30" />
            </div>
            <BackendReceiverTestConsole />
          </div>
        </div>
      )}
    </div>
  );
};
