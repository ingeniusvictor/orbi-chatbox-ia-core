import type { ChannelDeliveryAdapter } from "../types/channelDeliveryAdapter.js";
import { validateOutboundDeliveryRequest, validateOutboundDeliveryResult, type OutboundDeliveryRequest, type OutboundDeliveryResult } from "../types/outboundDelivery.js";
import { WhatsAppGraphClient } from "../channels/whatsapp/whatsappGraphClient.js";
import type { WhatsAppOutboundDeliveryContext } from "../channels/whatsapp/whatsappOutboundText.js";

export type WhatsAppRecipientResolver = (request: Readonly<OutboundDeliveryRequest>) => Readonly<WhatsAppOutboundDeliveryContext> | undefined;

/**
 * Provider boundary only. It preserves ORBI's delivery lifecycle identity and
 * never exposes a recipient or provider message ID to Core/LUMI.
 */
export class WhatsAppDeliveryAdapter implements ChannelDeliveryAdapter {
  constructor(private readonly client: WhatsAppGraphClient, private readonly recipientResolver: WhatsAppRecipientResolver) {}

  async deliver(request: Readonly<OutboundDeliveryRequest>): Promise<Readonly<OutboundDeliveryResult>> {
    const safe = validateOutboundDeliveryRequest(request);
    if (safe.channel !== "whatsapp") return this.failed(safe, "DELIVERY_CHANNEL_UNAVAILABLE");
    const context = this.recipientResolver(safe);
    if (!context) return this.failed(safe, "DELIVERY_CHANNEL_UNAVAILABLE");
    const result = await this.client.sendText(context, safe.response.text);
    if (result.ok) {
      return validateOutboundDeliveryResult({ deliveryId: safe.deliveryId, channel: safe.channel, status: "delivered", completedAt: new Date().toISOString() });
    }
    return this.failed(safe, "errorCode" in result && result.errorCode === "WHATSAPP_NOT_CONFIGURED" ? "DELIVERY_CHANNEL_UNAVAILABLE" : "DELIVERY_FAILED");
  }

  private failed(request: Readonly<OutboundDeliveryRequest>, errorCode: "DELIVERY_CHANNEL_UNAVAILABLE" | "DELIVERY_FAILED"): Readonly<OutboundDeliveryResult> {
    return validateOutboundDeliveryResult({ deliveryId: request.deliveryId, channel: request.channel, status: "failed", completedAt: new Date().toISOString(), errorCode });
  }
}
