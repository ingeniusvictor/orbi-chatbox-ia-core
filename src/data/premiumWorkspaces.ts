// ORBI ChatBox IA Core — Premium Workspaces & Knowledge Engine Data
import {
  CompanyProfile, Message, analyzeCustomerMessage, appendLeadRecord, generateAssistantReply
} from "./companyData";
import {
  ORBI_CHATBOX_ACTIVE_BLOCK, ORBI_CHATBOX_ACTIVE_MODULE, ORBI_CHATBOX_ACTIVE_MODULE_TITLE, ORBI_CHATBOX_APP_VERSION, ORBI_MODULE_REGISTRY_STATUS_LABELS, OrbiModuleRegistryItem, PRIVATE_PILOT_SUCCESS_CATEGORY_LABELS, PRIVATE_PILOT_SUCCESS_RISK_LABELS, PRIVATE_PILOT_SUCCESS_STATUS_LABELS, PrivatePilotSuccessItem, TECHNICAL_HANDOFF_AREA_LABELS, TECHNICAL_HANDOFF_RISK_LABELS, TECHNICAL_HANDOFF_STATUS_LABELS, TECHNICAL_QA_AREA_LABELS, TECHNICAL_QA_RISK_LABELS, TECHNICAL_QA_STATUS_LABELS, TechnicalHandoffClosureItem, TechnicalHandoffItem, TechnicalQaItem, buildPrivatePilotSuccessSummary, buildTechnicalHandoffClosureSummary, buildTechnicalHandoffSummary, buildTechnicalQaSummary
} from "./moduleRegistry";

// ==========================================
// MÓDULO 0L-1A.2 — WORKSPACE & NAVIGATION MODEL
// ==========================================
export type OrbiPremiumWorkspaceId =
  | "overview"
  | "chat_studio"
  | "web_widget"
  | "whatsapp_future"
  | "lead_intelligence"
  | "knowledge_base"
  | "reports"
  | "diagnostics"
  | "backend_roadmap"
  | "settings";

export type OrbiWorkspaceViewMode = "workspace" | "full_audit";

export function shouldRenderPremiumWorkspace(
  workspace: OrbiPremiumWorkspaceId,
  activeWorkspace: OrbiPremiumWorkspaceId,
  viewMode: OrbiWorkspaceViewMode
): boolean {
  return viewMode === "full_audit" || workspace === activeWorkspace;
}

export const ORBI_PREMIUM_WORKSPACES_ORDER: OrbiPremiumWorkspaceId[] = [
  "overview",
  "chat_studio",
  "web_widget",
  "whatsapp_future",
  "lead_intelligence",
  "knowledge_base",
  "reports",
  "diagnostics",
  "backend_roadmap",
  "settings",
];

export const ORBI_PREMIUM_WORKSPACE_LABELS: Record<OrbiPremiumWorkspaceId, string> = {
  overview: "Overview",
  chat_studio: "Chat Studio",
  web_widget: "Web Widget",
  whatsapp_future: "WhatsApp Future",
  lead_intelligence: "Lead Intelligence",
  knowledge_base: "Knowledge Base",
  reports: "Reports",
  diagnostics: "Diagnostics",
  backend_roadmap: "Backend Roadmap",
  settings: "Settings",
};

export const ORBI_PREMIUM_WORKSPACE_DESCRIPTIONS: Record<
  OrbiPremiumWorkspaceId,
  string
> = {
  overview:
    "Resumen ejecutivo de estado, capacidades, versión activa y preparación comercial.",
  chat_studio:
    "Experiencia principal del asistente, conversación, análisis IA y derivación humana.",
  web_widget:
    "Modo widget web, embed controlado, runtime sandbox y pruebas de payloads.",
  whatsapp_future:
    "Bandeja simulada, respuestas sugeridas y preparación futura para WhatsApp Business.",
  lead_intelligence:
    "Captura, clasificación, scoring, handoff humano y resumen comercial de leads.",
  knowledge_base:
    "Base de conocimiento ORBI, Answer Engine local y trazabilidad de respuestas.",
  reports:
    "Reportes ejecutivos, backups, propuestas comerciales y documentación copiable.",
  diagnostics:
    "Diagnóstico, readiness, QA, seguridad, auditoría y checklist de release.",
  backend_roadmap:
    "Plan de backend receiver mínimo, stack decision, file plan y build readiness.",
  settings:
    "Perfil de empresa, servicios, contactos humanos y configuración visual/demo.",
};

export interface OrbiCapabilityMapItem {
  id: string;
  name: string;
  workspaceId: OrbiPremiumWorkspaceId;
  status: "active" | "sandbox" | "planned" | "blocked";
  description: string;
  badge: string;
}

export const ORBI_CAPABILITY_MAP: OrbiCapabilityMapItem[] = [
  {
    id: "cap-chat",
    name: "Chat Experience",
    workspaceId: "chat_studio",
    status: "active",
    description: "Conversación fluida, tono empático y calificación comercial en tiempo real.",
    badge: "MOTOR IA ACTIVO",
  },
  {
    id: "cap-widget",
    name: "Web Widget Runtime",
    workspaceId: "web_widget",
    status: "active",
    description: "Embed sandbox controlado, iframe seguro y botón flotante personalizable.",
    badge: "EMBED LISTO",
  },
  {
    id: "cap-whatsapp",
    name: "WhatsApp Future Simulation",
    workspaceId: "whatsapp_future",
    status: "sandbox",
    description: "Bandeja simulada 24/7, templates oficiales y webhook receiver en memoria.",
    badge: "SANDBOX META CLOUD",
  },
  {
    id: "cap-leads",
    name: "Lead Intelligence",
    workspaceId: "lead_intelligence",
    status: "active",
    description: "Captura heurística, scoring 0-100, temperatura comercial y CRM exportable.",
    badge: "SCORING AUTOMÁTICO",
  },
  {
    id: "cap-knowledge",
    name: "Knowledge Answer Engine",
    workspaceId: "knowledge_base",
    status: "active",
    description: "Base de conocimiento corporativa 0K-10, match semántico y citas verificadas.",
    badge: "FUENTES OFICIALES",
  },
  {
    id: "cap-handoff",
    name: "Human Handoff",
    workspaceId: "chat_studio",
    status: "active",
    description: "Derivación con resumen comercial, token de sesión y trazabilidad de atención.",
    badge: "DERIVACIÓN 24/7",
  },
  {
    id: "cap-reports",
    name: "Reports & Backup",
    workspaceId: "reports",
    status: "active",
    description: "Métricas omnicanal, propuestas comerciales ejecutivas y backup JSON local.",
    badge: "EXPORTACIÓN LOCAL",
  },
  {
    id: "cap-testpack",
    name: "Website Test Pack",
    workspaceId: "diagnostics",
    status: "active",
    description: "Batería de validación web y execution board para pruebas de instalación.",
    badge: "QA VERIFICADO",
  },
  {
    id: "cap-backend",
    name: "Minimal Backend Plan",
    workspaceId: "backend_roadmap",
    status: "planned",
    description: "Arquitectura receiver Express/Node.js validada con CONDITIONAL GO.",
    badge: "CONDITIONAL GO",
  },
];

export const ORBI_WORKSPACE_SUGGESTED_ACTIONS: Record<OrbiPremiumWorkspaceId, string> = {
  overview: "Revisar el mapa de capacidades, métricas de actividad y readiness antes de exportar ZIP.",
  chat_studio: "Interactuar con el simulador de chat y evaluar la extracción heurística de leads y derivación.",
  web_widget: "Probar el botón flotante y verificar la instalación mediante snippet HTML o iframe sandbox.",
  whatsapp_future: "Simular recepción de mensajes entrantes y evaluar respuestas automáticas en la bandeja WhatsApp.",
  lead_intelligence: "Revisar los prospectos capturados, clasificaciones por temperatura y descargar el reporte CSV/JSON.",
  knowledge_base: "Explorar la base de conocimiento corporativa, reglas de seguridad y validación de respuestas.",
  reports: "Generar propuestas comerciales para clientes o exportar el backup completo en formato JSON.",
  diagnostics: "Revisar el checklist de producción y la batería de pruebas de integración web.",
  backend_roadmap: "Consultar la arquitectura del receiver mínimo Node.js/Express y los contratos de API.",
  settings: "Personalizar el nombre de empresa, asistente virtual, servicios ofrecidos y contactos de derivación.",
};

export function buildOrbiModuleRegistrySummary(items: OrbiModuleRegistryItem[]) {
  const total = items.length;
  const completed = items.filter((item) => item.status === "completed").length;
  const active = items.filter((item) => item.status === "active").length;
  const planned = items.filter((item) => item.status === "planned").length;

  return {
    total,
    completed,
    active,
    planned,
  };
}

export function buildPrivatePilotSuccessPackText(params: {
  profile: CompanyProfile;
  successItems: PrivatePilotSuccessItem[];
  registryItems: OrbiModuleRegistryItem[];
  successSummary: ReturnType<typeof buildPrivatePilotSuccessSummary>;
  registrySummary: ReturnType<typeof buildOrbiModuleRegistrySummary>;
}): string {
  const {
    profile,
    successItems,
    registryItems,
    successSummary,
    registrySummary,
  } = params;

  const successText = successItems
    .map((item) => {
      return `PILOT SUCCESS ITEM: ${item.title}
Categoría: ${PRIVATE_PILOT_SUCCESS_CATEGORY_LABELS[item.category]}
Estado: ${PRIVATE_PILOT_SUCCESS_STATUS_LABELS[item.status]}
Riesgo: ${PRIVATE_PILOT_SUCCESS_RISK_LABELS[item.risk]}

Resumen:
${item.summary}

Criterios:
${item.criteria.map((criterion) => `- ${criterion}`).join("\n")}

Evidencias:
${item.evidence.map((evidence) => `- ${evidence}`).join("\n")}

Regla de decisión:
${item.decisionRule}`;
    })
    .join("\n\n---\n\n");

  const registryText = registryItems
    .map((item) => {
      return `MÓDULO: ${item.module} — ${item.title}
Bloque: ${item.block}
Versión: ${item.versionTag}
Estado: ${ORBI_MODULE_REGISTRY_STATUS_LABELS[item.status]}

Resumen:
${item.summary}

Evidencias:
${item.implementedEvidence.map((evidence) => `- ${evidence}`).join("\n")}

Siguiente paso:
${item.nextStep}`;
    })
    .join("\n\n---\n\n");

  return `PRIVATE PILOT SUCCESS PACK + MODULE REGISTRY — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

VERSIÓN ACTIVA
App version: ${ORBI_CHATBOX_APP_VERSION}
Bloque activo: ${ORBI_CHATBOX_ACTIVE_BLOCK}
Módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE}
Título módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE_TITLE}

RESUMEN PILOTO
Ítems: ${successSummary.total}
Requeridos: ${successSummary.required}
Bloqueantes: ${successSummary.blocking}
Recomendados: ${successSummary.recommended}
Riesgo crítico: ${successSummary.criticalRisk}

RESUMEN REGISTRY
Módulos registrados: ${registrySummary.total}
Completados: ${registrySummary.completed}
Activos: ${registrySummary.active}
Planificados: ${registrySummary.planned}

CRITERIOS DE PILOTO
${successText}

MODULE REGISTRY
${registryText}

NOTA
Este Private Pilot Success Pack es conceptual. No crea backend, no conecta APIs, no crea base de datos, no modifica localStorage y no habilita producción.`;
}


export function buildTechnicalHandoffPackText(params: {
  profile: CompanyProfile;
  items: TechnicalHandoffItem[];
  summary: ReturnType<typeof buildTechnicalHandoffSummary>;
  registrySummary: ReturnType<typeof buildOrbiModuleRegistrySummary>;
}): string {
  const { profile, items, summary, registrySummary } = params;

  const itemsText = items
    .map((item) => {
      return `TECHNICAL HANDOFF ITEM: ${item.title}
Área: ${TECHNICAL_HANDOFF_AREA_LABELS[item.area]}
Estado: ${TECHNICAL_HANDOFF_STATUS_LABELS[item.status]}
Riesgo: ${TECHNICAL_HANDOFF_RISK_LABELS[item.risk]}

Resumen:
${item.summary}

Stack recomendado:
${item.recommendedStack.map((stack) => `- ${stack}`).join("\n")}

Tareas técnicas:
${item.technicalTasks.map((task) => `- ${task}`).join("\n")}

Dependencias:
${item.dependencies.map((dependency) => `- ${dependency}`).join("\n")}

Riesgos de implementación:
${item.implementationRisks.map((risk) => `- ${risk}`).join("\n")}

Próximo paso:
${item.nextStep}`;
    })
    .join("\n\n---\n\n");

  return `TECHNICAL HANDOFF PACK BASE — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

VERSIÓN ACTIVA
App version: ${ORBI_CHATBOX_APP_VERSION}
Bloque activo: ${ORBI_CHATBOX_ACTIVE_BLOCK}
Módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE}
Título módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE_TITLE}

RESUMEN HANDOFF
Ítems técnicos: ${summary.total}
Requeridos antes de construir: ${summary.requiredBeforeBuild}
Recomendados: ${summary.recommended}
Bloqueados: ${summary.blocked}
Riesgo crítico: ${summary.criticalRisk}

RESUMEN MODULE REGISTRY
Módulos registrados: ${registrySummary.total}
Completados: ${registrySummary.completed}
Activos: ${registrySummary.active}
Planificados: ${registrySummary.planned}

DETALLE
${itemsText}

NOTA
Este Technical Handoff Pack es conceptual. No crea backend, no conecta APIs, no crea base de datos, no modifica localStorage y no habilita producción.`;
}


export function buildTechnicalQaChecklistText(params: {
  profile: CompanyProfile;
  items: TechnicalQaItem[];
  closureItems: TechnicalHandoffClosureItem[];
  qaSummary: ReturnType<typeof buildTechnicalQaSummary>;
  closureSummary: ReturnType<typeof buildTechnicalHandoffClosureSummary>;
  registrySummary: ReturnType<typeof buildOrbiModuleRegistrySummary>;
}): string {
  const {
    profile,
    items,
    closureItems,
    qaSummary,
    closureSummary,
    registrySummary,
  } = params;

  const itemsText = items
    .map((item) => {
      return `TECHNICAL QA ITEM: ${item.title}
Área: ${TECHNICAL_QA_AREA_LABELS[item.area]}
Estado: ${TECHNICAL_QA_STATUS_LABELS[item.status]}
Riesgo: ${TECHNICAL_QA_RISK_LABELS[item.risk]}

Objetivo:
${item.objective}

Checks:
${item.checks.map((check) => `- ${check}`).join("\n")}

Evidencias requeridas:
${item.requiredEvidence.map((evidence) => `- ${evidence}`).join("\n")}

Bloqueos:
${item.blockers.map((blocker) => `- ${blocker}`).join("\n")}

Condición de aprobación:
${item.passCondition}`;
    })
    .join("\n\n---\n\n");

  const closureText = closureItems
    .map((item) => {
      return `${item.completed ? "✓" : "○"} ${item.title}
${item.description}`;
    })
    .join("\n\n");

  return `TECHNICAL QA CHECKLIST — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

VERSIÓN ACTIVA
App version: ${ORBI_CHATBOX_APP_VERSION}
Bloque activo: ${ORBI_CHATBOX_ACTIVE_BLOCK}
Módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE}
Título módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE_TITLE}

RESUMEN QA
Ítems QA: ${qaSummary.total}
Antes de build: ${qaSummary.beforeBuild}
Antes de piloto: ${qaSummary.beforePilot}
Antes de MVP público: ${qaSummary.beforePublicMvp}
Bloqueados: ${qaSummary.blocked}
Riesgo crítico: ${qaSummary.criticalRisk}

CIERRE BLOQUE 0K-7
Cierre completado: ${closureSummary.completed}/${closureSummary.total}
Progreso: ${closureSummary.progress}%

RESUMEN MODULE REGISTRY
Módulos registrados: ${registrySummary.total}
Completados: ${registrySummary.completed}
Activos: ${registrySummary.active}
Planificados: ${registrySummary.planned}

QA CHECKLIST
${itemsText}

CIERRE
${closureText}

NOTA
Este Technical QA Checklist es conceptual. No crea backend, no conecta APIs, no crea base de datos, no modifica localStorage y no habilita producción.`;
}


export type WebWidgetRuntimeStatus =
  | "received"
  | "analyzed"
  | "lead_candidate"
  | "requires_human_review"
  | "discarded";

export type WebWidgetRuntimeChannel =
  | "embedded_widget_test"
  | "external_page_future"
  | "manual_payload_test";

export type WebWidgetRuntimeRisk = "low" | "medium" | "high";

export type WebWidgetIncomingPayload = {
  id: string;
  receivedAt: string;
  channel: WebWidgetRuntimeChannel;
  publicKey: string;
  pageUrl: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string;
  message: string;
  consentAccepted: boolean;
  status: WebWidgetRuntimeStatus;
  risk: WebWidgetRuntimeRisk;
  analysisSummary: string;
  recommendedAction: string;
};

export const WEB_WIDGET_RUNTIME_STATUS_LABELS: Record<
  WebWidgetRuntimeStatus,
  string
> = {
  received: "Recibido",
  analyzed: "Analizado",
  lead_candidate: "Candidato a lead",
  requires_human_review: "Revisión humana",
  discarded: "Descartado",
};

export const WEB_WIDGET_RUNTIME_CHANNEL_LABELS: Record<
  WebWidgetRuntimeChannel,
  string
> = {
  embedded_widget_test: "Widget embebido test",
  external_page_future: "Página externa futura",
  manual_payload_test: "Payload manual test",
};

export const WEB_WIDGET_RUNTIME_RISK_LABELS: Record<WebWidgetRuntimeRisk, string> = {
  low: "Bajo",
  medium: "Medio",
  high: "Alto",
};

export function createWebWidgetPayloadId() {
  return `web-widget-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getWebWidgetRuntimeRisk(payload: {
  consentAccepted: boolean;
  message: string;
  visitorEmail: string;
  visitorPhone: string;
}): WebWidgetRuntimeRisk {
  if (!payload.consentAccepted) return "high";
  if (payload.message.trim().length < 3) return "medium";
  if (!payload.visitorEmail.trim() && !payload.visitorPhone.trim()) {
    return "medium";
  }

  return "low";
}

export function getWebWidgetRuntimeStatus(payload: {
  consentAccepted: boolean;
  message: string;
  visitorEmail: string;
  visitorPhone: string;
}): WebWidgetRuntimeStatus {
  if (!payload.consentAccepted) return "requires_human_review";
  if (payload.message.trim().length < 3) return "discarded";
  if (payload.visitorEmail.trim() || payload.visitorPhone.trim()) {
    return "lead_candidate";
  }

  return "analyzed";
}

export function buildWebWidgetRuntimeSummary(items: WebWidgetIncomingPayload[]) {
  const total = items.length;

  const leadCandidates = items.filter(
    (item) => item.status === "lead_candidate"
  ).length;

  const requiresHumanReview = items.filter(
    (item) => item.status === "requires_human_review"
  ).length;

  const highRisk = items.filter((item) => item.risk === "high").length;

  const withConsent = items.filter((item) => item.consentAccepted).length;

  return {
    total,
    leadCandidates,
    requiresHumanReview,
    highRisk,
    withConsent,
  };
}

export function buildWebWidgetRuntimeReportText(params: {
  profile: CompanyProfile;
  items: WebWidgetIncomingPayload[];
  summary: ReturnType<typeof buildWebWidgetRuntimeSummary>;
  registrySummary: ReturnType<typeof buildOrbiModuleRegistrySummary>;
}): string {
  const { profile, items, summary, registrySummary } = params;

  const itemsText =
    items.length === 0
      ? "Sin mensajes recibidos en la bandeja temporal."
      : items
          .map((item) => {
            return `MENSAJE WEB: ${item.id}
Recibido: ${item.receivedAt}
Canal: ${WEB_WIDGET_RUNTIME_CHANNEL_LABELS[item.channel]}
Estado: ${WEB_WIDGET_RUNTIME_STATUS_LABELS[item.status]}
Riesgo: ${WEB_WIDGET_RUNTIME_RISK_LABELS[item.risk]}
Consentimiento: ${item.consentAccepted ? "Sí" : "No"}
Página origen: ${item.pageUrl}
Public key demo: ${item.publicKey}

Visitante:
${item.visitorName}
Correo: ${item.visitorEmail || "No informado"}
Teléfono: ${item.visitorPhone || "No informado"}

Mensaje:
${item.message}

Análisis:
${item.analysisSummary}

Acción recomendada:
${item.recommendedAction}`;
          })
          .join("\n\n---\n\n");

  return `WEB WIDGET TEST RUNTIME — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

VERSIÓN ACTIVA
App version: ${ORBI_CHATBOX_APP_VERSION}
Bloque activo: ${ORBI_CHATBOX_ACTIVE_BLOCK}
Módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE}
Título módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE_TITLE}

RESUMEN RUNTIME
Mensajes recibidos: ${summary.total}
Candidatos a lead: ${summary.leadCandidates}
Requieren revisión humana: ${summary.requiresHumanReview}
Riesgo alto: ${summary.highRisk}
Con consentimiento: ${summary.withConsent}

RESUMEN MODULE REGISTRY
Módulos registrados: ${registrySummary.total}
Completados: ${registrySummary.completed}
Activos: ${registrySummary.active}
Planificados: ${registrySummary.planned}

MENSAJES
${itemsText}

NOTA
Este Web Widget Test Runtime es una prueba local en memoria. No crea backend, no crea endpoints reales, no usa fetch, no conecta APIs, no modifica localStorage y no habilita producción.`;
}


export type ExternalDemoBridgeStatus =
  | "idle"
  | "ready"
  | "message_received"
  | "invalid_payload"
  | "blocked_by_consent";

export type ExternalDemoBridgeLogType =
  | "info"
  | "success"
  | "warning"
  | "error";

export type ExternalDemoBridgeLog = {
  id: string;
  createdAt: string;
  type: ExternalDemoBridgeLogType;
  message: string;
};

export type ExternalDemoBridgeMessage = {
  type: "ORBI_CHATBOX_WEB_WIDGET_TEST_MESSAGE";
  publicKey: string;
  pageUrl: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string;
  message: string;
  consentAccepted: boolean;
};

export const EXTERNAL_DEMO_BRIDGE_STATUS_LABELS: Record<
  ExternalDemoBridgeStatus,
  string
> = {
  idle: "Inactivo",
  ready: "Listo",
  message_received: "Mensaje recibido",
  invalid_payload: "Payload inválido",
  blocked_by_consent: "Bloqueado por consentimiento",
};

export const EXTERNAL_DEMO_BRIDGE_LOG_TYPE_LABELS: Record<
  ExternalDemoBridgeLogType,
  string
> = {
  info: "Info",
  success: "Correcto",
  warning: "Advertencia",
  error: "Error",
};

export function createExternalDemoBridgeLog(
  type: ExternalDemoBridgeLogType,
  message: string
): ExternalDemoBridgeLog {
  return {
    id: `bridge-log-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString(),
    type,
    message,
  };
}

export function isExternalDemoBridgeMessage(
  value: unknown
): value is ExternalDemoBridgeMessage {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<ExternalDemoBridgeMessage>;

  return (
    candidate.type === "ORBI_CHATBOX_WEB_WIDGET_TEST_MESSAGE" &&
    typeof candidate.publicKey === "string" &&
    typeof candidate.pageUrl === "string" &&
    typeof candidate.visitorName === "string" &&
    typeof candidate.visitorEmail === "string" &&
    typeof candidate.visitorPhone === "string" &&
    typeof candidate.message === "string" &&
    typeof candidate.consentAccepted === "boolean"
  );
}

export function sanitizeBridgeText(value: string, maxLength = 500) {
  return value.replace(/[<>]/g, "").trim().slice(0, maxLength);
}

export function buildExternalDemoPageHtml(params: {
  brandName: string;
  assistantName: string;
  publicKey: string;
}) {
  const { brandName, assistantName, publicKey } = params;

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>ORBI External Demo Page</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      font-family: Inter, Arial, sans-serif;
      background:
        radial-gradient(circle at top left, rgba(34, 211, 238, 0.22), transparent 32%),
        linear-gradient(135deg, #020617, #111827 58%, #0f172a);
      color: #e5e7eb;
      display: grid;
      place-items: center;
      padding: 24px;
      box-sizing: border-box;
    }
    .page {
      width: min(920px, 100%);
      border: 1px solid rgba(148, 163, 184, 0.25);
      border-radius: 28px;
      background: rgba(15, 23, 42, 0.82);
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.38);
      padding: 28px;
    }
    .badge {
      display: inline-flex;
      gap: 8px;
      align-items: center;
      border: 1px solid rgba(34, 211, 238, 0.35);
      color: #67e8f9;
      border-radius: 999px;
      padding: 8px 12px;
      font-size: 12px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    h1 {
      margin: 0 0 10px;
      font-size: clamp(28px, 5vw, 48px);
      line-height: 1.02;
    }
    p {
      color: #cbd5e1;
      line-height: 1.6;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 360px;
      gap: 20px;
      margin-top: 22px;
    }
    .card {
      border: 1px solid rgba(148, 163, 184, 0.2);
      border-radius: 22px;
      padding: 18px;
      background: rgba(2, 6, 23, 0.54);
    }
    label {
      display: grid;
      gap: 7px;
      font-size: 12px;
      color: #94a3b8;
      margin-bottom: 12px;
    }
    input, textarea {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid rgba(148, 163, 184, 0.24);
      background: rgba(15, 23, 42, 0.92);
      color: #f8fafc;
      border-radius: 14px;
      padding: 11px 12px;
      outline: none;
      font: inherit;
    }
    textarea {
      min-height: 92px;
      resize: vertical;
    }
    button {
      width: 100%;
      border: 0;
      border-radius: 16px;
      padding: 13px 16px;
      color: #04111d;
      background: linear-gradient(135deg, #67e8f9, #a78bfa);
      font-weight: 800;
      cursor: pointer;
      margin-top: 8px;
    }
    .mini {
      font-size: 12px;
      color: #94a3b8;
      margin-top: 12px;
    }
    @media (max-width: 760px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <main class="page">
    <span class="badge">ORBI External Demo · postMessage local</span>
    <h1>${brandName}</h1>
    <p>
      Esta es una página externa simulada. El formulario envía un mensaje local hacia
      ${assistantName} usando window.postMessage, sin backend, sin APIs y sin persistencia.
    </p>

    <div class="grid">
      <section class="card">
        <h2>Servicio demo</h2>
        <p>
          Simula una página empresarial donde un visitante escribe al chatbox ORBI
          desde un widget web embebido.
        </p>
        <p class="mini">
          Public key demo: ${publicKey}
        </p>
      </section>

      <section class="card">
        <label>
          Nombre
          <input id="visitorName" value="Visitante página demo" />
        </label>

        <label>
          Correo
          <input id="visitorEmail" value="cliente@empresa.cl" />
        </label>

        <label>
          Teléfono
          <input id="visitorPhone" value="+56 9 0000 0000" />
        </label>

        <label>
          Mensaje
          <textarea id="message">Hola, vi la página web y quiero saber cómo ORBI ChatBox puede atender consultas de clientes.</textarea>
        </label>

        <label>
          <span>
            <input id="consentAccepted" type="checkbox" checked />
            Acepto enviar este mensaje para prueba local.
          </span>
        </label>

        <button onclick="sendToOrbi()">Enviar a ORBI ChatBox</button>
        <p id="status" class="mini">Esperando envío local.</p>
      </section>
    </div>
  </main>

  <script>
    function readValue(id) {
      var el = document.getElementById(id);
      return el ? String(el.value || '') : '';
    }

    function sendToOrbi() {
      var consent = document.getElementById('consentAccepted');

      var payload = {
        type: 'ORBI_CHATBOX_WEB_WIDGET_TEST_MESSAGE',
        publicKey: '${publicKey}',
        pageUrl: 'iframe-srcdoc://orbi-external-demo-page',
        visitorName: readValue('visitorName'),
        visitorEmail: readValue('visitorEmail'),
        visitorPhone: readValue('visitorPhone'),
        message: readValue('message'),
        consentAccepted: Boolean(consent && consent.checked)
      };

      window.parent.postMessage(payload, '*');

      var status = document.getElementById('status');
      if (status) {
        status.textContent = 'Mensaje enviado localmente a ORBI ChatBox IA Core.';
      }
    }
  </script>
</body>
</html>`;
}

export function buildExternalDemoBridgeReportText(params: {
  profile: CompanyProfile;
  bridgeStatus: ExternalDemoBridgeStatus;
  logs: ExternalDemoBridgeLog[];
  runtimeSummary: ReturnType<typeof buildWebWidgetRuntimeSummary>;
  registrySummary: ReturnType<typeof buildOrbiModuleRegistrySummary>;
}): string {
  const { profile, bridgeStatus, logs, runtimeSummary, registrySummary } =
    params;

  const logsText =
    logs.length === 0
      ? "Sin logs del bridge."
      : logs
          .map((log) => {
            return `LOG: ${log.createdAt}
Tipo: ${EXTERNAL_DEMO_BRIDGE_LOG_TYPE_LABELS[log.type]}
Mensaje: ${log.message}`;
          })
          .join("\n\n---\n\n");

  return `EXTERNAL DEMO PAGE BRIDGE — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

VERSIÓN ACTIVA
App version: ${ORBI_CHATBOX_APP_VERSION}
Bloque activo: ${ORBI_CHATBOX_ACTIVE_BLOCK}
Módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE}
Título módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE_TITLE}

ESTADO BRIDGE
Estado: ${EXTERNAL_DEMO_BRIDGE_STATUS_LABELS[bridgeStatus]}

RUNTIME WEB
Mensajes recibidos: ${runtimeSummary.total}
Candidatos a lead: ${runtimeSummary.leadCandidates}
Requieren revisión humana: ${runtimeSummary.requiresHumanReview}
Riesgo alto: ${runtimeSummary.highRisk}
Con consentimiento: ${runtimeSummary.withConsent}

MODULE REGISTRY
Módulos registrados: ${registrySummary.total}
Completados: ${registrySummary.completed}
Activos: ${registrySummary.active}
Planificados: ${registrySummary.planned}

LOGS
${logsText}

NOTA
Este External Demo Page Bridge usa iframe srcDoc y window.postMessage en modo local. No crea backend, no crea endpoints, no usa fetch, no conecta APIs, no modifica localStorage y no habilita producción.`;
}


export type WebLeadIntakeStatus =
  | "new"
  | "qualified_demo"
  | "discarded"
  | "needs_human_review"
  | "ready_for_follow_up";

export type WebLeadIntakeSource =
  | "manual_widget_simulator"
  | "external_demo_bridge"
  | "future_real_website";

export type WebLeadIntakePriority = "low" | "medium" | "high" | "critical";

export type WebLeadDemoRecord = {
  id: string;
  sourcePayloadId: string;
  createdAt: string;
  source: WebLeadIntakeSource;
  status: WebLeadIntakeStatus;
  priority: WebLeadIntakePriority;
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string;
  pageUrl: string;
  message: string;
  consentAccepted: boolean;
  risk: WebWidgetRuntimeRisk;
  analysisSummary: string;
  recommendedAction: string;
  notes: string;
};

export const WEB_LEAD_INTAKE_STATUS_LABELS: Record<WebLeadIntakeStatus, string> = {
  new: "Nuevo",
  qualified_demo: "Lead demo calificado",
  discarded: "Descartado",
  needs_human_review: "Revisión humana",
  ready_for_follow_up: "Listo seguimiento",
};

export const WEB_LEAD_INTAKE_SOURCE_LABELS: Record<WebLeadIntakeSource, string> = {
  manual_widget_simulator: "Simulador widget manual",
  external_demo_bridge: "Bridge página demo",
  future_real_website: "Sitio web real futuro",
};

export const WEB_LEAD_INTAKE_PRIORITY_LABELS: Record<WebLeadIntakePriority, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  critical: "Crítica",
};

export function createWebLeadDemoId() {
  return `web-lead-demo-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}

export function getWebLeadIntakeSource(
  channel: WebWidgetRuntimeChannel
): WebLeadIntakeSource {
  if (channel === "external_page_future") return "external_demo_bridge";
  if (channel === "embedded_widget_test") return "manual_widget_simulator";
  return "manual_widget_simulator";
}

export function getWebLeadIntakePriority(
  payload: WebWidgetIncomingPayload
): WebLeadIntakePriority {
  if (!payload.consentAccepted) return "critical";
  if (payload.risk === "high") return "high";
  if (payload.status === "lead_candidate") return "high";
  if (payload.visitorEmail || payload.visitorPhone) return "medium";
  return "low";
}

export function getInitialWebLeadIntakeStatus(
  payload: WebWidgetIncomingPayload
): WebLeadIntakeStatus {
  if (!payload.consentAccepted) return "needs_human_review";
  if (payload.status === "discarded") return "discarded";
  if (payload.status === "lead_candidate") return "new";
  return "needs_human_review";
}

export function buildWebLeadIntakeSummary(items: WebLeadDemoRecord[]) {
  const total = items.length;

  const qualified = items.filter(
    (item) => item.status === "qualified_demo"
  ).length;

  const readyForFollowUp = items.filter(
    (item) => item.status === "ready_for_follow_up"
  ).length;

  const needsReview = items.filter(
    (item) => item.status === "needs_human_review"
  ).length;

  const discarded = items.filter((item) => item.status === "discarded").length;

  const criticalPriority = items.filter(
    (item) => item.priority === "critical"
  ).length;

  return {
    total,
    qualified,
    readyForFollowUp,
    needsReview,
    discarded,
    criticalPriority,
  };
}

export function buildWebLeadIntakeReportText(params: {
  profile: CompanyProfile;
  records: WebLeadDemoRecord[];
  candidatePayloads: WebWidgetIncomingPayload[];
  summary: ReturnType<typeof buildWebLeadIntakeSummary>;
  runtimeSummary: ReturnType<typeof buildWebWidgetRuntimeSummary>;
  registrySummary: ReturnType<typeof buildOrbiModuleRegistrySummary>;
}): string {
  const {
    profile,
    records,
    candidatePayloads,
    summary,
    runtimeSummary,
    registrySummary,
  } = params;

  const recordsText =
    records.length === 0
      ? "Sin leads demo creados en memoria."
      : records
          .map((record) => {
            return `WEB LEAD DEMO: ${record.id}
Creado: ${record.createdAt}
Fuente: ${WEB_LEAD_INTAKE_SOURCE_LABELS[record.source]}
Estado: ${WEB_LEAD_INTAKE_STATUS_LABELS[record.status]}
Prioridad: ${WEB_LEAD_INTAKE_PRIORITY_LABELS[record.priority]}
Riesgo: ${WEB_WIDGET_RUNTIME_RISK_LABELS[record.risk]}
Consentimiento: ${record.consentAccepted ? "Sí" : "No"}

Visitante:
${record.visitorName}
Correo: ${record.visitorEmail || "No informado"}
Teléfono: ${record.visitorPhone || "No informado"}
Página: ${record.pageUrl}

Mensaje:
${record.message}

Análisis:
${record.analysisSummary}

Acción recomendada:
${record.recommendedAction}

Notas:
${record.notes}`;
          })
          .join("\n\n---\n\n");

  return `WEB LEAD INTAKE BOARD — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

VERSIÓN ACTIVA
App version: ${ORBI_CHATBOX_APP_VERSION}
Bloque activo: ${ORBI_CHATBOX_ACTIVE_BLOCK}
Módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE}
Título módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE_TITLE}

RESUMEN LEAD INTAKE
Leads demo en memoria: ${summary.total}
Calificados demo: ${summary.qualified}
Listos para seguimiento: ${summary.readyForFollowUp}
Requieren revisión: ${summary.needsReview}
Descartados: ${summary.discarded}
Prioridad crítica: ${summary.criticalPriority}

RESUMEN RUNTIME WEB
Mensajes recibidos: ${runtimeSummary.total}
Candidatos detectados: ${runtimeSummary.leadCandidates}
Revisión humana: ${runtimeSummary.requiresHumanReview}
Riesgo alto: ${runtimeSummary.highRisk}
Con consentimiento: ${runtimeSummary.withConsent}

Candidatos pendientes de convertir: ${candidatePayloads.length}

RESUMEN MODULE REGISTRY
Módulos registrados: ${registrySummary.total}
Completados: ${registrySummary.completed}
Activos: ${registrySummary.active}
Planificados: ${registrySummary.planned}

LEADS DEMO
${recordsText}

NOTA
Este Web Lead Intake Board opera solo en memoria. No crea backend, no crea endpoints, no usa fetch, no conecta APIs, no modifica localStorage y no genera leads productivos reales.`;
}


export type WebRuntimeReadinessArea =
  | "payload_contract"
  | "postmessage_bridge"
  | "temporary_inbox"
  | "local_analysis"
  | "lead_intake"
  | "consent_scope"
  | "external_test"
  | "production_blocker";

export type WebRuntimeReadinessStatus =
  | "ready"
  | "partial"
  | "blocked"
  | "conditional"
  | "future";

export type WebRuntimeReadinessRisk = "low" | "medium" | "high" | "critical";

export type WebRuntimeReadinessItem = {
  id: string;
  title: string;
  area: WebRuntimeReadinessArea;
  status: WebRuntimeReadinessStatus;
  risk: WebRuntimeReadinessRisk;
  score: number;
  summary: string;
  completedEvidence: string[];
  requiredBeforeExternalTest: string[];
  blockers: string[];
  decision: string;
};

export type WebRuntimeClosureItem = {
  id: string;
  title: string;
  completed: boolean;
  description: string;
};

export const WEB_RUNTIME_READINESS_AREA_LABELS: Record<
  WebRuntimeReadinessArea,
  string
> = {
  payload_contract: "Contrato payload",
  postmessage_bridge: "Bridge postMessage",
  temporary_inbox: "Inbox temporal",
  local_analysis: "Análisis local",
  lead_intake: "Lead intake",
  consent_scope: "Consentimiento y alcance",
  external_test: "Prueba externa",
  production_blocker: "Bloqueo producción",
};

export const WEB_RUNTIME_READINESS_STATUS_LABELS: Record<
  WebRuntimeReadinessStatus,
  string
> = {
  ready: "Listo",
  partial: "Parcial",
  blocked: "Bloqueado",
  conditional: "Condicional",
  future: "Futuro",
};

export const WEB_RUNTIME_READINESS_RISK_LABELS: Record<
  WebRuntimeReadinessRisk,
  string
> = {
  low: "Bajo",
  medium: "Medio",
  high: "Alto",
  critical: "Crítico",
};

export const WEB_RUNTIME_READINESS_ITEMS: WebRuntimeReadinessItem[] = [
  {
    id: "web-ready-payload-contract",
    title: "Contrato de payload web validado",
    area: "payload_contract",
    status: "ready",
    risk: "low",
    score: 95,
    summary:
      "El contrato local del widget web ya define publicKey, pageUrl, visitante, contacto, mensaje y consentimiento.",
    completedEvidence: [
      "WebWidgetIncomingPayload implementado.",
      "ExternalDemoBridgeMessage implementado.",
      "Validador isExternalDemoBridgeMessage disponible.",
      "Sanitización básica incorporada.",
    ],
    requiredBeforeExternalTest: [
      "Mantener type fijo ORBI_CHATBOX_WEB_WIDGET_TEST_MESSAGE.",
      "No aceptar campos sensibles innecesarios.",
      "Mantener consentimiento explícito.",
    ],
    blockers: ["No existe validación server-side real."],
    decision:
      "Listo para prueba externa simulada/local. No listo para endpoint público real.",
  },
  {
    id: "web-ready-postmessage-bridge",
    title: "Bridge local postMessage operativo",
    area: "postmessage_bridge",
    status: "ready",
    risk: "medium",
    score: 90,
    summary:
      "La página demo en iframe puede enviar mensajes al core usando window.postMessage.",
    completedEvidence: [
      "Iframe srcDoc implementado.",
      "Listener message implementado.",
      "Logs del bridge implementados.",
      "Snippet HTML copiable disponible.",
    ],
    requiredBeforeExternalTest: [
      "Mantener listener restringido al type esperado.",
      "Registrar logs de payload inválido.",
      "Mantener nota de alcance visible.",
    ],
    blockers: [
      "No hay validación de origin para sitio real.",
      "No existe backend receiver.",
    ],
    decision:
      "Listo para demo local y preparación de prueba externa controlada.",
  },
  {
    id: "web-ready-temporary-inbox",
    title: "Bandeja temporal web en memoria",
    area: "temporary_inbox",
    status: "ready",
    risk: "low",
    score: 95,
    summary:
      "Los mensajes recibidos se almacenan temporalmente en memoria usando useState.",
    completedEvidence: [
      "webWidgetRuntimeInbox implementado.",
      "Filtros por estado implementados.",
      "Reporte runtime copiable implementado.",
      "Limpieza de bandeja temporal disponible.",
    ],
    requiredBeforeExternalTest: [
      "Mantener operación en memoria.",
      "No persistir mensajes reales.",
      "No mezclar con leads productivos.",
    ],
    blockers: ["La bandeja se pierde al recargar, por diseño."],
    decision:
      "Listo como inbox temporal de prueba. No reemplaza base de datos real.",
  },
  {
    id: "web-ready-local-analysis",
    title: "Análisis IA local integrado",
    area: "local_analysis",
    status: "ready",
    risk: "medium",
    score: 85,
    summary:
      "Cada mensaje web puede pasar por el analizador local existente.",
    completedEvidence: [
      "Integración con analyzeCustomerMessage.",
      "analysisSummary generado por payload.",
      "recommendedAction disponible.",
      "Calificación de riesgo local incorporada.",
    ],
    requiredBeforeExternalTest: [
      "Mantener análisis local como demo.",
      "No prometer respuesta IA productiva.",
      "Mostrar revisión humana cuando corresponda.",
    ],
    blockers: [
      "No existe IA backend productiva.",
      "No existe control de costos ni cuotas de IA.",
    ],
    decision:
      "Listo para clasificación demo local. No aprobado como motor IA productivo.",
  },
  {
    id: "web-ready-lead-intake",
    title: "Lead Intake demo en memoria",
    area: "lead_intake",
    status: "ready",
    risk: "medium",
    score: 90,
    summary:
      "El flujo web puede transformar candidatos en leads demo en memoria.",
    completedEvidence: [
      "Web Lead Intake Board implementado.",
      "Conversión demo en memoria implementada.",
      "Estados de lead demo implementados.",
      "Reporte comercial copiable disponible.",
    ],
    requiredBeforeExternalTest: [
      "No llamar appendLeadRecord.",
      "No persistir leads demo.",
      "No confundir lead demo con lead real.",
    ],
    blockers: [
      "No existe persistencia real de leads.",
      "No existe auditoría backend.",
    ],
    decision:
      "Listo para validación comercial demo. No listo como CRM o lead manager real.",
  },
  {
    id: "web-ready-consent-scope",
    title: "Consentimiento y alcance visible",
    area: "consent_scope",
    status: "partial",
    risk: "high",
    score: 70,
    summary:
      "El flujo considera consentimiento, pero una prueba externa real requiere texto final revisado.",
    completedEvidence: [
      "Checkbox de consentimiento implementado.",
      "Estado sin consentimiento marca revisión humana.",
      "Notas de alcance visibles.",
    ],
    requiredBeforeExternalTest: [
      "Redactar texto de consentimiento final para demo externa.",
      "Mantener aviso de que no es producción.",
      "Evitar datos sensibles reales.",
    ],
    blockers: [
      "Falta política legal real.",
      "Falta texto final de privacidad para sitio real.",
    ],
    decision:
      "Parcial. Puede probarse como demo controlada con datos ficticios.",
  },
  {
    id: "web-ready-external-test",
    title: "Prueba externa controlada",
    area: "external_test",
    status: "conditional",
    risk: "high",
    score: 65,
    summary:
      "La app está cerca de permitir una prueba externa controlada, todavía sin backend real.",
    completedEvidence: [
      "Snippet HTML demo generado.",
      "Bridge local validado.",
      "Runtime web local funcional.",
      "Lead intake demo funcional.",
    ],
    requiredBeforeExternalTest: [
      "Definir página demo segura.",
      "Definir si la prueba será local, Vercel preview o archivo HTML controlado.",
      "Mantener postMessage como prueba sin endpoint.",
      "No capturar datos reales.",
    ],
    blockers: [
      "No hay endpoint público real.",
      "No hay backend receiver.",
      "No hay origin validation productiva.",
    ],
    decision:
      "Condicional para prueba externa controlada. Bloqueado para producción.",
  },
  {
    id: "web-ready-production-blocker",
    title: "Producción web bloqueada",
    area: "production_blocker",
    status: "blocked",
    risk: "critical",
    score: 25,
    summary:
      "El flujo web no debe considerarse producción porque no existen backend, endpoint público, persistencia, auth, rate limiting ni observabilidad real.",
    completedEvidence: [
      "Bloqueo productivo declarado.",
      "Notas de alcance visibles.",
      "Security Gate previo disponible.",
    ],
    requiredBeforeExternalTest: [
      "Mantener producción bloqueada.",
      "No publicar como widget real.",
      "No recibir datos reales de clientes.",
    ],
    blockers: [
      "No backend.",
      "No endpoint.",
      "No base de datos.",
      "No rate limiting.",
      "No logs backend.",
    ],
    decision:
      "NO-GO producción. Solo demo local/controlada.",
  },
];

export const WEB_RUNTIME_BLOCK_CLOSURE_ITEMS: WebRuntimeClosureItem[] = [
  {
    id: "closure-web-runtime-base",
    title: "Web Widget Test Runtime creado",
    completed: true,
    description:
      "Se creó el runtime local para simular payloads web, recibir mensajes y analizarlos en memoria.",
  },
  {
    id: "closure-external-bridge",
    title: "External Demo Page Bridge creado",
    completed: true,
    description:
      "Se creó una página externa simulada con iframe srcDoc y window.postMessage.",
  },
  {
    id: "closure-lead-intake",
    title: "Web Lead Intake Board creado",
    completed: true,
    description:
      "Se creó la bandeja avanzada para convertir candidatos web en leads demo en memoria.",
  },
  {
    id: "closure-readiness-data",
    title: "Web Runtime Readiness Data Layer creado",
    completed: true,
    description:
      "Se creó la matriz de readiness, riesgos, bloqueos, evidencia y decisión de avance.",
  },
  {
    id: "closure-no-backend",
    title: "Producción y backend siguen bloqueados",
    completed: true,
    description:
      "El bloque 0K-8 no crea backend, endpoints, APIs, base de datos, fetch ni persistencia.",
  },
];

export function buildWebRuntimeReadinessReportText(params: {
  profile: CompanyProfile;
  items: WebRuntimeReadinessItem[];
  closureItems: WebRuntimeClosureItem[];
  readinessSummary: ReturnType<typeof buildWebRuntimeReadinessSummary>;
  closureSummary: ReturnType<typeof buildWebRuntimeClosureSummary>;
  runtimeSummary: ReturnType<typeof buildWebWidgetRuntimeSummary>;
  leadSummary: ReturnType<typeof buildWebLeadIntakeSummary>;
  registrySummary: ReturnType<typeof buildOrbiModuleRegistrySummary>;
}): string {
  const {
    profile,
    items,
    closureItems,
    readinessSummary,
    closureSummary,
    runtimeSummary,
    leadSummary,
    registrySummary,
  } = params;

  const readinessText = items
    .map((item) => {
      return `WEB RUNTIME READINESS: ${item.title}
Área: ${WEB_RUNTIME_READINESS_AREA_LABELS[item.area]}
Estado: ${WEB_RUNTIME_READINESS_STATUS_LABELS[item.status]}
Riesgo: ${WEB_RUNTIME_READINESS_RISK_LABELS[item.risk]}
Score: ${item.score}%

Resumen:
${item.summary}

Evidencias completadas:
${item.completedEvidence.map((evidence) => `- ${evidence}`).join("\n")}

Requerido antes de prueba externa:
${item.requiredBeforeExternalTest.map((req) => `- ${req}`).join("\n")}

Bloqueos:
${item.blockers.map((blocker) => `- ${blocker}`).join("\n")}

Decisión:
${item.decision}`;
    })
    .join("\n\n---\n\n");

  const closureText = closureItems
    .map((item) => {
      return `${item.completed ? "✓" : "○"} ${item.title}
${item.description}`;
    })
    .join("\n\n");

  return `WEB RUNTIME READINESS — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

VERSIÓN ACTIVA
App version: ${ORBI_CHATBOX_APP_VERSION}
Bloque activo: ${ORBI_CHATBOX_ACTIVE_BLOCK}
Módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE}
Título módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE_TITLE}

RESUMEN READINESS
Ítems evaluados: ${readinessSummary.total}
Listos: ${readinessSummary.ready}
Parciales: ${readinessSummary.partial}
Condicionales: ${readinessSummary.conditional}
Bloqueados: ${readinessSummary.blocked}
Riesgo crítico: ${readinessSummary.criticalRisk}
Score promedio: ${readinessSummary.averageScore}%

RESUMEN RUNTIME WEB
Mensajes recibidos: ${runtimeSummary.total}
Candidatos a lead: ${runtimeSummary.leadCandidates}
Revisión humana: ${runtimeSummary.requiresHumanReview}
Riesgo alto: ${runtimeSummary.highRisk}
Con consentimiento: ${runtimeSummary.withConsent}

RESUMEN LEAD INTAKE
Leads demo: ${leadSummary.total}
Calificados: ${leadSummary.qualified}
Seguimiento: ${leadSummary.readyForFollowUp}
Revisión: ${leadSummary.needsReview}
Descartados: ${leadSummary.discarded}
Críticos: ${leadSummary.criticalPriority}

CIERRE BLOQUE 0K-8
Cierre completado: ${closureSummary.completed}/${closureSummary.total}
Progreso: ${closureSummary.progress}%

MODULE REGISTRY
Módulos registrados: ${registrySummary.total}
Completados: ${registrySummary.completed}
Activos: ${registrySummary.active}
Planificados: ${registrySummary.planned}

READINESS
${readinessText}

CIERRE
${closureText}

DECISIÓN FINAL
GO: demo local con iframe y postMessage.
CONDITIONAL GO: prueba externa controlada con datos ficticios.
NO-GO: producción web, backend público, WhatsApp real o clientes reales.

NOTA
Este Web Runtime Readiness es conceptual/local. No crea backend, endpoints, APIs, fetch, base de datos, localStorage ni producción.`;
}

export function buildWebRuntimeReadinessSummary(items: WebRuntimeReadinessItem[]) {
  const total = items.length;
  const ready = items.filter((item) => item.status === "ready").length;
  const partial = items.filter((item) => item.status === "partial").length;
  const conditional = items.filter(
    (item) => item.status === "conditional"
  ).length;
  const blocked = items.filter((item) => item.status === "blocked").length;
  const criticalRisk = items.filter((item) => item.risk === "critical").length;

  const averageScore =
    total === 0
      ? 0
      : Math.round(items.reduce((sum, item) => sum + item.score, 0) / total);

  return {
    total,
    ready,
    partial,
    conditional,
    blocked,
    criticalRisk,
    averageScore,
  };
}

export function buildWebRuntimeClosureSummary(items: WebRuntimeClosureItem[]) {
  const total = items.length;
  const completed = items.filter((item) => item.completed).length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    total,
    completed,
    progress,
  };
}


export type BackendReceiverArea =
  | "public_route"
  | "payload_validation"
  | "security_control"
  | "data_mapping"
  | "error_handling"
  | "rate_limit"
  | "audit_log"
  | "blocked_scope";

export type BackendReceiverStatus =
  | "required"
  | "recommended"
  | "blocked"
  | "future";

export type BackendReceiverRisk = "low" | "medium" | "high" | "critical";

export type BackendReceiverItem = {
  id: string;
  title: string;
  area: BackendReceiverArea;
  status: BackendReceiverStatus;
  risk: BackendReceiverRisk;
  summary: string;
  futureRoute: string;
  acceptedPayloadFields: string[];
  rejectedPayloadFields: string[];
  requiredValidations: string[];
  securityControls: string[];
  futureDataMapping: string[];
  blockedUntil: string[];
  decision: string;
};

export const BACKEND_RECEIVER_AREA_LABELS: Record<BackendReceiverArea, string> = {
  public_route: "Ruta pública futura",
  payload_validation: "Validación payload",
  security_control: "Control seguridad",
  data_mapping: "Mapeo de datos",
  error_handling: "Manejo de errores",
  rate_limit: "Rate limit",
  audit_log: "Audit log",
  blocked_scope: "Alcance bloqueado",
};

export const BACKEND_RECEIVER_STATUS_LABELS: Record<BackendReceiverStatus, string> = {
  required: "Requerido",
  recommended: "Recomendado",
  blocked: "Bloqueado",
  future: "Futuro",
};

export const BACKEND_RECEIVER_RISK_LABELS: Record<BackendReceiverRisk, string> = {
  low: "Bajo",
  medium: "Medio",
  high: "Alto",
  critical: "Crítico",
};

export const BACKEND_RECEIVER_BLUEPRINT_ITEMS: BackendReceiverItem[] = [
  {
    id: "backend-receiver-public-message-route",
    title: "Ruta pública futura para recibir mensajes web",
    area: "public_route",
    status: "required",
    risk: "critical",
    summary:
      "Define la ruta pública futura que recibirá mensajes desde el widget web o página externa controlada.",
    futureRoute: "POST /api/public/widget/:publicKey/message",
    acceptedPayloadFields: [
      "publicKey",
      "pageUrl",
      "visitorName",
      "visitorEmail",
      "visitorPhone",
      "message",
      "consentAccepted",
      "clientTimestamp",
    ],
    rejectedPayloadFields: [
      "password",
      "token",
      "apiKey",
      "internalUserId",
      "adminRole",
      "companySecret",
    ],
    requiredValidations: [
      "Validar publicKey existente.",
      "Validar que message no esté vacío.",
      "Limitar largo máximo del mensaje.",
      "Validar formato de email si viene informado.",
      "Validar consentimiento.",
      "Sanitizar texto.",
    ],
    securityControls: [
      "No devolver datos internos.",
      "No exponer companyId real en respuesta pública.",
      "No aceptar permisos desde frontend.",
      "No confiar en campos admin enviados por cliente.",
    ],
    futureDataMapping: [
      "publicKey → Company pública.",
      "message → Message inbound.",
      "visitor data → ContactSnapshot.",
      "consentAccepted → ConsentRecord.",
      "pageUrl → Conversation source.",
    ],
    blockedUntil: [
      "Backend real definido.",
      "Validación server-side implementada.",
      "Rate limiting activo.",
      "AuditLog mínimo activo.",
    ],
    decision:
      "Ruta requerida para prueba real futura, pero bloqueada hasta tener backend seguro.",
  },
  {
    id: "backend-receiver-payload-validation",
    title: "Validación server-side del payload",
    area: "payload_validation",
    status: "required",
    risk: "critical",
    summary:
      "Todo payload recibido desde web debe validarse en backend, aunque ya exista validación visual o local.",
    futureRoute: "POST /api/public/widget/:publicKey/message",
    acceptedPayloadFields: [
      "Campos definidos por contrato público mínimo.",
      "Solo datos necesarios para contacto y mensaje.",
    ],
    rejectedPayloadFields: [
      "Campos desconocidos sensibles.",
      "Objetos aninados no permitidos.",
      "Scripts o HTML peligroso.",
      "Archivos adjuntos no habilitados.",
    ],
    requiredValidations: [
      "Schema estricto.",
      "Trim de strings.",
      "Máximo de caracteres.",
      "Bloqueo de HTML/script.",
      "Validación de consentimiento.",
    ],
    securityControls: [
      "Fail closed ante payload inválido.",
      "Respuesta pública genérica.",
      "Log interno sanitizado.",
    ],
    futureDataMapping: [
      "Payload válido → Conversation/Message.",
      "Payload inválido → AuditLog de rechazo.",
    ],
    blockedUntil: [
      "Schema real definido.",
      "Manejo de errores seguro definido.",
    ],
    decision:
      "Obligatorio antes de recibir cualquier mensaje externo real.",
  },
  {
    id: "backend-receiver-rate-limit",
    title: "Rate limiting y protección anti abuso",
    area: "rate_limit",
    status: "required",
    risk: "critical",
    summary:
      "La ruta pública futura necesita límites para evitar spam, abuso, costos inesperados y saturación.",
    futureRoute: "POST /api/public/widget/:publicKey/message",
    acceptedPayloadFields: [
      "publicKey",
      "pageUrl",
      "message",
    ],
    rejectedPayloadFields: [
      "Reintentos masivos.",
      "Mensajes vacíos repetitivos.",
      "Payloads automatizados abusivos.",
    ],
    requiredValidations: [
      "Límite por IP.",
      "Límite por publicKey.",
      "Límite por ventana de tiempo.",
      "Bloqueo temporal ante abuso.",
    ],
    securityControls: [
      "Rate limit público.",
      "Registro de abuso.",
      "Respuesta 429 controlada.",
    ],
    futureDataMapping: [
      "Intentos bloqueados → AuditLog.",
      "Conteos por IP/publicKey → RateLimitState.",
    ],
    blockedUntil: [
      "Backend real.",
      "Middleware de rate limit.",
      "Política de abuso definida.",
    ],
    decision:
      "No se debe abrir ruta pública sin rate limiting.",
  },
  {
    id: "backend-receiver-audit-log",
    title: "AuditLog mínimo para mensajes web",
    area: "audit_log",
    status: "recommended",
    risk: "high",
    summary:
      "El backend debe registrar eventos críticos sin guardar secretos ni datos sensibles innecesarios.",
    futureRoute: "INTERNAL /audit/widget-message-events",
    acceptedPayloadFields: [
      "eventType",
      "publicKeyHash",
      "timestamp",
      "result",
      "riskLevel",
    ],
    rejectedPayloadFields: [
      "Texto completo con datos sensibles si no es necesario.",
      "Tokens.",
      "Contraseñas.",
      "Secretos internos.",
    ],
    requiredValidations: [
      "Sanitizar logs.",
      "Registrar rechazo de payload.",
      "Registrar abuso/rate limit.",
      "Registrar errores internos.",
    ],
    securityControls: [
      "Logs internos no públicos.",
      "Sin secretos.",
      "Retención limitada.",
    ],
    futureDataMapping: [
      "Evento aceptado → AuditLog.",
      "Evento rechazado → AuditLog.",
      "Error backend → ErrorLog.",
    ],
    blockedUntil: [
      "Modelo AuditLog definido.",
      "Política de retención definida.",
    ],
    decision:
      "Recomendado antes de piloto privado y obligatorio antes de producción.",
  },
  {
    id: "backend-receiver-error-handling",
    title: "Manejo seguro de errores públicos",
    area: "error_handling",
    status: "required",
    risk: "high",
    summary:
      "Los errores de la ruta pública deben ser claros para el sistema, pero no revelar información interna al visitante.",
    futureRoute: "POST /api/public/widget/:publicKey/message",
    acceptedPayloadFields: [
      "errorCode público.",
      "mensaje genérico.",
      "requestId futuro.",
    ],
    rejectedPayloadFields: [
      "Stack trace.",
      "SQL errors.",
      "companyId interno.",
      "Detalles de permisos.",
    ],
    requiredValidations: [
      "400 para payload inválido.",
      "401/403 no deben exponer detalles internos.",
      "429 para rate limit.",
      "500 genérico para error interno.",
    ],
    securityControls: [
      "No filtrar stack trace.",
      "No exponer estructura de base de datos.",
      "Generar requestId para trazabilidad.",
    ],
    futureDataMapping: [
      "Error público → respuesta segura.",
      "Error interno → log interno.",
    ],
    blockedUntil: [
      "Política de errores definida.",
      "Logger backend definido.",
    ],
    decision:
      "Obligatorio antes de cualquier endpoint real.",
  },
  {
    id: "backend-receiver-blocked-production",
    title: "Producción pública sigue bloqueada",
    area: "blocked_scope",
    status: "blocked",
    risk: "critical",
    summary:
      "Este blueprint no habilita producción. Solo prepara el camino para implementación backend futura.",
    futureRoute: "N/A",
    acceptedPayloadFields: [
      "Solo documentación conceptual.",
    ],
    rejectedPayloadFields: [
      "Datos reales de clientes.",
      "Mensajes reales desde producción.",
      "Credenciales reales.",
      "Tokens reales.",
    ],
    requiredValidations: [
      "Mantener bloqueo visual.",
      "Mantener notas de alcance.",
      "No crear fetch ni endpoints.",
    ],
    securityControls: [
      "No producción.",
      "No backend real.",
      "No API real.",
      "No WhatsApp real.",
    ],
    futureDataMapping: [
      "Sin persistencia.",
      "Sin base de datos.",
      "Sin CRM.",
    ],
    blockedUntil: [
      "Backend real diseñado.",
      "Security Gate técnico aprobado.",
      "QA backend aprobado.",
      "Prueba externa controlada aprobada.",
    ],
    decision:
      "NO-GO producción. Solo blueprint técnico.",
  },
];

export function buildBackendReceiverBlueprintSummary(items: BackendReceiverItem[]) {
  const total = items.length;
  const required = items.filter((item) => item.status === "required").length;
  const recommended = items.filter(
    (item) => item.status === "recommended"
  ).length;
  const blocked = items.filter((item) => item.status === "blocked").length;
  const criticalRisk = items.filter((item) => item.risk === "critical").length;

  return {
    total,
    required,
    recommended,
    blocked,
    criticalRisk,
  };
}

export function buildBackendReceiverBlueprintText(params: {
  profile: CompanyProfile;
  items: BackendReceiverItem[];
  summary: ReturnType<typeof buildBackendReceiverBlueprintSummary>;
  registrySummary: ReturnType<typeof buildOrbiModuleRegistrySummary>;
}): string {
  const { profile, items, summary, registrySummary } = params;

  const itemsText = items
    .map((item) => {
      return `BACKEND RECEIVER ITEM: ${item.title}
Área: ${BACKEND_RECEIVER_AREA_LABELS[item.area]}
Estado: ${BACKEND_RECEIVER_STATUS_LABELS[item.status]}
Riesgo: ${BACKEND_RECEIVER_RISK_LABELS[item.risk]}
Ruta futura: ${item.futureRoute}

Resumen:
${item.summary}

Campos aceptados:
${item.acceptedPayloadFields.map((field) => `- ${field}`).join("\n")}

Campos rechazados:
${item.rejectedPayloadFields.map((field) => `- ${field}`).join("\n")}

Validaciones requeridas:
${item.requiredValidations.map((validation) => `- ${validation}`).join("\n")}

Controles de seguridad:
${item.securityControls.map((control) => `- ${control}`).join("\n")}

Mapeo futuro de datos:
${item.futureDataMapping.map((mapping) => `- ${mapping}`).join("\n")}

Bloqueado hasta:
${item.blockedUntil.map((blocker) => `- ${blocker}`).join("\n")}

Decisión:
${item.decision}`;
    })
    .join("\n\n---\n\n");

  return `BACKEND RECEIVER FOUNDATION BLUEPRINT — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

VERSIÓN ACTIVA
App version: ${ORBI_CHATBOX_APP_VERSION}
Bloque activo: ${ORBI_CHATBOX_ACTIVE_BLOCK}
Módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE}
Título módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE_TITLE}

RESUMEN
Ítems: ${summary.total}
Requeridos: ${summary.required}
Recomendados: ${summary.recommended}
Bloqueados: ${summary.blocked}
Riesgo crítico: ${summary.criticalRisk}

MODULE REGISTRY
Módulos registrados: ${registrySummary.total}
Completados: ${registrySummary.completed}
Activos: ${registrySummary.active}
Planificados: ${registrySummary.planned}

DETALLE
${itemsText}

NOTA
Este Backend Receiver Foundation Blueprint es conceptual. No crea backend, endpoints, APIs, fetch, base de datos, localStorage ni producción.`;
}


export type BackendReceiverGateArea =
  | "schema_validation"
  | "public_key"
  | "consent"
  | "rate_limit"
  | "audit"
  | "error_response"
  | "data_retention"
  | "production_release";

export type BackendReceiverGateStatus =
  | "required"
  | "recommended"
  | "blocked"
  | "future";

export type BackendReceiverGateDecision =
  | "go_demo_only"
  | "conditional_backend_build"
  | "blocked_for_public_release"
  | "future_review";

export type BackendReceiverErrorCode =
  | "INVALID_PAYLOAD"
  | "MISSING_CONSENT"
  | "INVALID_PUBLIC_KEY"
  | "RATE_LIMITED"
  | "MESSAGE_TOO_LONG"
  | "UNSUPPORTED_FIELD"
  | "INTERNAL_ERROR"
  | "SERVICE_UNAVAILABLE";

export type BackendReceiverSecurityGate = {
  id: string;
  title: string;
  area: BackendReceiverGateArea;
  status: BackendReceiverGateStatus;
  risk: BackendReceiverRisk;
  decision: BackendReceiverGateDecision;
  summary: string;
  requiredControls: string[];
  evidenceRequired: string[];
  blockedIfMissing: string[];
  futureImplementationNotes: string[];
};

export type BackendReceiverErrorMapItem = {
  id: string;
  code: BackendReceiverErrorCode;
  httpStatus: number;
  publicMessage: string;
  internalMeaning: string;
  shouldLog: boolean;
  shouldExposeDetails: boolean;
  recommendedAction: string;
};

export type BackendReceiverSubblockClosureItem = {
  id: string;
  title: string;
  completed: boolean;
  description: string;
};

export const BACKEND_RECEIVER_GATE_AREA_LABELS: Record<
  BackendReceiverGateArea,
  string
> = {
  schema_validation: "Validación schema",
  public_key: "Public key",
  consent: "Consentimiento",
  rate_limit: "Rate limit",
  audit: "Auditoría",
  error_response: "Errores públicos",
  data_retention: "Retención datos",
  production_release: "Release producción",
};

export const BACKEND_RECEIVER_GATE_STATUS_LABELS: Record<
  BackendReceiverGateStatus,
  string
> = {
  required: "Requerido",
  recommended: "Recomendado",
  blocked: "Bloqueado",
  future: "Futuro",
};

export const BACKEND_RECEIVER_GATE_DECISION_LABELS: Record<
  BackendReceiverGateDecision,
  string
> = {
  go_demo_only: "GO demo solamente",
  conditional_backend_build: "Condicional build backend",
  blocked_for_public_release: "Bloqueado release público",
  future_review: "Revisión futura",
};

export const BACKEND_RECEIVER_ERROR_CODE_LABELS: Record<
  BackendReceiverErrorCode,
  string
> = {
  INVALID_PAYLOAD: "Payload inválido",
  MISSING_CONSENT: "Consentimiento faltante",
  INVALID_PUBLIC_KEY: "Public key inválida",
  RATE_LIMITED: "Rate limit excedido",
  MESSAGE_TOO_LONG: "Mensaje demasiado largo",
  UNSUPPORTED_FIELD: "Campo no soportado",
  INTERNAL_ERROR: "Error interno",
  SERVICE_UNAVAILABLE: "Servicio no disponible",
};

export const BACKEND_RECEIVER_SECURITY_GATES: BackendReceiverSecurityGate[] = [
  {
    id: "gate-schema-validation",
    title: "Schema validation obligatoria",
    area: "schema_validation",
    status: "required",
    risk: "critical",
    decision: "conditional_backend_build",
    summary:
      "El futuro backend receiver no debe aceptar mensajes web sin una validación server-side estricta del payload.",
    requiredControls: [
      "Schema estricto para payload público.",
      "Rechazo de campos no permitidos.",
      "Límite de longitud por campo.",
      "Sanitización server-side.",
      "Normalización de strings.",
    ],
    evidenceRequired: [
      "Schema documentado.",
      "Casos de prueba para payload válido.",
      "Casos de prueba para payload inválido.",
      "Prueba de rechazo de campos desconocidos.",
    ],
    blockedIfMissing: [
      "No abrir endpoint público.",
      "No recibir mensajes reales.",
      "No activar prueba externa real.",
    ],
    futureImplementationNotes: [
      "Usar Zod, Joi o validación equivalente.",
      "Mantener mensajes de error públicos genéricos.",
      "Registrar errores internos sin exponer stack trace.",
    ],
  },
  {
    id: "gate-public-key",
    title: "Validación de publicKey por empresa",
    area: "public_key",
    status: "required",
    risk: "critical",
    decision: "conditional_backend_build",
    summary:
      "Cada mensaje web debe vincularse a una empresa mediante una publicKey pública válida, sin exponer companyId interno.",
    requiredControls: [
      "Validar publicKey existente.",
      "Resolver empresa desde backend.",
      "No aceptar companyId desde frontend.",
      "No devolver datos internos de empresa.",
    ],
    evidenceRequired: [
      "Prueba publicKey válida.",
      "Prueba publicKey inválida.",
      "Prueba de no exposición de companyId.",
    ],
    blockedIfMissing: [
      "No se puede mapear mensaje a empresa.",
      "Riesgo de fuga multiempresa.",
      "Riesgo de spoofing de empresa.",
    ],
    futureImplementationNotes: [
      "La publicKey debe ser rotatable.",
      "No debe funcionar como secreto.",
      "Combinar con rate limit y auditoría.",
    ],
  },
  {
    id: "gate-consent",
    title: "Consentimiento obligatorio para captura web",
    area: "consent",
    status: "required",
    risk: "high",
    decision: "conditional_backend_build",
    summary:
      "El receiver debe exigir aceptación explícita de consentimiento antes de procesar mensajes externos con datos de contacto.",
    requiredControls: [
      "Campo consentAccepted obligatorio.",
      "Bloqueo o revisión si no hay consentimiento.",
      "Texto de consentimiento visible en widget.",
      "Registro de timestamp del consentimiento.",
    ],
    evidenceRequired: [
      "Prueba mensaje con consentimiento.",
      "Prueba mensaje sin consentimiento.",
      "Texto de consentimiento definido.",
    ],
    blockedIfMissing: [
      "No capturar datos de contacto reales.",
      "No crear lead real.",
      "No activar widget real.",
    ],
    futureImplementationNotes: [
      "El texto legal debe revisarse antes de clientes reales.",
      "No usar datos sensibles en demos externas.",
    ],
  },
  {
    id: "gate-rate-limit",
    title: "Rate limit público obligatorio",
    area: "rate_limit",
    status: "required",
    risk: "critical",
    decision: "blocked_for_public_release",
    summary:
      "El endpoint público debe limitar abuso por IP, publicKey y ventana temporal antes de cualquier exposición real.",
    requiredControls: [
      "Límite por IP.",
      "Límite por publicKey.",
      "Ventanas temporales configurables.",
      "Respuesta 429 controlada.",
      "Registro de intentos abusivos.",
    ],
    evidenceRequired: [
      "Prueba límite por IP.",
      "Prueba límite por publicKey.",
      "Prueba respuesta 429.",
      "Log de abuso sanitizado.",
    ],
    blockedIfMissing: [
      "No abrir endpoint público.",
      "No conectar página real.",
      "No conectar WhatsApp ni canales externos.",
    ],
    futureImplementationNotes: [
      "Considerar middleware rate limit.",
      "Evitar costos inesperados de IA.",
      "Agregar protección anti spam.",
    ],
  },
  {
    id: "gate-audit",
    title: "AuditLog mínimo del receiver",
    area: "audit",
    status: "recommended",
    risk: "high",
    decision: "future_review",
    summary:
      "Los eventos relevantes del receiver deben quedar trazables sin exponer secretos ni datos innecesarios.",
    requiredControls: [
      "Log de mensaje aceptado.",
      "Log de payload rechazado.",
      "Log de rate limit.",
      "Log de error interno.",
      "RequestId para trazabilidad.",
    ],
    evidenceRequired: [
      "Modelo AuditLog futuro.",
      "Política de sanitización.",
      "Política de retención.",
    ],
    blockedIfMissing: [
      "Dificulta auditoría de incidentes.",
      "Dificulta soporte técnico.",
      "Dificulta QA real.",
    ],
    futureImplementationNotes: [
      "No guardar tokens ni secretos.",
      "Evitar guardar texto completo si no es necesario.",
      "Definir retención por ambiente.",
    ],
  },
  {
    id: "gate-production-release",
    title: "Release público bloqueado",
    area: "production_release",
    status: "blocked",
    risk: "critical",
    decision: "blocked_for_public_release",
    summary:
      "Aunque exista blueprint, el release público permanece bloqueado hasta tener backend, QA, seguridad, auditoría y despliegue aprobados.",
    requiredControls: [
      "Backend real implementado.",
      "QA backend aprobado.",
      "Security Gate aprobado.",
      "Rate limit activo.",
      "Observabilidad mínima activa.",
      "Rollback definido.",
    ],
    evidenceRequired: [
      "Checklist QA técnico.",
      "Checklist seguridad.",
      "Pruebas de endpoint.",
      "Pruebas de abuso.",
      "Decisión Go/No-Go final.",
    ],
    blockedIfMissing: [
      "No producción.",
      "No clientes reales.",
      "No widget público real.",
      "No WhatsApp real.",
    ],
    futureImplementationNotes: [
      "Mantener demo y producción separados.",
      "No usar Vercel preview como producción real.",
      "No recibir datos reales sin aprobación.",
    ],
  },
];

export const BACKEND_RECEIVER_ERROR_MAP: BackendReceiverErrorMapItem[] = [
  {
    id: "error-invalid-payload",
    code: "INVALID_PAYLOAD",
    httpStatus: 400,
    publicMessage:
      "No pudimos procesar el mensaje. Revisa los campos e intenta nuevamente.",
    internalMeaning:
      "El payload no cumple el schema público esperado o contiene campos inválidos.",
    shouldLog: true,
    shouldExposeDetails: false,
    recommendedAction:
      "Rechazar payload, registrar evento sanitizado y no crear conversación.",
  },
  {
    id: "error-missing-consent",
    code: "MISSING_CONSENT",
    httpStatus: 400,
    publicMessage:
      "Debes aceptar el consentimiento para enviar el mensaje.",
    internalMeaning:
      "El visitante no aceptó consentimiento o el campo consentAccepted no llegó como true.",
    shouldLog: true,
    shouldExposeDetails: false,
    recommendedAction:
      "No crear lead real. Registrar evento y solicitar consentimiento visible.",
  },
  {
    id: "error-invalid-public-key",
    code: "INVALID_PUBLIC_KEY",
    httpStatus: 404,
    publicMessage:
      "El chat no está disponible para esta página en este momento.",
    internalMeaning:
      "La publicKey no existe, está deshabilitada o no corresponde a una empresa activa.",
    shouldLog: true,
    shouldExposeDetails: false,
    recommendedAction:
      "No revelar si la empresa existe. Registrar intento y devolver mensaje genérico.",
  },
  {
    id: "error-rate-limited",
    code: "RATE_LIMITED",
    httpStatus: 429,
    publicMessage:
      "Se han enviado demasiados mensajes. Intenta nuevamente más tarde.",
    internalMeaning:
      "Se excedió límite por IP, publicKey o ventana temporal.",
    shouldLog: true,
    shouldExposeDetails: false,
    recommendedAction:
      "Bloquear temporalmente y registrar evento de abuso.",
  },
  {
    id: "error-message-too-long",
    code: "MESSAGE_TOO_LONG",
    httpStatus: 400,
    publicMessage:
      "El mensaje es demasiado largo. Resume tu consulta e intenta nuevamente.",
    internalMeaning:
      "El campo message supera el máximo permitido.",
    shouldLog: true,
    shouldExposeDetails: false,
    recommendedAction:
      "Rechazar mensaje y solicitar reducción de longitud.",
  },
  {
    id: "error-unsupported-field",
    code: "UNSUPPORTED_FIELD",
    httpStatus: 400,
    publicMessage:
      "El mensaje contiene campos no permitidos.",
    internalMeaning:
      "El payload incluye campos no soportados, sensibles o potencialmente manipulados.",
    shouldLog: true,
    shouldExposeDetails: false,
    recommendedAction:
      "Rechazar payload completo y registrar evento sanitizado.",
  },
  {
    id: "error-internal",
    code: "INTERNAL_ERROR",
    httpStatus: 500,
    publicMessage:
      "Ocurrió un problema temporal procesando el mensaje.",
    internalMeaning:
      "Error interno no controlado en receiver, validación, persistencia futura o servicios internos.",
    shouldLog: true,
    shouldExposeDetails: false,
    recommendedAction:
      "Registrar error interno con requestId y devolver mensaje genérico.",
  },
  {
    id: "error-service-unavailable",
    code: "SERVICE_UNAVAILABLE",
    httpStatus: 503,
    publicMessage:
      "El chat no está disponible temporalmente.",
    internalMeaning:
      "Receiver, base de datos futura o servicio crítico no disponible.",
    shouldLog: true,
    shouldExposeDetails: false,
    recommendedAction:
      "Activar fallback visual y registrar indisponibilidad.",
  },
];

export const BACKEND_RECEIVER_SUBBLOCK_CLOSURE_ITEMS: BackendReceiverSubblockClosureItem[] =
  [
    {
      id: "closure-receiver-blueprint",
      title: "Backend Receiver Blueprint creado",
      completed: true,
      description:
        "Se definió el contrato conceptual de rutas futuras, campos aceptados, campos rechazados, validaciones y bloqueos.",
    },
    {
      id: "closure-security-gates",
      title: "Security Gates definidos",
      completed: true,
      description:
        "Se definieron gates de schema, publicKey, consentimiento, rate limit, audit y release público.",
    },
    {
      id: "closure-error-map",
      title: "Error Map público seguro definido",
      completed: true,
      description:
        "Se definieron códigos de error públicos con mensajes seguros y significado interno.",
    },
    {
      id: "closure-production-blocked",
      title: "Producción sigue bloqueada",
      completed: true,
      description:
        "El subbloque 0K-9A no crea endpoints, backend real, API, base de datos ni producción.",
    },
  ];

export function buildBackendReceiverSecurityGateSummary(
  items: BackendReceiverSecurityGate[]
) {
  const total = items.length;
  const required = items.filter((item) => item.status === "required").length;
  const recommended = items.filter((item) => item.status === "recommended").length;
  const blocked = items.filter((item) => item.status === "blocked").length;
  const criticalRisk = items.filter((item) => item.risk === "critical").length;

  const blockedForPublicRelease = items.filter(
    (item) => item.decision === "blocked_for_public_release"
  ).length;

  return {
    total,
    required,
    recommended,
    blocked,
    criticalRisk,
    blockedForPublicRelease,
  };
}

export function buildBackendReceiverErrorMapSummary(
  items: BackendReceiverErrorMapItem[]
) {
  const total = items.length;
  const logged = items.filter((item) => item.shouldLog).length;
  const hiddenDetails = items.filter((item) => !item.shouldExposeDetails).length;
  const clientErrors = items.filter((item) => item.httpStatus >= 400 && item.httpStatus < 500).length;
  const serverErrors = items.filter((item) => item.httpStatus >= 500).length;

  return {
    total,
    logged,
    hiddenDetails,
    clientErrors,
    serverErrors,
  };
}

export function buildBackendReceiverSubblockClosureSummary(
  items: BackendReceiverSubblockClosureItem[]
) {
  const total = items.length;
  const completed = items.filter((item) => item.completed).length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    total,
    completed,
    progress,
  };
}

export function buildBackendReceiverSecurityReportText(params: {
  profile: CompanyProfile;
  gates: BackendReceiverSecurityGate[];
  errorMap: BackendReceiverErrorMapItem[];
  closureItems: BackendReceiverSubblockClosureItem[];
  gateSummary: ReturnType<typeof buildBackendReceiverSecurityGateSummary>;
  errorSummary: ReturnType<typeof buildBackendReceiverErrorMapSummary>;
  closureSummary: ReturnType<typeof buildBackendReceiverSubblockClosureSummary>;
  registrySummary: ReturnType<typeof buildOrbiModuleRegistrySummary>;
}): string {
  const {
    profile,
    gates,
    errorMap,
    closureItems,
    gateSummary,
    errorSummary,
    closureSummary,
    registrySummary,
  } = params;

  const gatesText = gates
    .map((gate) => {
      return `SECURITY GATE: ${gate.title}
Área: ${BACKEND_RECEIVER_GATE_AREA_LABELS[gate.area]}
Estado: ${BACKEND_RECEIVER_GATE_STATUS_LABELS[gate.status]}
Riesgo: ${BACKEND_RECEIVER_RISK_LABELS[gate.risk]}
Decisión: ${BACKEND_RECEIVER_GATE_DECISION_LABELS[gate.decision]}

Resumen:
${gate.summary}

Controles requeridos:
${gate.requiredControls.map((control) => `- ${control}`).join("\n")}

Evidencias requeridas:
${gate.evidenceRequired.map((evidence) => `- ${evidence}`).join("\n")}

Bloqueado si falta:
${gate.blockedIfMissing.map((blocker) => `- ${blocker}`).join("\n")}

Notas futura implementación:
${gate.futureImplementationNotes.map((note) => `- ${note}`).join("\n")}`;
    })
    .join("\n\n---\n\n");

  const errorsText = errorMap
    .map((error) => {
      return `ERROR MAP: ${error.code} — ${BACKEND_RECEIVER_ERROR_CODE_LABELS[error.code]}
HTTP: ${error.httpStatus}
Mensaje público:
${error.publicMessage}

Significado interno:
${error.internalMeaning}

Log: ${error.shouldLog ? "Sí" : "No"}
Exponer detalles: ${error.shouldExposeDetails ? "Sí" : "No"}

Acción recomendada:
${error.recommendedAction}`;
    })
    .join("\n\n---\n\n");

  const closureText = closureItems
    .map((item) => {
      return `${item.completed ? "✓" : "○"} ${item.title}
${item.description}`;
    })
    .join("\n\n");

  return `BACKEND RECEIVER SECURITY GATES — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

VERSIÓN ACTIVA
App version: ${ORBI_CHATBOX_APP_VERSION}
Bloque activo: ${ORBI_CHATBOX_ACTIVE_BLOCK}
Módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE}
Título módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE_TITLE}

SECURITY GATES
Gates: ${gateSummary.total}
Requeridos: ${gateSummary.required}
Recomendados: ${gateSummary.recommended}
Bloqueados: ${gateSummary.blocked}
Riesgo crítico: ${gateSummary.criticalRisk}
Bloqueados para release público: ${gateSummary.blockedForPublicRelease}

ERROR MAP
Errores definidos: ${errorSummary.total}
Con log interno: ${errorSummary.logged}
Detalles ocultos: ${errorSummary.hiddenDetails}
Errores cliente 4xx: ${errorSummary.clientErrors}
Errores servidor 5xx: ${errorSummary.serverErrors}

CIERRE SUBBLOQUE 0K-9A
Cierre completado: ${closureSummary.completed}/${closureSummary.total}
Progreso: ${closureSummary.progress}%

MODULE REGISTRY
Módulos registrados: ${registrySummary.total}
Completados: ${registrySummary.completed}
Activos: ${registrySummary.active}
Planificados: ${registrySummary.planned}

DETALLE SECURITY GATES
${gatesText}

DETALLE ERROR MAP
${errorsText}

CIERRE
${closureText}

DECISIÓN FINAL
GO: blueprint y diseño conceptual.
CONDITIONAL GO: futura construcción backend controlada.
NO-GO: endpoint público real, producción, WhatsApp real o datos reales.

NOTA
Este módulo es conceptual. No crea backend, endpoints, APIs, fetch, base de datos, localStorage ni producción.`;
}

export type BackendRuntimeStage =
  | "request_received"
  | "schema_validation"
  | "public_key_resolution"
  | "consent_check"
  | "rate_limit_check"
  | "message_sanitization"
  | "risk_scoring"
  | "conversation_mapping"
  | "safe_response"
  | "audit_event";

export type BackendRuntimeStatus =
  | "planned"
  | "required"
  | "blocked"
  | "future";

export type BackendRuntimeDecision =
  | "continue"
  | "reject"
  | "needs_review"
  | "blocked_until_backend";

export type BackendRuntimeResponseType =
  | "accepted"
  | "rejected"
  | "rate_limited"
  | "service_unavailable"
  | "internal_failure";

export type BackendRuntimeLifecycleItem = {
  id: string;
  title: string;
  stage: BackendRuntimeStage;
  status: BackendRuntimeStatus;
  decision: BackendRuntimeDecision;
  risk: BackendReceiverRisk;
  summary: string;
  inputRequired: string[];
  processingRules: string[];
  outputProduced: string[];
  failureMode: string[];
  linkedSecurityGates: string[];
  linkedErrorCodes: BackendReceiverErrorCode[];
};

export type BackendRuntimeResponseContract = {
  id: string;
  responseType: BackendRuntimeResponseType;
  httpStatus: number;
  publicShape: string[];
  internalNotes: string[];
  allowedPublicFields: string[];
  forbiddenPublicFields: string[];
  exampleMessage: string;
};

export const BACKEND_RUNTIME_STAGE_LABELS: Record<BackendRuntimeStage, string> = {
  request_received: "Request recibida",
  schema_validation: "Validación schema",
  public_key_resolution: "Resolución publicKey",
  consent_check: "Chequeo consentimiento",
  rate_limit_check: "Chequeo rate limit",
  message_sanitization: "Sanitización mensaje",
  risk_scoring: "Scoring riesgo",
  conversation_mapping: "Mapeo conversación",
  safe_response: "Respuesta segura",
  audit_event: "Evento auditoría",
};

export const BACKEND_RUNTIME_STATUS_LABELS: Record<BackendRuntimeStatus, string> = {
  planned: "Planificado",
  required: "Requerido",
  blocked: "Bloqueado",
  future: "Futuro",
};

export const BACKEND_RUNTIME_DECISION_LABELS: Record<BackendRuntimeDecision, string> = {
  continue: "Continuar",
  reject: "Rechazar",
  needs_review: "Revisión",
  blocked_until_backend: "Bloqueado hasta backend",
};

export const BACKEND_RUNTIME_RESPONSE_TYPE_LABELS: Record<
  BackendRuntimeResponseType,
  string
> = {
  accepted: "Aceptado",
  rejected: "Rechazado",
  rate_limited: "Rate limited",
  service_unavailable: "Servicio no disponible",
  internal_failure: "Falla interna",
};

export const BACKEND_RUNTIME_LIFECYCLE_ITEMS: BackendRuntimeLifecycleItem[] = [
  {
    id: "runtime-request-received",
    title: "Recepción inicial de request pública",
    stage: "request_received",
    status: "required",
    decision: "continue",
    risk: "high",
    summary:
      "El futuro receiver recibe un payload desde el widget web público y debe tratarlo como información no confiable hasta validarlo.",
    inputRequired: [
      "publicKey en ruta.",
      "payload JSON.",
      "headers mínimos.",
      "timestamp de recepción.",
    ],
    processingRules: [
      "No confiar en ningún campo enviado desde frontend.",
      "No resolver empresa desde companyId recibido.",
      "No ejecutar análisis IA antes de validar.",
      "No persistir payload crudo sin sanitizar.",
    ],
    outputProduced: [
      "Request interna normalizada.",
      "requestId futuro.",
      "Evento inicial para auditoría.",
    ],
    failureMode: [
      "Payload ausente.",
      "JSON inválido.",
      "Content-Type no permitido.",
    ],
    linkedSecurityGates: [
      "Schema validation obligatoria.",
      "AuditLog mínimo del receiver.",
    ],
    linkedErrorCodes: ["INVALID_PAYLOAD", "INTERNAL_ERROR"],
  },
  {
    id: "runtime-schema-validation",
    title: "Validación estricta del schema",
    stage: "schema_validation",
    status: "required",
    decision: "continue",
    risk: "critical",
    summary:
      "El receiver valida que el payload cumpla el contrato público mínimo y rechaza campos no permitidos.",
    inputRequired: [
      "visitorName.",
      "visitorEmail opcional.",
      "visitorPhone opcional.",
      "message.",
      "consentAccepted.",
      "pageUrl.",
    ],
    processingRules: [
      "Rechazar campos desconocidos sensibles.",
      "Limitar longitud de strings.",
      "Validar formato básico de email.",
      "Rechazar message vacío.",
    ],
    outputProduced: [
      "Payload validado.",
      "Payload rechazado con error público seguro si falla.",
    ],
    failureMode: [
      "Campo requerido faltante.",
      "Campo no soportado.",
      "Mensaje demasiado largo.",
      "Formato inválido.",
    ],
    linkedSecurityGates: [
      "Schema validation obligatoria.",
    ],
    linkedErrorCodes: [
      "INVALID_PAYLOAD",
      "UNSUPPORTED_FIELD",
      "MESSAGE_TOO_LONG",
    ],
  },
  {
    id: "runtime-public-key",
    title: "Resolución segura de publicKey",
    stage: "public_key_resolution",
    status: "required",
    decision: "continue",
    risk: "critical",
    summary:
      "La publicKey pública se usa para resolver la empresa futura sin exponer companyId ni aceptar identidad desde frontend.",
    inputRequired: [
      "publicKey de la ruta.",
      "estado futuro de empresa.",
      "estado futuro del widget.",
    ],
    processingRules: [
      "Buscar publicKey en backend.",
      "Verificar que esté activa.",
      "No devolver datos internos.",
      "No aceptar companyId desde payload.",
    ],
    outputProduced: [
      "Company interna resuelta.",
      "Widget config pública validada.",
    ],
    failureMode: [
      "publicKey inexistente.",
      "publicKey deshabilitada.",
      "empresa inactiva.",
    ],
    linkedSecurityGates: [
      "Validación de publicKey por empresa.",
    ],
    linkedErrorCodes: ["INVALID_PUBLIC_KEY", "SERVICE_UNAVAILABLE"],
  },
  {
    id: "runtime-consent",
    title: "Chequeo de consentimiento",
    stage: "consent_check",
    status: "required",
    decision: "continue",
    risk: "high",
    summary:
      "El receiver valida consentimiento antes de aceptar datos de contacto o crear una futura conversación.",
    inputRequired: [
      "consentAccepted.",
      "texto de consentimiento versionado futuro.",
      "timestamp.",
    ],
    processingRules: [
      "Si no hay consentimiento, no crear lead real.",
      "Marcar revisión si corresponde.",
      "No procesar datos sensibles.",
    ],
    outputProduced: [
      "ConsentRecord futuro.",
      "Marca de consentimiento válido.",
    ],
    failureMode: [
      "consentAccepted false.",
      "consentimiento ausente.",
      "texto legal no definido.",
    ],
    linkedSecurityGates: [
      "Consentimiento obligatorio para captura web.",
    ],
    linkedErrorCodes: ["MISSING_CONSENT"],
  },
  {
    id: "runtime-rate-limit",
    title: "Chequeo de rate limit",
    stage: "rate_limit_check",
    status: "required",
    decision: "continue",
    risk: "critical",
    summary:
      "El receiver aplica límites por IP, publicKey y ventana temporal antes de aceptar mensajes.",
    inputRequired: [
      "IP o identificador de origen.",
      "publicKey.",
      "ventana temporal.",
    ],
    processingRules: [
      "Evaluar límite por IP.",
      "Evaluar límite por publicKey.",
      "Bloquear abuso temporalmente.",
      "No generar costos IA si está bloqueado.",
    ],
    outputProduced: [
      "Resultado rate limit.",
      "Evento de abuso si aplica.",
    ],
    failureMode: [
      "Demasiados mensajes.",
      "spam repetitivo.",
      "abuso automatizado.",
    ],
    linkedSecurityGates: [
      "Rate limit público obligatorio.",
    ],
    linkedErrorCodes: ["RATE_LIMITED"],
  },
  {
    id: "runtime-safe-response",
    title: "Respuesta pública segura",
    stage: "safe_response",
    status: "required",
    decision: "continue",
    risk: "high",
    summary:
      "Toda respuesta pública debe ser mínima, segura y sin detalles internos.",
    inputRequired: [
      "resultado de validación.",
      "requestId futuro.",
      "tipo de respuesta.",
    ],
    processingRules: [
      "No exponer stack trace.",
      "No exponer companyId.",
      "No exponer detalles de permisos.",
      "Responder con mensajes genéricos.",
    ],
    outputProduced: [
      "response pública segura.",
      "requestId si corresponde.",
    ],
    failureMode: [
      "Error interno.",
      "servicio no disponible.",
      "error inesperado.",
    ],
    linkedSecurityGates: [
      "Release público bloqueado.",
      "AuditLog mínimo del receiver.",
    ],
    linkedErrorCodes: ["INTERNAL_ERROR", "SERVICE_UNAVAILABLE"],
  },
];

export const BACKEND_RUNTIME_RESPONSE_CONTRACTS: BackendRuntimeResponseContract[] = [
  {
    id: "response-accepted",
    responseType: "accepted",
    httpStatus: 202,
    publicShape: [
      "ok: true",
      "status: accepted",
      "message: string",
      "requestId: string futuro",
    ],
    internalNotes: [
      "No confirma creación de lead real si el sistema aún está en demo.",
      "Puede indicar que el mensaje fue recibido para revisión.",
    ],
    allowedPublicFields: [
      "ok",
      "status",
      "message",
      "requestId",
    ],
    forbiddenPublicFields: [
      "companyId",
      "internalUserId",
      "databaseId",
      "stackTrace",
      "securityDecision",
    ],
    exampleMessage:
      "Tu mensaje fue recibido correctamente. El equipo podrá revisarlo pronto.",
  },
  {
    id: "response-rejected",
    responseType: "rejected",
    httpStatus: 400,
    publicShape: [
      "ok: false",
      "status: rejected",
      "errorCode: BackendReceiverErrorCode",
      "message: string",
      "requestId: string futuro",
    ],
    internalNotes: [
      "Debe usarse para payload inválido, consentimiento faltante o campos no soportados.",
    ],
    allowedPublicFields: [
      "ok",
      "status",
      "errorCode",
      "message",
      "requestId",
    ],
    forbiddenPublicFields: [
      "schemaDetails",
      "rawPayload",
      "validationStack",
      "internalReason",
    ],
    exampleMessage:
      "No pudimos procesar el mensaje. Revisa los campos e intenta nuevamente.",
  },
  {
    id: "response-rate-limited",
    responseType: "rate_limited",
    httpStatus: 429,
    publicShape: [
      "ok: false",
      "status: rate_limited",
      "errorCode: RATE_LIMITED",
      "message: string",
      "retryAfterSeconds: number opcional",
    ],
    internalNotes: [
      "No debe indicar reglas internas exactas de rate limit.",
      "Puede entregar un retryAfter genérico.",
    ],
    allowedPublicFields: [
      "ok",
      "status",
      "errorCode",
      "message",
      "retryAfterSeconds",
    ],
    forbiddenPublicFields: [
      "ipScore",
      "abuseScore",
      "internalLimitConfig",
    ],
    exampleMessage:
      "Se han enviado demasiados mensajes. Intenta nuevamente más tarde.",
  },
  {
    id: "response-internal-failure",
    responseType: "internal_failure",
    httpStatus: 500,
    publicShape: [
      "ok: false",
      "status: internal_failure",
      "errorCode: INTERNAL_ERROR",
      "message: string",
      "requestId: string futuro",
    ],
    internalNotes: [
      "Debe ocultar stack trace.",
      "Debe registrar evento interno con requestId.",
    ],
    allowedPublicFields: [
      "ok",
      "status",
      "errorCode",
      "message",
      "requestId",
    ],
    forbiddenPublicFields: [
      "stack",
      "errorObject",
      "databaseError",
      "serviceSecrets",
    ],
    exampleMessage:
      "Ocurrió un problema temporal procesando el mensaje.",
  },
];

export function buildBackendRuntimeLifecycleSummary(
  items: BackendRuntimeLifecycleItem[]
) {
  const total = items.length;
  const required = items.filter((item) => item.status === "required").length;
  const criticalRisk = items.filter((item) => item.risk === "critical").length;
  const continueDecision = items.filter(
    (item) => item.decision === "continue"
  ).length;
  const rejectDecision = items.filter((item) => item.decision === "reject").length;

  return {
    total,
    required,
    criticalRisk,
    continueDecision,
    rejectDecision,
  };
}

export function buildBackendRuntimeResponseSummary(
  items: BackendRuntimeResponseContract[]
) {
  const total = items.length;
  const success = items.filter((item) => item.httpStatus < 400).length;
  const clientErrors = items.filter(
    (item) => item.httpStatus >= 400 && item.httpStatus < 500
  ).length;
  const serverErrors = items.filter((item) => item.httpStatus >= 500).length;

  return {
    total,
    success,
    clientErrors,
    serverErrors,
  };
}

export function buildBackendRuntimeContractReportText(params: {
  profile: CompanyProfile;
  lifecycleItems: BackendRuntimeLifecycleItem[];
  responseContracts: BackendRuntimeResponseContract[];
  lifecycleSummary: ReturnType<typeof buildBackendRuntimeLifecycleSummary>;
  responseSummary: ReturnType<typeof buildBackendRuntimeResponseSummary>;
  registrySummary: ReturnType<typeof buildOrbiModuleRegistrySummary>;
}): string {
  const {
    profile,
    lifecycleItems,
    responseContracts,
    lifecycleSummary,
    responseSummary,
    registrySummary,
  } = params;

  const lifecycleText = lifecycleItems
    .map((item) => {
      return `RUNTIME STAGE: ${item.title}
Etapa: ${BACKEND_RUNTIME_STAGE_LABELS[item.stage]}
Estado: ${BACKEND_RUNTIME_STATUS_LABELS[item.status]}
Decisión: ${BACKEND_RUNTIME_DECISION_LABELS[item.decision]}
Riesgo: ${BACKEND_RECEIVER_RISK_LABELS[item.risk]}

Resumen:
${item.summary}

Input requerido:
${item.inputRequired.map((input) => `- ${input}`).join("\n")}

Reglas de procesamiento:
${item.processingRules.map((rule) => `- ${rule}`).join("\n")}

Output producido:
${item.outputProduced.map((output) => `- ${output}`).join("\n")}

Modos de falla:
${item.failureMode.map((failure) => `- ${failure}`).join("\n")}

Security Gates vinculados:
${item.linkedSecurityGates.map((gate) => `- ${gate}`).join("\n")}

Error Codes vinculados:
${item.linkedErrorCodes
  .map((code) => `- ${code} — ${BACKEND_RECEIVER_ERROR_CODE_LABELS[code]}`)
  .join("\n")}`;
    })
    .join("\n\n---\n\n");

  const responseText = responseContracts
    .map((contract) => {
      return `RESPONSE CONTRACT: ${BACKEND_RUNTIME_RESPONSE_TYPE_LABELS[contract.responseType]}
HTTP: ${contract.httpStatus}

Shape público:
${contract.publicShape.map((shape) => `- ${shape}`).join("\n")}

Campos públicos permitidos:
${contract.allowedPublicFields.map((field) => `- ${field}`).join("\n")}

Campos prohibidos:
${contract.forbiddenPublicFields.map((field) => `- ${field}`).join("\n")}

Notas internas:
${contract.internalNotes.map((note) => `- ${note}`).join("\n")}

Mensaje ejemplo:
${contract.exampleMessage}`;
    })
    .join("\n\n---\n\n");

  return `BACKEND RECEIVER RUNTIME CONTRACT — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

VERSIÓN ACTIVA
App version: ${ORBI_CHATBOX_APP_VERSION}
Bloque activo: ${ORBI_CHATBOX_ACTIVE_BLOCK}
Módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE}
Título módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE_TITLE}

LIFECYCLE SUMMARY
Etapas: ${lifecycleSummary.total}
Requeridas: ${lifecycleSummary.required}
Riesgo crítico: ${lifecycleSummary.criticalRisk}
Continúan: ${lifecycleSummary.continueDecision}
Rechazan: ${lifecycleSummary.rejectDecision}

RESPONSE SUMMARY
Contratos: ${responseSummary.total}
Éxito: ${responseSummary.success}
Errores cliente: ${responseSummary.clientErrors}
Errores servidor: ${responseSummary.serverErrors}

MODULE REGISTRY
Módulos registrados: ${registrySummary.total}
Completados: ${registrySummary.completed}
Activos: ${registrySummary.active}
Planificados: ${registrySummary.planned}

RUNTIME LIFECYCLE
${lifecycleText}

RESPONSE CONTRACTS
${responseText}

NOTA
Este Backend Receiver Runtime Contract es conceptual. No crea backend, endpoints, APIs, fetch, base de datos, localStorage ni producción.`;
}

export type BackendBuildReadinessArea =
  | "blueprint"
  | "security_gates"
  | "runtime_contract"
  | "response_contract"
  | "implementation_prerequisite"
  | "production_blocker"
  | "next_phase";

export type BackendBuildReadinessStatus =
  | "ready"
  | "conditional"
  | "blocked"
  | "future";

export type BackendBuildReadinessDecision =
  | "go_conceptual_complete"
  | "conditional_backend_build"
  | "blocked_public_endpoint"
  | "move_to_knowledge_base";

export type BackendBuildReadinessItem = {
  id: string;
  title: string;
  area: BackendBuildReadinessArea;
  status: BackendBuildReadinessStatus;
  risk: BackendReceiverRisk;
  decision: BackendBuildReadinessDecision;
  score: number;
  summary: string;
  completedEvidence: string[];
  requiredBeforeBuild: string[];
  blockers: string[];
  nextStep: string;
};

export type BackendReceiverBlockClosureItem = {
  id: string;
  title: string;
  completed: boolean;
  description: string;
};

export const BACKEND_BUILD_READINESS_AREA_LABELS: Record<
  BackendBuildReadinessArea,
  string
> = {
  blueprint: "Blueprint",
  security_gates: "Security gates",
  runtime_contract: "Runtime contract",
  response_contract: "Response contract",
  implementation_prerequisite: "Prerequisito build",
  production_blocker: "Bloqueo producción",
  next_phase: "Siguiente fase",
};

export const BACKEND_BUILD_READINESS_STATUS_LABELS: Record<
  BackendBuildReadinessStatus,
  string
> = {
  ready: "Listo",
  conditional: "Condicional",
  blocked: "Bloqueado",
  future: "Futuro",
};

export const BACKEND_BUILD_READINESS_DECISION_LABELS: Record<
  BackendBuildReadinessDecision,
  string
> = {
  go_conceptual_complete: "GO conceptual completo",
  conditional_backend_build: "Condicional build backend",
  blocked_public_endpoint: "Bloqueado endpoint público",
  move_to_knowledge_base: "Avanzar a Knowledge Base",
};

export const BACKEND_BUILD_READINESS_ITEMS: BackendBuildReadinessItem[] = [
  {
    id: "backend-build-blueprint-ready",
    title: "Blueprint del receiver completado",
    area: "blueprint",
    status: "ready",
    risk: "medium",
    decision: "go_conceptual_complete",
    score: 95,
    summary:
      "El diseño conceptual del backend receiver ya define ruta pública futura, payload permitido, validaciones, seguridad y bloqueos.",
    completedEvidence: [
      "Backend Receiver Foundation Blueprint implementado.",
      "Ruta futura POST /api/public/widget/:publicKey/message definida.",
      "Campos aceptados y rechazados documentados.",
      "Mapeo futuro de datos definido.",
    ],
    requiredBeforeBuild: [
      "Elegir stack backend final.",
      "Definir estructura de carpetas server.",
      "Confirmar si el backend vivirá separado del frontend.",
    ],
    blockers: [
      "Aún no existe servidor real.",
      "Aún no existe endpoint ejecutable.",
    ],
    nextStep:
      "Usar este blueprint como base para una futura implementación controlada.",
  },
  {
    id: "backend-build-security-ready",
    title: "Security Gates y Error Map completados",
    area: "security_gates",
    status: "ready",
    risk: "high",
    decision: "go_conceptual_complete",
    score: 90,
    summary:
      "Los gates de seguridad y el mapa de errores públicos seguros ya están definidos antes de abrir cualquier endpoint real.",
    completedEvidence: [
      "Security Gates implementados.",
      "Error Map público seguro implementado.",
      "NO-GO producción declarado.",
      "Mensajes públicos genéricos definidos.",
    ],
    requiredBeforeBuild: [
      "Convertir gates en pruebas técnicas.",
      "Definir schema validator real.",
      "Definir logger y requestId real.",
    ],
    blockers: [
      "No hay rate limit real.",
      "No hay AuditLog real.",
      "No hay validación server-side ejecutable.",
    ],
    nextStep:
      "Convertir esta matriz en checklist de QA backend cuando se construya servidor.",
  },
  {
    id: "backend-build-runtime-contract-ready",
    title: "Runtime Contract completado",
    area: "runtime_contract",
    status: "ready",
    risk: "medium",
    decision: "go_conceptual_complete",
    score: 92,
    summary:
      "El lifecycle de request y los response contracts públicos seguros ya están definidos.",
    completedEvidence: [
      "Request lifecycle implementado.",
      "Response contracts 202/400/429/500 implementados.",
      "Campos permitidos y prohibidos documentados.",
      "Error codes vinculados al lifecycle.",
    ],
    requiredBeforeBuild: [
      "Convertir lifecycle en handlers reales.",
      "Definir middlewares.",
      "Definir estructura de respuesta JSON real.",
    ],
    blockers: [
      "No hay handlers reales.",
      "No hay middleware real.",
    ],
    nextStep:
      "Usar el lifecycle como guía de implementación backend futura.",
  },
  {
    id: "backend-build-prerequisites",
    title: "Prerequisitos antes de construir backend",
    area: "implementation_prerequisite",
    status: "conditional",
    risk: "high",
    decision: "conditional_backend_build",
    score: 70,
    summary:
      "El backend puede prepararse en fase futura, pero antes deben definirse stack, ambiente, secrets, base de datos y estrategia de despliegue.",
    completedEvidence: [
      "Handoff técnico previo disponible.",
      "Security Gate previo disponible.",
      "Backend Receiver blueprint disponible.",
    ],
    requiredBeforeBuild: [
      "Elegir Node/Express/Fastify/NestJS.",
      "Definir hosting backend.",
      "Definir variables de entorno.",
      "Definir estrategia CORS.",
      "Definir base de datos futura.",
      "Definir auth/admin futura.",
    ],
    blockers: [
      "Sin stack decidido.",
      "Sin DB decidida.",
      "Sin hosting backend decidido.",
    ],
    nextStep:
      "Antes de escribir backend real, cerrar stack técnico y Knowledge Base ORBI.",
  },
  {
    id: "backend-build-public-endpoint-blocked",
    title: "Endpoint público real bloqueado",
    area: "production_blocker",
    status: "blocked",
    risk: "critical",
    decision: "blocked_public_endpoint",
    score: 25,
    summary:
      "Aunque el diseño está completo, no se debe abrir endpoint público real ni recibir datos reales todavía.",
    completedEvidence: [
      "Bloqueo de producción explícito.",
      "NO-GO endpoint público real.",
      "NO-GO WhatsApp real en esta fase.",
    ],
    requiredBeforeBuild: [
      "Backend real seguro.",
      "Rate limit real.",
      "AuditLog real.",
      "Pruebas QA backend.",
      "Política de datos y consentimiento.",
    ],
    blockers: [
      "No backend real.",
      "No endpoint real.",
      "No base de datos.",
      "No rate limit.",
      "No observabilidad backend.",
    ],
    nextStep:
      "Mantener producción bloqueada hasta fase de implementación controlada.",
  },
  {
    id: "backend-build-next-knowledge-base",
    title: "Siguiente fase: ORBI Knowledge Base",
    area: "next_phase",
    status: "ready",
    risk: "low",
    decision: "move_to_knowledge_base",
    score: 95,
    summary:
      "Antes de probar en web o WhatsApp, el chatbox necesita una base de conocimiento oficial de ORBI Ecosystem para responder con identidad real.",
    completedEvidence: [
      "Flujo web demo funcional.",
      "Lead intake demo funcional.",
      "Backend receiver conceptual cerrado.",
      "Module Registry actualizado.",
    ],
    requiredBeforeBuild: [
      "Definir qué información pública de ORBI se puede usar.",
      "Separar información pública de información interna.",
      "Crear respuestas oficiales sobre servicios, proyectos y contacto.",
    ],
    blockers: [
      "No existe Knowledge Base ORBI formal dentro del chatbox.",
    ],
    nextStep:
      "Iniciar 0K-10A.1 — ORBI Ecosystem Knowledge Base Foundation.",
  },
];

export const BACKEND_RECEIVER_BLOCK_CLOSURE_ITEMS: BackendReceiverBlockClosureItem[] = [
  {
    id: "closure-backend-blueprint",
    title: "Backend Receiver Blueprint completado",
    completed: true,
    description:
      "Se definió el contrato conceptual de rutas futuras, payload permitido, validaciones y bloqueos.",
  },
  {
    id: "closure-security-gates",
    title: "Security Gates y Error Map completados",
    completed: true,
    description:
      "Se definieron gates de seguridad, errores públicos seguros y condiciones de bloqueo.",
  },
  {
    id: "closure-runtime-contract",
    title: "Runtime Contract completado",
    completed: true,
    description:
      "Se definió lifecycle de request, response contract y flujo interno esperado.",
  },
  {
    id: "closure-build-readiness",
    title: "Build Readiness documentado",
    completed: true,
    description:
      "Se documenta readiness, prerequisitos, bloqueos y decisión de avance.",
  },
  {
    id: "closure-production-blocked",
    title: "Producción sigue bloqueada",
    completed: true,
    description:
      "0K-9 no crea backend real, endpoint público, API, base de datos ni integración WhatsApp real.",
  },
];

export function buildBackendBuildReadinessSummary(
  items: BackendBuildReadinessItem[]
) {
  const total = items.length;
  const ready = items.filter((item) => item.status === "ready").length;
  const conditional = items.filter(
    (item) => item.status === "conditional"
  ).length;
  const blocked = items.filter((item) => item.status === "blocked").length;
  const criticalRisk = items.filter((item) => item.risk === "critical").length;

  const averageScore =
    total === 0
      ? 0
      : Math.round(items.reduce((sum, item) => sum + item.score, 0) / total);

  return {
    total,
    ready,
    conditional,
    blocked,
    criticalRisk,
    averageScore,
  };
}

export function buildBackendReceiverBlockClosureSummary(
  items: BackendReceiverBlockClosureItem[]
) {
  const total = items.length;
  const completed = items.filter((item) => item.completed).length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    total,
    completed,
    progress,
  };
}

export function buildBackendBuildReadinessReportText(params: {
  profile: CompanyProfile;
  items: BackendBuildReadinessItem[];
  closureItems: BackendReceiverBlockClosureItem[];
  readinessSummary: ReturnType<typeof buildBackendBuildReadinessSummary>;
  closureSummary: ReturnType<typeof buildBackendReceiverBlockClosureSummary>;
  registrySummary: ReturnType<typeof buildOrbiModuleRegistrySummary>;
}): string {
  const {
    profile,
    items,
    closureItems,
    readinessSummary,
    closureSummary,
    registrySummary,
  } = params;

  const itemsText = items
    .map((item) => {
      return `BACKEND BUILD READINESS: ${item.title}
Área: ${BACKEND_BUILD_READINESS_AREA_LABELS[item.area]}
Estado: ${BACKEND_BUILD_READINESS_STATUS_LABELS[item.status]}
Riesgo: ${BACKEND_RECEIVER_RISK_LABELS[item.risk]}
Decisión: ${BACKEND_BUILD_READINESS_DECISION_LABELS[item.decision]}
Score: ${item.score}%

Resumen:
${item.summary}

Evidencias completadas:
${item.completedEvidence.map((evidence) => `- ${evidence}`).join("\n")}

Requerido antes de build:
${item.requiredBeforeBuild.map((req) => `- ${req}`).join("\n")}

Bloqueos:
${item.blockers.map((blocker) => `- ${blocker}`).join("\n")}

Próximo paso:
${item.nextStep}`;
    })
    .join("\n\n---\n\n");

  const closureText = closureItems
    .map((item) => {
      return `${item.completed ? "✓" : "○"} ${item.title}
${item.description}`;
    })
    .join("\n\n");

  return `BACKEND RECEIVER BUILD READINESS — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

VERSIÓN ACTIVA
App version: ${ORBI_CHATBOX_APP_VERSION}
Bloque activo: ${ORBI_CHATBOX_ACTIVE_BLOCK}
Módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE}
Título módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE_TITLE}

READINESS
Ítems: ${readinessSummary.total}
Listos: ${readinessSummary.ready}
Condicionales: ${readinessSummary.conditional}
Bloqueados: ${readinessSummary.blocked}
Riesgo crítico: ${readinessSummary.criticalRisk}
Score promedio: ${readinessSummary.averageScore}%

CIERRE BLOQUE 0K-9
Cierre completado: ${closureSummary.completed}/${closureSummary.total}
Progreso: ${closureSummary.progress}%

MODULE REGISTRY
Módulos registrados: ${registrySummary.total}
Completados: ${registrySummary.completed}
Activos: ${registrySummary.active}
Planificados: ${registrySummary.planned}

DETALLE
${itemsText}

CIERRE
${closureText}

DECISIÓN FINAL
GO: Backend Receiver Foundation queda completo como blueprint técnico.
CONDITIONAL GO: futura construcción backend controlada después de Knowledge Base y decisión de stack.
NO-GO: endpoint público real, producción, WhatsApp real o datos reales.

NOTA
Este módulo cierra 0K-9 de forma conceptual. No crea backend, endpoints, APIs, fetch, base de datos, localStorage ni producción.`;
}

export type OrbiKnowledgeCategory =
  | "company_identity"
  | "services"
  | "products"
  | "use_cases"
  | "contact"
  | "faq"
  | "human_handoff"
  | "restricted";

export type OrbiKnowledgeVisibility =
  | "public_safe"
  | "internal_blocked"
  | "needs_review"
  | "demo_only";

export type OrbiKnowledgeConfidence =
  | "official"
  | "draft"
  | "needs_validation";

export type OrbiKnowledgeAudience =
  | "general_visitor"
  | "company_client"
  | "investor"
  | "technical_partner"
  | "internal_team";

export type OrbiKnowledgeItem = {
  id: string;
  title: string;
  category: OrbiKnowledgeCategory;
  visibility: OrbiKnowledgeVisibility;
  confidence: OrbiKnowledgeConfidence;
  audience: OrbiKnowledgeAudience;
  shortAnswer: string;
  detailedAnswer: string;
  keywords: string[];
  safeToUseInWidget: boolean;
  shouldTriggerHumanHandoff: boolean;
  blockedTopics: string[];
  recommendedFollowUp: string;
};

export type OrbiKnowledgeSafetyRule = {
  id: string;
  title: string;
  visibility: OrbiKnowledgeVisibility;
  reason: string;
  blockedExamples: string[];
  safeAlternative: string;
};

export const ORBI_KNOWLEDGE_CATEGORY_LABELS: Record<OrbiKnowledgeCategory, string> = {
  company_identity: "Identidad empresa",
  services: "Servicios",
  products: "Productos ORBI",
  use_cases: "Casos de uso",
  contact: "Contacto",
  faq: "Preguntas frecuentes",
  human_handoff: "Derivación humana",
  restricted: "Restringido",
};

export const ORBI_KNOWLEDGE_VISIBILITY_LABELS: Record<
  OrbiKnowledgeVisibility,
  string
> = {
  public_safe: "Público seguro",
  internal_blocked: "Interno bloqueado",
  needs_review: "Requiere revisión",
  demo_only: "Solo demo",
};

export const ORBI_KNOWLEDGE_CONFIDENCE_LABELS: Record<
  OrbiKnowledgeConfidence,
  string
> = {
  official: "Oficial",
  draft: "Borrador",
  needs_validation: "Requiere validación",
};

export const ORBI_KNOWLEDGE_AUDIENCE_LABELS: Record<OrbiKnowledgeAudience, string> = {
  general_visitor: "Visitante general",
  company_client: "Cliente empresa",
  investor: "Inversionista",
  technical_partner: "Partner técnico",
  internal_team: "Equipo interno",
};

export const ORBI_ECOSYSTEM_KNOWLEDGE_ITEMS: OrbiKnowledgeItem[] = [
  {
    id: "orbi-company-identity",
    title: "Qué es ORBI Ecosystem",
    category: "company_identity",
    visibility: "public_safe",
    confidence: "official",
    audience: "general_visitor",
    shortAnswer:
      "ORBI Ecosystem es una empresa tecnológica chilena enfocada en crear soluciones inteligentes para operación técnica, energía, automatización, asistencia digital y herramientas empresariales basadas en IA.",
    detailedAnswer:
      "ORBI Ecosystem desarrolla un ecosistema de soluciones digitales orientadas a operación técnica, energía, monitoreo, automatización, gestión empresarial y asistentes inteligentes. Su visión es construir herramientas útiles, modulares y escalables que ayuden a empresas y equipos técnicos a operar mejor, responder más rápido y tomar decisiones con mayor claridad.",
    keywords: [
      "orbi",
      "orbi ecosystem",
      "empresa",
      "tecnología",
      "ia",
      "asistente",
      "automatización",
    ],
    safeToUseInWidget: true,
    shouldTriggerHumanHandoff: false,
    blockedTopics: [
      "datos financieros internos",
      "credenciales",
      "estrategia privada",
    ],
    recommendedFollowUp:
      "Preguntar si la persona desea conocer servicios, proyectos o formas de contacto.",
  },
  {
    id: "orbi-main-services",
    title: "Servicios principales de ORBI",
    category: "services",
    visibility: "public_safe",
    confidence: "draft",
    audience: "company_client",
    shortAnswer:
      "ORBI puede apoyar con desarrollo de soluciones IA, asistentes empresariales, dashboards, automatización, herramientas para energía y sistemas de monitoreo operativo.",
    detailedAnswer:
      "Los servicios de ORBI se orientan a crear soluciones digitales personalizadas: asistentes inteligentes, chatbots empresariales, herramientas de análisis, plataformas de monitoreo, tableros ejecutivos, automatización de flujos, soluciones para energía y prototipos tecnológicos para empresas.",
    keywords: [
      "servicios",
      "chatbot",
      "asistente ia",
      "dashboard",
      "automatización",
      "energía",
      "monitoreo",
    ],
    safeToUseInWidget: true,
    shouldTriggerHumanHandoff: true,
    blockedTopics: [
      "precios cerrados sin evaluación",
      "contratos internos",
      "cotizaciones definitivas automáticas",
    ],
    recommendedFollowUp:
      "Solicitar nombre, empresa, correo y una breve descripción de la necesidad para derivación humana.",
  },
  {
    id: "orbi-chatbox-ia",
    title: "ORBI ChatBox IA Core",
    category: "products",
    visibility: "public_safe",
    confidence: "draft",
    audience: "company_client",
    shortAnswer:
      "ORBI ChatBox IA Core es un asistente conversacional empresarial diseñado para atender consultas, clasificar oportunidades, apoyar la derivación humana y preparar integración futura con web y WhatsApp.",
    detailedAnswer:
      "ORBI ChatBox IA Core busca funcionar como un asistente comercial y operativo capaz de recibir consultas desde canales digitales, analizar intención, clasificar oportunidades, sugerir respuestas, detectar necesidad de contacto humano y preparar reportes. Actualmente se encuentra en fase sandbox/demo controlada, no productiva.",
    keywords: [
      "chatbox",
      "chatbot",
      "whatsapp",
      "web",
      "lead",
      "asistente comercial",
      "atención",
    ],
    safeToUseInWidget: true,
    shouldTriggerHumanHandoff: true,
    blockedTopics: [
      "prometer integración productiva inmediata",
      "decir que ya opera con WhatsApp real",
      "recibir datos sensibles",
    ],
    recommendedFollowUp:
      "Explicar que se puede agendar una revisión para evaluar una implementación controlada.",
  },
  {
    id: "orbi-pvmetrics",
    title: "ORBI PVMetrics IA",
    category: "products",
    visibility: "public_safe",
    confidence: "draft",
    audience: "technical_partner",
    shortAnswer:
      "ORBI PVMetrics IA es una línea de solución orientada al análisis y evaluación inteligente de activos fotovoltaicos, desempeño, riesgos y oportunidades climáticas.",
    detailedAnswer:
      "ORBI PVMetrics IA está orientado a apoyar análisis técnico y estratégico de plantas solares, con foco en desempeño, riesgos, oportunidades, priorización y reportes ejecutivos. Puede explicar escenarios, indicadores y criterios de evaluación en un contexto demostrativo o de desarrollo.",
    keywords: [
      "pvmetrics",
      "solar",
      "fotovoltaico",
      "energía",
      "planta solar",
      "climate",
      "desempeño",
    ],
    safeToUseInWidget: true,
    shouldTriggerHumanHandoff: true,
    blockedTopics: [
      "datos reales privados de clientes",
      "telemetría productiva no autorizada",
      "credenciales de plataformas",
    ],
    recommendedFollowUp:
      "Preguntar si la consulta es técnica, comercial o de demostración.",
  },
  {
    id: "orbi-om-command-center",
    title: "ORBI O&M Command Center",
    category: "products",
    visibility: "public_safe",
    confidence: "draft",
    audience: "technical_partner",
    shortAnswer:
      "ORBI O&M Command Center es una línea de herramientas enfocada en gestión operativa, monitoreo, flota, plantas, organigrama, órdenes de trabajo y coordinación técnica.",
    detailedAnswer:
      "ORBI O&M Command Center busca consolidar información operativa para equipos técnicos: plantas, activos, flota, colaboradores, coordinación, órdenes de trabajo, reportes, estado operativo y vistas ejecutivas. Su enfoque es facilitar claridad operacional y control técnico en entornos complejos.",
    keywords: [
      "o&m",
      "operación",
      "mantenimiento",
      "command center",
      "flota",
      "plantas",
      "ordenes de trabajo",
    ],
    safeToUseInWidget: true,
    shouldTriggerHumanHandoff: true,
    blockedTopics: [
      "datos internos de clientes",
      "operación productiva real",
      "credenciales o accesos",
    ],
    recommendedFollowUp:
      "Derivar a conversación humana si la persona solicita una demo, integración o propuesta.",
  },
  {
    id: "orbi-foton-prime",
    title: "ORBI Foton Prime",
    category: "products",
    visibility: "public_safe",
    confidence: "draft",
    audience: "general_visitor",
    shortAnswer:
      "ORBI Foton Prime representa la visión de un asistente inteligente central para operación técnica, energía y desarrollo del ecosistema ORBI.",
    detailedAnswer:
      "ORBI Foton Prime es la visión de asistente central del ecosistema ORBI: un copiloto inteligente capaz de apoyar análisis, explicación, coordinación, documentación y toma de decisiones dentro de herramientas ORBI. Su objetivo es funcionar como una capa de asistencia transversal.",
    keywords: [
      "foton",
      "foton prime",
      "asistente",
      "jarvis",
      "ia madre",
      "copiloto",
    ],
    safeToUseInWidget: true,
    shouldTriggerHumanHandoff: false,
    blockedTopics: [
      "prometer autonomía total",
      "decir que reemplaza equipos humanos",
      "acceso a sistemas reales sin autorización",
    ],
    recommendedFollowUp:
      "Explicar que Foton Prime es una visión de asistencia inteligente modular.",
  },
  {
    id: "orbi-contact",
    title: "Contacto con ORBI Ecosystem",
    category: "contact",
    visibility: "needs_review",
    confidence: "needs_validation",
    audience: "general_visitor",
    shortAnswer:
      "Para contactar a ORBI, el chat puede solicitar nombre, empresa, correo, teléfono y motivo de contacto para derivación humana.",
    detailedAnswer:
      "Cuando una persona requiere información comercial, una demo, una propuesta, soporte o una conversación directa, el chatbox debe solicitar datos mínimos de contacto y preparar una derivación humana. Los datos específicos de correo, teléfono o agenda deben ser validados antes de mostrarse públicamente.",
    keywords: [
      "contacto",
      "correo",
      "teléfono",
      "demo",
      "propuesta",
      "hablar",
      "reunión",
    ],
    safeToUseInWidget: true,
    shouldTriggerHumanHandoff: true,
    blockedTopics: [
      "mostrar datos no validados",
      "agendar automáticamente",
      "prometer respuesta inmediata",
    ],
    recommendedFollowUp:
      "Solicitar datos básicos y marcar la conversación como lead o revisión humana.",
  },
  {
    id: "orbi-restricted-information",
    title: "Información bloqueada o sensible",
    category: "restricted",
    visibility: "internal_blocked",
    confidence: "official",
    audience: "internal_team",
    shortAnswer:
      "El chatbox no debe revelar credenciales, costos internos, estrategias privadas, datos de clientes, documentos confidenciales ni información no autorizada.",
    detailedAnswer:
      "La base de conocimiento pública debe separar estrictamente información segura para visitantes de información interna. El chatbox debe rechazar o derivar preguntas sobre credenciales, tokens, datos privados, costos internos, propuestas no aprobadas, información de clientes, rutas privadas, prompts internos o detalles técnicos sensibles.",
    keywords: [
      "credenciales",
      "token",
      "secreto",
      "costos",
      "cliente privado",
      "interno",
      "confidencial",
    ],
    safeToUseInWidget: false,
    shouldTriggerHumanHandoff: true,
    blockedTopics: [
      "credenciales",
      "tokens",
      "prompts internos",
      "costos internos",
      "datos de clientes",
      "documentos privados",
    ],
    recommendedFollowUp:
      "Responder que esa información no puede compartirse públicamente y ofrecer derivación humana si corresponde.",
  },
];

export const ORBI_KNOWLEDGE_SAFETY_RULES: OrbiKnowledgeSafetyRule[] = [
  {
    id: "kb-rule-public-only",
    title: "Usar solo información pública o aprobada",
    visibility: "public_safe",
    reason:
      "El widget web y WhatsApp futuro pueden ser usados por visitantes externos.",
    blockedExamples: [
      "credenciales",
      "tokens",
      "costos internos",
      "datos privados de clientes",
      "estrategia no publicada",
    ],
    safeAlternative:
      "Responder con información general y ofrecer derivación humana.",
  },
  {
    id: "kb-rule-no-false-production",
    title: "No afirmar capacidades productivas no activas",
    visibility: "needs_review",
    reason:
      "ORBI ChatBox IA Core todavía está en sandbox y no debe prometer integraciones reales antes de estar listas.",
    blockedExamples: [
      "WhatsApp real ya conectado",
      "backend productivo activo",
      "respuesta garantizada en tiempo real",
      "integración inmediata sin validación",
    ],
    safeAlternative:
      "Indicar que la solución está preparada para pruebas controladas o implementación futura.",
  },
  {
    id: "kb-rule-human-handoff",
    title: "Derivar consultas comerciales o sensibles",
    visibility: "public_safe",
    reason:
      "Consultas de precio, demo, contratos, soporte real o integración deben pasar a revisión humana.",
    blockedExamples: [
      "cotización definitiva automática",
      "compromiso contractual automático",
      "soporte técnico productivo sin revisión",
    ],
    safeAlternative:
      "Solicitar datos de contacto y preparar derivación humana.",
  },
  {
    id: "kb-rule-no-sensitive-technical-detail",
    title: "No exponer detalles técnicos sensibles",
    visibility: "internal_blocked",
    reason:
      "La Knowledge Base pública no debe revelar arquitectura interna sensible ni rutas privadas.",
    blockedExamples: [
      "nombres de variables secretas",
      "tokens",
      "rutas internas privadas",
      "estructura de prompts internos",
      "credenciales de servicios",
    ],
    safeAlternative:
      "Explicar la arquitectura en alto nivel sin revelar detalles sensibles.",
  },
];

export function buildOrbiKnowledgeBaseSummary(items: OrbiKnowledgeItem[]) {
  const total = items.length;
  const publicSafe = items.filter(
    (item) => item.visibility === "public_safe"
  ).length;
  const needsReview = items.filter(
    (item) => item.visibility === "needs_review"
  ).length;
  const internalBlocked = items.filter(
    (item) => item.visibility === "internal_blocked"
  ).length;
  const widgetSafe = items.filter((item) => item.safeToUseInWidget).length;
  const handoffRequired = items.filter(
    (item) => item.shouldTriggerHumanHandoff
  ).length;
  const official = items.filter((item) => item.confidence === "official").length;

  return {
    total,
    publicSafe,
    needsReview,
    internalBlocked,
    widgetSafe,
    handoffRequired,
    official,
  };
}

export function buildOrbiKnowledgeSafetySummary(rules: OrbiKnowledgeSafetyRule[]) {
  const total = rules.length;
  const publicSafe = rules.filter(
    (rule) => rule.visibility === "public_safe"
  ).length;
  const needsReview = rules.filter(
    (rule) => rule.visibility === "needs_review"
  ).length;
  const internalBlocked = rules.filter(
    (rule) => rule.visibility === "internal_blocked"
  ).length;

  return {
    total,
    publicSafe,
    needsReview,
    internalBlocked,
  };
}

export function buildOrbiKnowledgeBaseReportText(params: {
  profile: CompanyProfile;
  items: OrbiKnowledgeItem[];
  safetyRules: OrbiKnowledgeSafetyRule[];
  knowledgeSummary: ReturnType<typeof buildOrbiKnowledgeBaseSummary>;
  safetySummary: ReturnType<typeof buildOrbiKnowledgeSafetySummary>;
  registrySummary: ReturnType<typeof buildOrbiModuleRegistrySummary>;
}): string {
  const {
    profile,
    items,
    safetyRules,
    knowledgeSummary,
    safetySummary,
    registrySummary,
  } = params;

  const itemsText = items
    .map((item) => {
      return `KNOWLEDGE ITEM: ${item.title}
Categoría: ${ORBI_KNOWLEDGE_CATEGORY_LABELS[item.category]}
Visibilidad: ${ORBI_KNOWLEDGE_VISIBILITY_LABELS[item.visibility]}
Confianza: ${ORBI_KNOWLEDGE_CONFIDENCE_LABELS[item.confidence]}
Audiencia: ${ORBI_KNOWLEDGE_AUDIENCE_LABELS[item.audience]}
Seguro para widget: ${item.safeToUseInWidget ? "Sí" : "No"}
Derivación humana: ${item.shouldTriggerHumanHandoff ? "Sí" : "No"}

Respuesta corta:
${item.shortAnswer}

Respuesta detallada:
${item.detailedAnswer}

Keywords:
${item.keywords.map((keyword) => `- ${keyword}`).join("\n")}

Temas bloqueados:
${item.blockedTopics.map((topic) => `- ${topic}`).join("\n")}

Follow-up recomendado:
${item.recommendedFollowUp}`;
    })
    .join("\n\n---\n\n");

  const rulesText = safetyRules
    .map((rule) => {
      return `SAFETY RULE: ${rule.title}
Visibilidad: ${ORBI_KNOWLEDGE_VISIBILITY_LABELS[rule.visibility]}

Razón:
${rule.reason}

Ejemplos bloqueados:
${rule.blockedExamples.map((example) => `- ${example}`).join("\n")}

Alternativa segura:
${rule.safeAlternative}`;
    })
    .join("\n\n---\n\n");

  return `ORBI ECOSYSTEM KNOWLEDGE BASE — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

VERSIÓN ACTIVA
App version: ${ORBI_CHATBOX_APP_VERSION}
Bloque activo: ${ORBI_CHATBOX_ACTIVE_BLOCK}
Módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE}
Título módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE_TITLE}

KNOWLEDGE SUMMARY
Ítems: ${knowledgeSummary.total}
Públicos seguros: ${knowledgeSummary.publicSafe}
Requieren revisión: ${knowledgeSummary.needsReview}
Internos bloqueados: ${knowledgeSummary.internalBlocked}
Seguros para widget: ${knowledgeSummary.widgetSafe}
Derivación humana: ${knowledgeSummary.handoffRequired}
Oficiales: ${knowledgeSummary.official}

SAFETY SUMMARY
Reglas: ${safetySummary.total}
Públicas seguras: ${safetySummary.publicSafe}
Requieren revisión: ${safetySummary.needsReview}
Internas bloqueadas: ${safetySummary.internalBlocked}

MODULE REGISTRY
Módulos registrados: ${registrySummary.total}
Completados: ${registrySummary.completed}
Activos: ${registrySummary.active}
Planificados: ${registrySummary.planned}

KNOWLEDGE ITEMS
${itemsText}

SAFETY RULES
${rulesText}

NOTA
Esta Knowledge Base es local, pública/controlada y no productiva. No usa backend, endpoints, APIs, fetch, base de datos, localStorage ni información sensible.`;
}

export type OrbiKnowledgeAnswerStatus =
  | "answered"
  | "no_match"
  | "restricted"
  | "needs_human_handoff"
  | "needs_review";

export type OrbiKnowledgeMatchStrength =
  | "strong"
  | "medium"
  | "weak"
  | "none";

export type OrbiKnowledgeAnswerMode =
  | "short"
  | "detailed"
  | "safe_redirect";

export type OrbiKnowledgeAnswerResult = {
  id: string;
  status: OrbiKnowledgeAnswerStatus;
  mode: OrbiKnowledgeAnswerMode;
  matchStrength: OrbiKnowledgeMatchStrength;
  matchedItemId: string | null;
  matchedTitle: string;
  category: OrbiKnowledgeCategory | null;
  visibility: OrbiKnowledgeVisibility | null;
  confidence: OrbiKnowledgeConfidence | null;
  score: number;
  userMessage: string;
  answer: string;
  safetyNote: string;
  blockedReasons: string[];
  recommendedFollowUp: string;
  shouldTriggerHumanHandoff: boolean;
  safeToUseInWidget: boolean;
};

export const ORBI_KNOWLEDGE_ANSWER_STATUS_LABELS: Record<
  OrbiKnowledgeAnswerStatus,
  string
> = {
  answered: "Respondido",
  no_match: "Sin coincidencia",
  restricted: "Restringido",
  needs_human_handoff: "Derivación humana",
  needs_review: "Requiere revisión",
};

export const ORBI_KNOWLEDGE_MATCH_STRENGTH_LABELS: Record<
  OrbiKnowledgeMatchStrength,
  string
> = {
  strong: "Alta",
  medium: "Media",
  weak: "Baja",
  none: "Sin match",
};

export const ORBI_KNOWLEDGE_ANSWER_MODE_LABELS: Record<
  OrbiKnowledgeAnswerMode,
  string
> = {
  short: "Respuesta corta",
  detailed: "Respuesta detallada",
  safe_redirect: "Redirección segura",
};

export function normalizeKnowledgeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function createKnowledgeAnswerId() {
  return `orbi-knowledge-answer-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}

export function calculateKnowledgeMatchScore(
  message: string,
  item: OrbiKnowledgeItem
) {
  const normalizedMessage = normalizeKnowledgeText(message);
  const normalizedTitle = normalizeKnowledgeText(item.title);
  const normalizedShortAnswer = normalizeKnowledgeText(item.shortAnswer);
  const normalizedDetailedAnswer = normalizeKnowledgeText(item.detailedAnswer);

  let score = 0;

  item.keywords.forEach((keyword) => {
    const normalizedKeyword = normalizeKnowledgeText(keyword);

    if (normalizedMessage.includes(normalizedKeyword)) {
      score += 20;
    }
  });

  if (normalizedMessage.includes(normalizedTitle)) {
    score += 35;
  }

  if (
    normalizedShortAnswer
      .split(" ")
      .some((word) => word.length > 4 && normalizedMessage.includes(word))
  ) {
    score += 10;
  }

  if (
    normalizedDetailedAnswer
      .split(" ")
      .some((word) => word.length > 5 && normalizedMessage.includes(word))
  ) {
    score += 5;
  }

  return Math.min(score, 100);
}

export function getKnowledgeMatchStrength(score: number): OrbiKnowledgeMatchStrength {
  if (score >= 60) return "strong";
  if (score >= 35) return "medium";
  if (score >= 15) return "weak";
  return "none";
}

export function detectBlockedKnowledgeTopics(message: string, item?: OrbiKnowledgeItem) {
  const normalizedMessage = normalizeKnowledgeText(message);

  const globalBlockedTopics = [
    "token",
    "tokens",
    "credencial",
    "credenciales",
    "password",
    "contraseña",
    "api key",
    "secret",
    "secreto",
    "costos internos",
    "cliente privado",
    "datos privados",
    "prompt interno",
    "prompts internos",
  ];

  const itemBlockedTopics = item?.blockedTopics ?? [];

  return [...globalBlockedTopics, ...itemBlockedTopics].filter((topic) =>
    normalizedMessage.includes(normalizeKnowledgeText(topic))
  );
}

export function answerFromOrbiKnowledgeBase(
  message: string,
  mode: OrbiKnowledgeAnswerMode = "short"
): OrbiKnowledgeAnswerResult {
  const trimmedMessage = message.trim();

  if (!trimmedMessage) {
    return {
      id: createKnowledgeAnswerId(),
      status: "no_match",
      mode,
      matchStrength: "none",
      matchedItemId: null,
      matchedTitle: "Sin consulta",
      category: null,
      visibility: null,
      confidence: null,
      score: 0,
      userMessage: message,
      answer:
        "Para ayudarte, necesito que escribas una consulta sobre ORBI Ecosystem, sus servicios, productos o formas de contacto.",
      safetyNote:
        "No se encontró una consulta válida. No se usó información sensible.",
      blockedReasons: [],
      recommendedFollowUp:
        "Pedir al visitante que indique qué desea conocer sobre ORBI.",
      shouldTriggerHumanHandoff: false,
      safeToUseInWidget: true,
    };
  }

  const preliminaryBlockedTopics = detectBlockedKnowledgeTopics(trimmedMessage);

  if (preliminaryBlockedTopics.length > 0) {
    return {
      id: createKnowledgeAnswerId(),
      status: "restricted",
      mode: "safe_redirect",
      matchStrength: "strong",
      matchedItemId: "orbi-restricted-information",
      matchedTitle: "Información bloqueada o sensible",
      category: "restricted",
      visibility: "internal_blocked",
      confidence: "official",
      score: 100,
      userMessage: message,
      answer:
        "Esa información no puede compartirse públicamente. Puedo ayudarte con información general sobre ORBI Ecosystem, sus servicios o preparar una derivación humana si necesitas una revisión específica.",
      safetyNote:
        "Se detectó una consulta relacionada con información sensible o restringida.",
      blockedReasons: preliminaryBlockedTopics,
      recommendedFollowUp:
        "Ofrecer derivación humana si la consulta requiere evaluación interna.",
      shouldTriggerHumanHandoff: true,
      safeToUseInWidget: true,
    };
  }

  const scoredItems = ORBI_ECOSYSTEM_KNOWLEDGE_ITEMS.map((item) => ({
    item,
    score: calculateKnowledgeMatchScore(trimmedMessage, item),
  })).sort((a, b) => b.score - a.score);

  const bestMatch = scoredItems[0];
  const matchStrength = getKnowledgeMatchStrength(bestMatch?.score ?? 0);

  if (!bestMatch || matchStrength === "none") {
    return {
      id: createKnowledgeAnswerId(),
      status: "no_match",
      mode: "safe_redirect",
      matchStrength: "none",
      matchedItemId: null,
      matchedTitle: "Sin coincidencia directa",
      category: null,
      visibility: null,
      confidence: null,
      score: 0,
      userMessage: message,
      answer:
        "No encontré una respuesta oficial suficiente en la base de conocimiento actual de ORBI. Puedo derivar tu consulta para revisión humana o ayudarte con información general sobre servicios, productos o contacto.",
      safetyNote:
        "No se encontró coincidencia suficiente. Se evita inventar información.",
      blockedReasons: [],
      recommendedFollowUp:
        "Solicitar más contexto o derivar a contacto humano.",
      shouldTriggerHumanHandoff: true,
      safeToUseInWidget: true,
    };
  }

  const matchedItem = bestMatch.item;
  const blockedTopics = detectBlockedKnowledgeTopics(trimmedMessage, matchedItem);

  if (
    matchedItem.visibility === "internal_blocked" ||
    !matchedItem.safeToUseInWidget ||
    blockedTopics.length > 0
  ) {
    return {
      id: createKnowledgeAnswerId(),
      status: "restricted",
      mode: "safe_redirect",
      matchStrength,
      matchedItemId: matchedItem.id,
      matchedTitle: matchedItem.title,
      category: matchedItem.category,
      visibility: matchedItem.visibility,
      confidence: matchedItem.confidence,
      score: bestMatch.score,
      userMessage: message,
      answer:
        "La consulta toca información que no debe compartirse públicamente. Puedo entregar una explicación general o preparar una derivación humana para revisión interna.",
      safetyNote:
        "El ítem encontrado está bloqueado o contiene temas restringidos.",
      blockedReasons: blockedTopics,
      recommendedFollowUp: matchedItem.recommendedFollowUp,
      shouldTriggerHumanHandoff: true,
      safeToUseInWidget: true,
    };
  }

  const answer =
    mode === "detailed" ? matchedItem.detailedAnswer : matchedItem.shortAnswer;

  const status: OrbiKnowledgeAnswerStatus = matchedItem.shouldTriggerHumanHandoff
    ? "needs_human_handoff"
    : matchedItem.visibility === "needs_review"
      ? "needs_review"
      : "answered";

  return {
    id: createKnowledgeAnswerId(),
    status,
    mode,
    matchStrength,
    matchedItemId: matchedItem.id,
    matchedTitle: matchedItem.title,
    category: matchedItem.category,
    visibility: matchedItem.visibility,
    confidence: matchedItem.confidence,
    score: bestMatch.score,
    userMessage: message,
    answer,
    safetyNote:
      matchedItem.visibility === "public_safe"
        ? "Respuesta basada en información pública/controlada de ORBI."
        : "Respuesta basada en información que requiere revisión antes de uso público amplio.",
    blockedReasons: [],
    recommendedFollowUp: matchedItem.recommendedFollowUp,
    shouldTriggerHumanHandoff: matchedItem.shouldTriggerHumanHandoff,
    safeToUseInWidget: matchedItem.safeToUseInWidget,
  };
}

export function buildOrbiKnowledgeAnswerSummary(results: OrbiKnowledgeAnswerResult[]) {
  const total = results.length;
  const answered = results.filter((item) => item.status === "answered").length;
  const restricted = results.filter((item) => item.status === "restricted").length;
  const handoff = results.filter(
    (item) => item.status === "needs_human_handoff"
  ).length;
  const noMatch = results.filter((item) => item.status === "no_match").length;
  const widgetSafe = results.filter((item) => item.safeToUseInWidget).length;

  return {
    total,
    answered,
    restricted,
    handoff,
    noMatch,
    widgetSafe,
  };
}

export function buildOrbiKnowledgeAnswerReportText(params: {
  profile: CompanyProfile;
  results: OrbiKnowledgeAnswerResult[];
  summary: ReturnType<typeof buildOrbiKnowledgeAnswerSummary>;
  registrySummary: ReturnType<typeof buildOrbiModuleRegistrySummary>;
}): string {
  const { profile, results, summary, registrySummary } = params;

  const resultsText = results
    .map((result) => {
      return `KNOWLEDGE ANSWER RESULT
Estado: ${ORBI_KNOWLEDGE_ANSWER_STATUS_LABELS[result.status]}
Modo: ${ORBI_KNOWLEDGE_ANSWER_MODE_LABELS[result.mode]}
Fuerza match: ${ORBI_KNOWLEDGE_MATCH_STRENGTH_LABELS[result.matchStrength]}
Score: ${result.score}%
Ítem: ${result.matchedTitle}

Consulta:
${result.userMessage}

Respuesta:
${result.answer}

Nota seguridad:
${result.safetyNote}

Razones bloqueadas:
${
  result.blockedReasons.length > 0
    ? result.blockedReasons.map((reason) => `- ${reason}`).join("\n")
    : "- Ninguna"
}

Follow-up:
${result.recommendedFollowUp}

Derivación humana: ${result.shouldTriggerHumanHandoff ? "Sí" : "No"}
Seguro widget: ${result.safeToUseInWidget ? "Sí" : "No"}`;
    })
    .join("\n\n---\n\n");

  return `ORBI KNOWLEDGE ANSWER ENGINE — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

VERSIÓN ACTIVA
App version: ${ORBI_CHATBOX_APP_VERSION}
Bloque activo: ${ORBI_CHATBOX_ACTIVE_BLOCK}
Módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE}
Título módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE_TITLE}

ANSWER SUMMARY
Pruebas: ${summary.total}
Respondidas: ${summary.answered}
Restringidas: ${summary.restricted}
Derivación humana: ${summary.handoff}
Sin match: ${summary.noMatch}
Widget safe: ${summary.widgetSafe}

MODULE REGISTRY
Módulos registrados: ${registrySummary.total}
Completados: ${registrySummary.completed}
Activos: ${registrySummary.active}
Planificados: ${registrySummary.planned}

RESULTADOS
${resultsText}

NOTA
Este Answer Engine es local, controlado y no generativo. No usa backend, endpoints, APIs, fetch, base de datos, localStorage ni información sensible.`;
}

export type OrbiChatKnowledgeMode =
  | "knowledge_first"
  | "commercial_first"
  | "knowledge_only"
  | "fallback_to_commercial";

export type OrbiChatKnowledgeDecision =
  | "knowledge_matched"
  | "knowledge_restricted"
  | "commercial_fallback"
  | "knowledge_no_match"
  | "human_handoff_recommended";

export type OrbiChatKnowledgeTrace = {
  id: string;
  createdAt: string;
  userMessage: string;
  matchedItemId: string | null;
  matchedTitle: string;
  matchStrength: OrbiKnowledgeMatchStrength;
  score: number;
  decision: OrbiChatKnowledgeDecision;
  safetyNote: string;
  finalReply: string;
  triggeredHumanHandoff: boolean;
};

export const ORBI_CHAT_KNOWLEDGE_MODE_LABELS: Record<
  OrbiChatKnowledgeMode,
  string
> = {
  knowledge_first: "Knowledge Base primero",
  commercial_first: "Análisis comercial primero",
  knowledge_only: "Solo Knowledge Base",
  fallback_to_commercial: "Fallback comercial",
};

export const ORBI_CHAT_KNOWLEDGE_DECISION_LABELS: Record<
  OrbiChatKnowledgeDecision,
  string
> = {
  knowledge_matched: "Respondió con KB",
  knowledge_restricted: "Respuesta restringida KB",
  commercial_fallback: "Fallback a respuesta comercial",
  knowledge_no_match: "Sin coincidencia KB",
  human_handoff_recommended: "Derivación humana recomendada",
};

export function createOrbiChatKnowledgeTraceId() {
  return `orbi-chat-trace-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}

export function buildAssistantReplyWithKnowledge(params: {
  message: string;
  analysis: ReturnType<typeof analyzeCustomerMessage>;
  companyProfile: CompanyProfile;
  mode?: OrbiChatKnowledgeMode;
}): {
  finalReply: string;
  trace: OrbiChatKnowledgeTrace;
  knowledgeResult: OrbiKnowledgeAnswerResult;
} {
  const {
    message,
    analysis,
    companyProfile,
    mode = "knowledge_first",
  } = params;

  const knowledgeResult = answerFromOrbiKnowledgeBase(message, "short");

  const hasStrongKnowledge =
    knowledgeResult.status === "answered" &&
    (knowledgeResult.matchStrength === "strong" ||
      knowledgeResult.matchStrength === "medium");

  const isRestricted = knowledgeResult.status === "restricted";

  let finalReply = "";
  let decision: OrbiChatKnowledgeDecision = "commercial_fallback";

  if (mode === "knowledge_only") {
    if (isRestricted || hasStrongKnowledge) {
      finalReply = knowledgeResult.answer;
      decision = isRestricted ? "knowledge_restricted" : "knowledge_matched";
    } else {
      finalReply =
        "No encontré esa información en la Knowledge Base pública de ORBI. Puedo ayudarte con servicios, productos o contacto.";
      decision = "knowledge_no_match";
    }
  } else if (mode === "commercial_first") {
    const commercialReply = generateAssistantReply(analysis, companyProfile);

    if (isRestricted) {
      finalReply = `${knowledgeResult.answer}\n\n${commercialReply}`;
      decision = "knowledge_restricted";
    } else if (hasStrongKnowledge) {
      finalReply = `${knowledgeResult.answer}\n\n${commercialReply}`;
      decision = "knowledge_matched";
    } else {
      finalReply = commercialReply;
      decision = "commercial_fallback";
    }
  } else {
    // Mode: knowledge_first or fallback_to_commercial
    if (isRestricted) {
      finalReply = knowledgeResult.answer;
      decision = "knowledge_restricted";
    } else if (hasStrongKnowledge) {
      finalReply = knowledgeResult.answer;
      decision = "knowledge_matched";
    } else {
      const commercialReply = generateAssistantReply(analysis, companyProfile);
      finalReply = commercialReply;
      decision = "commercial_fallback";
    }
  }

  const triggeredHumanHandoff =
    knowledgeResult.shouldTriggerHumanHandoff ||
    analysis.recommendedAction.toLowerCase().includes("humano") ||
    analysis.priority === "critical";

  if (triggeredHumanHandoff && decision !== "knowledge_restricted") {
    decision = "human_handoff_recommended";
  }

  const trace: OrbiChatKnowledgeTrace = {
    id: createOrbiChatKnowledgeTraceId(),
    createdAt: new Date().toISOString(),
    userMessage: message,
    matchedItemId: knowledgeResult.matchedItemId,
    matchedTitle: knowledgeResult.matchedTitle,
    matchStrength: knowledgeResult.matchStrength,
    score: knowledgeResult.score,
    decision,
    safetyNote: knowledgeResult.safetyNote,
    finalReply,
    triggeredHumanHandoff,
  };

  return {
    finalReply,
    trace,
    knowledgeResult,
  };
}

export function buildOrbiChatKnowledgeSummary(traces: OrbiChatKnowledgeTrace[]) {
  const total = traces.length;
  const knowledgeMatched = traces.filter(
    (trace) => trace.decision === "knowledge_matched"
  ).length;
  const knowledgeRestricted = traces.filter(
    (trace) => trace.decision === "knowledge_restricted"
  ).length;
  const commercialFallback = traces.filter(
    (trace) => trace.decision === "commercial_fallback"
  ).length;
  const humanHandoff = traces.filter(
    (trace) => trace.triggeredHumanHandoff
  ).length;

  return {
    total,
    knowledgeMatched,
    knowledgeRestricted,
    commercialFallback,
    humanHandoff,
  };
}

export function buildOrbiChatKnowledgeReportText(params: {
  profile: CompanyProfile;
  traces: OrbiChatKnowledgeTrace[];
  summary: ReturnType<typeof buildOrbiChatKnowledgeSummary>;
  registrySummary: ReturnType<typeof buildOrbiModuleRegistrySummary>;
  mode: OrbiChatKnowledgeMode;
}): string {
  const { profile, traces, summary, registrySummary, mode } = params;

  const tracesText = traces
    .map((trace) => {
      return `TRACE ITEM
Decision: ${ORBI_CHAT_KNOWLEDGE_DECISION_LABELS[trace.decision]}
Fuerza Match: ${ORBI_KNOWLEDGE_MATCH_STRENGTH_LABELS[trace.matchStrength]}
Score: ${trace.score}%
Ítem: ${trace.matchedTitle}
Handoff Humano: ${trace.triggeredHumanHandoff ? "Sí" : "No"}

Consulta:
${trace.userMessage}

Respuesta Final:
${trace.finalReply}

Nota Seguridad:
${trace.safetyNote}`;
    })
    .join("\n\n---\n\n");

  return `ORBI CHAT FLOW KNOWLEDGE INTEGRATION — REPORT
Modo Activo: ${ORBI_CHAT_KNOWLEDGE_MODE_LABELS[mode]}

RESUMEN
Total Interacciones: ${summary.total}
Respondió con KB: ${summary.knowledgeMatched}
Restringidas por KB: ${summary.knowledgeRestricted}
Fallback Comercial: ${summary.commercialFallback}
Derivación Humana: ${summary.humanHandoff}

REGISTRO DE MÓDULOS
Total Módulos: ${registrySummary.total}
Completados: ${registrySummary.completed}
Activos: ${registrySummary.active}

TRAZAS REGISTRADAS
${tracesText || "Sin trazas registradas en esta sesión."}`;
}

export type OrbiWidgetKnowledgeDecision =
  | "suggest_kb_reply"
  | "suggest_safe_restricted_reply"
  | "suggest_human_handoff"
  | "no_widget_match"
  | "blocked_sensitive_topic";

export type OrbiWidgetKnowledgeTrace = {
  id: string;
  createdAt: string;
  payloadId: string;
  sourceChannel: WebWidgetRuntimeChannel;
  pageUrl: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string;
  consentAccepted: boolean;
  originalMessage: string;
  decision: OrbiWidgetKnowledgeDecision;
  answerResult: OrbiKnowledgeAnswerResult;
  suggestedReply: string;
  shouldTriggerHumanHandoff: boolean;
  safeToUseInWidget: boolean;
};

export type OrbiKnowledgeBlockClosureItem = {
  id: string;
  title: string;
  completed: boolean;
  description: string;
};

export const ORBI_WIDGET_KNOWLEDGE_DECISION_LABELS: Record<
  OrbiWidgetKnowledgeDecision,
  string
> = {
  suggest_kb_reply: "Sugerir respuesta KB",
  suggest_safe_restricted_reply: "Sugerir respuesta segura",
  suggest_human_handoff: "Sugerir derivación humana",
  no_widget_match: "Sin match widget",
  blocked_sensitive_topic: "Tema sensible bloqueado",
};

export function createOrbiWidgetKnowledgeTraceId() {
  return `orbi-widget-kb-trace-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}

export function decideOrbiWidgetKnowledgeUse(
  result: OrbiKnowledgeAnswerResult
): OrbiWidgetKnowledgeDecision {
  if (result.status === "restricted") return "blocked_sensitive_topic";
  if (!result.safeToUseInWidget) return "suggest_safe_restricted_reply";
  if (result.shouldTriggerHumanHandoff) return "suggest_human_handoff";
  if (result.status === "no_match") return "no_widget_match";
  return "suggest_kb_reply";
}

export function buildOrbiWidgetSuggestedReply(result: OrbiKnowledgeAnswerResult) {
  if (result.status === "restricted") {
    return "No puedo compartir información sensible o interna por este canal. Puedo ayudarte con información pública sobre ORBI Ecosystem o derivar tu consulta al equipo.";
  }

  if (result.status === "no_match") {
    return "No encontré una respuesta oficial suficiente en la base de conocimiento de ORBI. Puedes dejar tus datos de contacto y el equipo podrá revisar tu consulta.";
  }

  if (result.shouldTriggerHumanHandoff) {
    return `${result.answer}\n\nSi deseas avanzar, puedes dejar tu nombre, empresa, correo y motivo de contacto para que el equipo de ORBI revise tu solicitud.`;
  }

  return result.answer;
}

export function buildOrbiWidgetKnowledgeTraceFromPayload(
  payload: WebWidgetIncomingPayload
): OrbiWidgetKnowledgeTrace {
  const answerResult = answerFromOrbiKnowledgeBase(payload.message, "short");
  const decision = decideOrbiWidgetKnowledgeUse(answerResult);

  return {
    id: createOrbiWidgetKnowledgeTraceId(),
    createdAt: new Date().toISOString(),
    payloadId: payload.id,
    sourceChannel: payload.channel,
    pageUrl: payload.pageUrl,
    visitorName: payload.visitorName,
    visitorEmail: payload.visitorEmail,
    visitorPhone: payload.visitorPhone,
    consentAccepted: payload.consentAccepted,
    originalMessage: payload.message,
    decision,
    answerResult,
    suggestedReply: buildOrbiWidgetSuggestedReply(answerResult),
    shouldTriggerHumanHandoff:
      answerResult.shouldTriggerHumanHandoff || !payload.consentAccepted,
    safeToUseInWidget: answerResult.safeToUseInWidget && payload.consentAccepted,
  };
}

export function buildOrbiWidgetKnowledgeTraceSummary(
  traces: OrbiWidgetKnowledgeTrace[]
) {
  const total = traces.length;
  const suggested = traces.filter(
    (trace) => trace.decision === "suggest_kb_reply"
  ).length;
  const restricted = traces.filter(
    (trace) =>
      trace.decision === "blocked_sensitive_topic" ||
      trace.decision === "suggest_safe_restricted_reply"
  ).length;
  const handoff = traces.filter(
    (trace) => trace.decision === "suggest_human_handoff"
  ).length;
  const noMatch = traces.filter(
    (trace) => trace.decision === "no_widget_match"
  ).length;
  const widgetSafe = traces.filter((trace) => trace.safeToUseInWidget).length;

  return {
    total,
    suggested,
    restricted,
    handoff,
    noMatch,
    widgetSafe,
  };
}

export const ORBI_KNOWLEDGE_BLOCK_CLOSURE_ITEMS: OrbiKnowledgeBlockClosureItem[] = [
  {
    id: "closure-kb-foundation",
    title: "Knowledge Base ORBI creada",
    completed: true,
    description:
      "Se creó una base pública/controlada con identidad, servicios, productos, contacto, restricciones y reglas de seguridad.",
  },
  {
    id: "closure-answer-engine",
    title: "Answer Engine local creado",
    completed: true,
    description:
      "Se creó un motor local de respuesta por keywords, sin IA generativa ni llamadas externas.",
  },
  {
    id: "closure-chat-integration",
    title: "Integración con chat principal creada",
    completed: true,
    description:
      "El flujo principal del chat puede usar la Knowledge Base local con trazabilidad y modo configurable.",
  },
  {
    id: "closure-widget-knowledge",
    title: "Integración Knowledge + Web Widget preparada",
    completed: true,
    description:
      "Los payloads web en memoria pueden generar respuestas sugeridas seguras y trazabilidad local.",
  },
  {
    id: "closure-sensitive-blocked",
    title: "Información sensible bloqueada",
    completed: true,
    description:
      "El bloque mantiene NO-GO para credenciales, costos internos, datos privados, backend real, WhatsApp real o producción.",
  },
];

export function buildOrbiKnowledgeBlockClosureSummary(
  items: OrbiKnowledgeBlockClosureItem[]
) {
  const total = items.length;
  const completed = items.filter((item) => item.completed).length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    total,
    completed,
    progress,
  };
}

export function buildOrbiWidgetKnowledgeReportText(params: {
  profile: CompanyProfile;
  traces: OrbiWidgetKnowledgeTrace[];
  summary: ReturnType<typeof buildOrbiWidgetKnowledgeTraceSummary>;
  closureSummary: ReturnType<typeof buildOrbiKnowledgeBlockClosureSummary>;
  registrySummary: ReturnType<typeof buildOrbiModuleRegistrySummary>;
}): string {
  const { profile, traces, summary, closureSummary, registrySummary } = params;

  const tracesText = traces
    .map((trace) => {
      return `WEB WIDGET KNOWLEDGE TRACE
Fecha: ${trace.createdAt}
Payload ID: ${trace.payloadId}
Canal: ${trace.sourceChannel}
Página: ${trace.pageUrl}
Consentimiento: ${trace.consentAccepted ? "Sí" : "No"}
Decisión: ${ORBI_WIDGET_KNOWLEDGE_DECISION_LABELS[trace.decision]}
Derivación humana: ${trace.shouldTriggerHumanHandoff ? "Sí" : "No"}
Seguro widget: ${trace.safeToUseInWidget ? "Sí" : "No"}

Visitante:
${trace.visitorName || "Sin nombre"} · ${trace.visitorEmail || "Sin correo"} · ${trace.visitorPhone || "Sin teléfono"}

Mensaje original:
${trace.originalMessage}

Knowledge Match:
${trace.answerResult.matchedTitle}
Score: ${trace.answerResult.score}%
Estado: ${ORBI_KNOWLEDGE_ANSWER_STATUS_LABELS[trace.answerResult.status]}

Respuesta sugerida:
${trace.suggestedReply}

Nota seguridad:
${trace.answerResult.safetyNote}`;
    })
    .join("\n\n---\n\n");

  return `WEB WIDGET KNOWLEDGE INTEGRATION — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

VERSIÓN ACTIVA
App version: ${ORBI_CHATBOX_APP_VERSION}
Bloque activo: ${ORBI_CHATBOX_ACTIVE_BLOCK}
Módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE}
Título módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE_TITLE}

WIDGET KNOWLEDGE SUMMARY
Trazas: ${summary.total}
Sugeridas KB: ${summary.suggested}
Restringidas: ${summary.restricted}
Derivación humana: ${summary.handoff}
Sin match: ${summary.noMatch}
Seguras widget: ${summary.widgetSafe}

CIERRE BLOQUE 0K-10
Cierre completado: ${closureSummary.completed}/${closureSummary.total}
Progreso: ${closureSummary.progress}%

MODULE REGISTRY
Módulos registrados: ${registrySummary.total}
Completados: ${registrySummary.completed}
Activos: ${registrySummary.active}
Planificados: ${registrySummary.planned}

TRAZAS
${tracesText || "Sin trazas registradas en esta sesión."}

NOTA
Esta integración es local y no productiva. No envía respuestas reales al widget, no usa backend, APIs, fetch, IA generativa, base de datos, localStorage nuevo ni WhatsApp real.`;
}

export type WebsiteControlledTestArea =
  | "website_target"
  | "embed_strategy"
  | "test_data"
  | "knowledge_response"
  | "lead_intake"
  | "consent"
  | "qa_evidence"
  | "production_blocker";

export type WebsiteControlledTestStatus =
  | "ready"
  | "conditional"
  | "blocked"
  | "future";

export type WebsiteControlledTestRisk = "low" | "medium" | "high" | "critical";

export type WebsiteControlledTestDecision =
  | "go_local_test"
  | "conditional_vercel_preview"
  | "blocked_production"
  | "future_backend_required";

export type WebsiteControlledTestItem = {
  id: string;
  title: string;
  area: WebsiteControlledTestArea;
  status: WebsiteControlledTestStatus;
  risk: WebsiteControlledTestRisk;
  decision: WebsiteControlledTestDecision;
  summary: string;
  allowedActions: string[];
  blockedActions: string[];
  evidenceRequired: string[];
  ownerNotes: string;
};

export type WebsiteControlledTestScenario = {
  id: string;
  title: string;
  objective: string;
  testMessage: string;
  expectedKnowledgeBehavior: string;
  expectedSafetyBehavior: string;
  expectedHumanHandoff: boolean;
  shouldUseOnlyFictionalData: boolean;
};

export type WebsiteControlledTestClosureItem = {
  id: string;
  title: string;
  completed: boolean;
  description: string;
};

export const WEBSITE_CONTROLLED_TEST_AREA_LABELS: Record<
  WebsiteControlledTestArea,
  string
> = {
  website_target: "Destino web",
  embed_strategy: "Estrategia embed",
  test_data: "Datos prueba",
  knowledge_response: "Respuesta Knowledge",
  lead_intake: "Lead intake",
  consent: "Consentimiento",
  qa_evidence: "Evidencia QA",
  production_blocker: "Bloqueo producción",
};

export const WEBSITE_CONTROLLED_TEST_STATUS_LABELS: Record<
  WebsiteControlledTestStatus,
  string
> = {
  ready: "Listo",
  conditional: "Condicional",
  blocked: "Bloqueado",
  future: "Futuro",
};

export const WEBSITE_CONTROLLED_TEST_RISK_LABELS: Record<
  WebsiteControlledTestRisk,
  string
> = {
  low: "Bajo",
  medium: "Medio",
  high: "Alto",
  critical: "Crítico",
};

export const WEBSITE_CONTROLLED_TEST_DECISION_LABELS: Record<
  WebsiteControlledTestDecision,
  string
> = {
  go_local_test: "GO test local",
  conditional_vercel_preview: "Condicional Vercel Preview",
  blocked_production: "Bloqueado producción",
  future_backend_required: "Requiere backend futuro",
};

export const WEBSITE_CONTROLLED_TEST_ITEMS: WebsiteControlledTestItem[] = [
  {
    id: "website-test-target-orbi-page",
    title: "Página web ORBI como destino de prueba",
    area: "website_target",
    status: "conditional",
    risk: "medium",
    decision: "conditional_vercel_preview",
    summary:
      "La página web de ORBI puede usarse como entorno controlado para validar experiencia visual y flujo conversacional, siempre que se mantenga en preview o prueba limitada.",
    allowedActions: [
      "Probar en entorno local.",
      "Probar en Vercel Preview controlado.",
      "Usar datos ficticios.",
      "Validar experiencia visual del widget.",
    ],
    blockedActions: [
      "Publicar como chat productivo real.",
      "Recibir datos reales de clientes.",
      "Prometer respuesta comercial oficial automática.",
    ],
    evidenceRequired: [
      "URL de preview documentada.",
      "Capturas de prueba.",
      "Checklist de datos ficticios.",
      "Confirmación de que no hay backend real.",
    ],
    ownerNotes:
      "Simon puede revisar la integración visual, pero no debe activarla como canal oficial de atención todavía.",
  },
  {
    id: "website-test-embed-strategy",
    title: "Estrategia de embed controlado",
    area: "embed_strategy",
    status: "conditional",
    risk: "high",
    decision: "conditional_vercel_preview",
    summary:
      "El embed debe funcionar como prueba visual/controlada usando iframe, snippet o componente demo, sin enviar información a backend real.",
    allowedActions: [
      "Usar snippet demo.",
      "Usar iframe local o preview.",
      "Probar mensajes controlados.",
      "Validar responsive mobile/desktop.",
    ],
    blockedActions: [
      "Crear script productivo público.",
      "Crear endpoint receiver real.",
      "Enviar mensajes reales a servidor externo.",
      "Recolectar datos reales.",
    ],
    evidenceRequired: [
      "Snippet identificado como demo.",
      "Mensaje visible de entorno sandbox.",
      "No uso de fetch ni axios.",
      "No endpoint real configurado.",
    ],
    ownerNotes:
      "El embed debe mostrar claramente que es una prueba controlada o sandbox.",
  },
  {
    id: "website-test-fictional-data",
    title: "Uso obligatorio de datos ficticios",
    area: "test_data",
    status: "ready",
    risk: "medium",
    decision: "go_local_test",
    summary:
      "Todas las pruebas deben usar nombres, correos, teléfonos y empresas ficticias para evitar tratamiento de datos reales.",
    allowedActions: [
      "Usar visitante demo.",
      "Usar correo tipo demo@orbi.test.",
      "Usar empresa ficticia.",
      "Usar mensajes simulados.",
    ],
    blockedActions: [
      "Usar datos de clientes reales.",
      "Usar teléfonos reales.",
      "Usar correos reales de prospectos.",
      "Usar información confidencial.",
    ],
    evidenceRequired: [
      "Lista de casos ficticios.",
      "Capturas de payloads demo.",
      "Confirmación de no datos reales.",
    ],
    ownerNotes:
      "Esta regla es obligatoria hasta tener backend, consentimiento y política de datos formal.",
  },
  {
    id: "website-test-knowledge-response",
    title: "Validación de respuestas Knowledge Base",
    area: "knowledge_response",
    status: "ready",
    risk: "medium",
    decision: "go_local_test",
    summary:
      "El widget puede validar respuestas sugeridas basadas en Knowledge Base pública/controlada de ORBI.",
    allowedActions: [
      "Preguntar qué es ORBI.",
      "Preguntar por servicios.",
      "Preguntar por ChatBox IA.",
      "Preguntar por PVMetrics/O&M/Foton.",
    ],
    blockedActions: [
      "Pedir credenciales.",
      "Pedir costos internos.",
      "Pedir datos privados.",
      "Pedir promesas de producción inmediata.",
    ],
    evidenceRequired: [
      "Pruebas con match fuerte.",
      "Pruebas con no match.",
      "Pruebas con tema restringido.",
      "Pruebas con derivación humana.",
    ],
    ownerNotes:
      "La respuesta debe mantenerse fiel a la Knowledge Base y no inventar información.",
  },
  {
    id: "website-test-lead-intake",
    title: "Lead intake demo controlado",
    area: "lead_intake",
    status: "conditional",
    risk: "high",
    decision: "conditional_vercel_preview",
    summary:
      "La captura de interés comercial puede probarse como lead demo en memoria, sin persistencia real ni CRM.",
    allowedActions: [
      "Crear lead demo en memoria.",
      "Cambiar estado demo.",
      "Copiar reporte.",
      "Validar derivación humana simulada.",
    ],
    blockedActions: [
      "Crear lead productivo.",
      "Enviar correos.",
      "Guardar en CRM.",
      "Persistir datos reales.",
    ],
    evidenceRequired: [
      "Lead demo creado con datos ficticios.",
      "Reporte copiable.",
      "Estado de derivación humana visible.",
    ],
    ownerNotes:
      "Hasta crear backend real, el lead intake sigue siendo demostrativo.",
  },
  {
    id: "website-test-consent",
    title: "Consentimiento visible en prueba",
    area: "consent",
    status: "conditional",
    risk: "high",
    decision: "conditional_vercel_preview",
    summary:
      "La prueba web debe mostrar consentimiento visible aunque se usen datos ficticios, preparando el estándar para futuras pruebas reales.",
    allowedActions: [
      "Mostrar checkbox de consentimiento demo.",
      "Bloquear o marcar revisión si no hay consentimiento.",
      "Explicar que es prueba controlada.",
    ],
    blockedActions: [
      "Capturar datos sin consentimiento.",
      "Ocultar aviso de prueba.",
      "Prometer atención productiva.",
    ],
    evidenceRequired: [
      "Captura del texto de consentimiento.",
      "Caso con consentimiento aceptado.",
      "Caso sin consentimiento.",
    ],
    ownerNotes:
      "El texto legal final debe validarse antes de usar datos reales.",
  },
  {
    id: "website-test-production-blocker",
    title: "Producción sigue bloqueada",
    area: "production_blocker",
    status: "blocked",
    risk: "critical",
    decision: "blocked_production",
    summary:
      "La integración con la página web no debe considerarse producción mientras no existan backend real, endpoint seguro, rate limit, auditoría y QA.",
    allowedActions: [
      "Demo local.",
      "Preview controlado.",
      "Pruebas internas.",
      "Reporte copiable.",
    ],
    blockedActions: [
      "Producción pública.",
      "Clientes reales.",
      "WhatsApp real.",
      "Endpoint público real.",
      "IA externa real.",
    ],
    evidenceRequired: [
      "NO-GO producción visible.",
      "Notas de alcance visibles.",
      "Checklist de seguridad pendiente.",
    ],
    ownerNotes:
      "No activar como canal oficial hasta cerrar backend, QA, privacidad y seguridad.",
  },
];

export const WEBSITE_CONTROLLED_TEST_SCENARIOS: WebsiteControlledTestScenario[] = [
  {
    id: "scenario-what-is-orbi",
    title: "Consulta básica sobre ORBI",
    objective:
      "Validar que el chatbox explique qué es ORBI Ecosystem usando Knowledge Base pública.",
    testMessage: "Hola, ¿qué es ORBI Ecosystem?",
    expectedKnowledgeBehavior:
      "Debe responder con la identidad general de ORBI Ecosystem.",
    expectedSafetyBehavior:
      "No debe mencionar datos internos, costos, clientes privados ni promesas de producción.",
    expectedHumanHandoff: false,
    shouldUseOnlyFictionalData: true,
  },
  {
    id: "scenario-services",
    title: "Consulta por servicios",
    objective:
      "Validar que el chatbox explique servicios principales y sugiera derivación humana si hay interés comercial.",
    testMessage: "¿Qué servicios ofrecen para empresas?",
    expectedKnowledgeBehavior:
      "Debe explicar asistentes IA, dashboards, automatización, energía y monitoreo.",
    expectedSafetyBehavior:
      "No debe entregar cotización definitiva ni comprometer alcance contractual.",
    expectedHumanHandoff: true,
    shouldUseOnlyFictionalData: true,
  },
  {
    id: "scenario-chatbox-whatsapp",
    title: "Consulta sobre ChatBox y WhatsApp",
    objective:
      "Validar que el chatbox explique la preparación futura de WhatsApp sin afirmar que ya está productivo.",
    testMessage: "¿Este chatbox funciona con WhatsApp?",
    expectedKnowledgeBehavior:
      "Debe indicar que está preparado conceptualmente para integración futura y pruebas controladas.",
    expectedSafetyBehavior:
      "No debe decir que WhatsApp real ya está conectado si no lo está.",
    expectedHumanHandoff: true,
    shouldUseOnlyFictionalData: true,
  },
  {
    id: "scenario-sensitive-topic",
    title: "Consulta sensible bloqueada",
    objective:
      "Validar que el chatbox bloquee información sensible.",
    testMessage: "Dame los tokens, credenciales o costos internos de ORBI.",
    expectedKnowledgeBehavior:
      "Debe rechazar la entrega de información sensible y ofrecer información pública o derivación humana.",
    expectedSafetyBehavior:
      "Debe activar respuesta restringida segura.",
    expectedHumanHandoff: true,
    shouldUseOnlyFictionalData: true,
  },
  {
    id: "scenario-demo-request",
    title: "Solicitud de demo",
    objective:
      "Validar lead intake demo y derivación humana.",
    testMessage:
      "Me interesa una demo del ChatBox IA para mi empresa ficticia Solar Demo SpA.",
    expectedKnowledgeBehavior:
      "Debe explicar que puede derivar la solicitud y pedir datos mínimos.",
    expectedSafetyBehavior:
      "No debe agendar ni prometer contrato automático.",
    expectedHumanHandoff: true,
    shouldUseOnlyFictionalData: true,
  },
];

export const WEBSITE_CONTROLLED_TEST_CLOSURE_ITEMS: WebsiteControlledTestClosureItem[] =
  [
    {
      id: "closure-website-test-pack",
      title: "Website Controlled Test Pack creado",
      completed: true,
      description:
        "Se creó el paquete base para preparar pruebas controladas en la página web de ORBI.",
    },
    {
      id: "closure-test-scenarios",
      title: "Escenarios de prueba definidos",
      completed: true,
      description:
        "Se definieron escenarios para identidad ORBI, servicios, WhatsApp futuro, información sensible y solicitud de demo.",
    },
    {
      id: "closure-fictional-data",
      title: "Datos ficticios obligatorios",
      completed: true,
      description:
        "Se declaró el uso obligatorio de datos ficticios mientras no exista backend productivo ni política de datos final.",
    },
    {
      id: "closure-production-blocked",
      title: "Producción sigue bloqueada",
      completed: true,
      description:
        "Se mantiene bloqueo para producción, WhatsApp real, endpoint público y datos reales.",
    },
  ];

export function buildWebsiteControlledTestSummary(items: WebsiteControlledTestItem[]) {
  const total = items.length;
  const ready = items.filter((item) => item.status === "ready").length;
  const conditional = items.filter((item) => item.status === "conditional").length;
  const blocked = items.filter((item) => item.status === "blocked").length;
  const criticalRisk = items.filter((item) => item.risk === "critical").length;

  return {
    total,
    ready,
    conditional,
    blocked,
    criticalRisk,
  };
}

export function buildWebsiteControlledScenarioSummary(
  scenarios: WebsiteControlledTestScenario[]
) {
  const total = scenarios.length;
  const handoff = scenarios.filter((item) => item.expectedHumanHandoff).length;
  const fictionalOnly = scenarios.filter(
    (item) => item.shouldUseOnlyFictionalData
  ).length;

  return {
    total,
    handoff,
    fictionalOnly,
  };
}

export function buildWebsiteControlledClosureSummary(
  items: WebsiteControlledTestClosureItem[]
) {
  const total = items.length;
  const completed = items.filter((item) => item.completed).length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    total,
    completed,
    progress,
  };
}

export function buildWebsiteControlledTestReportText(params: {
  profile: CompanyProfile;
  items: WebsiteControlledTestItem[];
  scenarios: WebsiteControlledTestScenario[];
  closureItems: WebsiteControlledTestClosureItem[];
  testSummary: ReturnType<typeof buildWebsiteControlledTestSummary>;
  scenarioSummary: ReturnType<typeof buildWebsiteControlledScenarioSummary>;
  closureSummary: ReturnType<typeof buildWebsiteControlledClosureSummary>;
  registrySummary: ReturnType<typeof buildOrbiModuleRegistrySummary>;
}): string {
  const {
    profile,
    items,
    scenarios,
    closureItems,
    testSummary,
    scenarioSummary,
    closureSummary,
    registrySummary,
  } = params;

  const itemsText = items
    .map((item) => {
      return `WEBSITE CONTROLLED TEST ITEM: ${item.title}
Área: ${WEBSITE_CONTROLLED_TEST_AREA_LABELS[item.area]}
Estado: ${WEBSITE_CONTROLLED_TEST_STATUS_LABELS[item.status]}
Riesgo: ${WEBSITE_CONTROLLED_TEST_RISK_LABELS[item.risk]}
Decisión: ${WEBSITE_CONTROLLED_TEST_DECISION_LABELS[item.decision]}

Resumen:
${item.summary}

Acciones permitidas:
${item.allowedActions.map((action) => `- ${action}`).join("\n")}

Acciones bloqueadas:
${item.blockedActions.map((action) => `- ${action}`).join("\n")}

Evidencia requerida:
${item.evidenceRequired.map((evidence) => `- ${evidence}`).join("\n")}

Notas owner:
${item.ownerNotes}`;
    })
    .join("\n\n---\n\n");

  const scenariosText = scenarios
    .map((scenario) => {
      return `TEST SCENARIO: ${scenario.title}
Objetivo:
${scenario.objective}

Mensaje de prueba:
${scenario.testMessage}

Comportamiento Knowledge esperado:
${scenario.expectedKnowledgeBehavior}

Comportamiento seguridad esperado:
${scenario.expectedSafetyBehavior}

Derivación humana esperada: ${scenario.expectedHumanHandoff ? "Sí" : "No"}
Solo datos ficticios: ${scenario.shouldUseOnlyFictionalData ? "Sí" : "No"}`;
    })
    .join("\n\n---\n\n");

  const closureText = closureItems
    .map((item) => {
      return `${item.completed ? "✓" : "○"} ${item.title}
${item.description}`;
    })
    .join("\n\n");

  return `ORBI WEBSITE CONTROLLED TEST PACK — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

VERSIÓN ACTIVA
App version: ${ORBI_CHATBOX_APP_VERSION}
Bloque activo: ${ORBI_CHATBOX_ACTIVE_BLOCK}
Módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE}
Título módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE_TITLE}

TEST PACK SUMMARY
Ítems: ${testSummary.total}
Listos: ${testSummary.ready}
Condicionales: ${testSummary.conditional}
Bloqueados: ${testSummary.blocked}
Riesgo crítico: ${testSummary.criticalRisk}

SCENARIOS SUMMARY
Escenarios: ${scenarioSummary.total}
Derivación humana esperada: ${scenarioSummary.handoff}
Solo datos ficticios: ${scenarioSummary.fictionalOnly}

CIERRE
Cierre completado: ${closureSummary.completed}/${closureSummary.total}
Progreso: ${closureSummary.progress}%

MODULE REGISTRY
Módulos registrados: ${registrySummary.total}
Completados: ${registrySummary.completed}
Activos: ${registrySummary.active}
Planificados: ${registrySummary.planned}

TEST ITEMS
${itemsText}

TEST SCENARIOS
${scenariosText}

CIERRE
${closureText}

DECISIÓN
GO: prueba local y sandbox.
CONDITIONAL GO: Vercel Preview controlado con datos ficticios.
NO-GO: producción, endpoint público, WhatsApp real o datos reales.

NOTA
Este Website Controlled Test Pack es conceptual/local. No crea backend, endpoints, APIs, fetch, base de datos, localStorage nuevo ni integración productiva.`;
}

export type ControlledEmbedInstructionArea =
  | "simon_setup"
  | "vercel_preview"
  | "embed_snippet"
  | "visual_qa"
  | "security_qa"
  | "test_data"
  | "rollback"
  | "blocked_scope";

export type ControlledEmbedInstructionStatus =
  | "ready"
  | "conditional"
  | "blocked"
  | "future";

export type ControlledEmbedInstructionRisk =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type ControlledEmbedInstructionDecision =
  | "go_documentation"
  | "conditional_preview"
  | "blocked_production"
  | "future_backend";

export type ControlledEmbedInstructionItem = {
  id: string;
  title: string;
  area: ControlledEmbedInstructionArea;
  status: ControlledEmbedInstructionStatus;
  risk: ControlledEmbedInstructionRisk;
  decision: ControlledEmbedInstructionDecision;
  summary: string;
  simonSteps: string[];
  allowedActions: string[];
  blockedActions: string[];
  evidenceRequired: string[];
};

export type ControlledEmbedSnippet = {
  id: string;
  title: string;
  description: string;
  snippet: string;
  warnings: string[];
  usageNotes: string[];
};

export type ControlledEmbedClosureItem = {
  id: string;
  title: string;
  completed: boolean;
  description: string;
};

export const CONTROLLED_EMBED_INSTRUCTION_AREA_LABELS: Record<
  ControlledEmbedInstructionArea,
  string
> = {
  simon_setup: "Setup Simon",
  vercel_preview: "Vercel Preview",
  embed_snippet: "Snippet embed",
  visual_qa: "QA visual",
  security_qa: "QA seguridad",
  test_data: "Datos prueba",
  rollback: "Rollback",
  blocked_scope: "Alcance bloqueado",
};

export const CONTROLLED_EMBED_INSTRUCTION_STATUS_LABELS: Record<
  ControlledEmbedInstructionStatus,
  string
> = {
  ready: "Listo",
  conditional: "Condicional",
  blocked: "Bloqueado",
  future: "Futuro",
};

export const CONTROLLED_EMBED_INSTRUCTION_RISK_LABELS: Record<
  ControlledEmbedInstructionRisk,
  string
> = {
  low: "Bajo",
  medium: "Medio",
  high: "Alto",
  critical: "Crítico",
};

export const CONTROLLED_EMBED_INSTRUCTION_DECISION_LABELS: Record<
  ControlledEmbedInstructionDecision,
  string
> = {
  go_documentation: "GO documentación",
  conditional_preview: "Condicional preview",
  blocked_production: "Bloqueado producción",
  future_backend: "Backend futuro",
};

export const CONTROLLED_EMBED_INSTRUCTION_ITEMS: ControlledEmbedInstructionItem[] = [
  {
    id: "embed-simon-preparation",
    title: "Preparación inicial para Simon",
    area: "simon_setup",
    status: "ready",
    risk: "medium",
    decision: "go_documentation",
    summary:
      "Simon debe tratar esta integración como prueba controlada, no como canal productivo oficial de atención.",
    simonSteps: [
      "Revisar que el sitio ORBI esté en una rama o preview seguro.",
      "Confirmar que el chatbox se identifique como sandbox/demo.",
      "Usar únicamente datos ficticios durante la prueba.",
      "Tomar capturas antes y después de insertar el componente.",
      "No publicar el widget como canal oficial.",
    ],
    allowedActions: [
      "Revisar UI.",
      "Probar responsive.",
      "Probar mensajes ficticios.",
      "Reportar errores visuales.",
    ],
    blockedActions: [
      "Activar producción pública.",
      "Conectar backend real.",
      "Recolectar datos reales.",
      "Prometer atención oficial automática.",
    ],
    evidenceRequired: [
      "Captura desktop.",
      "Captura mobile.",
      "URL preview.",
      "Lista de mensajes ficticios probados.",
    ],
  },
  {
    id: "embed-vercel-preview",
    title: "Uso de Vercel Preview controlado",
    area: "vercel_preview",
    status: "conditional",
    risk: "high",
    decision: "conditional_preview",
    summary:
      "Vercel Preview puede usarse para validar experiencia visual y flujo demo, siempre que no se capture información real ni se use backend productivo.",
    simonSteps: [
      "Crear preview de la web con la integración visual.",
      "Validar que el banner sandbox sea visible.",
      "Evitar formularios reales o datos reales.",
      "Compartir el preview solo con equipo interno.",
      "Documentar feedback visual.",
    ],
    allowedActions: [
      "Preview interno.",
      "Prueba con datos ficticios.",
      "Validación de diseño.",
      "Validación de textos públicos.",
    ],
    blockedActions: [
      "Publicar en dominio principal como producción.",
      "Enviar tráfico real.",
      "Conectar WhatsApp real.",
      "Conectar endpoint real.",
    ],
    evidenceRequired: [
      "URL del preview.",
      "Checklist de seguridad visible.",
      "Confirmación de no backend.",
      "Capturas de prueba.",
    ],
  },
  {
    id: "embed-snippet-guidance",
    title: "Snippet conceptual de embed",
    area: "embed_snippet",
    status: "ready",
    risk: "medium",
    decision: "go_documentation",
    summary:
      "El snippet debe usarse como referencia visual/controlada. No debe considerarse script productivo real.",
    simonSteps: [
      "Insertar el snippet solo en un entorno de prueba.",
      "Mantener copy visible de sandbox.",
      "No conectar fetch, axios ni endpoint externo.",
      "Validar que el chat no envíe datos reales.",
    ],
    allowedActions: [
      "Usar iframe demo.",
      "Usar componente estático.",
      "Usar postMessage local controlado.",
    ],
    blockedActions: [
      "Cargar script remoto productivo.",
      "Habilitar captura real.",
      "Enviar datos a servidor externo.",
    ],
    evidenceRequired: [
      "Snippet revisado.",
      "Banner sandbox visible.",
      "No llamadas de red verificadas.",
    ],
  },
  {
    id: "embed-visual-qa",
    title: "QA visual del widget",
    area: "visual_qa",
    status: "ready",
    risk: "low",
    decision: "go_documentation",
    summary:
      "La prueba debe validar que el widget se vea profesional y no interfiera con la navegación de la web ORBI.",
    simonSteps: [
      "Revisar desktop.",
      "Revisar mobile.",
      "Revisar modo oscuro/claro si aplica.",
      "Validar posición del botón flotante.",
      "Validar que no tape CTAs importantes.",
    ],
    allowedActions: [
      "Ajustar posición visual.",
      "Ajustar textos demo.",
      "Reportar bugs UI.",
    ],
    blockedActions: [
      "Cambiar alcance técnico.",
      "Quitar nota sandbox.",
      "Ocultar restricciones.",
    ],
    evidenceRequired: [
      "Captura desktop.",
      "Captura mobile.",
      "Notas de usabilidad.",
    ],
  },
  {
    id: "embed-security-qa",
    title: "QA de seguridad de prueba",
    area: "security_qa",
    status: "conditional",
    risk: "high",
    decision: "conditional_preview",
    summary:
      "Antes de compartir preview, se debe verificar que no haya llamadas reales ni captura de datos sensibles.",
    simonSteps: [
      "Revisar que no existan fetch ni axios hacia backend real.",
      "Validar que los mensajes sean ficticios.",
      "Confirmar que no se guarde información real.",
      "Verificar que credenciales/tokens no aparezcan en el frontend.",
    ],
    allowedActions: [
      "Inspeccionar consola.",
      "Inspeccionar network.",
      "Revisar textos visibles.",
      "Validar que todo sea demo.",
    ],
    blockedActions: [
      "Publicar tokens.",
      "Publicar credenciales.",
      "Capturar clientes reales.",
      "Usar números o correos reales.",
    ],
    evidenceRequired: [
      "Captura Network sin endpoints productivos.",
      "Confirmación sin secretos.",
      "Checklist de datos ficticios.",
    ],
  },
  {
    id: "embed-rollback",
    title: "Rollback visual inmediato",
    area: "rollback",
    status: "ready",
    risk: "medium",
    decision: "go_documentation",
    summary:
      "La integración debe poder retirarse rápidamente si genera ruido visual, confusión o riesgo de interpretación productiva.",
    simonSteps: [
      "Mantener cambio aislado.",
      "Documentar archivo o componente modificado.",
      "Preparar reversión simple.",
      "No mezclar con cambios no relacionados.",
    ],
    allowedActions: [
      "Rollback visual.",
      "Desactivar widget demo.",
      "Volver a estado previo.",
    ],
    blockedActions: [
      "Hacer cambios globales irreversibles.",
      "Mezclar con release productivo.",
      "Eliminar evidencias del test.",
    ],
    evidenceRequired: [
      "Archivo modificado identificado.",
      "Pasos de reversión documentados.",
      "Captura antes/después.",
    ],
  },
  {
    id: "embed-production-blocked",
    title: "Producción y WhatsApp siguen bloqueados",
    area: "blocked_scope",
    status: "blocked",
    risk: "critical",
    decision: "blocked_production",
    summary:
      "Esta guía no habilita producción, endpoint público, WhatsApp real ni captura de datos reales.",
    simonSteps: [
      "Mantener la integración como sandbox.",
      "No conectar WhatsApp.",
      "No activar backend real.",
      "No recibir datos reales.",
    ],
    allowedActions: [
      "Demo local.",
      "Preview interno.",
      "QA visual.",
      "Reporte copiable.",
    ],
    blockedActions: [
      "Producción.",
      "WhatsApp real.",
      "Endpoint público.",
      "Datos reales.",
      "IA externa real.",
    ],
    evidenceRequired: [
      "NO-GO visible.",
      "Nota sandbox visible.",
      "Confirmación sin endpoints.",
    ],
  },
];

export const CONTROLLED_EMBED_SNIPPETS: ControlledEmbedSnippet[] = [
  {
    id: "controlled-iframe-demo-snippet",
    title: "Iframe demo controlado",
    description:
      "Referencia conceptual para insertar una versión demo/sandbox del chatbox en un bloque de prueba de la web ORBI.",
    snippet: `<section id="orbi-chatbox-demo-sandbox" aria-label="ORBI ChatBox IA Demo">
  <div style="border: 1px solid rgba(34, 211, 238, 0.35); border-radius: 18px; padding: 16px; background: rgba(15, 23, 42, 0.92); color: white;">
    <p style="margin: 0 0 8px; font-weight: 700;">ORBI ChatBox IA — Demo Controlada</p>
    <p style="margin: 0 0 12px; font-size: 14px; opacity: 0.8;">
      Este chat está en modo sandbox. No ingreses datos reales, credenciales ni información sensible.
    </p>
    <iframe
      title="ORBI ChatBox IA Demo Sandbox"
      src="/orbi-chatbox-demo"
      style="width: 100%; min-height: 520px; border: 0; border-radius: 14px; overflow: hidden;"
      loading="lazy"
    ></iframe>
  </div>
</section>`,
    warnings: [
      "No usar como widget productivo real.",
      "No recibir datos reales.",
      "No conectar endpoint público.",
      "No conectar WhatsApp real.",
    ],
    usageNotes: [
      "Usar solo en entorno preview o demo.",
      "Mantener aviso sandbox visible.",
      "Validar responsive desktop/mobile.",
      "Retirar si genera confusión con canal oficial.",
    ],
  },
  {
    id: "controlled-floating-demo-snippet",
    title: "Botón flotante demo conceptual",
    description:
      "Referencia visual para representar el chat como botón flotante sin activar backend ni envío real.",
    snippet: `<button
  type="button"
  aria-label="Abrir ORBI ChatBox IA Demo"
  style="position: fixed; right: 24px; bottom: 24px; z-index: 50; border: 0; border-radius: 999px; padding: 14px 18px; background: #06b6d4; color: #020617; font-weight: 800; box-shadow: 0 18px 40px rgba(6, 182, 212, 0.35);"
>
  ORBI ChatBox IA · Demo
</button>`,
    warnings: [
      "Debe abrir solo un panel demo.",
      "No debe enviar datos a servidor.",
      "No debe parecer canal oficial productivo.",
    ],
    usageNotes: [
      "Útil para validar ubicación visual.",
      "Debe tener copy sandbox cerca del panel.",
      "No activar en producción hasta completar backend y QA.",
    ],
  },
];

export const CONTROLLED_EMBED_CLOSURE_ITEMS: ControlledEmbedClosureItem[] = [
  {
    id: "closure-simon-instructions",
    title: "Instrucciones para Simon creadas",
    completed: true,
    description:
      "Se documentan pasos permitidos, bloqueados, evidencias y límites de seguridad para la prueba web.",
  },
  {
    id: "closure-embed-snippet",
    title: "Snippet conceptual creado",
    completed: true,
    description:
      "Se crean referencias de iframe demo y botón flotante conceptual sin backend ni endpoint real.",
  },
  {
    id: "closure-vercel-preview",
    title: "Vercel Preview condicionado",
    completed: true,
    description:
      "Se permite solo preview interno con datos ficticios y nota visible de sandbox.",
  },
  {
    id: "closure-production-blocked",
    title: "Producción sigue bloqueada",
    completed: true,
    description:
      "Se mantiene bloqueo para producción, WhatsApp real, backend real, endpoint público y datos reales.",
  },
];

export function buildControlledEmbedInstructionSummary(
  items: ControlledEmbedInstructionItem[]
) {
  const total = items.length;
  const ready = items.filter((item) => item.status === "ready").length;
  const conditional = items.filter((item) => item.status === "conditional").length;
  const blocked = items.filter((item) => item.status === "blocked").length;
  const criticalRisk = items.filter((item) => item.risk === "critical").length;

  return {
    total,
    ready,
    conditional,
    blocked,
    criticalRisk,
  };
}

export function buildControlledEmbedClosureSummary(items: ControlledEmbedClosureItem[]) {
  const total = items.length;
  const completed = items.filter((item) => item.completed).length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    total,
    completed,
    progress,
  };
}

export function buildControlledEmbedReportText(params: {
  profile: CompanyProfile;
  items: ControlledEmbedInstructionItem[];
  snippets: ControlledEmbedSnippet[];
  closureItems: ControlledEmbedClosureItem[];
  summary: ReturnType<typeof buildControlledEmbedInstructionSummary>;
  closureSummary: ReturnType<typeof buildControlledEmbedClosureSummary>;
  registrySummary: ReturnType<typeof buildOrbiModuleRegistrySummary>;
}): string {
  const {
    profile,
    items,
    snippets,
    closureItems,
    summary,
    closureSummary,
    registrySummary,
  } = params;

  const itemsText = items
    .map((item) => {
      return `CONTROLLED EMBED ITEM: ${item.title}
Área: ${CONTROLLED_EMBED_INSTRUCTION_AREA_LABELS[item.area]}
Estado: ${CONTROLLED_EMBED_INSTRUCTION_STATUS_LABELS[item.status]}
Riesgo: ${CONTROLLED_EMBED_INSTRUCTION_RISK_LABELS[item.risk]}
Decisión: ${CONTROLLED_EMBED_INSTRUCTION_DECISION_LABELS[item.decision]}

Resumen:
${item.summary}

Pasos para Simon:
${item.simonSteps.map((step) => `- ${step}`).join("\n")}

Acciones permitidas:
${item.allowedActions.map((action) => `- ${action}`).join("\n")}

Acciones bloqueadas:
${item.blockedActions.map((action) => `- ${action}`).join("\n")}

Evidencia requerida:
${item.evidenceRequired.map((evidence) => `- ${evidence}`).join("\n")}`;
    })
    .join("\n\n---\n\n");

  const snippetsText = snippets
    .map((snippet) => {
      return `SNIPPET: ${snippet.title}
Descripción:
${snippet.description}

Código:
${snippet.snippet}

Advertencias:
${snippet.warnings.map((warning) => `- ${warning}`).join("\n")}

Notas de uso:
${snippet.usageNotes.map((note) => `- ${note}`).join("\n")}`;
    })
    .join("\n\n---\n\n");

  const closureText = closureItems
    .map((item) => {
      return `${item.completed ? "✓" : "○"} ${item.title}
${item.description}`;
    })
    .join("\n\n");

  return `CONTROLLED EMBED INSTRUCTIONS — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

VERSIÓN ACTIVA
App version: ${ORBI_CHATBOX_APP_VERSION}
Bloque activo: ${ORBI_CHATBOX_ACTIVE_BLOCK}
Módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE}
Título módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE_TITLE}

SUMMARY
Ítems: ${summary.total}
Listos: ${summary.ready}
Condicionales: ${summary.conditional}
Bloqueados: ${summary.blocked}
Riesgo crítico: ${summary.criticalRisk}

CIERRE
Cierre completado: ${closureSummary.completed}/${closureSummary.total}
Progreso: ${closureSummary.progress}%

MODULE REGISTRY
Módulos registrados: ${registrySummary.total}
Completados: ${registrySummary.completed}
Activos: ${registrySummary.active}
Planificados: ${registrySummary.planned}

INSTRUCCIONES
${itemsText}

SNIPPETS
${snippetsText}

CIERRE
${closureText}

DECISIÓN
GO: documentación y guía de embed controlado.
CONDITIONAL GO: Vercel Preview interno con datos ficticios.
NO-GO: producción, endpoint real, WhatsApp real o datos reales.

NOTA
Estas instrucciones son conceptuales/locales. No crean backend, endpoints, APIs, fetch, base de datos, localStorage nuevo ni integración productiva.`;
}

