import { buildKnowledgeContext } from "../services/knowledgeContextBuilder.js";
import type { ToolDefinition } from "./toolEngine.js";
import type { HumanHandoffService } from "../handoff/humanHandoffService.js";
export type BusinessRecord = Readonly<{ id:string; conversationId:string; kind:"lead"|"service_request"|"appointment_request"; status:"CAPTURED"; createdAt:string; summary:string }>;
export class InMemoryBusinessRecordStore { private records=new Map<string,BusinessRecord>();private keys=new Map<string,string>();create(record:BusinessRecord,key?:string){const old=key?this.keys.get(key):undefined;if(old)return this.records.get(old)!;this.records.set(record.id,record);if(key)this.keys.set(key,record.id);return record}list(id:string){return Object.freeze([...this.records.values()].filter(x=>x.conversationId===id))}}
export const createBusinessToolsPack = (d: Readonly<{ store: InMemoryBusinessRecordStore; handoff: HumanHandoffService }>): readonly ToolDefinition[] => {
  let n = 0;
  const make = (kind: BusinessRecord["kind"], field: string): ToolDefinition => ({
    name: kind === "lead" ? "capture_lead" : kind === "service_request" ? "create_service_request" : "request_appointment",
    description: kind, validate: x => !!x && typeof x === "object" && typeof (x as Record<string, unknown>)[field] === "string",
    execute: (x, c) => { const v = x as Record<string, unknown>; const r = d.store.create(Object.freeze({ id: `business-${++n}`, conversationId: c.conversationId, kind, status: "CAPTURED", createdAt: new Date().toISOString(), summary: String(v[field]).slice(0, 120) }), typeof v.idempotencyKey === "string" ? v.idempotencyKey : undefined); return { status: r.status, recordId: r.id, kind: r.kind }; },
  });
  return Object.freeze([
    { name: "search_knowledge", description: "local knowledge", validate: x => !!x && typeof x === "object" && typeof (x as Record<string, unknown>).query === "string", execute: x => { const c = buildKnowledgeContext(String((x as Record<string, unknown>).query)); return { status: c.entries.length ? "FOUND" : "NO_KNOWLEDGE_FOUND", ids: c.entries.map(e => e.id) }; } },
    make("lead", "interest"), make("service_request", "serviceType"), make("appointment_request", "purpose"),
    { name: "request_human_handoff", description: "handoff", validate: () => true, execute: (x, c) => ({ state: d.handoff.requestHandoff(c.conversationId, typeof (x as Record<string, unknown>)?.reason === "string" ? (x as Record<string, unknown>).reason as string : undefined).state }) },
  ]);
};
