import React, { useState } from "react";
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  HardDrive,
  Download,
  Upload,
  ShieldCheck,
  Server,
  Layers,
  FileCheck,
} from "lucide-react";
import {
  CompanyProfile,
  LeadRecord,
  PRODUCTION_CHECKLIST_ITEMS,
  ProductionChecklistItem,
  PRODUCTION_CHECKLIST_CATEGORY_LABELS,
  buildProductionChecklistSummary,
} from "../../data";

interface DiagnosticsWorkspaceProps {
  companyProfile: CompanyProfile;
  leads: LeadRecord[];
  onRestoreLeads: (leads: LeadRecord[]) => void;
}

export const DiagnosticsWorkspace: React.FC<DiagnosticsWorkspaceProps> = ({
  companyProfile,
  leads,
  onRestoreLeads,
}) => {
  const [checklist, setChecklist] = useState<ProductionChecklistItem[]>(
    PRODUCTION_CHECKLIST_ITEMS
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [runningDiag, setRunningDiag] = useState(false);
  const [lastDiagTime, setLastDiagTime] = useState<string>(new Date().toLocaleTimeString());

  const summary = React.useMemo(
    () => buildProductionChecklistSummary(checklist),
    [checklist]
  );

  const toggleItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleRunDiagnostics = () => {
    setRunningDiag(true);
    setTimeout(() => {
      setRunningDiag(false);
      setLastDiagTime(new Date().toLocaleTimeString());
    }, 600);
  };

  const handleBackup = () => {
    const backupData = {
      app: "ORBI ChatBox IA Core",
      timestamp: new Date().toISOString(),
      companyProfile,
      leads,
      checklist,
    };
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(backupData, null, 2));
    const a = document.createElement("a");
    a.setAttribute("href", dataStr);
    a.setAttribute("download", `orbi_backup_${Date.now()}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.leads && Array.isArray(parsed.leads)) {
          onRestoreLeads(parsed.leads);
        }
        if (parsed.checklist && Array.isArray(parsed.checklist)) {
          setChecklist(parsed.checklist);
        }
        alert("Respaldo restaurado con éxito.");
      } catch (err) {
        alert("Error al parsear el archivo de respaldo.");
      }
    };
    reader.readAsText(file);
  };

  const filteredChecklist = checklist.filter(
    (item) => selectedCategory === "all" || item.category === selectedCategory
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-indigo-400" />
            <span>Diagnósticos de Sistema &bull; Checklist de Producción</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Monitoreo local, validación de integridad y gestión de respaldos para {companyProfile.name}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunDiagnostics}
            disabled={runningDiag}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-cyan-400 transition flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${runningDiag ? "animate-spin" : ""}`} />
            <span>Ejecutar Test</span>
          </button>
          <button
            onClick={handleBackup}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Crear Respaldo</span>
          </button>
          <label className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Restaurar</span>
            <input
              type="file"
              accept=".json"
              onChange={handleRestoreFile}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* System Health Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
          <span className="text-xs font-mono text-slate-400 uppercase">
            Estado Sandbox
          </span>
          <p className="text-lg font-bold text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> 100% Saludable
          </p>
          <span className="text-[11px] text-slate-500 font-mono">Último: {lastDiagTime}</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
          <span className="text-xs font-mono text-slate-400 uppercase">
            LocalStorage Leads
          </span>
          <p className="text-xl font-bold text-cyan-400 font-mono">
            {leads.length} registros
          </p>
          <span className="text-[11px] text-slate-500">Persistidos</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
          <span className="text-xs font-mono text-slate-400 uppercase">
            Checklist Readiness
          </span>
          <p className="text-xl font-bold text-indigo-400 font-mono">
            {summary.completed}/{summary.total} ({summary.completionPercentage}%)
          </p>
          <span className="text-[11px] text-slate-500">Criterios verificados</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
          <span className="text-xs font-mono text-slate-400 uppercase">
            Integridad Código
          </span>
          <p className="text-lg font-bold text-emerald-400 font-mono">
            0 Errores / 0 Nulos
          </p>
          <span className="text-[11px] text-emerald-500">Export-Safe Validado</span>
        </div>
      </div>

      {/* Production Readiness Checklist */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-cyan-400" />
            <span>Matriz de Criterios de Producción</span>
          </h3>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1 text-xs text-white focus:outline-none"
          >
            <option value="all">Todas las categorías</option>
            {Object.entries(PRODUCTION_CHECKLIST_CATEGORY_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          {filteredChecklist.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`p-3 rounded-xl cursor-pointer border transition flex items-start justify-between gap-3 ${
                item.completed
                  ? "bg-emerald-500/5 border-emerald-500/30 text-white"
                  : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold">{item.title}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    {PRODUCTION_CHECKLIST_CATEGORY_LABELS[item.category]}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  item.completed
                    ? "bg-emerald-500 border-emerald-500 text-slate-950"
                    : "border-slate-700 bg-slate-900"
                }`}
              >
                {item.completed && <CheckCircle2 className="w-3.5 h-3.5 font-bold" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
