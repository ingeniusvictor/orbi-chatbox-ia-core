// ORBI ChatBox IA Core — AppPremium.tsx (Modular Export-Safe Orchestrator)
import React, { useState, useEffect } from "react";
import {
  InterfaceMode,
  OrbiPremiumWorkspaceId,
  OrbiWorkspaceViewMode,
  CompanyProfile,
  LeadRecord,
  loadStoredCompanyProfile,
  loadStoredLeads,
  saveStoredLeads,
  saveStoredCompanyProfile,
} from "./data";
import {
  HeaderNavigation,
  FooterGuardrails,
} from "./components/common";
import {
  OverviewWorkspace,
  ChatStudioWorkspace,
  WebWidgetWorkspace,
  WhatsAppFutureWorkspace,
  LeadIntelligenceWorkspace,
  KnowledgeBaseWorkspace,
  ReportsWorkspace,
  DiagnosticsWorkspace,
  BackendRoadmapWorkspace,
  SettingsWorkspace,
} from "./components/workspaces";

export default function App() {
  const [activeWorkspace, setActiveWorkspace] =
    useState<OrbiPremiumWorkspaceId>("overview");
  const [viewMode, setViewMode] = useState<OrbiWorkspaceViewMode>("single");
  const [interfaceMode, setInterfaceMode] = useState<InterfaceMode>(() => {
    try {
      const stored = localStorage.getItem("orbi_interface_mode");
      if (stored === "full_app" || stored === "web_widget") {
        return stored as InterfaceMode;
      }
    } catch (e) {
      console.error("Error loading interface mode", e);
    }
    return "full_app";
  });

  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(() =>
    loadStoredCompanyProfile()
  );

  const [leads, setLeads] = useState<LeadRecord[]>(() => loadStoredLeads());

  useEffect(() => {
    try {
      localStorage.setItem("orbi_interface_mode", interfaceMode);
    } catch (e) {
      console.error("Error saving interface mode", e);
    }
  }, [interfaceMode]);

  const handleAddLead = (newLead: LeadRecord) => {
    setLeads((prev) => {
      const updated = [newLead, ...prev.filter((l) => l.id !== newLead.id)];
      saveStoredLeads(updated);
      return updated;
    });
  };

  const handleClearLeads = () => {
    if (confirm("¿Estás seguro de que deseas eliminar los prospectos en memoria?")) {
      setLeads([]);
      saveStoredLeads([]);
    }
  };

  const handleRestoreLeads = (restoredLeads: LeadRecord[]) => {
    setLeads(restoredLeads);
    saveStoredLeads(restoredLeads);
  };

  const handleUpdateProfile = (updatedProfile: CompanyProfile) => {
    setCompanyProfile(updatedProfile);
    saveStoredCompanyProfile(updatedProfile);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Header & Workspace Navigator */}
      <HeaderNavigation
        activeWorkspace={activeWorkspace}
        setActiveWorkspace={setActiveWorkspace}
        viewMode={viewMode}
        setViewMode={setViewMode}
        interfaceMode={interfaceMode}
        setInterfaceMode={setInterfaceMode}
        companyName={companyProfile.companyName}
        totalLeads={leads.length}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:py-8 space-y-12">
        {/* Render Single Workspace Mode */}
        {viewMode === "single" && (
          <>
            {activeWorkspace === "overview" && (
              <OverviewWorkspace
                companyProfile={companyProfile}
                leads={leads}
                setActiveWorkspace={setActiveWorkspace}
              />
            )}

            {activeWorkspace === "chat_studio" && (
              <ChatStudioWorkspace
                companyProfile={companyProfile}
                leads={leads}
                onAddLead={handleAddLead}
              />
            )}

            {activeWorkspace === "web_widget" && (
              <WebWidgetWorkspace
                companyProfile={companyProfile}
                leads={leads}
                onAddLead={handleAddLead}
              />
            )}

            {activeWorkspace === "whatsapp_future" && (
              <WhatsAppFutureWorkspace
                companyProfile={companyProfile}
                leads={leads}
                onAddLead={handleAddLead}
              />
            )}

            {activeWorkspace === "lead_intelligence" && (
              <LeadIntelligenceWorkspace
                companyProfile={companyProfile}
                leads={leads}
                onClearLeads={handleClearLeads}
              />
            )}

            {activeWorkspace === "knowledge_base" && (
              <KnowledgeBaseWorkspace companyProfile={companyProfile} />
            )}

            {activeWorkspace === "reports" && (
              <ReportsWorkspace
                companyProfile={companyProfile}
                leads={leads}
              />
            )}

            {activeWorkspace === "diagnostics" && (
              <DiagnosticsWorkspace
                companyProfile={companyProfile}
                leads={leads}
                onRestoreLeads={handleRestoreLeads}
              />
            )}

            {activeWorkspace === "backend_roadmap" && (
              <BackendRoadmapWorkspace companyProfile={companyProfile} />
            )}

            {activeWorkspace === "settings" && (
              <SettingsWorkspace
                companyProfile={companyProfile}
                onUpdateProfile={handleUpdateProfile}
              />
            )}
          </>
        )}

        {/* Render All Workspaces (Dashboard Mode) */}
        {viewMode === "all" && (
          <div className="space-y-16">
            <OverviewWorkspace
              companyProfile={companyProfile}
              leads={leads}
              setActiveWorkspace={setActiveWorkspace}
            />

            <div className="pt-8 border-t border-slate-800">
              <ChatStudioWorkspace
                companyProfile={companyProfile}
                leads={leads}
                onAddLead={handleAddLead}
              />
            </div>

            <div className="pt-8 border-t border-slate-800">
              <WebWidgetWorkspace
                companyProfile={companyProfile}
                leads={leads}
                onAddLead={handleAddLead}
              />
            </div>

            <div className="pt-8 border-t border-slate-800">
              <WhatsAppFutureWorkspace
                companyProfile={companyProfile}
                leads={leads}
                onAddLead={handleAddLead}
              />
            </div>

            <div className="pt-8 border-t border-slate-800">
              <LeadIntelligenceWorkspace
                companyProfile={companyProfile}
                leads={leads}
                onClearLeads={handleClearLeads}
              />
            </div>

            <div className="pt-8 border-t border-slate-800">
              <KnowledgeBaseWorkspace companyProfile={companyProfile} />
            </div>

            <div className="pt-8 border-t border-slate-800">
              <ReportsWorkspace
                companyProfile={companyProfile}
                leads={leads}
              />
            </div>

            <div className="pt-8 border-t border-slate-800">
              <DiagnosticsWorkspace
                companyProfile={companyProfile}
                leads={leads}
                onRestoreLeads={handleRestoreLeads}
              />
            </div>

            <div className="pt-8 border-t border-slate-800">
              <BackendRoadmapWorkspace companyProfile={companyProfile} />
            </div>

            <div className="pt-8 border-t border-slate-800">
              <SettingsWorkspace
                companyProfile={companyProfile}
                onUpdateProfile={handleUpdateProfile}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer & Production Guardrails */}
      <FooterGuardrails />
    </div>
  );
}
