export type WhatsAppInboundDeduplicationResult = "accepted" | "duplicate" | "capacity";

/** Bounded process-local protection against a repeated provider message ID. */
export class InMemoryWhatsAppInboundDeduplicationStore {
  private readonly ids = new Set<string>();
  constructor(private readonly capacity = 100) {}

  reserve(providerMessageId: string): WhatsAppInboundDeduplicationResult {
    if (this.ids.has(providerMessageId)) return "duplicate";
    if (this.ids.size >= this.capacity) return "capacity";
    this.ids.add(providerMessageId);
    return "accepted";
  }

  release(providerMessageId: string): boolean { return this.ids.delete(providerMessageId); }
  get size(): number { return this.ids.size; }
}
