import type { OutboundDeliveryRequest, OutboundDeliveryResult } from "./outboundDelivery.js";

/** Delivery is a channel boundary concern. Core/LUMI neither select nor call this adapter. */
export interface ChannelDeliveryAdapter {
  deliver(request: Readonly<OutboundDeliveryRequest>): Promise<Readonly<OutboundDeliveryResult>>;
}
