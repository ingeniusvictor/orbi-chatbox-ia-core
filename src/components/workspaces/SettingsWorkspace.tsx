import React, { useState } from "react";
import {
  Settings,
  Building2,
  Save,
  RotateCcw,
  Check,
  Briefcase,
  PhoneCall,
  Mail,
  Globe,
  Sparkles,
} from "lucide-react";
import {
  CompanyProfile,
  DEFAULT_ORBI_COMPANY_PROFILE,
  saveStoredCompanyProfile,
} from "../../data";

interface SettingsWorkspaceProps {
  companyProfile: CompanyProfile;
  onUpdateProfile: (profile: CompanyProfile) => void;
}

export const SettingsWorkspace: React.FC<SettingsWorkspaceProps> = ({
  companyProfile,
  onUpdateProfile,
}) => {
  const [formData, setFormData] = useState<CompanyProfile>(companyProfile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field: keyof CompanyProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    saveStoredCompanyProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetDefaults = () => {
    if (confirm("¿Restaurar los valores de perfil corporativo por defecto?")) {
      setFormData(DEFAULT_ORBI_COMPANY_PROFILE);
      onUpdateProfile(DEFAULT_ORBI_COMPANY_PROFILE);
      saveStoredCompanyProfile(DEFAULT_ORBI_COMPANY_PROFILE);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-300" />
            <span>Configuración Corporativa &bull; Perfil de Empresa</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Personaliza los datos de negocio, tono de respuesta y servicios ofrecidos por {companyProfile.companyName}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-400 hover:text-slate-200 transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer</span>
          </button>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6 shadow-xl">
          <h3 className="text-sm font-bold text-white pb-3 border-b border-slate-800 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>Identidad de la Empresa</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 uppercase">
                Nombre Comercial
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none transition"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 uppercase">
                Industria / Rubro
              </label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => handleChange("industry", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none transition"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 uppercase">
                Correo Electrónico de Contacto
              </label>
              <input
                type="email"
                value={formData.publicEmail || ""}
                onChange={(e) => handleChange("publicEmail", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 uppercase">
                Teléfono / WhatsApp de Atención
              </label>
              <input
                type="text"
                value={formData.publicPhone || ""}
                onChange={(e) => handleChange("publicPhone", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none transition"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-mono text-slate-400 uppercase">
                Sitio Web Oficial
              </label>
              <input
                type="text"
                value={formData.website || ""}
                onChange={(e) => handleChange("website", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none transition"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-mono text-slate-400 uppercase">
                Descripción del Negocio y Propuesta de Valor
              </label>
              <textarea
                value={formData.shortDescription}
                onChange={(e) => handleChange("shortDescription", e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none transition leading-relaxed"
              />
            </div>
          </div>

          {/* Services List Preview */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
              <span>Servicios y Soluciones Configurados ({formData.services.length})</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {formData.services.map((svc) => (
                <div
                  key={svc.id}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1"
                >
                  <span className="text-xs font-bold text-cyan-300 block">
                    {svc.name}
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {svc.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end pt-4 border-t border-slate-800 gap-3">
            {savedSuccess && (
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <Check className="w-4 h-4" /> ¡Configuración guardada en LocalStorage!
              </span>
            )}
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
