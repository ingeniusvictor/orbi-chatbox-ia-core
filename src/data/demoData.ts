// ORBI ChatBox IA Core — Simulated Demo & Commercial Data
import {
  CHAT_CHANNEL_LABELS, CUSTOMER_TYPE_LABELS, ChatChannel, CompanyProfile, InterfaceMode, LeadPriority, LeadRecord, ORBI_SERVICE_LABELS, OrbiService
} from "./companyData";

export type DailyLeadSummary = {
  totalRecords: number;
  criticalCount: number;
  highPriorityCount: number;
  humanContactCount: number;
  investorCount: number;
  companyLeadCount: number;
  mostRequestedService: OrbiService;
  latestNeeds: string[];
  recommendedActions: string[];
};

export function getMostRequestedService(records: LeadRecord[]): OrbiService {
  if (records.length === 0) {
    return "unknown";
  }

  const serviceCounter = records.reduce<Record<OrbiService, number>>(
    (counter, record) => {
      counter[record.serviceInterest] = (counter[record.serviceInterest] ?? 0) + 1;
      return counter;
    },
    {
      orbi_ecosystem_general: 0,
      orbi_corporate_assistant: 0,
      orbi_geo: 0,
      orbi_media_core: 0,
      orbi_docs_ia: 0,
      orbi_capture_pulse: 0,
      orbi_games: 0,
      investment_or_partnership: 0,
      unknown: 0,
    }
  );

  const sortedServices = Object.entries(serviceCounter).sort(
    (a, b) => b[1] - a[1]
  );

  return sortedServices[0][0] as OrbiService;
}

export function buildDailyLeadSummary(records: LeadRecord[]): DailyLeadSummary {
  const latestNeeds = records
    .slice(0, 5)
    .map((record) => `${CUSTOMER_TYPE_LABELS[record.customerType]} — ${record.mainNeed}`);

  const recommendedActions = Array.from(
    new Set(records.slice(0, 6).map((record) => record.recommendedAction))
  ).slice(0, 5);

  return {
    totalRecords: records.length,
    criticalCount: records.filter((record) => record.priority === "critical").length,
    highPriorityCount: records.filter((record) => record.priority === "high").length,
    humanContactCount: records.filter((record) => record.needsHumanContact).length,
    investorCount: records.filter((record) => record.customerType === "potential_investor").length,
    companyLeadCount: records.filter((record) => record.customerType === "company_lead").length,
    mostRequestedService: getMostRequestedService(records),
    latestNeeds,
    recommendedActions,
  };
}

export type SimulatedConversationStatus =
  | "new"
  | "in_review"
  | "replied"
  | "human_handoff"
  | "closed";

export const SIMULATED_CONVERSATION_STATUS_LABELS: Record<
  SimulatedConversationStatus,
  string
> = {
  new: "Nueva",
  in_review: "En revisión",
  replied: "Respondida",
  human_handoff: "Derivada",
  closed: "Cerrada",
};

export function getSimulatedConversationStatusDescription(
  status: SimulatedConversationStatus
): string {
  switch (status) {
    case "new":
      return "Conversación recibida y pendiente de revisión.";
    case "in_review":
      return "El equipo está revisando la solicitud.";
    case "replied":
      return "Ya existe una respuesta preparada o enviada manualmente.";
    case "human_handoff":
      return "Caso derivado a un contacto humano interno.";
    case "closed":
      return "Conversación cerrada o sin acción pendiente.";
    default:
      return "Estado no identificado.";
  }
}

export type SimulatedWhatsAppWebhookPayload = {
  provider: "whatsapp_business_future";
  eventType: "message_received";
  messageId: string;
  businessPhoneId: string;
  fromName: string;
  fromPhone: string;
  messageText: string;
  receivedAt: string;
  source: "simulated_webhook";
};

export function createSimulatedWebhookMessageId(): string {
  return `wa-msg-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function convertWebhookPayloadToSimulatedConversation(
  payload: SimulatedWhatsAppWebhookPayload
): SimulatedWhatsAppConversation {
  return {
    id: `wa-webhook-${payload.messageId}`,
    contactName: payload.fromName,
    phone: payload.fromPhone,
    lastMessage: payload.messageText,
    receivedAt: "Webhook simulado",
    unread: true,
    priorityHint: "medium",
    status: "new",
  };
}

export type SimulatedWhatsAppConversation = {
  id: string;
  contactName: string;
  phone: string;
  lastMessage: string;
  receivedAt: string;
  unread: boolean;
  priorityHint: LeadPriority;
  status: SimulatedConversationStatus;
};

export const INITIAL_SIMULATED_WHATSAPP_CONVERSATIONS: SimulatedWhatsAppConversation[] = [
  {
    id: "wa-sim-001",
    contactName: "María González",
    phone: "+56 9 1234 5678",
    lastMessage: "Hola, quiero cotizar una solución para atención automática de clientes.",
    receivedAt: "Hoy, 09:42",
    unread: true,
    priorityHint: "high",
    status: "new",
  },
  {
    id: "wa-sim-002",
    contactName: "Carlos Ramírez",
    phone: "+56 9 8765 4321",
    lastMessage: "Somos una empresa y necesitamos un chatbox para nuestra página web.",
    receivedAt: "Hoy, 10:15",
    unread: true,
    priorityHint: "high",
    status: "new",
  },
  {
    id: "wa-sim-003",
    contactName: "Inversiones Norte",
    phone: "+56 2 2222 3333",
    lastMessage: "Nos interesa conocer el proyecto ORBI y evaluar una posible inversión.",
    receivedAt: "Hoy, 11:08",
    unread: true,
    priorityHint: "critical",
    status: "new",
  },
  {
    id: "wa-sim-004",
    contactName: "Soporte Cliente",
    phone: "+56 9 5555 1111",
    lastMessage: "Necesito hablar con alguien porque tengo una consulta urgente.",
    receivedAt: "Hoy, 12:20",
    unread: false,
    priorityHint: "critical",
    status: "new",
  },
];

export type MultiChannelCommercialReport = {
  totalLeads: number;
  webDemoLeads: number;
  whatsAppFutureLeads: number;
  manualTestLeads: number;
  criticalLeads: number;
  highPriorityLeads: number;
  humanContactRequired: number;
  mostActiveChannel: ChatChannel | "none";
  mostRequestedService: string;
  executiveSummary: string;
};

export function countLeadsByChannel(
  records: LeadRecord[],
  channel: ChatChannel
): number {
  return records.filter((record) => record.channel === channel).length;
}

export function getMostActiveChannel(records: LeadRecord[]): ChatChannel | "none" {
  if (records.length === 0) {
    return "none";
  }

  const channelCounts: Record<ChatChannel, number> = {
    web_demo: 0,
    whatsapp_future: 0,
    manual_test: 0,
  };

  records.forEach((record) => {
    channelCounts[record.channel] = (channelCounts[record.channel] ?? 0) + 1;
  });

  return Object.entries(channelCounts).sort((a, b) => b[1] - a[1])[0][0] as
    | ChatChannel
    | "none";
}

export function getChannelDisplayName(channel: ChatChannel | "none"): string {
  if (channel === "none") {
    return "Sin datos";
  }

  return CHAT_CHANNEL_LABELS[channel] ?? channel;
}

export function getMostRequestedServiceFromRecords(records: LeadRecord[]): string {
  if (records.length === 0) {
    return "Sin datos";
  }

  const serviceCounts = records.reduce<Record<string, number>>((acc, record) => {
    const serviceName =
      record.customServiceName ??
      ORBI_SERVICE_LABELS[record.serviceInterest] ??
      "Servicio no identificado";

    acc[serviceName] = (acc[serviceName] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])[0][0];
}

export function buildMultiChannelCommercialReport(
  records: LeadRecord[]
): MultiChannelCommercialReport {
  const totalLeads = records.length;
  const webDemoLeads = countLeadsByChannel(records, "web_demo");
  const whatsAppFutureLeads = countLeadsByChannel(records, "whatsapp_future");
  const manualTestLeads = countLeadsByChannel(records, "manual_test");

  const criticalLeads = records.filter(
    (record) => record.priority === "critical"
  ).length;

  const highPriorityLeads = records.filter(
    (record) => record.priority === "high"
  ).length;

  const humanContactRequired = records.filter(
    (record) => record.needsHumanContact
  ).length;

  const mostActiveChannel = getMostActiveChannel(records);
  const mostRequestedService = getMostRequestedServiceFromRecords(records);

  const executiveSummary =
    totalLeads === 0
      ? "Aún no existen leads registrados. El sistema está listo para comenzar a capturar oportunidades desde los canales configurados."
      : `Se han registrado ${totalLeads} leads en total. El canal más activo es ${getChannelDisplayName(
          mostActiveChannel
        )}, con mayor interés detectado en ${mostRequestedService}. Existen ${humanContactRequired} oportunidades que requieren seguimiento humano.`;

  return {
    totalLeads,
    webDemoLeads,
    whatsAppFutureLeads,
    manualTestLeads,
    criticalLeads,
    highPriorityLeads,
    humanContactRequired,
    mostActiveChannel,
    mostRequestedService,
    executiveSummary,
  };
}

export function buildMultiChannelCommercialReportText(
  report: MultiChannelCommercialReport,
  profile: CompanyProfile
): string {
  return `REPORTE COMERCIAL MULTICANAL — ${profile.brandName}
Generado por: ${profile.assistantName}

RESUMEN EJECUTIVO
${report.executiveSummary}

MÉTRICAS GENERALES
Total de leads: ${report.totalLeads}
Leads Web Demo: ${report.webDemoLeads}
Leads WhatsApp Futuro: ${report.whatsAppFutureLeads}
Leads Prueba Manual: ${report.manualTestLeads}
Leads críticos: ${report.criticalLeads}
Leads de alta prioridad: ${report.highPriorityLeads}
Requieren contacto humano: ${report.humanContactRequired}

CANAL MÁS ACTIVO
${getChannelDisplayName(report.mostActiveChannel)}

SERVICIO MÁS CONSULTADO
${report.mostRequestedService}

NOTA
Este reporte se genera localmente a partir de los leads registrados en ORBI ChatBox IA Core.`;
}

export type OrbiLocalBackup = {
  backupVersion: "0G-1-local-backup";
  exportedAt: string;
  productName: "ORBI ChatBox IA Core";
  companyProfile: CompanyProfile;
  leadRecords: LeadRecord[];
  multiChannelReport: MultiChannelCommercialReport;
  dailySummary: DailyLeadSummary;
  metadata: {
    totalServices: number;
    totalHumanContacts: number;
    totalLeads: number;
    storageMode: "localStorage";
    environment: "local_prototype";
  };
};

export type BackupImportStatus =
  | "idle"
  | "loaded"
  | "invalid"
  | "restored"
  | "error";

export function isValidOrbiLocalBackup(value: unknown): value is OrbiLocalBackup {
  if (!value || typeof value !== "object") {
    return false;
  }

  const backup = value as Partial<OrbiLocalBackup>;

  return (
    backup.backupVersion === "0G-1-local-backup" &&
    backup.productName === "ORBI ChatBox IA Core" &&
    typeof backup.exportedAt === "string" &&
    !!backup.companyProfile &&
    Array.isArray(backup.leadRecords) &&
    !!backup.metadata
  );
}

export function buildOrbiLocalBackup(params: {
  companyProfile: CompanyProfile;
  leadRecords: LeadRecord[];
  multiChannelReport: MultiChannelCommercialReport;
  dailySummary: DailyLeadSummary;
}): OrbiLocalBackup {
  const { companyProfile, leadRecords, multiChannelReport, dailySummary } =
    params;

  return {
    backupVersion: "0G-1-local-backup",
    exportedAt: new Date().toISOString(),
    productName: "ORBI ChatBox IA Core",
    companyProfile,
    leadRecords,
    multiChannelReport,
    dailySummary,
    metadata: {
      totalServices: companyProfile.services.length,
      totalHumanContacts: companyProfile.humanContacts.length,
      totalLeads: leadRecords.length,
      storageMode: "localStorage",
      environment: "local_prototype",
    },
  };
}


export type DiagnosticStatus = "ready" | "warning" | "pending";

export type OrbiDiagnosticItem = {
  id: string;
  title: string;
  description: string;
  status: DiagnosticStatus;
  value?: string;
  recommendation?: string;
};

export const DIAGNOSTIC_STATUS_LABELS: Record<DiagnosticStatus, string> = {
  ready: "Listo",
  warning: "Revisar",
  pending: "Pendiente",
};

export function getDiagnosticStatusDescription(status: DiagnosticStatus): string {
  switch (status) {
    case "ready":
      return "Elemento configurado correctamente para la etapa actual del prototipo.";
    case "warning":
      return "Elemento disponible, pero conviene revisarlo antes de una demo o presentación.";
    case "pending":
      return "Elemento pendiente o reservado para una fase futura de producción.";
    default:
      return "Estado no identificado.";
  }
}

export function buildOrbiLocalDiagnostics(params: {
  companyProfile: CompanyProfile;
  leadRecords: LeadRecord[];
  interfaceMode: InterfaceMode;
}): OrbiDiagnosticItem[] {
  const { companyProfile, leadRecords, interfaceMode } = params;

  const hasCustomBrand =
    companyProfile.brandName.trim().length > 0 &&
    companyProfile.brandName !== "ORBI Ecosystem";

  const hasServices = companyProfile.services.length > 0;
  const hasHumanContacts = companyProfile.humanContacts.length > 0;
  const hasLeads = leadRecords.length > 0;

  const webDemoLeads = leadRecords.filter(
    (record) => record.channel === "web_demo"
  ).length;

  const whatsAppFutureLeads = leadRecords.filter(
    (record) => record.channel === "whatsapp_future"
  ).length;

  const manualTestLeads = leadRecords.filter(
    (record) => record.channel === "manual_test"
  ).length;

  return [
    {
      id: "company-profile",
      title: "Perfil empresarial",
      description: "Verifica que la marca, descripción, tono y mensaje de bienvenida estén configurados.",
      status: hasCustomBrand ? "ready" : "warning",
      value: companyProfile.brandName,
      recommendation: hasCustomBrand
        ? "Perfil empresarial activo y personalizado."
        : "Puedes personalizar la marca antes de una demo comercial.",
    },
    {
      id: "services",
      title: "Servicios configurados",
      description: "Revisa si la empresa tiene servicios cargados para que la IA pueda detectarlos.",
      status: hasServices ? "ready" : "pending",
      value: `${companyProfile.services.length} servicios`,
      recommendation: hasServices
        ? "Los servicios están disponibles para detección dinámica."
        : "Agrega al menos un servicio empresarial.",
    },
    {
      id: "human-contacts",
      title: "Contactos humanos",
      description: "Valida si existen contactos internos para derivaciones comerciales o soporte.",
      status: hasHumanContacts ? "ready" : "warning",
      value: `${companyProfile.humanContacts.length} contactos`,
      recommendation: hasHumanContacts
        ? "Las derivaciones humanas ya tienen contactos sugeridos."
        : "Agrega al menos un contacto humano para derivaciones.",
    },
    {
      id: "lead-records",
      title: "Leads registrados",
      description: "Muestra si el sistema ya tiene oportunidades comerciales capturadas.",
      status: hasLeads ? "ready" : "warning",
      value: `${leadRecords.length} leads`,
      recommendation: hasLeads
        ? "Existen datos suficientes para mostrar métricas y reportes."
        : "Genera algunos leads de prueba antes de presentar el sistema.",
    },
    {
      id: "web-demo-channel",
      title: "Canal Web Demo",
      description: "Canal usado por el widget web simulado.",
      status: "ready",
      value: `${webDemoLeads} leads`,
      recommendation: "El widget web está preparado para simulaciones locales.",
    },
    {
      id: "whatsapp-future-channel",
      title: "WhatsApp Futuro",
      description: "Canal reservado para integración futura con WhatsApp Business.",
      status: "warning",
      value: `${whatsAppFutureLeads} leads`,
      recommendation:
        "Actualmente es una simulación local. La conexión real requerirá backend, webhook, validación y políticas de privacidad.",
    },
    {
      id: "manual-test-channel",
      title: "Prueba Manual",
      description: "Canal usado para pruebas internas desde el panel administrativo.",
      status: "ready",
      value: `${manualTestLeads} leads`,
      recommendation: "Útil para validar respuestas y clasificación antes de una demo.",
    },
    {
      id: "widget-web",
      title: "Widget web",
      description: "Valida la preparación visual del botón flotante, panel compacto y vista pública.",
      status: "ready",
      value:
        interfaceMode === "web_widget"
          ? "Modo Widget Web activo"
          : "Disponible desde selector",
      recommendation: "El widget web está listo como prototipo visual local.",
    },
    {
      id: "local-backup",
      title: "Respaldo local",
      description: "Verifica si el sistema cuenta con exportación JSON local.",
      status: "ready",
      value: "Exportación disponible",
      recommendation: "Usar antes de limpiar datos o cambiar de empresa en pruebas.",
    },
    {
      id: "local-restore",
      title: "Restauración segura",
      description: "Verifica si el sistema permite restaurar respaldos validados.",
      status: "ready",
      value: "Importación validada",
      recommendation: "Solo restaurar archivos compatibles generados por ORBI ChatBox IA Core.",
    },
    {
      id: "production-readiness",
      title: "Producción real",
      description: "Estado general de preparación para despliegue real.",
      status: "pending",
      value: "Pendiente",
      recommendation:
        "Para producción se requiere backend seguro, base de datos, autenticación, privacidad, despliegue web y configuración real de canales.",
    },
  ];
}

export function buildDiagnosticSummary(items: OrbiDiagnosticItem[]): {
  ready: number;
  warning: number;
  pending: number;
  total: number;
  readinessPercentage: number;
} {
  const ready = items.filter((item) => item.status === "ready").length;
  const warning = items.filter((item) => item.status === "warning").length;
  const pending = items.filter((item) => item.status === "pending").length;
  const total = items.length;

  const readinessPercentage =
    total === 0 ? 0 : Math.round((ready / total) * 100);

  return {
    ready,
    warning,
    pending,
    total,
    readinessPercentage,
  };
}

export function buildOrbiDiagnosticReportText(params: {
  profile: CompanyProfile;
  summary: ReturnType<typeof buildDiagnosticSummary>;
  items: OrbiDiagnosticItem[];
}): string {
  const { profile, summary, items } = params;

  const itemLines = items
    .map((item) => {
      return `- ${item.title}: ${DIAGNOSTIC_STATUS_LABELS[item.status]}
  Valor: ${item.value ?? "No informado"}
  Recomendación: ${item.recommendation ?? "Sin recomendación"}`;
    })
    .join("\n\n");

  return `DIAGNÓSTICO LOCAL ORBI — ${profile.brandName}
Producto: ORBI ChatBox IA Core
Asistente: ${profile.assistantName}

RESUMEN GENERAL
Listos: ${summary.ready}
A revisar: ${summary.warning}
Pendientes: ${summary.pending}
Total evaluado: ${summary.total}
Preparación local estimada: ${summary.readinessPercentage}%

DETALLE
${itemLines}

NOTA
Este diagnóstico corresponde al prototipo local. Para producción real se requiere backend seguro, base de datos, autenticación, políticas de privacidad, despliegue web e integración oficial de canales.`;
}

export type ProductionChecklistStatus =
  | "completed"
  | "required"
  | "future"
  | "blocked";

export type ProductionChecklistPriority = "low" | "medium" | "high" | "critical";

export type ProductionChecklistCategory =
  | "infrastructure"
  | "security"
  | "data"
  | "web_widget"
  | "whatsapp_business"
  | "admin"
  | "legal_privacy"
  | "commercial";

export type ProductionChecklistItem = {
  id: string;
  title: string;
  description: string;
  category: ProductionChecklistCategory;
  status: ProductionChecklistStatus;
  priority: ProductionChecklistPriority;
  recommendation: string;
};

export const PRODUCTION_CHECKLIST_STATUS_LABELS: Record<
  ProductionChecklistStatus,
  string
> = {
  completed: "Cubierto en prototipo",
  required: "Requerido para producción",
  future: "Fase futura",
  blocked: "Bloqueante",
};

export const PRODUCTION_CHECKLIST_PRIORITY_LABELS: Record<
  ProductionChecklistPriority,
  string
> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  critical: "Crítica",
};

export const PRODUCTION_CHECKLIST_CATEGORY_LABELS: Record<
  ProductionChecklistCategory,
  string
> = {
  infrastructure: "Infraestructura",
  security: "Seguridad",
  data: "Datos",
  web_widget: "Widget Web",
  whatsapp_business: "WhatsApp Business",
  admin: "Administración",
  legal_privacy: "Legal y privacidad",
  commercial: "Comercialización",
};

export const PRODUCTION_CHECKLIST_ITEMS: ProductionChecklistItem[] = [
  {
    id: "frontend-prototype",
    title: "Prototipo frontend funcional",
    description:
      "La interfaz principal, el modo widget, el panel administrativo y los módulos locales ya están operativos.",
    category: "infrastructure",
    status: "completed",
    priority: "high",
    recommendation:
      "Mantener control de versiones antes de iniciar backend o despliegue productivo.",
  },
  {
    id: "secure-backend",
    title: "Backend seguro",
    description:
      "Servidor encargado de recibir conversaciones, gestionar empresas, usuarios, webhooks y persistencia real.",
    category: "infrastructure",
    status: "blocked",
    priority: "critical",
    recommendation:
      "Diseñar API segura con autenticación, validación, rate limiting y separación por empresa.",
  },
  {
    id: "database",
    title: "Base de datos empresarial",
    description:
      "Persistencia real para perfiles, conversaciones, leads, servicios, contactos y reportes.",
    category: "data",
    status: "required",
    priority: "critical",
    recommendation:
      "Definir modelo multiempresa antes de migrar datos desde localStorage.",
  },
  {
    id: "authentication",
    title: "Autenticación de administradores",
    description:
      "Acceso protegido para panel administrativo, configuración empresarial, exportaciones y reportes.",
    category: "security",
    status: "required",
    priority: "critical",
    recommendation:
      "Implementar login seguro, roles y sesiones antes de probar con clientes reales.",
  },
  {
    id: "role-permissions",
    title: "Roles y permisos",
    description:
      "Diferenciar administradores, comerciales, soporte, visualizadores e integradores técnicos.",
    category: "admin",
    status: "required",
    priority: "high",
    recommendation:
      "Crear matriz de permisos para proteger datos sensibles y acciones críticas.",
  },
  {
    id: "web-widget-bundle",
    title: "Build independiente del widget web",
    description:
      "Generar un script instalable real para páginas web, separado del panel administrador.",
    category: "web_widget",
    status: "required",
    priority: "high",
    recommendation:
      "Separar widget público y consola admin antes de crear CDN o embed real.",
  },
  {
    id: "cdn-hosting",
    title: "Alojamiento CDN del widget",
    description:
      "Hospedar el script del widget en un dominio o CDN estable con versionado.",
    category: "web_widget",
    status: "future",
    priority: "medium",
    recommendation:
      "Definir dominio, control de versiones y política de actualización del widget.",
  },
  {
    id: "whatsapp-business-api",
    title: "Integración oficial WhatsApp Business",
    description:
      "Conectar el sistema con WhatsApp Business mediante proveedor oficial, webhooks y permisos.",
    category: "whatsapp_business",
    status: "required",
    priority: "critical",
    recommendation:
      "Preparar backend, número empresarial verificado y políticas antes de solicitar integración real.",
  },
  {
    id: "webhook-validation",
    title: "Validación segura de webhooks",
    description:
      "Validar que los eventos recibidos provengan de un proveedor autorizado.",
    category: "security",
    status: "required",
    priority: "critical",
    recommendation:
      "Implementar verificación de firma, logs y rechazo de eventos no válidos.",
  },
  {
    id: "privacy-policy",
    title: "Política de privacidad",
    description:
      "Documento público que explique cómo se almacenan, procesan y protegen conversaciones y datos de contacto.",
    category: "legal_privacy",
    status: "required",
    priority: "critical",
    recommendation:
      "Crear política antes de usar el sistema con usuarios o clientes reales.",
  },
  {
    id: "consent-management",
    title: "Gestión de consentimiento",
    description:
      "Avisos y mecanismos para informar al usuario sobre uso de IA, almacenamiento y seguimiento comercial.",
    category: "legal_privacy",
    status: "required",
    priority: "high",
    recommendation:
      "Agregar consentimiento visible en widget web y flujos WhatsApp cuando corresponda.",
  },
  {
    id: "data-retention",
    title: "Retención y eliminación de datos",
    description:
      "Definir cuánto tiempo se guardan conversaciones, leads, respaldos y reportes.",
    category: "data",
    status: "required",
    priority: "high",
    recommendation:
      "Crear políticas de eliminación, exportación y auditoría de datos.",
  },
  {
    id: "encryption",
    title: "Cifrado de datos sensibles",
    description:
      "Protección de información de contacto, mensajes, reportes y respaldos.",
    category: "security",
    status: "required",
    priority: "critical",
    recommendation:
      "Usar cifrado en tránsito y reposo en la versión productiva.",
  },
  {
    id: "commercial-demo-package",
    title: "Paquete de demo comercial",
    description:
      "Material para presentar el producto a empresas e inversionistas.",
    category: "commercial",
    status: "future",
    priority: "medium",
    recommendation:
      "Preparar landing, video, imagen promocional, pitch y caso de uso por industria.",
  },
  {
    id: "pricing-model",
    title: "Modelo de precios",
    description:
      "Definir planes, límites de uso, soporte, implementación y mantenimiento.",
    category: "commercial",
    status: "future",
    priority: "medium",
    recommendation:
      "Evaluar planes por empresa, número de conversaciones, canales e integraciones.",
  },
];

export function buildProductionChecklistSummary(items: ProductionChecklistItem[]) {
  const completed = items.filter((item) => item.status === "completed").length;
  const required = items.filter((item) => item.status === "required").length;
  const future = items.filter((item) => item.status === "future").length;
  const blocked = items.filter((item) => item.status === "blocked").length;
  const critical = items.filter((item) => item.priority === "critical").length;
  const total = items.length;

  const prototypeCoverage =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    completed,
    required,
    future,
    blocked,
    critical,
    total,
    prototypeCoverage,
  };
}

export function buildProductionChecklistReportText(params: {
  profile: CompanyProfile;
  items: ProductionChecklistItem[];
  summary: ReturnType<typeof buildProductionChecklistSummary>;
}): string {
  const { profile, items, summary } = params;

  const lines = items
    .map((item) => {
      return `- ${item.title}
  Categoría: ${PRODUCTION_CHECKLIST_CATEGORY_LABELS[item.category]}
  Estado: ${PRODUCTION_CHECKLIST_STATUS_LABELS[item.status]}
  Prioridad: ${PRODUCTION_CHECKLIST_PRIORITY_LABELS[item.priority]}
  Recomendación: ${item.recommendation}`;
    })
    .join("\n\n");

  return `CHECKLIST DE PRODUCCIÓN — ORBI CHATBOX IA CORE
Empresa activa: ${profile.brandName}
Asistente: ${profile.assistantName}

RESUMEN
Cubierto en prototipo: ${summary.completed}
Requerido para producción: ${summary.required}
Fase futura: ${summary.future}
Bloqueante: ${summary.blocked}
Prioridad crítica: ${summary.critical}
Total evaluado: ${summary.total}
Cobertura actual del prototipo: ${summary.prototypeCoverage}%

DETALLE
${lines}

NOTA
Este checklist no ejecuta infraestructura real. Sirve como guía de preparación para convertir el prototipo local en una solución productiva.`;
}

export type ExecutiveDemoHighlight = {
  id: string;
  title: string;
  description: string;
  value?: string;
  category: "product" | "commercial" | "technical" | "investment";
};

export const EXECUTIVE_DEMO_CATEGORY_LABELS: Record<
  ExecutiveDemoHighlight["category"],
  string
> = {
  product: "Producto",
  commercial: "Comercial",
  technical: "Técnico",
  investment: "Inversión",
};

export function buildExecutiveDemoHighlights(params: {
  companyProfile: CompanyProfile;
  leadRecords: LeadRecord[];
  multiChannelReport: MultiChannelCommercialReport;
  diagnosticSummary: ReturnType<typeof buildDiagnosticSummary>;
  productionSummary: ReturnType<typeof buildProductionChecklistSummary>;
}): ExecutiveDemoHighlight[] {
  const {
    companyProfile,
    leadRecords,
    multiChannelReport,
    diagnosticSummary,
    productionSummary,
  } = params;

  return [
    {
      id: "value-proposition",
      title: "Propuesta de valor",
      description:
        "ORBI ChatBox IA Core permite atender clientes, clasificar oportunidades, generar leads y preparar derivaciones humanas desde una experiencia inteligente 24/7.",
      value: "Atención inteligente empresarial",
      category: "product",
    },
    {
      id: "company-ready",
      title: "Adaptable a empresas",
      description:
        "El sistema permite configurar marca, servicios, contactos humanos, tono del asistente y mensaje de bienvenida.",
      value: companyProfile.brandName,
      category: "product",
    },
    {
      id: "channels",
      title: "Canales preparados",
      description:
        "El prototipo ya contempla Web Demo, Prueba Manual y WhatsApp Futuro como canales diferenciados.",
      value: "Web + WhatsApp Futuro + Manual",
      category: "technical",
    },
    {
      id: "lead-engine",
      title: "Motor de leads",
      description:
        "Cada conversación puede transformarse en un registro comercial con prioridad, canal, servicio de interés y recomendación.",
      value: `${leadRecords.length} leads registrados`,
      category: "commercial",
    },
    {
      id: "multi-channel-report",
      title: "Reporte multicanal",
      description:
        "El sistema consolida métricas por canal, prioridad, servicio consultado y necesidad de contacto humano.",
      value: `Canal más activo: ${getChannelDisplayName(
        multiChannelReport.mostActiveChannel
      )}`,
      category: "commercial",
    },
    {
      id: "local-readiness",
      title: "Preparación local",
      description:
        "El diagnóstico local permite revisar qué módulos están listos, cuáles requieren atención y qué queda pendiente.",
      value: `${diagnosticSummary.readinessPercentage}%`,
      category: "technical",
    },
    {
      id: "production-path",
      title: "Ruta a producción",
      description:
        "El checklist de producción identifica infraestructura, seguridad, datos, privacidad, widget web y WhatsApp Business como pasos futuros.",
      value: `${productionSummary.required} requisitos productivos`,
      category: "technical",
    },
    {
      id: "investment-angle",
      title: "Potencial de inversión",
      description:
        "El producto puede escalar como solución SaaS multiempresa para atención, automatización comercial y gestión de oportunidades.",
      value: "SaaS empresarial multicanal",
      category: "investment",
    },
  ];
}

export function buildExecutiveDemoSummaryText(params: {
  profile: CompanyProfile;
  highlights: ExecutiveDemoHighlight[];
  multiChannelReport: MultiChannelCommercialReport;
  diagnosticSummary: ReturnType<typeof buildDiagnosticSummary>;
  productionSummary: ReturnType<typeof buildProductionChecklistSummary>;
}): string {
  const {
    profile,
    highlights,
    multiChannelReport,
    diagnosticSummary,
    productionSummary,
  } = params;

  const highlightLines = highlights
    .map((item) => {
      return `- ${item.title}
  Categoría: ${EXECUTIVE_DEMO_CATEGORY_LABELS[item.category]}
  Valor: ${item.value ?? "No informado"}
  Detalle: ${item.description}`;
    })
    .join("\n\n");

  return `RESUMEN EJECUTIVO COMERCIAL — ORBI CHATBOX IA CORE

Empresa activa: ${profile.brandName}
Asistente: ${profile.assistantName}

PROPUESTA GENERAL
ORBI ChatBox IA Core es un chatbox inteligente empresarial diseñado para atención automática 24/7, clasificación de clientes, generación de leads, derivación humana y preparación multicanal para web y WhatsApp Business.

MÉTRICAS DESTACADAS
Total de leads: ${multiChannelReport.totalLeads}
Canal más activo: ${getChannelDisplayName(multiChannelReport.mostActiveChannel)}
Servicio más consultado: ${multiChannelReport.mostRequestedService}
Leads críticos: ${multiChannelReport.criticalLeads}
Requieren contacto humano: ${multiChannelReport.humanContactRequired}

ESTADO DEL PROTOTIPO
Preparación local: ${diagnosticSummary.readinessPercentage}%
Elementos listos: ${diagnosticSummary.ready}
A revisar: ${diagnosticSummary.warning}
Pendientes: ${diagnosticSummary.pending}

RUTA A PRODUCCIÓN
Cubierto en prototipo: ${productionSummary.completed}
Requerido para producción: ${productionSummary.required}
Bloqueante: ${productionSummary.blocked}
Prioridad crítica: ${productionSummary.critical}

PUNTOS EJECUTIVOS
${highlightLines}

CIERRE
El prototipo demuestra una base funcional para convertir conversaciones en oportunidades comerciales. Para producción real se requiere backend seguro, base de datos, autenticación, políticas de privacidad, widget web desplegable e integración oficial con canales externos.`;
}

export type DemoPitchSlideType =
  | "problem"
  | "solution"
  | "product"
  | "features"
  | "channels"
  | "metrics"
  | "readiness"
  | "production"
  | "business"
  | "closing";

export type DemoPitchSlide = {
  id: DemoPitchSlideType;
  title: string;
  eyebrow: string;
  description: string;
  bullets: string[];
  highlight: string;
};

export const DEMO_PITCH_SLIDE_LABELS: Record<DemoPitchSlideType, string> = {
  problem: "Problema",
  solution: "Solución",
  product: "Producto",
  features: "Funciones",
  channels: "Canales",
  metrics: "Métricas",
  readiness: "Estado",
  production: "Producción",
  business: "Negocio",
  closing: "Cierre",
};

export function buildDemoPitchSlides(params: {
  companyProfile: CompanyProfile;
  multiChannelReport: MultiChannelCommercialReport;
  diagnosticSummary: ReturnType<typeof buildDiagnosticSummary>;
  productionSummary: ReturnType<typeof buildProductionChecklistSummary>;
}): DemoPitchSlide[] {
  const {
    companyProfile,
    multiChannelReport,
    diagnosticSummary,
    productionSummary,
  } = params;

  return [
    {
      id: "problem",
      eyebrow: "El problema",
      title: "Las empresas pierden oportunidades cuando no responden a tiempo",
      description:
        "Los clientes escriben por web, WhatsApp y otros canales a cualquier hora. Si la empresa tarda en responder, una consulta puede transformarse en una oportunidad perdida.",
      bullets: [
        "Consultas dispersas en distintos canales.",
        "Falta de respuesta fuera de horario.",
        "Poca trazabilidad comercial.",
        "Dificultad para detectar leads importantes.",
      ],
      highlight: "El tiempo de respuesta impacta directamente en la conversión.",
    },
    {
      id: "solution",
      eyebrow: "La solución",
      title: "Un chatbox inteligente empresarial disponible 24/7",
      description:
        "ORBI ChatBox IA Core centraliza la atención inicial, analiza cada conversación y transforma mensajes en oportunidades comerciales organizadas.",
      bullets: [
        "Atención automática inicial.",
        "Clasificación inteligente de clientes.",
        "Registro de leads y prioridades.",
        "Derivación humana cuando corresponde.",
      ],
      highlight: "Atención inteligente sin perder control humano.",
    },
    {
      id: "product",
      eyebrow: "El producto",
      title: "ORBI ChatBox IA Core",
      description:
        "Un prototipo avanzado de chatbox empresarial configurable para distintas marcas, servicios, contactos y canales.",
      bullets: [
        `Empresa activa: ${companyProfile.brandName}.`,
        `Asistente configurado: ${companyProfile.assistantName}.`,
        `${companyProfile.services.length} servicios configurados.`,
        `${companyProfile.humanContacts.length} contactos humanos configurados.`,
      ],
      highlight: "Adaptable a cualquier empresa desde el panel administrador.",
    },
    {
      id: "features",
      eyebrow: "Funciones principales",
      title: "De conversación a oportunidad comercial",
      description:
        "El sistema no solo responde mensajes: también analiza, clasifica, registra, resume y prepara acciones.",
      bullets: [
        "Respuestas automáticas personalizadas.",
        "Detección dinámica de servicios.",
        "Extracción de datos de contacto.",
        "Resumen diario y reporte multicanal.",
        "Respaldo e importación local.",
      ],
      highlight: "Cada conversación puede convertirse en un lead trazable.",
    },
    {
      id: "channels",
      eyebrow: "Canales preparados",
      title: "Web Demo, WhatsApp Futuro y Prueba Manual",
      description:
        "El prototipo diferencia canales de origen para simular una operación multicanal real.",
      bullets: [
        "Widget web flotante simulado.",
        "Vista previa de instalación web.",
        "Bandeja WhatsApp Futuro.",
        "Webhook simulado con payload JSON.",
      ],
      highlight: "Arquitectura preparada para crecer hacia canales reales.",
    },
    {
      id: "metrics",
      eyebrow: "Métricas comerciales",
      title: "Resultados medibles desde el primer prototipo",
      description:
        "La consola comercial consolida leads, prioridades, canales activos y servicios más consultados.",
      bullets: [
        `Total de leads: ${multiChannelReport.totalLeads}.`,
        `Canal más activo: ${getChannelDisplayName(
          multiChannelReport.mostActiveChannel
        )}.`,
        `Servicio más consultado: ${multiChannelReport.mostRequestedService}.`,
        `Requieren contacto humano: ${multiChannelReport.humanContactRequired}.`,
      ],
      highlight: "El valor comercial se puede mostrar con datos.",
    },
    {
      id: "readiness",
      eyebrow: "Estado del prototipo",
      title: "Diagnóstico local integrado",
      description:
        "El sistema evalúa qué módulos están listos, cuáles requieren revisión y qué partes quedan pendientes.",
      bullets: [
        `Preparación local: ${diagnosticSummary.readinessPercentage}%.`,
        `Elementos listos: ${diagnosticSummary.ready}.`,
        `A revisar: ${diagnosticSummary.warning}.`,
        `Pendientes: ${diagnosticSummary.pending}.`,
      ],
      highlight: "El prototipo se presenta con transparencia técnica.",
    },
    {
      id: "production",
      eyebrow: "Ruta a producción",
      title: "Checklist claro para pasar de prototipo a solución real",
      description:
        "ORBI identifica los requisitos técnicos, legales y comerciales para avanzar hacia producción.",
      bullets: [
        `Cubierto en prototipo: ${productionSummary.completed}.`,
        `Requerido para producción: ${productionSummary.required}.`,
        `Bloqueante: ${productionSummary.blocked}.`,
        `Prioridad crítica: ${productionSummary.critical}.`,
      ],
      highlight: "La ruta de crecimiento ya está ordenada por módulos.",
    },
    {
      id: "business",
      eyebrow: "Oportunidad comercial",
      title: "Potencial SaaS multiempresa",
      description:
        "ORBI ChatBox IA Core puede evolucionar hacia una solución SaaS para empresas que necesitan atención, automatización comercial y seguimiento de oportunidades.",
      bullets: [
        "Aplicable a múltiples rubros.",
        "Configurable por empresa.",
        "Escalable por canales y planes.",
        "Preparado para integraciones futuras.",
      ],
      highlight: "Un producto modular con potencial de monetización.",
    },
    {
      id: "closing",
      eyebrow: "Cierre",
      title: "ORBI ChatBox IA Core convierte atención en inteligencia comercial",
      description:
        "El prototipo demuestra una base funcional para responder mejor, ordenar oportunidades y preparar una operación multicanal moderna.",
      bullets: [
        "Disponible 24/7.",
        "Fácil de configurar.",
        "Preparado para web.",
        "Preparado conceptualmente para WhatsApp Business.",
        "Listo para evolucionar hacia producción.",
      ],
      highlight: "Atiende mejor. Responde más rápido. No pierdas oportunidades.",
    },
  ];
}

export function buildDemoPitchScriptText(params: {
  profile: CompanyProfile;
  slides: DemoPitchSlide[];
}): string {
  const { profile, slides } = params;

  const slideText = slides
    .map((slide, index) => {
      return `${index + 1}. ${slide.title}
${slide.description}

Puntos:
${slide.bullets.map((bullet) => `- ${bullet}`).join("\n")}

Frase clave:
${slide.highlight}`;
    })
    .join("\n\n---\n\n");

  return `GUION DEMO PITCH — ORBI CHATBOX IA CORE
Empresa activa: ${profile.brandName}
Asistente: ${profile.assistantName}

${slideText}

CIERRE SUGERIDO
ORBI ChatBox IA Core permite atender mejor, responder más rápido y transformar conversaciones en oportunidades comerciales.`;
}

export type DocumentationSectionType =
  | "commercial"
  | "technical"
  | "modules"
  | "channels"
  | "limitations"
  | "production"
  | "use_cases";

export type OrbiDocumentationSection = {
  id: DocumentationSectionType;
  title: string;
  description: string;
  bullets: string[];
};

export const DOCUMENTATION_SECTION_LABELS: Record<
  DocumentationSectionType,
  string
> = {
  commercial: "Comercial",
  technical: "Técnica",
  modules: "Módulos",
  channels: "Canales",
  limitations: "Limitaciones",
  production: "Producción",
  use_cases: "Casos de uso",
};

export function buildOrbiDocumentationSections(params: {
  companyProfile: CompanyProfile;
  leadRecords: LeadRecord[];
  multiChannelReport: MultiChannelCommercialReport;
  diagnosticSummary: ReturnType<typeof buildDiagnosticSummary>;
  productionSummary: ReturnType<typeof buildProductionChecklistSummary>;
}): OrbiDocumentationSection[] {
  const {
    companyProfile,
    leadRecords,
    multiChannelReport,
    diagnosticSummary,
    productionSummary,
  } = params;

  return [
    {
      id: "commercial",
      title: "Descripción comercial",
      description:
        "ORBI ChatBox IA Core es un chatbox inteligente empresarial diseñado para atender consultas, clasificar clientes, generar leads y preparar derivaciones humanas con disponibilidad 24/7.",
      bullets: [
        "Permite responder consultas iniciales de forma automática.",
        "Convierte conversaciones en oportunidades comerciales trazables.",
        "Organiza leads por prioridad, canal y servicio de interés.",
        "Puede adaptarse a distintas empresas, servicios y estilos de atención.",
        `Empresa activa actual: ${companyProfile.brandName}.`,
      ],
    },
    {
      id: "technical",
      title: "Descripción técnica del prototipo",
      description:
        "El prototipo funciona como una aplicación frontend local con persistencia en localStorage, sin backend, sin APIs externas y sin integración real con canales externos.",
      bullets: [
        "Interfaz construida como prototipo local.",
        "Persistencia de perfil, leads y configuración en localStorage.",
        "Motor local de análisis por reglas, palabras clave y coincidencias dinámicas.",
        "Respaldo e importación local mediante archivos JSON.",
        "Modo widget web y WhatsApp Futuro operan como simulaciones locales.",
      ],
    },
    {
      id: "modules",
      title: "Módulos principales implementados",
      description:
        "El producto ya integra módulos funcionales para configuración empresarial, análisis comercial, canales simulados, respaldo, diagnóstico y presentación.",
      bullets: [
        "Perfil empresarial configurable.",
        "Gestión editable de servicios empresariales.",
        "Detección dinámica de servicios configurados.",
        "Contactos humanos para derivación.",
        "Widget web simulado con botón flotante.",
        "Vista previa de instalación web y código embed simulado.",
        "Bandeja WhatsApp Futuro con estados, respuestas sugeridas y webhook simulado.",
        "Reporte comercial multicanal.",
        "Respaldo e importación segura local.",
        "Diagnóstico, checklist de producción, consola ejecutiva y modo pitch.",
      ],
    },
    {
      id: "channels",
      title: "Canales preparados",
      description:
        "El prototipo contempla diferentes canales conversacionales para simular una operación multicanal.",
      bullets: [
        "Web Demo: asociado al widget web simulado.",
        "WhatsApp Futuro: asociado a la bandeja simulada y webhook conceptual.",
        "Prueba Manual: asociado al chat administrativo interno.",
        `Canal más activo actual: ${getChannelDisplayName(
          multiChannelReport.mostActiveChannel
        )}.`,
        `Total de leads registrados: ${leadRecords.length}.`,
      ],
    },
    {
      id: "limitations",
      title: "Limitaciones actuales",
      description:
        "El sistema todavía no representa una instalación productiva real. Sus integraciones externas son conceptuales y funcionan como simulación local.",
      bullets: [
        "No existe backend productivo.",
        "No existe base de datos real multiempresa.",
        "No existe autenticación de usuarios.",
        "No existe conexión oficial con WhatsApp Business.",
        "El código embed es simulado.",
        "El almacenamiento actual depende del navegador local.",
      ],
    },
    {
      id: "production",
      title: "Requisitos para producción",
      description:
        "Para transformar el prototipo en una solución comercial real, se requiere completar infraestructura, seguridad, datos, despliegue y cumplimiento.",
      bullets: [
        "Backend seguro con API y separación por empresa.",
        "Base de datos persistente para perfiles, conversaciones, leads y reportes.",
        "Autenticación, roles y permisos.",
        "Widget web empaquetado como script real y alojado en CDN o dominio propio.",
        "Integración oficial con WhatsApp Business mediante proveedor autorizado.",
        "Políticas de privacidad, consentimiento, retención y protección de datos.",
        `Requisitos productivos pendientes: ${productionSummary.required}.`,
      ],
    },
    {
      id: "use_cases",
      title: "Casos de uso sugeridos",
      description:
        "ORBI ChatBox IA Core puede adaptarse a diferentes rubros que necesiten atención inicial, automatización comercial y gestión de oportunidades.",
      bullets: [
        "Empresas de servicios técnicos.",
        "Constructoras e inmobiliarias.",
        "Empresas de energía y mantenimiento.",
        "Consultoras profesionales.",
        "Comercios con alto volumen de consultas.",
        "Startups que requieren atención 24/7.",
        `Preparación local actual del prototipo: ${diagnosticSummary.readinessPercentage}%.`,
      ],
    },
  ];
}

export function buildCommercialProductSheetText(params: {
  profile: CompanyProfile;
  multiChannelReport: MultiChannelCommercialReport;
  diagnosticSummary: ReturnType<typeof buildDiagnosticSummary>;
}): string {
  const { profile, multiChannelReport, diagnosticSummary } = params;

  return `FICHA COMERCIAL — ORBI CHATBOX IA CORE

Producto:
ORBI ChatBox IA Core

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

Descripción:
ORBI ChatBox IA Core es un chatbox inteligente empresarial diseñado para atención automática 24/7, clasificación de clientes, generación de leads, seguimiento comercial y derivación humana.

Propuesta de valor:
Ayuda a las empresas a responder más rápido, ordenar oportunidades comerciales y no perder clientes por falta de atención o trazabilidad.

Funciones principales:
- Atención automática inicial.
- Respuestas personalizadas.
- Clasificación inteligente de clientes.
- Detección dinámica de servicios.
- Registro de leads.
- Métricas comerciales.
- Derivación humana.
- Widget web simulado.
- Preparación conceptual para WhatsApp Business.

Métricas actuales del prototipo:
- Total de leads: ${multiChannelReport.totalLeads}
- Canal más activo: ${getChannelDisplayName(multiChannelReport.mostActiveChannel)}
- Servicio más consultado: ${multiChannelReport.mostRequestedService}
- Preparación local: ${diagnosticSummary.readinessPercentage}%

Estado:
Prototipo local avanzado, listo para demostración comercial y técnica.

Nota:
Para producción real se requiere backend, base de datos, autenticación, políticas de privacidad, widget desplegable e integración oficial con canales externos.`;
}

export function buildTechnicalProductSheetText(params: {
  profile: CompanyProfile;
  productionSummary: ReturnType<typeof buildProductionChecklistSummary>;
}): string {
  const { profile, productionSummary } = params;

  return `FICHA TÉCNICA — ORBI CHATBOX IA CORE

Producto:
ORBI ChatBox IA Core

Empresa activa:
${profile.brandName}

Arquitectura actual:
Prototipo frontend local con persistencia en localStorage.

Componentes implementados:
- Perfil empresarial configurable.
- Servicios editables.
- Contactos humanos configurables.
- Motor local de análisis y clasificación.
- Generación de leads.
- Resumen diario.
- Reporte comercial multicanal.
- Widget web simulado.
- Código embed simulado.
- Bandeja WhatsApp Futuro.
- Simulador de webhook.
- Respuestas sugeridas.
- Estados de conversación.
- Respaldo local JSON.
- Importación segura de respaldo.
- Centro de diagnóstico.
- Checklist de producción.
- Consola ejecutiva.
- Modo presentación.

Pendientes técnicos para producción:
- Backend seguro.
- Base de datos multiempresa.
- Autenticación.
- Roles y permisos.
- API de conversaciones.
- Webhook real.
- CDN o dominio para widget.
- Cifrado y políticas de retención.
- Integración oficial con WhatsApp Business.

Resumen checklist:
- Cubierto en prototipo: ${productionSummary.completed}
- Requerido para producción: ${productionSummary.required}
- Bloqueante: ${productionSummary.blocked}
- Prioridad crítica: ${productionSummary.critical}

Nota:
El prototipo no envía datos externos y no se conecta a servicios productivos.`;
}

export type CommercialProposalAudience =
  | "client_company"
  | "partner"
  | "investor"
  | "internal_demo";

export const COMMERCIAL_PROPOSAL_AUDIENCE_LABELS: Record<
  CommercialProposalAudience,
  string
> = {
  client_company: "Empresa cliente",
  partner: "Socio estratégico",
  investor: "Inversionista",
  internal_demo: "Demo interna",
};

export type OrbiCommercialProposal = {
  audience: CommercialProposalAudience;
  title: string;
  subtitle: string;
  executiveIntro: string;
  problemStatement: string;
  proposedSolution: string;
  keyBenefits: string[];
  includedModules: string[];
  suggestedImplementationPhases: string[];
  commercialNotes: string[];
  nextSteps: string[];
};

export function buildOrbiCommercialProposal(params: {
  profile: CompanyProfile;
  audience: CommercialProposalAudience;
  multiChannelReport: MultiChannelCommercialReport;
  diagnosticSummary: ReturnType<typeof buildDiagnosticSummary>;
  productionSummary: ReturnType<typeof buildProductionChecklistSummary>;
}): OrbiCommercialProposal {
  const {
    profile,
    audience,
    multiChannelReport,
    diagnosticSummary,
    productionSummary,
  } = params;

  const audienceLabel = COMMERCIAL_PROPOSAL_AUDIENCE_LABELS[audience];

  const audienceIntro: Record<CommercialProposalAudience, string> = {
    client_company:
      "Esta propuesta está orientada a empresas que necesitan mejorar su atención digital, ordenar consultas y convertir conversaciones en oportunidades comerciales.",
    partner:
      "Esta propuesta está orientada a socios estratégicos que puedan aportar implementación, canales comerciales, infraestructura o integración técnica.",
    investor:
      "Esta propuesta está orientada a inversionistas interesados en una solución SaaS empresarial con potencial multicanal, automatización comercial y escalabilidad por rubros.",
    internal_demo:
      "Esta propuesta está orientada a demostraciones internas del estado actual del prototipo y su ruta de evolución hacia producción.",
  };

  return {
    audience,
    title: `Propuesta Comercial — ORBI ChatBox IA Core`,
    subtitle: `Preparada para: ${audienceLabel}`,
    executiveIntro: `${audienceIntro[audience]} ORBI ChatBox IA Core es un chatbox inteligente empresarial diseñado para atención automática 24/7, clasificación de clientes, generación de leads, seguimiento comercial y derivación humana.`,
    problemStatement:
      "Muchas empresas reciben consultas por diferentes canales, pero no siempre cuentan con una respuesta inmediata, trazabilidad comercial o capacidad para identificar cuáles oportunidades requieren atención prioritaria.",
    proposedSolution:
      "ORBI ChatBox IA Core propone una capa inteligente de atención inicial que permite responder, clasificar, registrar y organizar conversaciones comerciales desde una interfaz configurable por empresa.",
    keyBenefits: [
      "Atención inicial disponible 24/7.",
      "Clasificación inteligente de clientes y consultas.",
      "Registro de leads con canal, prioridad y servicio de interés.",
      "Derivación humana para casos críticos o de alto valor.",
      "Configuración por empresa, servicios, contactos y tono del asistente.",
      "Preparación conceptual para widget web y WhatsApp Business.",
      `Preparación local actual del prototipo: ${diagnosticSummary.readinessPercentage}%.`,
    ],
    includedModules: [
      "Panel administrativo completo.",
      "Perfil empresarial configurable.",
      "Gestión editable de servicios.",
      "Detección dinámica de servicios.",
      "Contactos humanos para derivación.",
      "Chat principal de prueba.",
      "Widget web simulado.",
      "Vista previa de instalación web.",
      "Código embed simulado.",
      "Bandeja WhatsApp Futuro.",
      "Webhook WhatsApp simulado.",
      "Respuestas sugeridas.",
      "Reporte comercial multicanal.",
      "Respaldo e importación local.",
      "Centro de diagnóstico, checklist, documentación y modo pitch.",
    ],
    suggestedImplementationPhases: [
      "Fase 1 — Validación del prototipo con casos reales de empresa.",
      "Fase 2 — Definición de backend seguro, base de datos y autenticación.",
      "Fase 3 — Separación entre consola administrativa y widget público instalable.",
      "Fase 4 — Integración oficial con canales externos como WhatsApp Business.",
      "Fase 5 — Piloto controlado con usuarios reales y políticas de privacidad.",
      "Fase 6 — Versión SaaS multiempresa con planes comerciales.",
    ],
    commercialNotes: [
      `Leads actuales registrados en prototipo: ${multiChannelReport.totalLeads}.`,
      `Canal más activo detectado: ${getChannelDisplayName(
        multiChannelReport.mostActiveChannel
      )}.`,
      `Servicio más consultado: ${multiChannelReport.mostRequestedService}.`,
      `Requisitos productivos pendientes: ${productionSummary.required}.`,
      "El prototipo actual opera localmente y no representa todavía una instalación productiva real.",
      "Los precios, contratos, SLA y condiciones comerciales deben definirse en una etapa posterior.",
    ],
    nextSteps: [
      "Realizar una demo guiada del prototipo.",
      "Definir industria o empresa objetivo para piloto.",
      "Identificar canales prioritarios: web, WhatsApp o ambos.",
      "Definir requerimientos de seguridad, privacidad y almacenamiento.",
      "Preparar roadmap técnico de backend y despliegue.",
      "Evaluar modelo comercial por plan, implementación o suscripción.",
    ],
  };
}

export function buildCommercialProposalText(proposal: OrbiCommercialProposal): string {
  return `${proposal.title}
${proposal.subtitle}

INTRODUCCIÓN EJECUTIVA
${proposal.executiveIntro}

PROBLEMA IDENTIFICADO
${proposal.problemStatement}

SOLUCIÓN PROPUESTA
${proposal.proposedSolution}

BENEFICIOS CLAVE
${proposal.keyBenefits.map((item) => `- ${item}`).join("\n")}

MÓDULOS INCLUIDOS EN EL PROTOTIPO
${proposal.includedModules.map((item) => `- ${item}`).join("\n")}

FASES SUGERIDAS DE IMPLEMENTACIÓN
${proposal.suggestedImplementationPhases
  .map((item) => `- ${item}`)
  .join("\n")}

NOTAS COMERCIALES
${proposal.commercialNotes.map((item) => `- ${item}`).join("\n")}

PRÓXIMOS PASOS
${proposal.nextSteps.map((item) => `- ${item}`).join("\n")}

NOTA DE ALCANCE
Esta propuesta se genera desde el prototipo local de ORBI ChatBox IA Core. Debe ser revisada antes de uso comercial formal, negociación, contrato o presentación externa definitiva.`;
}

export type SuggestedReplyTone = "commercial" | "support" | "human_handoff";

export type RoadmapStageStatus = "completed" | "current" | "next" | "future";

export type RoadmapStage = {
  id: string;
  title: string;
  subtitle: string;
  status: RoadmapStageStatus;
  description: string;
  deliverables: string[];
};

export const ROADMAP_STAGE_STATUS_LABELS: Record<RoadmapStageStatus, string> = {
  completed: "Completado",
  current: "Etapa actual",
  next: "Siguiente paso",
  future: "Futuro",
};

export function buildOrbiEvolutionRoadmap(params: {
  diagnosticSummary: ReturnType<typeof buildDiagnosticSummary>;
  productionSummary: ReturnType<typeof buildProductionChecklistSummary>;
}): RoadmapStage[] {
  const { diagnosticSummary, productionSummary } = params;

  return [
    {
      id: "local-prototype",
      title: "Prototipo local funcional",
      subtitle: "Base ORBI ChatBox IA Core",
      status: "completed",
      description:
        "El sistema ya cuenta con una base funcional local para demostrar atención inteligente, generación de leads, canales simulados, reportes y documentación.",
      deliverables: [
        "Interfaz premium administrativa.",
        "Motor local de análisis.",
        "Perfil empresarial configurable.",
        "Servicios y contactos editables.",
        "Leads persistentes en localStorage.",
        `Preparación local estimada: ${diagnosticSummary.readinessPercentage}%.`,
      ],
    },
    {
      id: "commercial-demo",
      title: "Demo comercial ejecutiva",
      subtitle: "Presentación a empresas e inversionistas",
      status: "current",
      description:
        "El prototipo ya puede presentarse mediante consola ejecutiva, modo pitch, documentación y propuestas comerciales generadas localmente.",
      deliverables: [
        "Consola ejecutiva.",
        "Modo presentación / demo pitch.",
        "Ficha comercial y técnica.",
        "Generador de propuesta comercial.",
        "Reporte comercial multicanal.",
      ],
    },
    {
      id: "production-architecture",
      title: "Arquitectura productiva",
      subtitle: "Backend, base de datos y seguridad",
      status: "next",
      description:
        "La siguiente etapa técnica debe separar el prototipo local de una arquitectura productiva con backend, base de datos, autenticación, roles y almacenamiento seguro.",
      deliverables: [
        "Diseño de backend seguro.",
        "Modelo de datos multiempresa.",
        "Autenticación y roles.",
        "API de conversaciones y leads.",
        "Políticas de privacidad y retención.",
        `Requisitos productivos pendientes: ${productionSummary.required}.`,
      ],
    },
    {
      id: "web-widget-production",
      title: "Widget web productivo",
      subtitle: "Instalación real en sitios web",
      status: "future",
      description:
        "El widget debe convertirse en un paquete instalable real separado de la consola administrativa.",
      deliverables: [
        "Bundle independiente del widget.",
        "Script embebible real.",
        "CDN o dominio de distribución.",
        "Configuración por empresa.",
        "Versión pública segura y liviana.",
      ],
    },
    {
      id: "whatsapp-business",
      title: "WhatsApp Business oficial",
      subtitle: "Integración real de canal externo",
      status: "future",
      description:
        "La simulación WhatsApp Futuro deberá evolucionar hacia una integración oficial mediante proveedor autorizado, webhooks seguros y trazabilidad de conversaciones.",
      deliverables: [
        "Número empresarial verificado.",
        "Webhook HTTPS seguro.",
        "Validación de firma del proveedor.",
        "Normalización de mensajes.",
        "Gestión de consentimiento.",
        "Trazabilidad de respuestas.",
      ],
    },
    {
      id: "saas-scale",
      title: "Escalamiento SaaS multiempresa",
      subtitle: "Producto comercial escalable",
      status: "future",
      description:
        "La visión final es evolucionar ORBI ChatBox IA Core hacia una solución SaaS configurable para múltiples empresas y rubros.",
      deliverables: [
        "Planes comerciales.",
        "Panel por empresa.",
        "Métricas centralizadas.",
        "Integraciones CRM futuras.",
        "Monitoreo de uso.",
        "Soporte y mantenimiento.",
      ],
    },
  ];
}

export type ExecutiveClosureSummary = {
  title: string;
  productStatus: string;
  commercialValue: string;
  technicalStatus: string;
  recommendedNextStep: string;
};

export function buildExecutiveClosureSummary(params: {
  profile: CompanyProfile;
  multiChannelReport: MultiChannelCommercialReport;
  diagnosticSummary: ReturnType<typeof buildDiagnosticSummary>;
  productionSummary: ReturnType<typeof buildProductionChecklistSummary>;
}): ExecutiveClosureSummary {
  const {
    profile,
    multiChannelReport,
    diagnosticSummary,
    productionSummary,
  } = params;

  return {
    title: `Cierre ejecutivo — ORBI ChatBox IA Core para ${profile.brandName}`,
    productStatus:
      "El prototipo local demuestra una solución funcional de chatbox inteligente empresarial con atención automática, análisis de leads, canales simulados, reportes y herramientas de presentación comercial.",
    commercialValue: `El sistema permite mostrar valor comercial medible: ${multiChannelReport.totalLeads} leads registrados, canal más activo ${getChannelDisplayName(
      multiChannelReport.mostActiveChannel
    )} y servicio más consultado ${multiChannelReport.mostRequestedService}.`,
    technicalStatus: `La preparación local estimada es de ${diagnosticSummary.readinessPercentage}%. Para producción se identifican ${productionSummary.required} requisitos requeridos y ${productionSummary.blocked} elementos bloqueantes.`,
    recommendedNextStep:
      "El próximo paso recomendado es iniciar el diseño de arquitectura productiva: backend seguro, base de datos multiempresa, autenticación, roles, API de conversaciones y separación real entre consola administrativa y widget público.",
  };
}

export function buildExecutiveClosureText(params: {
  profile: CompanyProfile;
  summary: ExecutiveClosureSummary;
  roadmap: RoadmapStage[];
}): string {
  const { profile, summary, roadmap } = params;

  const roadmapText = roadmap
    .map((stage, index) => {
      return `${index + 1}. ${stage.title}
Estado: ${ROADMAP_STAGE_STATUS_LABELS[stage.status]}
${stage.description}

Entregables:
${stage.deliverables.map((item) => `- ${item}`).join("\n")}`;
    })
    .join("\n\n---\n\n");

  return `CIERRE EJECUTIVO — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

${summary.productStatus}

VALOR COMERCIAL
${summary.commercialValue}

ESTADO TÉCNICO
${summary.technicalStatus}

PRÓXIMO PASO RECOMENDADO
${summary.recommendedNextStep}

ROADMAP DE EVOLUCIÓN
${roadmapText}

NOTA DE ALCANCE
Este cierre ejecutivo se genera desde el prototipo local. No representa una instalación productiva real ni una integración oficial activa con servicios externos.`;
}


export type BackendArchitectureComponentStatus =
  | "conceptual"
  | "required"
  | "critical"
  | "future";

export type BackendArchitectureComponentCategory =
  | "api"
  | "database"
  | "security"
  | "channels"
  | "ai_engine"
  | "frontend"
  | "operations";

export type BackendArchitectureComponent = {
  id: string;
  title: string;
  category: BackendArchitectureComponentCategory;
  status: BackendArchitectureComponentStatus;
  priority: ProductionChecklistPriority;
  description: string;
  responsibilities: string[];
  dependencies: string[];
};

export const BACKEND_ARCHITECTURE_STATUS_LABELS: Record<
  BackendArchitectureComponentStatus,
  string
> = {
  conceptual: "Conceptual",
  required: "Requerido",
  critical: "Crítico",
  future: "Futuro",
};

