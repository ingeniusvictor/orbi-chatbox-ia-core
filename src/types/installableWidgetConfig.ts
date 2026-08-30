export type OrbiWidgetMode = "demo" | "sandbox" | "preview" | "production";

export type OrbiWidgetChannelConfig = {
  webChat: boolean;
  whatsapp: boolean;
  voice: boolean;
};

export type OrbiWidgetBrandConfig = {
  clientId: string;
  brandName: string;
  assistantName: string;
  primaryColor?: string;
  logoUrl?: string;
};

export type OrbiWidgetChatboxConfig = {
  receiverUrl: string;
  publicKey: string;
  realDataAllowed: boolean;
};

export type OrbiWidgetWhatsAppConfig = {
  enabled: boolean;
  mode: "manual" | "business_api_future";
  phoneNumber: string;
  defaultMessage: string;
  automationAllowed: boolean;
};

export type OrbiWidgetVoiceConfig = {
  enabled: boolean;
  status: "disabled" | "future";
};

export type OrbiInstallableWidgetConfig = {
  mode: OrbiWidgetMode;
  brand: OrbiWidgetBrandConfig;
  channels: OrbiWidgetChannelConfig;
  chatbox: OrbiWidgetChatboxConfig;
  whatsapp: OrbiWidgetWhatsAppConfig;
  voice: OrbiWidgetVoiceConfig;
  guardrails: {
    productionAllowed: boolean;
    realCustomerDataAllowed: boolean;
    externalAiAllowed: boolean;
    whatsappAutomationAllowed: boolean;
    databasePersistenceAllowed: boolean;
  };
};

// This type-level helper does not grant production access. Project policy still blocks production runtime activation.
export const isProductionConfigAllowed = (config: OrbiInstallableWidgetConfig) => {
  return (
    config.mode === "production" &&
    config.guardrails.productionAllowed === true &&
    config.chatbox.realDataAllowed === true &&
    config.guardrails.realCustomerDataAllowed === true
  );
};
