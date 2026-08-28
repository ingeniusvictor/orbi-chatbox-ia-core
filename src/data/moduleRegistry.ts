// ORBI ChatBox IA Core — Module Registry & MVP Scope Data
import {
  CompanyProfile, CompanyService, HumanContact, LeadAnalysis, Message, ORBI_SERVICE_LABELS
} from "./companyData";
import {
  SimulatedWhatsAppConversation, SuggestedReplyTone
} from "./demoData";

export type CommercialDemoAudience =
  | "client_company"
  | "partner"
  | "investor"
  | "internal_team";

export type CommercialDemoScenarioCategory =
  | "sales_lead"
  | "support_case"
  | "investment_pitch"
  | "technical_demo"
  | "widget_demo"
  | "whatsapp_future_demo";

export type CommercialDemoScenarioStatus = "ready" | "recommended" | "future";

export type CommercialDemoScenario = {
  id: string;
  title: string;
  audience: CommercialDemoAudience;
  category: CommercialDemoScenarioCategory;
  status: CommercialDemoScenarioStatus;
  durationMinutes: number;
  objective: string;
  demoMessage: string;
  expectedFocus: string[];
  presenterNotes: string[];
};

export type CommercialDemoGuidedStep = {
  id: string;
  title: string;
  order: number;
  estimatedMinutes: number;
  description: string;
  whatToShow: string[];
  speakerNotes: string[];
};

export const COMMERCIAL_DEMO_AUDIENCE_LABELS: Record<
  CommercialDemoAudience,
  string
> = {
  client_company: "Empresa cliente",
  partner: "Socio estratégico",
  investor: "Inversionista",
  internal_team: "Equipo interno",
};

export const COMMERCIAL_DEMO_SCENARIO_CATEGORY_LABELS: Record<
  CommercialDemoScenarioCategory,
  string
> = {
  sales_lead: "Lead comercial",
  support_case: "Caso de soporte",
  investment_pitch: "Pitch inversión",
  technical_demo: "Demo técnica",
  widget_demo: "Widget web",
  whatsapp_future_demo: "WhatsApp futuro",
};

export const COMMERCIAL_DEMO_SCENARIO_STATUS_LABELS: Record<
  CommercialDemoScenarioStatus,
  string
> = {
  ready: "Listo para demo",
  recommended: "Recomendado",
  future: "Fase futura",
};

export const COMMERCIAL_DEMO_SCENARIOS: CommercialDemoScenario[] = [
  {
    id: "demo-sales-company",
    title: "Empresa interesada en contratar ORBI",
    audience: "client_company",
    category: "sales_lead",
    status: "recommended",
    durationMinutes: 4,
    objective:
      "Mostrar cómo el chat detecta intención comercial, genera lead, prioriza y sugiere acción.",
    demoMessage:
      "Hola, somos una empresa de servicios técnicos y queremos saber si ORBI puede ayudarnos a atender clientes desde nuestra web y WhatsApp.",
    expectedFocus: [
      "Clasificación como empresa interesada.",
      "Detección de necesidad comercial.",
      "Generación de lead.",
      "Prioridad alta o crítica según contexto.",
      "Recomendación de contacto humano.",
    ],
    presenterNotes: [
      "Explicar que esta demo funciona localmente.",
      "Mostrar el panel de análisis IA después del mensaje.",
      "Mostrar cómo el lead aparece en la base local.",
      "Aclarar que WhatsApp real sería una integración futura.",
    ],
  },
  {
    id: "demo-support-case",
    title: "Cliente con solicitud de soporte",
    audience: "client_company",
    category: "support_case",
    status: "ready",
    durationMinutes: 3,
    objective:
      "Mostrar cómo ORBI diferencia una consulta comercial de un caso que requiere soporte o derivación humana.",
    demoMessage:
      "Hola, tengo un problema con un servicio contratado y necesito que alguien del equipo me contacte hoy.",
    expectedFocus: [
      "Detección de caso de soporte.",
      "Necesidad de contacto humano.",
      "Priorización por urgencia.",
      "Ficha de derivación humana.",
    ],
    presenterNotes: [
      "Mostrar la ficha de derivación humana.",
      "Explicar que el asistente no reemplaza al equipo humano.",
      "Reforzar la idea de compañero inteligente para atención.",
    ],
  },
  {
    id: "demo-investor-pitch",
    title: "Pitch para inversionista",
    audience: "investor",
    category: "investment_pitch",
    status: "recommended",
    durationMinutes: 5,
    objective:
      "Mostrar que ORBI ChatBox IA Core no es solo un chat, sino una base SaaS multiempresa con arquitectura, privacidad, seguridad y readiness.",
    demoMessage:
      "Soy inversionista y quiero entender qué tan preparado está ORBI ChatBox IA Core para convertirse en un producto SaaS.",
    expectedFocus: [
      "Resumen ejecutivo.",
      "Readiness Score.",
      "Modelo multiempresa.",
      "Contratos API conceptuales.",
      "Privacidad, seguridad y QA.",
    ],
    presenterNotes: [
      "Ir rápidamente al cierre técnico conceptual.",
      "Mostrar el Readiness Score.",
      "Explicar que el bloque 0I cerró la base productiva conceptual.",
      "No prometer producción real todavía.",
    ],
  },
  {
    id: "demo-widget-web",
    title: "Widget web para sitio empresarial",
    audience: "client_company",
    category: "widget_demo",
    status: "ready",
    durationMinutes: 4,
    objective:
      "Mostrar cómo se vería ORBI como asistente embebido en una página web empresarial.",
    demoMessage:
      "Hola, estoy visitando su página y quiero saber qué servicios ofrecen.",
    expectedFocus: [
      "Modo widget web.",
      "Botón flotante.",
      "Panel compacto.",
      "Mensaje de bienvenida.",
      "Simulación de atención 24/7.",
    ],
    presenterNotes: [
      "Cambiar a modo widget.",
      "Abrir y cerrar el panel compacto.",
      "Enviar mensaje desde el widget.",
      "Mostrar que es una simulación web segura.",
    ],
  },
  {
    id: "demo-technical-review",
    title: "Revisión técnica para equipo interno",
    audience: "internal_team",
    category: "technical_demo",
    status: "ready",
    durationMinutes: 6,
    objective:
      "Mostrar a un equipo técnico cómo está estructurada la base conceptual: datos, API, roles, seguridad, QA y despliegue.",
    demoMessage:
      "Necesito revisar técnicamente cómo está preparado ORBI ChatBox IA Core antes de convertirlo en backend real.",
    expectedFocus: [
      "Modelo de datos.",
      "Matriz de roles.",
      "Contratos API.",
      "Seguridad.",
      "Observabilidad.",
      "QA.",
      "Release checklist.",
    ],
    presenterNotes: [
      "Usar filtros técnicos por módulo.",
      "Copiar exportaciones conceptuales si se requiere.",
      "Explicar que cada bloque puede transformarse en tickets técnicos.",
    ],
  },
  {
    id: "demo-whatsapp-future",
    title: "WhatsApp Business futuro",
    audience: "partner",
    category: "whatsapp_future_demo",
    status: "future",
    durationMinutes: 3,
    objective:
      "Mostrar cómo se visualiza la futura integración WhatsApp sin conectar WhatsApp real.",
    demoMessage:
      "Hola, quiero consultar por WhatsApp si puedo cotizar un servicio con ustedes.",
    expectedFocus: [
      "Canal WhatsApp futuro.",
      "Bandeja simulada.",
      "Webhook conceptual.",
      "Payload simulado.",
      "Límites de integración real.",
    ],
    presenterNotes: [
      "Aclarar que no existe WhatsApp real conectado.",
      "Mostrar payload conceptual si corresponde.",
      "Explicar que requiere proveedor oficial y backend.",
    ],
  },
];

export const COMMERCIAL_DEMO_GUIDED_STEPS: CommercialDemoGuidedStep[] = [
  {
    id: "demo-step-hero",
    title: "Presentación inicial",
    order: 1,
    estimatedMinutes: 1,
    description:
      "Introducir ORBI ChatBox IA Core como asistente comercial inteligente adaptable a empresas.",
    whatToShow: [
      "Hero principal.",
      "Nombre de empresa activa.",
      "Estado demo/local.",
      "Simulador de chat.",
    ],
    speakerNotes: [
      "Explicar que es un prototipo avanzado local.",
      "Enfatizar que no usa datos reales ni conexiones externas.",
    ],
  },
  {
    id: "demo-step-chat",
    title: "Flujo de atención inteligente",
    order: 2,
    estimatedMinutes: 3,
    description:
      "Demostrar cómo un mensaje de cliente activa análisis, respuesta y clasificación.",
    whatToShow: [
      "Chat principal.",
      "Mensaje demo comercial.",
      "Respuesta del asistente.",
      "Panel de análisis IA.",
    ],
    speakerNotes: [
      "Usar uno de los mensajes sugeridos.",
      "Mostrar cómo cambia la prioridad y la necesidad detectada.",
    ],
  },
  {
    id: "demo-step-leads",
    title: "Lead y seguimiento comercial",
    order: 3,
    estimatedMinutes: 3,
    description:
      "Mostrar cómo la conversación se transforma en oportunidad comercial organizada.",
    whatToShow: [
      "Base local de leads.",
      "Resumen diario.",
      "Datos detectados.",
      "Derivación humana.",
    ],
    speakerNotes: [
      "Explicar que esto permite ordenar demanda comercial.",
      "Reforzar que no reemplaza al equipo humano.",
    ],
  },
  {
    id: "demo-step-widget",
    title: "Widget web",
    order: 4,
    estimatedMinutes: 2,
    description:
      "Mostrar cómo ORBI puede funcionar como burbuja de atención en una web empresarial.",
    whatToShow: [
      "Modo widget web.",
      "Botón flotante.",
      "Panel compacto.",
      "Vista previa de instalación.",
    ],
    speakerNotes: [
      "Explicar que el widget real requeriría backend y publicación.",
      "Mostrar que la experiencia visual ya está preparada.",
    ],
  },
  {
    id: "demo-step-readiness",
    title: "Preparación productiva conceptual",
    order: 5,
    estimatedMinutes: 3,
    description:
      "Mostrar que el producto tiene arquitectura, privacidad, seguridad, QA y roadmap técnico.",
    whatToShow: [
      "Readiness Score.",
      "Seguridad.",
      "Privacidad.",
      "QA.",
      "Contratos API.",
      "Release checklist.",
    ],
    speakerNotes: [
      "Este es el cierre fuerte para inversionistas o equipo técnico.",
      "Aclarar que aún no es producción real.",
    ],
  },
];

export function buildCommercialDemoSummary(scenarios: CommercialDemoScenario[]) {
  const total = scenarios.length;

  const ready = scenarios.filter((scenario) => scenario.status === "ready")
    .length;

  const recommended = scenarios.filter(
    (scenario) => scenario.status === "recommended"
  ).length;

  const future = scenarios.filter((scenario) => scenario.status === "future")
    .length;

  const totalMinutes = scenarios.reduce(
    (sum, scenario) => sum + scenario.durationMinutes,
    0
  );

  return {
    total,
    ready,
    recommended,
    future,
    totalMinutes,
  };
}

export type DemoReadinessCheckCategory =
  | "visual"
  | "data"
  | "flow"
  | "privacy"
  | "technical_scope"
  | "presentation";

export type DemoReadinessCheckStatus = "ready" | "review" | "important";

export type DemoReadinessCheckItem = {
  id: string;
  title: string;
  category: DemoReadinessCheckCategory;
  status: DemoReadinessCheckStatus;
  description: string;
  presenterAction: string;
};

export type DemoSafeProfile = {
  brandName: string;
  assistantName: string;
  demoIndustry: string;
  demoCountry: string;
  demoCity: string;
  demoDescription: string;
  safeNotice: string;
};

export const DEMO_READINESS_CATEGORY_LABELS: Record<
  DemoReadinessCheckCategory,
  string
> = {
  visual: "Visual",
  data: "Datos demo",
  flow: "Flujo de presentación",
  privacy: "Privacidad",
  technical_scope: "Alcance técnico",
  presentation: "Presentación",
};

export const DEMO_READINESS_STATUS_LABELS: Record<DemoReadinessCheckStatus, string> = {
  ready: "Listo",
  review: "Revisar",
  important: "Importante",
};

export const SAFE_COMMERCIAL_DEMO_PROFILE: DemoSafeProfile = {
  brandName: "Empresa Demo ORBI",
  assistantName: "Asistente Comercial IA",
  demoIndustry: "Servicios empresariales",
  demoCountry: "Chile",
  demoCity: "Santiago",
  demoDescription:
    "Perfil ficticio diseñado para mostrar ORBI ChatBox IA Core sin usar datos reales de clientes, empresas o contactos internos.",
  safeNotice:
    "Este perfil es solo visual y no reemplaza la configuración empresarial real del prototipo.",
};

export const DEMO_READINESS_CHECKLIST: DemoReadinessCheckItem[] = [
  {
    id: "demo-visual-ready",
    title: "Interfaz visual limpia",
    category: "visual",
    status: "ready",
    description:
      "La demo debe iniciar en una vista clara, sin secciones técnicas innecesarias abiertas.",
    presenterAction:
      "Abrir la app en modo completo y ubicar el panel de Demo Comercial Estable.",
  },
  {
    id: "demo-safe-data",
    title: "Usar solo datos ficticios",
    category: "data",
    status: "important",
    description:
      "La presentación no debe exponer datos reales de clientes, teléfonos, correos o conversaciones sensibles.",
    presenterAction:
      "Usar mensajes demo copiables y evitar mostrar información privada real.",
  },
  {
    id: "demo-main-flow",
    title: "Recorrido comercial definido",
    category: "flow",
    status: "ready",
    description:
      "El presentador debe seguir un recorrido simple: problema, chat, análisis IA, lead, widget y readiness.",
    presenterAction:
      "Usar el recorrido guiado de 5 pasos creado en la Parte A.",
  },
  {
    id: "demo-privacy-warning",
    title: "Aclarar alcance de privacidad",
    category: "privacy",
    status: "important",
    description:
      "Debe explicarse que los datos de la demo son ficticios y que la versión productiva requerirá revisión legal.",
    presenterAction:
      "Mostrar brevemente la nota de alcance y no prometer cumplimiento legal definitivo.",
  },
  {
    id: "demo-whatsapp-scope",
    title: "Aclarar WhatsApp Futuro",
    category: "technical_scope",
    status: "important",
    description:
      "La integración WhatsApp actualmente es conceptual y no debe presentarse como conectada realmente.",
    presenterAction:
      "Indicar que WhatsApp Business requerirá backend, proveedor oficial y validación de webhook.",
  },
  {
    id: "demo-no-production-claim",
    title: "No presentar como producción real",
    category: "technical_scope",
    status: "important",
    description:
      "ORBI ChatBox IA Core está en etapa de prototipo avanzado/demo conceptual.",
    presenterAction:
      "Usar frases como: prototipo avanzado, demo comercial, arquitectura preparada, no producción real.",
  },
  {
    id: "demo-copy-script",
    title: "Guion comercial preparado",
    category: "presentation",
    status: "ready",
    description:
      "Debe existir un guion breve para explicar la propuesta de valor sin improvisar demasiado.",
    presenterAction:
      "Copiar el guion comercial antes de iniciar la presentación.",
  },
];

export function buildDemoReadinessSummary(items: DemoReadinessCheckItem[]) {
  const total = items.length;

  const ready = items.filter((item) => item.status === "ready").length;

  const review = items.filter((item) => item.status === "review").length;

  const important = items.filter((item) => item.status === "important").length;

  const readinessPercent =
    total === 0 ? 0 : Math.round((ready / total) * 100);

  return {
    total,
    ready,
    review,
    important,
    readinessPercent,
  };
}

export function buildCommercialDemoScript(params: {
  profile: CompanyProfile;
  safeProfile: DemoSafeProfile;
  scenario: CommercialDemoScenario | undefined;
  guidedSteps: CommercialDemoGuidedStep[];
  readiness: ReturnType<typeof buildDemoReadinessSummary>;
}): string {
  const { profile, safeProfile, scenario, guidedSteps, readiness } = params;

  const guidedStepsText = guidedSteps
    .map((step) => {
      return `${step.order}. ${step.title} (${step.estimatedMinutes} min)
   - ${step.description}
   - Mostrar: ${step.whatToShow.join(", ")}`;
    })
    .join("\n");

  const scenarioText = scenario
    ? `ESCENARIO SELECCIONADO
${scenario.title}

Objetivo:
${scenario.objective}

Mensaje demo:
"${scenario.demoMessage}"

Puntos a demostrar:
${scenario.expectedFocus.map((item) => `- ${item}`).join("\n")}`
    : "No hay escenario seleccionado.";

  return `GUIÓN COMERCIAL DEMO — ORBI CHATBOX IA CORE

Empresa activa en prototipo:
${profile.brandName}

Perfil demo seguro sugerido:
${safeProfile.brandName}
Asistente: ${safeProfile.assistantName}
Industria: ${safeProfile.demoIndustry}
Ubicación: ${safeProfile.demoCity}, ${safeProfile.demoCountry}

APERTURA
Hoy voy a mostrar ORBI ChatBox IA Core, un prototipo avanzado de asistente comercial inteligente para empresas. Su objetivo es atender consultas desde web, clasificar intención, generar leads, apoyar derivación humana y preparar una futura operación multicanal.

ACLARACIÓN IMPORTANTE
Esta demo es conceptual y local. No usa backend real, no conecta WhatsApp real, no envía datos externos y no debe considerarse producción.

${scenarioText}

RECORRIDO SUGERIDO
${guidedStepsText}

CIERRE
La fortaleza de ORBI ChatBox IA Core no está solo en el chat visual, sino en la base conceptual que ya incorpora arquitectura, modelo de datos, roles, contratos API, privacidad, seguridad, observabilidad, QA, release y readiness productivo.

ESTADO DEMO
Ítems evaluados: ${readiness.total}
Listos: ${readiness.ready}
Importantes: ${readiness.important}
Readiness visual demo: ${readiness.readinessPercent}%

MENSAJE FINAL
ORBI ChatBox IA Core está preparado como demo comercial avanzada y base conceptual para evolucionar hacia un producto SaaS multiempresa, siempre dejando claro que la producción real requerirá backend, seguridad, revisión legal, monitoreo y despliegue formal.`;
}

export type CommercialStorylineSectionType =
  | "problem"
  | "opportunity"
  | "solution"
  | "value_proposition"
  | "business_benefits"
  | "investor_benefits"
  | "differentiators"
  | "closing_message";

export type CommercialStorylineAudience =
  | "client_company"
  | "partner"
  | "investor"
  | "internal_team";

export type CommercialStorylineSection = {
  id: string;
  title: string;
  type: CommercialStorylineSectionType;
  audience: CommercialStorylineAudience;
  headline: string;
  narrative: string;
  keyPoints: string[];
  presenterNotes: string[];
};

export const COMMERCIAL_STORYLINE_TYPE_LABELS: Record<
  CommercialStorylineSectionType,
  string
> = {
  problem: "Problema",
  opportunity: "Oportunidad",
  solution: "Solución",
  value_proposition: "Propuesta de valor",
  business_benefits: "Beneficios empresa",
  investor_benefits: "Beneficios inversionista",
  differentiators: "Diferenciadores",
  closing_message: "Cierre",
};

export const COMMERCIAL_STORYLINE_AUDIENCE_LABELS: Record<
  CommercialStorylineAudience,
  string
> = {
  client_company: "Empresa cliente",
  partner: "Socio estratégico",
  investor: "Inversionista",
  internal_team: "Equipo interno",
};

export const COMMERCIAL_STORYLINE_SECTIONS: CommercialStorylineSection[] = [
  {
    id: "story-problem",
    title: "El problema empresarial",
    type: "problem",
    audience: "client_company",
    headline: "Las empresas pierden oportunidades cuando no atienden bien sus canales digitales.",
    narrative:
      "Muchas empresas reciben consultas por web, WhatsApp, redes o correo, pero no siempre logran clasificarlas, priorizarlas o derivarlas a tiempo. Esto genera pérdida de leads, baja trazabilidad, respuestas inconsistentes y dependencia excesiva de atención manual.",
    keyPoints: [
      "Consultas comerciales dispersas.",
      "Leads que se pierden por falta de seguimiento.",
      "Dificultad para diferenciar urgencias, soporte y ventas.",
      "Poca trazabilidad de lo que pregunta el cliente.",
      "Equipos humanos saturados con mensajes repetitivos.",
    ],
    presenterNotes: [
      "Abrir con un problema fácil de entender.",
      "Evitar sonar demasiado técnico al inicio.",
      "Conectar con dolores reales: tiempo, seguimiento y oportunidad comercial.",
    ],
  },
  {
    id: "story-opportunity",
    title: "La oportunidad",
    type: "opportunity",
    audience: "partner",
    headline:
      "Un asistente IA comercial puede transformar conversaciones en oportunidades organizadas.",
    narrative:
      "La oportunidad no está solo en responder mensajes automáticamente. El verdadero valor está en convertir cada conversación en información útil: intención del cliente, prioridad, servicio de interés, datos de contacto, necesidad de derivación y métricas comerciales.",
    keyPoints: [
      "Cada conversación puede transformarse en un lead estructurado.",
      "La IA puede apoyar clasificación y priorización.",
      "La empresa obtiene información comercial más ordenada.",
      "El equipo humano recibe mejores fichas de derivación.",
      "El sistema puede escalar hacia web, WhatsApp y otros canales.",
    ],
    presenterNotes: [
      "Explicar que ORBI no reemplaza al equipo humano.",
      "Mostrar que la IA ordena y acelera el trabajo comercial.",
      "Conectar con el concepto de SaaS multiempresa.",
    ],
  },
  {
    id: "story-solution",
    title: "La solución ORBI",
    type: "solution",
    audience: "client_company",
    headline:
      "ORBI ChatBox IA Core centraliza atención, análisis comercial, leads y preparación multicanal.",
    narrative:
      "ORBI ChatBox IA Core es un prototipo avanzado de asistente comercial inteligente para empresas. Permite simular atención web, analizar mensajes, clasificar clientes, generar leads, sugerir derivaciones humanas, preparar reportes y proyectar una futura integración con WhatsApp Business.",
    keyPoints: [
      "Chat inteligente configurable por empresa.",
      "Análisis IA local del mensaje.",
      "Generación de leads y resumen comercial.",
      "Widget web visualmente preparado.",
      "Base conceptual para WhatsApp futuro.",
      "Módulos de privacidad, seguridad, QA y readiness.",
    ],
    presenterNotes: [
      "Mostrar primero el chat y luego el panel IA.",
      "Después mostrar leads y resumen diario.",
      "Cerrar con readiness para demostrar seriedad técnica.",
    ],
  },
  {
    id: "story-value-proposition",
    title: "Propuesta de valor",
    type: "value_proposition",
    audience: "client_company",
    headline:
      "ORBI ayuda a convertir mensajes desordenados en oportunidades comerciales accionables.",
    narrative:
      "La propuesta de valor de ORBI ChatBox IA Core es combinar atención inteligente, clasificación comercial, trazabilidad de leads y preparación técnica para escalar hacia una solución SaaS multiempresa.",
    keyPoints: [
      "Mejor seguimiento de clientes potenciales.",
      "Menos pérdida de oportunidades.",
      "Mayor orden comercial.",
      "Atención inicial más rápida.",
      "Derivación humana más informada.",
      "Base técnica preparada para evolución real.",
    ],
    presenterNotes: [
      "Usar esta sección como mensaje comercial principal.",
      "Ideal para clientes no técnicos.",
      "Relacionar beneficios con ahorro de tiempo y mejor atención.",
    ],
  },
  {
    id: "story-business-benefits",
    title: "Beneficios para empresas",
    type: "business_benefits",
    audience: "client_company",
    headline:
      "Las empresas ganan velocidad, orden y trazabilidad en su atención comercial.",
    narrative:
      "Para una empresa, ORBI ChatBox IA Core puede funcionar como una primera capa inteligente de atención, ayudando a capturar consultas, detectar intención, ordenar prioridades y entregar información útil al equipo humano.",
    keyPoints: [
      "Atención inicial 24/7 en modo futuro.",
      "Clasificación automática de consultas.",
      "Leads organizados por prioridad.",
      "Resumen diario comercial.",
      "Mejor experiencia para clientes.",
      "Menor carga operativa en preguntas repetitivas.",
    ],
    presenterNotes: [
      "Enfatizar que el humano sigue tomando decisiones importantes.",
      "No prometer automatización total.",
      "Mostrar el resumen diario y la ficha de derivación humana.",
    ],
  },
  {
    id: "story-investor-benefits",
    title: "Beneficios para inversionistas o socios",
    type: "investor_benefits",
    audience: "investor",
    headline:
      "ORBI ChatBox IA Core puede evolucionar hacia un SaaS configurable multiempresa.",
    narrative:
      "Desde una mirada de negocio, ORBI ChatBox IA Core no es solo un widget de chat. Es una base modular que ya contempla configuración empresarial, canales, leads, reportes, roles, contratos API, privacidad, seguridad, QA, despliegue y readiness.",
    keyPoints: [
      "Potencial SaaS multiempresa.",
      "Arquitectura conceptual ya ordenada.",
      "Demo comercial presentable.",
      "Módulos técnicos exportables a tickets futuros.",
      "Escalabilidad hacia web, WhatsApp y otros canales.",
      "Aplicable a múltiples industrias.",
    ],
    presenterNotes: [
      "Mostrar el Readiness Score.",
      "Explicar que aún requiere backend real.",
      "Enfatizar visión de producto, no solo prototipo visual.",
    ],
  },
  {
    id: "story-differentiators",
    title: "Diferenciadores ORBI",
    type: "differentiators",
    audience: "partner",
    headline:
      "ORBI combina experiencia comercial, arquitectura técnica y visión de ecosistema.",
    narrative:
      "La diferencia de ORBI está en que no se limita a responder mensajes. El sistema se está construyendo como parte de un ecosistema mayor, con visión de producto, módulos de gobernanza, preparación productiva y capacidad de adaptarse a distintas empresas.",
    keyPoints: [
      "No es solo chatbot: es sistema comercial inteligente.",
      "Incluye leads, reportes, QA y readiness.",
      "Pensado para multiempresa.",
      "Preparado para integraciones futuras.",
      "Forma parte del ecosistema ORBI.",
      "Diseñado con enfoque ejecutivo y técnico.",
    ],
    presenterNotes: [
      "Usar esta sección para diferenciarse de chatbots genéricos.",
      "Relacionar con ORBI Ecosystem si el público ya lo conoce.",
      "Evitar sobreexplicar módulos técnicos si el público es comercial.",
    ],
  },
  {
    id: "story-closing",
    title: "Mensaje de cierre",
    type: "closing_message",
    audience: "client_company",
    headline:
      "ORBI ChatBox IA Core está listo como demo comercial avanzada y base conceptual SaaS.",
    narrative:
      "El prototipo ya permite demostrar atención inteligente, generación de leads, widget web, reportes, propuesta comercial, QA, seguridad conceptual y readiness productivo. El siguiente paso natural es preparar una demo estable para validación con usuarios reales controlados y luego diseñar backend productivo.",
    keyPoints: [
      "Demo avanzada lista para presentación.",
      "Base conceptual sólida.",
      "No es producción real todavía.",
      "Requiere backend, seguridad real y revisión legal para escalar.",
      "Tiene potencial para convertirse en producto SaaS.",
    ],
    presenterNotes: [
      "Cerrar con honestidad técnica.",
      "No prometer producción inmediata.",
      "Reforzar que el prototipo ya demuestra visión y dirección clara.",
    ],
  },
];

export function buildCommercialStorylineSummary(
  sections: CommercialStorylineSection[]
) {
  const total = sections.length;

  const clientSections = sections.filter(
    (section) => section.audience === "client_company"
  ).length;

  const investorSections = sections.filter(
    (section) => section.audience === "investor"
  ).length;

  const partnerSections = sections.filter(
    (section) => section.audience === "partner"
  ).length;

  const internalSections = sections.filter(
    (section) => section.audience === "internal_team"
  ).length;

  return {
    total,
    clientSections,
    investorSections,
    partnerSections,
    internalSections,
  };
}

export function buildCommercialStorylineText(params: {
  profile: CompanyProfile;
  sections: CommercialStorylineSection[];
  summary: ReturnType<typeof buildCommercialStorylineSummary>;
}): string {
  const { profile, sections, summary } = params;

  const sectionText = sections
    .map((section) => {
      return `${section.title.toUpperCase()}
Audiencia: ${COMMERCIAL_STORYLINE_AUDIENCE_LABELS[section.audience]}
Tipo: ${COMMERCIAL_STORYLINE_TYPE_LABELS[section.type]}

${section.headline}

Narrativa:
${section.narrative}

Puntos clave:
${section.keyPoints.map((point) => `- ${point}`).join("\n")}

Notas presentador:
${section.presenterNotes.map((note) => `- ${note}`).join("\n")}`;
    })
    .join("\n\n---\n\n");

  return `STORYLINE COMERCIAL — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

RESUMEN
Secciones narrativas: ${summary.total}
Orientadas a empresas: ${summary.clientSections}
Orientadas a inversionistas: ${summary.investorSections}
Orientadas a socios: ${summary.partnerSections}
Orientadas a equipo interno: ${summary.internalSections}

NARRATIVA
${sectionText}

NOTA
Esta narrativa es material comercial de demo. No afirma producción real, no promete integraciones activas y debe usarse junto con las notas de alcance del prototipo.`;
}

export type ElevatorPitchAudience =
  | "client_company"
  | "partner"
  | "investor"
  | "technical_team";

export type CommercialObjectionCategory =
  | "production_status"
  | "whatsapp_integration"
  | "security"
  | "privacy"
  | "differentiation"
  | "pricing"
  | "implementation"
  | "scalability";

export type CommercialObjectionPriority = "medium" | "high" | "critical";

export type ElevatorPitchItem = {
  id: string;
  audience: ElevatorPitchAudience;
  title: string;
  shortPitch: string;
  expandedPitch: string;
  keyMessage: string;
  presenterTip: string;
};

export type CommercialObjectionItem = {
  id: string;
  category: CommercialObjectionCategory;
  priority: CommercialObjectionPriority;
  question: string;
  shortAnswer: string;
  expandedAnswer: string;
  safeBoundary: string;
};

export const ELEVATOR_PITCH_AUDIENCE_LABELS: Record<
  ElevatorPitchAudience,
  string
> = {
  client_company: "Empresa cliente",
  partner: "Socio estratégico",
  investor: "Inversionista",
  technical_team: "Equipo técnico",
};

export const COMMERCIAL_OBJECTION_CATEGORY_LABELS: Record<
  CommercialObjectionCategory,
  string
> = {
  production_status: "Estado productivo",
  whatsapp_integration: "WhatsApp",
  security: "Seguridad",
  privacy: "Privacidad",
  differentiation: "Diferenciación",
  pricing: "Modelo comercial",
  implementation: "Implementación",
  scalability: "Escalabilidad",
};

export const COMMERCIAL_OBJECTION_PRIORITY_LABELS: Record<
  CommercialObjectionPriority,
  string
> = {
  medium: "Media",
  high: "Alta",
  critical: "Crítica",
};

export const ELEVATOR_PITCH_ITEMS: ElevatorPitchItem[] = [
  {
    id: "pitch-client-company",
    audience: "client_company",
    title: "Pitch para empresa cliente",
    shortPitch:
      "ORBI ChatBox IA Core ayuda a convertir consultas web y futuras conversaciones de WhatsApp en leads organizados, priorizados y listos para seguimiento humano.",
    expandedPitch:
      "ORBI ChatBox IA Core es un prototipo avanzado de asistente comercial inteligente para empresas. Su objetivo es atender consultas iniciales, clasificar intención, detectar prioridad, generar leads, sugerir derivación humana y entregar reportes comerciales para que la empresa pierda menos oportunidades.",
    keyMessage:
      "No es solo un chat: es una capa de orden comercial para transformar mensajes en oportunidades.",
    presenterTip:
      "Para empresas, enfocar el discurso en ahorro de tiempo, mejor seguimiento y menos pérdida de leads.",
  },
  {
    id: "pitch-partner",
    audience: "partner",
    title: "Pitch para socio estratégico",
    shortPitch:
      "ORBI ChatBox IA Core es una base modular para llevar atención inteligente a múltiples empresas, con configuración, reportes, canales y preparación técnica para escalar.",
    expandedPitch:
      "La oportunidad para socios está en convertir ORBI ChatBox IA Core en una solución adaptable a diferentes industrias. El prototipo ya incluye perfil empresarial configurable, widget web, leads, reportes, WhatsApp futuro conceptual, matriz QA, seguridad, privacidad y readiness productivo.",
    keyMessage:
      "ORBI puede convertirse en una solución comercial replicable, adaptable y escalable por empresa.",
    presenterTip:
      "Para socios, enfatizar escalabilidad, modularidad y posibilidad de implementación por verticales.",
  },
  {
    id: "pitch-investor",
    audience: "investor",
    title: "Pitch para inversionista",
    shortPitch:
      "ORBI ChatBox IA Core es una base SaaS multiempresa en etapa de demo avanzada, con arquitectura conceptual, módulos comerciales y preparación productiva documentada.",
    expandedPitch:
      "Desde una mirada de inversión, ORBI ChatBox IA Core no es solo una interfaz de chat. Es una base de producto con módulos de empresa, servicios, contactos, leads, reportes, roles, API conceptual, privacidad, seguridad, observabilidad, QA, release y readiness score. El siguiente salto es convertir esta base conceptual en backend real y demo estable desplegable.",
    keyMessage:
      "El valor está en la visión SaaS, la modularidad y la preparación conceptual para escalar.",
    presenterTip:
      "Para inversionistas, mostrar el Readiness Score y explicar con honestidad qué falta para producción.",
  },
  {
    id: "pitch-technical-team",
    audience: "technical_team",
    title: "Pitch para equipo técnico",
    shortPitch:
      "ORBI ChatBox IA Core ya tiene una base conceptual organizada para convertirse en producto real: datos, roles, API, seguridad, QA, despliegue y observabilidad.",
    expandedPitch:
      "Para un equipo técnico, el prototipo sirve como especificación viva. Cada módulo conceptual puede transformarse en tickets de backend, modelos de datos, endpoints, controles de seguridad, pruebas QA, flujos de despliegue y criterios de aceptación.",
    keyMessage:
      "La demo funciona como puente entre visión comercial y backlog técnico productivo.",
    presenterTip:
      "Para equipo técnico, evitar vender humo: mostrar brechas, riesgos y próximos pasos concretos.",
  },
];

export const COMMERCIAL_OBJECTION_ITEMS: CommercialObjectionItem[] = [
  {
    id: "objection-production-ready",
    category: "production_status",
    priority: "critical",
    question: "¿Esto ya está listo para producción?",
    shortAnswer:
      "No todavía. Está listo como demo comercial avanzada y base conceptual, pero producción requiere backend, seguridad real, revisión legal y despliegue formal.",
    expandedAnswer:
      "ORBI ChatBox IA Core ya demuestra la experiencia, flujos comerciales y arquitectura conceptual. Sin embargo, para operar con clientes reales se necesita backend seguro, base de datos, autenticación, monitoreo, políticas legales y pruebas de seguridad.",
    safeBoundary:
      "Nunca presentarlo como producción real. Usar términos: demo avanzada, prototipo funcional, base conceptual SaaS.",
  },
  {
    id: "objection-whatsapp-real",
    category: "whatsapp_integration",
    priority: "critical",
    question: "¿WhatsApp Business ya está conectado?",
    shortAnswer:
      "No. WhatsApp está preparado conceptualmente, pero no conectado realmente.",
    expandedAnswer:
      "El prototipo incluye bandeja simulada, payload conceptual, webhook futuro y preparación multicanal. La conexión real requerirá proveedor oficial de WhatsApp Business, backend, validación de webhooks, seguridad y almacenamiento controlado.",
    safeBoundary:
      "No decir que WhatsApp funciona en producción. Decir: está diseñado para futura integración.",
  },
  {
    id: "objection-security",
    category: "security",
    priority: "critical",
    question: "¿Es seguro usar datos reales en esta demo?",
    shortAnswer:
      "No se recomienda usar datos reales en la demo actual.",
    expandedAnswer:
      "La demo funciona localmente y está diseñada para usar datos ficticios. Antes de usar datos reales se requiere backend seguro, control de acceso, cifrado, auditoría, políticas de retención y revisión de seguridad.",
    safeBoundary:
      "Evitar mostrar correos, teléfonos o clientes reales durante presentaciones.",
  },
  {
    id: "objection-privacy",
    category: "privacy",
    priority: "critical",
    question: "¿Cumple con privacidad y normativa legal?",
    shortAnswer:
      "Tiene una guía conceptual de privacidad, pero no reemplaza revisión legal profesional.",
    expandedAnswer:
      "El prototipo documenta consentimiento, datos de contacto, conversaciones, leads, reportes, respaldos, retención y anonimización. Para producción, esos lineamientos deben convertirse en políticas legales reales según país e industria.",
    safeBoundary:
      "No afirmar cumplimiento legal definitivo.",
  },
  {
    id: "objection-chatbot-normal",
    category: "differentiation",
    priority: "high",
    question: "¿Qué diferencia tiene con un chatbot normal?",
    shortAnswer:
      "ORBI no solo responde: clasifica, prioriza, genera leads, prepara derivación humana y entrega reportes.",
    expandedAnswer:
      "Un chatbot tradicional suele centrarse en responder preguntas. ORBI ChatBox IA Core agrega una capa comercial: analiza intención, detecta servicio de interés, calcula prioridad, registra leads, genera resúmenes, permite configuración empresarial y proyecta arquitectura SaaS multiempresa.",
    safeBoundary:
      "No comparar atacando a otras soluciones; enfocar en el valor propio de ORBI.",
  },
  {
    id: "objection-pricing",
    category: "pricing",
    priority: "medium",
    question: "¿Cuánto costaría?",
    shortAnswer:
      "Aún no hay precio definitivo. Puede evaluarse como SaaS mensual por empresa, por plan o por volumen de conversaciones.",
    expandedAnswer:
      "El modelo comercial podría considerar planes por empresa, cantidad de canales, volumen de conversaciones, usuarios internos, módulos avanzados y soporte. La demo actual permite validar interés antes de fijar precios definitivos.",
    safeBoundary:
      "No prometer precios cerrados si todavía no están definidos.",
  },
  {
    id: "objection-implementation-time",
    category: "implementation",
    priority: "high",
    question: "¿Cuánto demora implementarlo en una empresa?",
    shortAnswer:
      "Depende del alcance. Una demo web puede ser rápida, pero producción real requiere análisis, configuración, backend e integraciones.",
    expandedAnswer:
      "Para una primera demo, se puede configurar un perfil empresarial ficticio o controlado. Para producción real, se deben definir servicios, contactos, políticas, canales, usuarios, base de datos, seguridad, pruebas y despliegue.",
    safeBoundary:
      "No prometer tiempos exactos sin levantamiento técnico.",
  },
  {
    id: "objection-scalability",
    category: "scalability",
    priority: "high",
    question: "¿Puede servir para varias empresas?",
    shortAnswer:
      "Sí, conceptualmente está diseñado como multiempresa configurable.",
    expandedAnswer:
      "El prototipo ya contempla perfil empresarial, servicios configurables, contactos humanos, modelo de datos multiempresa, roles, permisos, contratos API y aislamiento conceptual. Para hacerlo real se necesita backend multi-tenant y base de datos segura.",
    safeBoundary:
      "Diferenciar diseño conceptual multiempresa de implementación multiempresa real.",
  },
];

export function buildCommercialPitchSummary(params: {
  pitches: ElevatorPitchItem[];
  objections: CommercialObjectionItem[];
}) {
  const { pitches, objections } = params;

  const totalPitches = pitches.length;
  const totalObjections = objections.length;

  const criticalObjections = objections.filter(
    (item) => item.priority === "critical"
  ).length;

  const highObjections = objections.filter(
    (item) => item.priority === "high"
  ).length;

  return {
    totalPitches,
    totalObjections,
    criticalObjections,
    highObjections,
  };
}

export function buildCommercialPitchText(params: {
  profile: CompanyProfile;
  pitches: ElevatorPitchItem[];
  objections: CommercialObjectionItem[];
  summary: ReturnType<typeof buildCommercialPitchSummary>;
}): string {
  const { profile, pitches, objections, summary } = params;

  const pitchesText = pitches
    .map((pitch) => {
      return `PITCH: ${pitch.title}
Audiencia: ${ELEVATOR_PITCH_AUDIENCE_LABELS[pitch.audience]}

Pitch corto:
${pitch.shortPitch}

Pitch extendido:
${pitch.expandedPitch}

Mensaje clave:
${pitch.keyMessage}

Tip presentador:
${pitch.presenterTip}`;
    })
    .join("\n\n---\n\n");

  const objectionsText = objections
    .map((objection) => {
      return `OBJECIÓN: ${objection.question}
Categoría: ${COMMERCIAL_OBJECTION_CATEGORY_LABELS[objection.category]}
Prioridad: ${COMMERCIAL_OBJECTION_PRIORITY_LABELS[objection.priority]}

Respuesta corta:
${objection.shortAnswer}

Respuesta extendida:
${objection.expandedAnswer}

Límite seguro:
${objection.safeBoundary}`;
    })
    .join("\n\n---\n\n");

  return `ELEVATOR PITCH Y RESPUESTAS COMERCIALES — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

RESUMEN
Pitches disponibles: ${summary.totalPitches}
Objeciones disponibles: ${summary.totalObjections}
Objeciones críticas: ${summary.criticalObjections}
Objeciones altas: ${summary.highObjections}

PITCHES
${pitchesText}

OBJECIONES Y RESPUESTAS
${objectionsText}

CIERRE RECOMENDADO
ORBI ChatBox IA Core está preparado como demo comercial avanzada y como base conceptual para evolucionar hacia un SaaS multiempresa. La producción real requerirá backend, seguridad, privacidad, integraciones oficiales, QA y despliegue formal.

NOTA
Este material es comercial y conceptual. No afirma producción real, no promete WhatsApp conectado, no reemplaza revisión legal y debe usarse con datos ficticios durante la demo.`;
}

export type LiveDemoStepStatus = "not_started" | "current" | "completed" | "optional";

export type LiveDemoStepAudience =
  | "client_company"
  | "partner"
  | "investor"
  | "technical_team"
  | "all";

export type LiveDemoStepRisk = "none" | "low" | "medium" | "high";

export type LiveDemoStep = {
  id: string;
  order: number;
  title: string;
  audience: LiveDemoStepAudience;
  status: LiveDemoStepStatus;
  estimatedMinutes: number;
  objective: string;
  presenterAction: string;
  suggestedMessage: string;
  whatToShow: string[];
  safeBoundary: string;
  riskLevel: LiveDemoStepRisk;
};

export const LIVE_DEMO_STEP_STATUS_LABELS: Record<LiveDemoStepStatus, string> = {
  not_started: "No iniciado",
  current: "Actual",
  completed: "Completado",
  optional: "Opcional",
};

export const LIVE_DEMO_STEP_AUDIENCE_LABELS: Record<LiveDemoStepAudience, string> = {
  client_company: "Empresa cliente",
  partner: "Socio estratégico",
  investor: "Inversionista",
  technical_team: "Equipo técnico",
  all: "Todas las audiencias",
};

export const LIVE_DEMO_STEP_RISK_LABELS: Record<LiveDemoStepRisk, string> = {
  none: "Sin riesgo",
  low: "Bajo",
  medium: "Medio",
  high: "Alto",
};

export const LIVE_DEMO_STEPS: LiveDemoStep[] = [
  {
    id: "live-demo-opening",
    order: 1,
    title: "Apertura ejecutiva",
    audience: "all",
    status: "current",
    estimatedMinutes: 1,
    objective:
      "Presentar ORBI ChatBox IA Core como demo comercial avanzada y prototipo conceptual SaaS.",
    presenterAction:
      "Abrir con una explicación breve del problema: las empresas pierden oportunidades cuando sus consultas digitales no se ordenan bien.",
    suggestedMessage:
      "Hoy voy a mostrar ORBI ChatBox IA Core, un prototipo avanzado de asistente comercial inteligente para empresas.",
    whatToShow: [
      "Pantalla principal.",
      "Nombre de la empresa activa.",
      "Modo demo comercial.",
      "Panel de Demo Comercial Estable.",
    ],
    safeBoundary:
      "Aclarar desde el inicio que es demo avanzada, no producción real.",
    riskLevel: "low",
  },
  {
    id: "live-demo-storyline",
    order: 2,
    title: "Problema, oportunidad y propuesta de valor",
    audience: "client_company",
    status: "not_started",
    estimatedMinutes: 3,
    objective:
      "Explicar el valor comercial antes de mostrar funciones técnicas.",
    presenterAction:
      "Usar el Storyline Comercial para explicar problema, oportunidad, solución ORBI y beneficios.",
    suggestedMessage:
      "El valor no está solo en responder mensajes, sino en convertir conversaciones en oportunidades comerciales organizadas.",
    whatToShow: [
      "Demo Storyline Comercial.",
      "Problema empresarial.",
      "Propuesta de valor.",
      "Beneficios para empresas.",
    ],
    safeBoundary:
      "No prometer automatización total ni resultados garantizados.",
    riskLevel: "low",
  },
  {
    id: "live-demo-chat-message",
    order: 3,
    title: "Prueba de mensaje comercial",
    audience: "all",
    status: "not_started",
    estimatedMinutes: 3,
    objective:
      "Demostrar cómo un mensaje entrante activa respuesta, análisis y clasificación.",
    presenterAction:
      "Copiar un mensaje demo recomendado, pegarlo en el chat principal y mostrar cómo responde el asistente.",
    suggestedMessage:
      "Hola, somos una empresa de servicios técnicos y queremos saber si ORBI puede ayudarnos a atender clientes desde nuestra web y WhatsApp.",
    whatToShow: [
      "Chat principal.",
      "Respuesta del asistente.",
      "Panel de análisis IA.",
      "Prioridad y acción recomendada.",
    ],
    safeBoundary:
      "Usar solo mensajes ficticios y no ingresar datos reales.",
    riskLevel: "medium",
  },
  {
    id: "live-demo-lead",
    order: 4,
    title: "Lead y seguimiento comercial",
    audience: "client_company",
    status: "not_started",
    estimatedMinutes: 3,
    objective:
      "Mostrar cómo la conversación puede convertirse en lead local y oportunidad priorizada.",
    presenterAction:
      "Mostrar la base local de leads, último registro, resumen diario y ficha de derivación humana.",
    suggestedMessage:
      "Aquí ORBI empieza a transformar una conversación en información comercial accionable.",
    whatToShow: [
      "Base local de leads.",
      "Último registro.",
      "Resumen diario.",
      "Derivación humana.",
    ],
    safeBoundary:
      "Aclarar que en producción esto debería guardarse en backend seguro.",
    riskLevel: "medium",
  },
  {
    id: "live-demo-widget",
    order: 5,
    title: "Widget web",
    audience: "client_company",
    status: "not_started",
    estimatedMinutes: 2,
    objective:
      "Mostrar cómo ORBI puede presentarse como asistente embebido en una web empresarial.",
    presenterAction:
      "Activar modo widget, abrir el botón flotante y mostrar el panel compacto.",
    suggestedMessage:
      "ORBI puede funcionar como primera capa de atención en una página web empresarial.",
    whatToShow: [
      "Modo widget web.",
      "Botón flotante.",
      "Panel compacto.",
      "Vista previa de instalación.",
    ],
    safeBoundary:
      "Aclarar que el embed real requerirá publicación y backend.",
    riskLevel: "medium",
  },
  {
    id: "live-demo-objections",
    order: 6,
    title: "Objeciones y respuestas seguras",
    audience: "all",
    status: "optional",
    estimatedMinutes: 2,
    objective:
      "Preparar respuestas claras ante preguntas comerciales o técnicas sensibles.",
    presenterAction:
      "Mostrar respuestas sobre producción, WhatsApp, privacidad, seguridad, precio y escalabilidad.",
    suggestedMessage:
      "Tenemos respuestas preparadas para explicar con transparencia qué está listo y qué requiere producción real.",
    whatToShow: [
      "Elevator pitch.",
      "Objeciones comerciales.",
      "Respuestas seguras.",
      "Límites de alcance.",
    ],
    safeBoundary:
      "No afirmar WhatsApp real, cumplimiento legal definitivo ni producción real.",
    riskLevel: "high",
  },
  {
    id: "live-demo-readiness",
    order: 7,
    title: "Readiness Score y cierre técnico",
    audience: "investor",
    status: "not_started",
    estimatedMinutes: 3,
    objective:
      "Demostrar que la app tiene arquitectura, seguridad, QA, despliegue y cierre técnico conceptual.",
    presenterAction:
      "Mostrar Readiness Score, áreas críticas, plan de acción y cierre del bloque 0I.",
    suggestedMessage:
      "La fortaleza de ORBI está en que no solo tiene interfaz, también tiene estructura conceptual para evolucionar a producto SaaS.",
    whatToShow: [
      "Readiness Score.",
      "Plan de acción.",
      "Áreas de menor score.",
      "Riesgos críticos.",
    ],
    safeBoundary:
      "Recalcar que el score es conceptual y no certifica producción.",
    riskLevel: "high",
  },
  {
    id: "live-demo-closing",
    order: 8,
    title: "Cierre comercial",
    audience: "all",
    status: "not_started",
    estimatedMinutes: 1,
    objective:
      "Cerrar la presentación con visión clara, honestidad técnica y siguiente paso recomendado.",
    presenterAction:
      "Invitar a validar una demo controlada, definir industria objetivo o preparar backlog técnico productivo.",
    suggestedMessage:
      "ORBI ChatBox IA Core está listo como demo comercial avanzada y base conceptual para evolucionar hacia un SaaS multiempresa.",
    whatToShow: [
      "Mensaje de cierre.",
      "Pitch final.",
      "Próximos pasos.",
    ],
    safeBoundary:
      "No cerrar prometiendo fechas, precios o producción inmediata.",
    riskLevel: "low",
  },
];

export function buildLiveDemoSummary(steps: LiveDemoStep[]) {
  const total = steps.length;

  const completed = steps.filter((step) => step.status === "completed").length;

  const current = steps.filter((step) => step.status === "current").length;

  const optional = steps.filter((step) => step.status === "optional").length;

  const highRisk = steps.filter((step) => step.riskLevel === "high").length;

  const totalMinutes = steps.reduce(
    (sum, step) => sum + step.estimatedMinutes,
    0
  );

  return {
    total,
    completed,
    current,
    optional,
    highRisk,
    totalMinutes,
  };
}

export function buildLiveDemoAgendaText(params: {
  profile: CompanyProfile;
  steps: LiveDemoStep[];
  summary: ReturnType<typeof buildLiveDemoSummary>;
}): string {
  const { profile, steps, summary } = params;

  const stepsText = steps
    .map((step) => {
      return `PASO ${step.order}: ${step.title}
Audiencia: ${LIVE_DEMO_STEP_AUDIENCE_LABELS[step.audience]}
Estado: ${LIVE_DEMO_STEP_STATUS_LABELS[step.status]}
Duración estimada: ${step.estimatedMinutes} min
Riesgo: ${LIVE_DEMO_STEP_RISK_LABELS[step.riskLevel]}

Objetivo:
${step.objective}

Acción presentador:
${step.presenterAction}

Mensaje sugerido:
${step.suggestedMessage}

Qué mostrar:
${step.whatToShow.map((item) => `- ${item}`).join("\n")}

Límite seguro:
${step.safeBoundary}`;
    })
    .join("\n\n---\n\n");

  return `AGENDA DEMO LIVE — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

RESUMEN
Pasos totales: ${summary.total}
Paso actual: ${summary.current}
Completados: ${summary.completed}
Opcionales: ${summary.optional}
Pasos de alto riesgo: ${summary.highRisk}
Duración estimada total: ${summary.totalMinutes} min

AGENDA
${stepsText}

NOTA
Esta agenda es conceptual. No modifica datos, no activa integraciones, no conecta WhatsApp real y no convierte el prototipo en producción.`;
}

export type LiveDemoChecklistCategory =
  | "opening"
  | "message_test"
  | "lead_review"
  | "widget"
  | "scope_warning"
  | "readiness"
  | "closing";

export type LiveDemoChecklistPriority = "normal" | "important" | "critical";

export type LiveDemoChecklistItem = {
  id: string;
  title: string;
  category: LiveDemoChecklistCategory;
  priority: LiveDemoChecklistPriority;
  description: string;
  doneByDefault: boolean;
};

export const LIVE_DEMO_CHECKLIST_CATEGORY_LABELS: Record<
  LiveDemoChecklistCategory,
  string
> = {
  opening: "Apertura",
  message_test: "Prueba mensaje",
  lead_review: "Revisión lead",
  widget: "Widget",
  scope_warning: "Alcance seguro",
  readiness: "Readiness",
  closing: "Cierre",
};

export const LIVE_DEMO_CHECKLIST_PRIORITY_LABELS: Record<
  LiveDemoChecklistPriority,
  string
> = {
  normal: "Normal",
  important: "Importante",
  critical: "Crítico",
};

export const LIVE_DEMO_CHECKLIST_ITEMS: LiveDemoChecklistItem[] = [
  {
    id: "live-check-opening-scope",
    title: "Aclarar que es demo avanzada",
    category: "opening",
    priority: "critical",
    description:
      "Antes de iniciar, explicar que ORBI ChatBox IA Core es un prototipo avanzado y no una versión productiva real.",
    doneByDefault: false,
  },
  {
    id: "live-check-use-demo-data",
    title: "Usar solo datos ficticios",
    category: "scope_warning",
    priority: "critical",
    description:
      "No ingresar correos, teléfonos, nombres de clientes reales ni conversaciones sensibles durante la presentación.",
    doneByDefault: false,
  },
  {
    id: "live-check-copy-demo-message",
    title: "Copiar mensaje demo recomendado",
    category: "message_test",
    priority: "important",
    description:
      "Usar un mensaje demo preparado para probar el chat sin improvisar datos reales.",
    doneByDefault: false,
  },
  {
    id: "live-check-show-ai-analysis",
    title: "Mostrar análisis IA",
    category: "message_test",
    priority: "important",
    description:
      "Después de enviar el mensaje, mostrar tipo de cliente, prioridad, servicio detectado y acción recomendada.",
    doneByDefault: false,
  },
  {
    id: "live-check-show-lead",
    title: "Mostrar lead y derivación humana",
    category: "lead_review",
    priority: "important",
    description:
      "Mostrar cómo la conversación puede convertirse en oportunidad comercial organizada.",
    doneByDefault: false,
  },
  {
    id: "live-check-widget-scope",
    title: "Aclarar alcance del widget",
    category: "widget",
    priority: "important",
    description:
      "Explicar que el widget visual está preparado, pero una instalación real requiere publicación, backend y controles de seguridad.",
    doneByDefault: false,
  },
  {
    id: "live-check-whatsapp-boundary",
    title: "Aclarar que WhatsApp no está conectado",
    category: "scope_warning",
    priority: "critical",
    description:
      "Indicar que WhatsApp Business es una integración futura conceptual y no una conexión real activa.",
    doneByDefault: false,
  },
  {
    id: "live-check-readiness",
    title: "Mostrar Readiness Score",
    category: "readiness",
    priority: "important",
    description:
      "Mostrar que el producto tiene una base conceptual de arquitectura, seguridad, privacidad, QA y despliegue.",
    doneByDefault: false,
  },
  {
    id: "live-check-closing-next-step",
    title: "Cerrar con siguiente paso concreto",
    category: "closing",
    priority: "normal",
    description:
      "Cerrar proponiendo demo controlada, validación con industria objetivo o conversión de módulos técnicos en backlog productivo.",
    doneByDefault: false,
  },
];

export function buildLiveDemoProgressSummary(params: {
  steps: LiveDemoStep[];
  completedStepIds: string[];
  checklistItems: LiveDemoChecklistItem[];
  completedChecklistIds: string[];
}) {
  const { steps, completedStepIds, checklistItems, completedChecklistIds } =
    params;

  const totalSteps = steps.length;
  const completedSteps = completedStepIds.length;

  const totalChecklist = checklistItems.length;
  const completedChecklist = completedChecklistIds.length;

  const estimatedMinutes = steps.reduce(
    (sum, step) => sum + step.estimatedMinutes,
    0
  );

  const completedMinutes = steps
    .filter((step) => completedStepIds.includes(step.id))
    .reduce((sum, step) => sum + step.estimatedMinutes, 0);

  const stepProgress =
    totalSteps === 0 ? 0 : Math.round((completedSteps / totalSteps) * 100);

  const checklistProgress =
    totalChecklist === 0
      ? 0
      : Math.round((completedChecklist / totalChecklist) * 100);

  const criticalChecklistTotal = checklistItems.filter(
    (item) => item.priority === "critical"
  ).length;

  const criticalChecklistCompleted = checklistItems.filter(
    (item) =>
      item.priority === "critical" && completedChecklistIds.includes(item.id)
  ).length;

  return {
    totalSteps,
    completedSteps,
    totalChecklist,
    completedChecklist,
    estimatedMinutes,
    completedMinutes,
    stepProgress,
    checklistProgress,
    criticalChecklistTotal,
    criticalChecklistCompleted,
  };
}

export function buildLiveDemoStatusText(params: {
  profile: CompanyProfile;
  steps: LiveDemoStep[];
  completedStepIds: string[];
  checklistItems: LiveDemoChecklistItem[];
  completedChecklistIds: string[];
  summary: ReturnType<typeof buildLiveDemoProgressSummary>;
}): string {
  const {
    profile,
    steps,
    completedStepIds,
    checklistItems,
    completedChecklistIds,
    summary,
  } = params;

  const stepsText = steps
    .map((step) => {
      const done = completedStepIds.includes(step.id);

      return `${done ? "✓" : "○"} PASO ${step.order}: ${step.title}
Duración: ${step.estimatedMinutes} min
Audiencia: ${LIVE_DEMO_STEP_AUDIENCE_LABELS[step.audience]}
Riesgo: ${LIVE_DEMO_STEP_RISK_LABELS[step.riskLevel]}
Objetivo: ${step.objective}
Límite seguro: ${step.safeBoundary}`;
    })
    .join("\n\n");

  const checklistText = checklistItems
    .map((item) => {
      const done = completedChecklistIds.includes(item.id);

      return `${done ? "✓" : "○"} ${item.title}
Categoría: ${LIVE_DEMO_CHECKLIST_CATEGORY_LABELS[item.category]}
Prioridad: ${LIVE_DEMO_CHECKLIST_PRIORITY_LABELS[item.priority]}
Descripción: ${item.description}`;
    })
    .join("\n\n");

  return `ESTADO DEMO LIVE — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

PROGRESO
Pasos completados: ${summary.completedSteps}/${summary.totalSteps}
Progreso pasos: ${summary.stepProgress}%
Checklist completado: ${summary.completedChecklist}/${summary.totalChecklist}
Progreso checklist: ${summary.checklistProgress}%
Minutos cubiertos: ${summary.completedMinutes}/${summary.estimatedMinutes}
Checks críticos completados: ${summary.criticalChecklistCompleted}/${summary.criticalChecklistTotal}

PASOS
${stepsText}

CHECKLIST LIVE
${checklistText}

CIERRE
Este estado corresponde a una demo conceptual. No modifica datos reales, no activa integraciones externas, no conecta WhatsApp y no convierte el prototipo en producción.`;
}

export type DemoFeedbackAudience =
  | "client_company"
  | "partner"
  | "investor"
  | "technical_team"
  | "internal_team";

export type DemoInterestLevel = "low" | "medium" | "high" | "strategic";

export type DemoCommercialRisk = "low" | "medium" | "high";

export type DemoNextStepType =
  | "send_summary"
  | "schedule_followup"
  | "technical_review"
  | "pricing_discussion"
  | "pilot_proposal"
  | "no_action";

export type DemoFeedbackItem = {
  id: string;
  title: string;
  audience: DemoFeedbackAudience;
  interestLevel: DemoInterestLevel;
  commercialRisk: DemoCommercialRisk;
  opportunityScore: number;
  reactionSummary: string;
  detectedObjections: string[];
  positiveSignals: string[];
  recommendedNextSteps: DemoNextStepType[];
  presenterNotes: string[];
};

export const DEMO_FEEDBACK_AUDIENCE_LABELS: Record<DemoFeedbackAudience, string> = {
  client_company: "Empresa cliente",
  partner: "Socio estratégico",
  investor: "Inversionista",
  technical_team: "Equipo técnico",
  internal_team: "Equipo interno",
};

export const DEMO_INTEREST_LEVEL_LABELS: Record<DemoInterestLevel, string> = {
  low: "Bajo",
  medium: "Medio",
  high: "Alto",
  strategic: "Estratégico",
};

export const DEMO_COMMERCIAL_RISK_LABELS: Record<DemoCommercialRisk, string> = {
  low: "Bajo",
  medium: "Medio",
  high: "Alto",
};

export const DEMO_NEXT_STEP_TYPE_LABELS: Record<DemoNextStepType, string> = {
  send_summary: "Enviar resumen",
  schedule_followup: "Agendar seguimiento",
  technical_review: "Revisión técnica",
  pricing_discussion: "Conversar precios",
  pilot_proposal: "Propuesta piloto",
  no_action: "Sin acción",
};

export const DEMO_FEEDBACK_ITEMS: DemoFeedbackItem[] = [
  {
    id: "feedback-client-high-interest",
    title: "Empresa cliente con alto interés",
    audience: "client_company",
    interestLevel: "high",
    commercialRisk: "medium",
    opportunityScore: 82,
    reactionSummary:
      "La empresa entiende el valor de capturar consultas digitales, generar leads y ordenar seguimiento comercial desde una primera capa inteligente.",
    detectedObjections: [
      "Necesitan saber si puede conectarse a WhatsApp real.",
      "Preguntan por tiempos de implementación.",
      "Quieren entender costos aproximados.",
    ],
    positiveSignals: [
      "Reconocen pérdida de oportunidades por mala trazabilidad.",
      "Se interesan en widget web.",
      "Valoran resumen diario y derivación humana.",
    ],
    recommendedNextSteps: [
      "send_summary",
      "schedule_followup",
      "pilot_proposal",
    ],
    presenterNotes: [
      "Enviar resumen comercial claro.",
      "No prometer WhatsApp real inmediato.",
      "Proponer piloto controlado con alcance limitado.",
    ],
  },
  {
    id: "feedback-investor-strategic",
    title: "Inversionista con interés estratégico",
    audience: "investor",
    interestLevel: "strategic",
    commercialRisk: "medium",
    opportunityScore: 88,
    reactionSummary:
      "El inversionista se interesa por el potencial SaaS multiempresa, la modularidad del ecosistema y la existencia de readiness técnico conceptual.",
    detectedObjections: [
      "Pregunta qué falta para producción real.",
      "Solicita claridad de modelo comercial.",
      "Busca roadmap técnico y costos de desarrollo.",
    ],
    positiveSignals: [
      "Valora arquitectura conceptual.",
      "Se interesa por escalabilidad multiempresa.",
      "Reconoce potencial de verticalización por industria.",
    ],
    recommendedNextSteps: [
      "send_summary",
      "technical_review",
      "pricing_discussion",
    ],
    presenterNotes: [
      "Mostrar Readiness Score y brechas honestamente.",
      "Preparar roadmap hacia backend real.",
      "Explicar que el valor está en producto SaaS, no solo demo visual.",
    ],
  },
  {
    id: "feedback-partner-medium",
    title: "Socio estratégico con interés medio",
    audience: "partner",
    interestLevel: "medium",
    commercialRisk: "medium",
    opportunityScore: 66,
    reactionSummary:
      "El socio ve potencial, pero necesita entender mejor cómo podría empaquetarse, venderse o implementarse por industria.",
    detectedObjections: [
      "Requiere claridad de roles entre ORBI y socio.",
      "Pregunta por soporte, implementación y mantenimiento.",
      "Quiere saber si se adapta a otros rubros.",
    ],
    positiveSignals: [
      "Reconoce utilidad para empresas con atención digital.",
      "Se interesa por demo white-label o personalizable.",
      "Ve posibilidad de venderlo como servicio complementario.",
    ],
    recommendedNextSteps: [
      "send_summary",
      "schedule_followup",
      "technical_review",
    ],
    presenterNotes: [
      "Enfatizar modularidad.",
      "Preparar ejemplos por industria.",
      "No cerrar modelo de partnership sin evaluación comercial.",
    ],
  },
  {
    id: "feedback-technical-review",
    title: "Equipo técnico solicita revisión",
    audience: "technical_team",
    interestLevel: "high",
    commercialRisk: "high",
    opportunityScore: 74,
    reactionSummary:
      "El equipo técnico considera que la demo es potente, pero solicita revisar arquitectura, seguridad, base de datos, autenticación, APIs y despliegue antes de avanzar.",
    detectedObjections: [
      "Necesitan backend real.",
      "Piden validación de seguridad.",
      "Requieren especificación técnica más formal.",
      "Solicitan separación clara entre demo y producción.",
    ],
    positiveSignals: [
      "Valoran contratos API conceptuales.",
      "Ven utilidad en matriz QA.",
      "Reconocen que el prototipo funciona como especificación viva.",
    ],
    recommendedNextSteps: [
      "technical_review",
      "send_summary",
      "schedule_followup",
    ],
    presenterNotes: [
      "No defender la demo como producción.",
      "Usar bloque 0I como base técnica.",
      "Convertir observaciones en backlog productivo.",
    ],
  },
  {
    id: "feedback-low-interest",
    title: "Interés bajo o no calificado",
    audience: "client_company",
    interestLevel: "low",
    commercialRisk: "high",
    opportunityScore: 38,
    reactionSummary:
      "La audiencia no identifica una necesidad inmediata o no cuenta con volumen suficiente de consultas digitales para justificar el producto.",
    detectedObjections: [
      "No tienen alto flujo de clientes digitales.",
      "No ven prioridad presupuestaria.",
      "Prefieren mantener atención manual.",
    ],
    positiveSignals: [
      "Podrían reconsiderarlo si crece el volumen de atención.",
      "Podrían usarlo más adelante como demo interna.",
    ],
    recommendedNextSteps: ["send_summary", "no_action"],
    presenterNotes: [
      "No forzar venta.",
      "Mantener contacto liviano.",
      "Registrar aprendizaje para mejorar segmentación de clientes.",
    ],
  },
];

export function buildDemoFeedbackSummary(items: DemoFeedbackItem[]) {
  const total = items.length;

  const highInterest = items.filter(
    (item) => item.interestLevel === "high" || item.interestLevel === "strategic"
  ).length;

  const strategic = items.filter(
    (item) => item.interestLevel === "strategic"
  ).length;

  const highRisk = items.filter((item) => item.commercialRisk === "high").length;

  const averageOpportunityScore =
    total === 0
      ? 0
      : Math.round(
          items.reduce((sum, item) => sum + item.opportunityScore, 0) / total
        );

  return {
    total,
    highInterest,
    strategic,
    highRisk,
    averageOpportunityScore,
  };
}

export function buildDemoFeedbackText(params: {
  profile: CompanyProfile;
  items: DemoFeedbackItem[];
  summary: ReturnType<typeof buildDemoFeedbackSummary>;
}): string {
  const { profile, items, summary } = params;

  const itemsText = items
    .map((item) => {
      return `FEEDBACK: ${item.title}
Audiencia: ${DEMO_FEEDBACK_AUDIENCE_LABELS[item.audience]}
Interés: ${DEMO_INTEREST_LEVEL_LABELS[item.interestLevel]}
Riesgo comercial: ${DEMO_COMMERCIAL_RISK_LABELS[item.commercialRisk]}
Opportunity Score: ${item.opportunityScore}%

Resumen reacción:
${item.reactionSummary}

Objeciones detectadas:
${item.detectedObjections.map((objection) => `- ${objection}`).join("\n")}

Señales positivas:
${item.positiveSignals.map((signal) => `- ${signal}`).join("\n")}

Próximos pasos:
${item.recommendedNextSteps
  .map((step) => `- ${DEMO_NEXT_STEP_TYPE_LABELS[step]}`)
  .join("\n")}

Notas presentador:
${item.presenterNotes.map((note) => `- ${note}`).join("\n")}`;
    })
    .join("\n\n---\n\n");

  return `RESUMEN POST-DEMO — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

RESUMEN GENERAL
Escenarios de feedback: ${summary.total}
Alto interés / estratégico: ${summary.highInterest}
Interés estratégico: ${summary.strategic}
Riesgo comercial alto: ${summary.highRisk}
Opportunity Score promedio: ${summary.averageOpportunityScore}%

DETALLE
${itemsText}

NOTA
Este resumen es conceptual. No guarda feedback real, no conecta CRM, no envía correos, no modifica localStorage y no reemplaza seguimiento comercial formal.`;
}

export type DemoFollowUpAudience =
  | "client_company"
  | "partner"
  | "investor"
  | "technical_team";

export type DemoFollowUpType =
  | "thank_you"
  | "executive_summary"
  | "technical_next_steps"
  | "investment_followup";

export type DemoOpportunityStage =
  | "new_interest"
  | "qualified"
  | "technical_review"
  | "nurture"
  | "closed_not_now";

export type DemoFollowUpTemplate = {
  id: string;
  title: string;
  audience: DemoFollowUpAudience;
  type: DemoFollowUpType;
  opportunityStage: DemoOpportunityStage;
  priority: "medium" | "high" | "critical";
  subjectLine: string;
  opening: string;
  bodyPoints: string[];
  proposedNextSteps: string[];
  safeBoundaries: string[];
  closing: string;
};

export const DEMO_FOLLOW_UP_AUDIENCE_LABELS: Record<DemoFollowUpAudience, string> = {
  client_company: "Empresa cliente",
  partner: "Socio estratégico",
  investor: "Inversionista",
  technical_team: "Equipo técnico",
};

export const DEMO_FOLLOW_UP_TYPE_LABELS: Record<DemoFollowUpType, string> = {
  thank_you: "Agradecimiento",
  executive_summary: "Resumen ejecutivo",
  technical_next_steps: "Siguientes pasos técnicos",
  investment_followup: "Seguimiento inversión",
};

export const DEMO_OPPORTUNITY_STAGE_LABELS: Record<DemoOpportunityStage, string> = {
  new_interest: "Interés nuevo",
  qualified: "Calificado",
  technical_review: "Revisión técnica",
  nurture: "Nutrición comercial",
  closed_not_now: "Cerrado por ahora",
};

export const DEMO_FOLLOW_UP_TEMPLATES: DemoFollowUpTemplate[] = [
  {
    id: "followup-client-thank-you",
    title: "Follow-up para empresa interesada",
    audience: "client_company",
    type: "thank_you",
    opportunityStage: "qualified",
    priority: "high",
    subjectLine: "Resumen demo ORBI ChatBox IA Core",
    opening:
      "Gracias por participar en la demo de ORBI ChatBox IA Core. Fue muy valioso revisar cómo una empresa puede transformar consultas digitales en oportunidades comerciales organizadas.",
    bodyPoints: [
      "ORBI puede ayudar a clasificar consultas, detectar intención comercial y priorizar leads.",
      "La demo mostró atención inicial, análisis IA, registro de oportunidad, resumen comercial y widget web.",
      "La integración con WhatsApp Business se mantiene como una fase futura que requiere backend e integración oficial.",
      "La versión mostrada es una demo avanzada conceptual, no una plataforma productiva final.",
    ],
    proposedNextSteps: [
      "Definir un caso de uso piloto.",
      "Identificar servicios que la empresa quiere mostrar en el asistente.",
      "Preparar datos ficticios o controlados para una demo personalizada.",
      "Agendar una revisión de alcance técnico/comercial.",
    ],
    safeBoundaries: [
      "No usar datos reales sensibles en esta etapa.",
      "No presentar WhatsApp como integración activa.",
      "No considerar la demo como producción real.",
    ],
    closing:
      "Como siguiente paso, podemos preparar una demo piloto acotada para validar el valor comercial con un flujo realista y seguro.",
  },
  {
    id: "followup-investor",
    title: "Follow-up para inversionista",
    audience: "investor",
    type: "investment_followup",
    opportunityStage: "qualified",
    priority: "critical",
    subjectLine: "ORBI ChatBox IA Core — Demo avanzada y ruta SaaS",
    opening:
      "Gracias por revisar ORBI ChatBox IA Core. La demo permitió mostrar no solo una interfaz de chat, sino una base conceptual para un SaaS multiempresa.",
    bodyPoints: [
      "El prototipo ya incluye configuración empresarial, chat, análisis IA, leads, reportes, widget, narrativa comercial y demo control center.",
      "El bloque técnico conceptual cubre modelo de datos, roles, contratos API, privacidad, seguridad, observabilidad, QA, release y readiness.",
      "El siguiente salto es convertir la base conceptual en backend real, autenticación, base de datos multiempresa y despliegue controlado.",
      "La oportunidad está en empaquetar ORBI como solución configurable para múltiples industrias.",
    ],
    proposedNextSteps: [
      "Preparar roadmap de MVP productivo.",
      "Estimar esfuerzo de backend y despliegue.",
      "Definir modelo comercial SaaS preliminar.",
      "Identificar vertical inicial para piloto.",
    ],
    safeBoundaries: [
      "No afirmar tracción comercial validada sin pilotos reales.",
      "No afirmar producción lista.",
      "No presentar cumplimiento legal o seguridad como cerrados.",
    ],
    closing:
      "La demo muestra una base sólida de visión y producto. El próximo paso es ordenar el plan de conversión desde prototipo avanzado hacia MVP productivo.",
  },
  {
    id: "followup-partner",
    title: "Follow-up para socio estratégico",
    audience: "partner",
    type: "executive_summary",
    opportunityStage: "nurture",
    priority: "high",
    subjectLine: "Posible colaboración ORBI ChatBox IA Core",
    opening:
      "Gracias por revisar la demo de ORBI ChatBox IA Core. La conversación abrió posibilidades de colaboración para empaquetar la solución por industria o tipo de empresa.",
    bodyPoints: [
      "ORBI puede adaptarse a diferentes empresas mediante perfil, servicios, contactos humanos y narrativa comercial configurable.",
      "El producto podría funcionar como complemento para servicios digitales, atención comercial o transformación operativa.",
      "La demo actual permite explicar valor, pero una implementación real requiere backend, seguridad, privacidad y despliegue formal.",
    ],
    proposedNextSteps: [
      "Identificar industria o vertical objetivo.",
      "Definir rol del socio en venta, implementación o soporte.",
      "Preparar demo personalizada por caso de uso.",
      "Evaluar modelo de colaboración comercial.",
    ],
    safeBoundaries: [
      "No definir modelo de partnership sin análisis comercial.",
      "No prometer white-label productivo inmediato.",
      "No usar datos reales de clientes del socio en demo temprana.",
    ],
    closing:
      "Podemos avanzar con una conversación de encaje comercial para definir si ORBI puede integrarse como oferta complementaria o solución conjunta.",
  },
  {
    id: "followup-technical-team",
    title: "Follow-up para equipo técnico",
    audience: "technical_team",
    type: "technical_next_steps",
    opportunityStage: "technical_review",
    priority: "critical",
    subjectLine: "ORBI ChatBox IA Core — Revisión técnica post-demo",
    opening:
      "Gracias por revisar técnicamente ORBI ChatBox IA Core. La demo funciona como especificación viva para transformar la visión comercial en backlog técnico.",
    bodyPoints: [
      "La base conceptual incluye modelo de datos, contratos API, roles, privacidad, seguridad, observabilidad, QA y despliegue.",
      "El frontend actual no debe confundirse con backend real.",
      "La producción requiere arquitectura server-side, base de datos, autenticación, aislamiento multiempresa y gestión de secretos.",
      "Los módulos conceptuales pueden convertirse en épicas, historias de usuario y criterios de aceptación.",
    ],
    proposedNextSteps: [
      "Revisar modelo de datos multiempresa.",
      "Priorizar endpoints críticos.",
      "Definir autenticación y RBAC real.",
      "Diseñar pipeline staging/producción.",
      "Convertir matriz QA en pruebas reales.",
    ],
    safeBoundaries: [
      "No conectar APIs reales desde frontend sin backend seguro.",
      "No exponer credenciales.",
      "No usar datos productivos hasta completar controles.",
    ],
    closing:
      "El siguiente paso recomendado es convertir el bloque 0I en backlog técnico productivo ordenado por prioridad, riesgo y dependencia.",
  },
];

export function buildDemoFollowUpSummary(templates: DemoFollowUpTemplate[]) {
  const totalTemplates = templates.length;

  const criticalTemplates = templates.filter(
    (template) => template.priority === "critical"
  ).length;

  const highTemplates = templates.filter(
    (template) => template.priority === "high"
  ).length;

  const technicalReviews = templates.filter(
    (template) => template.opportunityStage === "technical_review"
  ).length;

  return {
    totalTemplates,
    criticalTemplates,
    highTemplates,
    technicalReviews,
  };
}

export function buildDemoFollowUpText(params: {
  profile: CompanyProfile;
  templates: DemoFollowUpTemplate[];
  summary: ReturnType<typeof buildDemoFollowUpSummary>;
}): string {
  const { profile, templates, summary } = params;

  const templatesText = templates
    .map((template) => {
      return `FOLLOW-UP: ${template.title}
Audiencia: ${DEMO_FOLLOW_UP_AUDIENCE_LABELS[template.audience]}
Tipo: ${DEMO_FOLLOW_UP_TYPE_LABELS[template.type]}
Etapa oportunidad: ${DEMO_OPPORTUNITY_STAGE_LABELS[template.opportunityStage]}
Prioridad: ${template.priority}

Asunto:
${template.subjectLine}

Apertura:
${template.opening}

Puntos:
${template.bodyPoints.map((point) => `- ${point}`).join("\n")}

Próximos pasos:
${template.proposedNextSteps.map((step) => `- ${step}`).join("\n")}

Límites seguros:
${template.safeBoundaries.map((boundary) => `- ${boundary}`).join("\n")}

Cierre:
${template.closing}`;
    })
    .join("\n\n---\n\n");

  return `FOLLOW-UP COMERCIAL POST-DEMO — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

RESUMEN
Plantillas follow-up: ${summary.totalTemplates}
Plantillas críticas: ${summary.criticalTemplates}
Plantillas altas: ${summary.highTemplates}
Revisiones técnicas: ${summary.technicalReviews}

FOLLOW-UP
${templatesText}

NOTA
Este material es conceptual. No envía correos, no guarda datos reales, no conecta CRM, no modifica localStorage y no reemplaza seguimiento comercial formal.`;
}

export type DemoPilotProposalBlock = {
  id: string;
  title: string;
  objective: string;
  scope: string[];
  exclusions: string[];
  successCriteria: string[];
  requiredInputs: string[];
};

export type DemoMeetingMinuteTemplate = {
  id: string;
  title: string;
  audience: DemoFollowUpAudience;
  sections: {
    title: string;
    content: string[];
  }[];
};

export type DemoOpportunityClosureItem = {
  id: string;
  title: string;
  stage: DemoOpportunityStage;
  priority: "medium" | "high" | "critical";
  summary: string;
  recommendedDecision: string;
  nextActions: string[];
  riskWarnings: string[];
};

export const DEMO_PILOT_PROPOSAL_BLOCKS: DemoPilotProposalBlock[] = [
  {
    id: "pilot-objective",
    title: "Objetivo del piloto",
    objective:
      "Validar si ORBI ChatBox IA Core puede mejorar la captura, clasificación y seguimiento de consultas comerciales en una empresa específica.",
    scope: [
      "Configurar un perfil demo de la empresa.",
      "Definir servicios iniciales.",
      "Preparar mensajes frecuentes.",
      "Simular atención web con widget.",
      "Medir interés, objeciones y claridad del flujo.",
    ],
    exclusions: [
      "No conectar WhatsApp real.",
      "No usar datos sensibles reales.",
      "No automatizar decisiones críticas.",
      "No operar como producción.",
    ],
    successCriteria: [
      "La empresa entiende la propuesta de valor.",
      "El flujo de chat genera interés comercial.",
      "Los leads simulados son útiles para seguimiento.",
      "El equipo identifica próximos pasos técnicos.",
    ],
    requiredInputs: [
      "Nombre ficticio o controlado de empresa.",
      "Lista de servicios a mostrar.",
      "Preguntas frecuentes comerciales.",
      "Responsable interno para feedback.",
    ],
  },
  {
    id: "pilot-scope",
    title: "Alcance sugerido del piloto",
    objective:
      "Mantener el piloto acotado, seguro y demostrable, evitando promesas productivas prematuras.",
    scope: [
      "Demo web controlada.",
      "Escenarios comerciales predefinidos.",
      "Reporte post-demo.",
      "Feedback de usuarios internos.",
      "Identificación de brechas productivas.",
    ],
    exclusions: [
      "Integración CRM real.",
      "Automatización legal o contractual.",
      "Atención real a clientes finales.",
      "Procesamiento de datos sensibles.",
    ],
    successCriteria: [
      "Feedback claro de utilidad.",
      "Interés en siguiente fase.",
      "Requisitos técnicos identificados.",
      "Riesgos documentados.",
    ],
    requiredInputs: [
      "Audiencia del piloto.",
      "Objetivo comercial principal.",
      "Duración estimada de prueba.",
      "Criterios internos de evaluación.",
    ],
  },
];

export const DEMO_MEETING_MINUTE_TEMPLATES: DemoMeetingMinuteTemplate[] = [
  {
    id: "minute-client",
    title: "Minuta para empresa cliente",
    audience: "client_company",
    sections: [
      {
        title: "Resumen de la reunión",
        content: [
          "Se presentó ORBI ChatBox IA Core como demo comercial avanzada.",
          "Se revisó atención inicial, análisis IA, leads, widget web y límites conceptuales.",
        ],
      },
      {
        title: "Intereses detectados",
        content: [
          "Mejor seguimiento de consultas.",
          "Orden comercial.",
          "Posible piloto controlado.",
        ],
      },
      {
        title: "Pendientes",
        content: [
          "Definir caso de uso.",
          "Identificar servicios iniciales.",
          "Agendar revisión de alcance.",
        ],
      },
    ],
  },
  {
    id: "minute-investor",
    title: "Minuta para inversionista",
    audience: "investor",
    sections: [
      {
        title: "Resumen de la reunión",
        content: [
          "Se presentó ORBI ChatBox IA Core como base conceptual SaaS multiempresa.",
          "Se revisó readiness técnico, arquitectura conceptual y ruta hacia backend real.",
        ],
      },
      {
        title: "Intereses detectados",
        content: [
          "Escalabilidad SaaS.",
          "Verticalización por industria.",
          "Roadmap de MVP productivo.",
        ],
      },
      {
        title: "Pendientes",
        content: [
          "Preparar roadmap técnico.",
          "Estimar esfuerzo de desarrollo.",
          "Definir modelo comercial preliminar.",
        ],
      },
    ],
  },
  {
    id: "minute-technical",
    title: "Minuta para equipo técnico",
    audience: "technical_team",
    sections: [
      {
        title: "Resumen de la revisión",
        content: [
          "Se revisaron módulos conceptuales de arquitectura, datos, API, seguridad, QA y despliegue.",
          "Se aclaró que el prototipo no posee backend real ni integraciones productivas.",
        ],
      },
      {
        title: "Riesgos detectados",
        content: [
          "Necesidad de autenticación real.",
          "Aislamiento multiempresa.",
          "Seguridad API.",
          "Retención y privacidad de datos.",
        ],
      },
      {
        title: "Pendientes técnicos",
        content: [
          "Convertir contratos API en especificación backend.",
          "Diseñar esquema de base de datos.",
          "Definir RBAC real.",
          "Crear plan de staging.",
        ],
      },
    ],
  },
];

export const DEMO_OPPORTUNITY_CLOSURE_ITEMS: DemoOpportunityClosureItem[] = [
  {
    id: "closure-pilot-candidate",
    title: "Cierre como candidato a piloto",
    stage: "qualified",
    priority: "high",
    summary:
      "La audiencia mostró interés suficiente para avanzar hacia una prueba piloto controlada, manteniendo alcance seguro y datos ficticios o controlados.",
    recommendedDecision:
      "Avanzar a definición de piloto limitado con objetivos, servicios iniciales y criterios de éxito.",
    nextActions: [
      "Definir caso de uso inicial.",
      "Seleccionar audiencia piloto.",
      "Preparar perfil demo personalizado.",
      "Acordar criterios de éxito.",
    ],
    riskWarnings: [
      "No usar datos reales sensibles.",
      "No prometer WhatsApp real en esta fase.",
      "No presentar el piloto como producción.",
    ],
  },
  {
    id: "closure-technical-review",
    title: "Cierre con revisión técnica previa",
    stage: "technical_review",
    priority: "critical",
    summary:
      "La audiencia requiere revisión técnica antes de avanzar. El foco debe estar en backend, seguridad, datos, roles, APIs y despliegue.",
    recommendedDecision:
      "Convertir los módulos conceptuales del bloque 0I en backlog técnico y validar arquitectura antes de un piloto real.",
    nextActions: [
      "Revisar modelo de datos.",
      "Priorizar endpoints críticos.",
      "Definir autenticación y RBAC.",
      "Preparar arquitectura staging.",
    ],
    riskWarnings: [
      "No conectar APIs reales desde frontend.",
      "No exponer credenciales.",
      "No operar con clientes reales sin backend seguro.",
    ],
  },
  {
    id: "closure-nurture",
    title: "Cierre para nutrición comercial",
    stage: "nurture",
    priority: "medium",
    summary:
      "La audiencia mostró interés parcial o futuro, pero aún no existe urgencia suficiente para avanzar a piloto inmediato.",
    recommendedDecision:
      "Mantener seguimiento liviano, enviar resumen ejecutivo y preparar una demo personalizada si aparece una necesidad más concreta.",
    nextActions: [
      "Enviar resumen post-demo.",
      "Registrar objeciones principales.",
      "Preparar ejemplo por industria.",
      "Revisar oportunidad en una futura conversación.",
    ],
    riskWarnings: [
      "No forzar venta.",
      "No sobredimensionar el interés.",
      "No invertir demasiado esfuerzo sin caso de uso claro.",
    ],
  },
];

export function buildDemoPilotClosureSummary(params: {
  pilotBlocks: DemoPilotProposalBlock[];
  minuteTemplates: DemoMeetingMinuteTemplate[];
  closureItems: DemoOpportunityClosureItem[];
}) {
  const { pilotBlocks, minuteTemplates, closureItems } = params;

  const criticalClosures = closureItems.filter(
    (item) => item.priority === "critical"
  ).length;

  const highClosures = closureItems.filter(
    (item) => item.priority === "high"
  ).length;

  return {
    pilotBlocks: pilotBlocks.length,
    minuteTemplates: minuteTemplates.length,
    closureItems: closureItems.length,
    criticalClosures,
    highClosures,
  };
}

export function buildDemoPilotClosureText(params: {
  profile: CompanyProfile;
  pilotBlocks: DemoPilotProposalBlock[];
  minuteTemplates: DemoMeetingMinuteTemplate[];
  closureItems: DemoOpportunityClosureItem[];
  summary: ReturnType<typeof buildDemoPilotClosureSummary>;
}): string {
  const { profile, pilotBlocks, minuteTemplates, closureItems, summary } =
    params;

  const pilotText = pilotBlocks
    .map((block) => {
      return `PROPUESTA PILOTO: ${block.title}

Objetivo:
${block.objective}

Alcance:
${block.scope.map((item) => `- ${item}`).join("\n")}

Exclusiones:
${block.exclusions.map((item) => `- ${item}`).join("\n")}

Criterios de éxito:
${block.successCriteria.map((item) => `- ${item}`).join("\n")}

Insumos requeridos:
${block.requiredInputs.map((item) => `- ${item}`).join("\n")}`;
    })
    .join("\n\n---\n\n");

  const minutesText = minuteTemplates
    .map((minute) => {
      return `MINUTA: ${minute.title}
Audiencia: ${DEMO_FOLLOW_UP_AUDIENCE_LABELS[minute.audience]}

${minute.sections
  .map((section) => {
    return `${section.title}
${section.content.map((item) => `- ${item}`).join("\n")}`;
  })
  .join("\n\n")}`;
    })
    .join("\n\n---\n\n");

  const closureText = closureItems
    .map((item) => {
      return `CIERRE DE OPORTUNIDAD: ${item.title}
Etapa: ${DEMO_OPPORTUNITY_STAGE_LABELS[item.stage]}
Prioridad: ${item.priority}

Resumen:
${item.summary}

Decisión recomendada:
${item.recommendedDecision}

Siguientes acciones:
${item.nextActions.map((action) => `- ${action}`).join("\n")}

Advertencias:
${item.riskWarnings.map((warning) => `- ${warning}`).join("\n")}`;
    })
    .join("\n\n---\n\n");

  return `PROPUESTA PILOTO, MINUTAS Y CIERRE — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

RESUMEN
Bloques propuesta piloto: ${summary.pilotBlocks}
Plantillas de minuta: ${summary.minuteTemplates}
Cierres de oportunidad: ${summary.closureItems}
Cierres críticos: ${summary.criticalClosures}
Cierres altos: ${summary.highClosures}

PROPUESTA PILOTO
${pilotText}

MINUTAS POST-DEMO
${minutesText}

CIERRE DE OPORTUNIDAD
${closureText}

NOTA
Este material es conceptual. No envía correos, no guarda datos reales, no conecta CRM, no modifica localStorage y no reemplaza seguimiento comercial formal.`;
}

export type DemoPackageAudience =
  | "client_company"
  | "partner"
  | "investor"
  | "technical_team"
  | "internal_team";

export type DemoPackageAssetType =
  | "one_pager"
  | "executive_summary"
  | "technical_summary"
  | "pilot_outline"
  | "follow_up"
  | "meeting_minutes"
  | "readiness_snapshot"
  | "commercial_pitch";

export type DemoPackageAssetStatus = "ready" | "recommended" | "optional" | "future";

export type DemoPackageAsset = {
  id: string;
  title: string;
  audience: DemoPackageAudience;
  type: DemoPackageAssetType;
  status: DemoPackageAssetStatus;
  description: string;
  includedSections: string[];
  usageNotes: string[];
  safeBoundaries: string[];
};

export type DemoPackageChecklistItem = {
  id: string;
  title: string;
  audience: DemoPackageAudience;
  required: boolean;
  description: string;
};

export const DEMO_PACKAGE_AUDIENCE_LABELS: Record<DemoPackageAudience, string> = {
  client_company: "Empresa cliente",
  partner: "Socio estratégico",
  investor: "Inversionista",
  technical_team: "Equipo técnico",
  internal_team: "Equipo interno",
};

export const DEMO_PACKAGE_ASSET_TYPE_LABELS: Record<DemoPackageAssetType, string> = {
  one_pager: "One-pager",
  executive_summary: "Resumen ejecutivo",
  technical_summary: "Resumen técnico",
  pilot_outline: "Outline piloto",
  follow_up: "Follow-up",
  meeting_minutes: "Minuta",
  readiness_snapshot: "Readiness snapshot",
  commercial_pitch: "Pitch comercial",
};

export const DEMO_PACKAGE_ASSET_STATUS_LABELS: Record<DemoPackageAssetStatus, string> = {
  ready: "Listo",
  recommended: "Recomendado",
  optional: "Opcional",
  future: "Fase futura",
};

export const DEMO_PACKAGE_ASSETS: DemoPackageAsset[] = [
  {
    id: "package-one-pager-client",
    title: "One-pager para empresa cliente",
    audience: "client_company",
    type: "one_pager",
    status: "recommended",
    description:
      "Resumen comercial breve para explicar qué es ORBI ChatBox IA Core, qué problema resuelve y qué beneficios entrega a una empresa.",
    includedSections: [
      "Problema empresarial.",
      "Solución ORBI.",
      "Beneficios principales.",
      "Demo disponible.",
      "Próximo paso sugerido.",
    ],
    usageNotes: [
      "Usar después de una demo comercial.",
      "Mantener lenguaje simple y no técnico.",
      "Ideal para enviar a gerencia, operaciones o equipo comercial.",
    ],
    safeBoundaries: [
      "No afirmar que la plataforma está en producción.",
      "No prometer WhatsApp real conectado.",
      "No incluir datos reales de clientes.",
    ],
  },
  {
    id: "package-executive-summary-investor",
    title: "Resumen ejecutivo para inversionista",
    audience: "investor",
    type: "executive_summary",
    status: "recommended",
    description:
      "Material para explicar la visión SaaS multiempresa, el potencial comercial y el avance conceptual del producto.",
    includedSections: [
      "Visión de producto.",
      "Potencial SaaS multiempresa.",
      "Estado actual de demo avanzada.",
      "Readiness conceptual.",
      "Ruta hacia MVP productivo.",
    ],
    usageNotes: [
      "Usar después de una conversación estratégica.",
      "Acompañar con Readiness Score.",
      "Explicar brechas hacia producción con transparencia.",
    ],
    safeBoundaries: [
      "No afirmar tracción validada sin pilotos reales.",
      "No presentar readiness conceptual como certificación productiva.",
      "No cerrar valoración o inversión sin análisis formal.",
    ],
  },
  {
    id: "package-technical-summary",
    title: "Resumen técnico para revisión",
    audience: "technical_team",
    type: "technical_summary",
    status: "ready",
    description:
      "Resumen orientado a equipos técnicos para convertir módulos conceptuales en backlog de producto real.",
    includedSections: [
      "Modelo de datos multiempresa.",
      "Contratos API.",
      "Roles y permisos.",
      "Privacidad y seguridad.",
      "Observabilidad y QA.",
      "Despliegue y release.",
    ],
    usageNotes: [
      "Usar con equipos de desarrollo o arquitectura.",
      "Ideal para transformar el prototipo en backlog.",
      "Debe acompañarse con límites de alcance.",
    ],
    safeBoundaries: [
      "No confundir frontend conceptual con backend real.",
      "No usar como especificación cerrada sin revisión.",
      "No conectar APIs reales desde frontend sin backend seguro.",
    ],
  },
  {
    id: "package-pilot-outline",
    title: "Outline de propuesta piloto",
    audience: "client_company",
    type: "pilot_outline",
    status: "recommended",
    description:
      "Material para proponer un piloto controlado, acotado y seguro después de una demo con buen nivel de interés.",
    includedSections: [
      "Objetivo del piloto.",
      "Alcance.",
      "Exclusiones.",
      "Criterios de éxito.",
      "Insumos requeridos.",
    ],
    usageNotes: [
      "Usar solo si existe interés alto o estratégico.",
      "Mantener alcance limitado.",
      "Evitar promesas productivas prematuras.",
    ],
    safeBoundaries: [
      "No usar datos sensibles reales.",
      "No conectar WhatsApp real en piloto conceptual.",
      "No operar como atención productiva.",
    ],
  },
  {
    id: "package-follow-up",
    title: "Follow-up post-demo",
    audience: "partner",
    type: "follow_up",
    status: "ready",
    description:
      "Plantilla para mantener conversación comercial después de una demo con empresas, socios, inversionistas o equipos técnicos.",
    includedSections: [
      "Agradecimiento.",
      "Puntos revisados.",
      "Próximos pasos.",
      "Límites seguros.",
      "Cierre profesional.",
    ],
    usageNotes: [
      "Usar después de toda demo importante.",
      "Ajustar según audiencia.",
      "Mantener honestidad sobre alcance conceptual.",
    ],
    safeBoundaries: [
      "No enviar como correo automático desde la app.",
      "No guardar datos reales en esta etapa.",
      "No reemplazar seguimiento comercial formal.",
    ],
  },
  {
    id: "package-meeting-minutes",
    title: "Minuta post-demo",
    audience: "internal_team",
    type: "meeting_minutes",
    status: "ready",
    description:
      "Formato para documentar lo conversado después de una presentación, separando intereses, pendientes y riesgos.",
    includedSections: [
      "Resumen de reunión.",
      "Intereses detectados.",
      "Objeciones.",
      "Pendientes.",
      "Siguientes acciones.",
    ],
    usageNotes: [
      "Usar para registro interno.",
      "Puede servir para ordenar próximos pasos.",
      "Debe completarse con información real fuera del prototipo si aplica.",
    ],
    safeBoundaries: [
      "No guardar automáticamente en CRM.",
      "No registrar datos sensibles dentro del prototipo.",
      "No reemplazar minuta oficial de la empresa.",
    ],
  },
];

export const DEMO_PACKAGE_CHECKLIST: DemoPackageChecklistItem[] = [
  {
    id: "package-check-one-pager",
    title: "Preparar one-pager comercial",
    audience: "client_company",
    required: true,
    description:
      "Documento breve para explicar problema, solución, beneficios y siguiente paso.",
  },
  {
    id: "package-check-safe-scope",
    title: "Incluir límites de alcance",
    audience: "client_company",
    required: true,
    description:
      "Aclarar que la demo no es producción real, no conecta WhatsApp y no usa backend.",
  },
  {
    id: "package-check-pilot-outline",
    title: "Adjuntar propuesta piloto si aplica",
    audience: "client_company",
    required: false,
    description:
      "Solo usar cuando la audiencia muestre interés alto o estratégico.",
  },
  {
    id: "package-check-readiness",
    title: "Incluir Readiness Score para inversionistas",
    audience: "investor",
    required: true,
    description:
      "Mostrar avance conceptual, brechas productivas y ruta hacia MVP.",
  },
  {
    id: "package-check-technical-summary",
    title: "Preparar resumen técnico",
    audience: "technical_team",
    required: true,
    description:
      "Incluir datos, APIs, roles, seguridad, QA, release y observabilidad.",
  },
  {
    id: "package-check-follow-up",
    title: "Preparar follow-up post-demo",
    audience: "internal_team",
    required: true,
    description:
      "Copiar una plantilla de seguimiento ajustada a la audiencia.",
  },
];

export function buildDemoPackageSummary(params: {
  assets: DemoPackageAsset[];
  checklist: DemoPackageChecklistItem[];
}) {
  const { assets, checklist } = params;

  const readyAssets = assets.filter((asset) => asset.status === "ready").length;

  const recommendedAssets = assets.filter(
    (asset) => asset.status === "recommended"
  ).length;

  const requiredChecks = checklist.filter((item) => item.required).length;

  return {
    assets: assets.length,
    readyAssets,
    recommendedAssets,
    checklistItems: checklist.length,
    requiredChecks,
  };
}

export function buildDemoPackageText(params: {
  profile: CompanyProfile;
  assets: DemoPackageAsset[];
  checklist: DemoPackageChecklistItem[];
  summary: ReturnType<typeof buildDemoPackageSummary>;
}): string {
  const { profile, assets, checklist, summary } = params;

  const assetsText = assets
    .map((asset) => {
      return `ENTREGABLE: ${asset.title}
Audiencia: ${DEMO_PACKAGE_AUDIENCE_LABELS[asset.audience]}
Tipo: ${DEMO_PACKAGE_ASSET_TYPE_LABELS[asset.type]}
Estado: ${DEMO_PACKAGE_ASSET_STATUS_LABELS[asset.status]}

Descripción:
${asset.description}

Secciones incluidas:
${asset.includedSections.map((section) => `- ${section}`).join("\n")}

Uso recomendado:
${asset.usageNotes.map((note) => `- ${note}`).join("\n")}

Límites seguros:
${asset.safeBoundaries.map((boundary) => `- ${boundary}`).join("\n")}`;
    })
    .join("\n\n---\n\n");

  const checklistText = checklist
    .map((item) => {
      return `${item.required ? "[REQUERIDO]" : "[OPCIONAL]"} ${item.title}
Audiencia: ${DEMO_PACKAGE_AUDIENCE_LABELS[item.audience]}
${item.description}`;
    })
    .join("\n\n");

  return `DEMO PACKAGE — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

RESUMEN
Entregables: ${summary.assets}
Listos: ${summary.readyAssets}
Recomendados: ${summary.recommendedAssets}
Checklist: ${summary.checklistItems}
Checks requeridos: ${summary.requiredChecks}

ENTREGABLES
${assetsText}

CHECKLIST DE PAQUETE
${checklistText}

NOTA
Este paquete es conceptual. No crea archivos reales, no genera PDF, no envía correos, no conecta CRM, no modifica localStorage y no reemplaza documentación comercial formal.`;
}

export type DemoOnePagerSectionType =
  | "headline"
  | "problem"
  | "solution"
  | "value"
  | "features"
  | "demo_scope"
  | "next_step";

export type DemoOnePagerSection = {
  id: string;
  title: string;
  type: DemoOnePagerSectionType;
  content: string;
  bullets: string[];
};

export type DemoExecutiveSummaryFinal = {
  id: string;
  title: string;
  headline: string;
  summary: string;
  keyMessages: string[];
  readinessNotes: string[];
  recommendedNextSteps: string[];
};

export type DemoBlockClosureItem = {
  id: string;
  title: string;
  completed: boolean;
  description: string;
};

export const DEMO_ONE_PAGER_SECTION_TYPE_LABELS: Record<
  DemoOnePagerSectionType,
  string
> = {
  headline: "Titular",
  problem: "Problema",
  solution: "Solución",
  value: "Valor",
  features: "Funciones",
  demo_scope: "Alcance demo",
  next_step: "Siguiente paso",
};

export const DEMO_ONE_PAGER_SECTIONS: DemoOnePagerSection[] = [
  {
    id: "onepager-headline",
    title: "Titular comercial",
    type: "headline",
    content:
      "ORBI ChatBox IA Core es una demo avanzada de asistente comercial inteligente para empresas, diseñada para convertir consultas digitales en oportunidades organizadas.",
    bullets: [
      "Atención inicial inteligente.",
      "Clasificación comercial de mensajes.",
      "Generación conceptual de leads.",
      "Preparación para widget web y canales futuros.",
    ],
  },
  {
    id: "onepager-problem",
    title: "Problema que resuelve",
    type: "problem",
    content:
      "Muchas empresas reciben consultas por canales digitales, pero no siempre logran ordenarlas, priorizarlas o derivarlas a tiempo.",
    bullets: [
      "Mensajes dispersos.",
      "Pérdida de oportunidades comerciales.",
      "Seguimiento manual poco trazable.",
      "Dificultad para diferenciar venta, soporte y urgencia.",
    ],
  },
  {
    id: "onepager-solution",
    title: "Solución ORBI",
    type: "solution",
    content:
      "ORBI ChatBox IA Core permite simular una primera capa de atención inteligente que responde, analiza, clasifica y transforma conversaciones en información comercial útil.",
    bullets: [
      "Chat configurable por empresa.",
      "Análisis IA local del mensaje.",
      "Lead conceptual con prioridad y resumen.",
      "Ficha de derivación humana.",
      "Reportes y demo comercial guiada.",
    ],
  },
  {
    id: "onepager-value",
    title: "Propuesta de valor",
    type: "value",
    content:
      "El valor principal es transformar mensajes desordenados en oportunidades accionables para equipos comerciales y operativos.",
    bullets: [
      "Menos pérdida de leads.",
      "Mejor trazabilidad comercial.",
      "Atención inicial más rápida.",
      "Mayor claridad para derivación humana.",
      "Base conceptual para evolucionar a SaaS multiempresa.",
    ],
  },
  {
    id: "onepager-features",
    title: "Funciones demostrables",
    type: "features",
    content:
      "La demo permite mostrar flujos comerciales completos sin conectar servicios externos ni usar datos reales.",
    bullets: [
      "Chat principal.",
      "Análisis IA.",
      "Generación local de leads.",
      "Resumen diario comercial.",
      "Widget web conceptual.",
      "Storyline, pitch y objeciones.",
      "Demo Live Control Center.",
      "Feedback, follow-up y propuesta piloto.",
    ],
  },
  {
    id: "onepager-demo-scope",
    title: "Alcance actual de la demo",
    type: "demo_scope",
    content:
      "La solución está en etapa de prototipo avanzado y demo conceptual. No debe presentarse como producción real.",
    bullets: [
      "No tiene backend real.",
      "No conecta WhatsApp real.",
      "No envía correos.",
      "No conecta CRM.",
      "No debe usar datos sensibles reales.",
      "Producción requiere backend, seguridad, privacidad y despliegue formal.",
    ],
  },
  {
    id: "onepager-next-step",
    title: "Siguiente paso recomendado",
    type: "next_step",
    content:
      "El siguiente paso recomendado es validar una demo controlada por industria o preparar un piloto conceptual con alcance limitado.",
    bullets: [
      "Definir industria objetivo.",
      "Preparar perfil demo personalizado.",
      "Seleccionar servicios iniciales.",
      "Definir criterios de éxito.",
      "Convertir módulos técnicos en backlog productivo.",
    ],
  },
];

export const DEMO_EXECUTIVE_SUMMARY_FINAL: DemoExecutiveSummaryFinal = {
  id: "demo-executive-summary-final",
  title: "Resumen ejecutivo final del bloque 0J",
  headline:
    "ORBI ChatBox IA Core ya está preparado como demo comercial avanzada, guiada, segura y exportable.",
  summary:
    "El Bloque 0J transforma el prototipo técnico en una experiencia comercial presentable. La app ahora cuenta con escenarios demo, modo visitante, guion comercial, narrativa, pitch, objeciones, control live, feedback post-demo, follow-up, propuesta piloto, minutas, cierres de oportunidad y paquete demo copiable.",
  keyMessages: [
    "La demo ya puede presentarse con recorrido guiado.",
    "El presentador cuenta con mensajes, límites seguros y checklist live.",
    "La narrativa comercial está preparada para empresas, socios, inversionistas y equipos técnicos.",
    "El seguimiento post-demo permite ordenar interés, objeciones y próximos pasos.",
    "El paquete demo consolida materiales comerciales y técnicos.",
  ],
  readinessNotes: [
    "La demo sigue siendo conceptual y local.",
    "No representa producción real.",
    "No conecta WhatsApp, CRM, backend ni APIs externas.",
    "No debe usarse con datos sensibles reales.",
    "El siguiente salto requiere MVP productivo con backend seguro.",
  ],
  recommendedNextSteps: [
    "Preparar una demo personalizada por industria.",
    "Definir cliente o audiencia piloto.",
    "Crear perfil demo controlado.",
    "Convertir bloque 0I en backlog técnico.",
    "Separar versión demo estable de rama experimental.",
  ],
};

export const DEMO_BLOCK_0J_CLOSURE_ITEMS: DemoBlockClosureItem[] = [
  {
    id: "closure-demo-scenarios",
    title: "Escenarios comerciales demo",
    completed: true,
    description:
      "Se crearon escenarios comerciales guiados para empresa, socio, inversionista, equipo técnico, widget y WhatsApp futuro conceptual.",
  },
  {
    id: "closure-safe-demo",
    title: "Preparación segura de demo",
    completed: true,
    description:
      "Se incorporó perfil demo seguro, checklist de presentación, reset visual y guion comercial copiable.",
  },
  {
    id: "closure-storyline",
    title: "Storyline, pitch y objeciones",
    completed: true,
    description:
      "La demo cuenta con narrativa comercial, propuesta de valor, elevator pitch y respuestas seguras a objeciones.",
  },
  {
    id: "closure-live-control",
    title: "Demo Live Control Center",
    completed: true,
    description:
      "Se agregó agenda de presentación, paso activo, progreso manual, checklist live y exportación de estado.",
  },
  {
    id: "closure-feedback-followup",
    title: "Feedback y follow-up post-demo",
    completed: true,
    description:
      "Se integraron plantillas para feedback, follow-up comercial, propuesta piloto, minutas y cierre de oportunidad.",
  },
  {
    id: "closure-demo-package",
    title: "Demo Package Builder",
    completed: true,
    description:
      "Se consolidaron entregables, checklist de paquete, one-pager, resumen ejecutivo final y exportación copiable.",
  },
];

export function buildDemoBlockClosureSummary(items: DemoBlockClosureItem[]) {
  const total = items.length;

  const completed = items.filter((item) => item.completed).length;

  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    total,
    completed,
    progress,
  };
}

export function buildDemoFinalPackageText(params: {
  profile: CompanyProfile;
  onePagerSections: DemoOnePagerSection[];
  executiveSummary: DemoExecutiveSummaryFinal;
  closureItems: DemoBlockClosureItem[];
  closureSummary: ReturnType<typeof buildDemoBlockClosureSummary>;
}): string {
  const {
    profile,
    onePagerSections,
    executiveSummary,
    closureItems,
    closureSummary,
  } = params;

  const onePagerText = onePagerSections
    .map((section) => {
      return `${section.title.toUpperCase()}
Tipo: ${DEMO_ONE_PAGER_SECTION_TYPE_LABELS[section.type]}

${section.content}

Puntos clave:
${section.bullets.map((bullet) => `- ${bullet}`).join("\n")}`;
    })
    .join("\n\n---\n\n");

  const closureText = closureItems
    .map((item) => {
      return `${item.completed ? "✓" : "○"} ${item.title}
${item.description}`;
    })
    .join("\n\n");

  return `DEMO PACKAGE FINAL — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

ONE-PAGER COMERCIAL
${onePagerText}

RESUMEN EJECUTIVO FINAL
${executiveSummary.headline}

${executiveSummary.summary}

Mensajes clave:
${executiveSummary.keyMessages.map((message) => `- ${message}`).join("\n")}

Notas de readiness:
${executiveSummary.readinessNotes.map((note) => `- ${note}`).join("\n")}

Siguientes pasos recomendados:
${executiveSummary.recommendedNextSteps.map((step) => `- ${step}`).join("\n")}

CIERRE BLOQUE 0J
Módulos cerrados: ${closureSummary.completed}/${closureSummary.total}
Progreso: ${closureSummary.progress}%

${closureText}

NOTA
Este demo package final es conceptual. No crea archivos reales, no genera PDF, no envía correos, no conecta CRM, no modifica localStorage y no reemplaza documentación comercial formal.`;
}


export type MvpScopeCategory =
  | "core_chat"
  | "company_config"
  | "lead_management"
  | "human_handoff"
  | "reporting"
  | "widget"
  | "security"
  | "privacy"
  | "backend"
  | "integrations"
  | "demo_only";

export type MvpScopeStatus =
  | "include_mvp"
  | "exclude_mvp"
  | "future_phase"
  | "requires_backend"
  | "demo_only";

export type MvpScopePriority = "low" | "medium" | "high" | "critical";

export type MvpScopeDependencyLevel = "none" | "light" | "moderate" | "hard";

export type MvpScopeItem = {
  id: string;
  title: string;
  category: MvpScopeCategory;
  status: MvpScopeStatus;
  priority: MvpScopePriority;
  dependencyLevel: MvpScopeDependencyLevel;
  description: string;
  whyIncludedOrExcluded: string[];
  requiredForMvp: string[];
  risks: string[];
  nextActions: string[];
};

export const MVP_SCOPE_CATEGORY_LABELS: Record<MvpScopeCategory, string> = {
  core_chat: "Chat núcleo",
  company_config: "Configuración empresa",
  lead_management: "Gestión de leads",
  human_handoff: "Derivación humana",
  reporting: "Reportes",
  widget: "Widget web",
  security: "Seguridad",
  privacy: "Privacidad",
  backend: "Backend",
  integrations: "Integraciones",
  demo_only: "Solo demo",
};

export const MVP_SCOPE_STATUS_LABELS: Record<MvpScopeStatus, string> = {
  include_mvp: "Incluir en MVP",
  exclude_mvp: "Excluir del MVP",
  future_phase: "Fase futura",
  requires_backend: "Requiere backend",
  demo_only: "Solo demo",
};

export const MVP_SCOPE_PRIORITY_LABELS: Record<MvpScopePriority, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  critical: "Crítica",
};

export const MVP_SCOPE_DEPENDENCY_LABELS: Record<MvpScopeDependencyLevel, string> = {
  none: "Sin dependencia",
  light: "Dependencia ligera",
  moderate: "Dependencia moderada",
  hard: "Dependencia fuerte",
};

export const MVP_SCOPE_ITEMS: MvpScopeItem[] = [
  {
    id: "mvp-core-chat",
    title: "Chat principal con respuesta asistida",
    category: "core_chat",
    status: "include_mvp",
    priority: "critical",
    dependencyLevel: "moderate",
    description:
      "El chat principal debe ser parte central del MVP, permitiendo que un visitante escriba una consulta y reciba una respuesta asistida.",
    whyIncludedOrExcluded: [
      "Es la función núcleo del producto.",
      "Permite demostrar valor inmediato.",
      "Es la entrada principal para análisis, leads y derivación.",
    ],
    requiredForMvp: [
      "Interfaz de chat estable.",
      "Motor de respuesta controlado.",
      "Manejo de errores.",
      "Registro seguro de conversación en backend futuro.",
    ],
    risks: [
      "Responder incorrectamente si el motor IA no está controlado.",
      "Guardar datos sensibles sin políticas claras.",
      "Confundir demo local con atención real.",
    ],
    nextActions: [
      "Definir si el MVP usará motor local, API IA o reglas híbridas.",
      "Diseñar endpoint seguro para mensajes.",
      "Definir límites de respuesta y fallback humano.",
    ],
  },
  {
    id: "mvp-company-profile",
    title: "Perfil empresarial configurable",
    category: "company_config",
    status: "include_mvp",
    priority: "critical",
    dependencyLevel: "moderate",
    description:
      "El MVP debe permitir configurar una empresa con nombre, asistente, servicios, contactos y mensajes base.",
    whyIncludedOrExcluded: [
      "Permite adaptar ORBI a distintas empresas.",
      "Es clave para visión SaaS multiempresa.",
      "Evita que el producto quede fijo a una sola marca.",
    ],
    requiredForMvp: [
      "Modelo Company real.",
      "Servicios configurables.",
      "Contactos humanos.",
      "Persistencia en base de datos.",
      "Validación por rol administrador.",
    ],
    risks: [
      "Configuraciones incompletas pueden generar respuestas pobres.",
      "Debe evitarse exposición cruzada entre empresas.",
      "Requiere aislamiento multiempresa real.",
    ],
    nextActions: [
      "Traducir CompanyProfile a esquema backend.",
      "Definir permisos de edición.",
      "Preparar formulario productivo simplificado.",
    ],
  },
  {
    id: "mvp-lead-management",
    title: "Gestión básica de leads",
    category: "lead_management",
    status: "include_mvp",
    priority: "critical",
    dependencyLevel: "hard",
    description:
      "El MVP debe registrar oportunidades comerciales básicas generadas desde conversaciones.",
    whyIncludedOrExcluded: [
      "Es el valor comercial más importante después del chat.",
      "Permite seguimiento real.",
      "Transforma mensajes en oportunidades accionables.",
    ],
    requiredForMvp: [
      "Entidad Lead real.",
      "Relación con Conversation.",
      "Prioridad.",
      "Estado del lead.",
      "Canal de origen.",
      "Fecha de creación.",
    ],
    risks: [
      "Duplicación de leads.",
      "Datos personales sin consentimiento.",
      "Falta de trazabilidad en cambios.",
    ],
    nextActions: [
      "Definir estados mínimos de lead.",
      "Crear endpoints de leads.",
      "Agregar auditoría básica de cambios.",
    ],
  },
  {
    id: "mvp-human-handoff",
    title: "Derivación humana básica",
    category: "human_handoff",
    status: "include_mvp",
    priority: "high",
    dependencyLevel: "moderate",
    description:
      "El MVP debe permitir marcar conversaciones o leads que requieren atención humana.",
    whyIncludedOrExcluded: [
      "Evita depender totalmente de la IA.",
      "Aumenta confianza empresarial.",
      "Permite manejar casos sensibles o urgentes.",
    ],
    requiredForMvp: [
      "Flag de derivación humana.",
      "Contacto sugerido.",
      "Prioridad de atención.",
      "Nota interna.",
    ],
    risks: [
      "No debe prometer contacto automático si no existe integración.",
      "Debe existir responsable humano real.",
      "Casos críticos requieren trazabilidad.",
    ],
    nextActions: [
      "Definir estados de handoff.",
      "Conectar con roles de soporte o ejecutivo.",
      "Preparar vista de bandeja humana.",
    ],
  },
  {
    id: "mvp-reporting-basic",
    title: "Reportes básicos comerciales",
    category: "reporting",
    status: "include_mvp",
    priority: "high",
    dependencyLevel: "moderate",
    description:
      "El MVP debe mostrar métricas simples de conversaciones, leads, prioridades y derivaciones.",
    whyIncludedOrExcluded: [
      "Ayuda a demostrar impacto comercial.",
      "Entrega visibilidad a administradores.",
      "Permite validar uso del producto.",
    ],
    requiredForMvp: [
      "Conteo de conversaciones.",
      "Conteo de leads.",
      "Leads por prioridad.",
      "Derivaciones humanas.",
      "Filtro por fecha básico.",
    ],
    risks: [
      "Métricas incorrectas reducen confianza.",
      "Reportes con datos personales deben protegerse.",
      "Debe evitarse exponer información entre empresas.",
    ],
    nextActions: [
      "Definir métricas MVP.",
      "Crear endpoint de reportes.",
      "Agregar filtros mínimos.",
    ],
  },
  {
    id: "mvp-web-widget",
    title: "Widget web público",
    category: "widget",
    status: "requires_backend",
    priority: "critical",
    dependencyLevel: "hard",
    description:
      "El widget web es clave para el MVP, pero requiere backend real, configuración pública segura y manejo de conversaciones.",
    whyIncludedOrExcluded: [
      "Es la forma más clara de usar ORBI en una web real.",
      "Permite capturar consultas desde visitantes.",
      "Requiere seguridad y aislamiento por empresa.",
    ],
    requiredForMvp: [
      "Public key por empresa.",
      "Endpoint público seguro.",
      "Configuración pública limitada.",
      "Rate limiting.",
      "Consentimiento visible.",
    ],
    risks: [
      "Exposición pública a abuso o spam.",
      "Filtración de configuración interna.",
      "Uso sin consentimiento.",
    ],
    nextActions: [
      "Diseñar public widget endpoint.",
      "Definir límites de uso.",
      "Preparar script embed seguro.",
    ],
  },
  {
    id: "mvp-security-minimum",
    title: "Seguridad mínima MVP",
    category: "security",
    status: "include_mvp",
    priority: "critical",
    dependencyLevel: "hard",
    description:
      "El MVP no puede avanzar sin autenticación, roles, permisos y protección básica de datos.",
    whyIncludedOrExcluded: [
      "Es obligatorio para uso con empresas.",
      "Protege datos y configuración.",
      "Permite separar empresas y usuarios.",
    ],
    requiredForMvp: [
      "Autenticación real.",
      "RBAC básico.",
      "Validación server-side.",
      "Gestión de secretos.",
      "Protección de endpoints.",
    ],
    risks: [
      "Acceso no autorizado.",
      "Cruce de datos entre empresas.",
      "Exposición de credenciales.",
    ],
    nextActions: [
      "Definir proveedor auth.",
      "Implementar permisos en backend.",
      "Auditar endpoints críticos.",
    ],
  },
  {
    id: "mvp-privacy-minimum",
    title: "Privacidad y consentimiento mínimo",
    category: "privacy",
    status: "include_mvp",
    priority: "critical",
    dependencyLevel: "hard",
    description:
      "El MVP debe incluir consentimiento claro, política de datos y cuidado especial con conversaciones y leads.",
    whyIncludedOrExcluded: [
      "Se manejarán datos de contacto y mensajes.",
      "Es necesario para operar con clientes reales.",
      "Reduce riesgo legal y reputacional.",
    ],
    requiredForMvp: [
      "Aviso de consentimiento en widget.",
      "Política de datos inicial.",
      "Retención mínima definida.",
      "Opción de eliminación o anonimización futura.",
    ],
    risks: [
      "Uso de datos personales sin base clara.",
      "Exportaciones indebidas.",
      "Promesas legales no revisadas.",
    ],
    nextActions: [
      "Preparar textos legales iniciales.",
      "Revisar normativa del país objetivo.",
      "Definir retención de conversaciones y leads.",
    ],
  },
  {
    id: "mvp-whatsapp",
    title: "WhatsApp Business real",
    category: "integrations",
    status: "future_phase",
    priority: "high",
    dependencyLevel: "hard",
    description:
      "WhatsApp Business es muy valioso, pero debe quedar fuera del primer MVP si aún no existe backend, proveedor oficial y webhook seguro.",
    whyIncludedOrExcluded: [
      "Requiere integración oficial.",
      "Aumenta complejidad técnica y legal.",
      "Debe implementarse después del widget web estable.",
    ],
    requiredForMvp: [
      "No requerido para MVP inicial.",
      "Mantener solo como roadmap.",
      "Conservar simulación conceptual en demo.",
    ],
    risks: [
      "Prometer canal no disponible.",
      "Manejo inseguro de mensajes reales.",
      "Complejidad de webhook y estados de entrega.",
    ],
    nextActions: [
      "Dejar WhatsApp como fase 2.",
      "Documentar requisitos oficiales.",
      "Preparar arquitectura webhook futura.",
    ],
  },
  {
    id: "mvp-demo-modules",
    title: "Módulos comerciales de demo",
    category: "demo_only",
    status: "demo_only",
    priority: "medium",
    dependencyLevel: "none",
    description:
      "Los módulos de storyline, pitch, demo live, feedback y demo package deben mantenerse como soporte comercial, no como funciones obligatorias del MVP productivo.",
    whyIncludedOrExcluded: [
      "Son útiles para vender y explicar.",
      "No son parte del uso diario del cliente final.",
      "Deben mantenerse separados de la operación productiva.",
    ],
    requiredForMvp: [
      "No requeridos en runtime productivo.",
      "Pueden quedar en modo admin o demo.",
      "No deben exponerse al visitante público.",
    ],
    risks: [
      "Sobrecargar la app productiva.",
      "Confundir módulos demo con operación real.",
      "Aumentar complejidad visual innecesaria.",
    ],
    nextActions: [
      "Separar modo demo/admin de modo productivo.",
      "Mantener demo package como herramienta interna.",
      "Ocultar módulos comerciales al usuario final.",
    ],
  },
];

export function buildMvpScopeSummary(items: MvpScopeItem[]) {
  const total = items.length;

  const includeMvp = items.filter(
    (item) => item.status === "include_mvp"
  ).length;

  const requiresBackend = items.filter(
    (item) => item.status === "requires_backend"
  ).length;

  const futurePhase = items.filter(
    (item) => item.status === "future_phase"
  ).length;

  const demoOnly = items.filter((item) => item.status === "demo_only").length;

  const critical = items.filter((item) => item.priority === "critical").length;

  const hardDependencies = items.filter(
    (item) => item.dependencyLevel === "hard"
  ).length;

  return {
    total,
    includeMvp,
    requiresBackend,
    futurePhase,
    demoOnly,
    critical,
    hardDependencies,
  };
}

export function buildMvpScopeText(params: {
  profile: CompanyProfile;
  items: MvpScopeItem[];
  summary: ReturnType<typeof buildMvpScopeSummary>;
}): string {
  const { profile, items, summary } = params;

  const itemText = items
    .map((item) => {
      return `MVP ITEM: ${item.title}
Categoría: ${MVP_SCOPE_CATEGORY_LABELS[item.category]}
Estado: ${MVP_SCOPE_STATUS_LABELS[item.status]}
Prioridad: ${MVP_SCOPE_PRIORITY_LABELS[item.priority]}
Dependencia: ${MVP_SCOPE_DEPENDENCY_LABELS[item.dependencyLevel]}

Descripción:
${item.description}

Motivo:
${item.whyIncludedOrExcluded.map((point) => `- ${point}`).join("\n")}

Requerido para MVP:
${item.requiredForMvp.map((req) => `- ${req}`).join("\n")}

Riesgos:
${item.risks.map((risk) => `- ${risk}`).join("\n")}

Próximas acciones:
${item.nextActions.map((action) => `- ${action}`).join("\n")}`;
    })
    .join("\n\n---\n\n");

  return `MVP SCOPE — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

RESUMEN
Ítems evaluados: ${summary.total}
Incluir en MVP: ${summary.includeMvp}
Requieren backend: ${summary.requiresBackend}
Fase futura: ${summary.futurePhase}
Solo demo: ${summary.demoOnly}
Prioridad crítica: ${summary.critical}
Dependencias fuertes: ${summary.hardDependencies}

DETALLE
${itemText}

NOTA
Este alcance MVP es conceptual. No crea backend, no conecta APIs, no crea base de datos, no modifica localStorage y no convierte la demo en producción real.`;
}

export type MvpRoadmapPhaseStatus =
  | "planned"
  | "ready_to_start"
  | "blocked"
  | "future"
  | "completed_concept";

export type MvpRoadmapPhaseRisk = "low" | "medium" | "high" | "critical";

export type MvpRoadmapPhase = {
  id: string;
  order: number;
  title: string;
  status: MvpRoadmapPhaseStatus;
  risk: MvpRoadmapPhaseRisk;
  estimatedComplexity: "low" | "medium" | "high";
  objective: string;
  includedScope: string[];
  dependencies: string[];
  exitCriteria: string[];
  blockingRisks: string[];
  recommendedDecision: string;
};

export type MvpScopeClosureItem = {
  id: string;
  title: string;
  completed: boolean;
  description: string;
};

export const MVP_ROADMAP_PHASE_STATUS_LABELS: Record<
  MvpRoadmapPhaseStatus,
  string
> = {
  planned: "Planificado",
  ready_to_start: "Listo para iniciar",
  blocked: "Bloqueado",
  future: "Fase futura",
  completed_concept: "Concepto cerrado",
};

export const MVP_ROADMAP_PHASE_RISK_LABELS: Record<MvpRoadmapPhaseRisk, string> = {
  low: "Bajo",
  medium: "Medio",
  high: "Alto",
  critical: "Crítico",
};

export const MVP_ROADMAP_PHASES: MvpRoadmapPhase[] = [
  {
    id: "mvp-phase-01-product-scope",
    order: 1,
    title: "Cierre de alcance MVP",
    status: "completed_concept",
    risk: "low",
    estimatedComplexity: "medium",
    objective:
      "Definir qué entra al MVP, qué queda como demo, qué requiere backend y qué se posterga.",
    includedScope: [
      "Matriz MVP Scope.",
      "Priorización de funciones críticas.",
      "Separación entre demo comercial y operación productiva.",
      "Identificación de dependencias fuertes.",
    ],
    dependencies: [
      "Bloque 0J cerrado.",
      "Matriz MVP Scope 0K-1A.",
      "Readiness conceptual del bloque 0I.",
    ],
    exitCriteria: [
      "Alcance mínimo definido.",
      "WhatsApp real movido a fase futura.",
      "Módulos comerciales separados de runtime productivo.",
      "Riesgos críticos visibles.",
    ],
    blockingRisks: [
      "Intentar llevar toda la demo completa al MVP.",
      "Confundir demo comercial con producto operativo.",
    ],
    recommendedDecision:
      "Cerrar alcance MVP inicial y avanzar a diseño técnico productivo controlado.",
  },
  {
    id: "mvp-phase-02-backend-foundation",
    order: 2,
    title: "Fundación backend segura",
    status: "ready_to_start",
    risk: "critical",
    estimatedComplexity: "high",
    objective:
      "Diseñar la base server-side mínima para empresas, usuarios, conversaciones, leads y configuración segura.",
    includedScope: [
      "API backend inicial.",
      "Base de datos real.",
      "Modelo multiempresa.",
      "Autenticación.",
      "Roles mínimos.",
      "Validación server-side.",
    ],
    dependencies: [
      "Modelo de datos conceptual 0I.",
      "Contratos API conceptuales.",
      "Matriz de roles y permisos.",
      "Decisión de stack backend.",
    ],
    exitCriteria: [
      "Backend base definido.",
      "Esquema de datos inicial aprobado.",
      "Autenticación mínima definida.",
      "Separación por empresa diseñada.",
    ],
    blockingRisks: [
      "Exponer datos entre empresas.",
      "Conectar frontend a servicios reales sin backend seguro.",
      "No definir gestión de secretos.",
    ],
    recommendedDecision:
      "Priorizar backend seguro antes de cualquier integración externa o widget público real.",
  },
  {
    id: "mvp-phase-03-core-chat-leads",
    order: 3,
    title: "Chat, conversaciones y leads reales",
    status: "planned",
    risk: "high",
    estimatedComplexity: "high",
    objective:
      "Convertir el flujo principal de chat y leads desde prototipo local hacia operación persistente controlada.",
    includedScope: [
      "Conversaciones persistentes.",
      "Mensajes asociados a empresa.",
      "Leads básicos.",
      "Prioridad de lead.",
      "Estado de seguimiento.",
      "Derivación humana básica.",
    ],
    dependencies: [
      "Backend base.",
      "Base de datos.",
      "Autenticación.",
      "Modelo Lead and Conversation.",
    ],
    exitCriteria: [
      "Una conversación puede registrarse en backend.",
      "Un lead puede crearse y consultarse.",
      "El lead queda asociado a empresa y conversación.",
      "Existe control mínimo de acceso.",
    ],
    blockingRisks: [
      "Persistir datos sin consentimiento.",
      "Duplicar leads sin control.",
      "No separar información por empresa.",
    ],
    recommendedDecision:
      "Implementar primero flujo simple y auditable antes de agregar automatizaciones avanzadas.",
  },
  {
    id: "mvp-phase-04-widget-public",
    order: 4,
    title: "Widget web público controlado",
    status: "planned",
    risk: "critical",
    estimatedComplexity: "high",
    objective:
      "Crear un widget web mínimo, seguro y embebible para capturar consultas desde una página empresarial.",
    includedScope: [
      "Script embed seguro.",
      "Identificador público por empresa.",
      "Configuración pública limitada.",
      "Consentimiento visible.",
      "Rate limiting.",
      "Fallback humano.",
    ],
    dependencies: [
      "Backend seguro.",
      "Empresa configurada.",
      "Endpoint público controlado.",
      "Políticas de privacidad mínimas.",
    ],
    exitCriteria: [
      "Widget puede cargar configuración pública.",
      "Widget puede enviar mensaje a backend.",
      "No expone datos internos.",
      "Tiene aviso de consentimiento.",
    ],
    blockingRisks: [
      "Spam o abuso del endpoint público.",
      "Exposición de datos internos.",
      "Falta de límites de uso.",
    ],
    recommendedDecision:
      "Activar widget real solo cuando backend, privacidad and seguridad mínima estén listos.",
  },
  {
    id: "mvp-phase-05-admin-reporting",
    order: 5,
    title: "Panel admin y reportes básicos",
    status: "planned",
    risk: "medium",
    estimatedComplexity: "medium",
    objective:
      "Crear una consola mínima para que una empresa revise conversaciones, leads, métricas y derivaciones.",
    includedScope: [
      "Bandeja de conversaciones.",
      "Lista de leads.",
      "Filtros básicos.",
      "Métricas comerciales.",
      "Derivaciones humanas.",
    ],
    dependencies: [
      "Conversaciones persistentes.",
      "Leads persistentes.",
      "Roles de usuario.",
      "Reportes backend.",
    ],
    exitCriteria: [
      "Admin puede revisar leads.",
      "Admin puede filtrar por prioridad o estado.",
      "Métricas básicas son consistentes.",
      "No se muestran datos de otras empresas.",
    ],
    blockingRisks: [
      "Métricas incorrectas.",
      "Permisos mal aplicados.",
      "Saturar el MVP con demasiados paneles.",
    ],
    recommendedDecision:
      "Mantener reportes mínimos y útiles, evitando recrear toda la demo comercial dentro del MVP operativo.",
  },
  {
    id: "mvp-phase-06-future-integrations",
    order: 6,
    title: "Integraciones futuras",
    status: "future",
    risk: "high",
    estimatedComplexity: "high",
    objective:
      "Dejar WhatsApp Business, CRM, correos y automatizaciones como fases posteriores al MVP inicial.",
    includedScope: [
      "WhatsApp Business oficial futuro.",
      "CRM futuro.",
      "Correos futuros.",
      "Webhooks productivos.",
      "Automatizaciones avanzadas.",
    ],
    dependencies: [
      "MVP web estable.",
      "Backend seguro.",
      "Políticas legales revisadas.",
      "Proveedor oficial por integración.",
    ],
    exitCriteria: [
      "No entran en el MVP inicial.",
      "Quedan documentadas como roadmap.",
      "No se prometen como activas en la demo.",
    ],
    blockingRisks: [
      "Sobrecargar el MVP.",
      "Aumentar riesgo legal y técnico.",
      "Prometer integraciones no disponibles.",
    ],
    recommendedDecision:
      "Mantener integraciones externas fuera del MVP inicial y priorizar primero widget web controlado.",
  },
];

export const MVP_SCOPE_CLOSURE_ITEMS: MvpScopeClosureItem[] = [
  {
    id: "mvp-closure-scope-defined",
    title: "Alcance MVP definido",
    completed: true,
    description:
      "Se definió qué funciones entran al MVP, cuáles requieren backend, cuáles quedan como demo y cuáles pasan a fase futura.",
  },
  {
    id: "mvp-closure-backend-required",
    title: "Backend identificado como dependencia crítica",
    completed: true,
    description:
      "Se confirmó que el MVP requiere backend real antes de widget público, persistencia, leads reales o integraciones.",
  },
  {
    id: "mvp-closure-whatsapp-future",
    title: "WhatsApp real queda como fase futura",
    completed: true,
    description:
      "WhatsApp Business no entra al MVP inicial y se mantiene como integración posterior con proveedor oficial y webhook seguro.",
  },
  {
    id: "mvp-closure-demo-separated",
    title: "Demo comercial separada del runtime productivo",
    completed: true,
    description:
      "Los módulos del bloque 0J se mantienen como soporte comercial y no como funciones obligatorias del cliente final.",
  },
  {
    id: "mvp-closure-security-first",
    title: "Seguridad y privacidad primero",
    completed: true,
    description:
      "El roadmap establece autenticación, roles, aislamiento multiempresa, consentimiento y políticas mínimas como condiciones para avanzar.",
  },
];

export function buildMvpRoadmapSummary(phases: MvpRoadmapPhase[]) {
  const total = phases.length;

  const readyToStart = phases.filter(
    (phase) => phase.status === "ready_to_start"
  ).length;

  const planned = phases.filter((phase) => phase.status === "planned").length;

  const future = phases.filter((phase) => phase.status === "future").length;

  const criticalRisk = phases.filter((phase) => phase.risk === "critical").length;

  const highComplexity = phases.filter(
    (phase) => phase.estimatedComplexity === "high"
  ).length;

  return {
    total,
    readyToStart,
    planned,
    future,
    criticalRisk,
    highComplexity,
  };
}

export function buildMvpScopeClosureSummary(items: MvpScopeClosureItem[]) {
  const total = items.length;
  const completed = items.filter((item) => item.completed).length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    total,
    completed,
    progress,
  };
}

export function buildMvpRoadmapText(params: {
  profile: CompanyProfile;
  phases: MvpRoadmapPhase[];
  closureItems: MvpScopeClosureItem[];
  roadmapSummary: ReturnType<typeof buildMvpRoadmapSummary>;
  closureSummary: ReturnType<typeof buildMvpScopeClosureSummary>;
}): string {
  const {
    profile,
    phases,
    closureItems,
    roadmapSummary,
    closureSummary,
  } = params;

  const phasesText = phases
    .map((phase) => {
      return `FASE ${phase.order}: ${phase.title}
Estado: ${MVP_ROADMAP_PHASE_STATUS_LABELS[phase.status]}
Riesgo: ${MVP_ROADMAP_PHASE_RISK_LABELS[phase.risk]}
Complejidad: ${phase.estimatedComplexity}

Objetivo:
${phase.objective}

Alcance incluido:
${phase.includedScope.map((item) => `- ${item}`).join("\n")}

Dependencias:
${phase.dependencies.map((item) => `- ${item}`).join("\n")}

Criterios de salida:
${phase.exitCriteria.map((item) => `- ${item}`).join("\n")}

Riesgos bloqueantes:
${phase.blockingRisks.map((item) => `- ${item}`).join("\n")}

Decisión recomendada:
${phase.recommendedDecision}`;
    })
    .join("\n\n---\n\n");

  const closureText = closureItems
    .map((item) => {
      return `${item.completed ? "✓" : "○"} ${item.title}
${item.description}`;
    })
    .join("\n\n");

  return `MVP ROADMAP — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

RESUMEN ROADMAP
Fases totales: ${roadmapSummary.total}
Listas para iniciar: ${roadmapSummary.readyToStart}
Planificadas: ${roadmapSummary.planned}
Futuras: ${roadmapSummary.future}
Riesgo crítico: ${roadmapSummary.criticalRisk}
Alta complejidad: ${roadmapSummary.highComplexity}

CIERRE DE ALCANCE
Cierre completado: ${closureSummary.completed}/${closureSummary.total}
Progreso: ${closureSummary.progress}%

FASES
${phasesText}

CIERRE
${closureText}

NOTA
Este roadmap MVP es conceptual. No crea backend, no conecta APIs, no crea base de datos, no modifica localStorage, no conecta WhatsApp real y no convierte la demo en producción.`;
}

export type BackendFoundationCategory =
  | "api_gateway"
  | "auth"
  | "database"
  | "tenant_isolation"
  | "security"
  | "conversation_engine"
  | "lead_engine"
  | "widget_runtime"
  | "observability"
  | "forbidden_frontend";

export type BackendFoundationStatus =
  | "required_mvp"
  | "critical_dependency"
  | "planned"
  | "future"
  | "forbidden";

export type BackendFoundationRisk = "low" | "medium" | "high" | "critical";

export type BackendFoundationComponent = {
  id: string;
  title: string;
  category: BackendFoundationCategory;
  status: BackendFoundationStatus;
  risk: BackendFoundationRisk;
  objective: string;
  responsibilities: string[];
  minimumRequirements: string[];
  dependencies: string[];
  risks: string[];
  safeBoundaries: string[];
};

export const BACKEND_FOUNDATION_CATEGORY_LABELS: Record<
  BackendFoundationCategory,
  string
> = {
  api_gateway: "API Gateway",
  auth: "Autenticación",
  database: "Base de datos",
  tenant_isolation: "Aislamiento multiempresa",
  security: "Seguridad",
  conversation_engine: "Motor conversaciones",
  lead_engine: "Motor leads",
  widget_runtime: "Runtime widget",
  observability: "Observabilidad",
  forbidden_frontend: "Prohibido frontend",
};

export const BACKEND_FOUNDATION_STATUS_LABELS: Record<
  BackendFoundationStatus,
  string
> = {
  required_mvp: "Requerido MVP",
  critical_dependency: "Dependencia crítica",
  planned: "Planificado",
  future: "Fase futura",
  forbidden: "Prohibido",
};

export const BACKEND_FOUNDATION_RISK_LABELS: Record<BackendFoundationRisk, string> = {
  low: "Bajo",
  medium: "Medio",
  high: "Alto",
  critical: "Crítico",
};

export const BACKEND_FOUNDATION_BASE_COMPONENTS: BackendFoundationComponent[] = [
  {
    id: "backend-api-gateway",
    title: "API Gateway MVP",
    category: "api_gateway",
    status: "required_mvp",
    risk: "critical",
    objective:
      "Centralizar todas las solicitudes del frontend productivo hacia un backend seguro, evitando conexiones directas desde la interfaz a servicios sensibles.",
    responsibilities: [
      "Recibir solicitudes del frontend.",
      "Validar payloads.",
      "Separar endpoints públicos y privados.",
      "Normalizar respuestas y errores.",
    ],
    minimumRequirements: [
      "Endpoints versionados.",
      "Validación server-side.",
      "Manejo de errores seguro.",
      "Rate limiting mínimo para endpoints públicos.",
    ],
    dependencies: [
      "Decisión de stack backend.",
      "Modelo de datos inicial.",
      "Sistema de autenticación.",
      "Política de seguridad base.",
    ],
    risks: [
      "Exponer endpoints sin validación.",
      "Permitir operaciones sensibles desde frontend.",
      "No separar rutas públicas del widget y rutas internas.",
    ],
    safeBoundaries: [
      "No conectar servicios externos directamente desde frontend.",
      "No exponer secretos en variables públicas.",
      "No crear endpoints sin validación server-side.",
    ],
  },
  {
    id: "backend-auth-rbac",
    title: "Autenticación y RBAC mínimo",
    category: "auth",
    status: "critical_dependency",
    risk: "critical",
    objective:
      "Definir una base de autenticación y permisos para usuarios internos, administradores de empresa y roles técnicos.",
    responsibilities: [
      "Identificar usuarios.",
      "Asignar empresa activa.",
      "Controlar permisos por rol.",
      "Proteger vistas administrativas.",
      "Evitar acceso cruzado entre empresas.",
    ],
    minimumRequirements: [
      "Login real.",
      "Sesión segura.",
      "Roles mínimos.",
      "Permisos por empresa.",
      "Validación de permisos en backend.",
    ],
    dependencies: [
      "Modelo User.",
      "Modelo Company.",
      "Modelo Role.",
      "Backend API Gateway.",
    ],
    risks: [
      "Usuarios viendo datos de otra empresa.",
      "Permisos aplicados solo en frontend.",
      "Sesiones inseguras o mal expiradas.",
    ],
    safeBoundaries: [
      "No confiar en permisos visuales del frontend.",
      "No guardar tokens inseguros.",
      "No habilitar administración sin RBAC backend.",
    ],
  },
  {
    id: "backend-database-core",
    title: "Base de datos MVP",
    category: "database",
    status: "required_mvp",
    risk: "critical",
    objective:
      "Persistir empresas, usuarios, conversaciones, mensajes, leads y configuraciones de forma segura y auditable.",
    responsibilities: [
      "Guardar entidades base.",
      "Relacionar conversaciones con empresa.",
      "Relacionar leads con conversación.",
      "Guardar configuración empresarial.",
      "Permitir reportes básicos.",
    ],
    minimumRequirements: [
      "Company.",
      "User.",
      "Role.",
      "Conversation.",
      "Message.",
      "Lead.",
      "CompanyService.",
      "HumanContact.",
      "AuditLog mínimo.",
    ],
    dependencies: [
      "Modelo multiempresa.",
      "Autenticación.",
      "Criterios de retención.",
      "Estrategia de backups futura.",
    ],
    risks: [
      "Diseño que no soporte multiempresa.",
      "Pérdida de trazabilidad.",
      "Datos personales sin retención definida.",
    ],
    safeBoundaries: [
      "No usar localStorage como base productiva.",
      "No guardar datos sensibles sin política.",
      "No mezclar datos de empresas distintas.",
    ],
  },
  {
    id: "backend-tenant-isolation",
    title: "Aislamiento multiempresa",
    category: "tenant_isolation",
    status: "critical_dependency",
    risk: "critical",
    objective:
      "Garantizar que cada empresa vea únicamente sus configuraciones, conversaciones, leads y reportes.",
    responsibilities: [
      "Aplicar companyId en entidades críticas.",
      "Filtrar datos por empresa en backend.",
      "Validar permisos antes de cada lectura o escritura.",
      "Evitar exposición accidental entre empresas.",
    ],
    minimumRequirements: [
      "companyId obligatorio.",
      "Queries filtradas por empresa.",
      "Validación de pertenencia.",
      "Pruebas de aislamiento.",
    ],
    dependencies: [
      "Modelo Company.",
      "Auth real.",
      "RBAC.",
      "Base de datos.",
    ],
    risks: [
      "Cruce de datos entre clientes.",
      "Exposición de leads o conversaciones ajenas.",
      "Daño reputacional grave.",
    ],
    safeBoundaries: [
      "Nunca filtrar multiempresa solo en frontend.",
      "No exponer IDs internos innecesarios.",
      "No permitir queries globales sin rol ORBI autorizado.",
    ],
  },
  {
    id: "backend-security-minimum",
    title: "Seguridad mínima backend",
    category: "security",
    status: "critical_dependency",
    risk: "critical",
    objective:
      "Definir controles mínimos de seguridad antes de cualquier operación real con empresas o visitantes.",
    responsibilities: [
      "Validar entradas.",
      "Proteger endpoints.",
      "Gestionar secretos.",
      "Registrar eventos relevantes.",
      "Prevenir abusos básicos.",
    ],
    minimumRequirements: [
      "Validación server-side.",
      "Gestión de secretos.",
      "CORS controlado.",
      "Rate limiting.",
      "Logs de seguridad.",
      "Errores no sensibles.",
    ],
    dependencies: [
      "Backend stack.",
      "API Gateway.",
      "Auth.",
      "Observabilidad futura.",
    ],
    risks: [
      "Exposición de secretos.",
      "Inyección de payloads maliciosos.",
      "Errores revelando información sensible.",
    ],
    safeBoundaries: [
      "No poner API keys en frontend.",
      "No mostrar stack traces al usuario.",
      "No crear rutas públicas sin límites.",
    ],
  },
];

export function buildBackendFoundationBaseSummary(
  components: BackendFoundationComponent[]
) {
  const total = components.length;

  const requiredMvp = components.filter(
    (component) => component.status === "required_mvp"
  ).length;

  const criticalDependencies = components.filter(
    (component) => component.status === "critical_dependency"
  ).length;

  const criticalRisk = components.filter(
    (component) => component.risk === "critical"
  ).length;

  return {
    total,
    requiredMvp,
    criticalDependencies,
    criticalRisk,
  };
}

export function buildBackendFoundationBaseText(params: {
  profile: CompanyProfile;
  components: BackendFoundationComponent[];
  summary: ReturnType<typeof buildBackendFoundationBaseSummary>;
}): string {
  const { profile, components, summary } = params;

  const componentsText = components
    .map((component) => {
      return `COMPONENTE BACKEND: ${component.title}
Categoría: ${BACKEND_FOUNDATION_CATEGORY_LABELS[component.category]}
Estado: ${BACKEND_FOUNDATION_STATUS_LABELS[component.status]}
Riesgo: ${BACKEND_FOUNDATION_RISK_LABELS[component.risk]}

Objetivo:
${component.objective}

Responsabilidades:
${component.responsibilities.map((item) => `- ${item}`).join("\n")}

Requisitos mínimos:
${component.minimumRequirements.map((item) => `- ${item}`).join("\n")}

Dependencias:
${component.dependencies.map((item) => `- ${item}`).join("\n")}

Riesgos:
${component.risks.map((item) => `- ${item}`).join("\n")}

Límites seguros:
${component.safeBoundaries.map((item) => `- ${item}`).join("\n")}`;
    })
    .join("\n\n---\n\n");

  return `BACKEND FOUNDATION BASE — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

RESUMEN
Componentes base: ${summary.total}
Requeridos MVP: ${summary.requiredMvp}
Dependencias críticas: ${summary.criticalDependencies}
Riesgo crítico: ${summary.criticalRisk}

DETALLE
${componentsText}

NOTA
Este plan backend base es conceptual. No crea backend real, no conecta APIs, no crea base de datos, no modifica localStorage, no conecta WhatsApp real y no despliega servicios.`;
}

export const BACKEND_FOUNDATION_EXTENSION_COMPONENTS: BackendFoundationComponent[] = [
  {
    id: "backend-conversation-engine",
    title: "Motor de conversaciones MVP",
    category: "conversation_engine",
    status: "required_mvp",
    risk: "high",
    objective:
      "Gestionar conversaciones y mensajes de forma persistente, segura y asociada a una empresa.",
    responsibilities: [
      "Crear conversación.",
      "Guardar mensajes.",
      "Asociar canal de origen.",
      "Registrar estado de conversación.",
      "Soportar análisis posterior.",
    ],
    minimumRequirements: [
      "Entidad Conversation.",
      "Entidad Message.",
      "Estado básico de conversación.",
      "Canal de origen.",
      "Timestamps.",
      "Relación obligatoria con empresa.",
    ],
    dependencies: [
      "API Gateway.",
      "Base de datos MVP.",
      "Aislamiento multiempresa.",
      "Política de privacidad mínima.",
    ],
    risks: [
      "Guardar mensajes sin consentimiento.",
      "No controlar contenido sensible.",
      "Duplicar conversaciones.",
      "No asociar conversación a empresa correcta.",
    ],
    safeBoundaries: [
      "No activar atención productiva sin consentimiento visible.",
      "No guardar conversaciones reales en prototipo local.",
      "No conectar canales externos en esta etapa.",
    ],
  },
  {
    id: "backend-lead-engine",
    title: "Motor de leads MVP",
    category: "lead_engine",
    status: "required_mvp",
    risk: "high",
    objective:
      "Convertir conversaciones relevantes en oportunidades comerciales trazables y revisables por humanos.",
    responsibilities: [
      "Crear lead desde conversación.",
      "Asignar prioridad.",
      "Guardar resumen comercial.",
      "Registrar estado de seguimiento.",
      "Permitir derivación humana.",
    ],
    minimumRequirements: [
      "Entidad Lead.",
      "Estado de lead.",
      "Prioridad.",
      "Relación con Conversation.",
      "Notas internas.",
      "Fecha de creación.",
    ],
    dependencies: [
      "Motor de conversaciones.",
      "Base de datos MVP.",
      "RBAC.",
      "Política de datos personales.",
    ],
    risks: [
      "Crear leads duplicados.",
      "Priorizar mal casos sensibles.",
      "Exponer datos de contacto sin control.",
      "Automatizar decisiones sin revisión humana.",
    ],
    safeBoundaries: [
      "No automatizar decisiones comerciales críticas sin revisión humana.",
      "No enviar leads a CRM externo todavía.",
      "No usar datos reales sin consentimiento.",
    ],
  },
  {
    id: "backend-widget-runtime",
    title: "Runtime seguro para widget web",
    category: "widget_runtime",
    status: "planned",
    risk: "critical",
    objective:
      "Preparar la base conceptual para un widget público embebible que pueda operar de forma segura desde una web empresarial.",
    responsibilities: [
      "Cargar configuración pública limitada.",
      "Recibir mensajes desde visitantes.",
      "Aplicar rate limiting.",
      "Mostrar consentimiento visible.",
      "Crear conversación pública controlada.",
    ],
    minimumRequirements: [
      "Public company key.",
      "Endpoint público separado.",
      "Configuración pública sanitizada.",
      "Rate limiting.",
      "Consentimiento visible.",
      "Protección anti-abuso.",
    ],
    dependencies: [
      "API Gateway.",
      "Aislamiento multiempresa.",
      "Privacidad mínima.",
      "Motor de conversaciones.",
    ],
    risks: [
      "Abuso del widget público.",
      "Spam.",
      "Exposición de configuración interna.",
      "Captura de datos sin consentimiento.",
    ],
    safeBoundaries: [
      "No publicar widget real sin backend seguro.",
      "No exponer configuración interna.",
      "No habilitar mensajes públicos sin rate limiting.",
    ],
  },
  {
    id: "backend-observability-minimum",
    title: "Observabilidad MVP",
    category: "observability",
    status: "planned",
    risk: "medium",
    objective:
      "Registrar eventos mínimos para detectar errores, actividad anómala y comportamiento comercial básico.",
    responsibilities: [
      "Registrar eventos de conversación.",
      "Registrar creación de leads.",
      "Registrar accesos administrativos.",
      "Registrar errores críticos.",
      "Preparar auditoría mínima.",
    ],
    minimumRequirements: [
      "AuditLog mínimo.",
      "Error logs.",
      "Eventos de seguridad.",
      "Eventos de lead.",
      "Eventos de configuración.",
    ],
    dependencies: [
      "Base de datos MVP.",
      "API Gateway.",
      "Modelo AuditLog.",
      "Política de retención.",
    ],
    risks: [
      "No detectar errores productivos.",
      "No saber quién modificó configuración.",
      "Guardar logs con datos sensibles en exceso.",
    ],
    safeBoundaries: [
      "No registrar datos sensibles innecesarios.",
      "No depender solo de consola del navegador.",
      "No operar producción sin trazabilidad mínima.",
    ],
  },
  {
    id: "backend-forbidden-frontend",
    title: "Operaciones prohibidas desde frontend",
    category: "forbidden_frontend",
    status: "forbidden",
    risk: "critical",
    objective:
      "Dejar explícito qué acciones no deben implementarse nunca directamente desde el frontend productivo.",
    responsibilities: [
      "Bloquear exposición de secretos.",
      "Evitar conexiones directas a servicios externos sensibles.",
      "Evitar escritura directa en bases de datos.",
      "Evitar integración directa con WhatsApp o CRM desde cliente.",
    ],
    minimumRequirements: [
      "Todas las operaciones sensibles deben pasar por backend.",
      "Ninguna API key secreta en frontend.",
      "Ningún webhook productivo manejado en cliente.",
      "Ninguna escritura productiva directa desde navegador.",
    ],
    dependencies: [
      "Backend seguro.",
      "Gestión de secretos.",
      "Diseño de API.",
    ],
    risks: [
      "Filtración de credenciales.",
      "Manipulación de datos.",
      "Abuso de endpoints externos.",
      "Incumplimiento de privacidad.",
    ],
    safeBoundaries: [
      "No conectar WhatsApp real desde frontend.",
      "No conectar CRM real desde frontend.",
      "No escribir directo en base de datos desde frontend.",
      "No guardar secretos en variables públicas.",
    ],
  },
];

export function buildBackendFoundationExtensionSummary(
  components: BackendFoundationComponent[]
) {
  const total = components.length;

  const requiredMvp = components.filter(
    (component) => component.status === "required_mvp"
  ).length;

  const planned = components.filter(
    (component) => component.status === "planned"
  ).length;

  const forbidden = components.filter(
    (component) => component.status === "forbidden"
  ).length;

  const criticalRisk = components.filter(
    (component) => component.risk === "critical"
  ).length;

  return {
    total,
    requiredMvp,
    planned,
    forbidden,
    criticalRisk,
  };
}

export function buildBackendFoundationExtensionText(params: {
  profile: CompanyProfile;
  components: BackendFoundationComponent[];
  summary: ReturnType<typeof buildBackendFoundationExtensionSummary>;
}): string {
  const { profile, components, summary } = params;

  const componentsText = components
    .map((component) => {
      return `COMPONENTE BACKEND: ${component.title}
Categoría: ${BACKEND_FOUNDATION_CATEGORY_LABELS[component.category]}
Estado: ${BACKEND_FOUNDATION_STATUS_LABELS[component.status]}
Riesgo: ${BACKEND_FOUNDATION_RISK_LABELS[component.risk]}

Objetivo:
${component.objective}

Responsabilidades:
${component.responsibilities.map((item) => `- ${item}`).join("\n")}

Requisitos mínimos:
${component.minimumRequirements.map((item) => `- ${item}`).join("\n")}

Dependencias:
${component.dependencies.map((item) => `- ${item}`).join("\n")}

Riesgos:
${component.risks.map((item) => `- ${item}`).join("\n")}

Límites seguros:
${component.safeBoundaries.map((item) => `- ${item}`).join("\n")}`;
    })
    .join("\n\n---\n\n");

  return `BACKEND FOUNDATION EXTENSIÓN — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

RESUMEN
Componentes de extensión: ${summary.total}
Requeridos MVP: ${summary.requiredMvp}
Planificados: ${summary.planned}
Prohibidos frontend: ${summary.forbidden}
Riesgo crítico: ${summary.criticalRisk}

DETALLE
${componentsText}

NOTA
Este plan backend de extensión es conceptual. No crea backend real, no conecta APIs, no crea base de datos, no modifica localStorage, no conecta WhatsApp real y no despliega servicios.`;
}

export type BackendDataEntityCategory =
  | "tenant"
  | "user_access"
  | "conversation"
  | "lead"
  | "configuration"
  | "audit";

export type BackendDataSensitivity =
  | "public"
  | "internal"
  | "personal"
  | "sensitive";

export type BackendDataEntityStatus =
  | "required_mvp"
  | "recommended_mvp"
  | "future"
  | "audit_required";

export type BackendDataField = {
  name: string;
  type: string;
  required: boolean;
  description: string;
};

export type BackendDataRelation = {
  targetEntity: string;
  relationType: "one_to_one" | "one_to_many" | "many_to_one" | "many_to_many";
  description: string;
};

export type BackendDataEntity = {
  id: string;
  name: string;
  category: BackendDataEntityCategory;
  status: BackendDataEntityStatus;
  sensitivity: BackendDataSensitivity;
  objective: string;
  fields: BackendDataField[];
  relations: BackendDataRelation[];
  risks: string[];
  securityRules: string[];
};

export const BACKEND_DATA_ENTITY_CATEGORY_LABELS: Record<
  BackendDataEntityCategory,
  string
> = {
  tenant: "Empresa / Tenant",
  user_access: "Usuarios y acceso",
  conversation: "Conversaciones",
  lead: "Leads",
  configuration: "Configuración",
  audit: "Auditoría",
};

export const BACKEND_DATA_SENSITIVITY_LABELS: Record<
  BackendDataSensitivity,
  string
> = {
  public: "Público",
  internal: "Interno",
  personal: "Personal",
  sensitive: "Sensible",
};

export const BACKEND_DATA_ENTITY_STATUS_LABELS: Record<
  BackendDataEntityStatus,
  string
> = {
  required_mvp: "Requerido MVP",
  recommended_mvp: "Recomendado MVP",
  future: "Futuro",
  audit_required: "Auditoría requerida",
};

export const BACKEND_DATA_ENTITIES: BackendDataEntity[] = [
  {
    id: "entity-company",
    name: "Company",
    category: "tenant",
    status: "required_mvp",
    sensitivity: "internal",
    objective:
      "Representar a cada empresa o cliente dentro del modelo multiempresa de ORBI ChatBox IA Core.",
    fields: [
      {
        name: "id",
        type: "string",
        required: true,
        description: "Identificador único de empresa.",
      },
      {
        name: "brandName",
        type: "string",
        required: true,
        description: "Nombre visible de la empresa.",
      },
      {
        name: "legalName",
        type: "string",
        required: false,
        description: "Razón social si aplica.",
      },
      {
        name: "status",
        type: "active | inactive | demo",
        required: true,
        description: "Estado operativo de la empresa.",
      },
      {
        name: "createdAt",
        type: "Date",
        required: true,
        description: "Fecha de creación.",
      },
    ],
    relations: [
      {
        targetEntity: "User",
        relationType: "one_to_many",
        description: "Una empresa puede tener múltiples usuarios.",
      },
      {
        targetEntity: "Conversation",
        relationType: "one_to_many",
        description: "Una empresa puede tener múltiples conversaciones.",
      },
      {
        targetEntity: "Lead",
        relationType: "one_to_many",
        description: "Una empresa puede tener múltiples leads.",
      },
    ],
    risks: [
      "Cruce de datos entre empresas.",
      "Empresas demo confundidas con empresas reales.",
      "Configuración incompleta afectando respuestas.",
    ],
    securityRules: [
      "Toda entidad operativa debe estar asociada a companyId.",
      "El backend debe filtrar datos por empresa.",
      "No depender de filtros visuales del frontend.",
    ],
  },
  {
    id: "entity-user",
    name: "User",
    category: "user_access",
    status: "required_mvp",
    sensitivity: "personal",
    objective:
      "Representar usuarios internos, administradores, soporte humano o equipo ORBI con acceso al sistema.",
    fields: [
      {
        name: "id",
        type: "string",
        required: true,
        description: "Identificador único de usuario.",
      },
      {
        name: "companyId",
        type: "string",
        required: true,
        description: "Empresa a la que pertenece el usuario.",
      },
      {
        name: "email",
        type: "string",
        required: true,
        description: "Correo de acceso.",
      },
      {
        name: "displayName",
        type: "string",
        required: true,
        description: "Nombre visible.",
      },
      {
        name: "roleId",
        type: "string",
        required: true,
        description: "Rol asignado.",
      },
    ],
    relations: [
      {
        targetEntity: "Company",
        relationType: "many_to_one",
        description: "Cada usuario pertenece a una empresa.",
      },
      {
        targetEntity: "Role",
        relationType: "many_to_one",
        description: "Cada usuario tiene un rol principal.",
      },
    ],
    risks: [
      "Acceso no autorizado.",
      "Permisos asignados incorrectamente.",
      "Exposición de correos personales.",
    ],
    securityRules: [
      "Validar permisos en backend.",
      "No confiar solo en roles renderizados en frontend.",
      "Aplicar mínimo privilegio.",
    ],
  },
  {
    id: "entity-role",
    name: "Role",
    category: "user_access",
    status: "required_mvp",
    sensitivity: "internal",
    objective:
      "Definir permisos mínimos para administradores, soporte humano, visualizadores o equipo técnico.",
    fields: [
      {
        name: "id",
        type: "string",
        required: true,
        description: "Identificador único del rol.",
      },
      {
        name: "name",
        type: "string",
        required: true,
        description: "Nombre del rol.",
      },
      {
        name: "permissions",
        type: "string[]",
        required: true,
        description: "Lista de permisos asignados.",
      },
    ],
    relations: [
      {
        targetEntity: "User",
        relationType: "one_to_many",
        description: "Un rol puede estar asignado a múltiples usuarios.",
      },
    ],
    risks: [
      "Permisos excesivos.",
      "Administradores sin control.",
      "Falta de separación entre soporte y configuración.",
    ],
    securityRules: [
      "Definir permisos explícitos.",
      "Auditar cambios de roles.",
      "Evitar roles globales sin justificación.",
    ],
  },
  {
    id: "entity-conversation",
    name: "Conversation",
    category: "conversation",
    status: "required_mvp",
    sensitivity: "personal",
    objective:
      "Registrar una conversación entre un visitante y el asistente ORBI, asociada a una empresa y canal.",
    fields: [
      {
        name: "id",
        type: "string",
        required: true,
        description: "Identificador único de conversación.",
      },
      {
        name: "companyId",
        type: "string",
        required: true,
        description: "Empresa propietaria de la conversación.",
      },
      {
        name: "channel",
        type: "web_widget | manual_test | future_whatsapp",
        required: true,
        description: "Canal de origen.",
      },
      {
        name: "status",
        type: "open | in_review | closed",
        required: true,
        description: "Estado de la conversación.",
      },
      {
        name: "createdAt",
        type: "Date",
        required: true,
        description: "Fecha de inicio.",
      },
    ],
    relations: [
      {
        targetEntity: "Company",
        relationType: "many_to_one",
        description: "Cada conversación pertenece a una empresa.",
      },
      {
        targetEntity: "Message",
        relationType: "one_to_many",
        description: "Una conversación contiene múltiples mensajes.",
      },
      {
        targetEntity: "Lead",
        relationType: "one_to_one",
        description: "Una conversación puede generar un lead.",
      },
    ],
    risks: [
      "Guardar conversaciones sin consentimiento.",
      "Persistir información sensible.",
      "No cerrar conversaciones antiguas.",
    ],
    securityRules: [
      "Mostrar consentimiento antes de iniciar conversación pública.",
      "Aplicar retención de datos.",
      "Filtrar siempre por companyId.",
    ],
  },
  {
    id: "entity-message",
    name: "Message",
    category: "conversation",
    status: "required_mvp",
    sensitivity: "personal",
    objective:
      "Guardar mensajes individuales de una conversación, diferenciando visitante, asistente y usuario humano.",
    fields: [
      {
        name: "id",
        type: "string",
        required: true,
        description: "Identificador único de mensaje.",
      },
      {
        name: "conversationId",
        type: "string",
        required: true,
        description: "Conversación asociada.",
      },
      {
        name: "senderType",
        type: "visitor | assistant | human_agent",
        required: true,
        description: "Tipo de emisor.",
      },
      {
        name: "content",
        type: "string",
        required: true,
        description: "Contenido del mensaje.",
      },
      {
        name: "createdAt",
        type: "Date",
        required: true,
        description: "Fecha del mensaje.",
      },
    ],
    relations: [
      {
        targetEntity: "Conversation",
        relationType: "many_to_one",
        description: "Cada mensaje pertenece a una conversación.",
      },
    ],
    risks: [
      "Contenido sensible en mensajes.",
      "Mensajes maliciosos o spam.",
      "Exposición de contenido entre empresas.",
    ],
    securityRules: [
      "Sanitizar contenido antes de mostrar.",
      "No registrar más datos de los necesarios.",
      "Aplicar límites de longitud y validación.",
    ],
  },
  {
    id: "entity-lead",
    name: "Lead",
    category: "lead",
    status: "required_mvp",
    sensitivity: "personal",
    objective:
      "Representar una oportunidad comercial generada desde una conversación o registro manual.",
    fields: [
      {
        name: "id",
        type: "string",
        required: true,
        description: "Identificador único de lead.",
      },
      {
        name: "companyId",
        type: "string",
        required: true,
        description: "Empresa propietaria del lead.",
      },
      {
        name: "conversationId",
        type: "string",
        required: false,
        description: "Conversación que originó el lead.",
      },
      {
        name: "priority",
        type: "low | medium | high | critical",
        required: true,
        description: "Prioridad comercial.",
      },
      {
        name: "status",
        type: "new | in_review | contacted | closed",
        required: true,
        description: "Estado de seguimiento.",
      },
      {
        name: "summary",
        type: "string",
        required: true,
        description: "Resumen comercial del lead.",
      },
    ],
    relations: [
      {
        targetEntity: "Company",
        relationType: "many_to_one",
        description: "Cada lead pertenece a una empresa.",
      },
      {
        targetEntity: "Conversation",
        relationType: "many_to_one",
        description: "Un lead puede originarse desde una conversación.",
      },
    ],
    risks: [
      "Datos personales sin consentimiento.",
      "Leads duplicados.",
      "Priorización incorrecta.",
    ],
    securityRules: [
      "Registrar origen del lead.",
      "Permitir revisión humana.",
      "Auditar cambios de estado.",
    ],
  },
];

export function buildBackendDataModelSummary(entities: BackendDataEntity[]) {
  const total = entities.length;

  const requiredMvp = entities.filter(
    (entity) => entity.status === "required_mvp"
  ).length;

  const personal = entities.filter(
    (entity) => entity.sensitivity === "personal"
  ).length;

  const sensitive = entities.filter(
    (entity) => entity.sensitivity === "sensitive"
  ).length;

  const auditRequired = entities.filter(
    (entity) => entity.status === "audit_required"
  ).length;

  return {
    total,
    requiredMvp,
    personal,
    sensitive,
    auditRequired,
  };
}

export function buildBackendDataModelText(params: {
  profile: CompanyProfile;
  entities: BackendDataEntity[];
  summary: ReturnType<typeof buildBackendDataModelSummary>;
}): string {
  const { profile, entities, summary } = params;

  const entitiesText = entities
    .map((entity) => {
      return `ENTIDAD: ${entity.name}
Categoría: ${BACKEND_DATA_ENTITY_CATEGORY_LABELS[entity.category]}
Estado: ${BACKEND_DATA_ENTITY_STATUS_LABELS[entity.status]}
Sensibilidad: ${BACKEND_DATA_SENSITIVITY_LABELS[entity.sensitivity]}

Objetivo:
${entity.objective}

Campos:
${entity.fields
  .map(
    (field) =>
      `- ${field.name} (${field.type}) ${field.required ? "[requerido]" : "[opcional]"}: ${field.description}`
  )
  .join("\n")}

Relaciones:
${entity.relations
  .map(
    (relation) =>
      `- ${relation.relationType} con ${relation.targetEntity}: ${relation.description}`
  )
  .join("\n")}

Riesgos:
${entity.risks.map((risk) => `- ${risk}`).join("\n")}

Reglas de seguridad:
${entity.securityRules.map((rule) => `- ${rule}`).join("\n")}`;
    })
    .join("\n\n---\n\n");

  return `BACKEND DATA MODEL BASE — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

RESUMEN
Entidades evaluadas: ${summary.total}
Requeridas MVP: ${summary.requiredMvp}
Con datos personales: ${summary.personal}
Con datos sensibles: ${summary.sensitive}
Requieren auditoría: ${summary.auditRequired}

DETALLE
${entitiesText}

NOTA
Este modelo de datos es conceptual. No crea base de datos real, no conecta APIs, no modifica localStorage, no crea backend y no convierte la demo en producción.`;
}

export type ApiBoundaryArea =
  | "public_widget"
  | "admin_private"
  | "auth"
  | "conversation"
  | "lead"
  | "company_config"
  | "reporting"
  | "audit";

export type ApiBoundaryMethod = "GET" | "POST" | "PATCH" | "DELETE";

export type ApiBoundaryExposure = "public" | "private" | "internal_only";

export type ApiBoundaryRisk = "low" | "medium" | "high" | "critical";

export type ApiBoundaryEndpoint = {
  id: string;
  method: ApiBoundaryMethod;
  path: string;
  area: ApiBoundaryArea;
  exposure: ApiBoundaryExposure;
  risk: ApiBoundaryRisk;
  objective: string;
  requiredAuth: boolean;
  requiredEntities: string[];
  securityRules: string[];
  forbiddenActions: string[];
};

export const API_BOUNDARY_AREA_LABELS: Record<ApiBoundaryArea, string> = {
  public_widget: "Widget público",
  admin_private: "Admin privado",
  auth: "Autenticación",
  conversation: "Conversaciones",
  lead: "Leads",
  company_config: "Configuración empresa",
  reporting: "Reportes",
  audit: "Auditoría",
};

export const API_BOUNDARY_EXPOSURE_LABELS: Record<ApiBoundaryExposure, string> = {
  public: "Público",
  private: "Privado",
  internal_only: "Solo interno",
};

export const API_BOUNDARY_RISK_LABELS: Record<ApiBoundaryRisk, string> = {
  low: "Bajo",
  medium: "Medio",
  high: "Alto",
  critical: "Crítico",
};

export const API_BOUNDARY_ENDPOINTS: ApiBoundaryEndpoint[] = [
  {
    id: "api-auth-login",
    method: "POST",
    path: "/api/auth/login",
    area: "auth",
    exposure: "private",
    risk: "critical",
    objective:
      "Permitir autenticación segura de usuarios internos o administradores de empresa.",
    requiredAuth: false,
    requiredEntities: ["User", "Role", "Company"],
    securityRules: [
      "Validar credenciales solo en backend.",
      "No exponer tokens inseguros.",
      "Aplicar control de sesión.",
      "Registrar intentos fallidos.",
    ],
    forbiddenActions: [
      "No autenticar solo desde frontend.",
      "No guardar secretos en localStorage sin estrategia segura.",
      "No devolver información sensible del usuario.",
    ],
  },
  {
    id: "api-company-profile",
    method: "GET",
    path: "/api/company/profile",
    area: "company_config",
    exposure: "private",
    risk: "high",
    objective:
      "Obtener la configuración privada de la empresa activa para panel administrativo.",
    requiredAuth: true,
    requiredEntities: ["Company", "CompanyService", "HumanContact"],
    securityRules: [
      "Filtrar siempre por companyId.",
      "Validar rol del usuario.",
      "No exponer empresas ajenas.",
    ],
    forbiddenActions: [
      "No consultar todas las empresas desde rol normal.",
      "No filtrar solo en frontend.",
      "No exponer configuración privada en endpoint público.",
    ],
  },
  {
    id: "api-company-update",
    method: "PATCH",
    path: "/api/company/profile",
    area: "company_config",
    exposure: "private",
    risk: "critical",
    objective:
      "Actualizar configuración empresarial controlada por usuario autorizado.",
    requiredAuth: true,
    requiredEntities: ["Company", "CompanyService", "HumanContact", "AuditLog"],
    securityRules: [
      "Validar permisos de administrador.",
      "Validar payload server-side.",
      "Registrar cambios relevantes en auditoría.",
    ],
    forbiddenActions: [
      "No permitir edición sin rol autorizado.",
      "No aceptar campos no permitidos.",
      "No modificar companyId desde cliente.",
    ],
  },
  {
    id: "api-public-widget-config",
    method: "GET",
    path: "/api/public/widget/:publicKey/config",
    area: "public_widget",
    exposure: "public",
    risk: "critical",
    objective:
      "Entregar configuración pública limitada para cargar un widget web embebido.",
    requiredAuth: false,
    requiredEntities: ["Company", "CompanyService"],
    securityRules: [
      "Usar publicKey no sensible.",
      "Exponer solo configuración pública sanitizada.",
      "Aplicar rate limiting.",
      "No devolver contactos internos privados.",
    ],
    forbiddenActions: [
      "No exponer companyId interno si no es necesario.",
      "No devolver tokens, correos internos ni configuración privada.",
      "No permitir mutaciones desde este endpoint.",
    ],
  },
  {
    id: "api-public-widget-message",
    method: "POST",
    path: "/api/public/widget/:publicKey/message",
    area: "public_widget",
    exposure: "public",
    risk: "critical",
    objective:
      "Recibir un mensaje público desde el widget y crear una conversación controlada.",
    requiredAuth: false,
    requiredEntities: ["Company", "Conversation", "Message", "Lead"],
    securityRules: [
      "Aplicar rate limiting.",
      "Validar longitud y contenido.",
      "Exigir consentimiento visible en widget.",
      "Sanitizar datos antes de persistir.",
      "Asociar siempre a empresa por publicKey.",
    ],
    forbiddenActions: [
      "No permitir escritura directa desde frontend a base de datos.",
      "No procesar mensajes sin validación.",
      "No guardar datos sensibles sin política definida.",
    ],
  },
  {
    id: "api-conversations-list",
    method: "GET",
    path: "/api/conversations",
    area: "conversation",
    exposure: "private",
    risk: "high",
    objective:
      "Listar conversaciones de la empresa activa para panel administrativo.",
    requiredAuth: true,
    requiredEntities: ["Conversation", "Message", "Company"],
    securityRules: [
      "Filtrar por companyId.",
      "Paginar resultados.",
      "Aplicar permisos por rol.",
    ],
    forbiddenActions: [
      "No devolver conversaciones de otras empresas.",
      "No devolver todo el histórico sin paginación.",
      "No exponer mensajes sensibles innecesarios.",
    ],
  },
  {
    id: "api-leads-list",
    method: "GET",
    path: "/api/leads",
    area: "lead",
    exposure: "private",
    risk: "high",
    objective:
      "Listar leads comerciales de la empresa activa con filtros básicos.",
    requiredAuth: true,
    requiredEntities: ["Lead", "Conversation", "Company"],
    securityRules: [
      "Filtrar por companyId.",
      "Permitir filtros por estado y prioridad.",
      "Respetar permisos del usuario.",
    ],
    forbiddenActions: [
      "No mostrar leads de otras empresas.",
      "No exportar datos personales sin control.",
      "No permitir acceso anónimo.",
    ],
  },
  {
    id: "api-lead-update",
    method: "PATCH",
    path: "/api/leads/:leadId",
    area: "lead",
    exposure: "private",
    risk: "critical",
    objective:
      "Actualizar estado, prioridad o notas internas de un lead existente.",
    requiredAuth: true,
    requiredEntities: ["Lead", "AuditLog"],
    securityRules: [
      "Validar pertenencia del lead a companyId.",
      "Validar permisos.",
      "Registrar cambios en AuditLog.",
    ],
    forbiddenActions: [
      "No permitir actualizar lead de otra empresa.",
      "No permitir cambios sin auditoría.",
      "No aceptar estados inválidos.",
    ],
  },
  {
    id: "api-reporting-summary",
    method: "GET",
    path: "/api/reports/commercial-summary",
    area: "reporting",
    exposure: "private",
    risk: "medium",
    objective:
      "Entregar métricas básicas de conversaciones, leads, prioridades y derivaciones.",
    requiredAuth: true,
    requiredEntities: ["Conversation", "Lead", "Company"],
    securityRules: [
      "Filtrar por companyId.",
      "Usar agregaciones backend.",
      "Evitar exponer datos personales en métricas generales.",
    ],
    forbiddenActions: [
      "No calcular reportes sensibles solo en frontend.",
      "No mezclar datos de distintas empresas.",
      "No entregar datos crudos si basta con agregados.",
    ],
  },
  {
    id: "api-audit-log",
    method: "GET",
    path: "/api/audit/logs",
    area: "audit",
    exposure: "internal_only",
    risk: "critical",
    objective:
      "Permitir revisión controlada de eventos críticos, cambios de configuración y operaciones sensibles.",
    requiredAuth: true,
    requiredEntities: ["AuditLog", "User", "Company"],
    securityRules: [
      "Restringir a roles autorizados.",
      "Filtrar por empresa salvo rol ORBI superior.",
      "No exponer datos sensibles completos dentro de logs.",
    ],
    forbiddenActions: [
      "No mostrar auditoría a usuarios sin permiso.",
      "No registrar contraseñas, tokens ni secretos.",
      "No permitir borrado libre de auditoría.",
    ],
  },
];

export function buildApiBoundarySummary(endpoints: ApiBoundaryEndpoint[]) {
  const total = endpoints.length;

  const publicEndpoints = endpoints.filter(
    (endpoint) => endpoint.exposure === "public"
  ).length;

  const privateEndpoints = endpoints.filter(
    (endpoint) => endpoint.exposure === "private"
  ).length;

  const internalOnly = endpoints.filter(
    (endpoint) => endpoint.exposure === "internal_only"
  ).length;

  const criticalRisk = endpoints.filter(
    (endpoint) => endpoint.risk === "critical"
  ).length;

  const authRequired = endpoints.filter((endpoint) => endpoint.requiredAuth)
    .length;

  return {
    total,
    publicEndpoints,
    privateEndpoints,
    internalOnly,
    criticalRisk,
    authRequired,
  };
}

export function buildApiBoundaryText(params: {
  profile: CompanyProfile;
  endpoints: ApiBoundaryEndpoint[];
  summary: ReturnType<typeof buildApiBoundarySummary>;
}): string {
  const { profile, endpoints, summary } = params;

  const endpointsText = endpoints
    .map((endpoint) => {
      return `ENDPOINT: ${endpoint.method} ${endpoint.path}
Área: ${API_BOUNDARY_AREA_LABELS[endpoint.area]}
Exposición: ${API_BOUNDARY_EXPOSURE_LABELS[endpoint.exposure]}
Riesgo: ${API_BOUNDARY_RISK_LABELS[endpoint.risk]}
Auth requerida: ${endpoint.requiredAuth ? "Sí" : "No"}

Objetivo:
${endpoint.objective}

Entidades requeridas:
${endpoint.requiredEntities.map((entity) => `- ${entity}`).join("\n")}

Reglas de seguridad:
${endpoint.securityRules.map((rule) => `- ${rule}`).join("\n")}

Acciones prohibidas:
${endpoint.forbiddenActions.map((action) => `- ${action}`).join("\n")}`;
    })
    .join("\n\n---\n\n");

  return `API BOUNDARY — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

RESUMEN
Endpoints conceptuales: ${summary.total}
Públicos: ${summary.publicEndpoints}
Privados: ${summary.privateEndpoints}
Solo internos: ${summary.internalOnly}
Riesgo crítico: ${summary.criticalRisk}
Requieren auth: ${summary.authRequired}

DETALLE
${endpointsText}

NOTA
Este API Boundary es conceptual. No crea backend, no conecta APIs, no crea endpoints reales, no modifica localStorage, no conecta WhatsApp real y no despliega servicios.`;
}

export type SuggestedWhatsAppReply = {
  id: string;
  title: string;
  tone: SuggestedReplyTone;
  body: string;
};

export type MvpSecurityGateCategory =
  | "authentication"
  | "roles_permissions"
  | "tenant_isolation"
  | "consent"
  | "personal_data"
  | "production_blocker"
  | "payload_validation"
  | "rate_limiting"
  | "secrets_management"
  | "security_logging"
  | "gate_closure";

export type MvpSecurityGateStatus =
  | "required_before_mvp"
  | "critical_blocker"
  | "recommended"
  | "future_hardening";

export type MvpSecurityGateRisk = "low" | "medium" | "high" | "critical";

export type MvpSecurityGateItem = {
  id: string;
  title: string;
  category: MvpSecurityGateCategory;
  status: MvpSecurityGateStatus;
  risk: MvpSecurityGateRisk;
  objective: string;
  minimumControls: string[];
  validationQuestions: string[];
  blockingConditions: string[];
  safeBoundaries: string[];
};

export const MVP_SECURITY_GATE_CATEGORY_LABELS: Record<
  MvpSecurityGateCategory,
  string
> = {
  authentication: "Autenticación",
  roles_permissions: "Roles y permisos",
  tenant_isolation: "Aislamiento multiempresa",
  consent: "Consentimiento",
  personal_data: "Datos personales",
  production_blocker: "Bloqueo producción",
  payload_validation: "Validación de Payloads",
  rate_limiting: "Rate Limiting",
  secrets_management: "Gestión de Secretos",
  security_logging: "Logs de Seguridad",
  gate_closure: "Cierre Security Gate",
};

export const MVP_SECURITY_GATE_STATUS_LABELS: Record<
  MvpSecurityGateStatus,
  string
> = {
  required_before_mvp: "Requerido antes del MVP",
  critical_blocker: "Bloqueante crítico",
  recommended: "Recomendado",
  future_hardening: "Hardening futuro",
};

export const MVP_SECURITY_GATE_RISK_LABELS: Record<MvpSecurityGateRisk, string> = {
  low: "Bajo",
  medium: "Medio",
  high: "Alto",
  critical: "Crítico",
};

export const MVP_SECURITY_GATE_BASE_ITEMS: MvpSecurityGateItem[] = [
  {
    id: "security-auth-required",
    title: "Autenticación real obligatoria",
    category: "authentication",
    status: "critical_blocker",
    risk: "critical",
    objective:
      "Evitar que usuarios no identificados accedan a paneles administrativos, leads, conversaciones o configuración empresarial.",
    minimumControls: [
      "Login real gestionado en backend.",
      "Sesión segura.",
      "Expiración de sesión.",
      "Validación de usuario en cada endpoint privado.",
    ],
    validationQuestions: [
      "¿Cada usuario interno inicia sesión de forma segura?",
      "¿Los endpoints privados verifican sesión en backend?",
      "¿La sesión puede expirar o revocarse?",
    ],
    blockingConditions: [
      "No existe autenticación backend.",
      "El acceso administrativo depende solo del frontend.",
      "Los endpoints privados pueden consultarse sin sesión.",
    ],
    safeBoundaries: [
      "No simular autenticación como producción.",
      "No guardar secretos en frontend.",
      "No liberar panel admin sin auth real.",
    ],
  },
  {
    id: "security-rbac-minimum",
    title: "Roles y permisos mínimos",
    category: "roles_permissions",
    status: "required_before_mvp",
    risk: "critical",
    objective:
      "Separar permisos entre administrador de empresa, soporte humano, visualizador y rol ORBI interno.",
    minimumControls: [
      "Definir roles mínimos.",
      "Validar permisos en backend.",
      "Separar lectura, edición y administración.",
      "Auditar cambios sensibles.",
    ],
    validationQuestions: [
      "¿Un visualizador puede editar configuración?",
      "¿Un soporte puede ver solo conversaciones asignadas o permitidas?",
      "¿Los permisos se validan en backend y no solo visualmente?",
    ],
    blockingConditions: [
      "No existen roles reales.",
      "Los permisos solo se ocultan por interfaz.",
      "Cualquier usuario puede modificar configuración crítica.",
    ],
    safeBoundaries: [
      "No confiar en botones ocultos como control de seguridad.",
      "No permitir roles globales sin justificación.",
      "No omitir auditoría en cambios críticos.",
    ],
  },
  {
    id: "security-tenant-isolation",
    title: "Aislamiento multiempresa obligatorio",
    category: "tenant_isolation",
    status: "critical_blocker",
    risk: "critical",
    objective:
      "Garantizar que cada empresa solo acceda a sus propias conversaciones, leads, usuarios, servicios y reportes.",
    minimumControls: [
      "companyId obligatorio en entidades operativas.",
      "Filtrado por empresa in backend.",
      "Validación de pertenencia por usuario.",
      "Pruebas de aislamiento entre empresas.",
    ],
    validationQuestions: [
      "¿Cada consulta filtra por companyId?",
      "¿Un usuario de una empresa puede acceder a otra?",
      "¿Existen pruebas de aislamiento multiempresa?",
    ],
    blockingConditions: [
      "Queries globales sin filtro de empresa.",
      "companyId editable desde frontend.",
      "No hay validación de pertenencia en backend.",
    ],
    safeBoundaries: [
      "No filtrar multiempresa solo en frontend.",
      "No exponer IDs internos innecesarios.",
      "No mezclar datos demo y datos productivos.",
    ],
  },
  {
    id: "security-widget-consent",
    title: "Consentimiento visible en widget",
    category: "consent",
    status: "required_before_mvp",
    risk: "high",
    objective:
      "Informar al visitante que sus mensajes pueden ser procesados para atención comercial antes de iniciar una conversación real.",
    minimumControls: [
      "Texto de consentimiento visible.",
      "Aviso de uso de datos.",
      "Referencia a política de privacidad.",
      "Bloqueo o aviso antes de capturar datos sensibles.",
    ],
    validationQuestions: [
      "¿El visitante sabe que su mensaje será procesado?",
      "¿Existe aviso antes de enviar datos personales?",
      "¿El widget muestra alcance y privacidad de forma clara?",
    ],
    blockingConditions: [
      "Widget público sin consentimiento.",
      "Captura de datos personales sin aviso.",
      "No existe política mínima de uso de datos.",
    ],
    safeBoundaries: [
      "No activar widget real sin aviso de privacidad.",
      "No prometer asesoría legal desde la app.",
      "No capturar datos sensibles innecesarios.",
    ],
  },
  {
    id: "security-personal-data",
    title: "Protección de datos personales",
    category: "personal_data",
    status: "required_before_mvp",
    risk: "critical",
    objective:
      "Controlar cómo se almacenan, muestran, exportan y retienen mensajes, correos, teléfonos y datos de contacto.",
    minimumControls: [
      "Clasificación de datos personales.",
      "Retención mínima definida.",
      "Acceso restringido por rol.",
      "Evitar exportaciones libres sin control.",
      "Sanitización básica antes de renderizar contenido.",
    ],
    validationQuestions: [
      "¿Qué datos personales se guardarán?",
      "¿Quién puede verlos?",
      "¿Cuánto tiempo se conservarán?",
      "¿Cómo se evitarán exportaciones indebidas?",
    ],
    blockingConditions: [
      "No existe política de retención.",
      "Cualquier usuario puede exportar datos.",
      "No se distingue entre datos internos y personales.",
    ],
    safeBoundaries: [
      "No usar datos reales en demo.",
      "No exportar información sensible sin control.",
      "No guardar más datos de los necesarios.",
    ],
  },
  {
    id: "security-production-blocker",
    title: "Bloqueo formal antes de producción",
    category: "production_blocker",
    status: "critical_blocker",
    risk: "critical",
    objective:
      "Impedir que ORBI ChatBox IA Core sea presentado o usado como producción real sin cumplir los mínimos de seguridad, privacidad y backend.",
    minimumControls: [
      "Checklist de seguridad antes de release.",
      "Validación de backend seguro.",
      "Validación de aislamiento multiempresa.",
      "Confirmación de consentimiento y privacidad.",
      "Revisión de endpoints públicos.",
    ],
    validationQuestions: [
      "¿Existe backend real y seguro?",
      "¿Hay auth y RBAC?",
      "¿El widget público tiene rate limiting y consentimiento?",
      "¿Los datos están aislados por empresa?",
    ],
    blockingConditions: [
      "No hay backend real.",
      "No hay autenticación.",
      "No hay aislamiento multiempresa.",
      "No hay consentimiento.",
      "No hay política mínima de datos.",
    ],
    safeBoundaries: [
      "No vender como producción si sigue siendo demo.",
      "No conectar clientes reales sin seguridad base.",
      "No activar canales públicos sin controles.",
    ],
  },
  {
    id: "security-payload-validation",
    title: "Validación estricta de Payloads y Schemas",
    category: "payload_validation",
    status: "required_before_mvp",
    risk: "high",
    objective: "Asegurar que todas las peticiones entrantes tengan el formato, tipos y restricciones correctas en el backend para evitar inyecciones, payloads gigantes o corrupción de datos.",
    minimumControls: [
      "Uso de librerías de validación de esquemas (como Zod, Joi o Yup) en la capa de entrada del backend.",
      "Definición estricta de tipos de datos para cada endpoint conceptual.",
      "Rechazar payloads que contengan propiedades adicionales no definidas (strip non-whitelisted properties).",
      "Validar longitudes máximas y mínimas para todas las cadenas de texto (ej. mensajes, nombres, correos)."
    ],
    validationQuestions: [
      "¿Existe un esquema de validación server-side para cada endpoint POST, PATCH y PUT?",
      "¿Se rechazan automáticamente las peticiones con datos corruptos o tipos incorrectos?",
      "¿Qué ocurre si un payload excede el tamaño máximo permitido por el servidor?"
    ],
    blockingConditions: [
      "No existe validación estructurada de payloads en backend.",
      "Se confía únicamente en la validación del frontend.",
      "Se aceptan payloads de tamaño ilimitado o propiedades arbitrarias."
    ],
    safeBoundaries: [
      "No procesar datos antes de sanitizarlos.",
      "No exponer mensajes de error detallados del parser de esquemas que revelen la estructura interna de la base de datos.",
      "No permitir subidas de archivos sin límite estricto de tamaño y tipo Mime."
    ]
  },
  {
    id: "security-rate-limiting",
    title: "Protección contra abuso y Rate Limiting",
    category: "rate_limiting",
    status: "required_before_mvp",
    risk: "high",
    objective: "Evitar ataques de fuerza bruta, denegación de servicio (DoS) y consumo excesivo de APIs de IA mediante límites de peticiones por IP, token o usuario.",
    minimumControls: [
      "Configuración de limitadores de tasa (Rate Limiters) en rutas públicas del widget.",
      "Límites específicos en endpoints de autenticación y recuperación de credenciales.",
      "Mecanismo de fallback o bloqueo temporal para IPs/usuarios abusivos.",
      "Monitoreo de cuotas para consumo de APIs de IA de terceros."
    ],
    validationQuestions: [
      "¿Cuántas peticiones por minuto puede realizar una misma IP al widget público?",
      "¿Existe rate limiting en el login para mitigar fuerza bruta?",
      "¿El sistema alerta si una cuenta excede su consumo esperado de tokens de IA?"
    ],
    blockingConditions: [
      "Endpoints públicos expuestos sin ningún tipo de límite de tasa.",
      "Ataques de login sin bloqueo temporal tras múltiples intentos fallidos.",
      "Falta de cuotas de protección por empresa (tenant)."
    ],
    safeBoundaries: [
      "No simular rate limits sin un middleware backend real en producción.",
      "No guardar registros temporales de rate limit en base de datos persistente (usar caché en memoria o Redis).",
      "No bloquear por IP de manera permanente sin opción de revisión automática."
    ]
  },
  {
    id: "security-secrets-management",
    title: "Gestión segura de secretos y variables de entorno",
    category: "secrets_management",
    status: "critical_blocker",
    risk: "critical",
    objective: "Prevenir la fuga de claves API, tokens de CRM, credenciales de base de datos y llaves privadas asegurando su almacenamiento exclusivo en variables de entorno seguras en el servidor.",
    minimumControls: [
      "Almacenamiento de secretos únicamente en variables de entorno (ej. process.env).",
      "Uso de gestores de secretos en la nube (ej. Secret Manager) para ambientes de producción.",
      "Bloquear la inclusión de cualquier API key o credencial en el código fuente del frontend.",
      "Rotación periódica programada de claves de APIs externas (IA, WhatsApp, CRM)."
    ],
    validationQuestions: [
      "¿Hay alguna API key harcodeada en archivos .ts o .tsx?",
      "¿Los archivos de configuración locales (.env) están listados en .gitignore?",
      "¿Los secretos de producción se almacenan de forma cifrada en la plataforma de hosting?"
    ],
    blockingConditions: [
      "Claves API, tokens o credenciales expuestos en repositorios de código o bundles del cliente.",
      "Cargar variables de entorno confidenciales en el bundle público con prefijo VITE_ sin necesidad.",
      "Falta de control de acceso a los secretos en el entorno de despliegue."
    ],
    safeBoundaries: [
      "No almacenar secretos en el localStorage del usuario.",
      "No exponer variables de entorno en endpoints públicos de depuración.",
      "No usar llaves de producción en entornos locales o de testing."
    ]
  },
  {
    id: "security-security-logging",
    title: "Logs de auditoría y eventos de seguridad",
    category: "security_logging",
    status: "required_before_mvp",
    risk: "medium",
    objective: "Registrar de forma inmutable los eventos de seguridad críticos para permitir análisis forense, depuración de accesos indebidos y cumplimiento de normativas de auditoría.",
    minimumControls: [
      "Registro de logins exitosos, fallidos y cierres de sesión.",
      "Registro de modificaciones en la configuración de la empresa y roles de usuario.",
      "Logs de errores críticos del sistema, fallos de rate limit y rechazo de payloads sospechosos.",
      "Asegurar que los logs no contengan contraseñas, secretos, tokens o datos personales sensibles."
    ],
    validationQuestions: [
      "¿Se genera un AuditLog cuando un usuario cambia su rol o edita la configuración de la empresa?",
      "¿Los logs se guardan de forma inmutable fuera del alcance de administradores de empresa comunes?",
      "¿La estructura de logs sanitiza tokens de sesión y contraseñas?"
    ],
    blockingConditions: [
      "Modificaciones de configuración crítica sin dejar rastro de auditoría.",
      "Logs de seguridad que almacenan contraseñas o tokens de sesión en texto plano.",
      "Imposibilidad de rastrear la actividad de un usuario ante un incidente."
    ],
    safeBoundaries: [
      "No permitir que el usuario común borre o altere logs de auditoría.",
      "No incluir datos altamente sensibles (PII) en los logs si no es estrictamente necesario.",
      "No usar logs locales si se dispone de un agregador centralizado de logs seguro."
    ]
  },
  {
    id: "security-gate-closure",
    title: "Cierre, Certificación y checklist de Security Gate",
    category: "gate_closure",
    status: "critical_blocker",
    risk: "critical",
    objective: "Certificar formalmente que ORBI ChatBox IA Core cumple con la totalidad de los gates de seguridad obligatorios y controles de privacidad antes del pase oficial a producción.",
    minimumControls: [
      "Revisión y firma electrónica conceptual del checklist de Security Gate.",
      "Verificación del correcto aislamiento multiempresa mediante tests dedicados.",
      "Validación de consentimiento activo en el widget web.",
      "Bloqueo estricto del pipeline de despliegue si algún gate crítico falla."
    ],
    validationQuestions: [
      "¿Todos los gates marcados como 'Bloqueante crítico' están 100% implementados?",
      "¿Se ha realizado una simulación de penetración o auditoría básica del aislamiento multiempresa?",
      "¿Existe un proceso documentado para reportar y corregir vulnerabilidades?"
    ],
    blockingConditions: [
      "Intentar desplegar a producción con gates críticos pendientes o fallidos.",
      "Falta de firma de cumplimiento o validación técnica de seguridad.",
      "Exponer el widget al público general sin haber cerrado formalmente el gate de consentimiento."
    ],
    safeBoundaries: [
      "No considerar la certificación como un evento único, sino como un proceso continuo.",
      "No deshabilitar verficaciones de seguridad en hotfixes de producción.",
      "No omitir el checklist bajo presión de lanzamiento comercial."
    ]
  },
];

export function buildMvpSecurityGateBaseSummary(items: MvpSecurityGateItem[]) {
  const total = items.length;

  const criticalBlockers = items.filter(
    (item) => item.status === "critical_blocker"
  ).length;

  const requiredBeforeMvp = items.filter(
    (item) => item.status === "required_before_mvp"
  ).length;

  const criticalRisk = items.filter((item) => item.risk === "critical").length;

  const highRisk = items.filter((item) => item.risk === "high").length;

  return {
    total,
    criticalBlockers,
    requiredBeforeMvp,
    criticalRisk,
    highRisk,
  };
}

export function buildMvpSecurityGateBaseText(params: {
  profile: CompanyProfile;
  items: MvpSecurityGateItem[];
  summary: ReturnType<typeof buildMvpSecurityGateBaseSummary>;
}): string {
  const { profile, items, summary } = params;

  const itemsText = items
    .map((item) => {
      return `SECURITY GATE: ${item.title}
Categoría: ${MVP_SECURITY_GATE_CATEGORY_LABELS[item.category]}
Estado: ${MVP_SECURITY_GATE_STATUS_LABELS[item.status]}
Riesgo: ${MVP_SECURITY_GATE_RISK_LABELS[item.risk]}

Objetivo:
${item.objective}

Controles mínimos:
${item.minimumControls.map((control) => `- ${control}`).join("\n")}

Preguntas de validación:
${item.validationQuestions.map((question) => `- ${question}`).join("\n")}

Condiciones bloqueantes:
${item.blockingConditions.map((condition) => `- ${condition}`).join("\n")}

Límites seguros:
${item.safeBoundaries.map((boundary) => `- ${boundary}`).join("\n")}`;
    })
    .join("\n\n---\n\n");

  return `MVP SECURITY GATE BASE — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

RESUMEN
Gates evaluados: ${summary.total}
Bloqueantes críticos: ${summary.criticalBlockers}
Requeridos antes MVP: ${summary.requiredBeforeMvp}
Riesgo crítico: ${summary.criticalRisk}
Riesgo alto: ${summary.highRisk}

DETALLE
${itemsText}

NOTA
Este Security Gate es conceptual. No crea autenticación real, no crea backend, no conecta APIs, no crea base de datos, no modifica localStorage y no convierte la demo en producción.`;
}

export const SUGGESTED_REPLY_TONE_LABELS: Record<SuggestedReplyTone, string> = {
  commercial: "Comercial",
  support: "Soporte",
  human_handoff: "Derivación humana",
};

export function buildSuggestedWhatsAppReplies(params: {
  conversation: SimulatedWhatsAppConversation;
  analysis: LeadAnalysis;
  profile: CompanyProfile;
}): SuggestedWhatsAppReply[] {
  const { conversation, analysis, profile } = params;

  const serviceName =
    analysis.customServiceName ??
    ORBI_SERVICE_LABELS[analysis.serviceInterest] ??
    "nuestros servicios";

  const firstHumanContact = profile.humanContacts[0];

  const humanContactText = firstHumanContact
    ? `${firstHumanContact.name}, ${firstHumanContact.role}`
    : "nuestro equipo humano";

  return [
    {
      id: `${conversation.id}-reply-commercial`,
      title: "Respuesta comercial inicial",
      tone: "commercial",
      body: `Hola ${conversation.contactName}, gracias por escribir a ${profile.brandName}. Soy ${profile.assistantName}. Podemos ayudarte con ${serviceName}. Para orientarte mejor, ¿me podrías contar brevemente qué necesita tu empresa y en qué plazo te gustaría implementarlo?`,
    },
    {
      id: `${conversation.id}-reply-support`,
      title: "Respuesta de orientación",
      tone: "support",
      body: `Hola ${conversation.contactName}, gracias por contactarnos. Ya identificamos tu consulta y la estamos organizando para darte una respuesta clara. Si puedes, compártenos el nombre de tu empresa, correo y teléfono de contacto para continuar el seguimiento.`,
    },
    {
      id: `${conversation.id}-reply-human`,
      title: "Derivar a contacto humano",
      tone: "human_handoff",
      body: `Hola ${conversation.contactName}, gracias por la información. Por el tipo de solicitud, voy a dejar este caso preparado para que ${humanContactText} pueda revisarlo y continuar la atención contigo. Nuestro equipo te contactará por el canal configurado.`,
    },
  ];
}


export type SecurityValidationArea =
  | "authentication"
  | "rbac"
  | "tenant_isolation"
  | "consent_privacy"
  | "payload_validation"
  | "rate_limiting"
  | "secret_management"
  | "audit_logs"
  | "safe_errors"
  | "release_gate";

export type SecurityValidationStatus =
  | "ready"
  | "partial"
  | "blocked"
  | "pending"
  | "not_applicable_yet";

export type SecurityResidualRisk = "low" | "medium" | "high" | "critical";

export type SecurityValidationItem = {
  id: string;
  title: string;
  area: SecurityValidationArea;
  status: SecurityValidationStatus;
  residualRisk: SecurityResidualRisk;
  acceptanceCriteria: string[];
  requiredEvidence: string[];
  blockers: string[];
  recommendedDecision: string;
};

export const SECURITY_VALIDATION_AREA_LABELS: Record<SecurityValidationArea, string> = {
  authentication: "Autenticación",
  rbac: "RBAC",
  tenant_isolation: "Aislamiento multiempresa",
  consent_privacy: "Consentimiento y privacidad",
  payload_validation: "Validación payloads",
  rate_limiting: "Rate limiting",
  secret_management: "Gestión secretos",
  audit_logs: "Auditoría y logs",
  safe_errors: "Errores seguros",
  release_gate: "Gate de release",
};

export const SECURITY_VALIDATION_STATUS_LABELS: Record<
  SecurityValidationStatus,
  string
> = {
  ready: "Listo",
  partial: "Parcial",
  blocked: "Bloqueado",
  pending: "Pendiente",
  not_applicable_yet: "No aplica aún",
};

export const SECURITY_RESIDUAL_RISK_LABELS: Record<SecurityResidualRisk, string> = {
  low: "Bajo",
  medium: "Medio",
  high: "Alto",
  critical: "Crítico",
};

export const SECURITY_VALIDATION_MATRIX: SecurityValidationItem[] = [
  {
    id: "validation-auth",
    title: "Validación de autenticación backend",
    area: "authentication",
    status: "blocked",
    residualRisk: "critical",
    acceptanceCriteria: [
      "Existe login real controlado por backend.",
      "Los endpoints privados verifican sesión.",
      "La sesión puede expirar o revocarse.",
    ],
    requiredEvidence: [
      "Prueba de login real.",
      "Endpoint privado rechazando acceso sin sesión.",
      "Documento de estrategia de sesión.",
    ],
    blockers: [
      "Aún no existe backend real.",
      "Aún no existe proveedor de autenticación definido.",
    ],
    recommendedDecision:
      "No avanzar a MVP público hasta definir autenticación real y validación server-side.",
  },
  {
    id: "validation-rbac",
    title: "Validación de roles y permisos",
    area: "rbac",
    status: "blocked",
    residualRisk: "critical",
    acceptanceCriteria: [
      "Existen roles mínimos.",
      "Los permisos se validan en backend.",
      "Los cambios críticos requieren rol autorizado.",
    ],
    requiredEvidence: [
      "Matriz de roles.",
      "Pruebas de permisos.",
      "Caso donde usuario sin permiso es bloqueado.",
    ],
    blockers: [
      "RBAC aún es conceptual.",
      "No existe backend para validar permisos.",
    ],
    recommendedDecision:
      "Mantener RBAC como bloqueante crítico antes de cualquier operación real.",
  },
  {
    id: "validation-tenant-isolation",
    title: "Validación de aislamiento multiempresa",
    area: "tenant_isolation",
    status: "blocked",
    residualRisk: "critical",
    acceptanceCriteria: [
      "Toda entidad operativa incluye companyId.",
      "Toda consulta productiva filtra por empresa.",
      "Un usuario no puede acceder a datos de otra empresa.",
    ],
    requiredEvidence: [
      "Pruebas de aislamiento entre dos empresas demo.",
      "Queries backend filtradas por companyId.",
      "Auditoría de endpoints privados.",
    ],
    blockers: [
      "No existe base de datos real.",
      "No existen pruebas backend de aislamiento.",
    ],
    recommendedDecision:
      "No habilitar datos reales hasta validar aislamiento multiempresa.",
  },
  {
    id: "validation-consent-privacy",
    title: "Validación de consentimiento y privacidad",
    area: "consent_privacy",
    status: "partial",
    residualRisk: "high",
    acceptanceCriteria: [
      "Widget público muestra consentimiento visible.",
      "Existe texto mínimo de uso de datos.",
      "Se evita capturar datos sensibles innecesarios.",
    ],
    requiredEvidence: [
      "Captura del texto de consentimiento.",
      "Política mínima de datos.",
      "Checklist de retención inicial.",
    ],
    blockers: [
      "Falta revisión legal formal.",
      "Falta política productiva de retención.",
    ],
    recommendedDecision:
      "Mantener como parcial hasta tener política legal mínima revisada.",
  },
  {
    id: "validation-payloads",
    title: "Validación server-side de payloads",
    area: "payload_validation",
    status: "blocked",
    residualRisk: "critical",
    acceptanceCriteria: [
      "Cada endpoint tiene schema de entrada.",
      "Se rechazan campos no permitidos.",
      "Existen límites de longitud.",
      "El contenido se sanitiza antes de renderizar.",
    ],
    requiredEvidence: [
      "Schemas backend.",
      "Pruebas con payload inválido.",
      "Pruebas con payload excesivo.",
    ],
    blockers: [
      "No existen endpoints reales.",
      "No existe capa backend de validación.",
    ],
    recommendedDecision:
      "No abrir endpoints públicos sin validación server-side.",
  },
  {
    id: "validation-rate-limiting",
    title: "Validación de rate limiting",
    area: "rate_limiting",
    status: "blocked",
    residualRisk: "critical",
    acceptanceCriteria: [
      "Endpoints públicos tienen límites.",
      "Existe bloqueo temporal ante abuso.",
      "Se registran eventos sospechosos.",
    ],
    requiredEvidence: [
      "Prueba de rate limit.",
      "Registro de abuso simulado.",
      "Política de límites por publicKey o IP.",
    ],
    blockers: [
      "No existe runtime real del widget.",
      "No existe endpoint público real.",
    ],
    recommendedDecision:
      "No publicar widget real sin rate limiting.",
  },
  {
    id: "validation-secrets",
    title: "Validación de gestión de secretos",
    area: "secret_management",
    status: "partial",
    residualRisk: "high",
    acceptanceCriteria: [
      "No hay API keys reales en frontend.",
      "Los secretos se definen solo para backend.",
      "No se incluyen credenciales en exports.",
    ],
    requiredEvidence: [
      "Auditoría de variables públicas.",
      "Checklist de secretos.",
      "Separación entre demo y producción.",
    ],
    blockers: [
      "Falta definir proveedor real de secretos.",
      "Falta política de rotación futura.",
    ],
    recommendedDecision:
      "Mantener demo sin secretos reales y preparar Secret Manager para MVP.",
  },
  {
    id: "validation-audit-logs",
    title: "Validación de logs y auditoría",
    area: "audit_logs",
    status: "pending",
    residualRisk: "high",
    acceptanceCriteria: [
      "Se registran cambios críticos.",
      "Se registran errores de seguridad.",
      "Los logs no guardan contraseñas ni secretos.",
    ],
    requiredEvidence: [
      "Modelo AuditLog.",
      "Prueba de cambio auditado.",
      "Prueba de sanitización de logs.",
    ],
    blockers: [
      "Aún no existe backend ni base de datos.",
      "AuditLog solo está definido conceptualmente.",
    ],
    recommendedDecision:
      "Preparar auditoría mínima como requisito antes de operación real.",
  },
  {
    id: "validation-safe-errors",
    title: "Validación de errores seguros",
    area: "safe_errors",
    status: "pending",
    residualRisk: "medium",
    acceptanceCriteria: [
      "Los errores públicos no muestran stack traces.",
      "Los errores técnicos quedan solo en logs internos.",
      "No se revelan tokens, queries ni secretos.",
    ],
    requiredEvidence: [
      "Prueba de error controlado.",
      "Formato estándar de error público.",
      "Política de error interno.",
    ],
    blockers: [
      "No existe backend real.",
      "No existe capa de normalización de errores.",
    ],
    recommendedDecision:
      "Definir estándar de errores antes de crear endpoints reales.",
  },
  {
    id: "validation-release-gate",
    title: "Validación final de release gate",
    area: "release_gate",
    status: "blocked",
    residualRisk: "critical",
    acceptanceCriteria: [
      "No existen bloqueantes críticos abiertos.",
      "Auth, RBAC y aislamiento están validados.",
      "Widget público tiene consentimiento y rate limiting.",
      "Secretos y logs están controlados.",
    ],
    requiredEvidence: [
      "Checklist Security Gate completo.",
      "Pruebas de acceso.",
      "Pruebas de aislamiento.",
      "Revisión de endpoints públicos.",
    ],
    blockers: [
      "MVP aún no tiene backend real.",
      "Hay controles críticos solo conceptuales.",
      "Falta evidencia técnica real.",
    ],
    recommendedDecision:
      "Bloquear release público hasta completar Security Gate técnico real.",
  },
];

export function buildSecurityValidationSummary(items: SecurityValidationItem[]) {
  const total = items.length;

  const ready = items.filter((item) => item.status === "ready").length;
  const partial = items.filter((item) => item.status === "partial").length;
  const blocked = items.filter((item) => item.status === "blocked").length;
  const pending = items.filter((item) => item.status === "pending").length;

  const criticalResidualRisk = items.filter(
    (item) => item.residualRisk === "critical"
  ).length;

  return {
    total,
    ready,
    partial,
    blocked,
    pending,
    criticalResidualRisk,
  };
}

export function buildSecurityValidationMatrixText(params: {
  profile: CompanyProfile;
  items: SecurityValidationItem[];
  summary: ReturnType<typeof buildSecurityValidationSummary>;
}): string {
  const { profile, items, summary } = params;

  const itemsText = items
    .map((item) => {
      return `VALIDACIÓN: ${item.title}
Área: ${SECURITY_VALIDATION_AREA_LABELS[item.area]}
Estado: ${SECURITY_VALIDATION_STATUS_LABELS[item.status]}
Riesgo residual: ${SECURITY_RESIDUAL_RISK_LABELS[item.residualRisk]}

Criterios de aceptación:
${item.acceptanceCriteria.map((criterion) => `- ${criterion}`).join("\n")}

Evidencias requeridas:
${item.requiredEvidence.map((evidence) => `- ${evidence}`).join("\n")}

Bloqueos:
${item.blockers.map((blocker) => `- ${blocker}`).join("\n")}

Decisión recomendada:
${item.recommendedDecision}`;
    })
    .join("\n\n---\n\n");

  return `SECURITY VALIDATION MATRIX — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

RESUMEN
Validaciones: ${summary.total}
Listas: ${summary.ready}
Parciales: ${summary.partial}
Bloqueadas: ${summary.blocked}
Pendientes: ${summary.pending}
Riesgo residual crítico: ${summary.criticalResidualRisk}

DETALLE
${itemsText}

NOTA
Esta matriz de validación es conceptual. No crea backend, no crea autenticación real, no conecta APIs, no modifica localStorage y no habilita producción.`;
}


export type SecurityReleaseDecisionStatus =
  | "approved_for_demo"
  | "blocked_for_public_mvp"
  | "conditional_for_private_pilot"
  | "future_review_required";

export type SecurityReleaseRiskLevel = "low" | "medium" | "high" | "critical";

export type SecurityReleaseDecision = {
  id: string;
  title: string;
  status: SecurityReleaseDecisionStatus;
  residualRisk: SecurityReleaseRiskLevel;
  summary: string;
  blockingReasons: string[];
  minimumConditions: string[];
  recommendedActions: string[];
  finalDecision: string;
};

export type SecurityBlockClosureItem = {
  id: string;
  title: string;
  completed: boolean;
  description: string;
};

export const SECURITY_RELEASE_DECISION_STATUS_LABELS: Record<
  SecurityReleaseDecisionStatus,
  string
> = {
  approved_for_demo: "Aprobado para demo",
  blocked_for_public_mvp: "Bloqueado para MVP público",
  conditional_for_private_pilot: "Condicional para piloto privado",
  future_review_required: "Revisión futura requerida",
};

export const SECURITY_RELEASE_RISK_LEVEL_LABELS: Record<
  SecurityReleaseRiskLevel,
  string
> = {
  low: "Bajo",
  medium: "Medio",
  high: "Alto",
  critical: "Crítico",
};

export const SECURITY_RELEASE_DECISIONS: SecurityReleaseDecision[] = [
  {
    id: "security-release-demo",
    title: "Uso como demo comercial avanzada",
    status: "approved_for_demo",
    residualRisk: "medium",
    summary:
      "ORBI ChatBox IA Core puede seguir utilizándose como demo conceptual avanzada, siempre que se mantengan datos ficticios, límites de alcance visibles y separación clara entre demo y producción.",
    blockingReasons: [
      "No aplica bloqueo para demo si no se usan datos reales.",
      "No aplica bloqueo si no se conecta backend real.",
      "No aplica bloqueo si no se promete operación productiva.",
    ],
    minimumConditions: [
      "Usar datos ficticios.",
      "Mantener notas de alcance visibles.",
      "No conectar WhatsApp real.",
      "No conectar CRM real.",
      "No usar datos sensibles reales.",
    ],
    recommendedActions: [
      "Mantener modo demo separado del futuro runtime productivo.",
      "Usar el bloque 0J como soporte comercial.",
      "Usar la matriz de validación para explicar camino a MVP.",
    ],
    finalDecision:
      "Aprobado para demo comercial conceptual, no aprobado como producción.",
  },
  {
    id: "security-release-public-mvp",
    title: "Salida a MVP público",
    status: "blocked_for_public_mvp",
    residualRisk: "critical",
    summary:
      "La salida a MVP público debe permanecer bloqueada hasta implementar backend real, autenticación, RBAC, aislamiento multiempresa, consentimiento, validación server-side, rate limiting, gestión de secretos y auditoría mínima.",
    blockingReasons: [
      "No existe backend real.",
      "No existe autenticación real.",
      "No existe RBAC backend.",
      "No existe aislamiento multiempresa validado.",
      "No existe rate limiting real.",
      "No existe auditoría backend real.",
    ],
    minimumConditions: [
      "Backend MVP operativo.",
      "Auth y RBAC funcionales.",
      "Base de datos con companyId obligatorio.",
      "Endpoints públicos protegidos.",
      "Consentimiento visible en widget.",
      "Logs de auditoría mínimos.",
    ],
    recommendedActions: [
      "Convertir Backend Foundation en backlog técnico.",
      "Definir stack backend.",
      "Diseñar pruebas de aislamiento.",
      "Diseñar checklist técnico de release.",
    ],
    finalDecision:
      "Bloqueado para MVP público hasta cerrar controles técnicos reales.",
  },
  {
    id: "security-release-private-pilot",
    title: "Piloto privado controlado",
    status: "conditional_for_private_pilot",
    residualRisk: "high",
    summary:
      "Un piloto privado podría evaluarse solo bajo condiciones estrictas: empresa demo controlada, usuarios limitados, datos no sensibles, backend mínimo seguro y sin canales públicos abiertos.",
    blockingReasons: [
      "No puede operar con datos sensibles.",
      "No puede exponerse como widget público sin rate limiting.",
      "No puede aceptar múltiples empresas sin aislamiento probado.",
    ],
    minimumConditions: [
      "Una sola empresa piloto controlada.",
      "Datos de prueba o datos autorizados.",
      "Acceso restringido.",
      "Checklist de seguridad firmado.",
      "Sin WhatsApp real ni CRM real.",
    ],
    recommendedActions: [
      "Definir alcance de piloto privado.",
      "Definir responsables humanos.",
      "Preparar entorno staging.",
      "Preparar rollback manual.",
    ],
    finalDecision:
      "Condicional para piloto privado futuro, no habilitado todavía.",
  },
];

export const SECURITY_BLOCK_0K3_CLOSURE_ITEMS: SecurityBlockClosureItem[] = [
  {
    id: "closure-security-gates",
    title: "Security Gates definidos",
    completed: true,
    description:
      "Se definieron controles de autenticación, RBAC, aislamiento multiempresa, consentimiento, datos personales y bloqueos de producción.",
  },
  {
    id: "closure-security-hardening",
    title: "Hardening conceptual definido",
    completed: true,
    description:
      "Se agregaron validación de payloads, rate limiting, secretos, logs, errores seguros y bloqueo de release.",
  },
  {
    id: "closure-validation-matrix",
    title: "Matriz de validación creada",
    completed: true,
    description:
      "Se creó una matriz con criterios de aceptación, evidencias requeridas, bloqueos y decisión recomendada por área.",
  },
  {
    id: "closure-release-decision",
    title: "Decisión de release documentada",
    completed: true,
    description:
      "Se definió que la app está aprobada como demo conceptual, bloqueada como MVP público y condicional para piloto privado futuro.",
  },
];

export function buildSecurityReleaseDecisionSummary(
  decisions: SecurityReleaseDecision[]
) {
  const total = decisions.length;

  const approvedDemo = decisions.filter(
    (decision) => decision.status === "approved_for_demo"
  ).length;

  const blockedPublicMvp = decisions.filter(
    (decision) => decision.status === "blocked_for_public_mvp"
  ).length;

  const conditionalPilot = decisions.filter(
    (decision) => decision.status === "conditional_for_private_pilot"
  ).length;

  const criticalRisk = decisions.filter(
    (decision) => decision.residualRisk === "critical"
  ).length;

  const highRisk = decisions.filter(
    (decision) => decision.residualRisk === "high"
  ).length;

  return {
    total,
    approvedDemo,
    blockedPublicMvp,
    conditionalPilot,
    criticalRisk,
    highRisk,
  };
}

export function buildSecurityBlockClosureSummary(items: SecurityBlockClosureItem[]) {
  const total = items.length;
  const completed = items.filter((item) => item.completed).length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    total,
    completed,
    progress,
  };
}

export function buildSecurityReleaseDecisionText(params: {
  profile: CompanyProfile;
  decisions: SecurityReleaseDecision[];
  closureItems: SecurityBlockClosureItem[];
  decisionSummary: ReturnType<typeof buildSecurityReleaseDecisionSummary>;
  closureSummary: ReturnType<typeof buildSecurityBlockClosureSummary>;
}): string {
  const {
    profile,
    decisions,
    closureItems,
    decisionSummary,
    closureSummary,
  } = params;

  const decisionsText = decisions
    .map((decision) => {
      return `DECISIÓN: ${decision.title}
Estado: ${SECURITY_RELEASE_DECISION_STATUS_LABELS[decision.status]}
Riesgo residual: ${SECURITY_RELEASE_RISK_LEVEL_LABELS[decision.residualRisk]}

Resumen:
${decision.summary}

Razones bloqueantes:
${decision.blockingReasons.map((reason) => `- ${reason}`).join("\n")}

Condiciones mínimas:
${decision.minimumConditions.map((condition) => `- ${condition}`).join("\n")}

Acciones recomendadas:
${decision.recommendedActions.map((action) => `- ${action}`).join("\n")}

Decisión final:
${decision.finalDecision}`;
    })
    .join("\n\n---\n\n");

  const closureText = closureItems
    .map((item) => {
      return `${item.completed ? "✓" : "○"} ${item.title}
${item.description}`;
    })
    .join("\n\n");

  return `SECURITY RELEASE DECISION — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

RESUMEN DECISIÓN
Decisiones evaluadas: ${decisionSummary.total}
Aprobadas para demo: ${decisionSummary.approvedDemo}
Bloqueadas para MVP público: ${decisionSummary.blockedPublicMvp}
Condicionales para piloto privado: ${decisionSummary.conditionalPilot}
Riesgo crítico: ${decisionSummary.criticalRisk}
Riesgo alto: ${decisionSummary.highRisk}

CIERRE BLOQUE 0K-3
Cierre completado: ${closureSummary.completed}/${closureSummary.total}
Progreso: ${closureSummary.progress}%

DECISIONES
${decisionsText}

CIERRE
${closureText}

NOTA
Esta decisión de release es conceptual. No crea backend, no crea autenticación real, no conecta APIs, no modifica localStorage y no habilita producción.`;
}


export type MvpBacklogEpic =
  | "backend_foundation"
  | "auth_security"
  | "company_config"
  | "conversation_runtime"
  | "lead_management"
  | "widget_public"
  | "reporting_admin"
  | "release_readiness";

export type MvpBacklogStatus =
  | "ready_for_planning"
  | "blocked_by_backend"
  | "blocked_by_security"
  | "future_phase"
  | "demo_support";

export type MvpBacklogPriority = "low" | "medium" | "high" | "critical";

export type MvpBacklogItem = {
  id: string;
  title: string;
  epic: MvpBacklogEpic;
  status: MvpBacklogStatus;
  priority: MvpBacklogPriority;
  userStory: string;
  objective: string;
  dependencies: string[];
  blockers: string[];
  acceptanceCriteria: string[];
};

export const MVP_BACKLOG_EPIC_LABELS: Record<MvpBacklogEpic, string> = {
  backend_foundation: "Backend foundation",
  auth_security: "Auth y seguridad",
  company_config: "Configuración empresa",
  conversation_runtime: "Runtime conversaciones",
  lead_management: "Gestión de leads",
  widget_public: "Widget público",
  reporting_admin: "Reportes admin",
  release_readiness: "Release readiness",
};

export const MVP_BACKLOG_STATUS_LABELS: Record<MvpBacklogStatus, string> = {
  ready_for_planning: "Listo para planificación",
  blocked_by_backend: "Bloqueado por backend",
  blocked_by_security: "Bloqueado por seguridad",
  future_phase: "Fase futura",
  demo_support: "Soporte demo",
};

export const MVP_BACKLOG_PRIORITY_LABELS: Record<MvpBacklogPriority, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  critical: "Crítica",
};

export const MVP_PRODUCT_BACKLOG_ITEMS: MvpBacklogItem[] = [
  {
    id: "backlog-backend-foundation",
    title: "Diseñar backend MVP base",
    epic: "backend_foundation",
    status: "ready_for_planning",
    priority: "critical",
    userStory:
      "Como equipo ORBI, necesito una base backend segura para soportar empresas, usuarios, conversaciones, leads y configuración.",
    objective:
      "Convertir el Backend Foundation conceptual en una primera arquitectura técnica ejecutable.",
    dependencies: [
      "Backend Foundation Plan.",
      "Backend Data Model Base.",
      "API Boundary conceptual.",
      "Decisión de stack backend.",
    ],
    blockers: [
      "No existe backend real.",
      "No existe base de datos real.",
      "No existe proveedor de autenticación definido.",
    ],
    acceptanceCriteria: [
      "Stack backend definido.",
      "Entidades base priorizadas.",
      "Endpoints MVP seleccionados.",
      "Separación pública/privada documentada.",
    ],
  },
  {
    id: "backlog-auth-rbac",
    title: "Implementar autenticación y RBAC mínimo",
    epic: "auth_security",
    status: "blocked_by_backend",
    priority: "critical",
    userStory:
      "Como administrador de empresa, necesito iniciar sesión y acceder solo a funciones permitidas según mi rol.",
    objective:
      "Definir el primer control real de acceso para paneles privados y operaciones sensibles.",
    dependencies: [
      "Backend MVP base.",
      "Modelo User.",
      "Modelo Role.",
      "Security Gate.",
    ],
    blockers: [
      "No hay backend real.",
      "RBAC aún es conceptual.",
      "No hay estrategia de sesión definida.",
    ],
    acceptanceCriteria: [
      "Login real definido.",
      "Roles mínimos definidos.",
      "Permisos validados en backend.",
      "Acceso privado bloqueado sin sesión.",
    ],
  },
  {
    id: "backlog-company-config",
    title: "Crear configuración empresarial persistente",
    epic: "company_config",
    status: "blocked_by_backend",
    priority: "high",
    userStory:
      "Como administrador de empresa, necesito configurar marca, servicios y contactos humanos para adaptar el chatbox a mi organización.",
    objective:
      "Pasar el perfil empresarial desde configuración local/demo hacia modelo persistente futuro.",
    dependencies: [
      "Modelo Company.",
      "CompanyService.",
      "HumanContact.",
      "RBAC mínimo.",
    ],
    blockers: [
      "No existe base de datos real.",
      "No existe endpoint privado de configuración.",
      "Falta auditoría de cambios.",
    ],
    acceptanceCriteria: [
      "Empresa puede guardar configuración.",
      "Servicios pueden editarse con permisos.",
      "Contactos humanos pueden gestionarse.",
      "Cambios críticos quedan auditados.",
    ],
  },
  {
    id: "backlog-conversation-runtime",
    title: "Crear runtime de conversaciones persistentes",
    epic: "conversation_runtime",
    status: "blocked_by_backend",
    priority: "critical",
    userStory:
      "Como visitante o usuario interno, necesito que una conversación se registre de forma segura y asociada a una empresa.",
    objective:
      "Transformar el chat demo en flujo persistente controlado para un MVP real.",
    dependencies: [
      "Conversation.",
      "Message.",
      "API pública/privada.",
      "Consentimiento visible.",
    ],
    blockers: [
      "No hay endpoints reales.",
      "No hay base de datos.",
      "Falta validación server-side de payloads.",
    ],
    acceptanceCriteria: [
      "Conversación se crea asociada a empresa.",
      "Mensajes se validan antes de persistir.",
      "Existe estado básico de conversación.",
      "No se guardan mensajes sin consentimiento.",
    ],
  },
  {
    id: "backlog-lead-management",
    title: "Crear gestión básica de leads",
    epic: "lead_management",
    status: "blocked_by_backend",
    priority: "high",
    userStory:
      "Como equipo comercial, necesito revisar leads generados desde conversaciones y priorizarlos para seguimiento humano.",
    objective:
      "Crear la primera capa productiva de oportunidades comerciales trazables.",
    dependencies: [
      "Conversation runtime.",
      "Lead.",
      "RBAC.",
      "AuditLog mínimo.",
    ],
    blockers: [
      "No existe motor de leads real.",
      "No existe auditoría.",
      "No existe gestión de estados productiva.",
    ],
    acceptanceCriteria: [
      "Lead puede crearse desde conversación.",
      "Lead tiene prioridad y estado.",
      "Lead queda asociado a empresa.",
      "Cambios importantes quedan auditados.",
    ],
  },
  {
    id: "backlog-public-widget",
    title: "Preparar widget público seguro",
    epic: "widget_public",
    status: "blocked_by_security",
    priority: "critical",
    userStory:
      "Como empresa cliente, necesito insertar un widget en mi sitio web para recibir consultas de visitantes de forma segura.",
    objective:
      "Definir la transición desde widget conceptual hacia widget público embebible bajo controles de seguridad.",
    dependencies: [
      "Backend público controlado.",
      "Public company key.",
      "Rate limiting.",
      "Consentimiento visible.",
      "Validación de payloads.",
    ],
    blockers: [
      "No existe rate limiting real.",
      "No existe endpoint público real.",
      "No existe validación server-side.",
    ],
    acceptanceCriteria: [
      "Widget carga solo configuración pública.",
      "Widget no expone datos internos.",
      "Mensajes pasan por endpoint seguro.",
      "Rate limiting y consentimiento están definidos.",
    ],
  },
  {
    id: "backlog-admin-reporting",
    title: "Crear reportes administrativos mínimos",
    epic: "reporting_admin",
    status: "future_phase",
    priority: "medium",
    userStory:
      "Como administrador, necesito ver métricas básicas de conversaciones, leads y derivaciones para evaluar el uso del sistema.",
    objective:
      "Preparar reportes simples sin sobrecargar el MVP inicial.",
    dependencies: [
      "Conversaciones persistentes.",
      "Leads persistentes.",
      "Filtros por empresa.",
      "Agregaciones backend.",
    ],
    blockers: [
      "No existen datos productivos.",
      "No existe endpoint de reportes.",
      "Falta definir métricas finales.",
    ],
    acceptanceCriteria: [
      "Reportes filtran por empresa.",
      "Métricas no exponen datos personales innecesarios.",
      "Existe resumen básico de leads y conversaciones.",
    ],
  },
  {
    id: "backlog-release-readiness",
    title: "Crear checklist de readiness MVP",
    epic: "release_readiness",
    status: "ready_for_planning",
    priority: "high",
    userStory:
      "Como equipo ORBI, necesito un checklist de salida que indique si el MVP puede avanzar a piloto privado o sigue bloqueado.",
    objective:
      "Convertir Security Release Decision y Validation Matrix en checklist operativo de avance.",
    dependencies: [
      "Security Validation Matrix.",
      "Security Release Decision.",
      "Backend Foundation.",
      "MVP Roadmap.",
    ],
    blockers: [
      "Aún no existen evidencias técnicas reales.",
      "Las validaciones siguen siendo conceptuales.",
    ],
    acceptanceCriteria: [
      "Checklist separa demo, piloto privado y MVP público.",
      "Bloqueantes críticos son visibles.",
      "Acciones previas a MVP están priorizadas.",
      "Exportación copiable disponible.",
    ],
  },
];

export function buildMvpProductBacklogSummary(items: MvpBacklogItem[]) {
  const total = items.length;

  const critical = items.filter((item) => item.priority === "critical").length;

  const high = items.filter((item) => item.priority === "high").length;

  const blockedByBackend = items.filter(
    (item) => item.status === "blocked_by_backend"
  ).length;

  const blockedBySecurity = items.filter(
    (item) => item.status === "blocked_by_security"
  ).length;

  const readyForPlanning = items.filter(
    (item) => item.status === "ready_for_planning"
  ).length;

  return {
    total,
    critical,
    high,
    blockedByBackend,
    blockedBySecurity,
    readyForPlanning,
  };
}

export function buildMvpProductBacklogText(params: {
  profile: CompanyProfile;
  items: MvpBacklogItem[];
  summary: ReturnType<typeof buildMvpProductBacklogSummary>;
}): string {
  const { profile, items, summary } = params;

  const itemsText = items
    .map((item) => {
      return `BACKLOG ITEM: ${item.title}
Épica: ${MVP_BACKLOG_EPIC_LABELS[item.epic]}
Estado: ${MVP_BACKLOG_STATUS_LABELS[item.status]}
Prioridad: ${MVP_BACKLOG_PRIORITY_LABELS[item.priority]}

Historia:
${item.userStory}

Objetivo:
${item.objective}

Dependencias:
${item.dependencies.map((dependency) => `- ${dependency}`).join("\n")}

Bloqueos:
${item.blockers.map((blocker) => `- ${blocker}`).join("\n")}

Criterios de aceptación:
${item.acceptanceCriteria.map((criterion) => `- ${criterion}`).join("\n")}`;
    })
    .join("\n\n---\n\n");

  return `MVP PRODUCT BACKLOG BASE — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

RESUMEN
Ítems backlog: ${summary.total}
Prioridad crítica: ${summary.critical}
Prioridad alta: ${summary.high}
Bloqueados por backend: ${summary.blockedByBackend}
Bloqueados por seguridad: ${summary.blockedBySecurity}
Listos para planificación: ${summary.readyForPlanning}

DETALLE
${itemsText}

NOTA
Este MVP Product Backlog es conceptual. No crea backend, no conecta APIs, no crea base de datos, no modifica localStorage and no convierte la demo en producción.`;
}


export type MvpSprintStatus =
  | "ready_for_planning"
  | "blocked"
  | "future"
  | "concept_closed";

export type MvpSprintRisk = "low" | "medium" | "high" | "critical";

export type MvpSprintPlanItem = {
  id: string;
  sprintNumber: number;
  title: string;
  status: MvpSprintStatus;
  risk: MvpSprintRisk;
  objective: string;
  includedBacklogItems: string[];
  expectedDeliverables: string[];
  dependencies: string[];
  blockers: string[];
  exitCriteria: string[];
};

export type MvpBacklogClosureItem = {
  id: string;
  title: string;
  completed: boolean;
  description: string;
};

export const MVP_SPRINT_STATUS_LABELS: Record<MvpSprintStatus, string> = {
  ready_for_planning: "Listo para planificación",
  blocked: "Bloqueado",
  future: "Futuro",
  concept_closed: "Concepto cerrado",
};

export const MVP_SPRINT_RISK_LABELS: Record<MvpSprintRisk, string> = {
  low: "Bajo",
  medium: "Medio",
  high: "Alto",
  critical: "Crítico",
};

export const MVP_SPRINT_PLAN_ITEMS: MvpSprintPlanItem[] = [
  {
    id: "sprint-01-foundation",
    sprintNumber: 1,
    title: "Sprint 1 — Fundación técnica MVP",
    status: "ready_for_planning",
    risk: "critical",
    objective:
      "Definir el stack backend, la estructura base del proyecto productivo y las primeras entidades críticas.",
    includedBacklogItems: [
      "Diseñar backend MVP base",
      "Crear checklist de readiness MVP",
    ],
    expectedDeliverables: [
      "Decisión de stack backend.",
      "Modelo inicial de entidades.",
      "Separación entre demo y runtime productivo.",
      "Checklist inicial de seguridad.",
    ],
    dependencies: [
      "Backend Foundation Plan.",
      "Backend Data Model Base.",
      "API Boundary.",
      "Security Release Decision.",
    ],
    blockers: [
      "No existe backend real.",
      "Falta definir proveedor de auth.",
      "Falta decidir base de datos.",
    ],
    exitCriteria: [
      "Stack backend seleccionado.",
      "Entidades MVP priorizadas.",
      "Endpoints iniciales seleccionados.",
      "Security Gate usado como condición de avance.",
    ],
  },
  {
    id: "sprint-02-auth-security",
    sprintNumber: 2,
    title: "Sprint 2 — Auth, RBAC y aislamiento",
    status: "blocked",
    risk: "critical",
    objective:
      "Preparar autenticación real, roles mínimos y separación multiempresa antes de cualquier dato productivo.",
    includedBacklogItems: [
      "Implementar autenticación y RBAC mínimo",
      "Crear configuración empresarial persistente",
    ],
    expectedDeliverables: [
      "Login real definido.",
      "Roles mínimos.",
      "Permisos backend.",
      "companyId obligatorio.",
      "Pruebas de aislamiento conceptualizadas.",
    ],
    dependencies: [
      "Sprint 1 cerrado.",
      "Modelo User.",
      "Modelo Role.",
      "Modelo Company.",
    ],
    blockers: [
      "No hay backend real.",
      "No hay proveedor auth.",
      "No hay validación backend.",
    ],
    exitCriteria: [
      "Usuario sin sesión no puede acceder.",
      "Rol sin permiso no puede editar.",
      "Empresa A no puede ver datos de Empresa B.",
    ],
  },
  {
    id: "sprint-03-conversations-leads",
    sprintNumber: 3,
    title: "Sprint 3 — Conversaciones y leads",
    status: "blocked",
    risk: "high",
    objective:
      "Convertir el flujo principal del chat demo en conversación persistente y lead trazable.",
    includedBacklogItems: [
      "Crear runtime de conversaciones persistentes",
      "Crear gestión básica de leads",
    ],
    expectedDeliverables: [
      "Conversation y Message operativos.",
      "Lead básico.",
      "Estados de conversación.",
      "Estados de lead.",
      "Derivación humana mínima.",
    ],
    dependencies: [
      "Sprint 2 cerrado.",
      "Base de datos.",
      "RBAC.",
      "Validación de payloads.",
    ],
    blockers: [
      "No existe persistencia real.",
      "No existe validación server-side.",
      "No existe auditoría mínima.",
    ],
    exitCriteria: [
      "Conversación se asocia a empresa.",
      "Lead se crea desde conversación.",
      "Cambio de estado queda trazable.",
      "No se guarda información sin consentimiento.",
    ],
  },
  {
    id: "sprint-04-widget-public",
    sprintNumber: 4,
    title: "Sprint 4 — Widget público controlado",
    status: "blocked",
    risk: "critical",
    objective:
      "Preparar el primer widget público embebible con consentimiento, publicKey, validación y límites de uso.",
    includedBacklogItems: ["Preparar widget público seguro"],
    expectedDeliverables: [
      "publicKey por empresa.",
      "Endpoint público conceptual.",
      "Configuración pública sanitizada.",
      "Consentimiento visible.",
      "Rate limiting definido.",
    ],
    dependencies: [
      "Sprint 3 cerrado.",
      "Security Gate aprobado.",
      "API Boundary público.",
      "Rate limiting.",
    ],
    blockers: [
      "No hay endpoints reales.",
      "No hay rate limiting.",
      "No hay validación productiva.",
    ],
    exitCriteria: [
      "Widget no expone datos internos.",
      "Mensajes pasan por backend seguro.",
      "Consentimiento visible antes de envío.",
      "Endpoint público tiene límites.",
    ],
  },
  {
    id: "sprint-05-reporting-readiness",
    sprintNumber: 5,
    title: "Sprint 5 — Reportes y readiness",
    status: "future",
    risk: "medium",
    objective:
      "Agregar reportes administrativos mínimos y cerrar checklist de avance hacia piloto privado.",
    includedBacklogItems: [
      "Crear reportes administrativos mínimos",
      "Crear checklist de readiness MVP",
    ],
    expectedDeliverables: [
      "Resumen de conversaciones.",
      "Resumen de leads.",
      "Filtros por estado y prioridad.",
      "Checklist piloto privado.",
      "Reporte de bloqueos restantes.",
    ],
    dependencies: [
      "Datos persistentes.",
      "Leads persistentes.",
      "RBAC.",
      "Auditoría mínima.",
    ],
    blockers: [
      "No existen datos reales.",
      "No existen agregaciones backend.",
      "Falta evidencia técnica real.",
    ],
    exitCriteria: [
      "Reportes filtran por empresa.",
      "No exponen datos personales innecesarios.",
      "Readiness separa demo, piloto privado y MVP público.",
    ],
  },
];

export const MVP_PRODUCT_BACKLOG_CLOSURE_ITEMS: MvpBacklogClosureItem[] = [
  {
    id: "closure-backlog-epics",
    title: "Épicas MVP definidas",
    completed: true,
    description:
      "Se definieron épicas para backend, auth, configuración, conversaciones, leads, widget, reportes y readiness.",
  },
  {
    id: "closure-user-stories",
    title: "Historias base creadas",
    completed: true,
    description:
      "Cada ítem del backlog incluye historia, objetivo, dependencias, bloqueos y criterios de aceptación.",
  },
  {
    id: "closure-sprint-sequence",
    title: "Secuencia de sprints definida",
    completed: true,
    description:
      "Se organizó una ruta conceptual desde fundación técnica hasta widget, reportes y readiness.",
  },
  {
    id: "closure-no-production",
    title: "Producción sigue bloqueada",
    completed: true,
    description:
      "El backlog no habilita producción; solo ordena la futura construcción del MVP controlado.",
  },
];

export function buildMvpSprintPlanSummary(items: MvpSprintPlanItem[]) {
  const total = items.length;

  const ready = items.filter(
    (item) => item.status === "ready_for_planning"
  ).length;

  const blocked = items.filter((item) => item.status === "blocked").length;

  const future = items.filter((item) => item.status === "future").length;

  const criticalRisk = items.filter((item) => item.risk === "critical").length;

  return {
    total,
    ready,
    blocked,
    future,
    criticalRisk,
  };
}

export function buildMvpBacklogClosureSummary(items: MvpBacklogClosureItem[]) {
  const total = items.length;
  const completed = items.filter((item) => item.completed).length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    total,
    completed,
    progress,
  };
}

export function buildMvpSprintPlanText(params: {
  profile: CompanyProfile;
  sprints: MvpSprintPlanItem[];
  closureItems: MvpBacklogClosureItem[];
  sprintSummary: ReturnType<typeof buildMvpSprintPlanSummary>;
  closureSummary: ReturnType<typeof buildMvpBacklogClosureSummary>;
}): string {
  const { profile, sprints, closureItems, sprintSummary, closureSummary } =
    params;

  const sprintText = sprints
    .map((sprint) => {
      return `SPRINT ${sprint.sprintNumber}: ${sprint.title}
Estado: ${MVP_SPRINT_STATUS_LABELS[sprint.status]}
Riesgo: ${MVP_SPRINT_RISK_LABELS[sprint.risk]}

Objetivo:
${sprint.objective}

Backlog incluido:
${sprint.includedBacklogItems.map((item) => `- ${item}`).join("\n")}

Entregables esperados:
${sprint.expectedDeliverables.map((item) => `- ${item}`).join("\n")}

Dependencias:
${sprint.dependencies.map((item) => `- ${item}`).join("\n")}

Bloqueos:
${sprint.blockers.map((item) => `- ${item}`).join("\n")}

Criterios de salida:
${sprint.exitCriteria.map((item) => `- ${item}`).join("\n")}`;
    })
    .join("\n\n---\n\n");

  const closureText = closureItems
    .map((item) => {
      return `${item.completed ? "✓" : "○"} ${item.title}
${item.description}`;
    })
    .join("\n\n");

  return `MVP SPRINT PLAN — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

RESUMEN
Sprints: ${sprintSummary.total}
Listos para planificación: ${sprintSummary.ready}
Bloqueados: ${sprintSummary.blocked}
Futuros: ${sprintSummary.future}
Riesgo crítico: ${sprintSummary.criticalRisk}

CIERRE PRODUCT BACKLOG
Cierre completado: ${closureSummary.completed}/${closureSummary.total}
Progreso: ${closureSummary.progress}%

SPRINTS
${sprintText}

CIERRE
${closureText}

NOTA
Este MVP Sprint Plan es conceptual. No crea backend, no conecta APIs, no crea base de datos, no modifica localStorage y no convierte la demo en producción.`;
}


export type MvpReadinessDomain =
  | "demo_commercial"
  | "mvp_scope"
  | "backend_foundation"
  | "data_model"
  | "api_boundary"
  | "security_gate"
  | "product_backlog"
  | "sprint_plan"
  | "public_mvp";

export type MvpReadinessStatus =
  | "ready"
  | "partial"
  | "blocked"
  | "future"
  | "not_applicable_yet";

export type MvpReadinessRisk = "low" | "medium" | "high" | "critical";

export type MvpReadinessItem = {
  id: string;
  title: string;
  domain: MvpReadinessDomain;
  status: MvpReadinessStatus;
  risk: MvpReadinessRisk;
  score: number;
  summary: string;
  completedEvidence: string[];
  blockers: string[];
  nextActions: string[];
  decision: string;
};

export const MVP_READINESS_DOMAIN_LABELS: Record<MvpReadinessDomain, string> = {
  demo_commercial: "Demo comercial",
  mvp_scope: "Alcance MVP",
  backend_foundation: "Backend foundation",
  data_model: "Modelo de datos",
  api_boundary: "API boundary",
  security_gate: "Security gate",
  product_backlog: "Product backlog",
  sprint_plan: "Sprint plan",
  public_mvp: "MVP público",
};

export const MVP_READINESS_STATUS_LABELS: Record<MvpReadinessStatus, string> = {
  ready: "Listo",
  partial: "Parcial",
  blocked: "Bloqueado",
  future: "Futuro",
  not_applicable_yet: "No aplica aún",
};

export const MVP_READINESS_RISK_LABELS: Record<MvpReadinessRisk, string> = {
  low: "Bajo",
  medium: "Medio",
  high: "Alto",
  critical: "Crítico",
};

export const MVP_READINESS_ITEMS: MvpReadinessItem[] = [
  {
    id: "readiness-demo-commercial",
    title: "Demo comercial estable",
    domain: "demo_commercial",
    status: "ready",
    risk: "low",
    score: 100,
    summary:
      "La demo comercial está cerrada, con narrativa, pitch, control live, feedback, follow-up, one-pager y paquete final.",
    completedEvidence: [
      "Bloque 0J cerrado.",
      "Demo Package Builder completado.",
      "One-pager final implementado.",
      "Control de demo y follow-up disponibles.",
    ],
    blockers: [
      "No existen bloqueos para uso como demo conceptual.",
    ],
    nextActions: [
      "Usar solo datos ficticios.",
      "Mantener notas de alcance visibles.",
      "No presentarla como producción real.",
    ],
    decision:
      "Aprobado para demo comercial conceptual.",
  },
  {
    id: "readiness-mvp-scope",
    title: "Alcance MVP definido",
    domain: "mvp_scope",
    status: "ready",
    risk: "medium",
    score: 90,
    summary:
      "El alcance MVP, roadmap, fases, dependencias y criterios de salida están definidos conceptualmente.",
    completedEvidence: [
      "MVP Scope implementado.",
      "MVP Roadmap implementado.",
      "WhatsApp real postergado a fase futura.",
      "Separación demo/runtime documentada.",
    ],
    blockers: [
      "Falta convertir alcance en especificación técnica real.",
    ],
    nextActions: [
      "Mantener widget web como primer canal productivo.",
      "No incluir WhatsApp real en MVP inicial.",
      "Usar backlog como guía de implementación.",
    ],
    decision:
      "Listo para planificación técnica, no para producción.",
  },
  {
    id: "readiness-backend-foundation",
    title: "Backend Foundation conceptual",
    domain: "backend_foundation",
    status: "partial",
    risk: "high",
    score: 70,
    summary:
      "La fundación backend está definida a nivel conceptual, pero aún no existe backend real.",
    completedEvidence: [
      "Backend Foundation Base cerrado.",
      "Backend Foundation Extensión cerrado.",
      "Componentes críticos identificados.",
      "Operaciones prohibidas desde frontend documentadas.",
    ],
    blockers: [
      "No existe backend real.",
      "No existe stack backend seleccionado.",
      "No existe proveedor de autenticación.",
    ],
    nextActions: [
      "Seleccionar stack backend.",
      "Definir auth provider.",
      "Convertir componentes en tareas técnicas.",
    ],
    decision:
      "Parcial: listo como blueprint, bloqueado como implementación real.",
  },
  {
    id: "readiness-data-model",
    title: "Modelo de datos conceptual",
    domain: "data_model",
    status: "partial",
    risk: "high",
    score: 75,
    summary:
      "Las entidades productivas mínimas están definidas, pero aún no existe base de datos real.",
    completedEvidence: [
      "Company, User, Role, Conversation, Message y Lead definidos.",
      "Relaciones y sensibilidad documentadas.",
      "Reglas de seguridad por entidad incluidas.",
    ],
    blockers: [
      "No existe base de datos real.",
      "No existen migraciones.",
      "No hay pruebas de aislamiento multiempresa.",
    ],
    nextActions: [
      "Convertir entidades en schema real.",
      "Definir retención de datos.",
      "Preparar pruebas de aislamiento por companyId.",
    ],
    decision:
      "Parcial: modelo conceptual listo, implementación pendiente.",
  },
  {
    id: "readiness-api-boundary",
    title: "API Boundary conceptual",
    domain: "api_boundary",
    status: "partial",
    risk: "high",
    score: 75,
    summary:
      "Los endpoints conceptuales, exposición pública/privada/interna y reglas de seguridad están documentados.",
    completedEvidence: [
      "10 endpoints conceptuales definidos.",
      "Rutas públicas, privadas e internas separadas.",
      "Acciones prohibidas documentadas.",
      "Cierre Backend Foundation completado.",
    ],
    blockers: [
      "No existen endpoints reales.",
      "No hay validación server-side real.",
      "No hay rate limiting real.",
    ],
    nextActions: [
      "Seleccionar endpoints del MVP inicial.",
      "Definir schemas por endpoint.",
      "Diseñar rate limiting para rutas públicas.",
    ],
    decision:
      "Parcial: límite API listo como diseño, implementación bloqueada por backend.",
  },
  {
    id: "readiness-security-gate",
    title: "Security Gate completo",
    domain: "security_gate",
    status: "blocked",
    risk: "critical",
    score: 55,
    summary:
      "Los controles de seguridad están definidos, pero el MVP público sigue bloqueado por falta de evidencias técnicas reales.",
    completedEvidence: [
      "Security Gate Base completado.",
      "Hardening conceptual completado.",
      "Validation Matrix completada.",
      "Release Decision completada.",
    ],
    blockers: [
      "No existe autenticación real.",
      "No existe RBAC backend.",
      "No existe aislamiento validado.",
      "No existe rate limiting real.",
      "No existen logs reales.",
    ],
    nextActions: [
      "Implementar auth real antes de datos productivos.",
      "Validar aislamiento multiempresa.",
      "Crear checklist técnico de release.",
    ],
    decision:
      "Bloqueado para MVP público. Aprobado solo para demo conceptual.",
  },
  {
    id: "readiness-product-backlog",
    title: "Product Backlog MVP",
    domain: "product_backlog",
    status: "ready",
    risk: "medium",
    score: 90,
    summary:
      "El backlog MVP y la secuencia de sprints están definidos para guiar la construcción futura.",
    completedEvidence: [
      "Product Backlog Base cerrado.",
      "Sprint Plan cerrado.",
      "Épicas, historias, bloqueos y criterios definidos.",
      "Cierre 0K-4 completado.",
    ],
    blockers: [
      "Backlog no implica implementación real.",
      "Faltan decisiones técnicas de stack.",
    ],
    nextActions: [
      "Convertir backlog conceptual en tareas técnicas reales.",
      "Separar tareas frontend, backend, seguridad y QA.",
      "Priorizar Sprint 1.",
    ],
    decision:
      "Listo para planificación de implementación.",
  },
  {
    id: "readiness-public-mvp",
    title: "MVP público",
    domain: "public_mvp",
    status: "blocked",
    risk: "critical",
    score: 25,
    summary:
      "El MVP público no debe habilitarse todavía porque faltan backend real, autenticación, base de datos, seguridad y pruebas.",
    completedEvidence: [
      "Decisión de release documentada.",
      "Bloqueo de MVP público declarado.",
    ],
    blockers: [
      "No hay backend real.",
      "No hay autenticación real.",
      "No hay base de datos real.",
      "No hay endpoints reales.",
      "No hay Security Gate técnico aprobado.",
    ],
    nextActions: [
      "No activar producción.",
      "No usar datos reales.",
      "No publicar widget real.",
      "Preparar primero piloto privado controlado.",
    ],
    decision:
      "Bloqueado para MVP público.",
  },
];

export function buildMvpReadinessSummary(items: MvpReadinessItem[]) {
  const total = items.length;

  const ready = items.filter((item) => item.status === "ready").length;
  const partial = items.filter((item) => item.status === "partial").length;
  const blocked = items.filter((item) => item.status === "blocked").length;

  const criticalRisk = items.filter((item) => item.risk === "critical").length;

  const averageScore =
    total === 0
      ? 0
      : Math.round(
          items.reduce((sum, item) => sum + item.score, 0) / total
        );

  return {
    total,
    ready,
    partial,
    blocked,
    criticalRisk,
    averageScore,
  };
}

export function buildMvpReadinessDashboardText(params: {
  profile: CompanyProfile;
  items: MvpReadinessItem[];
  summary: ReturnType<typeof buildMvpReadinessSummary>;
}): string {
  const { profile, items, summary } = params;

  const itemsText = items
    .map((item) => {
      return `READINESS ITEM: ${item.title}
Dominio: ${MVP_READINESS_DOMAIN_LABELS[item.domain]}
Estado: ${MVP_READINESS_STATUS_LABELS[item.status]}
Riesgo: ${MVP_READINESS_RISK_LABELS[item.risk]}
Score: ${item.score}%

Resumen:
${item.summary}

Evidencias completadas:
${item.completedEvidence.map((evidence) => `- ${evidence}`).join("\n")}

Bloqueos:
${item.blockers.map((blocker) => `- ${blocker}`).join("\n")}

Próximas acciones:
${item.nextActions.map((action) => `- ${action}`).join("\n")}

Decisión:
${item.decision}`;
    })
    .join("\n\n---\n\n");

  return `MVP READINESS DASHBOARD — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

RESUMEN
Dominios evaluados: ${summary.total}
Listos: ${summary.ready}
Parciales: ${summary.partial}
Bloqueados: ${summary.blocked}
Riesgo crítico: ${summary.criticalRisk}
Readiness promedio: ${summary.averageScore}%

DETALLE
${itemsText}

NOTA
Este MVP Readiness Dashboard es conceptual. No crea backend, no conecta APIs, no crea base de datos, no modifica localStorage y no habilita producción.`;
}


export type PilotReadinessDecisionType =
  | "go_demo"
  | "conditional_private_pilot"
  | "no_go_public_mvp"
  | "future_review";

export type PilotReadinessRisk = "low" | "medium" | "high" | "critical";

export type PilotReadinessDecision = {
  id: string;
  title: string;
  decisionType: PilotReadinessDecisionType;
  risk: PilotReadinessRisk;
  readinessScore: number;
  summary: string;
  allowedScope: string[];
  blockedScope: string[];
  requiredBeforeAdvance: string[];
  recommendedNextActions: string[];
  finalDecision: string;
};

export type MvpReadinessClosureItem = {
  id: string;
  title: string;
  completed: boolean;
  description: string;
};

export const PILOT_READINESS_DECISION_TYPE_LABELS: Record<
  PilotReadinessDecisionType,
  string
> = {
  go_demo: "GO Demo",
  conditional_private_pilot: "Piloto privado condicional",
  no_go_public_mvp: "NO-GO MVP público",
  future_review: "Revisión futura",
};

export const PILOT_READINESS_RISK_LABELS: Record<PilotReadinessRisk, string> = {
  low: "Bajo",
  medium: "Medio",
  high: "Alto",
  critical: "Crítico",
};

export const PILOT_READINESS_DECISIONS: PilotReadinessDecision[] = [
  {
    id: "decision-demo-commercial",
    title: "Demo comercial conceptual",
    decisionType: "go_demo",
    risk: "low",
    readinessScore: 100,
    summary:
      "ORBI ChatBox IA Core está listo para seguir siendo usado como demo comercial avanzada, siempre que se mantengan datos ficticios, límites visibles y separación clara entre demo y producción.",
    allowedScope: [
      "Presentaciones comerciales.",
      "Demostraciones internas.",
      "Revisión con socios o inversionistas.",
      "Uso de Demo Package, One-pager y Readiness Dashboard.",
    ],
    blockedScope: [
      "Uso con datos reales sensibles.",
      "Prometer operación productiva.",
      "Conectar WhatsApp real.",
      "Conectar CRM real.",
    ],
    requiredBeforeAdvance: [
      "Mantener notas de alcance visibles.",
      "Usar solo datos ficticios.",
      "Explicar que backend y APIs aún son conceptuales.",
    ],
    recommendedNextActions: [
      "Preparar demo por industria.",
      "Crear guion de presentación corto.",
      "Usar dashboard de readiness para explicar próximos pasos.",
    ],
    finalDecision:
      "GO para demo comercial conceptual. No corresponde a producción real.",
  },
  {
    id: "decision-private-pilot",
    title: "Piloto privado controlado",
    decisionType: "conditional_private_pilot",
    risk: "high",
    readinessScore: 60,
    summary:
      "Un piloto privado podría evaluarse en el futuro solo si se limita a una empresa controlada, usuarios autorizados, datos no sensibles y backend mínimo seguro.",
    allowedScope: [
      "Piloto cerrado con una empresa.",
      "Entorno staging.",
      "Datos de prueba o datos autorizados.",
      "Acceso restringido.",
    ],
    blockedScope: [
      "Piloto público.",
      "Múltiples empresas sin aislamiento probado.",
      "Datos sensibles sin política.",
      "Widget público sin rate limiting.",
    ],
    requiredBeforeAdvance: [
      "Definir stack backend.",
      "Implementar auth mínima.",
      "Implementar aislamiento por companyId.",
      "Definir política de datos.",
      "Validar endpoints privados.",
    ],
    recommendedNextActions: [
      "Convertir Sprint 1 en tareas técnicas.",
      "Preparar entorno staging.",
      "Definir criterios de éxito del piloto.",
      "Diseñar checklist de rollback.",
    ],
    finalDecision:
      "Condicional. No habilitado todavía; requiere backend y seguridad mínima.",
  },
  {
    id: "decision-public-mvp",
    title: "MVP público",
    decisionType: "no_go_public_mvp",
    risk: "critical",
    readinessScore: 25,
    summary:
      "El MVP público debe permanecer bloqueado porque aún no existen backend real, autenticación real, base de datos, endpoints productivos, rate limiting, auditoría ni pruebas de aislamiento.",
    allowedScope: [
      "Solo planificación conceptual.",
      "Uso del backlog como guía.",
      "Preparación técnica futura.",
    ],
    blockedScope: [
      "Publicar widget real.",
      "Recibir datos reales de visitantes.",
      "Activar clientes reales.",
      "Ofrecer SLA o soporte productivo.",
      "Conectar integraciones externas.",
    ],
    requiredBeforeAdvance: [
      "Backend real operativo.",
      "Auth y RBAC backend.",
      "Base de datos multiempresa.",
      "Validación server-side.",
      "Rate limiting.",
      "Logs de auditoría.",
      "Security Gate técnico aprobado.",
    ],
    recommendedNextActions: [
      "No avanzar a producción.",
      "No conectar APIs externas.",
      "Priorizar fundación backend.",
      "Revisar Security Validation Matrix antes de cualquier release.",
    ],
    finalDecision:
      "NO-GO para MVP público. Bloqueado hasta completar infraestructura y seguridad real.",
  },
];

export const MVP_READINESS_BLOCK_CLOSURE_ITEMS: MvpReadinessClosureItem[] = [
  {
    id: "closure-readiness-dashboard",
    title: "Readiness Dashboard creado",
    completed: true,
    description:
      "Se creó una consola global para evaluar dominios, scores, riesgos, evidencias, bloqueos y próximas acciones.",
  },
  {
    id: "closure-go-no-go",
    title: "Decisión Go / No-Go documentada",
    completed: true,
    description:
      "Se definió GO para demo conceptual, condicional para piloto privado y NO-GO para MVP público.",
  },
  {
    id: "closure-risk-visible",
    title: "Riesgo residual visible",
    completed: true,
    description:
      "La app muestra claramente qué dominios están listos, parciales, bloqueados o con riesgo crítico.",
  },
  {
    id: "closure-production-blocked",
    title: "Producción bloqueada correctamente",
    completed: true,
    description:
      "El bloque reafirma que no debe habilitarse producción sin backend, seguridad, datos, endpoints y validaciones reales.",
  },
];

export function buildPilotReadinessDecisionSummary(
  decisions: PilotReadinessDecision[]
) {
  const total = decisions.length;

  const goDemo = decisions.filter(
    (decision) => decision.decisionType === "go_demo"
  ).length;

  const conditionalPilot = decisions.filter(
    (decision) => decision.decisionType === "conditional_private_pilot"
  ).length;

  const noGoPublicMvp = decisions.filter(
    (decision) => decision.decisionType === "no_go_public_mvp"
  ).length;

  const criticalRisk = decisions.filter(
    (decision) => decision.risk === "critical"
  ).length;

  const averageScore =
    total === 0
      ? 0
      : Math.round(
          decisions.reduce(
            (sum, decision) => sum + decision.readinessScore,
            0
          ) / total
        );

  return {
    total,
    goDemo,
    conditionalPilot,
    noGoPublicMvp,
    criticalRisk,
    averageScore,
  };
}

export function buildMvpReadinessClosureSummary(items: MvpReadinessClosureItem[]) {
  const total = items.length;
  const completed = items.filter((item) => item.completed).length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    total,
    completed,
    progress,
  };
}

export function buildPilotReadinessDecisionText(params: {
  profile: CompanyProfile;
  decisions: PilotReadinessDecision[];
  closureItems: MvpReadinessClosureItem[];
  decisionSummary: ReturnType<typeof buildPilotReadinessDecisionSummary>;
  closureSummary: ReturnType<typeof buildMvpReadinessClosureSummary>;
}): string {
  const {
    profile,
    decisions,
    closureItems,
    decisionSummary,
    closureSummary,
  } = params;

  const decisionsText = decisions
    .map((decision) => {
      return `DECISIÓN: ${decision.title}
Tipo: ${PILOT_READINESS_DECISION_TYPE_LABELS[decision.decisionType]}
Riesgo: ${PILOT_READINESS_RISK_LABELS[decision.risk]}
Readiness: ${decision.readinessScore}%

Resumen:
${decision.summary}

Alcance permitido:
${decision.allowedScope.map((item) => `- ${item}`).join("\n")}

Alcance bloqueado:
${decision.blockedScope.map((item) => `- ${item}`).join("\n")}

Requerido antes de avanzar:
${decision.requiredBeforeAdvance.map((item) => `- ${item}`).join("\n")}

Acciones recomendadas:
${decision.recommendedNextActions.map((item) => `- ${item}`).join("\n")}

Decisión final:
${decision.finalDecision}`;
    })
    .join("\n\n---\n\n");

  const closureText = closureItems
    .map((item) => {
      return `${item.completed ? "✓" : "○"} ${item.title}
${item.description}`;
    })
    .join("\n\n");

  return `PILOT READINESS DECISION — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

RESUMEN DECISIÓN
Decisiones evaluadas: ${decisionSummary.total}
GO Demo: ${decisionSummary.goDemo}
Piloto condicional: ${decisionSummary.conditionalPilot}
NO-GO MVP público: ${decisionSummary.noGoPublicMvp}
Riesgo crítico: ${decisionSummary.criticalRisk}
Score promedio: ${decisionSummary.averageScore}%

CIERRE BLOQUE 0K-5
Cierre completado: ${closureSummary.completed}/${closureSummary.total}
Progreso: ${closureSummary.progress}%

DECISIONES
${decisionsText}

CIERRE
${closureText}

NOTA
Esta Pilot Readiness Decision es conceptual. No crea backend, no conecta APIs, no crea base de datos, no modifica localStorage y no habilita producción.`;
}


export type PrivatePilotCategory =
  | "allowed_scope"
  | "blocked_scope"
  | "pilot_roles"
  | "required_condition"
  | "risk_control"
  | "governance";

export type PrivatePilotStatus =
  | "required"
  | "recommended"
  | "blocked"
  | "future";

export type PrivatePilotRisk = "low" | "medium" | "high" | "critical";

export type PrivatePilotItem = {
  id: string;
  title: string;
  category: PrivatePilotCategory;
  status: PrivatePilotStatus;
  risk: PrivatePilotRisk;
  summary: string;
  requirements: string[];
  restrictions: string[];
  validationQuestions: string[];
  decision: string;
};

export const PRIVATE_PILOT_CATEGORY_LABELS: Record<PrivatePilotCategory, string> = {
  allowed_scope: "Alcance permitido",
  blocked_scope: "Alcance bloqueado",
  pilot_roles: "Roles piloto",
  required_condition: "Condición requerida",
  risk_control: "Control de riesgo",
  governance: "Gobernanza",
};

export const PRIVATE_PILOT_STATUS_LABELS: Record<PrivatePilotStatus, string> = {
  required: "Requerido",
  recommended: "Recomendado",
  blocked: "Bloqueado",
  future: "Futuro",
};

export const PRIVATE_PILOT_RISK_LABELS: Record<PrivatePilotRisk, string> = {
  low: "Bajo",
  medium: "Medio",
  high: "Alto",
  critical: "Crítico",
};

export const PRIVATE_PILOT_PACK_ITEMS: PrivatePilotItem[] = [
  {
    id: "pilot-allowed-demo-company",
    title: "Piloto con una empresa controlada",
    category: "allowed_scope",
    status: "required",
    risk: "medium",
    summary:
      "El piloto privado solo debe evaluarse con una empresa controlada, datos limitados y usuarios autorizados.",
    requirements: [
      "Empresa piloto definida.",
      "Responsable interno asignado.",
      "Usuarios autorizados identificados.",
      "Datos de prueba o datos autorizados.",
    ],
    restrictions: [
      "No abrir a múltiples empresas.",
      "No usar datos sensibles sin autorización.",
      "No prometer disponibilidad productiva.",
    ],
    validationQuestions: [
      "¿Existe una empresa piloto claramente definida?",
      "¿Hay usuarios autorizados?",
      "¿Los datos son de prueba o están autorizados?",
    ],
    decision:
      "Permitido solo como piloto privado cerrado, no como MVP público.",
  },
  {
    id: "pilot-blocked-public-widget",
    title: "Widget público real bloqueado",
    category: "blocked_scope",
    status: "blocked",
    risk: "critical",
    summary:
      "El widget público real debe permanecer bloqueado hasta existir backend seguro, rate limiting, consentimiento y validación server-side.",
    requirements: [
      "Backend real.",
      "Endpoint público controlado.",
      "Rate limiting.",
      "Consentimiento visible.",
      "Validación de payloads.",
    ],
    restrictions: [
      "No publicar widget en sitio real.",
      "No recibir mensajes de visitantes reales.",
      "No usar publicKey productiva.",
    ],
    validationQuestions: [
      "¿Existe backend público seguro?",
      "¿El endpoint tiene límites?",
      "¿El consentimiento está visible antes del envío?",
    ],
    decision:
      "Bloqueado para piloto inicial si no existen controles reales.",
  },
  {
    id: "pilot-role-owner",
    title: "Rol Owner del piloto",
    category: "pilot_roles",
    status: "required",
    risk: "high",
    summary:
      "Debe existir un responsable principal del piloto para controlar alcance, usuarios, decisiones y cierre.",
    requirements: [
      "Responsable ORBI definido.",
      "Responsable de empresa piloto definido.",
      "Canal de comunicación acordado.",
      "Criterios de éxito acordados.",
    ],
    restrictions: [
      "No ejecutar piloto sin responsable.",
      "No aceptar cambios de alcance sin revisión.",
    ],
    validationQuestions: [
      "¿Quién aprueba el inicio del piloto?",
      "¿Quién valida el cierre?",
      "¿Quién gestiona incidentes o bloqueos?",
    ],
    decision:
      "Requerido antes de cualquier piloto privado.",
  },
  {
    id: "pilot-required-backend-minimum",
    title: "Backend mínimo seguro requerido",
    category: "required_condition",
    status: "required",
    risk: "critical",
    summary:
      "Un piloto privado con datos persistentes requiere backend mínimo seguro, aunque sea limitado.",
    requirements: [
      "Auth real.",
      "RBAC mínimo.",
      "Base de datos aislada por companyId.",
      "Validación server-side.",
      "Logs mínimos.",
    ],
    restrictions: [
      "No usar localStorage como base productiva.",
      "No permitir panel admin sin autenticación.",
      "No aceptar datos reales sin backend.",
    ],
    validationQuestions: [
      "¿Existe backend mínimo?",
      "¿La empresa está aislada?",
      "¿Los datos se validan en backend?",
    ],
    decision:
      "Condición obligatoria para piloto privado con datos persistentes.",
  },
  {
    id: "pilot-risk-data",
    title: "Control de datos personales",
    category: "risk_control",
    status: "required",
    risk: "critical",
    summary:
      "El piloto debe limitar la captura de datos personales y definir retención, acceso y eliminación.",
    requirements: [
      "Datos mínimos necesarios.",
      "Consentimiento o autorización.",
      "Acceso restringido.",
      "Retención definida.",
      "Exportación controlada.",
    ],
    restrictions: [
      "No capturar datos sensibles innecesarios.",
      "No exportar libremente leads o conversaciones.",
      "No usar información real sin autorización.",
    ],
    validationQuestions: [
      "¿Qué datos se capturan?",
      "¿Quién puede verlos?",
      "¿Cuánto tiempo se conservan?",
    ],
    decision:
      "Debe resolverse antes de cualquier piloto con datos reales.",
  },
  {
    id: "pilot-governance-close",
    title: "Gobernanza y cierre del piloto",
    category: "governance",
    status: "recommended",
    risk: "medium",
    summary:
      "El piloto debe tener criterios de éxito, criterios de salida, responsables y decisión final documentada.",
    requirements: [
      "Criterios de éxito.",
      "Criterios de salida.",
      "Checklist de cierre.",
      "Reporte final.",
      "Decisión continuar/pausar/descartar.",
    ],
    restrictions: [
      "No extender piloto indefinidamente.",
      "No pasar a MVP público sin nueva validación.",
    ],
    validationQuestions: [
      "¿Cuándo se considera exitoso?",
      "¿Cuándo se detiene?",
      "¿Qué evidencia se debe recopilar?",
    ],
    decision:
      "Recomendado para evitar pilotos sin cierre claro.",
  },
];

export function buildPrivatePilotPackSummary(items: PrivatePilotItem[]) {
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

export function buildPrivatePilotPackText(params: {
  profile: CompanyProfile;
  items: PrivatePilotItem[];
  summary: ReturnType<typeof buildPrivatePilotPackSummary>;
}): string {
  const { profile, items, summary } = params;

  const itemsText = items
    .map((item) => {
      return `PILOT ITEM: ${item.title}
Categoría: ${PRIVATE_PILOT_CATEGORY_LABELS[item.category]}
Estado: ${PRIVATE_PILOT_STATUS_LABELS[item.status]}
Riesgo: ${PRIVATE_PILOT_RISK_LABELS[item.risk]}

Resumen:
${item.summary}

Requisitos:
${item.requirements.map((req) => `- ${req}`).join("\n")}

Restricciones:
${item.restrictions.map((res) => `- ${res}`).join("\n")}

Preguntas de validación:
${item.validationQuestions.map((question) => `- ${question}`).join("\n")}

Decisión:
${item.decision}`;
    })
    .join("\n\n---\n\n");

  return `PRIVATE PILOT PACK BASE — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

RESUMEN
Ítems piloto: ${summary.total}
Requeridos: ${summary.required}
Recomendados: ${summary.recommended}
Bloqueados: ${summary.blocked}
Riesgo crítico: ${summary.criticalRisk}

DETALLE
${itemsText}

NOTA
Este Private Pilot Pack es conceptual. No crea backend, no conecta APIs, no crea base de datos, no modifica localStorage y no habilita producción.`;
}


export type TechnicalHandoffArea =
  | "frontend"
  | "backend"
  | "database"
  | "auth_security"
  | "public_widget"
  | "observability"
  | "qa_release"
  | "deployment";

export type TechnicalHandoffStatus =
  | "recommended"
  | "required_before_build"
  | "blocked"
  | "future_phase";

export type TechnicalHandoffRisk = "low" | "medium" | "high" | "critical";

export type TechnicalHandoffItem = {
  id: string;
  title: string;
  area: TechnicalHandoffArea;
  status: TechnicalHandoffStatus;
  risk: TechnicalHandoffRisk;
  summary: string;
  recommendedStack: string[];
  technicalTasks: string[];
  dependencies: string[];
  implementationRisks: string[];
  nextStep: string;
};

export const TECHNICAL_HANDOFF_AREA_LABELS: Record<TechnicalHandoffArea, string> = {
  frontend: "Frontend",
  backend: "Backend",
  database: "Base de datos",
  auth_security: "Auth y seguridad",
  public_widget: "Widget público",
  observability: "Observabilidad",
  qa_release: "QA y release",
  deployment: "Despliegue",
};

export const TECHNICAL_HANDOFF_STATUS_LABELS: Record<
  TechnicalHandoffStatus,
  string
> = {
  recommended: "Recomendado",
  required_before_build: "Requerido antes de construir",
  blocked: "Bloqueado",
  future_phase: "Fase futura",
};

export const TECHNICAL_HANDOFF_RISK_LABELS: Record<TechnicalHandoffRisk, string> = {
  low: "Bajo",
  medium: "Medio",
  high: "Alto",
  critical: "Crítico",
};

export const TECHNICAL_HANDOFF_ITEMS: TechnicalHandoffItem[] = [
  {
    id: "handoff-frontend",
    title: "Frontend productivo separado de demo",
    area: "frontend",
    status: "recommended",
    risk: "medium",
    summary:
      "Mantener la interfaz actual como demo avanzada, pero preparar una separación futura entre demo, admin privado y widget público.",
    recommendedStack: [
      "React + Vite.",
      "TypeScript estricto.",
      "Componentes separados por dominio.",
      "Feature flags conceptuales para demo/admin/widget.",
    ],
    technicalTasks: [
      "Separar vistas demo de vistas productivas futuras.",
      "Crear carpeta conceptual para admin runtime.",
      "Crear carpeta conceptual para widget runtime.",
      "Mantener Module Registry visible.",
    ],
    dependencies: [
      "MVP Scope.",
      "Product Backlog.",
      "Readiness Dashboard.",
    ],
    implementationRisks: [
      "Mezclar demo con producción.",
      "Duplicar lógica de chat.",
      "Convertir localStorage demo en dependencia productiva.",
    ],
    nextStep:
      "Preparar mapa de carpetas futuro sin crear todavía backend ni runtime real.",
  },
  {
    id: "handoff-backend",
    title: "Backend MVP recomendado",
    area: "backend",
    status: "required_before_build",
    risk: "critical",
    summary:
      "Definir el backend mínimo antes de cualquier piloto real con datos persistentes, usuarios o empresas.",
    recommendedStack: [
      "Node.js + NestJS o Express/Fastify.",
      "API REST inicial.",
      "Validación server-side con Zod o Joi.",
      "Arquitectura modular por dominios.",
    ],
    technicalTasks: [
      "Definir stack backend final.",
      "Crear módulos auth, company, conversation, lead y audit.",
      "Implementar API Boundary real.",
      "Crear manejo seguro de errores.",
    ],
    dependencies: [
      "Backend Foundation Plan.",
      "API Boundary.",
      "Security Gate.",
      "Sprint Plan.",
    ],
    implementationRisks: [
      "Crear endpoints sin validación.",
      "No separar rutas públicas y privadas.",
      "Exponer lógica sensible al frontend.",
    ],
    nextStep:
      "Tomar decisión de stack backend antes de iniciar implementación real.",
  },
  {
    id: "handoff-database",
    title: "Base de datos multiempresa",
    area: "database",
    status: "required_before_build",
    risk: "critical",
    summary:
      "Preparar una base de datos con companyId obligatorio, entidades mínimas y aislamiento entre empresas.",
    recommendedStack: [
      "PostgreSQL.",
      "Prisma ORM o Drizzle ORM.",
      "Migraciones versionadas.",
      "Índices por companyId y estados principales.",
    ],
    technicalTasks: [
      "Convertir Company, User, Role, Conversation, Message y Lead en schema real.",
      "Agregar AuditLog.",
      "Definir relaciones y constraints.",
      "Crear pruebas de aislamiento por companyId.",
    ],
    dependencies: [
      "Backend Data Model Base.",
      "Security Validation Matrix.",
      "Private Pilot Pack.",
    ],
    implementationRisks: [
      "Cruce de datos entre empresas.",
      "Falta de retención de datos.",
      "Modelos sin auditoría.",
    ],
    nextStep:
      "Crear diseño de schema real en módulo futuro, todavía sin implementar DB.",
  },
  {
    id: "handoff-auth-security",
    title: "Auth, RBAC y secretos",
    area: "auth_security",
    status: "required_before_build",
    risk: "critical",
    summary:
      "Definir la capa mínima de autenticación, permisos, secretos y controles antes de cualquier operación real.",
    recommendedStack: [
      "Auth provider defined.",
      "JWT o sesiones seguras.",
      "RBAC backend.",
      "Secret Manager o variables privadas del servidor.",
    ],
    technicalTasks: [
      "Definir proveedor de autenticación.",
      "Crear roles mínimos.",
      "Validar permisos en backend.",
      "Separar secretos de frontend.",
      "Crear checklist de seguridad real.",
    ],
    dependencies: [
      "MVP Security Gate.",
      "Security Release Decision.",
      "Pilot Readiness Decision.",
    ],
    implementationRisks: [
      "Confiar en controles visuales.",
      "Guardar secretos en frontend.",
      "Permitir admin sin sesión real.",
    ],
    nextStep:
      "Decidir estrategia auth antes de diseñar endpoints privados.",
  },
  {
    id: "handoff-public-widget",
    title: "Widget público controlado",
    area: "public_widget",
    status: "blocked",
    risk: "critical",
    summary:
      "El widget público real debe permanecer bloqueado hasta que existan endpoints públicos seguros, rate limiting y consentimiento.",
    recommendedStack: [
      "Script embebible separado.",
      "publicKey por empresa.",
      "Endpoint público sanitizado.",
      "Rate limiting por publicKey/IP.",
    ],
    technicalTasks: [
      "Diseñar runtime del widget.",
      "Definir configuración pública segura.",
      "Definir payload permitido.",
      "Aplicar consentimiento visible.",
      "Aplicar límites de abuso.",
    ],
    dependencies: [
      "Backend MVP.",
      "Database multiempresa.",
      "Rate limiting.",
      "Security Gate técnico.",
    ],
    implementationRisks: [
      "Exponer datos internos.",
      "Recibir spam ilimitado.",
      "Capturar datos sin consentimiento.",
    ],
    nextStep:
      "Mantener bloqueado hasta cerrar backend y security gate real.",
  },
  {
    id: "handoff-observability",
    title: "Observabilidad y auditoría mínima",
    area: "observability",
    status: "recommended",
    risk: "high",
    summary:
      "Definir logs mínimos, eventos críticos, auditoría y trazabilidad antes de piloto privado.",
    recommendedStack: [
      "AuditLog en base de datos.",
      "Logs backend sanitizados.",
      "Eventos críticos por dominio.",
      "Métricas básicas de uso.",
    ],
    technicalTasks: [
      "Definir eventos auditables.",
      "Crear estructura AuditLog.",
      "Evitar logs con contraseñas o secretos.",
      "Crear reporte de errores críticos.",
    ],
    dependencies: [
      "Backend Foundation.",
      "Security Hardening.",
      "Private Pilot Pack.",
    ],
    implementationRisks: [
      "No poder investigar incidentes.",
      "Registrar datos personales innecesarios.",
      "Depender de console.log.",
    ],
    nextStep:
      "Definir modelo AuditLog real en futura etapa técnica.",
  },
  {
    id: "handoff-qa-release",
    title: "QA técnico y release controlado",
    area: "qa_release",
    status: "recommended",
    risk: "high",
    summary:
      "Convertir los criterios conceptuales en pruebas reales antes de piloto privado o MVP público.",
    recommendedStack: [
      "Checklist QA manual.",
      "Pruebas de endpoints.",
      "Pruebas de permisos.",
      "Pruebas de aislamiento multiempresa.",
    ],
    technicalTasks: [
      "Crear matriz de pruebas reales.",
      "Validar auth y RBAC.",
      "Validar companyId.",
      "Validar payloads inválidos.",
      "Validar errores seguros.",
    ],
    dependencies: [
      "Security Validation Matrix.",
      "Sprint Plan.",
      "Readiness Dashboard.",
    ],
    implementationRisks: [
      "Liberar sin evidencias.",
      "Confundir demo con MVP.",
      "No detectar fallas de seguridad.",
    ],
    nextStep:
      "Preparar checklist QA técnico en siguiente módulo.",
  },
  {
    id: "handoff-deployment",
    title: "Despliegue y entornos",
    area: "deployment",
    status: "future_phase",
    risk: "high",
    summary:
      "Separar demo, staging y producción antes de usar datos reales o clientes reales.",
    recommendedStack: [
      "Vercel para frontend.",
      "Backend separado en servicio server.",
      "Staging antes de producción.",
      "Variables de entorno por ambiente.",
    ],
    technicalTasks: [
      "Definir ambientes demo/staging/prod.",
      "Separar claves por ambiente.",
      "Definir rollback.",
      "Definir health checks.",
    ],
    dependencies: [
      "Backend real.",
      "Database real.",
      "Auth real.",
      "QA técnico.",
    ],
    implementationRisks: [
      "Usar ambiente demo como producción.",
      "Mezclar secretos.",
      "No tener rollback.",
    ],
    nextStep:
      "Mantener como fase futura hasta cerrar stack e implementación backend.",
  },
];

export function buildTechnicalHandoffSummary(items: TechnicalHandoffItem[]) {
  const total = items.length;

  const requiredBeforeBuild = items.filter(
    (item) => item.status === "required_before_build"
  ).length;

  const recommended = items.filter(
    (item) => item.status === "recommended"
  ).length;

  const blocked = items.filter((item) => item.status === "blocked").length;

  const criticalRisk = items.filter((item) => item.risk === "critical").length;

  return {
    total,
    requiredBeforeBuild,
    recommended,
    blocked,
    criticalRisk,
  };
}

export type TechnicalQaArea =
  | "architecture"
  | "frontend"
  | "backend"
  | "database"
  | "auth_security"
  | "public_widget"
  | "observability"
  | "deployment"
  | "release";

export type TechnicalQaStatus =
  | "required_before_build"
  | "required_before_pilot"
  | "required_before_public_mvp"
  | "recommended"
  | "blocked";

export type TechnicalQaRisk = "low" | "medium" | "high" | "critical";

export type TechnicalQaItem = {
  id: string;
  title: string;
  area: TechnicalQaArea;
  status: TechnicalQaStatus;
  risk: TechnicalQaRisk;
  objective: string;
  checks: string[];
  requiredEvidence: string[];
  blockers: string[];
  passCondition: string;
};

export const TECHNICAL_QA_AREA_LABELS: Record<TechnicalQaArea, string> = {
  architecture: "Arquitectura",
  frontend: "Frontend",
  backend: "Backend",
  database: "Base de datos",
  auth_security: "Auth y seguridad",
  public_widget: "Widget público",
  observability: "Observabilidad",
  deployment: "Despliegue",
  release: "Release",
};

export const TECHNICAL_QA_STATUS_LABELS: Record<TechnicalQaStatus, string> = {
  required_before_build: "Requerido antes de construir",
  required_before_pilot: "Requerido antes de piloto",
  required_before_public_mvp: "Requerido antes de MVP público",
  recommended: "Recomendado",
  blocked: "Bloqueado",
};

export const TECHNICAL_QA_RISK_LABELS: Record<TechnicalQaRisk, string> = {
  low: "Bajo",
  medium: "Medio",
  high: "Alto",
  critical: "Crítico",
};

export const TECHNICAL_QA_CHECKLIST_ITEMS: TechnicalQaItem[] = [
  {
    id: "qa-architecture-boundary",
    title: "Separación demo, admin y runtime productivo",
    area: "architecture",
    status: "required_before_build",
    risk: "high",
    objective:
      "Evitar que la demo avanzada se convierta accidentalmente en runtime productivo sin separación clara.",
    checks: [
      "Demo comercial separada de futuras vistas admin.",
      "Widget público separado de panel interno.",
      "Module Registry visible.",
      "Notas de alcance visibles.",
    ],
    requiredEvidence: [
      "Mapa de carpetas futuro.",
      "Documento de separación demo/runtime.",
      "Checklist de componentes compartidos.",
    ],
    blockers: [
      "Mezcla de lógica demo y productiva.",
      "Uso de localStorage como dependencia productiva.",
    ],
    passCondition:
      "La arquitectura futura separa claramente demo, admin privado y widget público.",
  },
  {
    id: "qa-backend-boundary",
    title: "Backend MVP definido antes de construir",
    area: "backend",
    status: "required_before_build",
    risk: "critical",
    objective:
      "Asegurar que ningún endpoint real sea creado sin stack, validación, auth y límites definidos.",
    checks: [
      "Stack backend seleccionado.",
      "API Boundary priorizado.",
      "Validación server-side definida.",
      "Manejo seguro de errores definido.",
    ],
    requiredEvidence: [
      "Decisión de stack.",
      "Lista de endpoints iniciales.",
      "Schemas de payload planificados.",
      "Política de errores públicos/internos.",
    ],
    blockers: [
      "Crear endpoints sin validación.",
      "Exponer rutas privadas sin auth.",
      "No separar rutas públicas y privadas.",
    ],
    passCondition:
      "El backend tiene stack, límites API y reglas mínimas antes de implementación real.",
  },
  {
    id: "qa-database-isolation",
    title: "Aislamiento de base de datos multiempresa",
    area: "database",
    status: "required_before_pilot",
    risk: "critical",
    objective:
      "Impedir cruce de datos entre empresas antes de cualquier piloto privado con persistencia.",
    checks: [
      "companyId obligatorio.",
      "Relaciones entre entidades definidas.",
      "Consultas filtradas por empresa.",
      "Pruebas de aislamiento planificadas.",
    ],
    requiredEvidence: [
      "Schema con companyId.",
      "Prueba Empresa A vs Empresa B.",
      "Checklist de queries privadas.",
    ],
    blockers: [
      "Datos globales sin companyId.",
      "Consultas sin filtro multiempresa.",
      "Falta de pruebas de aislamiento.",
    ],
    passCondition:
      "Ningún usuario de una empresa puede leer o modificar datos de otra empresa.",
  },
  {
    id: "qa-auth-rbac",
    title: "Auth y RBAC backend",
    area: "auth_security",
    status: "required_before_pilot",
    risk: "critical",
    objective:
      "Validar que el acceso a paneles, leads, conversaciones y configuración dependa de permisos reales de backend.",
    checks: [
      "Login real.",
      "Sesión segura.",
      "Roles mínimos.",
      "Permisos validados en backend.",
      "Acceso privado bloqueado sin sesión.",
    ],
    requiredEvidence: [
      "Prueba de login.",
      "Prueba usuario sin sesión.",
      "Prueba rol sin permiso.",
      "Matriz RBAC técnica.",
    ],
    blockers: [
      "Controles solo visuales.",
      "Admin accesible sin sesión.",
      "Permisos no validados en backend.",
    ],
    passCondition:
      "Los permisos críticos se validan en backend y no solo en la interfaz.",
  },
  {
    id: "qa-public-widget",
    title: "Widget público con consentimiento y límites",
    area: "public_widget",
    status: "required_before_public_mvp",
    risk: "critical",
    objective:
      "Bloquear el widget público hasta que tenga configuración pública segura, consentimiento, rate limiting y validación.",
    checks: [
      "publicKey por empresa.",
      "Configuración pública sanitizada.",
      "Consentimiento visible.",
      "Rate limiting.",
      "Validación de payloads.",
    ],
    requiredEvidence: [
      "Prueba de configuración pública.",
      "Prueba de consentimiento.",
      "Prueba de rate limit.",
      "Prueba de payload inválido.",
    ],
    blockers: [
      "Widget público sin límites.",
      "Endpoint público abierto ilimitadamente.",
      "Captura de datos sin consentimiento.",
    ],
    passCondition:
      "El widget público no expone datos internos y todos sus mensajes pasan por backend seguro.",
  },
  {
    id: "qa-observability-audit",
    title: "Observabilidad y AuditLog mínimo",
    area: "observability",
    status: "required_before_pilot",
    risk: "high",
    objective:
      "Garantizar trazabilidad mínima de eventos críticos, errores y cambios sensibles.",
    checks: [
      "AuditLog definido.",
      "Cambios de configuración auditados.",
      "Cambios de lead auditados.",
      "Errores críticos registrados.",
      "Logs sanitizados.",
    ],
    requiredEvidence: [
      "Modelo AuditLog.",
      "Prueba de evento auditado.",
      "Prueba de log sin secretos.",
      "Reporte de error crítico.",
    ],
    blockers: [
      "No existe auditoría.",
      "Logs con datos sensibles.",
      "Dependencia de console.log.",
    ],
    passCondition:
      "Los eventos críticos quedan trazables sin exponer secretos ni datos innecesarios.",
  },
  {
    id: "qa-deployment-environments",
    title: "Separación de ambientes",
    area: "deployment",
    status: "required_before_public_mvp",
    risk: "high",
    objective:
      "Separar demo, staging y producción antes de operar con clientes o datos reales.",
    checks: [
      "Ambiente demo separado.",
      "Ambiente staging definido.",
      "Producción bloqueada hasta QA.",
      "Variables por ambiente.",
      "Rollback definido.",
    ],
    requiredEvidence: [
      "Mapa de ambientes.",
      "Checklist de variables.",
      "Plan de rollback.",
      "Health check básico.",
    ],
    blockers: [
      "Usar demo como producción.",
      "Mezclar claves entre ambientes.",
      "No tener rollback.",
    ],
    passCondition:
      "Cada ambiente tiene propósito, configuración y límites claramente separados.",
  },
  {
    id: "qa-release-gate",
    title: "Gate final de release técnico",
    area: "release",
    status: "blocked",
    risk: "critical",
    objective:
      "Mantener bloqueado cualquier release público hasta completar backend, seguridad, datos, QA y evidencias.",
    checks: [
      "Backend real aprobado.",
      "Auth y RBAC aprobados.",
      "Aislamiento aprobado.",
      "Widget público aprobado.",
      "Observabilidad aprobada.",
      "QA técnico aprobado.",
    ],
    requiredEvidence: [
      "Checklist QA completo.",
      "Security Gate técnico aprobado.",
      "Pruebas críticas pasadas.",
      "Decisión Go/No-Go actualizada.",
    ],
    blockers: [
      "Falta backend real.",
      "Falta base de datos real.",
      "Falta auth real.",
      "Falta QA técnico real.",
    ],
    passCondition:
      "Solo puede cambiar de bloqueado cuando existan evidencias técnicas reales.",
  },
];

export type TechnicalHandoffClosureItem = {
  id: string;
  title: string;
  completed: boolean;
  description: string;
};

export const TECHNICAL_HANDOFF_BLOCK_CLOSURE_ITEMS: TechnicalHandoffClosureItem[] = [
  {
    id: "closure-handoff-pack",
    title: "Technical Handoff Pack creado",
    completed: true,
    description:
      "Se creó el handoff técnico con stack recomendado, áreas críticas, tareas, dependencias y riesgos.",
  },
  {
    id: "closure-qa-checklist",
    title: "Technical QA Checklist creado",
    completed: true,
    description:
      "Se definieron validaciones técnicas futuras para arquitectura, backend, base de datos, seguridad, widget, observabilidad, despliegue y release.",
  },
  {
    id: "closure-implementation-gates",
    title: "Implementation Gates definidos",
    completed: true,
    description:
      "Se separaron gates antes de build, piloto privado y MVP público.",
  },
  {
    id: "closure-registry-updated",
    title: "Module Registry actualizado",
    completed: true,
    description:
      "El registro visual de módulos queda actualizado con 0K-7A.2 como módulo activo y 0K-7A.1 como completado.",
  },
  {
    id: "closure-production-still-blocked",
    title: "Producción sigue bloqueada",
    completed: true,
    description:
      "El bloque 0K-7 no habilita backend real, APIs, base de datos, despliegue ni producción.",
  },
];

export function buildTechnicalQaSummary(items: TechnicalQaItem[]) {
  const total = items.length;

  const beforeBuild = items.filter(
    (item) => item.status === "required_before_build"
  ).length;

  const beforePilot = items.filter(
    (item) => item.status === "required_before_pilot"
  ).length;

  const beforePublicMvp = items.filter(
    (item) => item.status === "required_before_public_mvp"
  ).length;

  const blocked = items.filter((item) => item.status === "blocked").length;

  const criticalRisk = items.filter((item) => item.risk === "critical").length;

  return {
    total,
    beforeBuild,
    beforePilot,
    beforePublicMvp,
    blocked,
    criticalRisk,
  };
}

export function buildTechnicalHandoffClosureSummary(
  items: TechnicalHandoffClosureItem[]
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

export type PrivatePilotSuccessCategory =
  | "success_criteria"
  | "exit_criteria"
  | "failure_condition"
  | "evidence_required"
  | "next_decision";

export type PrivatePilotSuccessStatus =
  | "required"
  | "recommended"
  | "blocking"
  | "future";

export type PrivatePilotSuccessRisk = "low" | "medium" | "high" | "critical";

export type PrivatePilotSuccessItem = {
  id: string;
  title: string;
  category: PrivatePilotSuccessCategory;
  status: PrivatePilotSuccessStatus;
  risk: PrivatePilotSuccessRisk;
  summary: string;
  criteria: string[];
  evidence: string[];
  decisionRule: string;
};

export const PRIVATE_PILOT_SUCCESS_CATEGORY_LABELS: Record<
  PrivatePilotSuccessCategory,
  string
> = {
  success_criteria: "Criterio de éxito",
  exit_criteria: "Criterio de salida",
  failure_condition: "Condición de falla",
  evidence_required: "Evidencia requerida",
  next_decision: "Decisión siguiente",
};

export const PRIVATE_PILOT_SUCCESS_STATUS_LABELS: Record<
  PrivatePilotSuccessStatus,
  string
> = {
  required: "Requerido",
  recommended: "Recomendado",
  blocking: "Bloqueante",
  future: "Futuro",
};

export const PRIVATE_PILOT_SUCCESS_RISK_LABELS: Record<
  PrivatePilotSuccessRisk,
  string
> = {
  low: "Bajo",
  medium: "Medio",
  high: "Alto",
  critical: "Crítico",
};

export const PRIVATE_PILOT_SUCCESS_ITEMS: PrivatePilotSuccessItem[] = [
  {
    id: "pilot-success-controlled-company",
    title: "Empresa piloto controlada",
    category: "success_criteria",
    status: "required",
    risk: "medium",
    summary:
      "El piloto solo puede considerarse válido si se ejecuta con una empresa claramente definida, usuarios autorizados y alcance limitado.",
    criteria: [
      "Empresa piloto definida.",
      "Responsable ORBI asignado.",
      "Responsable empresa asignado.",
      "Usuarios autorizados identificados.",
    ],
    evidence: [
      "Ficha de empresa piloto.",
      "Lista de usuarios autorizados.",
      "Documento de alcance aprobado.",
    ],
    decisionRule:
      "Si no existe empresa piloto definida, el piloto no debe iniciar.",
  },
  {
    id: "pilot-success-security-minimum",
    title: "Seguridad mínima operativa",
    category: "success_criteria",
    status: "blocking",
    risk: "critical",
    summary:
      "No puede existir piloto con datos persistentes sin auth, RBAC, aislamiento, validación y control de datos.",
    criteria: [
      "Auth real mínima.",
      "RBAC mínimo.",
      "Aislamiento por companyId.",
      "Validación server-side.",
      "Consentimiento o autorización documentada.",
    ],
    evidence: [
      "Prueba de login.",
      "Prueba de acceso restringido.",
      "Prueba de aislamiento.",
      "Checklist Security Gate.",
    ],
    decisionRule:
      "Si falta seguridad mínima, el piloto debe permanecer bloqueado.",
  },
  {
    id: "pilot-exit-value-validation",
    title: "Validación de valor comercial",
    category: "exit_criteria",
    status: "recommended",
    risk: "medium",
    summary:
      "El piloto debe demostrar si el chatbox realmente ayuda a ordenar consultas, leads y derivaciones humanas.",
    criteria: [
      "Conversaciones clasificadas correctamente.",
      "Leads útiles identificados.",
      "Derivación humana comprensible.",
      "Reporte de uso claro para la empresa.",
    ],
    evidence: [
      "Resumen de conversaciones.",
      "Lista de leads generados.",
      "Feedback del responsable piloto.",
      "Reporte final de valor.",
    ],
    decisionRule:
      "Si no se demuestra valor comercial, se debe ajustar alcance antes de continuar.",
  },
  {
    id: "pilot-failure-risk",
    title: "Condiciones para detener el piloto",
    category: "failure_condition",
    status: "blocking",
    risk: "critical",
    summary:
      "El piloto debe detenerse si aparecen riesgos de datos, seguridad, uso indebido o expectativas incorrectas.",
    criteria: [
      "Intento de usar datos sensibles no autorizados.",
      "Falla de aislamiento entre empresas.",
      "Acceso no autorizado.",
      "Promesa de producción sin controles reales.",
    ],
    evidence: [
      "Registro de incidente.",
      "Checklist de bloqueo.",
      "Reporte de decisión de pausa.",
    ],
    decisionRule:
      "Si ocurre una condición crítica, el piloto se pausa inmediatamente.",
  },
  {
    id: "pilot-next-decision",
    title: "Decisión posterior al piloto",
    category: "next_decision",
    status: "required",
    risk: "high",
    summary:
      "Al cerrar el piloto debe existir una decisión explícita: continuar, ajustar, pausar o descartar.",
    criteria: [
      "Resultados revisados.",
      "Riesgos evaluados.",
      "Feedback recopilado.",
      "Próxima fase definida.",
    ],
    evidence: [
      "Reporte final del piloto.",
      "Checklist de cierre.",
      "Decisión continuar/ajustar/pausar/descartar.",
    ],
    decisionRule:
      "El piloto no debe quedar abierto indefinidamente.",
  },
];

export function buildPrivatePilotSuccessSummary(items: PrivatePilotSuccessItem[]) {
  const total = items.length;
  const required = items.filter((item) => item.status === "required").length;
  const blocking = items.filter((item) => item.status === "blocking").length;
  const recommended = items.filter(
    (item) => item.status === "recommended"
  ).length;
  const criticalRisk = items.filter((item) => item.risk === "critical").length;

  return {
    total,
    required,
    blocking,
    recommended,
    criticalRisk,
  };
}

export type OrbiModuleRegistryStatus =
  | "completed"
  | "active"
  | "planned"
  | "blocked"
  | "future";

export type OrbiModuleRegistryItem = {
  id: string;
  block: string;
  module: string;
  title: string;
  versionTag: string;
  status: OrbiModuleRegistryStatus;
  summary: string;
  implementedEvidence: string[];
  nextStep: string;
};

export const ORBI_CHATBOX_APP_VERSION = "0.12.1-premium-ux-refresh";
export const ORBI_CHATBOX_ACTIVE_BLOCK = "0L-1 — ORBI Premium UX Refresh";
export const ORBI_CHATBOX_ACTIVE_MODULE = "0L-1C.1";
export const ORBI_CHATBOX_ACTIVE_MODULE_TITLE =
  "Motion, Demo Polish & Export-Ready Visual QA";
export const ORBI_CHATBOX_ACTIVE_MODULE_STATUS: OrbiModuleRegistryStatus = "active";

export const ORBI_MODULE_REGISTRY_STATUS_LABELS: Record<
  OrbiModuleRegistryStatus,
  string
> = {
  completed: "Completado",
  active: "Activo",
  planned: "Planificado",
  blocked: "Bloqueado",
  future: "Futuro",
};

export const ORBI_CHATBOX_MODULE_REGISTRY: OrbiModuleRegistryItem[] = [
  {
    id: "registry-0j",
    block: "0J",
    module: "0J",
    title: "Demo Comercial Estable",
    versionTag: "0.5.0-demo-commercial",
    status: "completed",
    summary:
      "Demo comercial estable con storyline, pitch, control live, feedback, follow-up, paquete demo, one-pager y cierre ejecutivo.",
    implementedEvidence: [
      "Bloque 0J cerrado.",
      "Demo Package Builder implementado.",
      "One-pager final implementado.",
    ],
    nextStep: "Usar como base comercial de presentación.",
  },
  {
    id: "registry-0k1",
    block: "0K-1",
    module: "0K-1A / 0K-1B",
    title: "MVP Scope y Roadmap",
    versionTag: "0.6.0-mvp-scope",
    status: "completed",
    summary:
      "Alcance MVP, roadmap, fases, dependencias, riesgos y criterios de salida definidos.",
    implementedEvidence: [
      "MVP Scope implementado.",
      "MVP Roadmap implementado.",
    ],
    nextStep: "Usar como base de planificación MVP.",
  },
  {
    id: "registry-0k2",
    block: "0K-2",
    module: "0K-2A / 0K-2B",
    title: "Backend Foundation Plan",
    versionTag: "0.6.1-backend-foundation",
    status: "completed",
    summary:
      "Backend foundation, data model y API boundary conceptual cerrados.",
    implementedEvidence: [
      "Backend Foundation Base cerrado.",
      "Backend Foundation Extensión cerrada.",
      "Data Model Base implementado.",
      "API Boundary implementado.",
    ],
    nextStep: "Convertir blueprint en backlog técnico futuro.",
  },
  {
    id: "registry-0k3",
    block: "0K-3",
    module: "0K-3A / 0K-3B",
    title: "MVP Security Gate",
    versionTag: "0.6.1-security-gate",
    status: "completed",
    summary:
      "Security Gate, hardening, validation matrix y release decision cerrados.",
    implementedEvidence: [
      "11 controles de seguridad definidos.",
      "Security Validation Matrix implementada.",
      "Security Release Decision implementada.",
    ],
    nextStep: "Usar como bloqueo formal antes de producción.",
  },
  {
    id: "registry-0k4",
    block: "0K-4",
    module: "0K-4A.1 / 0K-4A.2",
    title: "MVP Product Backlog",
    versionTag: "0.6.2-product-backlog",
    status: "completed",
    summary:
      "Backlog MVP y Sprint Plan conceptual cerrados.",
    implementedEvidence: [
      "8 ítems de backlog creados.",
      "5 sprints conceptuales creados.",
      "Cierre Product Backlog al 100%.",
    ],
    nextStep: "Usar como secuencia de implementación futura.",
  },
  {
    id: "registry-0k5",
    block: "0K-5",
    module: "0K-5A.1 / 0K-5A.2",
    title: "MVP Readiness Dashboard",
    versionTag: "0.6.2-readiness",
    status: "completed",
    summary:
      "Dashboard de readiness y decisión Go/No-Go cerrados.",
    implementedEvidence: [
      "9 dominios de readiness evaluados.",
      "GO Demo definido.",
      "Piloto privado condicional definido.",
      "NO-GO MVP público definido.",
    ],
    nextStep: "Preparar paquete de piloto privado.",
  },
  {
    id: "registry-0k6a1",
    block: "0K-6",
    module: "0K-6A.1",
    title: "Private Pilot Pack Base",
    versionTag: "0.6.2-pilot-pack",
    status: "completed",
    summary:
      "Alcance permitido, bloqueos, roles, condiciones, riesgos y gobernanza del piloto privado definidos.",
    implementedEvidence: [
      "Private Pilot Pack Base implementado.",
      "Filtros y KPIs implementados.",
      "Exportación copiable implementada.",
    ],
    nextStep: "Cerrar criterios de éxito, salida y registro de módulos.",
  },
  {
    id: "registry-0k6a2",
    block: "0K-6",
    module: "0K-6A.2",
    title: "Private Pilot Success Criteria y Module Registry",
    versionTag: "0.6.2-pilot-pack",
    status: "completed",
    summary:
      "Criterios de éxito/salida del piloto privado y control visible de módulos implementados dentro de la app.",
    implementedEvidence: [
      "Success Criteria en implementación.",
      "Module Registry visible en implementación.",
      "VersionLockBadge conceptual en implementación.",
    ],
    nextStep: "Usar como base para preparar el handoff técnico del MVP.",
  },
  {
    id: "registry-0k7a1",
    block: "0K-7",
    module: "0K-7A.1",
    title: "Technical Handoff Pack Base",
    versionTag: "0.7.0-technical-handoff",
    status: "completed",
    summary:
      "Handoff técnico conceptual para organizar stack recomendado, arquitectura futura, tareas técnicas, dependencias, riesgos y próximos pasos de implementación.",
    implementedEvidence: [
      "Technical Handoff Pack en implementación.",
      "Stack recomendado en implementación.",
      "Mapa de tareas técnicas en implementación.",
      "Actualización del Module Registry a versión 0.7.0.",
    ],
    nextStep: "Usar como base para validar gates técnicos, QA y condiciones antes de implementación real.",
  },
  {
    id: "registry-0k7a2",
    block: "0K-7",
    module: "0K-7A.2",
    title: "Technical QA Checklist e Implementation Gates",
    versionTag: "0.7.0-technical-handoff",
    status: "completed",
    summary:
      "Checklist QA técnico conceptual, gates de implementación, evidencias requeridas, bloqueos críticos y cierre del bloque Technical Handoff Pack.",
    implementedEvidence: [
      "Technical QA Checklist en implementación.",
      "Implementation Gates en implementación.",
      "Cierre del bloque 0K-7 en implementación.",
      "Module Registry actualizado a módulo activo 0K-7A.2.",
    ],
    nextStep: "Usar Technical QA Checklist como gate antes de avanzar a pruebas web controladas.",
  },
  {
    id: "registry-0k8a1",
    block: "0K-8",
    module: "0K-8A.1",
    title: "Web Widget Test Runtime Base",
    versionTag: "0.8.0-web-widget-runtime",
    status: "completed",
    summary:
      "Primer runtime de prueba web controlada para simular payloads de un widget externo, recibir mensajes en bandeja local en memoria y preparar el futuro flujo página web → ORBI ChatBox.",
    implementedEvidence: [
      "Contrato de payload widget en implementación.",
      "Bandeja temporal de mensajes web en implementación.",
      "Simulador de mensaje entrante en implementación.",
      "Module Registry actualizado a versión 0.8.0.",
    ],
    nextStep: "Usar el runtime web local como base para recibir mensajes desde una página demo simulada.",
  },
  {
    id: "registry-0k8a2",
    block: "0K-8",
    module: "0K-8A.2",
    title: "External Demo Page Bridge",
    versionTag: "0.8.0-web-widget-runtime",
    status: "completed",
    summary:
      "Puente local de prueba entre una página demo simulada en iframe y ORBI ChatBox IA Core usando window.postMessage, sin backend, sin fetch y sin APIs reales.",
    implementedEvidence: [
      "Iframe demo externo en implementación.",
      "Bridge postMessage local en implementación.",
      "Snippet HTML copiable en implementación.",
      "Cierre de 0K-8A en implementación.",
    ],
    nextStep: "Usar el bridge de página demo como fuente de mensajes para la bandeja avanzada de lead intake web.",
  },
  {
    id: "registry-0k8b1",
    block: "0K-8",
    module: "0K-8B.1",
    title: "Web Lead Intake Board",
    versionTag: "0.8.0-web-widget-runtime",
    status: "completed",
    summary:
      "Bandeja avanzada para evaluar mensajes recibidos desde el runtime web, identificar candidatos comerciales, convertirlos en leads demo en memoria y preparar el cierre del bloque 0K-8.",
    implementedEvidence: [
      "Lead Intake Board en implementación.",
      "Conversión demo en memoria en implementación.",
      "Resumen comercial web en implementación.",
      "Module Registry actualizado a 0K-8B.1.",
    ],
    nextStep:
      "Usar Web Lead Intake Board como base para validar readiness del runtime web y cerrar el bloque 0K-8.",
  },
  {
    id: "registry-0k8b2a",
    block: "0K-8",
    module: "0K-8B.2A",
    title: "Web Runtime Readiness Data Layer",
    versionTag: "0.8.0-web-widget-runtime",
    status: "completed",
    summary:
      "Capa de datos para evaluar readiness del runtime web, contrato payload, bridge postMessage, inbox temporal, lead intake demo, consentimiento, prueba externa y bloqueo productivo.",
    implementedEvidence: [
      "Tipos de readiness en implementación.",
      "Matriz de readiness en implementación.",
      "Resumen de cierre 0K-8 en implementación.",
      "Module Registry actualizado a 0K-8B.2A.",
    ],
    nextStep:
      "Usar la capa de datos de readiness como base para renderizar el cierre visual del bloque 0K-8.",
  },
  {
    id: "registry-0k8b2b",
    block: "0K-8",
    module: "0K-8B.2B",
    title: "Web Runtime Readiness Visual Layer y cierre 0K-8",
    versionTag: "0.8.0-web-widget-runtime",
    status: "completed",
    summary:
      "Capa visual final del Web Runtime Readiness, con KPIs, filtros, cards, reporte copiable, decisión GO/CONDITIONAL GO/NO-GO y cierre definitivo del bloque 0K-8.",
    implementedEvidence: [
      "Visual Layer de readiness en implementación.",
      "Reporte copiable en implementación.",
      "Decisión final GO/CONDITIONAL GO/NO-GO en implementación.",
      "Cierre definitivo del bloque 0K-8 en implementación.",
    ],
    nextStep:
      "Usar el Web Runtime Readiness como base para diseñar el futuro backend receiver seguro.",
  },
  {
    id: "registry-0k9a1",
    block: "0K-9",
    module: "0K-9A.1",
    title: "Backend Receiver Foundation Blueprint",
    versionTag: "0.9.0-backend-receiver",
    status: "completed",
    summary:
      "Blueprint conceptual del futuro backend receiver para recibir mensajes web, validar payloads, aplicar seguridad, preparar persistencia futura y mantener producción bloqueada hasta tener implementación real segura.",
    implementedEvidence: [
      "Backend receiver blueprint en implementación.",
      "Contrato de rutas futuras en implementación.",
      "Validaciones server-side conceptuales en implementación.",
      "Module Registry actualizado a 0K-9A.1.",
    ],
    nextStep:
      "Usar el Backend Receiver Blueprint como base para definir gates de seguridad, mapa de errores y decisión técnica.",
  },
  {
    id: "registry-0k9a2",
    block: "0K-9",
    module: "0K-9A.2",
    title: "Backend Receiver Security Gates y Error Map",
    versionTag: "0.9.0-backend-receiver",
    status: "completed",
    summary:
      "Capa conceptual de seguridad del futuro backend receiver, con gates técnicos, mapa de errores públicos seguros, evidencias requeridas, bloqueos productivos y cierre del subbloque 0K-9A.",
    implementedEvidence: [
      "Security Gates del receiver en implementación.",
      "Error Map público seguro en implementación.",
      "Cierre del subbloque 0K-9A en implementación.",
      "Module Registry actualizado a 0K-9A.2.",
    ],
    nextStep:
      "Usar los Security Gates y Error Map como base para definir el contrato runtime del futuro backend receiver.",
  },
  {
    id: "registry-0k9b1",
    block: "0K-9",
    module: "0K-9B.1",
    title: "Backend Receiver Runtime Contract",
    versionTag: "0.9.0-backend-receiver",
    status: "completed",
    summary:
      "Contrato conceptual del runtime del futuro backend receiver, incluyendo ciclo de vida de request, validaciones, respuestas públicas seguras, estados internos y flujo de aceptación/rechazo.",
    implementedEvidence: [
      "Runtime Contract en implementación.",
      "Request lifecycle en implementación.",
      "Response contract en implementación.",
      "Module Registry actualizado a 0K-9B.1.",
    ],
    nextStep:
      "Usar el Runtime Contract como base para evaluar readiness de construcción backend controlada.",
  },
  {
    id: "registry-0k9b2",
    block: "0K-9",
    module: "0K-9B.2",
    title: "Backend Receiver Build Readiness y cierre 0K-9",
    versionTag: "0.9.0-backend-receiver",
    status: "completed",
    summary:
      "Cierre del bloque Backend Receiver Foundation con readiness de construcción, condiciones previas, bloqueos productivos, decisión técnica y ruta hacia Knowledge Base ORBI.",
    implementedEvidence: [
      "Backend Build Readiness en implementación.",
      "Cierre bloque 0K-9 en implementación.",
      "Decisión GO/CONDITIONAL GO/NO-GO en implementación.",
      "Module Registry actualizado a 0K-9B.2.",
    ],
    nextStep:
      "Usar el cierre del Backend Receiver Foundation como base para iniciar ORBI Ecosystem Knowledge Base.",
  },
  {
    id: "registry-0k10a1",
    block: "0K-10",
    module: "0K-10A.1",
    title: "ORBI Ecosystem Knowledge Base Foundation",
    versionTag: "0.10.0-orbi-knowledge-base",
    status: "completed",
    summary:
      "Base de conocimiento pública y controlada para ORBI Ecosystem, con categorías, visibilidad, preguntas frecuentes, respuestas oficiales, restricciones de seguridad y preparación para un futuro motor de respuestas.",
    implementedEvidence: [
      "Knowledge Base ORBI en implementación.",
      "Categorías públicas en implementación.",
      "Restricciones de información sensible en implementación.",
      "Module Registry actualizado a 0K-10A.1.",
    ],
    nextStep:
      "Usar la Knowledge Base ORBI como fuente para construir el motor local de respuesta controlada.",
  },
  {
    id: "registry-0k10a2",
    block: "0K-10",
    module: "0K-10A.2",
    title: "ORBI Knowledge Answer Engine",
    versionTag: "0.10.0-orbi-knowledge-base",
    status: "completed",
    summary:
      "Motor local de respuesta controlada basado en la Knowledge Base de ORBI, con búsqueda por keywords, detección de temas bloqueados, derivación humana, confianza y respuestas seguras para widget.",
    implementedEvidence: [
      "Answer Engine local en implementación.",
      "Búsqueda por keywords en implementación.",
      "Detección de temas bloqueados en implementación.",
      "Module Registry actualizado a 0K-10A.2.",
    ],
    nextStep:
      "Integrar el Answer Engine local con el flujo principal del chat y widget demo.",
  },
  {
    id: "registry-0k10b1",
    block: "0K-10",
    module: "0K-10B.1",
    title: "ORBI Chat Flow Knowledge Integration",
    versionTag: "0.10.0-orbi-knowledge-base",
    status: "completed",
    summary:
      "Integración del Answer Engine local con el flujo principal del chat, permitiendo respuestas controladas basadas en Knowledge Base pública de ORBI, trazabilidad de match, seguridad y derivación humana.",
    implementedEvidence: [
      "Integración con chat principal en implementación.",
      "Modo Knowledge Base en implementación.",
      "Trazabilidad de respuesta ORBI en implementación.",
      "Module Registry actualizado a 0K-10B.1.",
    ],
    nextStep:
      "Usar la integración Knowledge + Chat como base para conectar el Answer Engine con el Web Widget Test Runtime.",
  },
  {
    id: "registry-0k10b2",
    block: "0K-10",
    module: "0K-10B.2",
    title: "Web Widget Knowledge Integration y cierre 0K-10",
    versionTag: "0.10.0-orbi-knowledge-base",
    status: "completed",
    summary:
      "Integración local entre Web Widget Test Runtime y ORBI Knowledge Answer Engine, generando respuestas sugeridas seguras, trazabilidad por payload web y cierre del bloque 0K-10.",
    implementedEvidence: [
      "Web Widget Knowledge Integration en implementación.",
      "Respuestas sugeridas locales en implementación.",
      "Cierre bloque 0K-10 en implementación.",
    ],
    nextStep:
      "Usar Knowledge Base, Answer Engine, Chat Integration y Web Widget Knowledge como base para preparar una prueba controlada en la página web de ORBI.",
  },
  {
    id: "registry-0k11a1",
    block: "0K-11",
    module: "0K-11A.1",
    title: "ORBI Website Controlled Test Pack Foundation",
    versionTag: "0.11.0-website-controlled-test",
    status: "completed",
    summary:
      "Paquete conceptual para preparar una prueba controlada del ChatBox IA en la página web de ORBI, con checklist, escenarios, límites de seguridad, datos ficticios, evidencias requeridas y decisión GO/CONDITIONAL GO/NO-GO.",
    implementedEvidence: [
      "Website Controlled Test Pack en implementación.",
      "Checklist de prueba web en implementación.",
      "Escenarios controlados en implementación.",
      "Module Registry actualizado a 0K-11A.1.",
    ],
    nextStep:
      "Usar el Website Controlled Test Pack como base para preparar instrucciones de embed controlado para Simon y Vercel Preview.",
  },
  {
    id: "registry-0k11a2",
    block: "0K-11",
    module: "0K-11A.2",
    title: "Controlled Embed Instructions para Simon y Vercel Preview",
    versionTag: "0.11.0-website-controlled-test",
    status: "completed",
    summary:
      "Guía visual y técnica para preparar una prueba controlada del ChatBox IA en la web de ORBI mediante embed conceptual, checklist para Simon, límites de seguridad y reporte copiable.",
    implementedEvidence: [
      "Controlled Embed Instructions en implementación.",
      "Checklist Simon en implementación.",
      "Snippet conceptual en implementación.",
      "Module Registry actualizado a 0K-11A.2.",
    ],
    nextStep:
      "Usar las instrucciones de embed controlado como base para registrar ejecución de pruebas web sandbox.",
  },
  {
    id: "registry-0k11b1",
    block: "0K-11",
    module: "0K-11B.1",
    title: "Website Controlled Test Execution Board",
    versionTag: "0.11.0-website-controlled-test",
    status: "completed",
    summary:
      "Tablero local para registrar ejecución de pruebas controladas en la web de ORBI, con escenarios, evidencias, resultados PASS/WARN/FAIL/BLOCKED, decisión técnica y reporte copiable.",
    implementedEvidence: [
      "Execution Board en implementación.",
      "Registro de resultados de prueba en implementación.",
      "Reporte de ejecución en implementación.",
      "Module Registry actualizado a 0K-11B.1.",
    ],
    nextStep:
      "Usar el Execution Board como fuente para calcular readiness final de prueba web controlada.",
  },
  {
    id: "registry-0k11b2",
    block: "0K-11",
    module: "0K-11B.2",
    title: "Website Controlled Test Readiness y cierre 0K-11",
    versionTag: "0.11.0-website-controlled-test",
    status: "completed",
    summary:
      "Cierre del bloque Website Controlled Test Pack con evaluación dinámica de readiness, condiciones para Vercel Preview, bloqueos productivos, evidencias requeridas y decisión final GO/CONDITIONAL GO/NO-GO.",
    implementedEvidence: [
      "Website Test Readiness en implementación.",
      "Cierre bloque 0K-11 en implementación.",
      "Decisión final dinámica en implementación.",
      "Module Registry actualizado a 0K-11B.2.",
    ],
    nextStep:
      "Usar el cierre del Website Controlled Test Pack como base para preparar el plan de construcción mínima del backend receiver.",
  },
  {
    id: "registry-0k12a1",
    block: "0K-12",
    module: "0K-12A.1",
    title: "Minimal Backend Receiver Build Plan Foundation",
    versionTag: "0.12.0-minimal-backend-plan",
    status: "completed",
    summary:
      "Plan técnico local para preparar la futura construcción de un backend receiver mínimo, seguro y controlado, incluyendo arquitectura, stack candidato, endpoint futuro, variables de entorno, seguridad, CORS, rate limit, audit log y bloqueos productivos.",
    implementedEvidence: [
      "Backend Build Plan Foundation en implementación.",
      "Arquitectura mínima backend en implementación.",
      "Stack candidato en implementación.",
      "Module Registry actualizado a 0K-12A.1.",
    ],
    nextStep:
      "Usar el Minimal Backend Receiver Build Plan como base para decidir stack backend y activar Build Gate controlado.",
  },
  {
    id: "registry-0k12a2",
    block: "0K-12",
    module: "0K-12A.2",
    title: "Backend Stack Decision Matrix y Build Gate",
    versionTag: "0.12.0-minimal-backend-plan",
    status: "completed",
    summary:
      "Matriz de decisión para seleccionar stack backend candidato y Build Gate antes de construir un backend receiver real, con criterios de seguridad, simplicidad, hosting, CORS, rate limit, audit log, variables server-side y bloqueo productivo.",
    implementedEvidence: [
      "Stack Decision Matrix en implementación.",
      "Build Gate en implementación.",
      "Criterios de selección backend en implementación.",
      "Module Registry actualizado a 0K-12A.2.",
    ],
    nextStep:
      "Usar la matriz de stack y Build Gate como base para definir la estructura futura de archivos del backend receiver.",
  },
  {
    id: "registry-0k12b1",
    block: "0K-12",
    module: "0K-12B.1",
    title: "Backend Receiver File Plan",
    versionTag: "0.12.0-minimal-backend-plan",
    status: "completed",
    summary:
      "Plan documental de estructura futura de archivos para el backend receiver mínimo, incluyendo carpetas, responsabilidades, orden de implementación, dependencias futuras, pruebas mínimas y gates bloqueados.",
    implementedEvidence: [
      "Backend Receiver File Plan en implementación.",
      "Estructura futura server en implementación.",
      "Orden de implementación backend en implementación.",
      "Module Registry actualizado a 0K-12B.1.",
    ],
    nextStep:
      "Usar el Backend Receiver File Plan como base para evaluar readiness final antes de cualquier construcción backend real.",
  },
  {
    id: "registry-0k12b2",
    block: "0K-12",
    module: "0K-12B.2",
    title: "Backend Receiver Build Readiness y cierre 0K-12",
    versionTag: "0.12.0-minimal-backend-plan",
    status: "completed",
    summary:
      "Cierre del bloque Minimal Backend Receiver Build Plan con readiness final, revisión de stack recomendado, Build Gate, File Plan, dependencias, pruebas mínimas, bloqueos críticos y decisión de avance hacia construcción backend controlada futura.",
    implementedEvidence: [
      "Backend Build Readiness final implementado.",
      "Cierre bloque 0K-12 implementado al 100%.",
      "Decisión final CONDITIONAL GO registrada.",
      "Module Registry actualizado a 0K-12B.2 cerrado.",
    ],
    nextStep:
      "Preparar 0K-13 — Minimal Backend Receiver Controlled Build tras completar la capa visual premium 0L-1.",
  },
  {
    id: "registry-0l1a1",
    block: "0L-1",
    module: "0L-1A.1",
    title: "Premium Design System & App Shell Foundation",
    versionTag: "0.12.1-premium-ux-refresh",
    status: "completed",
    summary:
      "Transformación visual de ORBI ChatBox IA Core a UX SaaS profesional: App Shell con barra lateral de navegación ejecutiva, Header corporativo con estado de workspace, Hero comercial con highlights del ecosistema ORBI, métricas de overview pulidas, tarjetas refinadas y diseño visual consistente sin alterar la lógica existente.",
    implementedEvidence: [
      "App Shell premium con Sidebar corporativo implementado.",
      "Header ejecutivo con estado del workspace y selectores rápidos.",
      "Hero comercial con highlights del ecosistema ORBI.",
      "Design System con jerarquía visual, cards pulidas y badges consistentes.",
      "Module Registry actualizado a 0L-1A.1.",
    ],
    nextStep:
      "Avanzar a 0L-1A.2 para la organización modular en Workspaces temáticos y navegación estructurada.",
  },
  {
    id: "registry-0l1a2",
    block: "0L-1",
    module: "0L-1A.2",
    title: "Navigation, Layout Hierarchy & Workspace Structure",
    versionTag: "0.12.1-premium-ux-refresh",
    status: "completed",
    summary:
      "Estructura de navegación SaaS, organización en 10 Workspaces temáticos, barra lateral con 3 grupos funcionales claros (ORBI SUITE, INTELLIGENCE, CONTROL CENTER), Header contextual dinámico con título y descripción, Workspace Intro Card contextual, Capability Map visual de 9 áreas, Operational Guardrails de seguridad sandbox y Export Readiness Card sin alteraciones de lógica de negocio, sin backend ni endpoints.",
    implementedEvidence: [
      "Organización en 10 Workspaces temáticos con labels y descripciones oficiales.",
      "Barra lateral mejorada en 3 grupos funcionales: ORBI SUITE, INTELLIGENCE, CONTROL CENTER.",
      "Header contextual dinámico con título y descripción del workspace activo.",
      "Workspace Intro Card contextual con capacidades y siguiente acción sugerida.",
      "Capability Map visual interactivo con 9 capacidades clave y badges de estado.",
      "Operational Guardrails / Safety Strip con verificación de límites sandbox.",
      "Export Readiness Card con métricas de Build, Security, Migration y Maintainability.",
      "Navegación fluida por anchors y scroll suave sin modificar backend ni endpoints.",
      "Module Registry actualizado a 0L-1A.2.",
    ],
    nextStep:
      "Avanzar a 0L-1B.1 para la renovación premium del Chat Studio.",
  },
  {
    id: "registry-0l1b1",
    block: "0L-1",
    module: "0L-1B.1",
    title: "Premium Chat Workspace: experiencia conversacional profesional y comercial",
    versionTag: "0.12.1-premium-ux-refresh",
    status: "completed",
    summary:
      "Renovación completa del Chat Studio: cabecera de asistente con avatar brillante e indicador en vivo, panel de conversación con estética SaaS, burbujas de usuario y asistente de alto contraste, empty state con preguntas frecuentes interactivas, composer moderno con badges de runtime sandbox, barra de acciones rápidas inteligente, panel AI Commercial Intelligence estructurado con priorización visual y ficha de derivación humana sin cambios de lógica, sin backend ni endpoints.",
    implementedEvidence: [
      "Header de asistente con avatar premium, estado en vivo y badge de empresa.",
      "Panel de conversación SaaS con burbujas de alto contraste y microcopy contextual.",
      "Empty state con sugerencias rápidas interactivas listas para demo.",
      "Quick Actions Bar con chips inteligentes de despacho directo.",
      "AI Commercial Intelligence con scoring visual de prioridad y análisis de necesidad.",
      "Ficha Human Handoff lista para derivación a asesores comerciales.",
      "Trazabilidad de Answer Engine y Knowledge Context en vivo.",
      "Module Registry actualizado a 0L-1B.1.",
    ],
    nextStep:
      "Avanzar a 0L-1B.2 para la transformación visual premium de superficies administrativas, dashboards y data panels.",
  },
  {
    id: "registry-0l1b2",
    block: "0L-1",
    module: "0L-1B.2",
    title: "Premium Admin Surfaces, Dashboards & Data Panels",
    versionTag: "0.12.1-premium-ux-refresh",
    status: "completed",
    summary:
      "Transformación visual de superficies administrativas y técnicas: unificación de tarjetas KPI ejecutivas, CRM ligero para Lead Intelligence, Knowledge Base Control Center, Controlled Testing Console para Web Widget & Website test pack, Backend Roadmap 0K-12 con visualización de etapas y gates, Module Registry en formato timeline ejecutivo, Readiness Consoles (MVP, Security, QA, Stack), paneles de reportes copiables con feedback mejorado y Enterprise Settings sin alteraciones de lógica de negocio, sin backend ni endpoints.",
    implementedEvidence: [
      "KPI Cards unificadas con microiconos, valores destacados, bordes sutiles y estados semánticos moderados.",
      "Lead Intelligence Board transformado en CRM ligero con badges de prioridad, acciones comerciales y cola de derivación humana.",
      "Knowledge Base Control Center con badges de seguridad para widget, categoría, tags y visor de trazabilidad.",
      "Controlled Testing Console con Web Widget Runtime Inbox y suite de pruebas controladas.",
      "Backend Roadmap 0K-12 con visualización de fases, matrices de decisión, gates de seguridad y file plan.",
      "Module Registry refinado con visualización tipo timeline y delivery trail por bloques 0K y 0L.",
      "Readiness Boards estandarizados con matrices de decisión GO / CONDITIONAL GO / NO-GO.",
      "Paneles de reportes ejecutivos con feedback visual de copiado y exportación profesional.",
      "Enterprise Settings Panel con diseño pulido y persistencia localStorage intacta.",
      "Empty states consistentes y profesionales en todas las listas y filtros.",
    ],
    nextStep:
      "Avanzar a 0L-1C.1 para el cierre visual del bloque 0L-1 y validación de export readiness.",
  },
  {
    id: "registry-0l1c1",
    block: "0L-1",
    module: "0L-1C.1",
    title: "Motion, Demo Polish & Export-Ready Visual QA",
    versionTag: "0.12.1-premium-ux-refresh",
    status: "active",
    summary:
      "Cierre visual del bloque 0L-1 ORBI Premium UX Refresh: microinteracciones premium, consistencia en badges de estado (PASS, WARN, GO, CONDITIONAL GO, NO-GO, SANDBOX), feedback visual al copiar con estados animados, revisión responsive en todos los breakpoints, tarjeta de Export Readiness final (READY FOR ZIP EXPORT), clarificación del stack recomendado (Node.js + TypeScript + Express), checklist visual de QA y cierre del bloque 0L-1 al 100% sin backend, sin endpoints, sin fetch/axios y sin modificar lógica de negocio.",
    implementedEvidence: [
      "Microinteracciones y transiciones suaves en cards, botones, inputs y selects.",
      "Consistencia visual total en badges y estados (PASS/WARN/FAIL, GO/CONDITIONAL GO/NO-GO, SANDBOX, DEMO).",
      "Corrección de texto oficial para Stack Recomendado: Node.js + TypeScript + Express (Fastify como opción viable alternativa).",
      "Tarjeta Export Readiness final con estado READY FOR ZIP EXPORT y nota de exclusión de node_modules/dist/env.",
      "Checklist visual de QA con 10 dimensiones completadas.",
      "Cierre visual formal del bloque 0L-1 al 100% completado.",
      "Empty states pulidos y contextuales en todas las vistas.",
      "Operational Guardrails como Trust Layer visible y elegante en toda la suite.",
      "Verificación de responsive en móvil, tablet, notebook y desktop.",
      "Lógica de negocio, almacenamiento y contratos de datos 100% intactos.",
    ],
    nextStep:
      "Listo para exportación de paquete ZIP limpio y posterior migración controlada a GitHub.",
  },
];


