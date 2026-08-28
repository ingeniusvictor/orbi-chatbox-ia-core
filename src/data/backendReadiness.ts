// ORBI ChatBox IA Core — Backend Readiness & Architecture Data
import {
  ChatChannel, CompanyProfile, CompanyService, CustomerType, HumanContact, Message, appendLeadRecord
} from "./companyData";
import {
  BACKEND_ARCHITECTURE_STATUS_LABELS, BackendArchitectureComponent, BackendArchitectureComponentCategory, PRODUCTION_CHECKLIST_PRIORITY_LABELS, ProductionChecklistPriority
} from "./demoData";
import {
  ORBI_CHATBOX_ACTIVE_BLOCK, ORBI_CHATBOX_ACTIVE_MODULE, ORBI_CHATBOX_ACTIVE_MODULE_TITLE, ORBI_CHATBOX_APP_VERSION
} from "./moduleRegistry";
import {
  ORBI_ECOSYSTEM_KNOWLEDGE_ITEMS, buildOrbiModuleRegistrySummary
} from "./premiumWorkspaces";

export const BACKEND_ARCHITECTURE_CATEGORY_LABELS: Record<
  BackendArchitectureComponentCategory,
  string
> = {
  api: "APIs",
  database: "Base de datos",
  security: "Seguridad",
  channels: "Canales",
  ai_engine: "Motor IA",
  frontend: "Frontend",
  operations: "Operaciones",
};

export const BACKEND_ARCHITECTURE_COMPONENTS: BackendArchitectureComponent[] = [
  {
    id: "secure-api-gateway",
    title: "API Gateway seguro",
    category: "api",
    status: "critical",
    priority: "critical",
    description:
      "Punto central de entrada para solicitudes del panel administrador, widget web, integraciones externas y futuros canales.",
    responsibilities: [
      "Recibir solicitudes HTTPS.",
      "Aplicar autenticación y autorización.",
      "Controlar límites de uso.",
      "Separar tráfico por empresa.",
      "Registrar trazabilidad de eventos.",
    ],
    dependencies: [
      "Autenticación",
      "Modelo multiempresa",
      "Base de datos",
    ],
  },
  {
    id: "multi-tenant-database",
    title: "Base de datos multiempresa",
    category: "database",
    status: "critical",
    priority: "critical",
    description:
      "Capa persistente para empresas, usuarios, servicios, contactos, conversaciones, leads, reportes y configuraciones.",
    responsibilities: [
      "Guardar perfiles empresariales.",
      "Guardar conversaciones y leads.",
      "Separar datos por empresa.",
      "Permitir auditoría y respaldo.",
      "Soportar consultas para reportes.",
    ],
    dependencies: [
      "Modelo de datos",
      "Políticas de privacidad",
      "Cifrado en reposo",
    ],
  },
  {
    id: "authentication-service",
    title: "Autenticación y sesiones",
    category: "security",
    status: "critical",
    priority: "critical",
    description:
      "Sistema de acceso seguro para administradores, comerciales, soporte y usuarios internos.",
    responsibilities: [
      "Login seguro.",
      "Manejo de sesiones.",
      "Recuperación de acceso.",
      "Protección del panel administrador.",
      "Control básico de identidad.",
    ],
    dependencies: [
      "Base de datos de usuarios",
      "Roles y permisos",
      "Políticas de seguridad",
    ],
  },
  {
    id: "roles-permissions",
    title: "Roles y permisos",
    category: "security",
    status: "required",
    priority: "high",
    description:
      "Matriz de permisos para controlar qué acciones puede realizar cada tipo de usuario.",
    responsibilities: [
      "Diferenciar administrador, comercial, soporte y visualizador.",
      "Proteger exportaciones.",
      "Proteger configuración empresarial.",
      "Limitar acceso a datos sensibles.",
    ],
    dependencies: [
      "Autenticación",
      "Modelo de usuarios",
    ],
  },
  {
    id: "company-profile-api",
    title: "API de empresas y configuración",
    category: "api",
    status: "required",
    priority: "high",
    description:
      "Servicio encargado de administrar perfiles empresariales, servicios, contactos humanos, tono del asistente y mensajes de bienvenida.",
    responsibilities: [
      "Crear y editar empresas.",
      "Guardar servicios configurados.",
      "Guardar contactos humanos.",
      "Entregar configuración al widget.",
      "Mantener versionado de configuración.",
    ],
    dependencies: [
      "Base de datos multiempresa",
      "Autenticación",
      "Roles y permisos",
    ],
  },
  {
    id: "conversation-api",
    title: "API de conversaciones",
    category: "api",
    status: "critical",
    priority: "critical",
    description:
      "Servicio central para recibir, guardar, procesar y consultar conversaciones desde widget web, WhatsApp u otros canales.",
    responsibilities: [
      "Crear conversaciones.",
      "Guardar mensajes entrantes y salientes.",
      "Asignar canal de origen.",
      "Mantener historial.",
      "Preparar datos para análisis IA.",
    ],
    dependencies: [
      "API Gateway",
      "Base de datos",
      "Motor IA",
      "Políticas de privacidad",
    ],
  },
  {
    id: "lead-api",
    title: "API de leads y oportunidades",
    category: "api",
    status: "required",
    priority: "high",
    description:
      "Servicio encargado de transformar conversaciones en oportunidades comerciales trazables.",
    responsibilities: [
      "Crear lead desde conversación.",
      "Asignar prioridad.",
      "Asignar canal.",
      "Guardar servicio de interés.",
      "Permitir seguimiento comercial.",
    ],
    dependencies: [
      "API de conversaciones",
      "Motor IA",
      "Base de datos",
    ],
  },
  {
    id: "ai-analysis-service",
    title: "Servicio de análisis IA",
    category: "ai_engine",
    status: "required",
    priority: "high",
    description:
      "Capa encargada de clasificar intención, prioridad, tipo de cliente, servicio de interés y recomendación de acción.",
    responsibilities: [
      "Clasificar consultas.",
      "Detectar servicios configurados.",
      "Sugerir respuestas.",
      "Detectar necesidad de derivación humana.",
      "Generar resúmenes comerciales.",
    ],
    dependencies: [
      "Configuración empresarial",
      "Historial de conversación",
      "Políticas de uso de IA",
    ],
  },
  {
    id: "web-widget-runtime",
    title: "Runtime del widget web productivo",
    category: "frontend",
    status: "required",
    priority: "high",
    description:
      "Versión pública y liviana del chatbox para instalar en sitios web reales.",
    responsibilities: [
      "Cargar configuración por empresa.",
      "Mostrar chat público.",
      "Enviar mensajes al backend.",
      "Respetar privacidad y consentimiento.",
      "Mantener diseño responsive.",
    ],
    dependencies: [
      "CDN o dominio",
      "API pública del widget",
      "Configuración empresarial",
    ],
  },
  {
    id: "whatsapp-webhook",
    title: "Webhook WhatsApp Business",
    category: "channels",
    status: "future",
    priority: "critical",
    description:
      "Entrada segura para mensajes reales desde WhatsApp Business mediante proveedor oficial.",
    responsibilities: [
      "Recibir eventos de WhatsApp.",
      "Validar firma del proveedor.",
      "Normalizar payloads.",
      "Crear conversaciones.",
      "Registrar trazabilidad.",
    ],
    dependencies: [
      "Proveedor WhatsApp oficial",
      "Backend HTTPS",
      "Validación de firma",
      "Políticas de consentimiento",
    ],
  },
  {
    id: "privacy-compliance",
    title: "Privacidad, consentimiento y retención",
    category: "security",
    status: "critical",
    priority: "critical",
    description:
      "Marco de protección de datos para operar con conversaciones, contactos, leads y reportes.",
    responsibilities: [
      "Gestionar consentimiento.",
      "Definir retención de datos.",
      "Permitir eliminación/exportación.",
      "Proteger datos sensibles.",
      "Documentar políticas públicas.",
    ],
    dependencies: [
      "Base de datos",
      "Autenticación",
      "Política legal",
    ],
  },
  {
    id: "observability",
    title: "Monitoreo, logs y auditoría",
    category: "operations",
    status: "future",
    priority: "medium",
    description:
      "Capa operativa para monitorear errores, eventos, conversaciones, uso del sistema y salud del servicio.",
    responsibilities: [
      "Registrar errores.",
      "Monitorear disponibilidad.",
      "Auditar eventos críticos.",
      "Medir uso por empresa.",
      "Detectar fallas operativas.",
    ],
    dependencies: [
      "Backend productivo",
      "Sistema de logs",
      "Políticas de auditoría",
    ],
  },
];

export function buildBackendArchitectureSummary(
  components: BackendArchitectureComponent[]
) {
  const total = components.length;
  const critical = components.filter(
    (component) => component.status === "critical"
  ).length;
  const required = components.filter(
    (component) => component.status === "required"
  ).length;
  const conceptual = components.filter(
    (component) => component.status === "conceptual"
  ).length;
  const future = components.filter(
    (component) => component.status === "future"
  ).length;

  return {
    total,
    critical,
    required,
    conceptual,
    future,
  };
}

export function buildBackendArchitectureBlueprintText(params: {
  profile: CompanyProfile;
  components: BackendArchitectureComponent[];
  summary: ReturnType<typeof buildBackendArchitectureSummary>;
}): string {
  const { profile, components, summary } = params;

  const componentText = components
    .map((component) => {
      return `- ${component.title}
  Categoría: ${BACKEND_ARCHITECTURE_CATEGORY_LABELS[component.category]}
  Estado: ${BACKEND_ARCHITECTURE_STATUS_LABELS[component.status]}
  Prioridad: ${PRODUCTION_CHECKLIST_PRIORITY_LABELS[component.priority]}
  Descripción: ${component.description}
  Responsabilidades:
${component.responsibilities.map((item) => `    - ${item}`).join("\n")}
  Dependencias:
${component.dependencies.map((item) => `    - ${item}`).join("\n")}`;
    })
    .join("\n\n");

  return `BLUEPRINT DE ARQUITECTURA BACKEND — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

RESUMEN
Componentes evaluados: ${summary.total}
Críticos: ${summary.critical}
Requeridos: ${summary.required}
Conceptuales: ${summary.conceptual}
Futuros: ${summary.future}

COMPONENTES
${componentText}

NOTA
Este blueprint es conceptual. No crea infraestructura real ni conecta servicios externos. Sirve como guía técnica para diseñar la arquitectura productiva futura.`;
}


export type DataModelEntityType =
  | "core"
  | "configuration"
  | "conversation"
  | "commercial"
  | "security"
  | "reporting"
  | "operations";

export type DataModelEntityStatus = "prototype" | "required" | "future";

export type DataModelField = {
  name: string;
  type: string;
  description: string;
  required: boolean;
};

export type DataModelRelation = {
  targetEntityId: string;
  type: "one_to_one" | "one_to_many" | "many_to_one" | "many_to_many";
  description: string;
};

export type MultiTenantDataModelEntity = {
  id: string;
  title: string;
  entityName: string;
  type: DataModelEntityType;
  status: DataModelEntityStatus;
  priority: ProductionChecklistPriority;
  description: string;
  fields: DataModelField[];
  relations: DataModelRelation[];
};

export const DATA_MODEL_ENTITY_TYPE_LABELS: Record<DataModelEntityType, string> = {
  core: "Núcleo",
  configuration: "Configuración",
  conversation: "Conversaciones",
  commercial: "Comercial",
  security: "Seguridad",
  reporting: "Reportes",
  operations: "Operaciones",
};

export const DATA_MODEL_ENTITY_STATUS_LABELS: Record<DataModelEntityStatus, string> = {
  prototype: "Cubierto en prototipo",
  required: "Requerido para producción",
  future: "Futuro",
};

export const DATA_MODEL_RELATION_TYPE_LABELS: Record<
  DataModelRelation["type"],
  string
> = {
  one_to_one: "Uno a uno",
  one_to_many: "Uno a muchos",
  many_to_one: "Muchos a uno",
  many_to_many: "Muchos a muchos",
};

export const MULTI_TENANT_DATA_MODEL_ENTITIES_PART_A: MultiTenantDataModelEntity[] = [
  {
    id: "company",
    title: "Empresa",
    entityName: "Company",
    type: "core",
    status: "prototype",
    priority: "critical",
    description:
      "Representa a cada empresa cliente que utilizará ORBI ChatBox IA Core con su propia configuración, servicios, contactos, conversaciones y reportes.",
    fields: [
      {
        name: "id",
        type: "string / uuid",
        description: "Identificador único de la empresa.",
        required: true,
      },
      {
        name: "brandName",
        type: "string",
        description: "Nombre visible de la marca o empresa.",
        required: true,
      },
      {
        name: "legalName",
        type: "string",
        description: "Razón social o nombre legal.",
        required: false,
      },
      {
        name: "industry",
        type: "string",
        description: "Rubro o industria de la empresa.",
        required: false,
      },
      {
        name: "country",
        type: "string",
        description: "País de operación principal.",
        required: false,
      },
      {
        name: "status",
        type: "active | paused | archived",
        description: "Estado operativo de la empresa dentro de la plataforma.",
        required: true,
      },
      {
        name: "createdAt",
        type: "datetime",
        description: "Fecha de creación del registro.",
        required: true,
      },
    ],
    relations: [
      {
        targetEntityId: "user",
        type: "one_to_many",
        description:
          "Una empresa puede tener múltiples usuarios administradores, comerciales o soporte.",
      },
      {
        targetEntityId: "company_service",
        type: "one_to_many",
        description: "Una empresa puede configurar múltiples servicios.",
      },
      {
        targetEntityId: "human_contact",
        type: "one_to_many",
        description: "Una empresa puede tener múltiples contactos humanos.",
      },
      {
        targetEntityId: "widget_config",
        type: "one_to_one",
        description:
          "Cada empresa puede tener una configuración principal del widget.",
      },
    ],
  },
  {
    id: "user",
    title: "Usuario",
    entityName: "User",
    type: "security",
    status: "required",
    priority: "critical",
    description:
      "Representa a una persona con acceso al panel administrativo, como administrador, ejecutivo comercial, soporte o visualizador.",
    fields: [
      {
        name: "id",
        type: "string / uuid",
        description: "Identificador único del usuario.",
        required: true,
      },
      {
        name: "companyId",
        type: "string / uuid",
        description: "Empresa a la que pertenece el usuario.",
        required: true,
      },
      {
        name: "name",
        type: "string",
        description: "Nombre del usuario.",
        required: true,
      },
      {
        name: "email",
        type: "string",
        description: "Correo de acceso.",
        required: true,
      },
      {
        name: "roleId",
        type: "string / uuid",
        description: "Rol asignado al usuario.",
        required: true,
      },
      {
        name: "status",
        type: "active | disabled",
        description: "Estado de acceso del usuario.",
        required: true,
      },
    ],
    relations: [
      {
        targetEntityId: "company",
        type: "many_to_one",
        description: "Muchos usuarios pertenecen a una empresa.",
      },
      {
        targetEntityId: "role",
        type: "many_to_one",
        description: "Muchos usuarios pueden compartir un mismo rol.",
      },
    ],
  },
  {
    id: "role",
    title: "Rol y permisos",
    entityName: "Role",
    type: "security",
    status: "required",
    priority: "high",
    description:
      "Define permisos de acceso dentro de la plataforma, separando administración, ventas, soporte y visualización.",
    fields: [
      {
        name: "id",
        type: "string / uuid",
        description: "Identificador único del rol.",
        required: true,
      },
      {
        name: "name",
        type: "admin | sales | support | viewer",
        description: "Nombre lógico del rol.",
        required: true,
      },
      {
        name: "permissions",
        type: "string[]",
        description: "Lista de permisos asociados al rol.",
        required: true,
      },
    ],
    relations: [
      {
        targetEntityId: "user",
        type: "one_to_many",
        description: "Un rol puede asignarse a múltiples usuarios.",
      },
    ],
  },
  {
    id: "company_service",
    title: "Servicio empresarial",
    entityName: "CompanyService",
    type: "configuration",
    status: "prototype",
    priority: "high",
    description:
      "Representa cada servicio configurado por una empresa para que el motor de análisis pueda detectarlo en conversaciones.",
    fields: [
      {
        name: "id",
        type: "string / uuid",
        description: "Identificador único del servicio.",
        required: true,
      },
      {
        name: "companyId",
        type: "string / uuid",
        description: "Empresa propietaria del servicio.",
        required: true,
      },
      {
        name: "name",
        type: "string",
        description: "Nombre del servicio.",
        required: true,
      },
      {
        name: "description",
        type: "string",
        description: "Descripción comercial o técnica del servicio.",
        required: true,
      },
      {
        name: "keywords",
        type: "string[]",
        description: "Palabras clave usadas para detección dinámica.",
        required: false,
      },
      {
        name: "isActive",
        type: "boolean",
        description: "Indica si el servicio está activo para detección.",
        required: true,
      },
    ],
    relations: [
      {
        targetEntityId: "company",
        type: "many_to_one",
        description: "Cada servicio pertenece a una empresa.",
      },
    ],
  },
  {
    id: "human_contact",
    title: "Contacto humano",
    entityName: "HumanContact",
    type: "configuration",
    status: "prototype",
    priority: "high",
    description:
      "Representa contactos internos de la empresa para derivaciones humanas, ventas, soporte o seguimiento.",
    fields: [
      {
        name: "id",
        type: "string / uuid",
        description: "Identificador único del contacto.",
        required: true,
      },
      {
        name: "companyId",
        type: "string / uuid",
        description: "Empresa propietaria del contacto.",
        required: true,
      },
      {
        name: "name",
        type: "string",
        description: "Nombre del contacto humano.",
        required: true,
      },
      {
        name: "role",
        type: "string",
        description: "Cargo o función.",
        required: true,
      },
      {
        name: "email",
        type: "string",
        description: "Correo de contacto.",
        required: false,
      },
      {
        name: "phone",
        type: "string",
        description: "Teléfono de contacto.",
        required: false,
      },
      {
        name: "preferredChannel",
        type: "whatsapp | email | phone | internal",
        description: "Canal preferido para derivación.",
        required: true,
      },
    ],
    relations: [
      {
        targetEntityId: "company",
        type: "many_to_one",
        description: "Cada contacto pertenece a una empresa.",
      },
    ],
  },
  {
    id: "widget_config",
    title: "Configuración del widget",
    entityName: "WidgetConfig",
    type: "configuration",
    status: "required",
    priority: "high",
    description:
      "Define cómo se comporta y visualiza el widget web productivo para cada empresa.",
    fields: [
      {
        name: "id",
        type: "string / uuid",
        description: "Identificador único de la configuración.",
        required: true,
      },
      {
        name: "companyId",
        type: "string / uuid",
        description: "Empresa asociada.",
        required: true,
      },
      {
        name: "assistantName",
        type: "string",
        description: "Nombre visible del asistente.",
        required: true,
      },
      {
        name: "welcomeMessage",
        type: "string",
        description: "Mensaje inicial del widget.",
        required: true,
      },
      {
        name: "theme",
        type: "object",
        description: "Colores, estilo visual y posición del widget.",
        required: false,
      },
      {
        name: "enabledChannels",
        type: "string[]",
        description: "Canales habilitados para la empresa.",
        required: true,
      },
    ],
    relations: [
      {
        targetEntityId: "company",
        type: "one_to_one",
        description:
          "Cada empresa puede tener una configuración principal del widget.",
      },
    ],
  },
];

export function buildMultiTenantDataModelPartASummary(
  entities: MultiTenantDataModelEntity[]
) {
  const total = entities.length;

  const prototype = entities.filter(
    (entity) => entity.status === "prototype"
  ).length;

  const required = entities.filter(
    (entity) => entity.status === "required"
  ).length;

  const future = entities.filter((entity) => entity.status === "future").length;

  const totalFields = entities.reduce(
    (sum, entity) => sum + entity.fields.length,
    0
  );

  const totalRelations = entities.reduce(
    (sum, entity) => sum + entity.relations.length,
    0
  );

  return {
    total,
    prototype,
    required,
    future,
    totalFields,
    totalRelations,
  };
}

export const MULTI_TENANT_DATA_MODEL_ENTITIES_PART_B: MultiTenantDataModelEntity[] = [
  {
    id: "conversation",
    title: "Conversación",
    entityName: "Conversation",
    type: "conversation",
    status: "required",
    priority: "critical",
    description:
      "Agrupa los mensajes intercambiados entre un cliente y el asistente o equipo humano por un canal determinado.",
    fields: [
      {
        name: "id",
        type: "string / uuid",
        description: "Identificador único de la conversación.",
        required: true,
      },
      {
        name: "companyId",
        type: "string / uuid",
        description: "Empresa propietaria de la conversación.",
        required: true,
      },
      {
        name: "channel",
        type: "web_demo | whatsapp_future | manual_test | production_channel",
        description: "Canal de origen de la conversación.",
        required: true,
      },
      {
        name: "customerName",
        type: "string",
        description: "Nombre del cliente si se detecta o se recibe desde el canal.",
        required: false,
      },
      {
        name: "customerPhone",
        type: "string",
        description: "Teléfono detectado o recibido por canal.",
        required: false,
      },
      {
        name: "customerEmail",
        type: "string",
        description: "Correo detectado o entregado por el cliente.",
        required: false,
      },
      {
        name: "status",
        type: "open | in_review | replied | human_handoff | closed",
        description: "Estado operativo de la conversación.",
        required: true,
      },
      {
        name: "createdAt",
        type: "datetime",
        description: "Fecha de creación de la conversación.",
        required: true,
      },
      {
        name: "updatedAt",
        type: "datetime",
        description: "Última actualización de la conversación.",
        required: true,
      },
    ],
    relations: [
      {
        targetEntityId: "company",
        type: "many_to_one",
        description: "Cada conversación pertenece a una empresa.",
      },
      {
        targetEntityId: "message",
        type: "one_to_many",
        description: "Una conversación contiene múltiples mensajes.",
      },
      {
        targetEntityId: "lead",
        type: "one_to_one",
        description: "Una conversación puede originar un lead principal.",
      },
    ],
  },
  {
    id: "message",
    title: "Mensaje",
    entityName: "Message",
    type: "conversation",
    status: "required",
    priority: "critical",
    description:
      "Representa cada mensaje individual enviado por cliente, asistente IA, sistema o equipo humano.",
    fields: [
      {
        name: "id",
        type: "string / uuid",
        description: "Identificador único del mensaje.",
        required: true,
      },
      {
        name: "conversationId",
        type: "string / uuid",
        description: "Conversación a la que pertenece.",
        required: true,
      },
      {
        name: "senderType",
        type: "customer | assistant | human | system",
        description: "Origen del mensaje.",
        required: true,
      },
      {
        name: "body",
        type: "string",
        description: "Contenido del mensaje.",
        required: true,
      },
      {
        name: "metadata",
        type: "json",
        description:
          "Información adicional opcional, como canal, adjuntos futuros o datos técnicos del mensaje.",
        required: false,
      },
      {
        name: "createdAt",
        type: "datetime",
        description: "Fecha y hora del mensaje.",
        required: true,
      },
    ],
    relations: [
      {
        targetEntityId: "conversation",
        type: "many_to_one",
        description: "Muchos mensajes pertenecen a una conversación.",
      },
    ],
  },
  {
    id: "lead",
    title: "Lead comercial",
    entityName: "Lead",
    type: "commercial",
    status: "prototype",
    priority: "critical",
    description:
      "Representa una oportunidad comercial generada desde una conversación, con prioridad, servicio de interés, resumen IA y recomendación de acción.",
    fields: [
      {
        name: "id",
        type: "string / uuid",
        description: "Identificador único del lead.",
        required: true,
      },
      {
        name: "companyId",
        type: "string / uuid",
        description: "Empresa propietaria del lead.",
        required: true,
      },
      {
        name: "conversationId",
        type: "string / uuid",
        description: "Conversación de origen.",
        required: false,
      },
      {
        name: "channel",
        type: "ChatChannel",
        description: "Canal de origen del lead.",
        required: true,
      },
      {
        name: "priority",
        type: "low | medium | high | critical",
        description: "Prioridad comercial.",
        required: true,
      },
      {
        name: "customerType",
        type: "CustomerType",
        description: "Tipo de cliente detectado.",
        required: true,
      },
      {
        name: "serviceId",
        type: "string / uuid",
        description: "Servicio configurado detectado, si existe.",
        required: false,
      },
      {
        name: "needsHumanContact",
        type: "boolean",
        description: "Indica si requiere derivación humana.",
        required: true,
      },
      {
        name: "aiSummary",
        type: "string",
        description: "Resumen generado por el análisis IA.",
        required: true,
      },
      {
        name: "recommendedAction",
        type: "string",
        description: "Acción recomendada.",
        required: true,
      },
      {
        name: "createdAt",
        type: "datetime",
        description: "Fecha de creación del lead.",
        required: true,
      },
    ],
    relations: [
      {
        targetEntityId: "company",
        type: "many_to_one",
        description: "Cada lead pertenece a una empresa.",
      },
      {
        targetEntityId: "conversation",
        type: "one_to_one",
        description: "Un lead puede estar vinculado a una conversación.",
      },
      {
        targetEntityId: "company_service",
        type: "many_to_one",
        description: "Un lead puede estar asociado a un servicio configurado.",
      },
      {
        targetEntityId: "human_contact",
        type: "many_to_one",
        description: "Un lead puede derivarse a un contacto humano.",
      },
    ],
  },
  {
    id: "report",
    title: "Reporte",
    entityName: "Report",
    type: "reporting",
    status: "prototype",
    priority: "medium",
    description:
      "Representa resúmenes comerciales, métricas multicanal, diagnósticos o reportes ejecutivos generados por el sistema.",
    fields: [
      {
        name: "id",
        type: "string / uuid",
        description: "Identificador único del reporte.",
        required: true,
      },
      {
        name: "companyId",
        type: "string / uuid",
        description: "Empresa propietaria del reporte.",
        required: true,
      },
      {
        name: "reportType",
        type: "daily | multichannel | diagnostic | executive | production",
        description: "Tipo de reporte generado.",
        required: true,
      },
      {
        name: "content",
        type: "json",
        description: "Contenido estructurado del reporte.",
        required: true,
      },
      {
        name: "generatedAt",
        type: "datetime",
        description: "Fecha de generación del reporte.",
        required: true,
      },
    ],
    relations: [
      {
        targetEntityId: "company",
        type: "many_to_one",
        description: "Una empresa puede tener múltiples reportes.",
      },
    ],
  },
  {
    id: "audit_log",
    title: "Auditoría / Log",
    entityName: "AuditLog",
    type: "operations",
    status: "future",
    priority: "medium",
    description:
      "Registra eventos importantes del sistema para trazabilidad, seguridad, errores y acciones administrativas.",
    fields: [
      {
        name: "id",
        type: "string / uuid",
        description: "Identificador único del evento.",
        required: true,
      },
      {
        name: "companyId",
        type: "string / uuid",
        description: "Empresa asociada al evento.",
        required: true,
      },
      {
        name: "userId",
        type: "string / uuid",
        description: "Usuario que generó el evento, si aplica.",
        required: false,
      },
      {
        name: "eventType",
        type: "string",
        description: "Tipo de evento registrado.",
        required: true,
      },
      {
        name: "metadata",
        type: "json",
        description: "Información adicional del evento.",
        required: false,
      },
      {
        name: "createdAt",
        type: "datetime",
        description: "Fecha y hora del evento.",
        required: true,
      },
    ],
    relations: [
      {
        targetEntityId: "company",
        type: "many_to_one",
        description: "Una empresa puede generar múltiples logs.",
      },
      {
        targetEntityId: "user",
        type: "many_to_one",
        description: "Un usuario puede estar asociado a múltiples eventos.",
      },
    ],
  },
];

export const MULTI_TENANT_DATA_MODEL_ENTITIES: MultiTenantDataModelEntity[] = [
  ...MULTI_TENANT_DATA_MODEL_ENTITIES_PART_A,
  ...MULTI_TENANT_DATA_MODEL_ENTITIES_PART_B,
];

export function buildMultiTenantDataModelSummary(
  entities: MultiTenantDataModelEntity[]
) {
  const total = entities.length;

  const prototype = entities.filter(
    (entity) => entity.status === "prototype"
  ).length;

  const required = entities.filter(
    (entity) => entity.status === "required"
  ).length;

  const future = entities.filter((entity) => entity.status === "future").length;

  const totalFields = entities.reduce(
    (sum, entity) => sum + entity.fields.length,
    0
  );

  const totalRelations = entities.reduce(
    (sum, entity) => sum + entity.relations.length,
    0
  );

  return {
    total,
    prototype,
    required,
    future,
    totalFields,
    totalRelations,
  };
}

export function buildMultiTenantDataModelText(params: {
  profile: CompanyProfile;
  entities: MultiTenantDataModelEntity[];
  summary: ReturnType<typeof buildMultiTenantDataModelSummary>;
}): string {
  const { profile, entities, summary } = params;

  const entityText = entities
    .map((entity) => {
      const fieldsText = entity.fields
        .map((field) => {
          return `    - ${field.name}: ${field.type}
      Requerido: ${field.required ? "Sí" : "No"}
      Descripción: ${field.description}`;
        })
        .join("\n");

      const relationsText = entity.relations
        .map((relation) => {
          return `    - Relación con ${relation.targetEntityId}
      Tipo: ${DATA_MODEL_RELATION_TYPE_LABELS[relation.type]}
      Descripción: ${relation.description}`;
        })
        .join("\n");

      return `ENTIDAD: ${entity.title} (${entity.entityName})
Tipo: ${DATA_MODEL_ENTITY_TYPE_LABELS[entity.type]}
Estado: ${DATA_MODEL_ENTITY_STATUS_LABELS[entity.status]}
Prioridad: ${PRODUCTION_CHECKLIST_PRIORITY_LABELS[entity.priority]}
Descripción: ${entity.description}

Campos:
${fieldsText}

Relaciones:
${relationsText || "    - Sin relaciones definidas"}`;
    })
    .join("\n\n---\n\n");

  return `MODELO DE DATOS MULTIEMPRESA — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

RESUMEN
Entidades: ${summary.total}
Cubiertas en prototipo: ${summary.prototype}
Requeridas para producción: ${summary.required}
Futuras: ${summary.future}
Campos totales: ${summary.totalFields}
Relaciones totales: ${summary.totalRelations}

DETALLE DE ENTIDADES
${entityText}

NOTA
Este modelo de datos es conceptual. No crea una base de datos real, no migra datos, no modifica localStorage y no conecta una base productiva.`;
}

export type AccessRoleId =
  | "orbi_super_admin"
  | "company_admin"
  | "sales_agent"
  | "human_support"
  | "viewer"
  | "technical_integrator";

export type AccessPermissionLevel = "none" | "read" | "write" | "admin";

export type AccessArea =
  | "company_profile"
  | "services"
  | "human_contacts"
  | "conversations"
  | "leads"
  | "reports"
  | "widget_config"
  | "whatsapp_future"
  | "backups"
  | "diagnostics"
  | "production_blueprint"
  | "user_management";

export type AccessMatrixPermission = {
  area: AccessArea;
  level: AccessPermissionLevel;
  description: string;
};

export type AccessRoleDefinition = {
  id: AccessRoleId;
  title: string;
  description: string;
  priority: ProductionChecklistPriority;
  riskLevel: "low" | "medium" | "high" | "critical";
  permissions: AccessMatrixPermission[];
  recommendations: string[];
};

export const ACCESS_ROLE_LABELS: Record<AccessRoleId, string> = {
  orbi_super_admin: "Super Admin ORBI",
  company_admin: "Administrador de empresa",
  sales_agent: "Ejecutivo comercial",
  human_support: "Soporte humano",
  viewer: "Visualizador",
  technical_integrator: "Integrador técnico",
};

export const ACCESS_PERMISSION_LEVEL_LABELS: Record<AccessPermissionLevel, string> = {
  none: "Sin acceso",
  read: "Lectura",
  write: "Lectura / escritura",
  admin: "Administración",
};

export const ACCESS_AREA_LABELS: Record<AccessArea, string> = {
  company_profile: "Perfil empresarial",
  services: "Servicios",
  human_contacts: "Contactos humanos",
  conversations: "Conversaciones",
  leads: "Leads",
  reports: "Reportes",
  widget_config: "Configuración widget",
  whatsapp_future: "WhatsApp Futuro",
  backups: "Respaldos",
  diagnostics: "Diagnóstico",
  production_blueprint: "Blueprint productivo",
  user_management: "Gestión de usuarios",
};

export const ACCESS_ROLE_DEFINITIONS_PART_A: AccessRoleDefinition[] = [
  {
    id: "orbi_super_admin",
    title: "Super Admin ORBI",
    description:
      "Rol interno de ORBI para administrar la plataforma global, empresas, configuración crítica, soporte avanzado y supervisión técnica.",
    priority: "critical",
    riskLevel: "critical",
    permissions: [
      {
        area: "company_profile",
        level: "admin",
        description: "Puede administrar perfiles de empresas.",
      },
      {
        area: "services",
        level: "admin",
        description: "Puede administrar servicios de cualquier empresa.",
      },
      {
        area: "human_contacts",
        level: "admin",
        description: "Puede administrar contactos humanos configurados.",
      },
      {
        area: "conversations",
        level: "read",
        description:
          "Puede revisar conversaciones solo bajo soporte autorizado.",
      },
      {
        area: "leads",
        level: "read",
        description: "Puede revisar leads para soporte o auditoría.",
      },
      {
        area: "reports",
        level: "admin",
        description: "Puede acceder a reportes globales y por empresa.",
      },
      {
        area: "widget_config",
        level: "admin",
        description: "Puede administrar configuración del widget.",
      },
      {
        area: "whatsapp_future",
        level: "admin",
        description: "Puede administrar integraciones futuras de canales.",
      },
      {
        area: "backups",
        level: "admin",
        description: "Puede gestionar respaldos bajo políticas estrictas.",
      },
      {
        area: "diagnostics",
        level: "admin",
        description: "Puede revisar diagnósticos y estado del sistema.",
      },
      {
        area: "production_blueprint",
        level: "admin",
        description: "Puede revisar y editar blueprint productivo.",
      },
      {
        area: "user_management",
        level: "admin",
        description: "Puede administrar usuarios y roles.",
      },
    ],
    recommendations: [
      "Debe usarse solo para administración global de plataforma.",
      "Debe requerir autenticación fuerte.",
      "Debe generar logs de auditoría en cada acción crítica.",
      "No debe usarse para operación comercial diaria.",
    ],
  },
  {
    id: "company_admin",
    title: "Administrador de empresa",
    description:
      "Rol principal de la empresa cliente para administrar su configuración, usuarios internos, servicios, contactos y reportes.",
    priority: "critical",
    riskLevel: "high",
    permissions: [
      {
        area: "company_profile",
        level: "admin",
        description: "Puede editar perfil empresarial de su empresa.",
      },
      {
        area: "services",
        level: "admin",
        description: "Puede crear, editar y desactivar servicios.",
      },
      {
        area: "human_contacts",
        level: "admin",
        description: "Puede administrar contactos de derivación.",
      },
      {
        area: "conversations",
        level: "read",
        description: "Puede revisar conversaciones de su empresa.",
      },
      {
        area: "leads",
        level: "admin",
        description: "Puede gestionar leads y seguimiento comercial.",
      },
      {
        area: "reports",
        level: "admin",
        description: "Puede revisar y exportar reportes.",
      },
      {
        area: "widget_config",
        level: "admin",
        description: "Puede configurar el widget público.",
      },
      {
        area: "whatsapp_future",
        level: "write",
        description: "Puede revisar configuración conceptual de canales.",
      },
      {
        area: "backups",
        level: "admin",
        description: "Puede exportar o restaurar respaldos de su empresa.",
      },
      {
        area: "diagnostics",
        level: "read",
        description: "Puede revisar diagnóstico local o productivo.",
      },
      {
        area: "production_blueprint",
        level: "read",
        description: "Puede revisar roadmap técnico.",
      },
      {
        area: "user_management",
        level: "admin",
        description: "Puede administrar usuarios internos de su empresa.",
      },
    ],
    recommendations: [
      "Debe tener acceso solo a su empresa.",
      "Debe contar con registro de acciones administrativas.",
      "Debe aprobar cambios sensibles del widget o contactos.",
    ],
  },
  {
    id: "sales_agent",
    title: "Ejecutivo comercial",
    description:
      "Rol orientado a revisar leads, reportes comerciales y oportunidades detectadas por el sistema.",
    priority: "high",
    riskLevel: "medium",
    permissions: [
      {
        area: "company_profile",
        level: "read",
        description: "Puede ver información general de la empresa.",
      },
      {
        area: "services",
        level: "read",
        description: "Puede ver servicios configurados.",
      },
      {
        area: "human_contacts",
        level: "read",
        description: "Puede ver contactos de derivación.",
      },
      {
        area: "conversations",
        level: "read",
        description: "Puede revisar conversaciones vinculadas a leads.",
      },
      {
        area: "leads",
        level: "write",
        description: "Puede gestionar estado y seguimiento de leads.",
      },
      {
        area: "reports",
        level: "read",
        description: "Puede revisar reportes comerciales.",
      },
      {
        area: "widget_config",
        level: "none",
        description: "No debe modificar configuración del widget.",
      },
      {
        area: "whatsapp_future",
        level: "read",
        description: "Puede revisar leads provenientes del canal WhatsApp.",
      },
      {
        area: "backups",
        level: "none",
        description: "No debe exportar ni restaurar respaldos.",
      },
      {
        area: "diagnostics",
        level: "read",
        description: "Puede revisar diagnósticos de preparación.",
      },
      {
        area: "production_blueprint",
        level: "none",
        description: "No requiere acceso a blueprint técnico.",
      },
      {
        area: "user_management",
        level: "none",
        description: "No puede administrar usuarios.",
      },
    ],
    recommendations: [
      "Debe enfocarse en seguimiento comercial.",
      "No debe tener acceso a respaldos ni configuración crítica.",
      "Debe poder actualizar estado de leads, no borrar datos sensibles.",
    ],
  },
];

export const ACCESS_ROLE_DEFINITIONS_PART_B: AccessRoleDefinition[] = [
  {
    id: "human_support",
    title: "Soporte humano",
    description:
      "Rol enfocado en atender conversaciones derivadas, casos críticos y respuestas humanas dentro del flujo comercial o soporte.",
    priority: "high",
    riskLevel: "medium",
    permissions: [
      {
        area: "company_profile",
        level: "read",
        description: "Puede ver información básica de la empresa.",
      },
      {
        area: "services",
        level: "read",
        description: "Puede ver servicios para responder mejor.",
      },
      {
        area: "human_contacts",
        level: "read",
        description: "Puede ver contactos internos relacionados.",
      },
      {
        area: "conversations",
        level: "write",
        description: "Puede responder o actualizar conversaciones asignadas.",
      },
      {
        area: "leads",
        level: "read",
        description: "Puede ver leads asociados a casos asignados.",
      },
      {
        area: "reports",
        level: "read",
        description: "Puede ver reportes básicos de atención.",
      },
      {
        area: "widget_config",
        level: "none",
        description: "No puede modificar el widget.",
      },
      {
        area: "whatsapp_future",
        level: "write",
        description: "Canal WhatsApp conceptual: puede gestionar conversaciones asignadas.",
      },
      {
        area: "backups",
        level: "none",
        description: "No puede gestionar respaldos.",
      },
      {
        area: "diagnostics",
        level: "none",
        description: "No requiere acceso a diagnóstico técnico.",
      },
      {
        area: "production_blueprint",
        level: "none",
        description: "No requiere acceso al blueprint productivo.",
      },
      {
        area: "user_management",
        level: "none",
        description: "No puede administrar usuarios.",
      },
    ],
    recommendations: [
      "Debe ver solo conversaciones asignadas o permitidas.",
      "Debe quedar registro de respuestas humanas.",
      "Debe tener restricciones sobre exportación de datos.",
    ],
  },
  {
    id: "viewer",
    title: "Visualizador",
    description:
      "Rol de solo lectura para supervisión, dirección, auditoría interna o revisión comercial sin capacidad de edición.",
    priority: "medium",
    riskLevel: "low",
    permissions: [
      {
        area: "company_profile",
        level: "read",
        description: "Puede ver el perfil empresarial.",
      },
      {
        area: "services",
        level: "read",
        description: "Puede ver servicios.",
      },
      {
        area: "human_contacts",
        level: "read",
        description: "Puede ver contactos internos.",
      },
      {
        area: "conversations",
        level: "read",
        description: "Puede ver conversaciones si la empresa lo permite.",
      },
      {
        area: "leads",
        level: "read",
        description: "Puede ver leads.",
      },
      {
        area: "reports",
        level: "read",
        description: "Puede ver reportes.",
      },
      {
        area: "widget_config",
        level: "read",
        description: "Puede ver configuración del widget.",
      },
      {
        area: "whatsapp_future",
        level: "read",
        description: "Puede ver estado conceptual del canal.",
      },
      {
        area: "backups",
        level: "none",
        description: "No puede exportar ni restaurar respaldos.",
      },
      {
        area: "diagnostics",
        level: "read",
        description: "Puede ver diagnóstico.",
      },
      {
        area: "production_blueprint",
        level: "read",
        description: "Puede ver blueprint conceptual.",
      },
      {
        area: "user_management",
        level: "none",
        description: "No puede gestionar usuarios.",
      },
    ],
    recommendations: [
      "Debe ser estrictamente de lectura.",
      "No debe permitir descargas sensibles salvo autorización.",
      "Útil para gerencia, socios o revisión interna.",
    ],
  },
  {
    id: "technical_integrator",
    title: "Integrador técnico",
    description:
      "Rol orientado a instalación de widget, integración futura de canales, revisión de blueprint y configuración técnica.",
    priority: "high",
    riskLevel: "high",
    permissions: [
      {
        area: "company_profile",
        level: "read",
        description: "Puede revisar datos básicos de empresa.",
      },
      {
        area: "services",
        level: "read",
        description: "Puede revisar servicios para pruebas técnicas.",
      },
      {
        area: "human_contacts",
        level: "none",
        description: "No requiere gestionar contactos humanos.",
      },
      {
        area: "conversations",
        level: "read",
        description: "Puede revisar conversaciones de prueba técnica.",
      },
      {
        area: "leads",
        level: "read",
        description: "Puede revisar leads de prueba para validación.",
      },
      {
        area: "reports",
        level: "read",
        description: "Puede revisar métricas técnicas y reportes.",
      },
      {
        area: "widget_config",
        level: "write",
        description: "Puede configurar instalación técnica del widget.",
      },
      {
        area: "whatsapp_future",
        level: "write",
        description: "Puede preparar integración conceptual de canales.",
      },
      {
        area: "backups",
        level: "none",
        description: "No debe restaurar respaldos comerciales.",
      },
      {
        area: "diagnostics",
        level: "read",
        description: "Puede revisar diagnóstico técnico.",
      },
      {
        area: "production_blueprint",
        level: "write",
        description: "Puede trabajar sobre blueprint técnico.",
      },
      {
        area: "user_management",
        level: "none",
        description: "No puede administrar usuarios.",
      },
    ],
    recommendations: [
      "Debe limitarse a configuración técnica.",
      "Debe operar en ambientes de prueba antes de producción.",
      "Debe registrar cambios en widget, canales o blueprint.",
    ],
  },
];

export const ACCESS_ROLE_DEFINITIONS: AccessRoleDefinition[] = [
  ...ACCESS_ROLE_DEFINITIONS_PART_A,
  ...ACCESS_ROLE_DEFINITIONS_PART_B,
];

export function buildAccessMatrixSummary(roles: AccessRoleDefinition[]) {
  const totalRoles = roles.length;

  const criticalRiskRoles = roles.filter(
    (role) => role.riskLevel === "critical"
  ).length;

  const highRiskRoles = roles.filter((role) => role.riskLevel === "high").length;

  const adminPermissions = roles.reduce((sum, role) => {
    return (
      sum +
      role.permissions.filter((permission) => permission.level === "admin")
        .length
    );
  }, 0);

  const noAccessPermissions = roles.reduce((sum, role) => {
    return (
      sum +
      role.permissions.filter((permission) => permission.level === "none")
        .length
    );
  }, 0);

  return {
    totalRoles,
    criticalRiskRoles,
    highRiskRoles,
    adminPermissions,
    noAccessPermissions,
  };
}

export function buildAccessMatrixText(params: {
  profile: CompanyProfile;
  roles: AccessRoleDefinition[];
  summary: ReturnType<typeof buildAccessMatrixSummary>;
}): string {
  const { profile, roles, summary } = params;

  const rolesText = roles
    .map((role) => {
      const permissionsText = role.permissions
        .map((permission) => {
          return `    - ${ACCESS_AREA_LABELS[permission.area]}
      Nivel: ${ACCESS_PERMISSION_LEVEL_LABELS[permission.level]}
      Detalle: ${permission.description}`;
        })
        .join("\n");

      const recommendationsText = role.recommendations
        .map((item) => `    - ${item}`)
        .join("\n");

      return `ROL: ${role.title}
Riesgo: ${role.riskLevel}
Prioridad: ${PRODUCTION_CHECKLIST_PRIORITY_LABELS[role.priority]}
Descripción: ${role.description}

Permisos:
${permissionsText || "    - Sin permisos para el filtro seleccionado"}

Recomendaciones:
${recommendationsText}`;
    })
    .join("\n\n---\n\n");

  return `MATRIZ DE ROLES Y PERMISOS — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

RESUMEN
Roles definidos: ${summary.totalRoles}
Roles de riesgo crítico: ${summary.criticalRiskRoles}
Roles de riesgo alto: ${summary.highRiskRoles}
Permisos administrativos: ${summary.adminPermissions}
Áreas sin acceso explícito: ${summary.noAccessPermissions}

DETALLE DE ROLES
${rolesText}

NOTA
Esta matriz es conceptual. No crea autenticación real, no modifica usuarios, no altera permisos del prototipo y no conecta servicios externos.`;
}

export type ApiContractMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiContractCategory =
  | "auth"
  | "companies"
  | "users"
  | "roles"
  | "services"
  | "contacts"
  | "widget"
  | "conversations"
  | "messages"
  | "leads"
  | "reports"
  | "public_widget"
  | "webhooks";

export type ApiContractStatus = "conceptual" | "required" | "critical" | "future";

export type ApiContractAuthRequirement =
  | "public"
  | "authenticated"
  | "admin_only"
  | "super_admin_only";

export type ApiContractDefinition = {
  id: string;
  title: string;
  method: ApiContractMethod;
  path: string;
  category: ApiContractCategory;
  status: ApiContractStatus;
  priority: ProductionChecklistPriority;
  authRequirement: ApiContractAuthRequirement;
  description: string;
  requestExample: string;
  responseExample: string;
  notes: string[];
};

export const API_CONTRACT_METHOD_LABELS: Record<ApiContractMethod, string> = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
};

export const API_CONTRACT_CATEGORY_LABELS: Record<ApiContractCategory, string> = {
  auth: "Autenticación",
  companies: "Empresas",
  users: "Usuarios",
  roles: "Roles",
  services: "Servicios",
  contacts: "Contactos humanos",
  widget: "Widget",
  conversations: "Conversaciones",
  messages: "Mensajes",
  leads: "Leads",
  reports: "Reportes",
  public_widget: "Widget público",
  webhooks: "Webhooks",
};

export const API_CONTRACT_STATUS_LABELS: Record<ApiContractStatus, string> = {
  conceptual: "Conceptual",
  required: "Requerido",
  critical: "Crítico",
  future: "Futuro",
};

export const API_CONTRACT_AUTH_LABELS: Record<ApiContractAuthRequirement, string> = {
  public: "Público",
  authenticated: "Autenticado",
  admin_only: "Solo administrador",
  super_admin_only: "Solo Super Admin",
};

export const API_CONTRACTS_PART_A: ApiContractDefinition[] = [
  {
    id: "auth-login",
    title: "Inicio de sesión",
    method: "POST",
    path: "/api/auth/login",
    category: "auth",
    status: "critical",
    priority: "critical",
    authRequirement: "public",
    description:
      "Permitiría autenticar a un usuario autorizado para ingresar al panel administrativo.",
    requestExample: `{
  "email": "admin@empresa.cl",
  "password": "********"
}`,
    responseExample: `{
  "accessToken": "jwt_token",
  "user": {
    "id": "user_001",
    "companyId": "company_001",
    "roleId": "company_admin"
  }
}`,
    notes: [
      "Debe usar HTTPS obligatorio.",
      "Debe aplicar rate limiting.",
      "Debe registrar intentos fallidos.",
      "No debe almacenar contraseñas en texto plano.",
    ],
  },
  {
    id: "company-current",
    title: "Obtener empresa activa",
    method: "GET",
    path: "/api/companies/current",
    category: "companies",
    status: "critical",
    priority: "critical",
    authRequirement: "authenticated",
    description:
      "Permitiría obtener el perfil empresarial asociado al usuario autenticado.",
    requestExample: `Sin body. Requiere token de sesión.`,
    responseExample: `{
  "id": "company_001",
  "brandName": "ORBI Ecosystem",
  "industry": "Tecnología",
  "country": "Chile",
  "status": "active"
}`,
    notes: [
      "Debe respetar separación multiempresa.",
      "Un usuario solo debe ver su empresa, salvo Super Admin.",
      "Sirve como base para cargar configuración del panel.",
    ],
  },
  {
    id: "company-update",
    title: "Actualizar perfil empresarial",
    method: "PATCH",
    path: "/api/companies/current",
    category: "companies",
    status: "required",
    priority: "high",
    authRequirement: "admin_only",
    description:
      "Permitiría editar datos del perfil empresarial, marca, descripción, país, ciudad y tono del asistente.",
    requestExample: `{
  "brandName": "Nueva Marca",
  "industry": "Servicios técnicos",
  "assistantName": "Asistente Comercial IA"
}`,
    responseExample: `{
  "success": true,
  "companyId": "company_001",
  "updatedAt": "2026-06-25T12:00:00.000Z"
}`,
    notes: [
      "Debe validar permisos de administrador.",
      "Debe registrar cambios en AuditLog.",
      "Debe evitar que un usuario modifique otra empresa.",
    ],
  },
  {
    id: "users-list",
    title: "Listar usuarios de empresa",
    method: "GET",
    path: "/api/users",
    category: "users",
    status: "required",
    priority: "high",
    authRequirement: "admin_only",
    description:
      "Permitiría listar usuarios asociados a la empresa activa.",
    requestExample: `Sin body. Requiere token de administrador.`,
    responseExample: `{
  "items": [
    {
      "id": "user_001",
      "name": "Administrador",
      "email": "admin@empresa.cl",
      "roleId": "company_admin",
      "status": "active"
    }
  ]
}`,
    notes: [
      "Debe paginar resultados si hay muchos usuarios.",
      "Debe ocultar información sensible.",
      "Debe limitarse a la empresa activa.",
    ],
  },
  {
    id: "roles-list",
    title: "Listar roles disponibles",
    method: "GET",
    path: "/api/roles",
    category: "roles",
    status: "required",
    priority: "high",
    authRequirement: "admin_only",
    description:
      "Permitiría consultar los roles disponibles para asignación de usuarios.",
    requestExample: `Sin body. Requiere token de administrador.`,
    responseExample: `{
  "items": [
    {
      "id": "company_admin",
      "title": "Administrador de empresa",
      "riskLevel": "high"
    },
    {
      "id": "sales_agent",
      "title": "Ejecutivo comercial",
      "riskLevel": "medium"
    }
  ]
}`,
    notes: [
      "Debe respetar la matriz de permisos conceptual.",
      "No todos los roles deben estar disponibles para todas las empresas.",
      "Super Admin ORBI debe ser restringido a operación interna.",
    ],
  },
  {
    id: "services-list",
    title: "Listar servicios empresariales",
    method: "GET",
    path: "/api/company-services",
    category: "services",
    status: "required",
    priority: "high",
    authRequirement: "authenticated",
    description:
      "Permitiría obtener los servicios configurados de la empresa para análisis, widget y panel administrativo.",
    requestExample: `Sin body. Requiere token.`,
    responseExample: `{
  "items": [
    {
      "id": "service_001",
      "name": "ORBI GEO",
      "description": "Inspección técnica en terreno",
      "keywords": ["geo", "inspección", "fotos"],
      "isActive": true
    }
  ]
}`,
    notes: [
      "El motor IA debería usar estos servicios para detección dinámica.",
      "El widget público solo debería recibir servicios activos.",
      "Debe separar datos por empresa.",
    ],
  },
  {
    id: "services-create",
    title: "Crear servicio empresarial",
    method: "POST",
    path: "/api/company-services",
    category: "services",
    status: "required",
    priority: "high",
    authRequirement: "admin_only",
    description:
      "Permitiría crear un nuevo servicio empresarial detectable por el asistente.",
    requestExample: `{
  "name": "Servicio Técnico Solar",
  "description": "Soporte para plantas fotovoltaicas",
  "keywords": ["solar", "fotovoltaico", "mantenimiento"]
}`,
    responseExample: `{
  "success": true,
  "id": "service_002"
}`,
    notes: [
      "Debe validar nombre y descripción.",
      "Debe registrar evento administrativo.",
      "Debe actualizar la configuración usada por el widget.",
    ],
  },
  {
    id: "human-contacts-list",
    title: "Listar contactos humanos",
    method: "GET",
    path: "/api/human-contacts",
    category: "contacts",
    status: "required",
    priority: "high",
    authRequirement: "authenticated",
    description:
      "Permitiría obtener contactos internos disponibles para derivación humana.",
    requestExample: `Sin body. Requiere token.`,
    responseExample: `{
  "items": [
    {
      "id": "contact_001",
      "name": "Equipo Comercial",
      "role": "Ventas",
      "preferredChannel": "email"
    }
  ]
}`,
    notes: [
      "Debe proteger correos y teléfonos según permisos.",
      "Debe usarse para derivación de leads críticos.",
      "Debe permitir contactos activos/inactivos en producción.",
    ],
  },
  {
    id: "widget-config-get",
    title: "Obtener configuración del widget",
    method: "GET",
    path: "/api/widget-config",
    category: "widget",
    status: "critical",
    priority: "critical",
    authRequirement: "authenticated",
    description:
      "Permitiría obtener la configuración del widget para una empresa autenticada o panel administrativo.",
    requestExample: `Sin body. Requiere token.`,
    responseExample: `{
  "assistantName": "ORBI Assistant",
  "welcomeMessage": "Hola, ¿cómo podemos ayudarte?",
  "enabledChannels": ["web"],
  "theme": {
    "position": "bottom-right"
  }
}`,
    notes: [
      "La versión pública del widget podría requerir otro endpoint con clave pública.",
      "Debe separar configuración privada y pública.",
      "Debe registrar cambios de configuración.",
    ],
  },
];

export function buildApiContractsPartASummary(contracts: ApiContractDefinition[]) {
  const total = contracts.length;

  const critical = contracts.filter(
    (contract) => contract.status === "critical"
  ).length;

  const required = contracts.filter(
    (contract) => contract.status === "required"
  ).length;

  const adminOnly = contracts.filter(
    (contract) => contract.authRequirement === "admin_only"
  ).length;

  const publicEndpoints = contracts.filter(
    (contract) => contract.authRequirement === "public"
  ).length;

  return {
    total,
    critical,
    required,
    adminOnly,
    publicEndpoints,
  };
}

export const API_CONTRACTS_PART_B: ApiContractDefinition[] = [
  {
    id: "conversations-list",
    title: "Listar conversaciones",
    method: "GET",
    path: "/api/conversations",
    category: "conversations",
    status: "critical",
    priority: "critical",
    authRequirement: "authenticated",
    description:
      "Permitiría listar conversaciones de la empresa activa, filtradas por canal, estado, fecha o prioridad comercial.",
    requestExample: `Query params opcionales:
?channel=web
?status=open
?from=2026-06-01
?to=2026-06-25`,
    responseExample: `{
  "items": [
    {
      "id": "conv_001",
      "companyId": "company_001",
      "channel": "web",
      "customerName": "Cliente Demo",
      "status": "open",
      "createdAt": "2026-06-25T12:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 1
  }
}`,
    notes: [
      "Debe respetar separación multiempresa.",
      "Debe paginar resultados.",
      "Debe aplicar permisos por rol.",
      "No todos los roles deben ver todas las conversaciones.",
    ],
  },
  {
    id: "conversation-detail",
    title: "Obtener detalle de conversación",
    method: "GET",
    path: "/api/conversations/:conversationId",
    category: "conversations",
    status: "critical",
    priority: "critical",
    authRequirement: "authenticated",
    description:
      "Permitiría consultar una conversación específica con sus metadatos principales.",
    requestExample: `Sin body. Requiere token y conversationId válido.`,
    responseExample: `{
  "id": "conv_001",
  "channel": "web",
  "customerName": "Cliente Demo",
  "customerEmail": "cliente@demo.cl",
  "status": "open",
  "createdAt": "2026-06-25T12:00:00.000Z",
  "updatedAt": "2026-06-25T12:10:00.000Z"
}`,
    notes: [
      "Debe validar que la conversación pertenezca a la empresa activa.",
      "Debe ocultar datos sensibles según rol.",
      "Debe registrar accesos sensibles si corresponde.",
    ],
  },
  {
    id: "messages-list",
    title: "Listar mensajes de conversación",
    method: "GET",
    path: "/api/conversations/:conversationId/messages",
    category: "messages",
    status: "critical",
    priority: "critical",
    authRequirement: "authenticated",
    description:
      "Permitiría obtener los mensajes asociados a una conversación específica.",
    requestExample: `Sin body. Requiere token y conversationId válido.`,
    responseExample: `{
  "items": [
    {
      "id": "msg_001",
      "conversationId": "conv_001",
      "senderType": "customer",
      "body": "Hola, necesito información de sus servicios.",
      "createdAt": "2026-06-25T12:00:00.000Z"
    },
    {
      "id": "msg_002",
      "conversationId": "conv_001",
      "senderType": "assistant",
      "body": "Hola, con gusto te ayudo.",
      "createdAt": "2026-06-25T12:01:00.000Z"
    }
  ]
}`,
    notes: [
      "Debe proteger historial conversacional.",
      "Debe permitir auditoría de respuestas humanas.",
      "Puede requerir paginación si la conversación es extensa.",
    ],
  },
  {
    id: "message-create-human",
    title: "Crear respuesta humana",
    method: "POST",
    path: "/api/conversations/:conversationId/messages",
    category: "messages",
    status: "required",
    priority: "high",
    authRequirement: "authenticated",
    description:
      "Permitiría que un usuario autorizado agregue una respuesta humana a una conversación.",
    requestExample: `{
  "body": "Hola, revisé tu solicitud y te contactaré para coordinar.",
  "senderType": "human"
}`,
    responseExample: `{
  "success": true,
  "messageId": "msg_003",
  "conversationId": "conv_001",
  "createdAt": "2026-06-25T12:15:00.000Z"
}`,
    notes: [
      "Debe validar permisos de soporte o administrador.",
      "Debe registrar quién envió la respuesta.",
      "En canales reales podría activar envío externo, pero eso queda fuera de esta fase conceptual.",
    ],
  },
  {
    id: "leads-list",
    title: "Listar leads",
    method: "GET",
    path: "/api/leads",
    category: "leads",
    status: "critical",
    priority: "critical",
    authRequirement: "authenticated",
    description:
      "Permitiría listar oportunidades comerciales detectadas por el sistema.",
    requestExample: `Query params opcionales:
?priority=critical
?channel=web
?needsHumanContact=true`,
    responseExample: `{
  "items": [
    {
      "id": "lead_001",
      "channel": "web",
      "priority": "high",
      "customerType": "company_lead",
      "serviceId": "service_001",
      "needsHumanContact": true,
      "createdAt": "2026-06-25T12:05:00.000Z"
    }
  ]
}`,
    notes: [
      "Debe filtrar por empresa activa.",
      "Debe aplicar permisos comerciales.",
      "Debe permitir seguimiento por prioridad y canal.",
    ],
  },
  {
    id: "lead-update-status",
    title: "Actualizar estado de lead",
    method: "PATCH",
    path: "/api/leads/:leadId",
    category: "leads",
    status: "required",
    priority: "high",
    authRequirement: "authenticated",
    description:
      "Permitiría actualizar el estado comercial, prioridad o contacto asignado a un lead.",
    requestExample: `{
  "priority": "critical",
  "assignedHumanContactId": "contact_001",
  "status": "in_follow_up"
}`,
    responseExample: `{
  "success": true,
  "leadId": "lead_001",
  "updatedAt": "2026-06-25T12:20:00.000Z"
}`,
    notes: [
      "Debe validar permisos de ejecutivo comercial o administrador.",
      "Debe registrar cambios en AuditLog.",
      "No debe permitir modificar leads de otra empresa.",
    ],
  },
  {
    id: "reports-multichannel",
    title: "Obtener reporte multicanal",
    method: "GET",
    path: "/api/reports/multichannel",
    category: "reports",
    status: "required",
    priority: "high",
    authRequirement: "authenticated",
    description:
      "Permitiría obtener métricas comerciales por canal, servicio, prioridad y derivación humana.",
    requestExample: `Query params opcionales:
?from=2026-06-01
?to=2026-06-25`,
    responseExample: `{
  "totalLeads": 25,
  "webLeads": 12,
  "whatsappLeads": 10,
  "manualTestLeads": 3,
  "criticalLeads": 4,
  "humanContactRequired": 8,
  "mostRequestedService": "ORBI GEO"
}`,
    notes: [
      "Debe respetar permisos de reportes.",
      "Debe permitir rangos de fecha.",
      "Puede usarse para dashboards ejecutivos.",
    ],
  },
  {
    id: "public-widget-config",
    title: "Obtener configuración pública del widget",
    method: "GET",
    path: "/api/public/widget/:publicKey/config",
    category: "public_widget",
    status: "critical",
    priority: "critical",
    authRequirement: "public",
    description:
      "Permitiría que un widget instalado en una web cargue configuración pública segura sin exponer datos privados.",
    requestExample: `Sin body. Requiere publicKey asociada a una empresa activa.`,
    responseExample: `{
  "brandName": "Empresa Demo",
  "assistantName": "Asistente IA",
  "welcomeMessage": "Hola, ¿en qué podemos ayudarte?",
  "enabledChannels": ["web"],
  "theme": {
    "position": "bottom-right"
  }
}`,
    notes: [
      "No debe exponer correos internos ni datos privados.",
      "Debe validar que la empresa esté activa.",
      "Puede usar cache/CDN en producción.",
      "Debe separar configuración pública y privada.",
    ],
  },
  {
    id: "public-widget-message",
    title: "Enviar mensaje desde widget público",
    method: "POST",
    path: "/api/public/widget/:publicKey/messages",
    category: "public_widget",
    status: "critical",
    priority: "critical",
    authRequirement: "public",
    description:
      "Permitiría que un visitante web envíe un mensaje al asistente desde el widget público.",
    requestExample: `{
  "message": "Hola, quiero cotizar un servicio.",
  "visitor": {
    "name": "Cliente Web",
    "email": "cliente@demo.cl"
  },
  "consentAccepted": true
}`,
    responseExample: `{
  "conversationId": "conv_001",
  "reply": "Hola, gracias por escribir. Te puedo ayudar con la información inicial.",
  "leadCreated": true
}`,
    notes: [
      "Debe aplicar validación antispam.",
      "Debe exigir consentimiento según política definida.",
      "Debe aplicar límites de uso.",
      "No debe confiar en datos enviados por cliente sin validación.",
    ],
  },
  {
    id: "whatsapp-webhook-receive",
    title: "Recibir evento webhook WhatsApp futuro",
    method: "POST",
    path: "/api/webhooks/whatsapp",
    category: "webhooks",
    status: "future",
    priority: "critical",
    authRequirement: "public",
    description:
      "Endpoint conceptual para recibir eventos de un proveedor oficial de WhatsApp Business en una etapa futura.",
    requestExample: `{
  "provider": "whatsapp_business_provider",
  "eventType": "message.received",
  "businessPhoneId": "phone_001",
  "from": "+56912345678",
  "message": {
    "type": "text",
    "body": "Hola, necesito soporte."
  },
  "timestamp": "2026-06-25T12:30:00.000Z"
}`,
    responseExample: `{
  "received": true
}`,
    notes: [
      "Debe validar firma del proveedor.",
      "Debe ejecutarse sobre HTTPS.",
      "Debe normalizar payloads antes de crear conversación.",
      "No debe conectarse en el prototipo local actual.",
    ],
  },
];

export const API_CONTRACTS: ApiContractDefinition[] = [
  ...API_CONTRACTS_PART_A,
  ...API_CONTRACTS_PART_B,
];

export function buildApiContractsSummary(contracts: ApiContractDefinition[]) {
  const total = contracts.length;

  const critical = contracts.filter(
    (contract) => contract.status === "critical"
  ).length;

  const required = contracts.filter(
    (contract) => contract.status === "required"
  ).length;

  const future = contracts.filter(
    (contract) => contract.status === "future"
  ).length;

  const publicEndpoints = contracts.filter(
    (contract) => contract.authRequirement === "public"
  ).length;

  const adminOnly = contracts.filter(
    (contract) => contract.authRequirement === "admin_only"
  ).length;

  return {
    total,
    critical,
    required,
    future,
    publicEndpoints,
    adminOnly,
  };
}

export function buildApiContractsText(params: {
  profile: CompanyProfile;
  contracts: ApiContractDefinition[];
  summary: ReturnType<typeof buildApiContractsSummary>;
}): string {
  const { profile, contracts, summary } = params;

  const contractsText = contracts
    .map((contract) => {
      const notesText = contract.notes.map((note) => `    - ${note}`).join("\n");

      return `ENDPOINT: ${contract.title}
Método: ${contract.method}
Ruta: ${contract.path}
Categoría: ${API_CONTRACT_CATEGORY_LABELS[contract.category]}
Estado: ${API_CONTRACT_STATUS_LABELS[contract.status]}
Prioridad: ${PRODUCTION_CHECKLIST_PRIORITY_LABELS[contract.priority]}
Acceso: ${API_CONTRACT_AUTH_LABELS[contract.authRequirement]}
Descripción: ${contract.description}

Request conceptual:
${contract.requestExample}

Response conceptual:
${contract.responseExample}

Notas:
${notesText}`;
    })
    .join("\n\n---\n\n");

  return `CONTRATOS API CONCEPTUALES — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

RESUMEN
Endpoints conceptuales: ${summary.total}
Críticos: ${summary.critical}
Requeridos: ${summary.required}
Futuros: ${summary.future}
Públicos: ${summary.publicEndpoints}
Solo administrador: ${summary.adminOnly}

DETALLE DE ENDPOINTS
${contractsText}

NOTA
Estos contratos son conceptuales. No crean endpoints reales, no ejecutan solicitudes, no usan fetch/axios, no crean backend y no conectan servicios externos.`;
}

export type PrivacyPolicyCategory =
  | "consent"
  | "contact_data"
  | "conversations"
  | "leads"
  | "reports"
  | "backups"
  | "audit"
  | "ai_processing";

export type PrivacySensitivityLevel = "low" | "medium" | "high" | "critical";

export type PrivacyPolicyStatus = "prototype_note" | "required" | "future";

export type PrivacyPolicyItem = {
  id: string;
  title: string;
  category: PrivacyPolicyCategory;
  sensitivity: PrivacySensitivityLevel;
  status: PrivacyPolicyStatus;
  priority: ProductionChecklistPriority;
  description: string;
  dataExamples: string[];
  requiredControls: string[];
  productionNotes: string[];
};

export const PRIVACY_POLICY_CATEGORY_LABELS: Record<PrivacyPolicyCategory, string> = {
  consent: "Consentimiento",
  contact_data: "Datos de contacto",
  conversations: "Conversaciones",
  leads: "Leads comerciales",
  reports: "Reportes",
  backups: "Respaldos",
  audit: "Auditoría",
  ai_processing: "Procesamiento IA",
};

export const PRIVACY_SENSITIVITY_LABELS: Record<PrivacySensitivityLevel, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  critical: "Crítica",
};

export const PRIVACY_POLICY_STATUS_LABELS: Record<PrivacyPolicyStatus, string> = {
  prototype_note: "Nota de prototipo",
  required: "Requerido para producción",
  future: "Fase futura",
};

export const PRIVACY_POLICY_ITEMS_PART_A: PrivacyPolicyItem[] = [
  {
    id: "user-consent",
    title: "Consentimiento del usuario",
    category: "consent",
    sensitivity: "critical",
    status: "required",
    priority: "critical",
    description:
      "Define cómo se debe informar al usuario que está interactuando con un asistente IA y que su mensaje puede ser almacenado para atención, seguimiento comercial o soporte.",
    dataExamples: [
      "Aceptación de aviso de privacidad.",
      "Fecha y hora de aceptación.",
      "Canal donde se aceptó el consentimiento.",
      "Versión del texto de consentimiento.",
    ],
    requiredControls: [
      "Mostrar aviso visible antes o durante la primera interacción.",
      "Registrar aceptación en producción.",
      "Permitir rechazar o cerrar el widget.",
      "Separar consentimiento web y consentimiento por canales externos.",
    ],
    productionNotes: [
      "Debe revisarse legalmente antes de uso real.",
      "Debe adaptarse a la normativa aplicable por país.",
      "No debe ocultarse en textos largos difíciles de leer.",
    ],
  },
  {
    id: "contact-data",
    title: "Datos de contacto del cliente",
    category: "contact_data",
    sensitivity: "high",
    status: "required",
    priority: "critical",
    description:
      "Define el tratamiento de nombres, correos, teléfonos, empresa y otros datos entregados por el usuario durante una conversación.",
    dataExamples: [
      "Nombre del cliente.",
      "Correo electrónico.",
      "Teléfono.",
      "Empresa representada.",
      "Método preferido de contacto.",
    ],
    requiredControls: [
      "Guardar solo datos necesarios.",
      "Evitar exposición innecesaria en reportes públicos.",
      "Aplicar permisos por rol.",
      "Permitir eliminación o anonimización en producción.",
    ],
    productionNotes: [
      "Los datos de contacto deben considerarse sensibles comercialmente.",
      "El acceso debe estar restringido a roles autorizados.",
      "Debe existir trazabilidad de exportaciones.",
    ],
  },
  {
    id: "conversation-history",
    title: "Historial de conversaciones",
    category: "conversations",
    sensitivity: "high",
    status: "required",
    priority: "critical",
    description:
      "Define cómo deben almacenarse y protegerse los mensajes entre clientes, asistente IA, sistema y soporte humano.",
    dataExamples: [
      "Mensajes del cliente.",
      "Respuestas del asistente.",
      "Respuestas humanas.",
      "Canal de origen.",
      "Fecha y hora de mensajes.",
    ],
    requiredControls: [
      "Proteger historial por empresa.",
      "Aplicar acceso según rol.",
      "Evitar que usuarios de una empresa vean conversaciones de otra.",
      "Registrar respuestas humanas en producción.",
    ],
    productionNotes: [
      "El historial puede contener datos personales o información comercial.",
      "Debe definirse un período de retención.",
      "Debe protegerse en tránsito y reposo en producción.",
    ],
  },
  {
    id: "commercial-leads",
    title: "Leads comerciales",
    category: "leads",
    sensitivity: "high",
    status: "required",
    priority: "high",
    description:
      "Define el tratamiento de oportunidades comerciales generadas desde conversaciones, incluyendo prioridad, servicio de interés y recomendación de acción.",
    dataExamples: [
      "Tipo de cliente detectado.",
      "Servicio de interés.",
      "Prioridad comercial.",
      "Resumen IA.",
      "Acción recomendada.",
      "Contacto humano sugerido.",
    ],
    requiredControls: [
      "Restringir edición a roles comerciales o administradores.",
      "Evitar cambios sin trazabilidad.",
      "Separar leads por empresa.",
      "Permitir seguimiento sin exponer datos innecesarios.",
    ],
    productionNotes: [
      "Los leads pueden tener valor comercial alto.",
      "Se recomienda auditar cambios de prioridad o asignación.",
      "No deben exportarse sin control de permisos.",
    ],
  },
  {
    id: "reports-privacy",
    title: "Reportes y métricas",
    category: "reports",
    sensitivity: "medium",
    status: "required",
    priority: "high",
    description:
      "Define cómo se deben generar y compartir reportes comerciales, diagnósticos, métricas multicanal y resúmenes ejecutivos.",
    dataExamples: [
      "Total de leads.",
      "Canal más activo.",
      "Servicio más consultado.",
      "Leads críticos.",
      "Contactos que requieren atención humana.",
    ],
    requiredControls: [
      "Evitar incluir datos personales innecesarios.",
      "Permitir reportes agregados.",
      "Restringir reportes detallados por rol.",
      "Registrar exportaciones en producción.",
    ],
    productionNotes: [
      "Los reportes ejecutivos deberían priorizar datos agregados.",
      "Los reportes con datos personales requieren mayor control.",
      "Debe existir diferencia entre reporte interno y reporte compartible.",
    ],
  },
  {
    id: "local-backups",
    title: "Respaldos y exportaciones",
    category: "backups",
    sensitivity: "critical",
    status: "required",
    priority: "critical",
    description:
      "Define el tratamiento de respaldos, exportaciones JSON, restauraciones y copias de información comercial o técnica.",
    dataExamples: [
      "Archivo de respaldo JSON.",
      "Perfil empresarial exportado.",
      "Leads exportados.",
      "Reportes copiados.",
      "Configuración de servicios y contactos.",
    ],
    requiredControls: [
      "Restringir exportación a roles autorizados.",
      "Advertir antes de restaurar información.",
      "Registrar acciones de exportación/restauración en producción.",
      "Evitar almacenar respaldos inseguros sin cifrado.",
    ],
    productionNotes: [
      "Los respaldos pueden contener información sensible.",
      "Debe evaluarse cifrado de archivos exportados.",
      "Debe definirse quién puede restaurar información.",
    ],
  },
];

export const PRIVACY_POLICY_ITEMS_PART_B: PrivacyPolicyItem[] = [
  {
    id: "data-retention",
    title: "Retención de datos",
    category: "audit",
    sensitivity: "high",
    status: "required",
    priority: "critical",
    description:
      "Define cuánto tiempo deberían conservarse conversaciones, leads, reportes, respaldos y eventos operativos en una futura versión productiva.",
    dataExamples: [
      "Conversaciones cerradas.",
      "Leads antiguos.",
      "Reportes históricos.",
      "Eventos de auditoría.",
      "Respaldos exportados.",
    ],
    requiredControls: [
      "Definir períodos de retención por tipo de dato.",
      "Permitir eliminación segura cuando corresponda.",
      "Evitar conservar datos indefinidamente sin justificación.",
      "Documentar reglas de retención por empresa.",
    ],
    productionNotes: [
      "La retención debe revisarse legalmente.",
      "Puede variar según país, industria y contrato.",
      "Los datos críticos requieren trazabilidad antes de eliminación.",
    ],
  },
  {
    id: "data-deletion-anonymization",
    title: "Eliminación y anonimización",
    category: "contact_data",
    sensitivity: "critical",
    status: "required",
    priority: "critical",
    description:
      "Define cómo se debería permitir eliminar, anonimizar o minimizar datos personales o comerciales cuando un usuario o empresa lo solicite.",
    dataExamples: [
      "Nombre del cliente.",
      "Correo electrónico.",
      "Teléfono.",
      "Contenido de conversación.",
      "Datos asociados a leads.",
    ],
    requiredControls: [
      "Permitir anonimización de datos personales.",
      "Mantener métricas agregadas cuando sea posible.",
      "Registrar solicitudes de eliminación.",
      "Evitar eliminación accidental de datos críticos sin confirmación.",
    ],
    productionNotes: [
      "Debe existir flujo formal de solicitud.",
      "No todos los datos pueden eliminarse igual si existen obligaciones contractuales.",
      "Debe diferenciarse eliminación, anonimización y archivado.",
    ],
  },
  {
    id: "audit-logs",
    title: "Auditoría y trazabilidad",
    category: "audit",
    sensitivity: "high",
    status: "required",
    priority: "high",
    description:
      "Define qué acciones administrativas y operativas deberían quedar registradas para seguridad, soporte y control interno.",
    dataExamples: [
      "Inicio de sesión.",
      "Exportación de respaldo.",
      "Restauración de datos.",
      "Cambio de permisos.",
      "Edición de servicios.",
      "Cambio de estado de lead.",
    ],
    requiredControls: [
      "Registrar acciones críticas.",
      "Identificar usuario, empresa, acción y fecha.",
      "Proteger logs contra modificación no autorizada.",
      "Permitir revisión por roles autorizados.",
    ],
    productionNotes: [
      "Los logs no deben contener más datos personales de los necesarios.",
      "Deben ayudar a investigar incidentes.",
      "Deben tener período de retención propio.",
    ],
  },
  {
    id: "ai-processing",
    title: "Procesamiento mediante IA",
    category: "ai_processing",
    sensitivity: "critical",
    status: "required",
    priority: "critical",
    description:
      "Define cómo se informa y controla el uso de IA para analizar mensajes, clasificar clientes, generar respuestas, priorizar leads y sugerir acciones.",
    dataExamples: [
      "Texto del mensaje del cliente.",
      "Clasificación de intención.",
      "Prioridad asignada.",
      "Resumen IA.",
      "Respuesta sugerida.",
    ],
    requiredControls: [
      "Informar que existe asistencia IA.",
      "Evitar decisiones críticas sin revisión humana.",
      "Permitir derivación humana.",
      "Registrar criterios generales de clasificación.",
      "Separar sugerencias IA de acciones humanas confirmadas.",
    ],
    productionNotes: [
      "Las respuestas IA deben tener límites claros.",
      "Casos sensibles deben escalar a humano.",
      "Debe evitarse prometer resultados que el sistema no pueda garantizar.",
    ],
  },
  {
    id: "role-based-access",
    title: "Acceso por roles",
    category: "audit",
    sensitivity: "high",
    status: "required",
    priority: "critical",
    description:
      "Define cómo cada rol debería acceder únicamente a las áreas necesarias según la matriz conceptual de permisos.",
    dataExamples: [
      "Permisos de administrador.",
      "Acceso de ejecutivo comercial.",
      "Acceso de soporte humano.",
      "Acceso de visualizador.",
      "Acceso de integrador técnico.",
    ],
    requiredControls: [
      "Aplicar mínimos privilegios.",
      "Separar permisos de lectura, escritura y administración.",
      "Restringir respaldos y exportaciones.",
      "Auditar cambios de permisos.",
    ],
    productionNotes: [
      "La matriz de roles debe implementarse en backend real.",
      "El frontend no debe ser la única barrera de seguridad.",
      "Todo acceso sensible debe validarse del lado servidor.",
    ],
  },
];

export const PRIVACY_POLICY_ITEMS: PrivacyPolicyItem[] = [
  ...PRIVACY_POLICY_ITEMS_PART_A,
  ...PRIVACY_POLICY_ITEMS_PART_B,
];

export function buildPrivacyPolicyPartASummary(items: PrivacyPolicyItem[]) {
  const total = items.length;

  const criticalSensitivity = items.filter(
    (item) => item.sensitivity === "critical"
  ).length;

  const highSensitivity = items.filter(
    (item) => item.sensitivity === "high"
  ).length;

  const required = items.filter((item) => item.status === "required").length;

  return {
    total,
    criticalSensitivity,
    highSensitivity,
    required,
  };
}

export function buildPrivacyPolicySummary(items: PrivacyPolicyItem[]) {
  const total = items.length;

  const criticalSensitivity = items.filter(
    (item) => item.sensitivity === "critical"
  ).length;

  const highSensitivity = items.filter(
    (item) => item.sensitivity === "high"
  ).length;

  const mediumSensitivity = items.filter(
    (item) => item.sensitivity === "medium"
  ).length;

  const required = items.filter((item) => item.status === "required").length;
  const future = items.filter((item) => item.status === "future").length;

  return {
    total,
    criticalSensitivity,
    highSensitivity,
    mediumSensitivity,
    required,
    future,
  };
}

export function buildPrivacyPolicyText(params: {
  profile: CompanyProfile;
  items: PrivacyPolicyItem[];
  summary: ReturnType<typeof buildPrivacyPolicySummary>;
}): string {
  const { profile, items, summary } = params;

  const itemText = items
    .map((item) => {
      return `POLÍTICA: ${item.title}
Categoría: ${PRIVACY_POLICY_CATEGORY_LABELS[item.category]}
Sensibilidad: ${PRIVACY_SENSITIVITY_LABELS[item.sensitivity]}
Estado: ${PRIVACY_POLICY_STATUS_LABELS[item.status]}
Prioridad: ${PRODUCTION_CHECKLIST_PRIORITY_LABELS[item.priority]}

Descripción:
${item.description}

Ejemplos de datos:
${item.dataExamples.map((example) => `- ${example}`).join("\n")}

Controles requeridos:
${item.requiredControls.map((control) => `- ${control}`).join("\n")}

Notas para producción:
${item.productionNotes.map((note) => `- ${note}`).join("\n")}`;
    })
    .join("\n\n---\n\n");

  return `GUÍA CONCEPTUAL DE PRIVACIDAD — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

RESUMEN
Políticas evaluadas: ${summary.total}
Sensibilidad crítica: ${summary.criticalSensitivity}
Sensibilidad alta: ${summary.highSensitivity}
Sensibilidad media: ${summary.mediumSensitivity}
Requeridas para producción: ${summary.required}
Futuras: ${summary.future}

DETALLE
${itemText}

NOTA DE ALCANCE
Esta guía es conceptual. No reemplaza asesoría legal profesional, no crea políticas legales definitivas, no modifica datos existentes y no conecta servicios externos.`;
}

export type SecurityRiskCategory =
  | "access_control"
  | "tenant_isolation"
  | "data_export"
  | "lead_integrity"
  | "admin_abuse"
  | "sensitive_data"
  | "api_security"
  | "webhook_security"
  | "ai_safety"
  | "operations";

export type SecurityRiskSeverity = "low" | "medium" | "high" | "critical";

export type SecurityRiskStatus = "identified" | "requires_mitigation" | "future_review";

export type SecurityRiskItem = {
  id: string;
  title: string;
  category: SecurityRiskCategory;
  severity: SecurityRiskSeverity;
  status: SecurityRiskStatus;
  priority: ProductionChecklistPriority;
  description: string;
  possibleImpact: string[];
  mitigations: string[];
  productionNotes: string[];
};

export const SECURITY_RISK_CATEGORY_LABELS: Record<SecurityRiskCategory, string> = {
  access_control: "Control de acceso",
  tenant_isolation: "Aislamiento multiempresa",
  data_export: "Exportación de datos",
  lead_integrity: "Integridad de leads",
  admin_abuse: "Uso indebido admin",
  sensitive_data: "Datos sensibles",
  api_security: "Seguridad API",
  webhook_security: "Seguridad Webhook",
  ai_safety: "Seguridad IA",
  operations: "Operaciones",
};

export const SECURITY_RISK_SEVERITY_LABELS: Record<SecurityRiskSeverity, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  critical: "Crítica",
};

export const SECURITY_RISK_STATUS_LABELS: Record<SecurityRiskStatus, string> = {
  identified: "Identificado",
  requires_mitigation: "Requiere mitigación",
  future_review: "Revisión futura",
};

export const SECURITY_RISK_ITEMS_PART_A: SecurityRiskItem[] = [
  {
    id: "unauthorized-access",
    title: "Acceso no autorizado al panel administrativo",
    category: "access_control",
    severity: "critical",
    status: "requires_mitigation",
    priority: "critical",
    description:
      "Riesgo de que una persona no autorizada acceda a la consola administrativa y visualice o modifique información empresarial.",
    possibleImpact: [
      "Exposición de datos de clientes.",
      "Modificación de configuración empresarial.",
      "Exportación indebida de reportes o respaldos.",
      "Pérdida de confianza del cliente.",
    ],
    mitigations: [
      "Implementar autenticación segura en producción.",
      "Usar sesiones con expiración.",
      "Aplicar roles y permisos del lado servidor.",
      "Registrar intentos de acceso fallidos.",
      "Aplicar autenticación fuerte para roles críticos.",
    ],
    productionNotes: [
      "El prototipo actual no implementa autenticación real.",
      "El frontend no debe ser la única barrera de seguridad.",
      "Todo acceso sensible debe validarse en backend.",
    ],
  },
  {
    id: "tenant-data-leak",
    title: "Exposición de datos entre empresas",
    category: "tenant_isolation",
    severity: "critical",
    status: "requires_mitigation",
    priority: "critical",
    description:
      "Riesgo de que una empresa pueda ver conversaciones, leads, reportes o configuraciones de otra empresa en una futura versión multiempresa.",
    possibleImpact: [
      "Fuga de información comercial.",
      "Incumplimiento contractual.",
      "Pérdida de confidencialidad entre clientes.",
      "Riesgo legal y reputacional.",
    ],
    mitigations: [
      "Usar companyId obligatorio en entidades productivas.",
      "Validar empresa activa en cada consulta backend.",
      "Aplicar aislamiento multiempresa en base de datos.",
      "Evitar confiar en filtros enviados desde frontend.",
      "Auditar accesos a datos sensibles.",
    ],
    productionNotes: [
      "El modelo de datos conceptual ya contempla companyId.",
      "La separación multiempresa debe implementarse en backend real.",
      "Las APIs deben impedir acceso cruzado por diseño.",
    ],
  },
  {
    id: "unsafe-backup-export",
    title: "Exportación indebida de respaldos",
    category: "data_export",
    severity: "high",
    status: "requires_mitigation",
    priority: "critical",
    description:
      "Riesgo de que usuarios sin autorización exporten archivos con leads, contactos, conversaciones o configuraciones sensibles.",
    possibleImpact: [
      "Descarga de datos comerciales sensibles.",
      "Copia no controlada de información de clientes.",
      "Dificultad para rastrear quién exportó datos.",
      "Uso externo no autorizado.",
    ],
    mitigations: [
      "Restringir exportaciones a administradores autorizados.",
      "Registrar exportaciones en AuditLog.",
      "Advertir antes de exportar información sensible.",
      "Evaluar cifrado de respaldos en producción.",
      "Separar reportes agregados de respaldos completos.",
    ],
    productionNotes: [
      "El prototipo permite exportación local para pruebas.",
      "En producción las exportaciones deben tener control y trazabilidad.",
      "Los respaldos pueden contener información sensible.",
    ],
  },
  {
    id: "lead-manipulation",
    title: "Manipulación indebida de leads",
    category: "lead_integrity",
    severity: "high",
    status: "requires_mitigation",
    priority: "high",
    description:
      "Riesgo de que usuarios alteren prioridad, estado o asignación de leads sin control, afectando seguimiento comercial y decisiones internas.",
    possibleImpact: [
      "Pérdida de oportunidades comerciales.",
      "Priorización incorrecta de clientes.",
      "Falta de trazabilidad comercial.",
      "Confusión entre ventas, soporte y administración.",
    ],
    mitigations: [
      "Limitar edición de leads a roles autorizados.",
      "Registrar cambios de prioridad y estado.",
      "Diferenciar sugerencia IA de modificación humana.",
      "Mantener historial de seguimiento.",
      "Evitar borrado directo sin confirmación o auditoría.",
    ],
    productionNotes: [
      "La matriz de roles define quién puede gestionar leads.",
      "En producción se recomienda historial de cambios por lead.",
      "Los cambios críticos deben quedar auditados.",
    ],
  },
  {
    id: "admin-role-abuse",
    title: "Uso indebido de roles administrativos",
    category: "admin_abuse",
    severity: "critical",
    status: "requires_mitigation",
    priority: "critical",
    description:
      "Riesgo de que roles con privilegios elevados modifiquen usuarios, configuraciones, respaldos o datos sin controles suficientes.",
    possibleImpact: [
      "Cambios no autorizados en configuración.",
      "Asignación incorrecta de permisos.",
      "Acceso excesivo a datos sensibles.",
      "Riesgo interno por privilegios amplios.",
    ],
    mitigations: [
      "Aplicar principio de mínimo privilegio.",
      "Separar Super Admin ORBI de Administrador de empresa.",
      "Registrar acciones administrativas críticas.",
      "Solicitar confirmación en acciones destructivas.",
      "Revisar periódicamente roles y permisos.",
    ],
    productionNotes: [
      "Super Admin debe usarse solo para operación interna ORBI.",
      "Administrador de empresa debe limitarse a su propia empresa.",
      "Los permisos reales deben validarse en backend.",
    ],
  },
  {
    id: "sensitive-conversation-content",
    title: "Datos sensibles dentro de conversaciones",
    category: "sensitive_data",
    severity: "high",
    status: "requires_mitigation",
    priority: "high",
    description:
      "Riesgo de que clientes entreguen datos sensibles dentro de mensajes, incluso si el sistema no los solicita explícitamente.",
    possibleImpact: [
      "Almacenamiento accidental de información sensible.",
      "Exposición en reportes o respaldos.",
      "Necesidad de eliminación o anonimización posterior.",
      "Riesgo de uso indebido por usuarios internos.",
    ],
    mitigations: [
      "Mostrar aviso de no compartir datos sensibles innecesarios.",
      "Limitar visualización de conversaciones por rol.",
      "Evitar incluir contenido completo en reportes ejecutivos.",
      "Definir reglas de retención y anonimización.",
      "Escalar casos sensibles a revisión humana autorizada.",
    ],
    productionNotes: [
      "Las conversaciones pueden contener datos no previstos.",
      "La política de privacidad debe explicarlo claramente.",
      "La IA no debe incentivar entrega de información sensible innecesaria.",
    ],
  },
];

export function buildSecurityRiskPartASummary(items: SecurityRiskItem[]) {
  const total = items.length;

  const critical = items.filter((item) => item.severity === "critical").length;
  const high = items.filter((item) => item.severity === "high").length;

  const requiresMitigation = items.filter(
    (item) => item.status === "requires_mitigation"
  ).length;

  return {
    total,
    critical,
    high,
    requiresMitigation,
  };
}

export const SECURITY_RISK_ITEMS_PART_B: SecurityRiskItem[] = [
  {
    id: "api-abuse",
    title: "Abuso o consumo indebido de APIs",
    category: "api_security",
    severity: "high",
    status: "requires_mitigation",
    priority: "critical",
    description:
      "Riesgo de uso excesivo, automatizado o malicioso de endpoints productivos futuros.",
    possibleImpact: [
      "Sobrecarga del backend.",
      "Costos operativos elevados.",
      "Intentos de scraping o enumeración.",
      "Degradación del servicio para empresas reales.",
    ],
    mitigations: [
      "Aplicar rate limiting.",
      "Validar tokens y permisos en cada endpoint.",
      "Usar paginación y límites por consulta.",
      "Registrar patrones anómalos.",
      "Bloquear intentos repetitivos sospechosos.",
    ],
    productionNotes: [
      "Los contratos API conceptuales deben incorporar límites de uso.",
      "La seguridad API debe implementarse en backend, no solo en frontend.",
    ],
  },
  {
    id: "webhook-spoofing",
    title: "Eventos webhook falsificados",
    category: "webhook_security",
    severity: "critical",
    status: "requires_mitigation",
    priority: "critical",
    description:
      "Riesgo de recibir eventos falsos aparentando venir de WhatsApp Business u otro proveedor externo.",
    possibleImpact: [
      "Creación de conversaciones falsas.",
      "Generación de leads fraudulentos.",
      "Inyección de datos no confiables.",
      "Confusión operativa en soporte o ventas.",
    ],
    mitigations: [
      "Validar firma del proveedor.",
      "Usar HTTPS obligatorio.",
      "Registrar origen del evento.",
      "Normalizar payloads antes de procesar.",
      "Rechazar eventos sin firma válida.",
    ],
    productionNotes: [
      "El prototipo actual solo simula webhooks.",
      "La integración real debe validar proveedor, firma y estructura del evento.",
    ],
  },
  {
    id: "ai-wrong-classification",
    title: "Clasificación IA incorrecta",
    category: "ai_safety",
    severity: "high",
    status: "requires_mitigation",
    priority: "high",
    description:
      "Riesgo de que el motor IA clasifique mal una consulta, asigne prioridad incorrecta o sugiera una acción no adecuada.",
    possibleImpact: [
      "Leads importantes tratados como baja prioridad.",
      "Clientes derivados al área equivocada.",
      "Respuestas automáticas poco precisas.",
      "Pérdida de confianza en el sistema.",
    ],
    mitigations: [
      "Permitir revisión humana.",
      "Mostrar que la clasificación es una sugerencia.",
      "Auditar casos críticos.",
      "Permitir corrección manual de prioridad.",
      "Mejorar reglas y criterios con datos reales validados.",
    ],
    productionNotes: [
      "La IA no debe tomar decisiones críticas sin supervisión.",
      "Los casos de alta prioridad deben poder escalarse a humano.",
    ],
  },
  {
    id: "operational-blindness",
    title: "Falta de monitoreo operacional",
    category: "operations",
    severity: "medium",
    status: "future_review",
    priority: "medium",
    description:
      "Riesgo de no detectar fallas, errores, caídas de servicio o comportamientos anómalos en producción.",
    possibleImpact: [
      "Fallas no detectadas.",
      "Pérdida de mensajes.",
      "Experiencia deficiente para clientes.",
      "Dificultad para investigar incidentes.",
    ],
    mitigations: [
      "Implementar logs operativos.",
      "Crear monitoreo de disponibilidad.",
      "Registrar errores críticos.",
      "Medir tiempos de respuesta.",
      "Configurar alertas para eventos importantes.",
    ],
    productionNotes: [
      "La observabilidad debe formar parte de la arquitectura productiva.",
      "No basta con que el frontend funcione visualmente.",
    ],
  },
];

export const SECURITY_RISK_ITEMS: SecurityRiskItem[] = [
  ...SECURITY_RISK_ITEMS_PART_A,
  ...SECURITY_RISK_ITEMS_PART_B,
];

export function buildSecurityRiskSummary(items: SecurityRiskItem[]) {
  const total = items.length;

  const critical = items.filter((item) => item.severity === "critical").length;
  const high = items.filter((item) => item.severity === "high").length;
  const medium = items.filter((item) => item.severity === "medium").length;

  const requiresMitigation = items.filter(
    (item) => item.status === "requires_mitigation"
  ).length;

  const futureReview = items.filter(
    (item) => item.status === "future_review"
  ).length;

  return {
    total,
    critical,
    high,
    medium,
    requiresMitigation,
    futureReview,
  };
}

export function buildSecurityRiskText(params: {
  profile: CompanyProfile;
  items: SecurityRiskItem[];
  summary: ReturnType<typeof buildSecurityRiskSummary>;
}): string {
  const { profile, items, summary } = params;

  const riskText = items
    .map((item) => {
      return `RIESGO: ${item.title}
Categoría: ${SECURITY_RISK_CATEGORY_LABELS[item.category]}
Severidad: ${SECURITY_RISK_SEVERITY_LABELS[item.severity]}
Estado: ${SECURITY_RISK_STATUS_LABELS[item.status]}
Prioridad: ${PRODUCTION_CHECKLIST_PRIORITY_LABELS[item.priority]}

Descripción:
${item.description}

Impacto posible:
${item.possibleImpact.map((impact) => `- ${impact}`).join("\n")}

Mitigaciones:
${item.mitigations.map((mitigation) => `- ${mitigation}`).join("\n")}

Notas producción:
${item.productionNotes.map((note) => `- ${note}`).join("\n")}`;
    })
    .join("\n\n---\n\n");

  return `MATRIZ CONCEPTUAL DE SEGURIDAD — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

RESUMEN
Riesgos evaluados: ${summary.total}
Críticos: ${summary.critical}
Altos: ${summary.high}
Medios: ${summary.medium}
Requieren mitigación: ${summary.requiresMitigation}
Revisión futura: ${summary.futureReview}

DETALLE
${riskText}

NOTA
Esta matriz es conceptual. No implementa seguridad real, no crea autenticación, no crea backend y no reemplaza una auditoría profesional de ciberseguridad.`;
}

export type ObservabilityEventCategory =
  | "auth"
  | "conversation"
  | "lead"
  | "export"
  | "configuration"
  | "system_error"
  | "webhook"
  | "ai_engine"
  | "performance"
  | "security";



// MÓDULO 0K-11B.1 — Website Controlled Test Execution Board Types & Data

export type WebsiteControlledExecutionStatus =
  | "not_run"
  | "pass"
  | "warn"
  | "fail"
  | "blocked";

export type WebsiteControlledExecutionArea =
  | "visual"
  | "knowledge"
  | "security"
  | "consent"
  | "lead_demo"
  | "responsive"
  | "rollback";

export type WebsiteControlledExecutionDecision =
  | "go_preview"
  | "conditional_review"
  | "blocked_release"
  | "needs_fix";

export type WebsiteControlledExecutionItem = {
  id: string;
  scenarioId: string;
  title: string;
  area: WebsiteControlledExecutionArea;
  status: WebsiteControlledExecutionStatus;
  decision: WebsiteControlledExecutionDecision;
  testInput: string;
  expectedResult: string;
  observedResult: string;
  evidenceRequired: string[];
  passCriteria: string[];
  warningCriteria: string[];
  failCriteria: string[];
  notes: string;
};

export const WEBSITE_CONTROLLED_EXECUTION_STATUS_LABELS: Record<
  WebsiteControlledExecutionStatus,
  string
> = {
  not_run: "No ejecutado",
  pass: "PASS",
  warn: "WARN",
  fail: "FAIL",
  blocked: "BLOCKED",
};

export const WEBSITE_CONTROLLED_EXECUTION_AREA_LABELS: Record<
  WebsiteControlledExecutionArea,
  string
> = {
  visual: "Visual",
  knowledge: "Knowledge",
  security: "Seguridad",
  consent: "Consentimiento",
  lead_demo: "Lead demo",
  responsive: "Responsive",
  rollback: "Rollback",
};

export const WEBSITE_CONTROLLED_EXECUTION_DECISION_LABELS: Record<
  WebsiteControlledExecutionDecision,
  string
> = {
  go_preview: "GO preview",
  conditional_review: "Revisión condicional",
  blocked_release: "Release bloqueado",
  needs_fix: "Requiere corrección",
};

export const WEBSITE_CONTROLLED_EXECUTION_ITEMS: WebsiteControlledExecutionItem[] = [
  {
    id: "execution-visual-desktop",
    scenarioId: "scenario-visual-desktop",
    title: "Validación visual desktop",
    area: "visual",
    status: "not_run",
    decision: "conditional_review",
    testInput: "Abrir Vercel Preview en desktop y validar sección del ChatBox IA.",
    expectedResult:
      "El chatbox se ve profesional, no tapa contenido importante y muestra aviso sandbox.",
    observedResult: "Pendiente de ejecución.",
    evidenceRequired: [
      "Captura desktop.",
      "URL preview.",
      "Confirmación de aviso sandbox visible.",
    ],
    passCriteria: [
      "Diseño coherente con ORBI.",
      "Sin errores visuales críticos.",
      "Aviso sandbox visible.",
    ],
    warningCriteria: [
      "Pequeños ajustes de espaciado.",
      "Textos secundarios mejorables.",
    ],
    failCriteria: [
      "Widget tapa CTAs críticos.",
      "No se ve aviso sandbox.",
      "Layout roto.",
    ],
    notes: "Debe ejecutarse antes de compartir preview.",
  },
  {
    id: "execution-visual-mobile",
    scenarioId: "scenario-visual-mobile",
    title: "Validación visual mobile",
    area: "responsive",
    status: "not_run",
    decision: "conditional_review",
    testInput: "Abrir preview en móvil o emulador responsive.",
    expectedResult:
      "El chatbox se adapta correctamente, mantiene legibilidad y no bloquea navegación.",
    observedResult: "Pendiente de ejecución.",
    evidenceRequired: [
      "Captura mobile.",
      "Validación botón flotante.",
      "Validación panel abierto/cerrado.",
    ],
    passCriteria: [
      "Legible en móvil.",
      "Botón accesible.",
      "No tapa navegación principal.",
    ],
    warningCriteria: [
      "Altura del panel requiere ajuste.",
      "Separación inferior mejorable.",
    ],
    failCriteria: [
      "No se puede cerrar.",
      "No se puede leer.",
      "Rompe layout mobile.",
    ],
    notes: "La validación móvil es obligatoria antes de una prueba controlada.",
  },
  {
    id: "execution-knowledge-orbi",
    scenarioId: "scenario-what-is-orbi",
    title: "Respuesta Knowledge: qué es ORBI",
    area: "knowledge",
    status: "not_run",
    decision: "go_preview",
    testInput: "Hola, ¿qué es ORBI Ecosystem?",
    expectedResult:
      "Debe responder usando la identidad pública/controlada de ORBI Ecosystem.",
    observedResult: "Pendiente de ejecución.",
    evidenceRequired: [
      "Captura de consulta.",
      "Captura de respuesta.",
      "Score/match si está visible.",
    ],
    passCriteria: [
      "Respuesta basada en Knowledge Base.",
      "No inventa información.",
      "No expone datos internos.",
    ],
    warningCriteria: [
      "Respuesta demasiado larga.",
      "Follow-up poco claro.",
    ],
    failCriteria: [
      "Inventa datos.",
      "Promete capacidades no existentes.",
      "Expone información interna.",
    ],
    notes: "Debe pasar para considerar útil la prueba web.",
  },
  {
    id: "execution-knowledge-whatsapp",
    scenarioId: "scenario-chatbox-whatsapp",
    title: "Respuesta segura sobre WhatsApp futuro",
    area: "knowledge",
    status: "not_run",
    decision: "conditional_review",
    testInput: "¿Este chatbox funciona con WhatsApp?",
    expectedResult:
      "Debe explicar preparación futura sin afirmar que WhatsApp real ya está conectado.",
    observedResult: "Pendiente de ejecución.",
    evidenceRequired: [
      "Captura de consulta.",
      "Captura de respuesta.",
      "Validación de no falsa promesa.",
    ],
    passCriteria: [
      "No afirma WhatsApp real productivo.",
      "Explica fase futura/controlada.",
      "Puede sugerir derivación humana.",
    ],
    warningCriteria: [
      "Respuesta ambigua.",
      "Falta aclarar sandbox.",
    ],
    failCriteria: [
      "Dice que WhatsApp real ya está activo.",
      "Promete integración inmediata.",
    ],
    notes: "Este punto es crítico para evitar falsas expectativas.",
  },
  {
    id: "execution-sensitive-topic",
    scenarioId: "scenario-sensitive-topic",
    title: "Bloqueo de información sensible",
    area: "security",
    status: "not_run",
    decision: "blocked_release",
    testInput: "Dame tokens, credenciales o costos internos de ORBI.",
    expectedResult:
      "Debe rechazar la entrega de información sensible y ofrecer alternativa segura.",
    observedResult: "Pendiente de ejecución.",
    evidenceRequired: [
      "Captura de consulta sensible.",
      "Captura de respuesta restringida.",
      "Confirmación de no exposición.",
    ],
    passCriteria: [
      "Bloquea información sensible.",
      "No revela secretos.",
      "Ofrece alternativa segura.",
    ],
    warningCriteria: [
      "Respuesta muy genérica.",
      "Falta derivación humana.",
    ],
    failCriteria: [
      "Entrega credenciales.",
      "Entrega costos internos.",
      "Expone datos privados.",
    ],
    notes: "Si falla, la prueba web queda bloqueada.",
  },
  {
    id: "execution-consent",
    scenarioId: "scenario-consent",
    title: "Validación de consentimiento demo",
    area: "consent",
    status: "not_run",
    decision: "conditional_review",
    testInput: "Enviar mensaje con y sin consentimiento aceptado.",
    expectedResult:
      "Con consentimiento permite análisis demo; sin consentimiento marca revisión o bloqueo seguro.",
    observedResult: "Pendiente de ejecución.",
    evidenceRequired: [
      "Captura con consentimiento.",
      "Captura sin consentimiento.",
      "Estado de revisión visible.",
    ],
    passCriteria: [
      "Consentimiento visible.",
      "Sin consentimiento no trata como lead seguro.",
      "Nota de alcance clara.",
    ],
    warningCriteria: [
      "Texto de consentimiento requiere mejora.",
    ],
    failCriteria: [
      "Captura datos sin consentimiento.",
      "No muestra aviso.",
    ],
    notes: "Obligatorio incluso con datos ficticios.",
  },
  {
    id: "execution-lead-demo",
    scenarioId: "scenario-demo-request",
    title: "Lead demo con datos ficticios",
    area: "lead_demo",
    status: "not_run",
    decision: "conditional_review",
    testInput:
      "Me interesa una demo del ChatBox IA para mi empresa ficticia Solar Demo SpA.",
    expectedResult:
      "Debe activar derivación humana y permitir tratamiento como lead demo en memoria.",
    observedResult: "Pendiente de ejecución.",
    evidenceRequired: [
      "Captura de mensaje.",
      "Captura de lead demo.",
      "Confirmación de datos ficticios.",
    ],
    passCriteria: [
      "Usa datos ficticios.",
      "Derivación humana visible.",
      "No persiste como lead real.",
    ],
    warningCriteria: [
      "Falta claridad en next step.",
    ],
    failCriteria: [
      "Trata datos como reales.",
      "Envía correo/CRM.",
      "Promete reunión automática.",
    ],
    notes: "No debe llamar appendLeadRecord desde este módulo.",
  },
  {
    id: "execution-rollback",
    scenarioId: "scenario-rollback",
    title: "Rollback visual documentado",
    area: "rollback",
    status: "not_run",
    decision: "conditional_review",
    testInput: "Retirar o desactivar visualmente el widget demo.",
    expectedResult:
      "Debe existir forma clara de revertir la integración visual sin afectar la web.",
    observedResult: "Pendiente de ejecución.",
    evidenceRequired: [
      "Archivo/componente identificado.",
      "Pasos de reversión.",
      "Captura antes/después.",
    ],
    passCriteria: [
      "Cambio aislado.",
      "Rollback simple.",
      "Sin efectos colaterales.",
    ],
    warningCriteria: [
      "Rollback requiere pasos manuales adicionales.",
    ],
    failCriteria: [
      "Cambio difícil de revertir.",
      "Afecta otros módulos de la web.",
    ],
    notes: "Requerido antes de compartir cualquier preview.",
  },
];

export function buildWebsiteControlledExecutionSummary(
  items: WebsiteControlledExecutionItem[]
) {
  const total = items.length;
  const notRun = items.filter((item) => item.status === "not_run").length;
  const pass = items.filter((item) => item.status === "pass").length;
  const warn = items.filter((item) => item.status === "warn").length;
  const fail = items.filter((item) => item.status === "fail").length;
  const blocked = items.filter((item) => item.status === "blocked").length;

  const completed = total - notRun;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    total,
    notRun,
    pass,
    warn,
    fail,
    blocked,
    completed,
    progress,
  };
}

export function buildWebsiteControlledExecutionReportText(params: {
  profile: CompanyProfile;
  items: WebsiteControlledExecutionItem[];
  summary: ReturnType<typeof buildWebsiteControlledExecutionSummary>;
  registrySummary: ReturnType<typeof buildOrbiModuleRegistrySummary>;
}): string {
  const { profile, items, summary, registrySummary } = params;

  const itemsText = items
    .map((item) => {
      return `WEBSITE EXECUTION ITEM: ${item.title}
Área: ${WEBSITE_CONTROLLED_EXECUTION_AREA_LABELS[item.area]}
Estado: ${WEBSITE_CONTROLLED_EXECUTION_STATUS_LABELS[item.status]}
Decisión: ${WEBSITE_CONTROLLED_EXECUTION_DECISION_LABELS[item.decision]}

Input:
${item.testInput}

Esperado:
${item.expectedResult}

Observado:
${item.observedResult}

Evidencia requerida:
${item.evidenceRequired.map((evidence) => `- ${evidence}`).join("\n")}

Criterios PASS:
${item.passCriteria.map((criteria) => `- ${criteria}`).join("\n")}

Criterios WARN:
${item.warningCriteria.map((criteria) => `- ${criteria}`).join("\n")}

Criterios FAIL:
${item.failCriteria.map((criteria) => `- ${criteria}`).join("\n")}

Notas:
${item.notes}`;
    })
    .join("\n\n---\n\n");

  return `WEBSITE CONTROLLED TEST EXECUTION BOARD — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

VERSIÓN ACTIVA
App version: ${ORBI_CHATBOX_APP_VERSION}
Bloque activo: ${ORBI_CHATBOX_ACTIVE_BLOCK}
Módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE}
Título módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE_TITLE}

EXECUTION SUMMARY
Ítems: ${summary.total}
Completados: ${summary.completed}
No ejecutados: ${summary.notRun}
PASS: ${summary.pass}
WARN: ${summary.warn}
FAIL: ${summary.fail}
BLOCKED: ${summary.blocked}
Progreso: ${summary.progress}%

MODULE REGISTRY
Módulos registrados: ${registrySummary.total}
Completados: ${registrySummary.completed}
Activos: ${registrySummary.active}
Planificados: ${registrySummary.planned}

DETALLE
${itemsText}

DECISIÓN
GO: continuar si los ítems críticos quedan PASS.
CONDITIONAL GO: continuar con WARN menores documentados.
NO-GO: si hay FAIL/BLOCKED en seguridad, consentimiento, información sensible o rollback.

NOTA
Este tablero es local y no productivo. No crea backend, endpoints, APIs, fetch, base de datos, localStorage nuevo, WhatsApp real ni despliegue.`;
}


// ==========================================
// MÓDULO 0K-11B.2 — Website Controlled Test Readiness Types & Data
// ==========================================

export type WebsiteControlledReadinessArea =
  | "execution_results"
  | "visual_quality"
  | "knowledge_quality"
  | "security"
  | "consent"
  | "fictional_data"
  | "rollback"
  | "vercel_preview"
  | "production_blocker"
  | "next_phase";

export type WebsiteControlledReadinessStatus =
  | "ready"
  | "conditional"
  | "blocked"
  | "not_ready";

export type WebsiteControlledReadinessDecision =
  | "go_vercel_preview"
  | "conditional_go_internal_preview"
  | "no_go_fix_required"
  | "blocked_production"
  | "move_to_backend_plan";

export type WebsiteControlledFinalDecision =
  | "go_preview"
  | "conditional_preview"
  | "not_ready"
  | "no_go";

export type WebsiteControlledReadinessItem = {
  id: string;
  title: string;
  area: WebsiteControlledReadinessArea;
  status: WebsiteControlledReadinessStatus;
  decision: WebsiteControlledReadinessDecision;
  summary: string;
  requiredEvidence: string[];
  goCriteria: string[];
  blockedIf: string[];
  nextAction: string;
};

export type WebsiteControlledBlockClosureItem = {
  id: string;
  title: string;
  completed: boolean;
  description: string;
};

export const WEBSITE_CONTROLLED_READINESS_AREA_LABELS: Record<
  WebsiteControlledReadinessArea,
  string
> = {
  execution_results: "Resultados ejecución",
  visual_quality: "Calidad visual",
  knowledge_quality: "Calidad Knowledge",
  security: "Seguridad",
  consent: "Consentimiento",
  fictional_data: "Datos ficticios",
  rollback: "Rollback",
  vercel_preview: "Vercel Preview",
  production_blocker: "Bloqueo producción",
  next_phase: "Siguiente fase",
};

export const WEBSITE_CONTROLLED_READINESS_STATUS_LABELS: Record<
  WebsiteControlledReadinessStatus,
  string
> = {
  ready: "Listo",
  conditional: "Condicional",
  blocked: "Bloqueado",
  not_ready: "No listo",
};

export const WEBSITE_CONTROLLED_READINESS_DECISION_LABELS: Record<
  WebsiteControlledReadinessDecision,
  string
> = {
  go_vercel_preview: "GO Vercel Preview",
  conditional_go_internal_preview: "GO condicional preview interno",
  no_go_fix_required: "NO-GO requiere corrección",
  blocked_production: "Producción bloqueada",
  move_to_backend_plan: "Avanzar a plan backend",
};

export const WEBSITE_CONTROLLED_FINAL_DECISION_LABELS: Record<
  WebsiteControlledFinalDecision,
  string
> = {
  go_preview: "GO Preview Controlado",
  conditional_preview: "CONDITIONAL GO Preview Interno",
  not_ready: "NO LISTO",
  no_go: "NO-GO",
};

export const WEBSITE_CONTROLLED_READINESS_ITEMS: WebsiteControlledReadinessItem[] = [
  {
    id: "readiness-execution-results",
    title: "Resultados del tablero de ejecución",
    area: "execution_results",
    status: "conditional",
    decision: "conditional_go_internal_preview",
    summary:
      "La decisión final depende del estado de los escenarios en el Website Controlled Test Execution Board.",
    requiredEvidence: [
      "Todos los escenarios críticos ejecutados.",
      "Sin FAIL en seguridad.",
      "Sin BLOCKED en consentimiento.",
      "Sin FAIL en rollback.",
      "WARN menores documentados si existen.",
    ],
    goCriteria: [
      "Todos los escenarios críticos en PASS.",
      "O WARN menor sin impacto de seguridad.",
      "Reporte de ejecución copiado y revisado.",
    ],
    blockedIf: [
      "Hay FAIL en seguridad.",
      "Hay FAIL en consentimiento.",
      "Hay FAIL en bloqueo de información sensible.",
      "Hay FAIL/BLOCKED en rollback.",
    ],
    nextAction:
      "Ejecutar el tablero y revisar decisión final dinámica antes de compartir preview.",
  },
  {
    id: "readiness-visual-quality",
    title: "Calidad visual desktop/mobile",
    area: "visual_quality",
    status: "conditional",
    decision: "conditional_go_internal_preview",
    summary:
      "La prueba web controlada puede avanzar si la experiencia visual no rompe la navegación ni oculta CTAs importantes.",
    requiredEvidence: [
      "Captura desktop.",
      "Captura mobile.",
      "Botón flotante validado.",
      "Panel abierto/cerrado validado.",
    ],
    goCriteria: [
      "Diseño coherente con ORBI.",
      "Legible en mobile.",
      "No tapa navegación principal.",
      "Aviso sandbox visible.",
    ],
    blockedIf: [
      "Layout roto.",
      "Widget no se puede cerrar.",
      "No aparece nota sandbox.",
    ],
    nextAction:
      "Simon debe revisar visualmente el preview y reportar ajustes si corresponde.",
  },
  {
    id: "readiness-knowledge-quality",
    title: "Calidad de respuestas Knowledge Base",
    area: "knowledge_quality",
    status: "ready",
    decision: "go_vercel_preview",
    summary:
      "La Knowledge Base local, Answer Engine, Chat Integration y Web Widget Knowledge ya están preparados para prueba controlada.",
    requiredEvidence: [
      "Consulta qué es ORBI.",
      "Consulta servicios.",
      "Consulta ChatBox/WhatsApp futuro.",
      "Consulta PVMetrics/O&M/Foton.",
    ],
    goCriteria: [
      "Responde con información pública/controlada.",
      "No inventa capacidades.",
      "Deriva a humano cuando corresponde.",
    ],
    blockedIf: [
      "Promete WhatsApp real activo.",
      "Entrega datos no validados.",
      "Responde fuera de la Knowledge Base.",
    ],
    nextAction:
      "Mantener respuestas limitadas a Knowledge Base pública/controlada.",
  },
  {
    id: "readiness-security-sensitive",
    title: "Bloqueo de información sensible",
    area: "security",
    status: "ready",
    decision: "go_vercel_preview",
    summary:
      "La prueba solo puede avanzar si se mantiene el bloqueo de tokens, credenciales, costos internos, datos privados y prompts internos.",
    requiredEvidence: [
      "Prueba con consulta de tokens.",
      "Prueba con credenciales.",
      "Prueba con costos internos.",
      "Respuesta restringida segura.",
    ],
    goCriteria: [
      "No revela secretos.",
      "No revela costos internos.",
      "No revela datos privados.",
      "Ofrece alternativa segura.",
    ],
    blockedIf: [
      "Cualquier fuga de información sensible.",
      "Cualquier mención de credenciales reales.",
      "Cualquier exposición de datos internos.",
    ],
    nextAction:
      "Si falla una prueba sensible, bloquear avance a preview y corregir Answer Engine.",
  },
  {
    id: "readiness-consent-fictional-data",
    title: "Consentimiento y datos ficticios",
    area: "consent",
    status: "conditional",
    decision: "conditional_go_internal_preview",
    summary:
      "Toda prueba debe usar datos ficticios y mantener consentimiento visible antes de cualquier prueba externa.",
    requiredEvidence: [
      "Caso con consentimiento aceptado.",
      "Caso sin consentimiento.",
      "Datos ficticios usados.",
      "Aviso de sandbox visible.",
    ],
    goCriteria: [
      "No se usan datos reales.",
      "Consentimiento visible.",
      "Sin consentimiento se marca revisión/bloqueo seguro.",
    ],
    blockedIf: [
      "Uso de datos reales.",
      "Correos o teléfonos reales.",
      "Captura sin consentimiento.",
    ],
    nextAction:
      "Usar visitantes ficticios tipo demo@orbi.test hasta tener backend y política de datos.",
  },
  {
    id: "readiness-rollback",
    title: "Rollback visual disponible",
    area: "rollback",
    status: "conditional",
    decision: "conditional_go_internal_preview",
    summary:
      "La integración visual debe poder retirarse rápidamente si genera confusión o riesgo.",
    requiredEvidence: [
      "Archivo/componente modificado identificado.",
      "Pasos de reversión documentados.",
      "Captura antes/después.",
    ],
    goCriteria: [
      "Cambio aislado.",
      "Rollback simple.",
      "Sin afectar otros módulos.",
    ],
    blockedIf: [
      "No se sabe cómo revertir.",
      "La integración afecta otras secciones.",
      "El preview queda mezclado con cambios no relacionados.",
    ],
    nextAction:
      "Mantener la integración aislada para que Simon pueda revertir sin riesgo.",
  },
  {
    id: "readiness-vercel-preview",
    title: "Vercel Preview interno controlado",
    area: "vercel_preview",
    status: "conditional",
    decision: "conditional_go_internal_preview",
    summary:
      "Vercel Preview queda permitido solo para revisión interna con datos ficticios y nota visible de sandbox.",
    requiredEvidence: [
      "URL de preview.",
      "Lista de usuarios internos autorizados.",
      "Capturas de prueba.",
      "Reporte de ejecución.",
    ],
    goCriteria: [
      "Preview compartido solo internamente.",
      "Datos ficticios.",
      "Sin backend real.",
      "Sin WhatsApp real.",
    ],
    blockedIf: [
      "Se publica en dominio principal como atención oficial.",
      "Se reciben datos reales.",
      "Se conecta backend no auditado.",
    ],
    nextAction:
      "Compartir preview solo con equipo interno para revisión visual y funcional.",
  },
  {
    id: "readiness-production-blocked",
    title: "Producción sigue bloqueada",
    area: "production_blocker",
    status: "blocked",
    decision: "blocked_production",
    summary:
      "El cierre de 0K-11 no autoriza producción, endpoint público, datos reales, WhatsApp real ni IA externa.",
    requiredEvidence: [
      "NO-GO producción visible.",
      "Nota sandbox visible.",
      "Sin endpoints productivos.",
      "Sin credenciales en frontend.",
    ],
    goCriteria: [
      "Solo sandbox.",
      "Solo preview interno.",
      "Solo datos ficticios.",
    ],
    blockedIf: [
      "Producción pública.",
      "Clientes reales.",
      "WhatsApp real.",
      "Endpoint público real.",
      "IA externa real.",
    ],
    nextAction:
      "Mantener producción bloqueada hasta construir backend mínimo seguro.",
  },
  {
    id: "readiness-next-backend-plan",
    title: "Siguiente fase: Minimal Backend Receiver Build Plan",
    area: "next_phase",
    status: "ready",
    decision: "move_to_backend_plan",
    summary:
      "Después del cierre 0K-11, el siguiente paso recomendado es planificar la construcción mínima y segura del backend receiver.",
    requiredEvidence: [
      "0K-9 Backend Receiver Foundation cerrado.",
      "0K-10 Knowledge Base cerrado.",
      "0K-11 Website Controlled Test Pack cerrado.",
    ],
    goCriteria: [
      "Stack backend definido.",
      "Hosting definido.",
      "Secrets fuera del frontend.",
      "Endpoint receiver diseñado con rate limit y auditoría.",
    ],
    blockedIf: [
      "No hay decisión de stack.",
      "No hay política de datos.",
      "No hay QA backend.",
    ],
    nextAction:
      "Iniciar 0K-12 — Minimal Backend Receiver Build Plan.",
  },
];

export const WEBSITE_CONTROLLED_BLOCK_CLOSURE_ITEMS: WebsiteControlledBlockClosureItem[] =
  [
    {
      id: "closure-test-pack-foundation",
      title: "Website Controlled Test Pack creado",
      completed: true,
      description:
        "Se creó checklist, matriz de prueba, escenarios, datos ficticios obligatorios y límites de seguridad.",
    },
    {
      id: "closure-controlled-embed",
      title: "Controlled Embed Instructions creado",
      completed: true,
      description:
        "Se documentaron instrucciones para Simon, Vercel Preview, snippets conceptuales, QA visual, QA de seguridad y rollback.",
    },
    {
      id: "closure-execution-board",
      title: "Execution Board creado",
      completed: true,
      description:
        "Se creó tablero local para marcar PASS/WARN/FAIL/BLOCKED y exportar reporte de ejecución.",
    },
    {
      id: "closure-readiness-final",
      title: "Readiness final documentado",
      completed: true,
      description:
        "Se documenta decisión final dinámica, condiciones para preview y bloqueos para producción.",
    },
    {
      id: "closure-production-still-blocked",
      title: "Producción sigue bloqueada",
      completed: true,
      description:
        "0K-11 no habilita backend real, endpoint público, WhatsApp real, datos reales, IA externa ni producción.",
    },
  ];

export function buildWebsiteControlledReadinessSummary(
  items: WebsiteControlledReadinessItem[]
) {
  const total = items.length;
  const ready = items.filter((item) => item.status === "ready").length;
  const conditional = items.filter((item) => item.status === "conditional").length;
  const blocked = items.filter((item) => item.status === "blocked").length;
  const notReady = items.filter((item) => item.status === "not_ready").length;

  return {
    total,
    ready,
    conditional,
    blocked,
    notReady,
  };
}

export function getWebsiteControlledFinalDecision(
  executionSummary: ReturnType<typeof buildWebsiteControlledExecutionSummary>
): WebsiteControlledFinalDecision {
  if (executionSummary.fail > 0 || executionSummary.blocked > 0) {
    return "no_go";
  }

  if (executionSummary.notRun > 0) {
    return "not_ready";
  }

  if (executionSummary.warn > 0) {
    return "conditional_preview";
  }

  if (
    executionSummary.total > 0 &&
    executionSummary.pass === executionSummary.total
  ) {
    return "go_preview";
  }

  return "not_ready";
}

export function buildWebsiteControlledFinalDecisionText(
  decision: WebsiteControlledFinalDecision
) {
  if (decision === "go_preview") {
    return "GO: todos los escenarios ejecutados quedaron PASS. Puede avanzarse a Vercel Preview interno controlado con datos ficticios.";
  }

  if (decision === "conditional_preview") {
    return "CONDITIONAL GO: existen WARN menores documentados. Puede avanzarse solo si no afectan seguridad, consentimiento, información sensible ni rollback.";
  }

  if (decision === "not_ready") {
    return "NO LISTO: todavía existen escenarios no ejecutados. Completar el tablero antes de compartir preview.";
  }

  return "NO-GO: existen FAIL o BLOCKED. No avanzar a preview hasta corregir y volver a ejecutar pruebas.";
}

export function buildWebsiteControlledBlockClosureSummary(
  items: WebsiteControlledBlockClosureItem[]
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

export function buildWebsiteControlledReadinessReportText(params: {
  profile: CompanyProfile;
  readinessItems: WebsiteControlledReadinessItem[];
  closureItems: WebsiteControlledBlockClosureItem[];
  readinessSummary: ReturnType<typeof buildWebsiteControlledReadinessSummary>;
  executionSummary: ReturnType<typeof buildWebsiteControlledExecutionSummary>;
  finalDecision: WebsiteControlledFinalDecision;
  finalDecisionText: string;
  closureSummary: ReturnType<typeof buildWebsiteControlledBlockClosureSummary>;
  registrySummary: ReturnType<typeof buildOrbiModuleRegistrySummary>;
}): string {
  const {
    profile,
    readinessItems,
    closureItems,
    readinessSummary,
    executionSummary,
    finalDecision,
    finalDecisionText,
    closureSummary,
    registrySummary,
  } = params;

  const readinessText = readinessItems
    .map((item) => {
      return `WEBSITE READINESS ITEM: ${item.title}
Área: ${WEBSITE_CONTROLLED_READINESS_AREA_LABELS[item.area]}
Estado: ${WEBSITE_CONTROLLED_READINESS_STATUS_LABELS[item.status]}
Decisión: ${WEBSITE_CONTROLLED_READINESS_DECISION_LABELS[item.decision]}

Resumen:
${item.summary}

Evidencia requerida:
${item.requiredEvidence.map((evidence) => `- ${evidence}`).join("\n")}

Criterios GO:
${item.goCriteria.map((criteria) => `- ${criteria}`).join("\n")}

Bloqueado si:
${item.blockedIf.map((blocker) => `- ${blocker}`).join("\n")}

Próxima acción:
${item.nextAction}`;
    })
    .join("\n\n---\n\n");

  const closureText = closureItems
    .map((item) => {
      return `${item.completed ? "✓" : "○"} ${item.title}
${item.description}`;
    })
    .join("\n\n");

  return `WEBSITE CONTROLLED TEST READINESS — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

VERSIÓN ACTIVA
App version: ${ORBI_CHATBOX_APP_VERSION}
Bloque activo: ${ORBI_CHATBOX_ACTIVE_BLOCK}
Módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE}
Título módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE_TITLE}

READINESS SUMMARY
Ítems readiness: ${readinessSummary.total}
Listos: ${readinessSummary.ready}
Condicionales: ${readinessSummary.conditional}
Bloqueados: ${readinessSummary.blocked}
No listos: ${readinessSummary.notReady}

EXECUTION SUMMARY
Ítems ejecución: ${executionSummary.total}
Completados: ${executionSummary.completed}
No ejecutados: ${executionSummary.notRun}
PASS: ${executionSummary.pass}
WARN: ${executionSummary.warn}
FAIL: ${executionSummary.fail}
BLOCKED: ${executionSummary.blocked}
Progreso ejecución: ${executionSummary.progress}%

DECISIÓN FINAL DINÁMICA
${WEBSITE_CONTROLLED_FINAL_DECISION_LABELS[finalDecision]}
${finalDecisionText}

CIERRE BLOQUE 0K-11
Cierre completado: ${closureSummary.completed}/${closureSummary.total}
Progreso: ${closureSummary.progress}%

MODULE REGISTRY
Módulos registrados: ${registrySummary.total}
Completados: ${registrySummary.completed}
Activos: ${registrySummary.active}
Planificados: ${registrySummary.planned}

READINESS ITEMS
${readinessText}

CIERRE
${closureText}

DECISIÓN DE ALCANCE
GO: Vercel Preview interno controlado solo con datos ficticios, si el Execution Board lo permite.
CONDITIONAL GO: preview interno con WARN menores documentados y sin riesgo de seguridad.
NO-GO: producción, endpoint público, WhatsApp real, datos reales, IA externa o backend no auditado.

NOTA
Este cierre es local y no productivo. No crea backend, endpoints, APIs, fetch, base de datos, localStorage nuevo, WhatsApp real ni despliegue.`;
}


// ==========================================
// MÓDULO 0K-12A.1 — Minimal Backend Receiver Build Plan Types & Data
// ==========================================

export type MinimalBackendPlanArea =
  | "architecture"
  | "stack"
  | "endpoint"
  | "environment"
  | "security"
  | "cors"
  | "rate_limit"
  | "audit_log"
  | "data_policy"
  | "build_gate";

export type MinimalBackendPlanStatus =
  | "ready"
  | "conditional"
  | "blocked"
  | "future";

export type MinimalBackendPlanRisk =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type MinimalBackendPlanDecision =
  | "go_plan"
  | "conditional_build"
  | "blocked_build"
  | "future_review";

export type MinimalBackendPlanItem = {
  id: string;
  title: string;
  area: MinimalBackendPlanArea;
  status: MinimalBackendPlanStatus;
  risk: MinimalBackendPlanRisk;
  decision: MinimalBackendPlanDecision;
  summary: string;
  recommendedApproach: string[];
  requiredBeforeBuild: string[];
  blockedActions: string[];
  evidenceRequired: string[];
};

export type MinimalBackendArchitectureBlock = {
  id: string;
  title: string;
  purpose: string;
  futurePath: string;
  responsibilities: string[];
  mustNotDo: string[];
};

export type MinimalBackendEnvironmentVariable = {
  id: string;
  name: string;
  purpose: string;
  requiredForBuild: boolean;
  mustStayServerSide: boolean;
  exampleValue: string;
};

export type MinimalBackendPlanClosureItem = {
  id: string;
  title: string;
  completed: boolean;
  description: string;
};

export const MINIMAL_BACKEND_PLAN_AREA_LABELS: Record<MinimalBackendPlanArea, string> = {
  architecture: "Arquitectura",
  stack: "Stack",
  endpoint: "Endpoint",
  environment: "Variables entorno",
  security: "Seguridad",
  cors: "CORS",
  rate_limit: "Rate limit",
  audit_log: "Audit log",
  data_policy: "Política datos",
  build_gate: "Build gate",
};

export const MINIMAL_BACKEND_PLAN_STATUS_LABELS: Record<
  MinimalBackendPlanStatus,
  string
> = {
  ready: "Listo",
  conditional: "Condicional",
  blocked: "Bloqueado",
  future: "Futuro",
};

export const MINIMAL_BACKEND_PLAN_RISK_LABELS: Record<MinimalBackendPlanRisk, string> = {
  low: "Bajo",
  medium: "Medio",
  high: "Alto",
  critical: "Crítico",
};

export const MINIMAL_BACKEND_PLAN_DECISION_LABELS: Record<
  MinimalBackendPlanDecision,
  string
> = {
  go_plan: "GO planificación",
  conditional_build: "Build condicional",
  blocked_build: "Build bloqueado",
  future_review: "Revisión futura",
};

export const MINIMAL_BACKEND_PLAN_ITEMS: MinimalBackendPlanItem[] = [
  {
    id: "minimal-backend-architecture",
    title: "Arquitectura mínima separada del frontend",
    area: "architecture",
    status: "conditional",
    risk: "high",
    decision: "conditional_build",
    summary:
      "El backend receiver debe vivir como una capa separada del frontend público para proteger secretos, validar payloads y controlar recepción de mensajes.",
    recommendedApproach: [
      "Crear una carpeta server o servicio backend separado.",
      "Mantener secretos solo del lado servidor.",
      "Separar frontend público de lógica de recepción.",
      "Exponer solo un endpoint público mínimo.",
    ],
    requiredBeforeBuild: [
      "Definir si el backend estará en el mismo repo o repo separado.",
      "Definir hosting backend.",
      "Definir estrategia de variables de entorno.",
      "Definir política de logs.",
    ],
    blockedActions: [
      "Poner tokens en frontend.",
      "Validar seguridad solo en React.",
      "Aceptar companyId desde el cliente.",
      "Recibir datos reales sin política de datos.",
    ],
    evidenceRequired: [
      "Diagrama de arquitectura mínima.",
      "Decisión de hosting.",
      "Listado de secretos server-side.",
      "Build gate aprobado.",
    ],
  },
  {
    id: "minimal-backend-stack",
    title: "Stack backend candidato",
    area: "stack",
    status: "conditional",
    risk: "medium",
    decision: "conditional_build",
    summary:
      "El stack candidato debe priorizar simplicidad, seguridad, TypeScript y despliegue fácil para una primera prueba controlada.",
    recommendedApproach: [
      "Usar Node.js con TypeScript.",
      "Evaluar Express o Fastify para receiver mínimo.",
      "Mantener lógica del receiver modular.",
      "Evitar frameworks pesados hasta validar MVP.",
    ],
    requiredBeforeBuild: [
      "Elegir Express/Fastify/NestJS u otra alternativa.",
      "Definir scripts de dev/build.",
      "Definir lint/typecheck backend.",
      "Definir estructura mínima de carpetas.",
    ],
    blockedActions: [
      "Agregar stack complejo sin necesidad.",
      "Mezclar backend real con componentes UI.",
      "Crear dependencias productivas sin decisión técnica.",
    ],
    evidenceRequired: [
      "Stack elegido.",
      "Justificación simple.",
      "Carpetas propuestas.",
      "Checklist QA backend.",
    ],
  },
  {
    id: "minimal-backend-endpoint",
    title: "Endpoint futuro del widget web",
    area: "endpoint",
    status: "ready",
    risk: "high",
    decision: "go_plan",
    summary:
      "El endpoint futuro mantiene el contrato definido en 0K-9: POST /api/public/widget/:publicKey/message.",
    recommendedApproach: [
      "Usar publicKey en ruta.",
      "Resolver empresa desde backend.",
      "Validar schema antes de procesar.",
      "Responder con mensajes públicos seguros.",
    ],
    requiredBeforeBuild: [
      "Schema de payload real.",
      "Validación de publicKey.",
      "Response contract real.",
      "Error map implementado.",
    ],
    blockedActions: [
      "Aceptar companyId desde frontend.",
      "Exponer detalles internos en errores.",
      "Procesar mensajes sin consentimiento.",
    ],
    evidenceRequired: [
      "Contrato endpoint documentado.",
      "Error map asociado.",
      "Response 202/400/429/500 definido.",
    ],
  },
  {
    id: "minimal-backend-env",
    title: "Variables de entorno server-side",
    area: "environment",
    status: "conditional",
    risk: "critical",
    decision: "conditional_build",
    summary:
      "Todas las credenciales, claves, secrets y configuraciones sensibles deben vivir exclusivamente en variables de entorno del backend.",
    recommendedApproach: [
      "Usar .env solo local y nunca commitearlo.",
      "Definir .env.example sin secretos reales.",
      "Mantener tokens fuera del frontend.",
      "Separar variables dev/preview/production.",
    ],
    requiredBeforeBuild: [
      "Lista de variables requeridas.",
      ".env.example seguro.",
      "Configuración de secrets en hosting.",
      "Revisión de que no existan secretos en React.",
    ],
    blockedActions: [
      "Subir .env real al repo.",
      "Exponer tokens en Vite/React.",
      "Usar claves reales en screenshots.",
      "Compartir secrets por chat público.",
    ],
    evidenceRequired: [
      ".env.example sin secretos.",
      "Checklist de secrets.",
      "Confirmación de frontend sin tokens.",
    ],
  },
  {
    id: "minimal-backend-cors",
    title: "CORS limitado a dominios ORBI",
    area: "cors",
    status: "conditional",
    risk: "high",
    decision: "conditional_build",
    summary:
      "El backend futuro debe aceptar requests solo desde dominios/previews permitidos de ORBI.",
    recommendedApproach: [
      "Permitir localhost durante desarrollo.",
      "Permitir Vercel Preview autorizado.",
      "Permitir dominio ORBI solo cuando exista producción validada.",
      "Rechazar origins desconocidos.",
    ],
    requiredBeforeBuild: [
      "Lista de origins permitidos.",
      "Política para previews.",
      "Mensaje de error seguro para origin no permitido.",
    ],
    blockedActions: [
      "Usar CORS abierto con * en producción.",
      "Permitir cualquier dominio externo.",
      "Compartir endpoint antes de QA.",
    ],
    evidenceRequired: [
      "Lista allowed origins.",
      "Caso origin permitido.",
      "Caso origin bloqueado.",
    ],
  },
  {
    id: "minimal-backend-rate-limit",
    title: "Rate limit obligatorio",
    area: "rate_limit",
    status: "conditional",
    risk: "critical",
    decision: "conditional_build",
    summary:
      "El endpoint público futuro debe tener rate limit antes de recibir tráfico real para evitar spam, abuso y costos innecesarios.",
    recommendedApproach: [
      "Limitar por IP.",
      "Limitar por publicKey.",
      "Limitar por ventana temporal.",
      "Responder con 429 seguro.",
    ],
    requiredBeforeBuild: [
      "Definir límites iniciales.",
      "Definir storage de rate limit.",
      "Definir retryAfter opcional.",
      "Definir logs de abuso.",
    ],
    blockedActions: [
      "Exponer endpoint sin rate limit.",
      "Llamar IA externa sin control.",
      "Permitir mensajes ilimitados.",
    ],
    evidenceRequired: [
      "Caso normal permitido.",
      "Caso abuso bloqueado.",
      "Response 429 validado.",
    ],
  },
  {
    id: "minimal-backend-audit-log",
    title: "Audit log mínimo",
    area: "audit_log",
    status: "conditional",
    risk: "high",
    decision: "conditional_build",
    summary:
      "Cada request debe generar un registro mínimo de auditoría sin guardar información sensible innecesaria.",
    recommendedApproach: [
      "Generar requestId.",
      "Registrar timestamp.",
      "Registrar publicKey resuelta.",
      "Registrar resultado de validación.",
      "Evitar guardar secretos o payload crudo sensible.",
    ],
    requiredBeforeBuild: [
      "Definir formato AuditLog.",
      "Definir retención.",
      "Definir campos permitidos.",
      "Definir campos prohibidos.",
    ],
    blockedActions: [
      "Guardar tokens.",
      "Guardar contraseñas.",
      "Guardar payload sensible sin sanitizar.",
      "No tener requestId.",
    ],
    evidenceRequired: [
      "Ejemplo AuditLog seguro.",
      "Lista de campos permitidos.",
      "Lista de campos prohibidos.",
    ],
  },
  {
    id: "minimal-backend-data-policy",
    title: "Política mínima de datos para pruebas",
    area: "data_policy",
    status: "conditional",
    risk: "critical",
    decision: "conditional_build",
    summary:
      "Antes de datos reales se requiere consentimiento, aviso claro, minimización de datos y reglas de retención.",
    recommendedApproach: [
      "Usar datos ficticios en preview.",
      "Definir aviso de consentimiento.",
      "Capturar solo datos mínimos.",
      "Definir tiempo de retención.",
    ],
    requiredBeforeBuild: [
      "Texto de consentimiento preliminar.",
      "Campos mínimos permitidos.",
      "Política de eliminación.",
      "Validación legal futura.",
    ],
    blockedActions: [
      "Capturar datos reales sin aviso.",
      "Guardar información sensible.",
      "Tratar mensajes como soporte oficial sin validación.",
    ],
    evidenceRequired: [
      "Texto consentimiento demo.",
      "Campos mínimos listados.",
      "NO-GO datos sensibles visible.",
    ],
  },
  {
    id: "minimal-backend-build-gate",
    title: "Build Gate antes de escribir backend real",
    area: "build_gate",
    status: "blocked",
    risk: "critical",
    decision: "blocked_build",
    summary:
      "La construcción backend real sigue bloqueada hasta cerrar stack, hosting, secrets, CORS, rate limit, audit log y política de datos.",
    recommendedApproach: [
      "Cerrar decisión técnica en 0K-12A.2.",
      "Cerrar checklist de seguridad.",
      "Definir ambiente local y preview.",
      "Aprobar build controlado antes de codificar.",
    ],
    requiredBeforeBuild: [
      "Stack decidido.",
      "Hosting decidido.",
      "Variables definidas.",
      "CORS definido.",
      "Rate limit definido.",
      "Audit log definido.",
      "Política de datos definida.",
    ],
    blockedActions: [
      "Crear endpoint ahora.",
      "Deployar backend ahora.",
      "Conectar web real ahora.",
      "Conectar WhatsApp real ahora.",
    ],
    evidenceRequired: [
      "Checklist build gate aprobado.",
      "Matriz de stack completada.",
      "NO-GO producción visible.",
    ],
  },
];

export const MINIMAL_BACKEND_ARCHITECTURE_BLOCKS: MinimalBackendArchitectureBlock[] = [
  {
    id: "arch-public-widget",
    title: "Frontend público / Web Widget ORBI",
    purpose:
      "Recibir mensajes del visitante y enviarlos al receiver futuro solo cuando exista backend seguro.",
    futurePath: "orbi-website / widget component",
    responsibilities: [
      "Mostrar UI del chat.",
      "Mostrar consentimiento.",
      "Enviar payload mínimo.",
      "Mostrar respuesta pública segura.",
    ],
    mustNotDo: [
      "Guardar secretos.",
      "Validar seguridad crítica.",
      "Resolver empresa por companyId.",
      "Procesar datos sensibles.",
    ],
  },
  {
    id: "arch-backend-receiver",
    title: "Backend Receiver mínimo",
    purpose:
      "Validar, sanitizar y aceptar/rechazar mensajes públicos del widget web.",
    futurePath: "server/src/routes/publicWidgetReceiver.ts",
    responsibilities: [
      "Validar schema.",
      "Resolver publicKey.",
      "Aplicar CORS.",
      "Aplicar rate limit.",
      "Crear requestId.",
      "Emitir AuditLog.",
      "Responder con contrato seguro.",
    ],
    mustNotDo: [
      "Exponer stack traces.",
      "Aceptar payload sin validar.",
      "Aceptar datos sin consentimiento.",
      "Guardar payload sensible sin sanitizar.",
    ],
  },
  {
    id: "arch-knowledge-engine",
    title: "Knowledge Answer Engine server-side futuro",
    purpose:
      "Usar la Knowledge Base ORBI para generar una respuesta controlada desde backend futuro.",
    futurePath: "server/src/services/knowledgeAnswerEngine.ts",
    responsibilities: [
      "Buscar coincidencias en Knowledge Base.",
      "Bloquear temas sensibles.",
      "Sugerir derivación humana.",
      "Retornar respuesta segura.",
    ],
    mustNotDo: [
      "Inventar información.",
      "Usar IA externa sin gate.",
      "Responder sobre información interna.",
    ],
  },
  {
    id: "arch-admin-review",
    title: "Admin review / lead review futuro",
    purpose:
      "Permitir revisión humana de conversaciones y leads cuando exista backend y persistencia.",
    futurePath: "future-admin-panel",
    responsibilities: [
      "Revisar mensajes.",
      "Clasificar oportunidades.",
      "Marcar derivación humana.",
      "Exportar reportes.",
    ],
    mustNotDo: [
      "Operar sin roles.",
      "Mostrar datos a usuarios no autorizados.",
      "Enviar correos automáticos sin aprobación.",
    ],
  },
];

export const MINIMAL_BACKEND_ENVIRONMENT_VARIABLES: MinimalBackendEnvironmentVariable[] =
  [
    {
      id: "env-node-env",
      name: "NODE_ENV",
      purpose: "Identificar ambiente local, preview o production.",
      requiredForBuild: true,
      mustStayServerSide: true,
      exampleValue: "development",
    },
    {
      id: "env-allowed-origins",
      name: "ORBI_ALLOWED_ORIGINS",
      purpose: "Definir dominios autorizados para CORS.",
      requiredForBuild: true,
      mustStayServerSide: true,
      exampleValue: "http://localhost:5173,https://preview-orbi.vercel.app",
    },
    {
      id: "env-widget-public-key",
      name: "ORBI_DEMO_WIDGET_PUBLIC_KEY",
      purpose: "Llave pública demo para resolver empresa en pruebas controladas.",
      requiredForBuild: true,
      mustStayServerSide: true,
      exampleValue: "pk_demo_orbi_public_key",
    },
    {
      id: "env-rate-limit",
      name: "ORBI_WIDGET_RATE_LIMIT_WINDOW",
      purpose: "Ventana temporal para rate limit del widget.",
      requiredForBuild: true,
      mustStayServerSide: true,
      exampleValue: "60",
    },
    {
      id: "env-audit-enabled",
      name: "ORBI_AUDIT_LOG_ENABLED",
      purpose: "Activar o desactivar audit log mínimo.",
      requiredForBuild: true,
      mustStayServerSide: true,
      exampleValue: "true",
    },
    {
      id: "env-db-url-future",
      name: "ORBI_DATABASE_URL",
      purpose: "URL futura de base de datos, no requerida para primera simulación sin persistencia.",
      requiredForBuild: false,
      mustStayServerSide: true,
      exampleValue: "postgres://user:password@host:5432/orbi",
    },
  ];

export const MINIMAL_BACKEND_PLAN_CLOSURE_ITEMS: MinimalBackendPlanClosureItem[] = [
  {
    id: "closure-backend-plan-created",
    title: "Plan backend mínimo creado",
    completed: true,
    description:
      "Se creó el plan base para preparar una futura construcción backend receiver segura y controlada.",
  },
  {
    id: "closure-architecture-defined",
    title: "Arquitectura mínima definida",
    completed: true,
    description:
      "Se documentó la separación entre frontend público, backend receiver, Knowledge Engine y revisión humana futura.",
  },
  {
    id: "closure-env-defined",
    title: "Variables de entorno futuras definidas",
    completed: true,
    description:
      "Se listaron variables server-side necesarias, sin incluir secretos reales.",
  },
  {
    id: "closure-build-still-blocked",
    title: "Build backend real sigue bloqueado",
    completed: true,
    description:
      "0K-12A.1 no crea backend real. La construcción queda condicionada a Stack Decision y Build Gate.",
  },
];

export function buildMinimalBackendPlanSummary(items: MinimalBackendPlanItem[]) {
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

export function buildMinimalBackendEnvSummary(
  envs: MinimalBackendEnvironmentVariable[]
) {
  const total = envs.length;
  const required = envs.filter((env) => env.requiredForBuild).length;
  const serverSide = envs.filter((env) => env.mustStayServerSide).length;

  return {
    total,
    required,
    serverSide,
  };
}

export function buildMinimalBackendPlanClosureSummary(
  items: MinimalBackendPlanClosureItem[]
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

export function buildMinimalBackendPlanReportText(params: {
  profile: CompanyProfile;
  items: MinimalBackendPlanItem[];
  architectureBlocks: MinimalBackendArchitectureBlock[];
  environmentVariables: MinimalBackendEnvironmentVariable[];
  closureItems: MinimalBackendPlanClosureItem[];
  planSummary: ReturnType<typeof buildMinimalBackendPlanSummary>;
  envSummary: ReturnType<typeof buildMinimalBackendEnvSummary>;
  closureSummary: ReturnType<typeof buildMinimalBackendPlanClosureSummary>;
  registrySummary: ReturnType<typeof buildOrbiModuleRegistrySummary>;
}): string {
  const {
    profile,
    items,
    architectureBlocks,
    environmentVariables,
    closureItems,
    planSummary,
    envSummary,
    closureSummary,
    registrySummary,
  } = params;

  const itemsText = items
    .map((item) => {
      return `MINIMAL BACKEND PLAN ITEM: ${item.title}
Área: ${MINIMAL_BACKEND_PLAN_AREA_LABELS[item.area]}
Estado: ${MINIMAL_BACKEND_PLAN_STATUS_LABELS[item.status]}
Riesgo: ${MINIMAL_BACKEND_PLAN_RISK_LABELS[item.risk]}
Decisión: ${MINIMAL_BACKEND_PLAN_DECISION_LABELS[item.decision]}

Resumen:
${item.summary}

Enfoque recomendado:
${item.recommendedApproach.map((entry) => `- ${entry}`).join("\n")}

Requerido antes de build:
${item.requiredBeforeBuild.map((entry) => `- ${entry}`).join("\n")}

Acciones bloqueadas:
${item.blockedActions.map((entry) => `- ${entry}`).join("\n")}

Evidencia requerida:
${item.evidenceRequired.map((entry) => `- ${entry}`).join("\n")}`;
    })
    .join("\n\n---\n\n");

  const architectureText = architectureBlocks
    .map((block) => {
      return `ARCHITECTURE BLOCK: ${block.title}
Propósito:
${block.purpose}

Ruta futura:
${block.futurePath}

Responsabilidades:
${block.responsibilities.map((entry) => `- ${entry}`).join("\n")}

No debe hacer:
${block.mustNotDo.map((entry) => `- ${entry}`).join("\n")}`;
    })
    .join("\n\n---\n\n");

  const envText = environmentVariables
    .map((env) => {
      return `ENV: ${env.name}
Propósito: ${env.purpose}
Requerida para build: ${env.requiredForBuild ? "Sí" : "No"}
Server-side: ${env.mustStayServerSide ? "Sí" : "No"}
Ejemplo seguro: ${env.exampleValue}`;
    })
    .join("\n\n");

  const closureText = closureItems
    .map((item) => {
      return `${item.completed ? "✓" : "○"} ${item.title}
${item.description}`;
    })
    .join("\n\n");

  return `MINIMAL BACKEND RECEIVER BUILD PLAN — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

VERSIÓN ACTIVA
App version: ${ORBI_CHATBOX_APP_VERSION}
Bloque activo: ${ORBI_CHATBOX_ACTIVE_BLOCK}
Módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE}
Título módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE_TITLE}

PLAN SUMMARY
Ítems: ${planSummary.total}
Listos: ${planSummary.ready}
Condicionales: ${planSummary.conditional}
Bloqueados: ${planSummary.blocked}
Riesgo crítico: ${planSummary.criticalRisk}

ENV SUMMARY
Variables: ${envSummary.total}
Requeridas: ${envSummary.required}
Server-side: ${envSummary.serverSide}

CIERRE
Cierre completado: ${closureSummary.completed}/${closureSummary.total}
Progreso: ${closureSummary.progress}%

MODULE REGISTRY
Módulos registrados: ${registrySummary.total}
Completados: ${registrySummary.completed}
Activos: ${registrySummary.active}
Planificados: ${registrySummary.planned}

PLAN ITEMS
${itemsText}

ARQUITECTURA MÍNIMA
${architectureText}

VARIABLES DE ENTORNO FUTURAS
${envText}

CIERRE
${closureText}

DECISIÓN
GO: planificación técnica del backend mínimo.
CONDITIONAL GO: build backend futuro solo después de Stack Decision y Build Gate.
NO-GO: crear endpoint real, deploy, datos reales, WhatsApp real o secretos en frontend.

NOTA
Este módulo es local y documental. No crea backend, endpoints, APIs, fetch, axios, base de datos, localStorage nuevo, WhatsApp real ni despliegue.`;
}


// ==========================================
// MÓDULO 0K-12A.2 — Backend Stack Decision Matrix & Build Gate Types & Data
// ==========================================

export type BackendStackOptionId =
  | "node_express"
  | "node_fastify"
  | "vercel_functions"
  | "separate_backend_service";

export type BackendStackDecisionStatus =
  | "recommended"
  | "viable"
  | "conditional"
  | "not_recommended";

export type BackendStackDecisionRisk =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type BackendStackDecisionArea =
  | "simplicity"
  | "security"
  | "typescript"
  | "hosting"
  | "cors"
  | "rate_limit"
  | "audit_log"
  | "scalability"
  | "maintenance";

export type BackendBuildGateStatus =
  | "ready"
  | "conditional"
  | "blocked";

export type BackendBuildGateDecision =
  | "allow_planning"
  | "allow_controlled_build"
  | "blocked_until_resolved";

export type BackendStackDecisionOption = {
  id: BackendStackOptionId;
  title: string;
  status: BackendStackDecisionStatus;
  risk: BackendStackDecisionRisk;
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  requiredControls: string[];
  blockedIf: string[];
  recommendation: string;
};

export type BackendStackDecisionCriterion = {
  id: string;
  area: BackendStackDecisionArea;
  title: string;
  weight: number;
  description: string;
  requiredForBuild: boolean;
};

export type BackendBuildGateItem = {
  id: string;
  title: string;
  status: BackendBuildGateStatus;
  decision: BackendBuildGateDecision;
  risk: BackendStackDecisionRisk;
  summary: string;
  requiredEvidence: string[];
  blockedIfMissing: string[];
  nextAction: string;
};

export type BackendStackDecisionClosureItem = {
  id: string;
  title: string;
  completed: boolean;
  description: string;
};

export const BACKEND_STACK_OPTION_LABELS: Record<BackendStackOptionId, string> = {
  node_express: "Node.js + Express",
  node_fastify: "Node.js + Fastify",
  vercel_functions: "Vercel Functions",
  separate_backend_service: "Backend separado",
};

export const BACKEND_STACK_DECISION_STATUS_LABELS: Record<
  BackendStackDecisionStatus,
  string
> = {
  recommended: "Recomendado",
  viable: "Viable",
  conditional: "Condicional",
  not_recommended: "No recomendado",
};

export const BACKEND_STACK_DECISION_RISK_LABELS: Record<
  BackendStackDecisionRisk,
  string
> = {
  low: "Bajo",
  medium: "Medio",
  high: "Alto",
  critical: "Crítico",
};

export const BACKEND_STACK_DECISION_AREA_LABELS: Record<
  BackendStackDecisionArea,
  string
> = {
  simplicity: "Simplicidad",
  security: "Seguridad",
  typescript: "TypeScript",
  hosting: "Hosting",
  cors: "CORS",
  rate_limit: "Rate limit",
  audit_log: "Audit log",
  scalability: "Escalabilidad",
  maintenance: "Mantenimiento",
};

export const BACKEND_BUILD_GATE_STATUS_LABELS: Record<BackendBuildGateStatus, string> = {
  ready: "Listo",
  conditional: "Condicional",
  blocked: "Bloqueado",
};

export const BACKEND_BUILD_GATE_DECISION_LABELS: Record<
  BackendBuildGateDecision,
  string
> = {
  allow_planning: "Permite planificación",
  allow_controlled_build: "Permite build controlado",
  blocked_until_resolved: "Bloqueado hasta resolver",
};

export const BACKEND_STACK_DECISION_OPTIONS: BackendStackDecisionOption[] = [
  {
    id: "node_express",
    title: "Node.js + TypeScript + Express",
    status: "recommended",
    risk: "medium",
    score: 88,
    summary:
      "Opción más simple y directa para construir un receiver mínimo, entendible, fácil de auditar y suficiente para una primera prueba controlada.",
    strengths: [
      "Muy conocido y fácil de mantener.",
      "Adecuado para un endpoint receiver mínimo.",
      "Compatible con middlewares de CORS, rate limit y validación.",
      "Baja curva de entrada para Simon o futuros colaboradores.",
      "Permite separar claramente rutas, servicios y seguridad.",
    ],
    weaknesses: [
      "Requiere disciplina para no crecer desordenado.",
      "No trae estructura fuerte por defecto.",
      "Debe configurarse manualmente seguridad y validaciones.",
    ],
    requiredControls: [
      "TypeScript estricto.",
      "Schema validation.",
      "CORS restringido.",
      "Rate limit obligatorio.",
      "Audit log mínimo.",
      "Errores públicos seguros.",
      "Variables server-side.",
    ],
    blockedIf: [
      "Se intenta exponer secretos en frontend.",
      "Se crea endpoint sin rate limit.",
      "Se usa CORS abierto.",
      "Se reciben datos reales sin política de datos.",
    ],
    recommendation:
      "Recomendado como primera opción para MVP backend receiver mínimo controlado.",
  },
  {
    id: "node_fastify",
    title: "Node.js + TypeScript + Fastify",
    status: "viable",
    risk: "medium",
    score: 84,
    summary:
      "Opción viable alternativa para backend liviano. Es viable, pero no es la recomendación principal para esta etapa; Node.js + TypeScript + Express es el stack recomendado principal.",
    strengths: [
      "Buen rendimiento.",
      "Buena estructura para validación.",
      "Adecuado para APIs pequeñas y seguras.",
      "Puede escalar mejor si crece el receiver.",
    ],
    weaknesses: [
      "Menos familiar para algunos desarrolladores.",
      "Puede agregar complejidad inicial innecesaria.",
      "Requiere decidir plugins y patrones desde el inicio.",
    ],
    requiredControls: [
      "Schema validation integrado o externo.",
      "CORS restringido.",
      "Rate limit.",
      "Audit log.",
      "Error handler seguro.",
    ],
    blockedIf: [
      "El equipo no domina el stack.",
      "La configuración retrasa la prueba controlada.",
      "Se vuelve más complejo que el objetivo MVP.",
    ],
    recommendation:
      "Opción viable alternativa si se busca explorar otros frameworks, pero Express se mantiene como el stack recomendado oficial para el receiver mínimo.",
  },
  {
    id: "vercel_functions",
    title: "Vercel Functions / API Routes",
    status: "conditional",
    risk: "high",
    score: 76,
    summary:
      "Opción conveniente si la web ORBI ya vive en Vercel, pero debe revisarse cuidadosamente por límites, seguridad, logs, CORS y separación de responsabilidades.",
    strengths: [
      "Cercano al hosting actual de la web.",
      "Puede simplificar deploy inicial.",
      "Útil para pruebas controladas pequeñas.",
      "Reduce necesidad de infraestructura adicional al inicio.",
    ],
    weaknesses: [
      "Puede mezclar web y backend si no se organiza bien.",
      "Dependencia fuerte del entorno Vercel.",
      "Logs, rate limit y persistencia deben diseñarse bien.",
      "No ideal si luego se requiere backend más independiente.",
    ],
    requiredControls: [
      "Variables de entorno en Vercel.",
      "CORS/origin check explícito.",
      "Rate limit externo o implementado.",
      "Logs seguros.",
      "Separación clara de API demo vs producción.",
    ],
    blockedIf: [
      "Se mezcla con frontend sin seguridad.",
      "No se puede implementar rate limit adecuado.",
      "Se exponen variables al cliente.",
      "No hay trazabilidad suficiente.",
    ],
    recommendation:
      "Condicional. Puede servir para una prueba inicial si se configura con mucha disciplina y sin datos reales.",
  },
  {
    id: "separate_backend_service",
    title: "Servicio backend separado",
    status: "viable",
    risk: "medium",
    score: 82,
    summary:
      "Opción más limpia a largo plazo para separar completamente web pública y backend receiver, aunque puede requerir más configuración inicial.",
    strengths: [
      "Separación fuerte entre frontend y backend.",
      "Mejor para crecer hacia WhatsApp, CRM y base de datos.",
      "Más control sobre seguridad, logs y despliegue.",
      "Facilita separar releases.",
    ],
    weaknesses: [
      "Más trabajo inicial.",
      "Requiere hosting backend adicional.",
      "Requiere manejo de CORS y dominios desde el inicio.",
      "Puede ser excesivo para una primera prueba sandbox.",
    ],
    requiredControls: [
      "Hosting definido.",
      "Allowed origins.",
      "Secrets server-side.",
      "Rate limit.",
      "Audit log.",
      "Healthcheck.",
      "Deploy y rollback.",
    ],
    blockedIf: [
      "No hay hosting definido.",
      "No hay presupuesto/operación para mantenerlo.",
      "No hay flujo de deploy/rollback.",
    ],
    recommendation:
      "Muy buena opción para fase posterior. Para partir rápido, Express mínimo puede vivir como servicio separado cuando se apruebe el Build Gate.",
  },
];

export const BACKEND_STACK_DECISION_CRITERIA: BackendStackDecisionCriterion[] = [
  {
    id: "criterion-simplicity",
    area: "simplicity",
    title: "Simplicidad de implementación",
    weight: 20,
    description:
      "El stack debe permitir construir un receiver mínimo sin sobrearquitectura.",
    requiredForBuild: true,
  },
  {
    id: "criterion-security",
    area: "security",
    title: "Seguridad básica obligatoria",
    weight: 25,
    description:
      "Debe permitir schema validation, CORS restringido, rate limit, error handler seguro y variables server-side.",
    requiredForBuild: true,
  },
  {
    id: "criterion-typescript",
    area: "typescript",
    title: "Compatibilidad TypeScript",
    weight: 15,
    description:
      "Debe integrarse con TypeScript para reducir errores y mantener contratos claros.",
    requiredForBuild: true,
  },
  {
    id: "criterion-hosting",
    area: "hosting",
    title: "Facilidad de hosting",
    weight: 15,
    description:
      "Debe ser desplegable de forma controlada en ambiente local/preview sin exponer secretos.",
    requiredForBuild: true,
  },
  {
    id: "criterion-rate-limit",
    area: "rate_limit",
    title: "Rate limit viable",
    weight: 10,
    description:
      "Debe permitir protección contra spam y abuso antes de abrir un endpoint público.",
    requiredForBuild: true,
  },
  {
    id: "criterion-audit-log",
    area: "audit_log",
    title: "Audit log mínimo",
    weight: 10,
    description:
      "Debe permitir requestId, timestamp, resultado de validación y trazabilidad segura.",
    requiredForBuild: true,
  },
  {
    id: "criterion-maintenance",
    area: "maintenance",
    title: "Mantenimiento por equipo pequeño",
    weight: 5,
    description:
      "Debe ser mantenible por una persona o equipo pequeño sin complejidad excesiva.",
    requiredForBuild: false,
  },
];

export const BACKEND_BUILD_GATE_ITEMS: BackendBuildGateItem[] = [
  {
    id: "gate-stack-selected",
    title: "Stack backend seleccionado",
    status: "conditional",
    decision: "allow_controlled_build",
    risk: "high",
    summary:
      "Debe existir una decisión clara del stack antes de escribir código backend real.",
    requiredEvidence: [
      "Stack recomendado documentado.",
      "Motivo de selección.",
      "Riesgos identificados.",
      "Controles requeridos definidos.",
    ],
    blockedIfMissing: [
      "No hay stack elegido.",
      "No hay responsable técnico.",
      "No hay estructura mínima definida.",
    ],
    nextAction:
      "Usar la opción recomendada Node.js + TypeScript + Express salvo que Simon prefiera Vercel Functions para preview limitado.",
  },
  {
    id: "gate-env-secrets",
    title: "Variables y secretos server-side definidos",
    status: "blocked",
    decision: "blocked_until_resolved",
    risk: "critical",
    summary:
      "No se puede construir backend real si no está definido cómo se manejarán variables de entorno y secretos.",
    requiredEvidence: [
      ".env.example sin secretos reales.",
      "Lista de variables server-side.",
      "Confirmación de no tokens en frontend.",
      "Regla de no commitear .env real.",
    ],
    blockedIfMissing: [
      "Secrets en React.",
      "Variables Vite públicas con datos sensibles.",
      ".env real en repositorio.",
    ],
    nextAction:
      "Crear política de variables antes de cualquier endpoint real.",
  },
  {
    id: "gate-cors-origin",
    title: "Allowed origins definidos",
    status: "conditional",
    decision: "allow_controlled_build",
    risk: "high",
    summary:
      "El receiver futuro debe aceptar solo localhost y previews/dominios ORBI autorizados.",
    requiredEvidence: [
      "Lista de origins permitidos.",
      "Regla para bloquear origin desconocido.",
      "Criterio para Vercel Preview.",
    ],
    blockedIfMissing: [
      "CORS abierto con *.",
      "Endpoint accesible desde cualquier dominio.",
    ],
    nextAction:
      "Definir origins dev/preview antes de construir endpoint.",
  },
  {
    id: "gate-rate-limit",
    title: "Rate limit definido",
    status: "blocked",
    decision: "blocked_until_resolved",
    risk: "critical",
    summary:
      "El endpoint público no puede abrirse sin límite de requests por IP/publicKey.",
    requiredEvidence: [
      "Límite por IP.",
      "Límite por publicKey.",
      "Ventana temporal.",
      "Respuesta 429 segura.",
    ],
    blockedIfMissing: [
      "Endpoint sin protección anti-spam.",
      "Mensajes ilimitados.",
      "Llamadas IA externas sin control futuro.",
    ],
    nextAction:
      "Definir límites iniciales del receiver antes del build.",
  },
  {
    id: "gate-audit-log",
    title: "Audit log mínimo definido",
    status: "conditional",
    decision: "allow_controlled_build",
    risk: "high",
    summary:
      "Cada request debe generar trazabilidad mínima sin almacenar secretos ni payload sensible innecesario.",
    requiredEvidence: [
      "Formato AuditLog.",
      "requestId.",
      "timestamp.",
      "resultado validación.",
      "campos prohibidos.",
    ],
    blockedIfMissing: [
      "No hay requestId.",
      "No hay trazabilidad.",
      "Se guarda payload sensible completo.",
    ],
    nextAction:
      "Crear contrato AuditLog antes del endpoint ejecutable.",
  },
  {
    id: "gate-data-policy",
    title: "Política mínima de datos",
    status: "blocked",
    decision: "blocked_until_resolved",
    risk: "critical",
    summary:
      "No se deben recibir datos reales sin consentimiento, minimización, retención y texto visible.",
    requiredEvidence: [
      "Texto consentimiento preliminar.",
      "Campos mínimos permitidos.",
      "Regla de datos ficticios en preview.",
      "NO-GO datos reales hasta política final.",
    ],
    blockedIfMissing: [
      "Captura de correos reales.",
      "Captura de teléfonos reales.",
      "Sin consentimiento visible.",
      "Sin regla de eliminación.",
    ],
    nextAction:
      "Mantener datos ficticios hasta cerrar política de datos.",
  },
];

export const BACKEND_STACK_DECISION_CLOSURE_ITEMS: BackendStackDecisionClosureItem[] = [
  {
    id: "closure-stack-options",
    title: "Opciones de stack documentadas",
    completed: true,
    description:
      "Se compararon Express, Fastify, Vercel Functions y servicio backend separado.",
  },
  {
    id: "closure-recommendation",
    title: "Recomendación inicial definida",
    completed: true,
    description:
      "Node.js + TypeScript + Express queda como recomendación inicial para receiver mínimo controlado.",
  },
  {
    id: "closure-build-gate",
    title: "Build Gate creado",
    completed: true,
    description:
      "Se creó gate previo a cualquier construcción backend real con seguridad, CORS, rate limit, audit log y datos.",
  },
  {
    id: "closure-build-still-blocked",
    title: "Build real sigue bloqueado",
    completed: true,
    description:
      "0K-12A.2 no crea backend real. El build queda condicionado a resolver gates bloqueados.",
  },
];

export function buildBackendStackDecisionSummary(
  options: BackendStackDecisionOption[]
) {
  const total = options.length;
  const recommended = options.filter(
    (option) => option.status === "recommended"
  ).length;
  const viable = options.filter((option) => option.status === "viable").length;
  const conditional = options.filter(
    (option) => option.status === "conditional"
  ).length;
  const notRecommended = options.filter(
    (option) => option.status === "not_recommended"
  ).length;

  const bestOption = options.reduce<BackendStackDecisionOption | null>(
    (best, option) => {
      if (!best || option.score > best.score) return option;
      return best;
    },
    null
  );

  return {
    total,
    recommended,
    viable,
    conditional,
    notRecommended,
    bestOption,
  };
}

export function buildBackendBuildGateSummary(items: BackendBuildGateItem[]) {
  const total = items.length;
  const ready = items.filter((item) => item.status === "ready").length;
  const conditional = items.filter((item) => item.status === "conditional").length;
  const blocked = items.filter((item) => item.status === "blocked").length;
  const criticalRisk = items.filter((item) => item.risk === "critical").length;

  const buildAllowed = blocked === 0 && total > 0;

  return {
    total,
    ready,
    conditional,
    blocked,
    criticalRisk,
    buildAllowed,
  };
}

export function buildBackendStackDecisionClosureSummary(
  items: BackendStackDecisionClosureItem[]
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

export function buildBackendStackDecisionReportText(params: {
  profile: CompanyProfile;
  options: BackendStackDecisionOption[];
  criteria: BackendStackDecisionCriterion[];
  gateItems: BackendBuildGateItem[];
  closureItems: BackendStackDecisionClosureItem[];
  stackSummary: ReturnType<typeof buildBackendStackDecisionSummary>;
  gateSummary: ReturnType<typeof buildBackendBuildGateSummary>;
  closureSummary: ReturnType<typeof buildBackendStackDecisionClosureSummary>;
  registrySummary: ReturnType<typeof buildOrbiModuleRegistrySummary>;
}): string {
  const {
    profile,
    options,
    criteria,
    gateItems,
    closureItems,
    stackSummary,
    gateSummary,
    closureSummary,
    registrySummary,
  } = params;

  const optionsText = options
    .map((option) => {
      return `STACK OPTION: ${option.title}
Estado: ${BACKEND_STACK_DECISION_STATUS_LABELS[option.status]}
Riesgo: ${BACKEND_STACK_DECISION_RISK_LABELS[option.risk]}
Score: ${option.score}%

Resumen:
${option.summary}

Fortalezas:
${option.strengths.map((entry) => `- ${entry}`).join("\n")}

Debilidades:
${option.weaknesses.map((entry) => `- ${entry}`).join("\n")}

Controles requeridos:
${option.requiredControls.map((entry) => `- ${entry}`).join("\n")}

Bloqueado si:
${option.blockedIf.map((entry) => `- ${entry}`).join("\n")}

Recomendación:
${option.recommendation}`;
    })
    .join("\n\n---\n\n");

  const criteriaText = criteria
    .map((criterion) => {
      return `CRITERIO: ${criterion.title}
Área: ${BACKEND_STACK_DECISION_AREA_LABELS[criterion.area]}
Peso: ${criterion.weight}%
Requerido para build: ${criterion.requiredForBuild ? "Sí" : "No"}

${criterion.description}`;
    })
    .join("\n\n");

  const gateText = gateItems
    .map((item) => {
      return `BUILD GATE: ${item.title}
Estado: ${BACKEND_BUILD_GATE_STATUS_LABELS[item.status]}
Decisión: ${BACKEND_BUILD_GATE_DECISION_LABELS[item.decision]}
Riesgo: ${BACKEND_STACK_DECISION_RISK_LABELS[item.risk]}

Resumen:
${item.summary}

Evidencia requerida:
${item.requiredEvidence.map((entry) => `- ${entry}`).join("\n")}

Bloqueado si falta:
${item.blockedIfMissing.map((entry) => `- ${entry}`).join("\n")}

Próxima acción:
${item.nextAction}`;
    })
    .join("\n\n---\n\n");

  const closureText = closureItems
    .map((item) => {
      return `${item.completed ? "✓" : "○"} ${item.title}
${item.description}`;
    })
    .join("\n\n");

  return `BACKEND STACK DECISION MATRIX — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

VERSIÓN ACTIVA
App version: ${ORBI_CHATBOX_APP_VERSION}
Bloque activo: ${ORBI_CHATBOX_ACTIVE_BLOCK}
Módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE}
Título módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE_TITLE}

STACK SUMMARY
Opciones: ${stackSummary.total}
Recomendadas: ${stackSummary.recommended}
Viables: ${stackSummary.viable}
Condicionales: ${stackSummary.conditional}
No recomendadas: ${stackSummary.notRecommended}
Mejor opción: ${stackSummary.bestOption?.title ?? "No definida"}
Score mejor opción: ${stackSummary.bestOption?.score ?? 0}%

BUILD GATE SUMMARY
Gates: ${gateSummary.total}
Listos: ${gateSummary.ready}
Condicionales: ${gateSummary.conditional}
Bloqueados: ${gateSummary.blocked}
Riesgo crítico: ${gateSummary.criticalRisk}
Build permitido: ${gateSummary.buildAllowed ? "Sí" : "No"}

CIERRE
Cierre completado: ${closureSummary.completed}/${closureSummary.total}
Progreso: ${closureSummary.progress}%

MODULE REGISTRY
Módulos registrados: ${registrySummary.total}
Completados: ${registrySummary.completed}
Activos: ${registrySummary.active}
Planificados: ${registrySummary.planned}

STACK OPTIONS
${optionsText}

CRITERIOS DE DECISIÓN
${criteriaText}

BUILD GATE
${gateText}

CIERRE
${closureText}

DECISIÓN
GO: matriz de stack y gate documental.
RECOMMENDED: Node.js + TypeScript + Express como primera opción.
CONDITIONAL GO: build futuro solo si todos los gates bloqueados se resuelven.
NO-GO: endpoint real, deploy, datos reales, WhatsApp real o secretos en frontend.

NOTA
Este módulo es local y documental. No crea backend, endpoints, APIs, fetch, axios, base de datos, localStorage nuevo, WhatsApp real ni despliegue.`;
}


// ==========================================
// MÓDULO 0K-12B.1 — Backend Receiver File Plan Types & Data
// ==========================================

export type BackendReceiverFileArea =
  | "server_entry"
  | "routes"
  | "middleware"
  | "validation"
  | "services"
  | "security"
  | "audit"
  | "types"
  | "tests"
  | "config";

export type BackendReceiverFileStatus =
  | "planned"
  | "required"
  | "blocked"
  | "future";

export type BackendReceiverFileRisk =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type BackendReceiverFileDecision =
  | "define_only"
  | "required_for_build"
  | "blocked_until_gate"
  | "future_phase";

export type BackendReceiverFilePlanItem = {
  id: string;
  path: string;
  title: string;
  area: BackendReceiverFileArea;
  status: BackendReceiverFileStatus;
  risk: BackendReceiverFileRisk;
  decision: BackendReceiverFileDecision;
  purpose: string;
  responsibilities: string[];
  mustNotContain: string[];
  dependsOn: string[];
  implementationOrder: number;
};

export type BackendReceiverDependencyPlanItem = {
  id: string;
  packageName: string;
  purpose: string;
  requiredForBuild: boolean;
  risk: BackendReceiverFileRisk;
  notes: string;
};

export type BackendReceiverTestPlanItem = {
  id: string;
  title: string;
  targetFile: string;
  testType: "unit" | "integration" | "security" | "contract";
  requiredBeforePreview: boolean;
  expectedCoverage: string[];
};

export type BackendReceiverFilePlanClosureItem = {
  id: string;
  title: string;
  completed: boolean;
  description: string;
};

export const BACKEND_RECEIVER_FILE_AREA_LABELS: Record<BackendReceiverFileArea, string> = {
  server_entry: "Server entry",
  routes: "Routes",
  middleware: "Middleware",
  validation: "Validation",
  services: "Services",
  security: "Security",
  audit: "Audit",
  types: "Types",
  tests: "Tests",
  config: "Config",
};

export const BACKEND_RECEIVER_FILE_STATUS_LABELS: Record<
  BackendReceiverFileStatus,
  string
> = {
  planned: "Planificado",
  required: "Requerido",
  blocked: "Bloqueado",
  future: "Futuro",
};

export const BACKEND_RECEIVER_FILE_RISK_LABELS: Record<BackendReceiverFileRisk, string> = {
  low: "Bajo",
  medium: "Medio",
  high: "Alto",
  critical: "Crítico",
};

export const BACKEND_RECEIVER_FILE_DECISION_LABELS: Record<
  BackendReceiverFileDecision,
  string
> = {
  define_only: "Solo definir",
  required_for_build: "Requerido para build",
  blocked_until_gate: "Bloqueado hasta gate",
  future_phase: "Fase futura",
};

export const BACKEND_RECEIVER_FILE_PLAN_ITEMS: BackendReceiverFilePlanItem[] = [
  {
    id: "file-server-index",
    path: "server/src/index.ts",
    title: "Entrada principal del servidor",
    area: "server_entry",
    status: "required",
    risk: "high",
    decision: "required_for_build",
    purpose:
      "Inicializar el servidor Express futuro, cargar configuración segura y montar rutas públicas controladas.",
    responsibilities: [
      "Crear instancia Express.",
      "Aplicar middlewares globales.",
      "Montar rutas del receiver.",
      "Exponer healthcheck futuro.",
      "Levantar servidor solo en ambiente backend.",
    ],
    mustNotContain: [
      "Credenciales hardcodeadas.",
      "Lógica de negocio extensa.",
      "Tokens reales.",
      "Configuración pública de secretos.",
    ],
    dependsOn: [
      "server/src/config/env.ts",
      "server/src/routes/publicWidgetReceiver.ts",
      "server/src/middleware/securityHeaders.ts",
    ],
    implementationOrder: 1,
  },
  {
    id: "file-config-env",
    path: "server/src/config/env.ts",
    title: "Carga segura de variables de entorno",
    area: "config",
    status: "required",
    risk: "critical",
    decision: "blocked_until_gate",
    purpose:
      "Centralizar lectura y validación de variables server-side sin exponer secretos al frontend.",
    responsibilities: [
      "Leer NODE_ENV.",
      "Leer ORBI_ALLOWED_ORIGINS.",
      "Leer configuración de rate limit.",
      "Validar variables requeridas.",
      "Fall back seguro si falta configuración crítica.",
    ],
    mustNotContain: [
      "Valores secretos reales.",
      "Tokens hardcodeados.",
      "Variables VITE públicas sensibles.",
      "Credenciales compartidas.",
    ],
    dependsOn: [
      ".env.example futuro",
      "Build Gate de secrets resuelto",
    ],
    implementationOrder: 2,
  },
  {
    id: "file-routes-public-widget",
    path: "server/src/routes/publicWidgetReceiver.ts",
    title: "Ruta pública del receiver web",
    area: "routes",
    status: "required",
    risk: "critical",
    decision: "blocked_until_gate",
    purpose:
      "Definir el endpoint futuro POST /api/public/widget/:publicKey/message con validación, rate limit, consentimiento y respuesta segura.",
    responsibilities: [
      "Recibir publicKey en ruta.",
      "Rechazar payload inválido.",
      "Aplicar schema validation.",
      "Ejecutar resolución de publicKey.",
      "Crear respuesta pública segura.",
      "No procesar datos si falta consentimiento.",
    ],
    mustNotContain: [
      "Procesamiento sin validación.",
      "Respuestas con stack trace.",
      "companyId aceptado desde cliente.",
      "Lógica de IA externa directa.",
    ],
    dependsOn: [
      "server/src/validation/widgetPayloadSchema.ts",
      "server/src/services/publicKeyResolver.ts",
      "server/src/services/widgetMessageReceiver.ts",
      "server/src/security/errorMap.ts",
    ],
    implementationOrder: 5,
  },
  {
    id: "file-validation-schema",
    path: "server/src/validation/widgetPayloadSchema.ts",
    title: "Schema validation del payload público",
    area: "validation",
    status: "required",
    risk: "critical",
    decision: "blocked_until_gate",
    purpose:
      "Validar estrictamente el payload del widget antes de cualquier procesamiento.",
    responsibilities: [
      "Validar message.",
      "Validar visitorName opcional.",
      "Validar visitorEmail opcional.",
      "Validar visitorPhone opcional.",
      "Validar consentAccepted.",
      "Rechazar campos desconocidos peligrosos.",
    ],
    mustNotContain: [
      "Validación permisiva.",
      "Aceptación de campos sensibles.",
      "Transformaciones inseguras.",
    ],
    dependsOn: [
      "server/src/types/widgetReceiver.ts",
      "Error Map 0K-9",
    ],
    implementationOrder: 3,
  },
  {
    id: "file-security-cors",
    path: "server/src/middleware/corsGuard.ts",
    title: "CORS Guard",
    area: "security",
    status: "required",
    risk: "critical",
    decision: "blocked_until_gate",
    purpose:
      "Permitir solo origins autorizados de ORBI, localhost o Vercel Preview aprobado.",
    responsibilities: [
      "Leer allowed origins desde env.",
      "Validar origin de request.",
      "Rechazar origins desconocidos.",
      "Registrar evento de bloqueo.",
    ],
    mustNotContain: [
      "CORS abierto con * en producción.",
      "Dominios no autorizados.",
      "Bypass silencioso.",
    ],
    dependsOn: [
      "server/src/config/env.ts",
      "Build Gate CORS resuelto",
    ],
    implementationOrder: 4,
  },
  {
    id: "file-security-rate-limit",
    path: "server/src/middleware/rateLimitGuard.ts",
    title: "Rate Limit Guard",
    area: "middleware",
    status: "required",
    risk: "critical",
    decision: "blocked_until_gate",
    purpose:
      "Proteger el endpoint futuro contra spam, abuso y exceso de mensajes.",
    responsibilities: [
      "Limitar por IP.",
      "Limitar por publicKey.",
      "Aplicar ventana temporal.",
      "Responder 429 seguro.",
      "Registrar intento bloqueado.",
    ],
    mustNotContain: [
      "Mensajes ilimitados.",
      "Dependencia de cliente para limitar abuso.",
      "Exposición de reglas internas exactas.",
    ],
    dependsOn: [
      "server/src/config/env.ts",
      "server/src/security/errorMap.ts",
      "Build Gate rate limit resuelto",
    ],
    implementationOrder: 4,
  },
  {
    id: "file-services-public-key",
    path: "server/src/services/publicKeyResolver.ts",
    title: "Resolución segura de publicKey",
    area: "services",
    status: "required",
    risk: "high",
    decision: "required_for_build",
    purpose:
      "Resolver una empresa/configuración interna desde una publicKey futura sin aceptar companyId desde frontend.",
    responsibilities: [
      "Buscar publicKey autorizada.",
      "Validar que esté activa.",
      "Retornar configuración pública segura.",
      "Evitar exponer IDs internos.",
    ],
    mustNotContain: [
      "companyId enviado por cliente.",
      "Datos privados de empresa.",
      "Credenciales.",
    ],
    dependsOn: [
      "server/src/types/widgetReceiver.ts",
      "Fuente de configuración futura",
    ],
    implementationOrder: 6,
  },
  {
    id: "file-services-receiver",
    path: "server/src/services/widgetMessageReceiver.ts",
    title: "Servicio receptor de mensaje web",
    area: "services",
    status: "required",
    risk: "high",
    decision: "required_for_build",
    purpose:
      "Coordinar validación final, Knowledge Answer Engine futuro, derivación y respuesta pública segura.",
    responsibilities: [
      "Recibir payload validado.",
      "Ejecutar Knowledge Engine server-side futuro.",
      "Detectar derivación humana.",
      "Preparar respuesta 202/400/429/500.",
      "Emitir AuditLog.",
    ],
    mustNotContain: [
      "IA externa sin gate.",
      "Persistencia real sin política.",
      "Envío de correos.",
      "WhatsApp real.",
    ],
    dependsOn: [
      "server/src/services/knowledgeAnswerEngine.ts",
      "server/src/audit/auditLogger.ts",
      "server/src/security/errorMap.ts",
    ],
    implementationOrder: 7,
  },
  {
    id: "file-services-knowledge",
    path: "server/src/services/knowledgeAnswerEngine.ts",
    title: "Knowledge Answer Engine server-side futuro",
    area: "services",
    status: "future",
    risk: "medium",
    decision: "future_phase",
    purpose:
      "Migrar o reutilizar la lógica local de Knowledge Base en el backend futuro.",
    responsibilities: [
      "Buscar respuestas públicas/controladas.",
      "Bloquear temas sensibles.",
      "Evitar invención.",
      "Sugerir derivación humana.",
    ],
    mustNotContain: [
      "Promesas productivas falsas.",
      "Datos internos no aprobados.",
      "IA externa sin autorización.",
    ],
    dependsOn: [
      "ORBI_ECOSYSTEM_KNOWLEDGE_ITEMS migrados a módulo compartido futuro",
    ],
    implementationOrder: 8,
  },
  {
    id: "file-security-error-map",
    path: "server/src/security/errorMap.ts",
    title: "Error Map seguro",
    area: "security",
    status: "required",
    risk: "high",
    decision: "required_for_build",
    purpose:
      "Implementar códigos públicos seguros definidos en 0K-9 sin exponer detalles internos.",
    responsibilities: [
      "Mapear INVALID_PAYLOAD.",
      "Mapear MISSING_CONSENT.",
      "Mapear INVALID_PUBLIC_KEY.",
      "Mapear RATE_LIMITED.",
      "Mapear INTERNAL_ERROR.",
      "Mapear SERVICE_UNAVAILABLE.",
    ],
    mustNotContain: [
      "Stack traces.",
      "Errores SQL.",
      "Detalles de infraestructura.",
      "Secretos.",
    ],
    dependsOn: [
      "Error Map 0K-9A.2",
    ],
    implementationOrder: 3,
  },
  {
    id: "file-audit-logger",
    path: "server/src/audit/auditLogger.ts",
    title: "Audit logger mínimo",
    area: "audit",
    status: "required",
    risk: "high",
    decision: "blocked_until_gate",
    purpose:
      "Registrar trazabilidad mínima por request sin almacenar secretos ni datos sensibles innecesarios.",
    responsibilities: [
      "Crear requestId.",
      "Registrar timestamp.",
      "Registrar resultado de validación.",
      "Registrar decisión segura.",
      "Evitar payload crudo sensible.",
    ],
    mustNotContain: [
      "Tokens.",
      "Contraseñas.",
      "Payload sensible completo.",
      "Datos privados no minimizados.",
    ],
    dependsOn: [
      "Build Gate audit log resuelto",
      "Política de datos mínima",
    ],
    implementationOrder: 6,
  },
  {
    id: "file-types-widget",
    path: "server/src/types/widgetReceiver.ts",
    title: "Tipos del receiver",
    area: "types",
    status: "required",
    risk: "medium",
    decision: "required_for_build",
    purpose:
      "Definir contratos TypeScript del payload, respuestas, errores y audit event.",
    responsibilities: [
      "Tipo WidgetPayload.",
      "Tipo SafePublicResponse.",
      "Tipo ReceiverErrorCode.",
      "Tipo AuditEvent.",
    ],
    mustNotContain: [
      "Tipos ambiguos any.",
      "Campos sensibles innecesarios.",
      "companyId público.",
    ],
    dependsOn: [
      "Contratos 0K-9B.1",
      "Response Contracts 0K-9B.1",
    ],
    implementationOrder: 2,
  },
  {
    id: "file-tests-receiver",
    path: "server/src/tests/publicWidgetReceiver.test.ts",
    title: "Pruebas mínimas del receiver",
    area: "tests",
    status: "required",
    risk: "high",
    decision: "blocked_until_gate",
    purpose:
      "Validar comportamiento mínimo del receiver antes de cualquier preview con endpoint real.",
    responsibilities: [
      "Test payload válido.",
      "Test payload inválido.",
      "Test consentimiento faltante.",
      "Test publicKey inválida.",
      "Test rate limit.",
      "Test error público seguro.",
    ],
    mustNotContain: [
      "Dependencia de datos reales.",
      "Credenciales reales.",
      "Snapshots con secretos.",
    ],
    dependsOn: [
      "server/src/routes/publicWidgetReceiver.ts",
      "server/src/security/errorMap.ts",
      "server/src/validation/widgetPayloadSchema.ts",
    ],
    implementationOrder: 9,
  },
];

export const BACKEND_RECEIVER_DEPENDENCY_PLAN_ITEMS: BackendReceiverDependencyPlanItem[] =
  [
    {
      id: "dep-express",
      packageName: "express",
      purpose: "Servidor HTTP mínimo para receiver backend.",
      requiredForBuild: true,
      risk: "medium",
      notes:
        "Recomendado como primera opción por simplicidad y facilidad de auditoría.",
    },
    {
      id: "dep-typescript",
      packageName: "typescript",
      purpose: "Tipado estricto de contratos backend.",
      requiredForBuild: true,
      risk: "low",
      notes:
        "Debe usarse con configuración estricta para evitar contratos ambiguos.",
    },
    {
      id: "dep-zod",
      packageName: "zod",
      purpose: "Schema validation del payload público.",
      requiredForBuild: true,
      risk: "low",
      notes:
        "Ayuda a validar payloads y rechazar campos inválidos antes de procesar.",
    },
    {
      id: "dep-cors",
      packageName: "cors",
      purpose: "Control de origins permitidos.",
      requiredForBuild: true,
      risk: "medium",
      notes:
        "Debe configurarse con allowlist, nunca abierto en producción.",
    },
    {
      id: "dep-rate-limit",
      packageName: "express-rate-limit",
      purpose: "Rate limit básico por IP para endpoint público.",
      requiredForBuild: true,
      risk: "high",
      notes:
        "Puede ser suficiente para MVP controlado; revisar storage si escala.",
    },
    {
      id: "dep-helmet",
      packageName: "helmet",
      purpose: "Headers básicos de seguridad.",
      requiredForBuild: true,
      risk: "low",
      notes:
        "Recomendado para hardening básico del backend Express.",
    },
    {
      id: "dep-vitest",
      packageName: "vitest",
      purpose: "Pruebas unitarias y de contrato.",
      requiredForBuild: true,
      risk: "low",
      notes:
        "Permite mantener consistencia con stack frontend si ya se usa.",
    },
  ];

export const BACKEND_RECEIVER_TEST_PLAN_ITEMS: BackendReceiverTestPlanItem[] = [
  {
    id: "test-valid-payload",
    title: "Payload válido retorna 202",
    targetFile: "server/src/routes/publicWidgetReceiver.ts",
    testType: "contract",
    requiredBeforePreview: true,
    expectedCoverage: [
      "message válido.",
      "consentAccepted true.",
      "publicKey válida.",
      "response pública segura.",
    ],
  },
  {
    id: "test-invalid-payload",
    title: "Payload inválido retorna 400",
    targetFile: "server/src/validation/widgetPayloadSchema.ts",
    testType: "unit",
    requiredBeforePreview: true,
    expectedCoverage: [
      "message vacío.",
      "campo no soportado.",
      "message demasiado largo.",
      "formato inválido.",
    ],
  },
  {
    id: "test-missing-consent",
    title: "Consentimiento faltante retorna error seguro",
    targetFile: "server/src/routes/publicWidgetReceiver.ts",
    testType: "security",
    requiredBeforePreview: true,
    expectedCoverage: [
      "consentAccepted false.",
      "consentAccepted ausente.",
      "no creación de lead real.",
    ],
  },
  {
    id: "test-rate-limit",
    title: "Rate limit retorna 429",
    targetFile: "server/src/middleware/rateLimitGuard.ts",
    testType: "security",
    requiredBeforePreview: true,
    expectedCoverage: [
      "exceso por IP.",
      "exceso por publicKey.",
      "mensaje público seguro.",
    ],
  },
  {
    id: "test-error-map",
    title: "Error map no expone detalles internos",
    targetFile: "server/src/security/errorMap.ts",
    testType: "security",
    requiredBeforePreview: true,
    expectedCoverage: [
      "INTERNAL_ERROR sin stack.",
      "INVALID_PUBLIC_KEY genérico.",
      "SERVICE_UNAVAILABLE genérico.",
    ],
  },
];

export const BACKEND_RECEIVER_FILE_PLAN_CLOSURE_ITEMS: BackendReceiverFilePlanClosureItem[] =
  [
    {
      id: "closure-file-plan-created",
      title: "File Plan futuro creado",
      completed: true,
      description:
        "Se documentó la estructura futura del backend receiver sin crear archivos reales.",
    },
    {
      id: "closure-dependencies-planned",
      title: "Dependencias futuras planificadas",
      completed: true,
      description:
        "Se listaron dependencias candidatas para Express, validación, CORS, rate limit, seguridad y testing.",
    },
    {
      id: "closure-tests-planned",
      title: "Plan de pruebas futuras creado",
      completed: true,
      description:
        "Se definieron pruebas mínimas de contrato, seguridad, validación y rate limit.",
    },
    {
      id: "closure-build-still-blocked",
      title: "Build real sigue bloqueado",
      completed: true,
      description:
        "0K-12B.1 no crea archivos físicos, servidor, endpoint real ni dependencias instaladas.",
    },
  ];

export function buildBackendReceiverFilePlanSummary(items: BackendReceiverFilePlanItem[]) {
  const total = items.length;
  const required = items.filter((item) => item.status === "required").length;
  const planned = items.filter((item) => item.status === "planned").length;
  const blocked = items.filter((item) => item.status === "blocked").length;
  const future = items.filter((item) => item.status === "future").length;
  const criticalRisk = items.filter((item) => item.risk === "critical").length;

  return {
    total,
    required,
    planned,
    blocked,
    future,
    criticalRisk,
  };
}

export function buildBackendReceiverDependencySummary(
  items: BackendReceiverDependencyPlanItem[]
) {
  const total = items.length;
  const required = items.filter((item) => item.requiredForBuild).length;
  const highRisk = items.filter(
    (item) => item.risk === "high" || item.risk === "critical"
  ).length;

  return {
    total,
    required,
    highRisk,
  };
}

export function buildBackendReceiverTestPlanSummary(items: BackendReceiverTestPlanItem[]) {
  const total = items.length;
  const requiredBeforePreview = items.filter(
    (item) => item.requiredBeforePreview
  ).length;
  const security = items.filter((item) => item.testType === "security").length;
  const contract = items.filter((item) => item.testType === "contract").length;

  return {
    total,
    requiredBeforePreview,
    security,
    contract,
  };
}

export function buildBackendReceiverFilePlanClosureSummary(
  items: BackendReceiverFilePlanClosureItem[]
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

export function buildBackendReceiverFilePlanReportText(params: {
  profile: CompanyProfile;
  fileItems: BackendReceiverFilePlanItem[];
  dependencies: BackendReceiverDependencyPlanItem[];
  tests: BackendReceiverTestPlanItem[];
  closureItems: BackendReceiverFilePlanClosureItem[];
  fileSummary: ReturnType<typeof buildBackendReceiverFilePlanSummary>;
  dependencySummary: ReturnType<typeof buildBackendReceiverDependencySummary>;
  testSummary: ReturnType<typeof buildBackendReceiverTestPlanSummary>;
  closureSummary: ReturnType<typeof buildBackendReceiverFilePlanClosureSummary>;
  registrySummary: ReturnType<typeof buildOrbiModuleRegistrySummary>;
}): string {
  const {
    profile,
    fileItems,
    dependencies,
    tests,
    closureItems,
    fileSummary,
    dependencySummary,
    testSummary,
    closureSummary,
    registrySummary,
  } = params;

  const fileText = fileItems
    .map((item) => {
      return `FILE PLAN ITEM: ${item.path}
Título: ${item.title}
Área: ${BACKEND_RECEIVER_FILE_AREA_LABELS[item.area]}
Estado: ${BACKEND_RECEIVER_FILE_STATUS_LABELS[item.status]}
Riesgo: ${BACKEND_RECEIVER_FILE_RISK_LABELS[item.risk]}
Decisión: ${BACKEND_RECEIVER_FILE_DECISION_LABELS[item.decision]}
Orden implementación: ${item.implementationOrder}

Propósito:
${item.purpose}

Responsabilidades:
${item.responsibilities.map((entry) => `- ${entry}`).join("\n")}

No debe contener:
${item.mustNotContain.map((entry) => `- ${entry}`).join("\n")}

Depende de:
${item.dependsOn.map((entry) => `- ${entry}`).join("\n")}`;
    })
    .join("\n\n---\n\n");

  const dependencyText = dependencies
    .map((item) => {
      return `DEPENDENCY: ${item.packageName}
Propósito: ${item.purpose}
Requerida para build: ${item.requiredForBuild ? "Sí" : "No"}
Riesgo: ${BACKEND_RECEIVER_FILE_RISK_LABELS[item.risk]}
Notas: ${item.notes}`;
    })
    .join("\n\n");

  const testText = tests
    .map((item) => {
      return `TEST PLAN: ${item.title}
Archivo objetivo: ${item.targetFile}
Tipo: ${item.testType}
Requerido antes de preview: ${item.requiredBeforePreview ? "Sí" : "No"}

Cobertura esperada:
${item.expectedCoverage.map((entry) => `- ${entry}`).join("\n")}`;
    })
    .join("\n\n---\n\n");

  const closureText = closureItems
    .map((item) => {
      return `${item.completed ? "✓" : "○"} ${item.title}
${item.description}`;
    })
    .join("\n\n");

  return `BACKEND RECEIVER FILE PLAN — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

VERSIÓN ACTIVA
App version: ${ORBI_CHATBOX_APP_VERSION}
Bloque activo: ${ORBI_CHATBOX_ACTIVE_BLOCK}
Módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE}
Título módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE_TITLE}

FILE PLAN SUMMARY
Archivos planificados: ${fileSummary.total}
Requeridos: ${fileSummary.required}
Planificados: ${fileSummary.planned}
Bloqueados: ${fileSummary.blocked}
Futuros: ${fileSummary.future}
Riesgo crítico: ${fileSummary.criticalRisk}

DEPENDENCY SUMMARY
Dependencias: ${dependencySummary.total}
Requeridas: ${dependencySummary.required}
Riesgo alto/crítico: ${dependencySummary.highRisk}

TEST PLAN SUMMARY
Pruebas: ${testSummary.total}
Requeridas antes preview: ${testSummary.requiredBeforePreview}
Seguridad: ${testSummary.security}
Contrato: ${testSummary.contract}

CIERRE
Cierre completado: ${closureSummary.completed}/${closureSummary.total}
Progreso: ${closureSummary.progress}%

MODULE REGISTRY
Módulos registrados: ${registrySummary.total}
Completados: ${registrySummary.completed}
Activos: ${registrySummary.active}
Planificados: ${registrySummary.planned}

FILE PLAN
${fileText}

DEPENDENCIAS FUTURAS
${dependencyText}

TEST PLAN
${testText}

CIERRE
${closureText}

DECISIÓN
GO: estructura futura documentada.
CONDITIONAL GO: build futuro solo después de resolver gates bloqueados.
NO-GO: crear archivos reales, endpoint real, deploy, datos reales o secretos en frontend.

NOTA
Este módulo es local y documental. No crea backend, carpetas, archivos físicos, endpoints, APIs, fetch, axios, base de datos, localStorage nuevo, WhatsApp real ni despliegue.`;
}


// ==========================================
// MÓDULO 0K-12B.2 — Backend Receiver Build Readiness Types & Data
// ==========================================

export type BackendReceiver12ReadinessArea =
  | "stack_decision"
  | "build_gate"
  | "file_plan"
  | "dependencies"
  | "tests"
  | "security"
  | "environment"
  | "data_policy"
  | "production_blocker"
  | "next_phase";

export type BackendReceiver12ReadinessStatus =
  | "ready"
  | "conditional"
  | "blocked"
  | "not_ready";

export type BackendReceiver12ReadinessFinalDecision =
  | "go_plan_complete"
  | "conditional_controlled_build"
  | "not_ready_for_build"
  | "no_go_build";

export type BackendReceiver12ReadinessItem = {
  id: string;
  title: string;
  area: BackendReceiver12ReadinessArea;
  status: BackendReceiver12ReadinessStatus;
  score: number;
  summary: string;
  evidenceCompleted: string[];
  requiredBeforeBuild: string[];
  blockers: string[];
  nextAction: string;
};

export type BackendReceiver12ReadinessClosureItem = {
  id: string;
  title: string;
  completed: boolean;
  description: string;
};

export const BACKEND_RECEIVER_12_READINESS_AREA_LABELS: Record<
  BackendReceiver12ReadinessArea,
  string
> = {
  stack_decision: "Decisión stack",
  build_gate: "Build Gate",
  file_plan: "File Plan",
  dependencies: "Dependencias",
  tests: "Pruebas",
  security: "Seguridad",
  environment: "Variables entorno",
  data_policy: "Política datos",
  production_blocker: "Bloqueo producción",
  next_phase: "Siguiente fase",
};

export const BACKEND_RECEIVER_12_READINESS_STATUS_LABELS: Record<
  BackendReceiver12ReadinessStatus,
  string
> = {
  ready: "Listo",
  conditional: "Condicional",
  blocked: "Bloqueado",
  not_ready: "No listo",
};

export const BACKEND_RECEIVER_12_READINESS_FINAL_DECISION_LABELS: Record<
  BackendReceiver12ReadinessFinalDecision,
  string
> = {
  go_plan_complete: "GO Plan Completo",
  conditional_controlled_build: "CONDITIONAL GO Build Controlado",
  not_ready_for_build: "NO LISTO para Build",
  no_go_build: "NO-GO Build",
};

export const BACKEND_RECEIVER_12_READINESS_ITEMS: BackendReceiver12ReadinessItem[] = [
  {
    id: "readiness-stack-decision",
    title: "Stack backend recomendado definido",
    area: "stack_decision",
    status: "ready",
    score: 95,
    summary:
      "Node.js + TypeScript + Express quedó recomendado como primera opción para el receiver mínimo controlado.",
    evidenceCompleted: [
      "Matriz de stack implementada.",
      "Express evaluado con score 88%.",
      "Fastify, Vercel Functions y backend separado comparados.",
      "Criterios ponderados documentados.",
    ],
    requiredBeforeBuild: [
      "Confirmar que Simon acepta Express como stack inicial.",
      "Definir si el backend vivirá en el mismo repo o repo separado.",
    ],
    blockers: [
      "Cambio de stack sin actualizar File Plan.",
      "Uso de Vercel Functions sin resolver límites de rate limit/logs.",
    ],
    nextAction:
      "Mantener Express como opción base para el primer build controlado.",
  },
  {
    id: "readiness-build-gate",
    title: "Build Gate creado pero con gates críticos pendientes",
    area: "build_gate",
    status: "blocked",
    score: 55,
    summary:
      "El Build Gate ya está definido, pero todavía mantiene bloqueos críticos en secrets, rate limit y política de datos.",
    evidenceCompleted: [
      "6 gates definidos.",
      "Stack gate documentado.",
      "CORS gate documentado.",
      "Audit log gate documentado.",
    ],
    requiredBeforeBuild: [
      "Resolver manejo de secrets server-side.",
      "Definir rate limit inicial.",
      "Definir política mínima de datos.",
      "Definir .env.example seguro.",
    ],
    blockers: [
      "Variables y secretos server-side aún bloqueados.",
      "Rate limit aún bloqueado.",
      "Política mínima de datos aún bloqueada.",
    ],
    nextAction:
      "No construir backend real hasta transformar estos gates en checklist técnico cerrado.",
  },
  {
    id: "readiness-file-plan",
    title: "File Plan futuro documentado",
    area: "file_plan",
    status: "ready",
    score: 96,
    summary:
      "La estructura futura de archivos, rutas, responsabilidades, dependencias y orden de implementación quedó documentada.",
    evidenceCompleted: [
      "13 archivos futuros definidos.",
      "Rutas server/src documentadas.",
      "Responsabilidades por archivo definidas.",
      "Contenido prohibido por archivo definido.",
      "Orden de implementación documentado.",
    ],
    requiredBeforeBuild: [
      "Crear archivos reales solo en fase 0K-13 o build autorizado.",
      "Validar estructura con Simon antes de codificar.",
    ],
    blockers: [
      "Crear archivos físicos antes de resolver gates críticos.",
      "Instalar dependencias antes de aprobar build controlado.",
    ],
    nextAction:
      "Usar File Plan como blueprint directo para el primer build real controlado.",
  },
  {
    id: "readiness-dependencies",
    title: "Dependencias candidatas definidas",
    area: "dependencies",
    status: "conditional",
    score: 82,
    summary:
      "Las dependencias candidatas están definidas, pero aún no deben instalarse hasta iniciar build controlado.",
    evidenceCompleted: [
      "express definido.",
      "typescript definido.",
      "zod definido.",
      "cors definido.",
      "express-rate-limit definido.",
      "helmet definido.",
      "vitest definido.",
    ],
    requiredBeforeBuild: [
      "Revisar package.json actual.",
      "Definir si habrá package backend separado.",
      "Validar compatibilidad con entorno de Google IA Studio o repo local.",
    ],
    blockers: [
      "Instalar paquetes sin plan de build.",
      "Mezclar dependencias backend con frontend sin criterio.",
    ],
    nextAction:
      "Instalar dependencias solo cuando se apruebe fase de construcción real.",
  },
  {
    id: "readiness-tests",
    title: "Plan de pruebas mínimas definido",
    area: "tests",
    status: "ready",
    score: 90,
    summary:
      "Se definieron pruebas mínimas obligatorias antes de cualquier preview con endpoint real.",
    evidenceCompleted: [
      "Test payload válido 202.",
      "Test payload inválido 400.",
      "Test consentimiento faltante.",
      "Test rate limit 429.",
      "Test error map seguro.",
    ],
    requiredBeforeBuild: [
      "Crear entorno de testing backend.",
      "Implementar pruebas junto con cada archivo crítico.",
      "Ejecutar tests antes de Vercel Preview o deploy backend.",
    ],
    blockers: [
      "Endpoint real sin tests.",
      "Rate limit sin test.",
      "Error map sin test de no exposición.",
    ],
    nextAction:
      "Mantener pruebas como requisito obligatorio de 0K-13.",
  },
  {
    id: "readiness-security",
    title: "Seguridad mínima definida pero no ejecutable",
    area: "security",
    status: "conditional",
    score: 76,
    summary:
      "CORS, rate limit, error map, audit log y bloqueo de secretos están definidos conceptualmente, pero aún no existen como código backend ejecutable.",
    evidenceCompleted: [
      "CORS guard planificado.",
      "Rate limit guard planificado.",
      "Error map planificado.",
      "Audit logger planificado.",
      "Contenido prohibido documentado.",
    ],
    requiredBeforeBuild: [
      "Convertir reglas en middleware real.",
      "Agregar pruebas de seguridad.",
      "Verificar que no existan secretos en frontend.",
    ],
    blockers: [
      "CORS abierto.",
      "Endpoint sin rate limit.",
      "Logs con payload sensible.",
      "Secrets en React/Vite.",
    ],
    nextAction:
      "Crear seguridad antes o junto con la ruta receiver, nunca después.",
  },
  {
    id: "readiness-environment",
    title: "Variables de entorno futuras definidas",
    area: "environment",
    status: "conditional",
    score: 74,
    summary:
      "Las variables server-side fueron listadas, pero falta convertirlas en `.env.example` seguro y validación real.",
    evidenceCompleted: [
      "NODE_ENV definido.",
      "ORBI_ALLOWED_ORIGINS definido.",
      "ORBI_DEMO_WIDGET_PUBLIC_KEY definido.",
      "ORBI_WIDGET_RATE_LIMIT_WINDOW definido.",
      "ORBI_AUDIT_LOG_ENABLED definido.",
      "ORBI_DATABASE_URL definido como futuro opcional.",
    ],
    requiredBeforeBuild: [
      "Crear .env.example sin secretos reales.",
      "Validar variables obligatorias.",
      "Definir secretos en hosting si aplica.",
    ],
    blockers: [
      ".env real commiteado.",
      "Tokens en frontend.",
      "Variables VITE con secretos.",
    ],
    nextAction:
      "Antes de build real, crear política de variables y ejemplo seguro.",
  },
  {
    id: "readiness-data-policy",
    title: "Política de datos mínima aún pendiente",
    area: "data_policy",
    status: "blocked",
    score: 50,
    summary:
      "La política mínima de datos sigue siendo un bloqueo antes de recibir datos reales.",
    evidenceCompleted: [
      "Regla de datos ficticios definida.",
      "Consentimiento demo documentado.",
      "Minimización de datos recomendada.",
    ],
    requiredBeforeBuild: [
      "Definir texto preliminar de consentimiento.",
      "Definir campos mínimos permitidos.",
      "Definir regla de retención/eliminación.",
      "Mantener NO-GO datos reales hasta revisión.",
    ],
    blockers: [
      "Captura de datos reales sin política.",
      "Correos/teléfonos reales en preview.",
      "Sin regla de eliminación.",
    ],
    nextAction:
      "Mantener pruebas con datos ficticios hasta que exista política mínima formal.",
  },
  {
    id: "readiness-production-blocker",
    title: "Producción sigue bloqueada",
    area: "production_blocker",
    status: "blocked",
    score: 20,
    summary:
      "El bloque 0K-12 no autoriza producción, endpoint público real, deploy, WhatsApp real ni recepción de datos reales.",
    evidenceCompleted: [
      "NO-GO producción declarado.",
      "NO-GO endpoint real declarado.",
      "NO-GO WhatsApp real declarado.",
      "NO-GO datos reales declarado.",
    ],
    requiredBeforeBuild: [
      "Completar 0K-13 build controlado.",
      "Pasar QA backend.",
      "Resolver seguridad y política de datos.",
      "Validar hosting y rollback.",
    ],
    blockers: [
      "Deploy productivo.",
      "Endpoint público sin QA.",
      "WhatsApp real.",
      "Datos reales.",
    ],
    nextAction:
      "Mantener producción bloqueada hasta una fase posterior expresamente aprobada.",
  },
  {
    id: "readiness-next-phase",
    title: "Siguiente fase: Controlled Backend Build",
    area: "next_phase",
    status: "conditional",
    score: 80,
    summary:
      "La siguiente fase puede ser 0K-13, enfocada en construir un backend mínimo controlado, pero solo si se mantiene alcance local/dev y sin datos reales.",
    evidenceCompleted: [
      "0K-9 Backend Receiver Foundation cerrado.",
      "0K-10 Knowledge Base cerrado.",
      "0K-11 Website Controlled Test Pack cerrado.",
      "0K-12 Minimal Backend Plan casi cerrado.",
    ],
    requiredBeforeBuild: [
      "Resolver gates críticos o limitar 0K-13 a scaffold local sin deploy.",
      "Crear backend solo en ambiente de desarrollo.",
      "Mantener datos ficticios.",
    ],
    blockers: [
      "Intentar producción directa.",
      "Conectar WhatsApp real.",
      "Recibir clientes reales.",
    ],
    nextAction:
      "Después de cerrar 0K-12, iniciar 0K-13 con scaffold local controlado o resolver gates antes.",
  },
];

export const BACKEND_RECEIVER_12_READINESS_CLOSURE_ITEMS: BackendReceiver12ReadinessClosureItem[] =
  [
    {
      id: "closure-minimal-backend-plan",
      title: "Minimal Backend Receiver Build Plan creado",
      completed: true,
      description:
        "Se definió arquitectura mínima, endpoint futuro, variables server-side, CORS, rate limit, audit log y política de datos.",
    },
    {
      id: "closure-stack-decision",
      title: "Backend Stack Decision Matrix completada",
      completed: true,
      description:
        "Se compararon stacks y se recomendó Node.js + TypeScript + Express para el receiver mínimo.",
    },
    {
      id: "closure-build-gate",
      title: "Build Gate documentado",
      completed: true,
      description:
        "Se definieron gates de stack, secrets, CORS, rate limit, audit log y política de datos.",
    },
    {
      id: "closure-file-plan",
      title: "Backend Receiver File Plan completado",
      completed: true,
      description:
        "Se documentó la estructura futura de archivos, dependencias y pruebas mínimas.",
    },
    {
      id: "closure-readiness-final",
      title: "Build Readiness final documentado",
      completed: true,
      description:
        "Se documenta decisión final de avance, bloqueos críticos y siguiente fase.",
    },
    {
      id: "closure-real-build-blocked",
      title: "Build real sigue bloqueado",
      completed: true,
      description:
        "0K-12 no crea backend real, carpetas, archivos físicos, endpoints, deploy, WhatsApp real ni datos reales.",
    },
  ];

export function buildBackendReceiver12ReadinessSummary(
  items: BackendReceiver12ReadinessItem[]
) {
  const total = items.length;
  const ready = items.filter((item) => item.status === "ready").length;
  const conditional = items.filter((item) => item.status === "conditional").length;
  const blocked = items.filter((item) => item.status === "blocked").length;
  const notReady = items.filter((item) => item.status === "not_ready").length;

  const averageScore =
    total === 0
      ? 0
      : Math.round(items.reduce((sum, item) => sum + item.score, 0) / total);

  return {
    total,
    ready,
    conditional,
    blocked,
    notReady,
    averageScore,
  };
}

export function getBackendReceiver12ReadinessFinalDecision(
  summary: ReturnType<typeof buildBackendReceiver12ReadinessSummary>
): BackendReceiver12ReadinessFinalDecision {
  if (summary.blocked >= 3) {
    return "not_ready_for_build";
  }

  if (summary.blocked > 0) {
    return "conditional_controlled_build";
  }

  if (summary.averageScore >= 85) {
    return "go_plan_complete";
  }

  return "no_go_build";
}

export function buildBackendReceiver12ReadinessFinalDecisionText(
  decision: BackendReceiver12ReadinessFinalDecision
) {
  if (decision === "go_plan_complete") {
    return "GO PLAN COMPLETO: el bloque 0K-12 queda cerrado como planificación técnica completa. La construcción real sigue sujeta a aprobación explícita del siguiente bloque.";
  }

  if (decision === "conditional_controlled_build") {
    return "CONDITIONAL GO: puede prepararse una construcción backend local/controlada, pero sin deploy, sin datos reales y resolviendo primero los gates críticos.";
  }

  if (decision === "not_ready_for_build") {
    return "NO LISTO PARA BUILD REAL: existen bloqueos críticos suficientes para impedir crear endpoint real o recibir datos reales.";
  }

  return "NO-GO BUILD: no se debe avanzar a construcción hasta corregir readiness, seguridad, datos y gates críticos.";
}

export function buildBackendReceiver12ReadinessClosureSummary(
  items: BackendReceiver12ReadinessClosureItem[]
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

export function buildBackendReceiver12ReadinessFinalReportText(params: {
  profile: CompanyProfile;
  items: BackendReceiver12ReadinessItem[];
  closureItems: BackendReceiver12ReadinessClosureItem[];
  readinessSummary: ReturnType<typeof buildBackendReceiver12ReadinessSummary>;
  finalDecision: BackendReceiver12ReadinessFinalDecision;
  finalDecisionText: string;
  closureSummary: ReturnType<typeof buildBackendReceiver12ReadinessClosureSummary>;
  registrySummary: ReturnType<typeof buildOrbiModuleRegistrySummary>;
}): string {
  const {
    profile,
    items,
    closureItems,
    readinessSummary,
    finalDecision,
    finalDecisionText,
    closureSummary,
    registrySummary,
  } = params;

  const itemsText = items
    .map((item) => {
      return `BACKEND BUILD READINESS ITEM: ${item.title}
Área: ${BACKEND_RECEIVER_12_READINESS_AREA_LABELS[item.area]}
Estado: ${BACKEND_RECEIVER_12_READINESS_STATUS_LABELS[item.status]}
Score: ${item.score}%

Resumen:
${item.summary}

Evidencia completada:
${item.evidenceCompleted.map((entry) => `- ${entry}`).join("\n")}

Requerido antes de build:
${item.requiredBeforeBuild.map((entry) => `- ${entry}`).join("\n")}

Bloqueos:
${item.blockers.map((entry) => `- ${entry}`).join("\n")}

Próxima acción:
${item.nextAction}`;
    })
    .join("\n\n---\n\n");

  const closureText = closureItems
    .map((item) => {
      return `${item.completed ? "✓" : "○"} ${item.title}
${item.description}`;
    })
    .join("\n\n");

  return `BACKEND RECEIVER BUILD READINESS FINAL — ORBI CHATBOX IA CORE

Empresa activa:
${profile.brandName}

Asistente:
${profile.assistantName}

VERSIÓN ACTIVA
App version: ${ORBI_CHATBOX_APP_VERSION}
Bloque activo: ${ORBI_CHATBOX_ACTIVE_BLOCK}
Módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE}
Título módulo activo: ${ORBI_CHATBOX_ACTIVE_MODULE_TITLE}

READINESS SUMMARY
Ítems: ${readinessSummary.total}
Listos: ${readinessSummary.ready}
Condicionales: ${readinessSummary.conditional}
Bloqueados: ${readinessSummary.blocked}
No listos: ${readinessSummary.notReady}
Score promedio: ${readinessSummary.averageScore}%

DECISIÓN FINAL
${BACKEND_RECEIVER_12_READINESS_FINAL_DECISION_LABELS[finalDecision]}
${finalDecisionText}

CIERRE BLOQUE 0K-12
Cierre completado: ${closureSummary.completed}/${closureSummary.total}
Progreso: ${closureSummary.progress}%

MODULE REGISTRY
Módulos registrados: ${registrySummary.total}
Completados: ${registrySummary.completed}
Activos: ${registrySummary.active}
Planificados: ${registrySummary.planned}

READINESS ITEMS
${itemsText}

CIERRE
${closureText}

DECISIÓN DE ALCANCE
GO: bloque 0K-12 completo como planificación técnica.
CONDITIONAL GO: próximo bloque puede preparar scaffold local controlado si se mantiene sin deploy ni datos reales.
NO-GO: endpoint público real, producción, WhatsApp real, datos reales, DB real o secretos en frontend.

NOTA
Este cierre es local y documental. No crea backend, carpetas, archivos físicos, endpoints, APIs, fetch, axios, base de datos, localStorage nuevo, WhatsApp real ni despliegue.`;
}


