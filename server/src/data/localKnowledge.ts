import type { KnowledgeEntry } from "../types/knowledge.js";

const freezeEntry = (entry: KnowledgeEntry): Readonly<KnowledgeEntry> =>
  Object.freeze({ ...entry, tags: Object.freeze([...entry.tags]) });

export const LOCAL_KNOWLEDGE_ENTRIES: readonly Readonly<KnowledgeEntry>[] = Object.freeze([
  freezeEntry({
    id: "orbi-sandbox-assistant",
    domain: "orbi",
    title: "ORBI Sandbox Assistant",
    content: "Synthetic sandbox knowledge for controlled local assistant testing.",
    tags: ["orbi", "sandbox", "assistant"],
    status: "sandbox",
  }),
  freezeEntry({
    id: "academy-sandbox-learning",
    domain: "academy",
    title: "Sandbox Learning Space",
    content: "Synthetic learning content used only to validate the local knowledge contract.",
    tags: ["academy", "learning", "sandbox"],
    status: "sandbox",
  }),
  freezeEntry({
    id: "services-demo-catalog",
    domain: "services",
    title: "Demo Services Catalog",
    content: "Generic demo services description without production offers, pricing, or customer data.",
    tags: ["services", "demo", "synthetic"],
    status: "sandbox",
  }),
  freezeEntry({
    id: "development-local-workflow",
    domain: "development",
    title: "Local Development Workflow",
    content: "Sandbox workflow guidance: validate locally, keep integrations disabled, and use synthetic data.",
    tags: ["development", "local", "guardrails"],
    status: "sandbox",
  }),
  freezeEntry({
    id: "corporate-demo-boundary",
    domain: "corporate",
    title: "Corporate Demo Boundary",
    content: "This placeholder is synthetic and must not be treated as corporate or customer information.",
    tags: ["corporate", "boundary", "sandbox"],
    status: "sandbox",
  }),
  freezeEntry({
    id: "system-sandbox-guardrails",
    domain: "system",
    title: "Sandbox System Guardrails",
    content: "Local registry entries are static, read-only, non-production, and have no external source.",
    tags: ["system", "sandbox", "local"],
    status: "sandbox",
  }),
]);
