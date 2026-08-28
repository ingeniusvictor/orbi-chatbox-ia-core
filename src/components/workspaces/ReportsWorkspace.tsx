import React, { useState } from "react";
import {
  FileText,
  TrendingUp,
  Download,
  Copy,
  Check,
  Building2,
  PieChart,
  Users,
  Target,
  Sparkles,
} from "lucide-react";
import {
  CompanyProfile,
  LeadRecord,
  buildMultiChannelCommercialReport,
  buildMultiChannelCommercialReportText,
} from "../../data";

interface ReportsWorkspaceProps {
  companyProfile: CompanyProfile;
  leads: LeadRecord[];
}

export const ReportsWorkspace: React.FC<ReportsWorkspaceProps> = ({
  companyProfile,
  leads,
}) => {
  const [copiedReport, setCopiedReport] = useState(false);

  const report = React.useMemo(
    () => buildMultiChannelCommercialReport(leads),
    [leads]
  );

  const handleCopyReport = async () => {
    const text = buildMultiChannelCommercialReportText(report, companyProfile);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedReport(true);
      setTimeout(() => setCopiedReport(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadReport = () => {
    const text = buildMultiChannelCommercialReportText(report, companyProfile);
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte_comercial_${companyProfile.companyName.toLowerCase().replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-400" />
            <span>Reportes Comerciales &bull; Inteligencia Multi-Canal</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Resumen consolidado de conversión de prospectos, distribución por canal y análisis de demanda.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyReport}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 transition flex items-center gap-1.5"
          >
            {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
            <span>Copiar Reporte</span>
          </button>
          <button
            onClick={handleDownloadReport}
            className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar TXT</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-xs font-mono text-slate-400 uppercase">
            Total Prospectos
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {report.totalLeads}
          </p>
          <span className="text-[11px] text-emerald-400 font-medium">
            100% Procesados
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-xs font-mono text-slate-400 uppercase">
            Canal Web Demo
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">
            {report.byChannel.web_demo}
          </p>
          <span className="text-[11px] text-slate-400 font-mono">
            Widget / Sandbox
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-xs font-mono text-slate-400 uppercase">
            WhatsApp Future
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
            {report.byChannel.whatsapp_future}
          </p>
          <span className="text-[11px] text-slate-400 font-mono">
            Meta API Sandbox
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-xs font-mono text-slate-400 uppercase">
            Prioridad Alta / Crítica
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
            {report.byPriority.high + report.byPriority.critical}
          </p>
          <span className="text-[11px] text-amber-400 font-medium">
            Atención Inmediata
          </span>
        </div>
      </div>

      {/* Report Summary Card */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Vista Previa del Reporte Ejecutivo</span>
        </h3>

        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
          {buildMultiChannelCommercialReportText(report, companyProfile)}
        </pre>
      </div>
    </div>
  );
};
