// ORBI ChatBox IA Core — Diagnostic & QA Data
import {
  ObservabilityEventCategory
} from "./backendReadiness";
import {
  CompanyProfile
} from "./companyData";
import {
  PRODUCTION_CHECKLIST_PRIORITY_LABELS, ProductionChecklistPriority
} from "./demoData";

export type ObservabilityEventSeverity = "info" | "warning" | "error" | "critical";

export type ObservabilityEventStatus = "conceptual" | "required" | "future";

export type ObservabilityEventItem = {
  id: string;
  title: string;
  category: ObservabilityEventCategory;
  severity: ObservabilityEventSeverity;
  status: ObservabilityEventStatus;
  priority: ProductionChecklistPriority;
  description: string;
  eventExamples: string[];
  suggestedFields: string[];
  productionNotes: string[];
};

export const OBSERVABILITY_EVENT_CATEGORY_LABELS: Record<
  ObservabilityEventCategory,
  string
> = {
  auth: "Autenticación",
  conversation: "Conversaciones",
  lead: "Leads",
  export: "Exportaciones",
  configuration: "Configuración",
  system_error: "Errores del sistema",
  webhook: "Webhooks",
  ai_engine: "Motor IA",
  performance: "Rendimiento",
  security: "Seguridad",
};

export const OBSERVABILITY_EVENT_SEVERITY_LABELS: Record<
  ObservabilityEventSeverity,
  string
> = {
  info: "Informativo",
  warning: "Advertencia",
  error: "Error",
  critical: "Crítico",
};

export const OBSERVABILITY_EVENT_STATUS_LABELS: Record<
  ObservabilityEventStatus,
  string
> = {
  conceptual: "Conceptual",
  required: "Requerido para producción",
  future: "Fase futura",
};

export const OBSERVABILITY_EVENT_ITEMS_PART_A: ObservabilityEventItem[] = [
  {
    id: "auth-login-success",
    title: "Inicio de sesión exitoso",
    category: "auth",
    severity: "info",
    status: "required",
    priority: "high",
    description:
      "Evento conceptual para registrar cuando un usuario autorizado ingresa correctamente al panel administrativo en una futura versión productiva.",
    eventExamples: [
      "Administrador de empresa inicia sesión.",
      "Ejecutivo comercial accede al panel.",
      "Integrador técnico accede a configuración.",
    ],
    suggestedFields: [
      "eventId",
      "userId",
      "companyId",
      "roleId",
      "timestamp",
      "ipAddress",
      "userAgent",
    ],
    productionNotes: [
      "Debe registrarse del lado servidor.",
      "No debe guardar contraseñas ni tokens completos.",
      "Debe ayudar a reconstruir actividad administrativa.",
    ],
  },
  {
    id: "auth-login-failed",
    title: "Intento de inicio de sesión fallido",
    category: "auth",
    severity: "warning",
    status: "required",
    priority: "critical",
    description:
      "Evento conceptual para detectar intentos fallidos de acceso, posibles ataques por fuerza bruta o credenciales incorrectas.",
    eventExamples: [
      "Contraseña incorrecta.",
      "Usuario inexistente.",
      "Demasiados intentos desde la misma IP.",
    ],
    suggestedFields: [
      "eventId",
      "emailAttempted",
      "companyIdIfKnown",
      "timestamp",
      "ipAddress",
      "failureReason",
      "attemptCount",
    ],
    productionNotes: [
      "Debe combinarse con rate limiting.",
      "Debe evitar revelar si un correo existe o no.",
      "Puede activar alertas si supera umbrales definidos.",
    ],
  },
  {
    id: "conversation-created",
    title: "Conversación creada",
    category: "conversation",
    severity: "info",
    status: "required",
    priority: "high",
    description:
      "Evento conceptual para registrar la creación de una nueva conversación desde widget web, WhatsApp futuro o canal manual.",
    eventExamples: [
      "Visitante inicia conversación desde widget público.",
      "Mensaje futuro recibido desde WhatsApp.",
      "Conversación de prueba manual creada.",
    ],
    suggestedFields: [
      "eventId",
      "conversationId",
      "companyId",
      "channel",
      "customerReference",
      "timestamp",
      "consentStatus",
    ],
    productionNotes: [
      "Debe respetar privacidad y consentimiento.",
      "No debe duplicar todo el contenido de la conversación dentro del log.",
      "Debe permitir trazabilidad por canal.",
    ],
  },
  {
    id: "lead-created",
    title: "Lead comercial creado",
    category: "lead",
    severity: "info",
    status: "required",
    priority: "high",
    description:
      "Evento conceptual para registrar cuando el sistema genera una oportunidad comercial desde una conversación.",
    eventExamples: [
      "Lead creado por mensaje del widget.",
      "Lead crítico detectado por intención comercial.",
      "Lead generado desde conversación simulada de WhatsApp.",
    ],
    suggestedFields: [
      "eventId",
      "leadId",
      "conversationId",
      "companyId",
      "channel",
      "priority",
      "serviceId",
      "timestamp",
    ],
    productionNotes: [
      "Debe diferenciar generación automática y revisión humana.",
      "Debe permitir auditoría de leads críticos.",
      "No debe exponer datos personales innecesarios.",
    ],
  },
  {
    id: "backup-exported",
    title: "Respaldo exportado",
    category: "export",
    severity: "warning",
    status: "required",
    priority: "critical",
    description:
      "Evento conceptual para registrar cuando un usuario exporta información sensible o un respaldo de datos.",
    eventExamples: [
      "Exportación JSON de respaldo.",
      "Copiado de reporte comercial completo.",
      "Descarga futura de datos empresariales.",
    ],
    suggestedFields: [
      "eventId",
      "userId",
      "companyId",
      "exportType",
      "recordCount",
      "timestamp",
      "roleId",
    ],
    productionNotes: [
      "Debe restringirse por rol.",
      "Debe quedar auditado en producción.",
      "Puede requerir confirmación adicional si contiene datos sensibles.",
    ],
  },
  {
    id: "configuration-changed",
    title: "Configuración modificada",
    category: "configuration",
    severity: "warning",
    status: "required",
    priority: "high",
    description:
      "Evento conceptual para registrar cambios en perfil empresarial, servicios, contactos humanos, widget o permisos.",
    eventExamples: [
      "Cambio de mensaje de bienvenida.",
      "Edición de servicio empresarial.",
      "Cambio de contacto humano.",
      "Cambio futuro de rol o permisos.",
    ],
    suggestedFields: [
      "eventId",
      "userId",
      "companyId",
      "configArea",
      "changedFields",
      "timestamp",
      "previousValueReference",
    ],
    productionNotes: [
      "Debe evitar almacenar valores sensibles completos en logs.",
      "Debe ayudar a explicar quién cambió qué y cuándo.",
      "Cambios críticos deberían requerir permisos administrativos.",
    ],
  },
  {
    id: "system-error",
    title: "Error del sistema",
    category: "system_error",
    severity: "error",
    status: "required",
    priority: "critical",
    description:
      "Evento conceptual para registrar errores técnicos que puedan afectar conversaciones, leads, reportes o configuración.",
    eventExamples: [
      "Error al procesar mensaje.",
      "Error al generar reporte.",
      "Error al restaurar respaldo.",
      "Error futuro de conexión backend.",
    ],
    suggestedFields: [
      "eventId",
      "companyId",
      "module",
      "errorCode",
      "errorMessageSafe",
      "timestamp",
      "correlationId",
    ],
    productionNotes: [
      "No debe exponer stack traces sensibles al usuario final.",
      "Debe permitir correlacionar errores entre frontend y backend.",
      "Errores críticos pueden activar alertas operativas.",
    ],
  },
];

export function buildObservabilityPartASummary(items: ObservabilityEventItem[]) {
  const total = items.length;

  const required = items.filter((item) => item.status === "required").length;

  const warnings = items.filter((item) => item.severity === "warning").length;

  const errors = items.filter(
    (item) => item.severity === "error" || item.severity === "critical"
  ).length;

  const criticalPriority = items.filter(
    (item) => item.priority === "critical"
  ).length;

  return {
    total,
    required,
    warnings,
    errors,
    criticalPriority,
  };
}

export const OBSERVABILITY_EVENT_ITEMS_PART_B: ObservabilityEventItem[] = [
  {
    id: "webhook-received",
    title: "Webhook recibido",
    category: "webhook",
    severity: "info",
    status: "future",
    priority: "high",
    description:
      "Evento conceptual para registrar la recepción futura de un webhook desde WhatsApp Business u otro proveedor externo autorizado.",
    eventExamples: [
      "Mensaje recibido desde WhatsApp Business.",
      "Evento de entrega de mensaje.",
      "Evento de estado de conversación recibido desde proveedor externo.",
    ],
    suggestedFields: [
      "eventId",
      "provider",
      "eventType",
      "companyId",
      "businessPhoneId",
      "timestamp",
      "correlationId",
    ],
    productionNotes: [
      "Debe validarse firma del proveedor antes de procesar.",
      "No debe confiarse en payloads externos sin normalización.",
      "El prototipo actual no conecta webhooks reales.",
    ],
  },
  {
    id: "webhook-invalid-signature",
    title: "Webhook con firma inválida",
    category: "webhook",
    severity: "critical",
    status: "future",
    priority: "critical",
    description:
      "Evento conceptual para registrar intentos de webhook rechazados por firma inválida, origen no confiable o estructura incorrecta.",
    eventExamples: [
      "Evento recibido sin firma.",
      "Firma del proveedor no coincide.",
      "Payload externo incompleto o sospechoso.",
    ],
    suggestedFields: [
      "eventId",
      "provider",
      "ipAddress",
      "failureReason",
      "timestamp",
      "rawEventReference",
      "correlationId",
    ],
    productionNotes: [
      "No debe guardarse el payload completo si contiene datos sensibles.",
      "Puede activar alerta de seguridad.",
      "Debe rechazarse antes de crear conversación o lead.",
    ],
  },
  {
    id: "ai-classification-generated",
    title: "Clasificación IA generada",
    category: "ai_engine",
    severity: "info",
    status: "required",
    priority: "high",
    description:
      "Evento conceptual para registrar cuando el motor IA clasifica un mensaje, detecta intención, prioridad, servicio de interés o necesidad de contacto humano.",
    eventExamples: [
      "Mensaje clasificado como lead comercial.",
      "Servicio de interés detectado.",
      "Prioridad crítica asignada por análisis IA.",
    ],
    suggestedFields: [
      "eventId",
      "conversationId",
      "leadId",
      "companyId",
      "customerType",
      "priority",
      "serviceId",
      "confidence",
      "timestamp",
    ],
    productionNotes: [
      "Debe diferenciar sugerencia IA de decisión humana.",
      "No debe almacenar texto sensible innecesario dentro del log.",
      "Debe permitir revisión posterior de clasificaciones críticas.",
    ],
  },
  {
    id: "ai-low-confidence",
    title: "Clasificación IA de baja confianza",
    category: "ai_engine",
    severity: "warning",
    status: "required",
    priority: "high",
    description:
      "Evento conceptual para registrar casos donde la IA no tiene suficiente confianza y requiere revisión humana o tratamiento conservador.",
    eventExamples: [
      "Servicio de interés ambiguo.",
      "Prioridad no concluyente.",
      "Mensaje con intención poco clara.",
    ],
    suggestedFields: [
      "eventId",
      "conversationId",
      "companyId",
      "confidence",
      "fallbackAction",
      "timestamp",
      "requiresHumanReview",
    ],
    productionNotes: [
      "Debe evitar automatizar decisiones críticas con baja confianza.",
      "Puede alimentar mejoras futuras del motor de clasificación.",
      "Debe permitir derivación humana.",
    ],
  },
  {
    id: "performance-slow-response",
    title: "Respuesta lenta del sistema",
    category: "performance",
    severity: "warning",
    status: "required",
    priority: "medium",
    description:
      "Evento conceptual para registrar cuando una respuesta del sistema, carga de panel o procesamiento de mensaje supera un umbral aceptable.",
    eventExamples: [
      "Widget tarda demasiado en responder.",
      "Panel administrativo carga lentamente.",
      "Generación de reporte excede tiempo esperado.",
    ],
    suggestedFields: [
      "eventId",
      "module",
      "operationName",
      "durationMs",
      "companyId",
      "timestamp",
      "correlationId",
    ],
    productionNotes: [
      "Debe definirse umbral por operación.",
      "Puede ayudar a detectar cuellos de botella.",
      "No debe incluir datos personales en métricas de rendimiento.",
    ],
  },
  {
    id: "security-permission-denied",
    title: "Acceso denegado por permisos",
    category: "security",
    severity: "warning",
    status: "required",
    priority: "critical",
    description:
      "Evento conceptual para registrar cuando un usuario intenta acceder a una acción o sección sin permisos suficientes.",
    eventExamples: [
      "Ejecutivo comercial intenta exportar respaldo.",
      "Visualizador intenta editar configuración.",
      "Usuario intenta acceder a datos de otra empresa.",
    ],
    suggestedFields: [
      "eventId",
      "userId",
      "companyId",
      "roleId",
      "requestedArea",
      "requestedAction",
      "timestamp",
      "denialReason",
    ],
    productionNotes: [
      "Debe validarse del lado servidor.",
      "Puede indicar error de configuración o intento indebido.",
      "Debe correlacionarse con la matriz de roles y permisos.",
    ],
  },
];

export const OBSERVABILITY_EVENT_ITEMS: ObservabilityEventItem[] = [
  ...OBSERVABILITY_EVENT_ITEMS_PART_A,
  ...OBSERVABILITY_EVENT_ITEMS_PART_B,
];

export function buildObservabilitySummary(items: ObservabilityEventItem[]) {
  const total = items.length;

  const required = items.filter((item) => item.status === "required").length;
  const future = items.filter((item) => item.status === "future").length;

  const info = items.filter((item) => item.severity === "info").length;
  const warnings = items.filter((item) => item.severity === "warning").length;

  const errors = items.filter(
    (item) => item.severity === "error" || item.severity === "critical"
  ).length;

  const criticalPriority = items.filter(
    (item) => item.priority === "critical"
  ).length;

  return {
    total,
    required,
    future,
    info,
    warnings,
    errors,
    criticalPriority,
  };
}

export function buildObservabilityText(params: {
  profile: CompanyProfile;
  items: ObservabilityEventItem[];
  summary: ReturnType<typeof buildObservabilitySummary>;
}): string {
  const { profile, items, summary } = params;

  const eventsText = items
    .map((item) => {
      return `EVENTO: ${item.title}
Categoría: ${OBSERVABILITY_EVENT_CATEGORY_LABELS[item.category]}
Severidad: ${OBSERVABILITY_EVENT_SEVERITY_LABELS[item.severity]}
Estado: ${OBSERVABILITY_EVENT_STATUS_LABELS[item.status]}
Prioridad: ${PRODUCTION_CHECKLIST_PRIORITY_LABELS[item.priority]}

Descripción:
${item.description}

Ejemplos:
${item.eventExamples.map((example) => `- ${example}`).join("\n")}

Campos sugeridos:
${item.suggestedFields.map((field) => `- ${field}`).join("\n")}

Notas producción:
${item.productionNotes.map((note) => `- ${note}`).join("\n")}`;
    })
    .join("\n\n---\n\n");

  return `OBSERVABILIDAD, LOGS Y MONITOREO CONCEPTUAL — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

RESUMEN
Eventos evaluados: ${summary.total}
Requeridos: ${summary.required}
Futuros: ${summary.future}
Informativos: ${summary.info}
Advertencias: ${summary.warnings}
Errores / críticos: ${summary.errors}
Prioridad crítica: ${summary.criticalPriority}

DETALLE
${eventsText}

NOTA
Esta guía es conceptual. No crea sistema real de logs, no envía eventos externos, no conecta servicios de monitoreo, no crea backend y no modifica datos del prototipo.`;
}

export type QaTestCategory =
  | "main_chat"
  | "ai_analysis"
  | "lead_generation"
  | "contact_extraction"
  | "web_widget"
  | "reports"
  | "backup"
  | "privacy"
  | "security"
  | "observability";

export type QaTestPriority = "low" | "medium" | "high" | "critical";

export type QaTestStatus = "pending" | "ready" | "future";

export type QaTestItem = {
  id: string;
  title: string;
  category: QaTestCategory;
  priority: QaTestPriority;
  status: QaTestStatus;
  description: string;
  testSteps: string[];
  expectedResult: string[];
  productionNotes: string[];
};

export const QA_TEST_CATEGORY_LABELS: Record<QaTestCategory, string> = {
  main_chat: "Chat principal",
  ai_analysis: "Análisis IA",
  lead_generation: "Generación de leads",
  contact_extraction: "Extracción de contacto",
  web_widget: "Widget web",
  reports: "Reportes",
  backup: "Respaldos",
  privacy: "Privacidad",
  security: "Seguridad",
  observability: "Observabilidad",
};

export const QA_TEST_PRIORITY_LABELS: Record<QaTestPriority, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  critical: "Crítica",
};

export const QA_TEST_STATUS_LABELS: Record<QaTestStatus, string> = {
  pending: "Pendiente",
  ready: "Listo para validar",
  future: "Fase futura",
};

export const QA_TEST_ITEMS_PART_A: QaTestItem[] = [
  {
    id: "main-chat-send-message",
    title: "Enviar mensaje desde chat principal",
    category: "main_chat",
    priority: "critical",
    status: "ready",
    description:
      "Validar que el usuario pueda escribir un mensaje en el chat principal y recibir una respuesta simulada del asistente.",
    testSteps: [
      "Abrir la vista completa de la aplicación.",
      "Escribir un mensaje comercial simple.",
      "Presionar enviar.",
      "Verificar que el mensaje del usuario aparece en el historial.",
      "Verificar que el asistente responde después del estado de escritura.",
    ],
    expectedResult: [
      "El mensaje del usuario se muestra correctamente.",
      "El asistente entrega una respuesta relacionada.",
      "No se generan errores visuales.",
      "El historial conserva el orden correcto.",
    ],
    productionNotes: [
      "En producción debería validarse latencia real del backend.",
      "El prototipo actual usa lógica local simulada.",
    ],
  },
  {
    id: "ai-analysis-company-lead",
    title: "Clasificación IA de empresa interesada",
    category: "ai_analysis",
    priority: "critical",
    status: "ready",
    description:
      "Validar que el motor local de análisis IA detecte correctamente una intención comercial empresarial.",
    testSteps: [
      "Enviar un mensaje indicando que una empresa quiere cotizar un servicio.",
      "Revisar el panel de análisis IA.",
      "Verificar tipo de cliente, prioridad, servicio sugerido y acción recomendada.",
    ],
    expectedResult: [
      "El sistema clasifica el mensaje como lead empresarial o cliente interesado.",
      "La prioridad debe ser alta o crítica según el contenido.",
      "El panel de análisis IA debe actualizarse dinámicamente.",
      "Debe sugerirse una acción comercial coherente.",
    ],
    productionNotes: [
      "Las clasificaciones IA deben poder revisarse por humanos.",
      "En producción se recomienda registrar casos de baja confianza.",
    ],
  },
  {
    id: "lead-created-from-message",
    title: "Creación de lead desde conversación",
    category: "lead_generation",
    priority: "critical",
    status: "ready",
    description:
      "Validar que un mensaje relevante genere un registro de lead local con datos de análisis, canal y conversación asociada.",
    testSteps: [
      "Enviar un mensaje con intención comercial clara.",
      "Revisar la base local de contactos/leads.",
      "Verificar que se creó un registro reciente.",
      "Revisar prioridad, canal, resumen IA y acción recomendada.",
    ],
    expectedResult: [
      "Debe crearse un lead local.",
      "El lead debe contener canal de origen.",
      "El lead debe contener análisis IA asociado.",
      "Debe aparecer en métricas y reportes locales.",
    ],
    productionNotes: [
      "En producción la creación del lead debería ocurrir en backend.",
      "Debe evitarse duplicación excesiva de leads por conversación repetida.",
    ],
  },
  {
    id: "contact-extraction-basic",
    title: "Extracción básica de datos de contacto",
    category: "contact_extraction",
    priority: "high",
    status: "ready",
    description:
      "Validar que el sistema detecte datos básicos como nombre, correo, teléfono, empresa y método preferido de contacto.",
    testSteps: [
      "Enviar un mensaje con nombre, correo, teléfono y empresa.",
      "Revisar el último registro de lead.",
      "Verificar los campos detectados.",
      "Revisar la tabla reciente de leads.",
    ],
    expectedResult: [
      "Debe detectarse correo electrónico si existe.",
      "Debe detectarse teléfono si el formato es reconocible.",
      "Debe detectarse empresa cuando el mensaje lo indique.",
      "Los datos deben mostrarse sin romper el diseño.",
    ],
    productionNotes: [
      "La extracción por regex puede fallar en formatos complejos.",
      "En producción se recomienda validación adicional y consentimiento claro.",
    ],
  },
  {
    id: "web-widget-open-close",
    title: "Abrir y cerrar widget web",
    category: "web_widget",
    priority: "high",
    status: "ready",
    description:
      "Validar que el modo widget muestre botón flotante, panel compacto, mensajes y cierre correctamente.",
    testSteps: [
      "Cambiar a modo Widget Web.",
      "Presionar el botón flotante.",
      "Enviar un mensaje desde el panel compacto.",
      "Cerrar el widget.",
      "Volver a abrirlo.",
    ],
    expectedResult: [
      "El botón flotante debe mostrarse correctamente.",
      "El panel compacto debe abrir y cerrar sin errores.",
      "Los mensajes deben renderizarse en formato compacto.",
      "La experiencia debe seguir siendo responsive.",
    ],
    productionNotes: [
      "En producción debe validarse instalación real en sitios externos.",
      "El widget público debe cargar solo configuración segura.",
    ],
  },
  {
    id: "daily-summary-report",
    title: "Resumen diario comercial",
    category: "reports",
    priority: "high",
    status: "ready",
    description:
      "Validar que el resumen diario comercial refleje correctamente los leads generados y métricas principales.",
    testSteps: [
      "Generar varios mensajes de prueba con distintas prioridades.",
      "Revisar la sección de resumen diario.",
      "Verificar total de contactos, leads críticos, altos y derivaciones humanas.",
      "Usar el botón de copiar resumen.",
    ],
    expectedResult: [
      "Los KPIs deben actualizarse según los leads locales.",
      "El resumen ejecutivo debe ser coherente.",
      "El botón de copiado debe funcionar.",
      "No debe modificar datos al copiar.",
    ],
    productionNotes: [
      "En producción los reportes deberían permitir rango de fechas.",
      "Los reportes compartibles deberían evitar datos personales innecesarios.",
    ],
  },
];

export function buildQaTestPartASummary(items: QaTestItem[]) {
  const total = items.length;

  const ready = items.filter((item) => item.status === "ready").length;

  const critical = items.filter((item) => item.priority === "critical").length;

  const high = items.filter((item) => item.priority === "high").length;

  return {
    total,
    ready,
    critical,
    high,
  };
}

export const QA_TEST_ITEMS_PART_B: QaTestItem[] = [
  {
    id: "backup-export-json",
    title: "Exportación de respaldo local",
    category: "backup",
    priority: "critical",
    status: "ready",
    description:
      "Validar que la función de respaldo local genere un JSON conceptual con perfil, servicios, contactos, leads, reportes y metadatos.",
    testSteps: [
      "Crear algunos leads de prueba desde el chat.",
      "Ir a la sección de respaldo local.",
      "Generar o visualizar el respaldo JSON.",
      "Copiar o descargar el respaldo.",
      "Verificar que el contenido tenga estructura válida.",
    ],
    expectedResult: [
      "El respaldo debe incluir información estructurada.",
      "Debe incluir metadata de versión y fecha.",
      "Debe advertir que puede contener información sensible.",
      "No debe enviar datos a servicios externos.",
    ],
    productionNotes: [
      "En producción los respaldos deberían tener control de permisos.",
      "Se recomienda evaluar cifrado y auditoría de exportaciones.",
    ],
  },
  {
    id: "backup-restore-validation",
    title: "Validación de restauración de respaldo",
    category: "backup",
    priority: "critical",
    status: "ready",
    description:
      "Validar que la importación de respaldo acepte solo archivos con estructura válida y muestre advertencias antes de restaurar.",
    testSteps: [
      "Ir a la sección de restauración.",
      "Intentar cargar un archivo no JSON.",
      "Intentar cargar un JSON inválido.",
      "Cargar un respaldo válido.",
      "Revisar la vista previa antes de confirmar.",
    ],
    expectedResult: [
      "Los archivos inválidos deben rechazarse.",
      "La app debe mostrar estado de error o inválido.",
      "Un respaldo válido debe mostrar vista previa.",
      "La restauración debe requerir confirmación explícita.",
    ],
    productionNotes: [
      "En producción se recomienda validar versión de esquema.",
      "La restauración debería quedar auditada.",
    ],
  },
  {
    id: "privacy-guide-visible",
    title: "Validación de guía de privacidad",
    category: "privacy",
    priority: "high",
    status: "ready",
    description:
      "Validar que la guía conceptual de privacidad muestre políticas, sensibilidad, controles requeridos y notas de producción.",
    testSteps: [
      "Abrir la sección de privacidad.",
      "Revisar políticas de consentimiento, contacto, conversaciones y respaldos.",
      "Aplicar filtros por categoría, sensibilidad y estado.",
      "Copiar la guía de privacidad.",
    ],
    expectedResult: [
      "Las políticas deben mostrarse correctamente.",
      "Los filtros deben actualizar la lista visible.",
      "El copiado debe respetar los filtros activos.",
      "Debe existir nota de alcance legal/conceptual.",
    ],
    productionNotes: [
      "La guía no reemplaza revisión legal.",
      "En producción debe adaptarse a normativa aplicable.",
    ],
  },
  {
    id: "security-risk-filters",
    title: "Validación de matriz de seguridad",
    category: "security",
    priority: "critical",
    status: "ready",
    description:
      "Validar que la matriz de seguridad permita revisar riesgos, severidad, mitigaciones y notas operativas.",
    testSteps: [
      "Abrir la sección de seguridad.",
      "Filtrar por severidad crítica.",
      "Filtrar por categoría API, webhook o IA.",
      "Revisar mitigaciones sugeridas.",
      "Copiar la matriz de seguridad.",
    ],
    expectedResult: [
      "Los riesgos deben filtrarse correctamente.",
      "Debe mostrarse impacto posible y mitigaciones.",
      "La matriz copiada debe incluir el perfil activo.",
      "Debe mantenerse la advertencia de alcance conceptual.",
    ],
    productionNotes: [
      "La matriz no reemplaza auditoría profesional.",
      "En producción debe conectarse con controles reales de backend.",
    ],
  },
  {
    id: "observability-guide-filters",
    title: "Validación de observabilidad conceptual",
    category: "observability",
    priority: "high",
    status: "ready",
    description:
      "Validar que la guía de observabilidad muestre eventos, severidades, campos sugeridos y notas de monitoreo productivo.",
    testSteps: [
      "Abrir la sección de observabilidad.",
      "Filtrar por eventos de error o críticos.",
      "Filtrar por categoría de seguridad, IA o webhooks.",
      "Revisar campos sugeridos.",
      "Copiar la guía de observabilidad.",
    ],
    expectedResult: [
      "Los eventos deben filtrarse según categoría, severidad y estado.",
      "Los campos sugeridos deben ser visibles.",
      "La exportación debe estar sincronizada con los filtros.",
      "Debe aclararse que no se crean logs reales.",
    ],
    productionNotes: [
      "En producción debería integrarse con monitoreo real.",
      "Los logs deben evitar datos sensibles innecesarios.",
    ],
  },
  {
    id: "api-contracts-review",
    title: "Revisión de contratos API conceptuales",
    category: "security",
    priority: "high",
    status: "ready",
    description:
      "Validar que los contratos API conceptuales muestren métodos, rutas, estados, acceso requerido, request y response conceptual.",
    testSteps: [
      "Abrir la sección de contratos API.",
      "Filtrar por endpoints críticos.",
      "Filtrar por método POST o PATCH.",
      "Revisar ejemplos de request y response.",
      "Copiar contratos API filtrados.",
    ],
    expectedResult: [
      "Los contratos deben mostrarse con método y ruta.",
      "Los filtros deben funcionar correctamente.",
      "Los ejemplos deben ser legibles en bloques de código.",
      "Debe aclararse que no existen endpoints reales.",
    ],
    productionNotes: [
      "Los contratos deberían servir como base para backend futuro.",
      "No deben confundirse con llamadas reales del prototipo.",
    ],
  },
];

export const QA_TEST_ITEMS: QaTestItem[] = [
  ...QA_TEST_ITEMS_PART_A,
  ...QA_TEST_ITEMS_PART_B,
];

export function buildQaTestSummary(items: QaTestItem[]) {
  const total = items.length;

  const ready = items.filter((item) => item.status === "ready").length;
  const pending = items.filter((item) => item.status === "pending").length;
  const future = items.filter((item) => item.status === "future").length;

  const critical = items.filter((item) => item.priority === "critical").length;
  const high = items.filter((item) => item.priority === "high").length;

  return {
    total,
    ready,
    pending,
    future,
    critical,
    high,
  };
}

export function buildQaTestText(params: {
  profile: CompanyProfile;
  items: QaTestItem[];
  summary: ReturnType<typeof buildQaTestSummary>;
}): string {
  const { profile, items, summary } = params;

  const testsText = items
    .map((item) => {
      return `PRUEBA: ${item.title}
Categoría: ${QA_TEST_CATEGORY_LABELS[item.category]}
Prioridad: ${QA_TEST_PRIORITY_LABELS[item.priority]}
Estado: ${QA_TEST_STATUS_LABELS[item.status]}

Descripción:
${item.description}

Pasos:
${item.testSteps.map((step, index) => `${index + 1}. ${step}`).join("\n")}

Resultado esperado:
${item.expectedResult.map((result) => `- ${result}`).join("\n")}

Notas producción:
${item.productionNotes.map((note) => `- ${note}`).join("\n")}`;
    })
    .join("\n\n---\n\n");

  return `MATRIZ QA CONCEPTUAL — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

RESUMEN
Pruebas evaluadas: ${summary.total}
Listas para validar: ${summary.ready}
Pendientes: ${summary.pending}
Futuras: ${summary.future}
Críticas: ${summary.critical}
Altas: ${summary.high}

DETALLE
${testsText}

NOTA
Esta matriz es conceptual. No ejecuta pruebas automáticas reales, no modifica datos, no crea backend y no reemplaza un proceso formal de QA profesional.`;
}

export type DeploymentEnvironmentType =
  | "local"
  | "demo"
  | "staging"
  | "production"
  | "sandbox"
  | "internal_testing";

export type DeploymentEnvironmentStatus =
  | "active_prototype"
  | "required"
  | "future";

export type DeploymentEnvironmentRiskLevel = "low" | "medium" | "high" | "critical";

export type DeploymentEnvironmentItem = {
  id: string;
  title: string;
  type: DeploymentEnvironmentType;
  status: DeploymentEnvironmentStatus;
  riskLevel: DeploymentEnvironmentRiskLevel;
  priority: ProductionChecklistPriority;
  description: string;
  purpose: string[];
  requiredControls: string[];
  productionNotes: string[];
};

export const DEPLOYMENT_ENVIRONMENT_TYPE_LABELS: Record<
  DeploymentEnvironmentType,
  string
> = {
  local: "Local",
  demo: "Demo comercial",
  staging: "Staging",
  production: "Producción",
  sandbox: "Sandbox cliente",
  internal_testing: "Pruebas internas",
};

export const DEPLOYMENT_ENVIRONMENT_STATUS_LABELS: Record<
  DeploymentEnvironmentStatus,
  string
> = {
  active_prototype: "Activo en prototipo",
  required: "Requerido para producción",
  future: "Fase futura",
};

export const DEPLOYMENT_ENVIRONMENT_RISK_LABELS: Record<
  DeploymentEnvironmentRiskLevel,
  string
> = {
  low: "Bajo",
  medium: "Medio",
  high: "Alto",
  critical: "Crítico",
};

export const DEPLOYMENT_ENVIRONMENT_ITEMS_PART_A: DeploymentEnvironmentItem[] = [
  {
    id: "local-prototype",
    title: "Ambiente local de prototipo",
    type: "local",
    status: "active_prototype",
    riskLevel: "low",
    priority: "high",
    description:
      "Ambiente actual donde se construye y valida ORBI ChatBox IA Core dentro de Google IA Studio o entorno local de desarrollo.",
    purpose: [
      "Construir funcionalidades rápidamente.",
      "Validar diseño visual y flujos locales.",
      "Probar lógica simulada sin backend real.",
      "Iterar módulos sin afectar usuarios reales.",
    ],
    requiredControls: [
      "Mantener alcance local claramente indicado.",
      "Evitar simular conexiones reales inexistentes.",
      "Separar funciones conceptuales de funciones productivas.",
      "Probar que los módulos no rompan la aplicación principal.",
    ],
    productionNotes: [
      "No debe usarse como ambiente productivo.",
      "Puede servir para demo técnica temprana.",
      "Debe mantenerse libre de credenciales reales.",
    ],
  },
  {
    id: "commercial-demo",
    title: "Ambiente demo comercial",
    type: "demo",
    status: "required",
    riskLevel: "medium",
    priority: "high",
    description:
      "Ambiente pensado para presentar ORBI ChatBox IA Core a clientes, socios o inversionistas sin exponer datos reales.",
    purpose: [
      "Mostrar capacidades comerciales.",
      "Simular atención web y WhatsApp futuro.",
      "Presentar reportes, leads y propuesta comercial.",
      "Validar interés de empresas antes de producción.",
    ],
    requiredControls: [
      "Usar datos ficticios o anonimizados.",
      "Evitar correos, teléfonos o clientes reales.",
      "Mantener avisos de demo visible.",
      "Bloquear cualquier integración externa real.",
    ],
    productionNotes: [
      "Debe ser estable visualmente.",
      "Debe tener guion de demo y casos de prueba predefinidos.",
      "Puede desplegarse como sitio demo estático sin backend real.",
    ],
  },
  {
    id: "staging-environment",
    title: "Ambiente staging",
    type: "staging",
    status: "required",
    riskLevel: "high",
    priority: "critical",
    description:
      "Ambiente previo a producción donde se validarían backend, base de datos, autenticación, APIs, seguridad y widget real.",
    purpose: [
      "Probar integraciones reales antes de producción.",
      "Validar migraciones de base de datos.",
      "Ejecutar QA funcional y técnico.",
      "Probar roles, permisos, APIs y logs.",
    ],
    requiredControls: [
      "Usar configuración separada de producción.",
      "Evitar datos reales salvo autorización controlada.",
      "Ejecutar checklist QA antes de liberar cambios.",
      "Registrar errores y resultados de prueba.",
    ],
    productionNotes: [
      "Staging debe parecerse a producción, pero no ser producción.",
      "Debe tener variables de entorno propias.",
      "Debe permitir rollback antes de liberar una versión real.",
    ],
  },
  {
    id: "production-environment",
    title: "Ambiente producción",
    type: "production",
    status: "future",
    riskLevel: "critical",
    priority: "critical",
    description:
      "Ambiente real donde empresas usarían ORBI ChatBox IA Core con datos, usuarios, conversaciones, leads, reportes y canales productivos.",
    purpose: [
      "Operar con clientes reales.",
      "Atender conversaciones reales.",
      "Gestionar leads reales.",
      "Entregar métricas y reportes reales.",
    ],
    requiredControls: [
      "Autenticación real.",
      "Base de datos segura.",
      "Aislamiento multiempresa.",
      "Backups controlados.",
      "Logs y monitoreo.",
      "Políticas de privacidad revisadas.",
      "Seguridad API y control de permisos backend.",
    ],
    productionNotes: [
      "No debe activarse hasta cerrar QA, seguridad, privacidad y arquitectura.",
      "Debe tener monitoreo, rollback y manejo de incidentes.",
      "Debe pasar por revisión técnica y legal antes de operar con clientes.",
    ],
  },
  {
    id: "client-sandbox",
    title: "Sandbox para cliente",
    type: "sandbox",
    status: "future",
    riskLevel: "medium",
    priority: "medium",
    description:
      "Ambiente aislado para que una empresa pruebe ORBI ChatBox IA Core con configuración propia, sin afectar producción ni datos reales.",
    purpose: [
      "Permitir pruebas controladas por cliente.",
      "Validar servicios y mensajes personalizados.",
      "Probar widget en un sitio no productivo.",
      "Recibir feedback antes de activar producción.",
    ],
    requiredControls: [
      "Separar datos sandbox de datos productivos.",
      "Marcar visualmente que es ambiente de prueba.",
      "Limitar integraciones externas.",
      "Permitir limpieza o reinicio del sandbox.",
    ],
    productionNotes: [
      "Útil para onboarding de nuevas empresas.",
      "Debe evitar confusión con ambiente real.",
      "Puede reducir riesgos antes de activar cliente en producción.",
    ],
  },
  {
    id: "internal-testing",
    title: "Ambiente de pruebas internas",
    type: "internal_testing",
    status: "required",
    riskLevel: "medium",
    priority: "high",
    description:
      "Ambiente usado por el equipo ORBI para validar nuevas funciones, módulos, regresiones visuales y compatibilidad antes de pasar a demo o staging.",
    purpose: [
      "Probar módulos nuevos.",
      "Validar que no se rompan módulos anteriores.",
      "Revisar calidad visual y responsive.",
      "Ejecutar matriz QA conceptual.",
    ],
    requiredControls: [
      "Usar datos ficticios.",
      "Documentar errores encontrados.",
      "Mantener checklist de cambios.",
      "Separar experimentos de versión estable.",
    ],
    productionNotes: [
      "Debe existir antes de escalar el producto.",
      "Puede ser una rama o despliegue separado.",
      "Ayuda a mantener estabilidad del ecosistema ORBI.",
    ],
  },
];

export function buildDeploymentEnvironmentPartASummary(
  items: DeploymentEnvironmentItem[]
) {
  const total = items.length;

  const activePrototype = items.filter(
    (item) => item.status === "active_prototype"
  ).length;

  const required = items.filter((item) => item.status === "required").length;

  const future = items.filter((item) => item.status === "future").length;

  const criticalRisk = items.filter(
    (item) => item.riskLevel === "critical"
  ).length;

  return {
    total,
    activePrototype,
    required,
    future,
    criticalRisk,
  };
}

export type DeploymentChecklistCategory =
  | "release"
  | "rollback"
  | "versioning"
  | "qa_validation"
  | "security_validation"
  | "privacy_validation"
  | "communication"
  | "monitoring";

export type DeploymentChecklistStatus =
  | "not_started"
  | "planned"
  | "required"
  | "future";

export type DeploymentChecklistRiskLevel = "low" | "medium" | "high" | "critical";

export type DeploymentChecklistItem = {
  id: string;
  title: string;
  category: DeploymentChecklistCategory;
  status: DeploymentChecklistStatus;
  riskLevel: DeploymentChecklistRiskLevel;
  priority: ProductionChecklistPriority;
  description: string;
  requiredActions: string[];
  acceptanceCriteria: string[];
  productionNotes: string[];
};

export const DEPLOYMENT_CHECKLIST_CATEGORY_LABELS: Record<
  DeploymentChecklistCategory,
  string
> = {
  release: "Release",
  rollback: "Rollback",
  versioning: "Versionado",
  qa_validation: "Validación QA",
  security_validation: "Validación seguridad",
  privacy_validation: "Validación privacidad",
  communication: "Comunicación",
  monitoring: "Monitoreo",
};

export const DEPLOYMENT_CHECKLIST_STATUS_LABELS: Record<
  DeploymentChecklistStatus,
  string
> = {
  not_started: "No iniciado",
  planned: "Planificado",
  required: "Requerido",
  future: "Fase futura",
};

export const DEPLOYMENT_CHECKLIST_RISK_LABELS: Record<
  DeploymentChecklistRiskLevel,
  string
> = {
  low: "Bajo",
  medium: "Medio",
  high: "Alto",
  critical: "Crítico",
};

export const DEPLOYMENT_CHECKLIST_ITEMS: DeploymentChecklistItem[] = [
  {
    id: "release-readiness",
    title: "Validación de preparación para release",
    category: "release",
    status: "required",
    riskLevel: "critical",
    priority: "critical",
    description:
      "Checklist conceptual para confirmar que una versión está lista antes de pasar desde prototipo, demo o staging hacia un ambiente superior.",
    requiredActions: [
      "Confirmar que la app compila sin errores.",
      "Revisar que no existan errores visuales críticos.",
      "Validar matriz QA conceptual.",
      "Revisar cambios recientes contra módulos anteriores.",
      "Confirmar nota de alcance en módulos conceptuales.",
    ],
    acceptanceCriteria: [
      "No hay errores de compilación.",
      "No se rompen módulos previos.",
      "La navegación principal funciona.",
      "Los módulos nuevos se renderizan solo donde corresponde.",
    ],
    productionNotes: [
      "En producción esta validación debería automatizarse parcialmente.",
      "Debe existir una persona responsable de aprobar cada release.",
    ],
  },
  {
    id: "rollback-plan",
    title: "Plan conceptual de rollback",
    category: "rollback",
    status: "required",
    riskLevel: "critical",
    priority: "critical",
    description:
      "Define cómo volver a una versión estable si una actualización futura genera fallas graves.",
    requiredActions: [
      "Identificar última versión estable.",
      "Mantener historial de cambios por módulo.",
      "Documentar motivo del rollback.",
      "Definir responsable de reversión.",
      "Verificar que datos críticos no se pierdan.",
    ],
    acceptanceCriteria: [
      "Existe referencia clara a versión anterior estable.",
      "El equipo sabe qué revertir.",
      "El rollback no depende de memoria informal.",
      "La restauración se puede validar con QA básico.",
    ],
    productionNotes: [
      "Rollback real depende de infraestructura, control de versiones y base de datos.",
      "No debe improvisarse en incidentes productivos.",
    ],
  },
  {
    id: "semantic-versioning",
    title: "Versionado semántico conceptual",
    category: "versioning",
    status: "planned",
    riskLevel: "medium",
    priority: "high",
    description:
      "Define una estrategia de versionado para diferenciar cambios menores, mejoras mayores y cambios incompatibles.",
    requiredActions: [
      "Asignar número de versión visible.",
      "Separar cambios visuales, funcionales y estructurales.",
      "Documentar módulos incluidos en cada versión.",
      "Mantener notas de release.",
    ],
    acceptanceCriteria: [
      "Cada versión tiene identificador claro.",
      "Los cambios quedan descritos.",
      "Las demos pueden indicar qué versión se está mostrando.",
      "Los módulos productivos futuros pueden rastrearse.",
    ],
    productionNotes: [
      "Puede usarse formato mayor.menor.parche.",
      "Las versiones productivas deben quedar registradas.",
    ],
  },
  {
    id: "qa-before-release",
    title: "QA previo a release",
    category: "qa_validation",
    status: "required",
    riskLevel: "high",
    priority: "critical",
    description:
      "Define la revisión mínima de pruebas antes de liberar una versión demo, staging o producción.",
    requiredActions: [
      "Ejecutar casos críticos de chat.",
      "Validar generación de leads.",
      "Revisar widget web.",
      "Validar reportes y copiados.",
      "Revisar filtros de módulos técnicos.",
      "Confirmar que no hay estados vacíos rotos.",
    ],
    acceptanceCriteria: [
      "Casos críticos pasan revisión manual.",
      "No hay errores visibles en flujo principal.",
      "El botón de copiado funciona en módulos clave.",
      "La interfaz sigue siendo responsive.",
    ],
    productionNotes: [
      "En producción debería existir QA automatizado y manual.",
      "El checklist conceptual puede servir como base inicial.",
    ],
  },
  {
    id: "security-before-release",
    title: "Validación de seguridad previa",
    category: "security_validation",
    status: "required",
    riskLevel: "critical",
    priority: "critical",
    description:
      "Define controles mínimos de seguridad antes de liberar una versión con usuarios o datos reales.",
    requiredActions: [
      "Revisar matriz de riesgos.",
      "Confirmar separación de módulos conceptuales y productivos.",
      "Verificar que no existan credenciales reales en frontend.",
      "Revisar permisos y roles esperados.",
      "Confirmar que endpoints conceptuales no ejecutan llamadas reales.",
    ],
    acceptanceCriteria: [
      "No hay secretos expuestos.",
      "No existen integraciones reales no autorizadas.",
      "Los módulos conceptuales no modifican datos sensibles.",
      "Los riesgos críticos están documentados.",
    ],
    productionNotes: [
      "Antes de producción real se requiere revisión profesional.",
      "La seguridad no debe depender solo de la interfaz.",
    ],
  },
  {
    id: "privacy-before-release",
    title: "Validación de privacidad previa",
    category: "privacy_validation",
    status: "required",
    riskLevel: "critical",
    priority: "critical",
    description:
      "Define validaciones de privacidad antes de usar ORBI ChatBox IA Core con datos reales de clientes.",
    requiredActions: [
      "Revisar guía de privacidad.",
      "Confirmar aviso de consentimiento.",
      "Evitar datos reales en demo pública.",
      "Revisar exportaciones y respaldos.",
      "Confirmar que reportes no expongan datos innecesarios.",
    ],
    acceptanceCriteria: [
      "Existe nota de privacidad visible.",
      "Los datos sensibles no se exponen sin necesidad.",
      "Las exportaciones advierten sobre sensibilidad.",
      "La demo usa datos ficticios o anonimizados.",
    ],
    productionNotes: [
      "Debe revisarse con asesoría legal antes de producción.",
      "La normativa puede variar según país e industria.",
    ],
  },
  {
    id: "release-communication",
    title: "Comunicación de cambios",
    category: "communication",
    status: "planned",
    riskLevel: "medium",
    priority: "medium",
    description:
      "Define cómo comunicar cambios relevantes a equipo interno, clientes demo o usuarios futuros.",
    requiredActions: [
      "Preparar resumen de cambios.",
      "Indicar módulos nuevos o modificados.",
      "Informar limitaciones conocidas.",
      "Registrar fecha y versión.",
      "Separar cambios técnicos de cambios comerciales.",
    ],
    acceptanceCriteria: [
      "Existe nota de release legible.",
      "Se comunica qué cambió y por qué.",
      "Se indican limitaciones si existen.",
      "El equipo puede entender el impacto del cambio.",
    ],
    productionNotes: [
      "La comunicación reduce confusión en demos y pruebas.",
      "Las versiones productivas deben tener historial de cambios.",
    ],
  },
  {
    id: "monitoring-after-release",
    title: "Monitoreo posterior al release",
    category: "monitoring",
    status: "future",
    riskLevel: "high",
    priority: "high",
    description:
      "Define qué debería observarse después de liberar una versión en staging o producción.",
    requiredActions: [
      "Revisar errores del sistema.",
      "Monitorear tiempos de respuesta.",
      "Verificar creación de conversaciones y leads.",
      "Revisar eventos de permisos denegados.",
      "Detectar fallas repetitivas.",
    ],
    acceptanceCriteria: [
      "Existe visibilidad de errores importantes.",
      "Se pueden detectar fallas después del release.",
      "Los eventos críticos no pasan desapercibidos.",
      "El equipo sabe cómo responder ante incidentes.",
    ],
    productionNotes: [
      "Requiere observabilidad real en producción.",
      "Debe conectarse con alertas, logs y procedimientos de incidente.",
    ],
  },
];

export function buildDeploymentChecklistSummary(items: DeploymentChecklistItem[]) {
  const total = items.length;

  const required = items.filter((item) => item.status === "required").length;
  const planned = items.filter((item) => item.status === "planned").length;
  const future = items.filter((item) => item.status === "future").length;

  const criticalRisk = items.filter(
    (item) => item.riskLevel === "critical"
  ).length;

  const highRisk = items.filter((item) => item.riskLevel === "high").length;

  return {
    total,
    required,
    planned,
    future,
    criticalRisk,
    highRisk,
  };
}

export function buildDeploymentChecklistText(params: {
  profile: CompanyProfile;
  items: DeploymentChecklistItem[];
  summary: ReturnType<typeof buildDeploymentChecklistSummary>;
}): string {
  const { profile, items, summary } = params;

  const itemText = items
    .map((item) => {
      return `CHECKLIST: ${item.title}
Categoría: ${DEPLOYMENT_CHECKLIST_CATEGORY_LABELS[item.category]}
Estado: ${DEPLOYMENT_CHECKLIST_STATUS_LABELS[item.status]}
Riesgo: ${DEPLOYMENT_CHECKLIST_RISK_LABELS[item.riskLevel]}
Prioridad: ${PRODUCTION_CHECKLIST_PRIORITY_LABELS[item.priority]}

Descripción:
${item.description}

Acciones requeridas:
${item.requiredActions.map((action) => `- ${action}`).join("\n")}

Criterios de aceptación:
${item.acceptanceCriteria.map((criteria) => `- ${criteria}`).join("\n")}

Notas producción:
${item.productionNotes.map((note) => `- ${note}`).join("\n")}`;
    })
    .join("\n\n---\n\n");

  return `GUÍA CONCEPTUAL DE RELEASE Y DESPLIEGUE — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

RESUMEN
Ítems evaluados: ${summary.total}
Requeridos: ${summary.required}
Planificados: ${summary.planned}
Futuros: ${summary.future}
Riesgo crítico: ${summary.criticalRisk}
Riesgo alto: ${summary.highRisk}

DETALLE
${itemText}

NOTA
Esta guía es conceptual. No ejecuta builds, no despliega la aplicación, no conecta Vercel, no crea backend y no modifica datos del prototipo.`;
}

export type ProductReadinessArea =
  | "backend_architecture"
  | "data_model"
  | "roles_permissions"
  | "api_contracts"
  | "privacy"
  | "security"
  | "observability"
  | "qa"
  | "deployment";

export type ProductReadinessStatus =
  | "conceptual_ready"
  | "prototype_ready"
  | "requires_backend"
  | "requires_review"
  | "future";

export type ProductReadinessRiskLevel = "low" | "medium" | "high" | "critical";

export type ProductReadinessItem = {
  id: string;
  title: string;
  area: ProductReadinessArea;
  status: ProductReadinessStatus;
  riskLevel: ProductReadinessRiskLevel;
  priority: ProductionChecklistPriority;
  score: number;
  description: string;
  completedEvidence: string[];
  missingForProduction: string[];
  nextRecommendedActions: string[];
};

export const PRODUCT_READINESS_AREA_LABELS: Record<ProductReadinessArea, string> = {
  backend_architecture: "Arquitectura backend",
  data_model: "Modelo de datos",
  roles_permissions: "Roles y permisos",
  api_contracts: "Contratos API",
  privacy: "Privacidad",
  security: "Seguridad",
  observability: "Observabilidad",
  qa: "QA",
  deployment: "Despliegue",
};

export const PRODUCT_READINESS_STATUS_LABELS: Record<ProductReadinessStatus, string> = {
  conceptual_ready: "Conceptualmente listo",
  prototype_ready: "Listo en prototipo",
  requires_backend: "Requiere backend real",
  requires_review: "Requiere revisión",
  future: "Fase futura",
};

export const PRODUCT_READINESS_RISK_LABELS: Record<ProductReadinessRiskLevel, string> = {
  low: "Bajo",
  medium: "Medio",
  high: "Alto",
  critical: "Crítico",
};

export const PRODUCT_READINESS_ITEMS_PART_A: ProductReadinessItem[] = [
  {
    id: "readiness-backend-architecture",
    title: "Blueprint backend seguro",
    area: "backend_architecture",
    status: "conceptual_ready",
    riskLevel: "high",
    priority: "critical",
    score: 75,
    description:
      "La arquitectura backend segura ya está documentada conceptualmente, con componentes, categorías, estados, prioridades y dependencias técnicas.",
    completedEvidence: [
      "Blueprint backend seguro implementado.",
      "Componentes técnicos categorizados.",
      "KPIs de arquitectura disponibles.",
      "Exportación copiable del blueprint.",
    ],
    missingForProduction: [
      "Backend real.",
      "API Gateway real.",
      "Base de datos real.",
      "Autenticación real.",
      "Infraestructura productiva.",
    ],
    nextRecommendedActions: [
      "Definir stack backend futuro.",
      "Priorizar API Gateway, base de datos y autenticación.",
      "Convertir contratos conceptuales en tickets técnicos.",
    ],
  },
  {
    id: "readiness-data-model",
    title: "Modelo de datos multiempresa",
    area: "data_model",
    status: "conceptual_ready",
    riskLevel: "high",
    priority: "critical",
    score: 80,
    description:
      "El modelo de datos multiempresa ya cubre entidades núcleo, configuración, conversaciones, mensajes, leads, reportes y auditoría.",
    completedEvidence: [
      "11 entidades conceptuales definidas.",
      "Campos y relaciones documentadas.",
      "Filtros por tipo y estado.",
      "Exportación copiable del modelo.",
    ],
    missingForProduction: [
      "Modelo físico de base de datos.",
      "Migraciones.",
      "Índices.",
      "Políticas de retención aplicadas.",
      "Validaciones server-side.",
    ],
    nextRecommendedActions: [
      "Traducir entidades a esquema de base de datos.",
      "Definir relaciones productivas.",
      "Separar datos públicos, privados y auditables.",
    ],
  },
  {
    id: "readiness-roles-permissions",
    title: "Roles, permisos y accesos",
    area: "roles_permissions",
    status: "conceptual_ready",
    riskLevel: "critical",
    priority: "critical",
    score: 70,
    description:
      "La matriz conceptual de roles y permisos ya define accesos para Super Admin, Administrador de empresa, Ejecutivo comercial, Soporte, Visualizador e Integrador técnico.",
    completedEvidence: [
      "6 roles conceptuales definidos.",
      "Permisos por área documentados.",
      "Filtros por rol y área.",
      "Exportación copiable de matriz.",
    ],
    missingForProduction: [
      "Autenticación real.",
      "Validación de permisos en backend.",
      "Gestión real de usuarios.",
      "Auditoría de cambios de rol.",
    ],
    nextRecommendedActions: [
      "Implementar RBAC en backend real.",
      "Separar permisos frontend y permisos servidor.",
      "Definir flujos de alta, baja y cambio de rol.",
    ],
  },
  {
    id: "readiness-api-contracts",
    title: "Contratos API conceptuales",
    area: "api_contracts",
    status: "conceptual_ready",
    riskLevel: "high",
    priority: "critical",
    score: 78,
    description:
      "Los contratos API conceptuales ya cubren autenticación, empresas, usuarios, servicios, widget, conversaciones, mensajes, leads, reportes y webhooks futuros.",
    completedEvidence: [
      "Contratos Parte A + Parte B unificados.",
      "Métodos, rutas, request y response documentados.",
      "Filtros por categoría, estado y método.",
      "Exportación copiable de contratos.",
    ],
    missingForProduction: [
      "Endpoints reales.",
      "Validación de request.",
      "Control de permisos por endpoint.",
      "Rate limiting.",
      "Manejo de errores productivo.",
    ],
    nextRecommendedActions: [
      "Convertir contratos en especificación backend.",
      "Definir validadores y errores estándar.",
      "Priorizar endpoints públicos del widget y endpoints internos.",
    ],
  },
  {
    id: "readiness-privacy",
    title: "Privacidad, consentimiento y retención",
    area: "privacy",
    status: "requires_review",
    riskLevel: "critical",
    priority: "critical",
    score: 68,
    description:
      "La guía conceptual de privacidad ya cubre consentimiento, datos de contacto, conversaciones, leads, reportes, respaldos, retención, anonimización, auditoría, procesamiento IA y acceso por roles.",
    completedEvidence: [
      "Políticas conceptuales unificadas.",
      "Filtros por categoría, sensibilidad y estado.",
      "KPIs de sensibilidad.",
      "Exportación copiable de guía.",
    ],
    missingForProduction: [
      "Revisión legal profesional.",
      "Textos legales definitivos.",
      "Flujos reales de consentimiento.",
      "Políticas de eliminación y retención implementadas.",
    ],
    nextRecommendedActions: [
      "Preparar borrador legal por país objetivo.",
      "Diseñar consentimiento público del widget.",
      "Separar política interna, política pública y política de retención.",
    ],
  },
  {
    id: "readiness-security",
    title: "Seguridad, riesgos y mitigaciones",
    area: "security",
    status: "requires_review",
    riskLevel: "critical",
    priority: "critical",
    score: 65,
    description:
      "La matriz de seguridad ya identifica riesgos críticos y altos sobre acceso, multiempresa, respaldos, leads, roles admin, datos sensibles, APIs, webhooks, IA y operaciones.",
    completedEvidence: [
      "Riesgos Parte A + Parte B unificados.",
      "Mitigaciones sugeridas documentadas.",
      "Filtros por categoría, severidad y estado.",
      "Exportación copiable de matriz.",
    ],
    missingForProduction: [
      "Auditoría de ciberseguridad profesional.",
      "Controles técnicos reales.",
      "Pruebas de seguridad.",
      "Gestión de secretos.",
      "Monitoreo de incidentes.",
    ],
    nextRecommendedActions: [
      "Priorizar riesgos críticos.",
      "Definir controles mínimos para staging.",
      "No activar producción sin revisión de seguridad real.",
    ],
  },
  {
    id: "readiness-observability",
    title: "Observabilidad, logs y monitoreo",
    area: "observability",
    status: "conceptual_ready",
    riskLevel: "high",
    priority: "high",
    score: 72,
    description:
      "La guía de observabilidad conceptual ya define eventos para autenticación, conversaciones, leads, exportaciones, webhooks, motor IA, performance y seguridad.",
    completedEvidence: [
      "Eventos Parte A + Parte B unificados.",
      "Campos sugeridos documentados.",
      "KPIs de trazabilidad.",
      "Exportación copiable de guía.",
    ],
    missingForProduction: [
      "Sistema real de logs.",
      "Alertas.",
      "Correlación frontend-backend.",
      "Dashboard operacional.",
      "Política de retención de logs.",
    ],
    nextRecommendedActions: [
      "Definir eventos mínimos para MVP productivo.",
      "Separar logs técnicos, logs de auditoría y métricas.",
      "Evitar datos sensibles innecesarios en logs.",
    ],
  },
  {
    id: "readiness-qa",
    title: "QA y criterios de aceptación",
    area: "qa",
    status: "prototype_ready",
    riskLevel: "medium",
    priority: "high",
    score: 82,
    description:
      "La matriz QA conceptual ya permite validar flujos funcionales, respaldo, privacidad, seguridad, observabilidad y contratos técnicos.",
    completedEvidence: [
      "Pruebas Parte A + Parte B unificadas.",
      "Casos críticos y altos documentados.",
      "Filtros por categoría, prioridad y estado.",
      "Exportación copiable de matriz QA.",
    ],
    missingForProduction: [
      "Testing automatizado.",
      "Pruebas e2e.",
      "Pruebas de carga.",
      "Pruebas reales con backend.",
      "Evidencia formal de ejecución.",
    ],
    nextRecommendedActions: [
      "Usar matriz QA para validar demo.",
      "Definir pruebas críticas antes de staging.",
      "Convertir casos principales en pruebas automatizadas futuras.",
    ],
  },
  {
    id: "readiness-deployment",
    title: "Ambientes, release y rollback",
    area: "deployment",
    status: "conceptual_ready",
    riskLevel: "high",
    priority: "high",
    score: 74,
    description:
      "La guía de ambientes, release, rollback, versionado y preparación productiva ya permite ordenar el camino desde prototipo hacia demo, staging y producción.",
    completedEvidence: [
      "Ambientes conceptuales definidos.",
      "Checklist de release y rollback creado.",
      "Filtros por categoría, estado y riesgo.",
      "Exportación copiable de guía de release.",
    ],
    missingForProduction: [
      "Pipeline real.",
      "Control de versiones real.",
      "Ambientes desplegados.",
      "Rollback técnico probado.",
      "Monitoreo post-release real.",
    ],
    nextRecommendedActions: [
      "Definir primera demo estática estable.",
      "Preparar checklist de salida demo.",
      "Separar rama estable y rama experimental.",
    ],
  },
];

export function getProductReadinessFinalClassification(score: number) {
  if (score >= 85) {
    return {
      label: "Muy preparado para demo avanzada",
      description:
        "El prototipo tiene una base conceptual fuerte y puede avanzar hacia una demo avanzada, manteniendo claro que aún no es producción real.",
      tone: "excellent",
    };
  }

  if (score >= 75) {
    return {
      label: "Preparado para demo técnica/comercial",
      description:
        "El prototipo está suficientemente estructurado para una demo técnica o comercial sólida, pero aún requiere backend, seguridad real y revisión legal antes de producción.",
      tone: "good",
    };
  }

  if (score >= 60) {
    return {
      label: "Base conceptual sólida, requiere maduración",
      description:
        "El prototipo tiene buena estructura, pero requiere maduración técnica antes de pasar a staging o producción.",
      tone: "medium",
    };
  }

  return {
    label: "Aún no preparado para demo avanzada",
    description:
      "El prototipo necesita completar más capas conceptuales o corregir brechas antes de presentarse como solución avanzada.",
    tone: "risk",
  };
}

export function buildProductReadinessActionPlan(items: ProductReadinessItem[]) {
  const criticalRiskItems = items.filter(
    (item) => item.riskLevel === "critical"
  );

  const requiresReviewItems = items.filter(
    (item) => item.status === "requires_review"
  );

  const requiresBackendItems = items.filter(
    (item) => item.status === "requires_backend"
  );

  const lowestScoreItems = [...items]
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  return {
    criticalRiskItems,
    requiresReviewItems,
    requiresBackendItems,
    lowestScoreItems,
    recommendedNextSteps: [
      "Preparar una demo estática estable con datos ficticios.",
      "Separar claramente funciones conceptuales de funciones productivas.",
      "Priorizar backend real, autenticación y base de datos multiempresa.",
      "Revisar privacidad y seguridad con apoyo profesional antes de producción.",
      "Convertir matriz QA y contratos API en tickets técnicos futuros.",
      "Definir una versión demo estable y una rama experimental separada.",
    ],
  };
}

export function buildProductReadinessSummary(items: ProductReadinessItem[]) {
  const total = items.length;

  const averageScore =
    total === 0
      ? 0
      : Math.round(
          items.reduce((sum, item) => sum + item.score, 0) / total
        );

  const conceptualReady = items.filter(
    (item) => item.status === "conceptual_ready"
  ).length;

  const prototypeReady = items.filter(
    (item) => item.status === "prototype_ready"
  ).length;

  const requiresBackend = items.filter(
    (item) => item.status === "requires_backend"
  ).length;

  const requiresReview = items.filter(
    (item) => item.status === "requires_review"
  ).length;

  const future = items.filter((item) => item.status === "future").length;

  const criticalRisk = items.filter(
    (item) => item.riskLevel === "critical"
  ).length;

  const highRisk = items.filter((item) => item.riskLevel === "high").length;

  const classification = getProductReadinessFinalClassification(averageScore);

  return {
    total,
    averageScore,
    conceptualReady,
    prototypeReady,
    requiresBackend,
    requiresReview,
    future,
    criticalRisk,
    highRisk,
    classification,
  };
}

export function buildProductReadinessText(params: {
  profile: CompanyProfile;
  items: ProductReadinessItem[];
  summary: ReturnType<typeof buildProductReadinessSummary>;
  actionPlan: ReturnType<typeof buildProductReadinessActionPlan>;
}): string {
  const { profile, items, summary, actionPlan } = params;

  const itemsText = items
    .map((item) => {
      return `ÁREA: ${item.title}
Categoría: ${PRODUCT_READINESS_AREA_LABELS[item.area]}
Estado: ${PRODUCT_READINESS_STATUS_LABELS[item.status]}
Riesgo: ${PRODUCT_READINESS_RISK_LABELS[item.riskLevel]}
Prioridad: ${PRODUCTION_CHECKLIST_PRIORITY_LABELS[item.priority]}
Score: ${item.score}%

Descripción:
${item.description}

Evidencia completada:
${item.completedEvidence.map((evidence) => `- ${evidence}`).join("\n")}

Faltante para producción:
${item.missingForProduction.map((missing) => `- ${missing}`).join("\n")}

Siguientes acciones:
${item.nextRecommendedActions.map((action) => `- ${action}`).join("\n")}`;
    })
    .join("\n\n---\n\n");

  const lowestScoreText = actionPlan.lowestScoreItems
    .map((item) => `- ${item.title}: ${item.score}%`)
    .join("\n");

  const criticalRiskText = actionPlan.criticalRiskItems
    .map((item) => `- ${item.title}`)
    .join("\n");

  const recommendedStepsText = actionPlan.recommendedNextSteps
    .map((step) => `- ${step}`)
    .join("\n");

  return `CIERRE TÉCNICO CONCEPTUAL — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

READINESS GENERAL
Score promedio: ${summary.averageScore}%
Clasificación: ${summary.classification.label}
Descripción: ${summary.classification.description}

RESUMEN
Áreas evaluadas: ${summary.total}
Conceptualmente listas: ${summary.conceptualReady}
Listas en prototipo: ${summary.prototypeReady}
Requieren backend real: ${summary.requiresBackend}
Requieren revisión: ${summary.requiresReview}
Futuras: ${summary.future}
Riesgo crítico: ${summary.criticalRisk}
Riesgo alto: ${summary.highRisk}

ÁREAS DE MENOR SCORE
${lowestScoreText || "- Sin áreas disponibles"}

ÁREAS DE RIESGO CRÍTICO
${criticalRiskText || "- Sin áreas críticas"}

PLAN DE ACCIÓN RECOMENDADO
${recommendedStepsText}

DETALLE DE ÁREAS
${itemsText}

CIERRE BLOQUE 0I
El bloque 0I deja preparada una base conceptual avanzada para arquitectura productiva, datos, roles, APIs, privacidad, seguridad, observabilidad, QA, ambientes y readiness. Aún no representa producción real.

NOTA
Este cierre es conceptual. No certifica producción real, no ejecuta auditorías, no despliega la app, no crea backend y no reemplaza revisión técnica, legal o de ciberseguridad profesional.`;
}

