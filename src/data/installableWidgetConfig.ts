import type { OrbiInstallableWidgetConfig } from "../types/installableWidgetConfig";

export const orbiDemoInstallableWidgetConfig: OrbiInstallableWidgetConfig = {
  mode: "sandbox",
  brand: {
    clientId: "orbi-demo",
    brandName: "ORBI Ecosystem",
    assistantName: "ORBI Assistant",
  },
  channels: {
    webChat: true,
    whatsapp: true,
    voice: false,
  },
  chatbox: {
    receiverUrl: "http://127.0.0.1:8787",
    publicKey: "orbi_demo_widget_key",
    realDataAllowed: false,
  },
  whatsapp: {
    enabled: true,
    mode: "manual",
    phoneNumber: "",
    defaultMessage: "Hola ORBI Ecosystem. Vengo desde la web y necesito información.",
    automationAllowed: false,
  },
  voice: {
    enabled: false,
    status: "future",
  },
  guardrails: {
    productionAllowed: false,
    realCustomerDataAllowed: false,
    externalAiAllowed: false,
    whatsappAutomationAllowed: false,
    databasePersistenceAllowed: false,
  },
};

// Preview template only: no secrets, no real phone number, and no automation or production access.
export const clientPreviewTemplateConfig: OrbiInstallableWidgetConfig = {
  mode: "preview",
  brand: {
    clientId: "client-preview-template",
    brandName: "Cliente Demo",
    assistantName: "Asistente IA",
  },
  channels: {
    webChat: true,
    whatsapp: true,
    voice: false,
  },
  chatbox: {
    receiverUrl: "https://controlled-backend.example",
    publicKey: "preview_public_key",
    realDataAllowed: false,
  },
  whatsapp: {
    enabled: true,
    mode: "manual",
    phoneNumber: "",
    defaultMessage: "Hola. Vengo desde la web de prueba y necesito información.",
    automationAllowed: false,
  },
  voice: {
    enabled: false,
    status: "future",
  },
  guardrails: {
    productionAllowed: false,
    realCustomerDataAllowed: false,
    externalAiAllowed: false,
    whatsappAutomationAllowed: false,
    databasePersistenceAllowed: false,
  },
};
