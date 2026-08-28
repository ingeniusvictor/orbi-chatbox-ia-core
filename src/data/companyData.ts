// ORBI ChatBox IA Core — Company & Chat Data



export interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
}

export type CustomerType =
  | "general_query"
  | "interested_client"
  | "company_lead"
  | "potential_investor"
  | "support_case"
  | "urgent_human_contact"
  | "irrelevant_or_spam";

export type CompanyService = {
  id: string;
  name: string;
  description: string;
  keywords: string[];
};

export type HumanContact = {
  id: string;
  name: string;
  role: string;
  phone?: string;
  email?: string;
  preferredChannel: "whatsapp" | "email" | "phone" | "internal";
};

export type CompanyProfile = {
  id: string;
  companyName: string;
  brandName: string;
  shortDescription: string;
  longDescription: string;
  industry: string;
  country: string;
  city?: string;
  website?: string;
  publicEmail?: string;
  publicPhone?: string;
  defaultLanguage: "es" | "en";
  assistantName: string;
  assistantTone: "professional" | "friendly" | "technical" | "premium";
  welcomeMessage: string;
  services: CompanyService[];
  humanContacts: HumanContact[];
  businessHoursNote: string;
  privacyNote: string;
};

export const CUSTOMER_TYPE_LABELS: Record<CustomerType, string> = {
  general_query: "Consulta general",
  interested_client: "Cliente interesado",
  company_lead: "Empresa interesada",
  potential_investor: "Potencial inversionista",
  support_case: "Soporte o postventa",
  urgent_human_contact: "Requiere contacto humano",
  irrelevant_or_spam: "Irrelevante o spam",
};

export type OrbiService =
  | "orbi_ecosystem_general"
  | "orbi_corporate_assistant"
  | "orbi_geo"
  | "orbi_media_core"
  | "orbi_docs_ia"
  | "orbi_capture_pulse"
  | "orbi_games"
  | "investment_or_partnership"
  | "unknown";

export type DetectedServiceResult = {
  serviceInterest: OrbiService;
  customServiceId?: string;
  customServiceName?: string;
  confidence: "low" | "medium" | "high";
};

export const ORBI_SERVICE_LABELS: Record<OrbiService, string> = {
  orbi_ecosystem_general: "Información general de ORBI Ecosystem",
  orbi_corporate_assistant: "ORBI Corporate Assistant",
  orbi_geo: "ORBI GEO",
  orbi_media_core: "ORBI Media Core IA",
  orbi_docs_ia: "ORBI Docs IA",
  orbi_capture_pulse: "ORBI Capture Pulse",
  orbi_games: "Videojuegos ORBI",
  investment_or_partnership: "Inversión o alianza",
  unknown: "Servicio no identificado",
};

export type LeadPriority = "low" | "medium" | "high" | "critical";

export const PRIORITY_LABELS: Record<LeadPriority, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  critical: "Crítica",
};

export type LeadAnalysis = {
  customerType: CustomerType;
  serviceInterest: OrbiService;
  customServiceId?: string;
  customServiceName?: string;
  serviceDetectionConfidence?: "low" | "medium" | "high";
  priority: LeadPriority;
  needsHumanContact: boolean;
  mainNeed: string;
  aiSummary: string;
  recommendedAction: string;
};

export type ChatChannel = "web_demo" | "whatsapp_future" | "manual_test";

export const CHAT_CHANNEL_LABELS: Record<ChatChannel, string> = {
  web_demo: "Web Demo",
  whatsapp_future: "WhatsApp Futuro",
  manual_test: "Prueba Manual",
};

export function getChatChannelDescription(channel: ChatChannel): string {
  switch (channel) {
    case "web_demo":
      return "Canal usado para conversaciones desde el widget web simulado.";
    case "whatsapp_future":
      return "Canal reservado para una futura conexión con WhatsApp Business. Actualmente funciona solo como simulación local.";
    case "manual_test":
      return "Canal usado para pruebas internas manuales dentro del panel administrativo.";
    default:
      return "Canal conversacional no identificado.";
  }
}

export type ChatMessage = Message;

export type InterfaceMode = "full_app" | "web_widget";

export const INTERFACE_MODE_LABELS: Record<InterfaceMode, string> = {
  full_app: "App completa",
  web_widget: "Widget web",
};


export type ContactExtraction = {
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerCompany?: string;
  preferredContactMethod?: string;
  urgencyHint?: string;
};

export type LeadRecord = LeadAnalysis & {
  id: string;
  createdAt: string;
  channel: ChatChannel;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerCompany?: string;
  preferredContactMethod?: string;
  urgencyHint?: string;
  sourceMessage: string;
  conversation: ChatMessage[];
};

export function createLeadId(): string {
  return `lead-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function buildLeadRecord(params: {
  sourceMessage: string;
  conversation: ChatMessage[];
  analysis: LeadAnalysis;
  channel?: ChatChannel;
  contactData?: ContactExtraction;
}): LeadRecord {
  return {
    id: createLeadId(),
    createdAt: new Date().toLocaleString(),
    channel: params.channel ?? "web_demo",
    sourceMessage: params.sourceMessage,
    conversation: params.conversation,
    ...params.analysis,
    ...params.contactData,
  };
}

export const EMPTY_ANALYSIS: LeadAnalysis = {
  customerType: "general_query",
  serviceInterest: "unknown",
  priority: "low",
  needsHumanContact: false,
  mainNeed: "Pendiente",
  aiSummary: "Pendiente",
  recommendedAction: "Pendiente",
};

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function extractEmail(text: string): string | undefined {
  const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return emailMatch?.[0];
}

export function extractPhone(text: string): string | undefined {
  const phoneMatch = text.match(/(\+?\d[\d\s\-().]{7,}\d)/);
  return phoneMatch?.[0]?.trim();
}

export function extractCompany(text: string): string | undefined {
  const normalized = normalizeText(text);

  const companyPatterns = [
    /empresa\s+([a-zA-Z0-9ÁÉÍÓÚáéíóúÑñ .&-]{2,60})/i,
    /somos\s+([a-zA-Z0-9ÁÉÍÓÚáéíóúÑñ .&-]{2,60})/i,
    /trabajo en\s+([a-zA-Z0-9ÁÉÍÓÚáéíóúÑñ .&-]{2,60})/i,
    /represento a\s+([a-zA-Z0-9ÁÉÍÓÚáéíóúÑñ .&-]{2,60})/i,
  ];

  for (const pattern of companyPatterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      return match[1].trim();
    }
  }

  if (normalized.includes("empresa")) {
    return "Empresa mencionada, nombre no especificado";
  }

  return undefined;
}

export function extractName(text: string): string | undefined {
  const patterns = [
    /mi nombre es\s+([a-zA-ZÁÉÍÓÚáéíóúÑñ ]{2,50})/i,
    /me llamo\s+([a-zA-ZÁÉÍÓÚáéíóúÑñ ]{2,50})/i,
    /soy\s+([a-zA-ZÁÉÍÓÚáéíóúÑñ ]{2,50})/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return undefined;
}

export function extractPreferredContactMethod(text: string): string | undefined {
  const msg = normalizeText(text);

  if (msg.includes("whatsapp")) return "WhatsApp";
  if (msg.includes("correo") || msg.includes("email") || msg.includes("mail")) return "Correo electrónico";
  if (msg.includes("telefono") || msg.includes("llamada") || msg.includes("llamar")) return "Llamada telefónica";
  if (msg.includes("reunion") || msg.includes("meet") || msg.includes("zoom")) return "Reunión";

  return undefined;
}

export function extractUrgencyHint(text: string): string | undefined {
  const msg = normalizeText(text);

  if (msg.includes("urgente") || msg.includes("hoy") || msg.includes("lo antes posible")) {
    return "Alta urgencia declarada por el cliente";
  }

  if (msg.includes("esta semana") || msg.includes("pronto")) {
    return "Urgencia media";
  }

  if (msg.includes("cuando puedan") || msg.includes("sin apuro")) {
    return "Baja urgencia";
  }

  return undefined;
}

export function extractContactData(text: string): ContactExtraction {
  return {
    customerName: extractName(text),
    customerPhone: extractPhone(text),
    customerEmail: extractEmail(text),
    customerCompany: extractCompany(text),
    preferredContactMethod: extractPreferredContactMethod(text),
    urgencyHint: extractUrgencyHint(text),
  };
}

export function buildHumanHandoffText(record: LeadRecord, profile?: CompanyProfile): string {
  const brandName = profile?.brandName || "ORBI ChatBox IA Core";
  const assistantName = profile?.assistantName || "ORBI ChatBox IA Core";

  const humanContactsText =
    !profile || !profile.humanContacts || profile.humanContacts.length === 0
      ? "No hay contactos humanos configurados."
      : profile.humanContacts
          .map((contact, index) => {
            return `${index + 1}. ${contact.name} — ${contact.role}
Canal preferido: ${formatPreferredChannel(contact.preferredChannel)}
Teléfono: ${contact.phone || "No configurado"}
Correo: ${contact.email || "No configurado"}`;
          })
          .join("\n\n");

  return `🚨 NUEVO CONTACTO PARA ATENCIÓN HUMANA — ${brandName.toUpperCase()}

Fecha:
${record.createdAt}

Canal:
${record.channel}

Tipo de cliente:
${CUSTOMER_TYPE_LABELS[record.customerType] || record.customerType}

Prioridad:
${PRIORITY_LABELS[record.priority] || record.priority}

Servicio de interés:
${record.customServiceName ?? ORBI_SERVICE_LABELS[record.serviceInterest] ?? record.serviceInterest}

Requiere contacto humano:
${record.needsHumanContact ? "Sí" : "No"}

DATOS DETECTADOS
Nombre:
${record.customerName ?? "No detectado"}

Empresa:
${record.customerCompany ?? "No detectado"}

Teléfono:
${record.customerPhone ?? "No detectado"}

Correo:
${record.customerEmail ?? "No detectado"}

Medio preferido:
${record.preferredContactMethod ?? "No detectado"}

Urgencia:
${record.urgencyHint ?? "No detectado"}

NECESIDAD PRINCIPAL
${record.mainNeed}

RESUMEN IA
${record.aiSummary}

ACCIÓN RECOMENDADA
${record.recommendedAction}

CONTACTOS INTERNOS CONFIGURADOS
${humanContactsText}

MENSAJE ORIGINAL DEL CLIENTE
"${record.sourceMessage}"

Nota:
Este resumen fue generado automáticamente por ${assistantName} desde la conversación registrada localmente.`;
}

export function shouldCreateHumanHandoff(record: LeadRecord): boolean {
  return record.needsHumanContact || record.priority === "critical";
}

export function countKeywordMatches(message: string, keywords: string[]): number {
  const normalizedMessage = normalizeText(message);

  return keywords.reduce((count, keyword) => {
    const normalizedKeyword = normalizeText(keyword);

    if (!normalizedKeyword) {
      return count;
    }

    return normalizedMessage.includes(normalizedKeyword) ? count + 1 : count;
  }, 0);
}

export function detectCompanyConfiguredService(
  message: string,
  profile: CompanyProfile
): DetectedServiceResult {
  if (!profile.services || profile.services.length === 0) {
    return {
      serviceInterest: "unknown",
      confidence: "low",
    };
  }

  const normalizedMessage = normalizeText(message);

  let bestMatch: {
    service: CompanyService;
    score: number;
  } | null = null;

  for (const service of profile.services) {
    const serviceNameMatch = normalizedMessage.includes(
      normalizeText(service.name)
    )
      ? 3
      : 0;

    const keywordMatches = countKeywordMatches(message, service.keywords);

    const descriptionWords = normalizeText(service.description)
      .split(" ")
      .filter((word) => word.length > 5);

    const descriptionMatches = descriptionWords.reduce((count, word) => {
      return normalizedMessage.includes(word) ? count + 1 : count;
    }, 0);

    const score = serviceNameMatch + keywordMatches * 2 + descriptionMatches;

    if (!bestMatch || score > bestMatch.score) {
      bestMatch = {
        service,
        score,
      };
    }
  }

  if (!bestMatch || bestMatch.score <= 0) {
    return {
      serviceInterest: "unknown",
      confidence: "low",
    };
  }

  const confidence =
    bestMatch.score >= 5 ? "high" : bestMatch.score >= 2 ? "medium" : "low";

  return {
    serviceInterest: "unknown",
    customServiceId: bestMatch.service.id,
    customServiceName: bestMatch.service.name,
    confidence,
  };
}

export function detectServiceSmart(
  message: string,
  profile: CompanyProfile
): DetectedServiceResult {
  const configuredService = detectCompanyConfiguredService(message, profile);

  if (configuredService.customServiceId) {
    return configuredService;
  }

  const fallbackService = detectService(message);

  return {
    serviceInterest: fallbackService,
    confidence: fallbackService === "unknown" ? "low" : "medium",
  };
}

export function getDisplayServiceName(
  analysis: LeadAnalysis,
  profile: CompanyProfile
): string {
  if (analysis.customServiceName) {
    return analysis.customServiceName;
  }

  return ORBI_SERVICE_LABELS[analysis.serviceInterest] ?? "Servicio no identificado";
}

export function formatConfidenceLabel(
  confidence?: "low" | "medium" | "high"
): string {
  switch (confidence) {
    case "high":
      return "Alta";
    case "medium":
      return "Media";
    case "low":
      return "Baja";
    default:
      return "Pendiente";
  }
}

export function getRecordServiceDisplayName(record: LeadRecord): string {
  return record.customServiceName ?? ORBI_SERVICE_LABELS[record.serviceInterest] ?? "Servicio no identificado";
}

export function detectService(message: string): OrbiService {
  const msg = normalizeText(message);

  if (
    msg.includes("geo") ||
    msg.includes("terreno") ||
    msg.includes("foto georreferenciada") ||
    msg.includes("fotos georreferenciadas")
  ) {
    return "orbi_geo";
  }

  if (
    msg.includes("corporate") ||
    msg.includes("oficina") ||
    msg.includes("gestion empresarial") ||
    msg.includes("empresa")
  ) {
    return "orbi_corporate_assistant";
  }

  if (
    msg.includes("video") ||
    msg.includes("subtitulo") ||
    msg.includes("media") ||
    msg.includes("traduccion") ||
    msg.includes("unir videos")
  ) {
    return "orbi_media_core";
  }

  if (
    msg.includes("documento") ||
    msg.includes("pdf") ||
    msg.includes("word") ||
    msg.includes("docs")
  ) {
    return "orbi_docs_ia";
  }

  if (
    msg.includes("capture") ||
    msg.includes("captura") ||
    msg.includes("pantalla") ||
    msg.includes("grabar pantalla")
  ) {
    return "orbi_capture_pulse";
  }

  if (
    msg.includes("juego") ||
    msg.includes("videojuego") ||
    msg.includes("guardianes") ||
    msg.includes("orbi games")
  ) {
    return "orbi_games";
  }

  if (
    msg.includes("invertir") ||
    msg.includes("inversion") ||
    msg.includes("socio") ||
    msg.includes("alianza") ||
    msg.includes("capital")
  ) {
    return "investment_or_partnership";
  }

  if (msg.includes("orbi")) {
    return "orbi_ecosystem_general";
  }

  return "unknown";
}

export function analyzeCustomerMessage(
  message: string,
  profile: CompanyProfile
): LeadAnalysis {
  const msg = normalizeText(message);
  const detectedService = detectServiceSmart(message, profile);
  const serviceInterest = detectedService.serviceInterest;

  const serviceDetectionFields = {
    customServiceId: detectedService.customServiceId,
    customServiceName: detectedService.customServiceName,
    serviceDetectionConfidence: detectedService.confidence,
  };

  if (
    msg.includes("invertir") ||
    msg.includes("inversion") ||
    msg.includes("socio") ||
    msg.includes("alianza") ||
    msg.includes("capital")
  ) {
    return {
      customerType: "potential_investor",
      serviceInterest: "investment_or_partnership",
      ...serviceDetectionFields,
      priority: "critical",
      needsHumanContact: true,
      mainNeed: "El contacto muestra interés en inversión, sociedad o alianza estratégica.",
      aiSummary: "Potencial inversionista o aliado estratégico interesado en ORBI Ecosystem.",
      recommendedAction:
        "Derivar al equipo fundador y solicitar datos de contacto, perfil de inversión y tipo de alianza.",
    };
  }

  if (
    msg.includes("hablar con alguien") ||
    msg.includes("contacto directo") ||
    msg.includes("llamar") ||
    msg.includes("reunion") ||
    msg.includes("urgente") ||
    msg.includes("contactarme")
  ) {
    return {
      customerType: "urgent_human_contact",
      serviceInterest,
      ...serviceDetectionFields,
      priority: "critical",
      needsHumanContact: true,
      mainNeed: "El contacto solicita comunicación directa con una persona del equipo.",
      aiSummary: "Cliente requiere atención humana directa.",
      recommendedAction:
        "Solicitar nombre, teléfono, correo, motivo de contacto y horario preferido.",
    };
  }

  if (
    msg.includes("precio") ||
    msg.includes("cuanto cuesta") ||
    msg.includes("contratar") ||
    msg.includes("demo") ||
    msg.includes("comprar") ||
    msg.includes("servicio") ||
    msg.includes("cotizacion") ||
    msg.includes("cotizar")
  ) {
    return {
      customerType: "interested_client",
      serviceInterest,
      ...serviceDetectionFields,
      priority: "high",
      needsHumanContact: true,
      mainNeed: "El contacto está evaluando contratar o conocer un servicio.",
      aiSummary: detectedService.customServiceName
        ? `Cliente interesado comercialmente en el servicio ${detectedService.customServiceName}.`
        : "Cliente interesado comercialmente en una solución de la empresa.",
      recommendedAction:
        "Explicar cartera de servicios, pedir datos de contacto y ofrecer reunión o demo.",
    };
  }

  if (
    msg.includes("somos una empresa") ||
    msg.includes("empresa") ||
    msg.includes("automatizar") ||
    msg.includes("plataforma") ||
    msg.includes("necesitamos") ||
    msg.includes("solucion") ||
    msg.includes("proceso interno") ||
    msg.includes("procesos internos")
  ) {
    return {
      customerType: "company_lead",
      serviceInterest,
      ...serviceDetectionFields,
      priority: "high",
      needsHumanContact: true,
      mainNeed: "Una empresa busca solución, plataforma o automatización.",
      aiSummary: detectedService.customServiceName
        ? `Lead empresarial con interés en el servicio ${detectedService.customServiceName}.`
        : "Lead empresarial con posible necesidad de solución personalizada.",
      recommendedAction:
        "Solicitar nombre de empresa, rubro, problema principal y persona responsable.",
    };
  }

  if (
    msg.includes("falla") ||
    msg.includes("problema") ||
    msg.includes("soporte") ||
    msg.includes("no funciona") ||
    msg.includes("ayuda tecnica") ||
    msg.includes("error")
  ) {
    return {
      customerType: "support_case",
      serviceInterest,
      ...serviceDetectionFields,
      priority: "high",
      needsHumanContact: true,
      mainNeed: "El contacto reporta un problema o necesidad de soporte.",
      aiSummary: detectedService.customServiceName
        ? `Caso de soporte o postventa relacionado con ${detectedService.customServiceName}.`
        : "Caso de soporte o postventa.",
      recommendedAction:
        "Pedir datos del caso, servicio afectado, urgencia y contacto.",
    };
  }

  if (
    msg.includes("que hacen") ||
    msg.includes("quienes son") ||
    msg.includes("informacion") ||
    msg.includes("orbi ecosystem") ||
    msg.includes("que es orbi")
  ) {
    return {
      customerType: "general_query",
      serviceInterest:
        serviceInterest === "unknown"
          ? "orbi_ecosystem_general"
          : serviceInterest,
      ...serviceDetectionFields,
      priority: "medium",
      needsHumanContact: false,
      mainNeed: "El contacto solicita información general.",
      aiSummary: detectedService.customServiceName
        ? `Consulta general relacionada con ${detectedService.customServiceName}.`
        : "Consulta general sobre ORBI Ecosystem o sus servicios.",
      recommendedAction:
        "Responder presentación breve y ofrecer menú de servicios.",
    };
  }

  if (msg.length < 4) {
    return {
      customerType: "irrelevant_or_spam",
      serviceInterest: "unknown",
      ...serviceDetectionFields,
      priority: "low",
      needsHumanContact: false,
      mainNeed: "Mensaje demasiado corto o sin intención clara.",
      aiSummary: "Mensaje sin información suficiente.",
      recommendedAction:
        "Pedir que indique cómo se le puede ayudar.",
    };
  }

  return {
    customerType: "general_query",
    serviceInterest,
    ...serviceDetectionFields,
    priority: "low",
    needsHumanContact: false,
    mainNeed: "El mensaje requiere más información para clasificar correctamente.",
    aiSummary: "Consulta inicial sin suficientes datos.",
    recommendedAction:
      "Responder de forma amable y pedir más detalles.",
  };
}

export function formatCompanyServices(profile: CompanyProfile): string {
  if (!profile.services || profile.services.length === 0) {
    return "Por ahora no hay servicios configurados.";
  }

  return profile.services
    .map((service, index) => {
      return `${index + 1}. ${service.name}: ${service.description}`;
    })
    .join("\n");
}

export function formatPublicContactInfo(profile: CompanyProfile): string {
  const contactLines: string[] = [];

  if (profile.publicPhone) {
    contactLines.push(`Teléfono: ${profile.publicPhone}`);
  }

  if (profile.publicEmail) {
    contactLines.push(`Correo: ${profile.publicEmail}`);
  }

  if (profile.website) {
    contactLines.push(`Sitio web: ${profile.website}`);
  }

  if (contactLines.length === 0) {
    return "Los datos de contacto público todavía no han sido configurados.";
  }

  return contactLines.join("\n");
}

export function getToneInstruction(profile: CompanyProfile): string {
  switch (profile.assistantTone) {
    case "friendly":
      return "Usa un tono cercano, claro y amable.";
    case "technical":
      return "Usa un tono técnico, preciso y orientado a soluciones.";
    case "premium":
      return "Usa un tono elegante, profesional y de alta calidad.";
    case "professional":
    default:
      return "Usa un tono profesional, claro y ordenado.";
  }
}

export function generateAssistantReply(
  analysis: LeadAnalysis,
  profile: CompanyProfile
): string {
  const brandName = profile.brandName;
  const assistantName = profile.assistantName;
  const servicesText = formatCompanyServices(profile);
  const publicContactInfo = formatPublicContactInfo(profile);
  const toneInstruction = getToneInstruction(profile);

  switch (analysis.customerType) {
    case "potential_investor":
      return `Gracias por tu interés en ${brandName}.

Tu mensaje será marcado como contacto prioritario para revisión directa del equipo responsable.

${profile.shortDescription}

Para preparar mejor la información, indícame por favor:

1. Nombre.
2. Empresa o perfil de inversión.
3. País o ciudad.
4. Tipo de interés: inversión, alianza, sociedad o mentoría.
5. Medio preferido de contacto.

Datos públicos disponibles:
${publicContactInfo}

${toneInstruction}`;

    case "urgent_human_contact":
      return `Puedo ayudarte a derivar tu solicitud a una persona del equipo de ${brandName}.

Para preparar un resumen claro, indícame por favor:

1. Nombre.
2. Motivo de contacto.
3. Teléfono o correo.
4. Horario preferido.
5. Nivel de urgencia.

Horario o nota de atención:
${profile.businessHoursNote}

${toneInstruction}`;

    case "interested_client":
      return `Gracias por tu interés en ${brandName}.

Para orientarte mejor, ¿podrías indicarme qué tipo de solución estás buscando?

Actualmente estos son los servicios configurados:

${servicesText}

También puedo ayudarte a organizar tu solicitud para una futura reunión, cotización o demo.

${toneInstruction}`;

    case "company_lead":
      return `Perfecto, ${brandName} puede ayudarte a evaluar una solución para tu empresa.

Para organizar mejor tu solicitud, indícame por favor:

1. Nombre de la empresa.
2. Rubro o área de trabajo.
3. Problema o necesidad principal.
4. Servicio que te interesa.
5. Nombre y cargo de la persona de contacto.
6. Correo o teléfono de contacto.

Resumen de ${brandName}:
${profile.shortDescription}

${toneInstruction}`;

    case "support_case":
      return `Entiendo. Para ayudarte con soporte relacionado con ${brandName}, necesito algunos datos:

1. Nombre.
2. Empresa.
3. Servicio o producto relacionado.
4. Descripción breve del problema.
5. Nivel de urgencia.
6. Número o correo de contacto.

Nota de atención:
${profile.businessHoursNote}

${toneInstruction}`;

    case "irrelevant_or_spam":
      return `Hola, soy ${assistantName}.

Para ayudarte mejor, por favor indícame qué necesitas consultar sobre ${brandName}, sus servicios, una posible solución para tu empresa o una solicitud de contacto.`;

    case "general_query":
    default:
      return `Hola, gracias por contactar a ${brandName}.

${profile.shortDescription}

Puedo ayudarte con información sobre:

${servicesText}

También puedo orientarte para contactar al equipo si necesitas atención directa.

Datos públicos disponibles:
${publicContactInfo}

${toneInstruction}`;
  }
}

export const ORBI_LEADS_STORAGE_KEY = "orbi_chatbox_ia_core_leads";

export function loadStoredLeads(): LeadRecord[] {
  try {
    const rawData = localStorage.getItem(ORBI_LEADS_STORAGE_KEY);

    if (!rawData) {
      return [];
    }

    const parsedData = JSON.parse(rawData);

    if (!Array.isArray(parsedData)) {
      return [];
    }

    return parsedData as LeadRecord[];
  } catch (error) {
    console.error("Error loading ORBI lead records:", error);
    return [];
  }
}

export function saveStoredLeads(records: LeadRecord[]): void {
  try {
    localStorage.setItem(ORBI_LEADS_STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.error("Error saving ORBI lead records:", error);
  }
}

export function appendLeadRecord(record: LeadRecord): LeadRecord[] {
  const previousRecords = loadStoredLeads();
  const updatedRecords = [record, ...previousRecords];

  saveStoredLeads(updatedRecords);

  return updatedRecords;
}

export function clearStoredLeads(): void {
  try {
    localStorage.removeItem(ORBI_LEADS_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing ORBI lead records:", error);
  }
}

// types moved to top

export const DEFAULT_ORBI_COMPANY_PROFILE: CompanyProfile = {
  id: "orbi-ecosystem-default",
  companyName: "ORBI Ecosystem",
  brandName: "ORBI Ecosystem",
  shortDescription:
    "Ecosistema tecnológico enfocado en soluciones inteligentes con IA para empresas, operaciones técnicas, documentación, multimedia y automatización.",
  longDescription:
    "ORBI Ecosystem desarrolla herramientas digitales inteligentes orientadas a resolver necesidades reales de empresas, equipos técnicos y usuarios. Su visión integra asistentes IA, automatización, documentación inteligente, soluciones para terreno, multimedia, videojuegos educativos y plataformas adaptables para distintos sectores.",
  industry: "Tecnología, inteligencia artificial, automatización y soluciones digitales",
  country: "Chile",
  city: "Rancagua",
  website: "",
  publicEmail: "",
  publicPhone: "",
  defaultLanguage: "es",
  assistantName: "ORBI ChatBox IA Core",
  assistantTone: "professional",
  welcomeMessage:
    "Hola, soy ORBI ChatBox IA Core. Puedo ayudarte con información sobre ORBI Ecosystem, servicios, inversión, soporte o contacto directo.",
  services: [
    {
      id: "orbi-corporate-assistant",
      name: "ORBI Corporate Assistant",
      description:
        "Asistente corporativo inteligente para gestión interna, documentos, operaciones, organización empresarial y soporte a procesos.",
      keywords: ["corporate", "empresa", "oficina", "gestion", "procesos", "automatizacion"],
    },
    {
      id: "orbi-geo",
      name: "ORBI GEO",
      description:
        "Herramienta para terreno orientada a fotos georreferenciadas, inspecciones, evidencia técnica y organización de registros desde dispositivos móviles.",
      keywords: ["geo", "terreno", "foto", "georreferenciada", "inspeccion", "movil"],
    },
    {
      id: "orbi-media-core",
      name: "ORBI Media Core IA",
      description:
        "Sistema multimedia inteligente para videos, subtítulos, traducción, organización de clips y flujos creativos.",
      keywords: ["video", "subtitulo", "traduccion", "media", "clip", "audio"],
    },
    {
      id: "orbi-docs-ia",
      name: "ORBI Docs IA",
      description:
        "Biblioteca y asistente documental para organizar, resumir, analizar y estructurar documentos.",
      keywords: ["documento", "pdf", "word", "docs", "archivo", "biblioteca"],
    },
    {
      id: "orbi-capture-pulse",
      name: "ORBI Capture Pulse",
      description:
        "Herramienta para captura, registro visual, documentación de pantalla y apoyo a flujos de evidencia digital.",
      keywords: ["capture", "captura", "pantalla", "registro", "evidencia"],
    },
    {
      id: "orbi-games",
      name: "Videojuegos ORBI",
      description:
        "Línea creativa de videojuegos, experiencias interactivas y universos digitales del ecosistema ORBI.",
      keywords: ["juego", "videojuego", "guardianes", "orbi games", "multiverso"],
    },
  ],
  humanContacts: [
    {
      id: "founder-contact",
      name: "Equipo fundador ORBI",
      role: "Contacto principal",
      phone: "",
      email: "",
      preferredChannel: "whatsapp",
    },
  ],
  businessHoursNote:
    "Horario de atención configurable. En esta fase de prototipo, los horarios deben ser definidos por el administrador.",
  privacyNote:
    "Los datos entregados por los clientes se usan para responder consultas, organizar solicitudes y preparar derivaciones internas. En esta fase se almacenan localmente en el navegador.",
};

export const ORBI_COMPANY_PROFILE_STORAGE_KEY = "orbi_chatbox_ia_core_company_profile";

export function loadStoredCompanyProfile(): CompanyProfile {
  try {
    const rawData = localStorage.getItem(ORBI_COMPANY_PROFILE_STORAGE_KEY);

    if (!rawData) {
      return DEFAULT_ORBI_COMPANY_PROFILE;
    }

    const parsedData = JSON.parse(rawData) as Partial<CompanyProfile>;

    return {
      ...DEFAULT_ORBI_COMPANY_PROFILE,
      ...parsedData,
      services: parsedData.services ?? DEFAULT_ORBI_COMPANY_PROFILE.services,
      humanContacts:
        parsedData.humanContacts ?? DEFAULT_ORBI_COMPANY_PROFILE.humanContacts,
    };
  } catch (error) {
    console.error("Error loading ORBI company profile:", error);
    return DEFAULT_ORBI_COMPANY_PROFILE;
  }
}

export function saveStoredCompanyProfile(profile: CompanyProfile): void {
  try {
    localStorage.setItem(
      ORBI_COMPANY_PROFILE_STORAGE_KEY,
      JSON.stringify(profile)
    );
  } catch (error) {
    console.error("Error saving ORBI company profile:", error);
  }
}

export function clearStoredCompanyProfile(): void {
  try {
    localStorage.removeItem(ORBI_COMPANY_PROFILE_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing ORBI company profile:", error);
  }
}

export function createCompanyServiceId(): string {
  return `service-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createHumanContactId(): string {
  return `human-contact-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function formatPreferredChannel(
  channel: HumanContact["preferredChannel"]
): string {
  switch (channel) {
    case "whatsapp":
      return "WhatsApp";
    case "email":
      return "Correo";
    case "phone":
      return "Teléfono";
    case "internal":
      return "Interno";
    default:
      return "No definido";
  }
}

export function getInterfaceModeDescription(mode: InterfaceMode): string {
  switch (mode) {
    case "web_widget":
      return "Vista preparada para simular el comportamiento futuro del chatbox como widget instalable en una página web.";
    case "full_app":
    default:
      return "Vista completa de administración, análisis, configuración empresarial, leads y derivaciones.";
  }
}

export function buildSimulatedEmbedCode(profile: CompanyProfile): string {
  const safeCompanyId = profile.id || "company-profile-local";
  const safeBrandName = profile.brandName || "Empresa";

  return `<script
  src="https://cdn.orbi-ecosystem.com/orbi-chatbox-ia-core/widget.js"
  data-company-id="${safeCompanyId}"
  data-brand="${safeBrandName}"
  async>
</script>

<div
  id="orbi-chatbox-widget"
  data-company-id="${safeCompanyId}"
  data-mode="web-widget"
  data-language="${profile.defaultLanguage}">
</div>`;
}

export function buildAdvancedSimulatedEmbedCode(profile: CompanyProfile): string {
  const safeCompanyId = profile.id || "company-profile-local";
  const safeBrandName = profile.brandName || "Empresa";

  return `<!-- ORBI ChatBox IA Core — Widget Web -->
<script>
  window.ORBI_CHATBOX_CONFIG = {
    companyId: "${safeCompanyId}",
    brandName: "${safeBrandName}",
    assistantName: "${profile.assistantName}",
    language: "${profile.defaultLanguage}",
    mode: "web_widget",
    availability: "24/7",
    source: "website"
  };
</script>

<script
  src="https://cdn.orbi-ecosystem.com/orbi-chatbox-ia-core/widget.js"
  async>
</script>

<div id="orbi-chatbox-widget"></div>`;
}


export function parseKeywordsText(text: string): string[] {
  return text
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

export function formatKeywordsText(keywords: string[]): string {
  return keywords.join(", ");
}

