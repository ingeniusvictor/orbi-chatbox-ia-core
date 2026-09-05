import type { ChannelDeliveryAdapter } from "../types/channelDeliveryAdapter.js";
import {
  validateOutboundDeliveryRequest,
  validateOutboundDeliveryResult,
  type OutboundDeliveryRequest,
  type OutboundDeliveryResult,
} from "../types/outboundDelivery.js";
import type { OutboundChannelResponse } from "../types/channelMessage.js";
import { createInternalDeliveryId } from "./internalDeliveryIdentity.js";
import { InMemoryDeliveryLifecycleStore } from "./inMemoryDeliveryLifecycleStore.js";
import type { DeliveryLifecycleStore } from "../types/deliveryLifecycle.js";

export const createOutboundDeliveryRequest = (response: Readonly<OutboundChannelResponse>): Readonly<OutboundDeliveryRequest> =>
  validateOutboundDeliveryRequest({
    deliveryId: createInternalDeliveryId(),
    channel: response.channel,
    conversationId: response.conversationId,
    response,
    createdAt: new Date().toISOString(),
  });

/**
 * Coordinates one process-local delivery attempt. Terminal records are
 * immutable; a future retry must use a new attempt, never a reverse transition.
 */
export class ChannelDeliveryService {
  private readonly inFlight = new Map<string, Promise<Readonly<OutboundDeliveryResult>>>();

  constructor(private readonly lifecycle: DeliveryLifecycleStore = new InMemoryDeliveryLifecycleStore()) {}

  async deliver(request: Readonly<OutboundDeliveryRequest>, adapter: ChannelDeliveryAdapter): Promise<Readonly<OutboundDeliveryResult>> {
    const safeRequest = validateOutboundDeliveryRequest(request);
    const prior = this.lifecycle.resolve(safeRequest.deliveryId);
    const record = this.lifecycle.createPending({
      deliveryId: safeRequest.deliveryId,
      channel: safeRequest.channel,
      conversationId: safeRequest.conversationId,
      responseType: safeRequest.response.responseType,
      responseText: safeRequest.response.text,
      createdAt: safeRequest.createdAt,
    });
    if (prior && record.status !== "pending") return this.resultFor(record);
    const active = this.inFlight.get(safeRequest.deliveryId);
    if (active) return active;
    if (record.status !== "pending") return this.resultFor(record);

    const execution = this.executePending(safeRequest, adapter);
    this.inFlight.set(safeRequest.deliveryId, execution);
    try { return await execution; } finally { this.inFlight.delete(safeRequest.deliveryId); }
  }

  release(deliveryId: string): boolean { return this.lifecycle.release(deliveryId); }

  private async executePending(request: Readonly<OutboundDeliveryRequest>, adapter: ChannelDeliveryAdapter): Promise<Readonly<OutboundDeliveryResult>> {
    try {
      const result = validateOutboundDeliveryResult(await adapter.deliver(request));
      if (result.deliveryId !== request.deliveryId || result.channel !== request.channel || result.status === "pending") throw new Error("Delivery adapter result is invalid.");
      const record = result.status === "delivered"
        ? this.lifecycle.markDelivered(request.deliveryId, result.completedAt!)
        : this.lifecycle.markFailed(request.deliveryId, result.errorCode!, result.completedAt!);
      return this.resultFor(record);
    } catch {
      const record = this.lifecycle.markFailed(request.deliveryId, "DELIVERY_FAILED", new Date().toISOString());
      return this.resultFor(record);
    }
  }

  private resultFor(record: Readonly<ReturnType<DeliveryLifecycleStore["resolve"]>>): Readonly<OutboundDeliveryResult> {
    if (!record) throw new Error("Delivery lifecycle record is unavailable.");
    return validateOutboundDeliveryResult({
      deliveryId: record.deliveryId,
      channel: record.channel,
      status: record.status,
      ...(record.status === "pending" ? {} : { completedAt: record.updatedAt }),
      ...(record.status === "failed" ? { errorCode: record.errorCode } : {}),
    });
  }
}

const standaloneDeliveryService = new ChannelDeliveryService();

/** Compatibility helper for direct local contract checks; router composition owns its service instance. */
export const executeOutboundDelivery = async (request: Readonly<OutboundDeliveryRequest>, adapter: ChannelDeliveryAdapter): Promise<Readonly<OutboundDeliveryResult>> =>
  standaloneDeliveryService.deliver(request, adapter);
