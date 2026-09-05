import type { ChannelDeliveryAdapter } from "../types/channelDeliveryAdapter.js";
import {
  validateOutboundDeliveryRequest,
  validateOutboundDeliveryResult,
  type OutboundDeliveryRequest,
  type OutboundDeliveryResult,
} from "../types/outboundDelivery.js";

/**
 * Local reference only: "delivered" means a validated web/widget response has
 * been handed back to the existing HTTP boundary. It is not a user receipt.
 */
export const webReferenceDeliveryAdapter: ChannelDeliveryAdapter = Object.freeze({
  async deliver(request: Readonly<OutboundDeliveryRequest>): Promise<Readonly<OutboundDeliveryResult>> {
    const safe = validateOutboundDeliveryRequest(request);
    if (safe.channel !== "web" && safe.channel !== "widget") {
      return validateOutboundDeliveryResult({
        deliveryId: safe.deliveryId,
        channel: safe.channel,
        status: "failed",
        completedAt: new Date().toISOString(),
        errorCode: "DELIVERY_CHANNEL_UNAVAILABLE",
      });
    }
    return validateOutboundDeliveryResult({
      deliveryId: safe.deliveryId,
      channel: safe.channel,
      status: "delivered",
      completedAt: new Date().toISOString(),
    });
  },
});
