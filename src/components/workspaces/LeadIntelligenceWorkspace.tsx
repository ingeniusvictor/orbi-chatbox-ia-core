import React, { useState } from "react";
import {
  Sparkles,
  Search,
  Filter,
  Download,
  Trash2,
  Copy,
  Check,
  User,
  Mail,
  PhoneCall,
  Building2,
  Calendar,
  Layers,
  ArrowUpDown,
} from "lucide-react";
import {
  CompanyProfile,
  LeadRecord,
  PRIORITY_LABELS,
  CUSTOMER_TYPE_LABELS,
  CHAT_CHANNEL_LABELS,
} from "../../data";

interface LeadIntelligenceWorkspaceProps {
  companyProfile: CompanyProfile;
  leads: LeadRecord[];
  onClearLeads: () => void;
}

export const LeadIntelligenceWorkspace: React.FC<LeadIntelligenceWorkspaceProps> = ({
  companyProfile,
  leads,
  onClearLeads,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(leads[0] || null);
  const [copiedJson, setCopiedJson] = useState(false);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      (lead.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.phone || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.company || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.detectedService || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority =
      priorityFilter === "all" || lead.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  const handleExportJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(leads, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `orbi_leads_${companyProfile.name.toLowerCase().replace(/\s+/g, "_")}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(leads, null, 2));
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
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
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <span>Lead Intelligence &bull; Centro de Captura</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Prospectos calificados automáticamente mediante el motor de reglas de {companyProfile.name}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyJson}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 transition flex items-center gap-1.5"
          >
            {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copiar JSON</span>
          </button>
          <button
            onClick={handleExportJson}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar ({leads.length})</span>
          </button>
          {leads.length > 0 && (
            <button
              onClick={onClearLeads}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-800 text-slate-400 hover:text-rose-400 transition"
              title="Limpiar leads"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, email, teléfono, empresa o servicio..."
            className="w-full bg-slate-900/80 border border-slate-800 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition"
          >
            <option value="all">Todas las prioridades</option>
            <option value="high">Prioridad Alta</option>
            <option value="medium">Prioridad Media</option>
            <option value="low">Prioridad Baja</option>
          </select>
        </div>
      </div>

      {/* Grid: Leads List + Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads Table List */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-xl">
          {filteredLeads.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-400">
                No hay prospectos que coincidan con la búsqueda.
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Envía mensajes de prueba en Chat Studio o el Web Widget para generar prospectos en tiempo real.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                    <th className="p-3 font-semibold">Prospecto / Contacto</th>
                    <th className="p-3 font-semibold">Servicio de Interés</th>
                    <th className="p-3 font-semibold">Canal</th>
                    <th className="p-3 font-semibold">Prioridad</th>
                    <th className="p-3 font-semibold">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {filteredLeads.map((lead) => {
                    const isSelected = selectedLead?.id === lead.id;
                    return (
                      <tr
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className={`cursor-pointer transition ${
                          isSelected
                            ? "bg-cyan-500/10 text-white"
                            : "hover:bg-slate-800/40 text-slate-300"
                        }`}
                      >
                        <td className="p-3">
                          <p className="font-bold text-white">
                            {lead.name || "Sin nombre"}
                          </p>
                          <p className="text-[11px] font-mono text-slate-400">
                            {lead.email || lead.phone || "Sin contacto directo"}
                          </p>
                        </td>
                        <td className="p-3 text-cyan-400 font-medium">
                          {lead.detectedService || "Consulta general"}
                        </td>
                        <td className="p-3 font-mono text-[11px] text-slate-400">
                          {CHAT_CHANNEL_LABELS[lead.channel]}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              lead.priority === "high"
                                ? "bg-rose-500/20 text-rose-300"
                                : lead.priority === "medium"
                                ? "bg-amber-500/20 text-amber-300"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {PRIORITY_LABELS[lead.priority]}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-[10px] text-slate-500">
                          {lead.createdAt}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Lead Detail Card */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white pb-2 border-b border-slate-800 flex items-center justify-between">
              <span>Ficha Detallada del Lead</span>
              {selectedLead && (
                <span className="text-[10px] font-mono text-cyan-400">
                  {selectedLead.id}
                </span>
              )}
            </h3>

            {selectedLead ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-500">
                    Mensaje Original
                  </span>
                  <p className="text-slate-300 leading-relaxed italic">
                    "{selectedLead.rawMessage}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-500">
                      Tipo Cliente
                    </span>
                    <p className="font-semibold text-white">
                      {CUSTOMER_TYPE_LABELS[selectedLead.customerType]}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-500">
                      Confianza IA
                    </span>
                    <p className="font-mono font-bold text-emerald-400">
                      {Math.round(selectedLead.confidenceScore * 100)}%
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800 text-slate-300">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-400">Nombre:</span>
                    <span className="font-semibold text-white">
                      {selectedLead.name || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-400">Email:</span>
                    <span className="font-mono text-cyan-400">
                      {selectedLead.email || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-400">Teléfono:</span>
                    <span className="font-mono text-slate-200">
                      {selectedLead.phone || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-400">Empresa:</span>
                    <span className="font-semibold text-slate-200">
                      {selectedLead.company || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic text-center py-6">
                Selecciona un prospecto de la tabla para ver su ficha completa.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
