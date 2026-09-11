import { WhatsAppDeliveryAdapter } from "../adapters/whatsAppDeliveryAdapter.js";
import {
  WhatsAppGraphClient,
  type WhatsAppGraphTransport,
} from "../channels/whatsapp/whatsappGraphClient.js";
import type { WhatsAppInboundTextEvent } from "../channels/whatsapp/whatsappInboundText.js";
import type { WhatsAppRuntimeConfig } from "../config/whatsappRuntimeConfig.js";
import type { ChannelDeliveryAdapter } from "../types/channelDeliveryAdapter.js";
import type { CommercialRuntimeExecution } from "./commercialRuntimeExecution.js";

export type WhatsAppProductionOutboundIntegration = Readonly<{
  createDeliveryAdapter: (
    event: Readonly<WhatsAppInboundTextEvent>,
  ) => ChannelDeliveryAdapter;
}>;

export type WhatsAppProductionComposition = Readonly<{
  commercialRuntime: CommercialRuntimeExecution;
  outboundIntegration: WhatsAppProductionOutboundIntegration;
}>;

export type WhatsAppProductionCompositionInput = Readonly<{
  config: Readonly<WhatsAppRuntimeConfig>;
  commercialRuntime: CommercialRuntimeExecution;
  transport?: WhatsAppGraphTransport;
}>;

/**
 * Explicit production composition boundary for WhatsApp.
 *
 * This factory only wires already-certified components together. It does not
 * enable WhatsApp, unlock native sends, alter the default ORBI client profile,
 * or mount the composition into the application. Native delivery remains
 * governed by the existing WhatsApp live-send safety guards.
 */
export const createWhatsAppProductionComposition = (
  input: WhatsAppProductionCompositionInput,
): WhatsAppProductionComposition => {
  const client = input.transport
    ? new WhatsAppGraphClient(input.config, input.transport)
    : new WhatsAppGraphClient(input.config);

  const outboundIntegration: WhatsAppProductionOutboundIntegration = Object.freeze({
    createDeliveryAdapter: (event) =>
      new WhatsAppDeliveryAdapter(
        client,
        () => Object.freeze({ recipient: event.externalUserId }),
      ),
  });

  return Object.freeze({
    commercialRuntime: input.commercialRuntime,
    outboundIntegration,
  });
};
