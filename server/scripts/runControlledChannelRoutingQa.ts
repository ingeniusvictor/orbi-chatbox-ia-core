import { readFile } from "node:fs/promises";
import { ControlledChannelRouter } from "../src/services/controlledChannelRouter.js";
import type { AiProvider } from "../src/types/aiProvider.js";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const provider: AiProvider = Object.freeze({ mode: "mock", async generate(request) { assert(request.message === "Ruta web controlada", "Only adapter-normalized text may reach Core."); return Object.freeze({ provider: "mock", text: "Respuesta controlada", grounded: false, sourceEntryIds: [] }); } });

try {
  const router = new ControlledChannelRouter();
  const web = await router.route({ channel: "web", rawInput: { text: "Ruta web controlada", externalUserId: "external-only" }, activeProviderMode: "mock", providerOverride: provider, orbiConversationId: "orbi-local-session" });
  assert(web.ok && web.channel === "web" && web.adapterChannel === "web", "Web must route through the registered adapter.");
  const whatsapp = await router.route({ channel: "whatsapp", rawInput: {}, activeProviderMode: "mock" });
  assert(whatsapp.ok === false && whatsapp.errorCode === "CHANNEL_NOT_IMPLEMENTED", "WhatsApp must reject safely.");
  const disabled = await router.route({ channel: "internal", rawInput: {}, activeProviderMode: "mock" });
  assert(disabled.ok === false && disabled.errorCode === "CHANNEL_DISABLED", "Disabled channels must reject safely.");
  const invalid = await router.route({ channel: "web", rawInput: { text: " " }, activeProviderMode: "mock" });
  assert(invalid.ok === false && invalid.errorCode === "CHANNEL_NORMALIZATION_FAILED", "Normalization failures must remain controlled.");
  const [core, knowledge, behavior, routerSource] = await Promise.all([
    readFile(new URL("../src/services/coreWidgetMessageProcessor.ts", import.meta.url), "utf8"),
    readFile(new URL("../src/services/knowledgeContextBuilder.ts", import.meta.url), "utf8"),
    readFile(new URL("../src/services/assistantBehaviorPolicyComposer.ts", import.meta.url), "utf8"),
    readFile(new URL("../src/services/controlledChannelRouter.ts", import.meta.url), "utf8"),
  ]);
  assert(![core, knowledge, behavior].some((source) => /channel\s*===\s*["'](web|widget|whatsapp)["']|switch\s*\(\s*channel\s*\)/.test(source)), "Core services must contain no channel-specific branching.");
  assert(!routerSource.match(/meta(?:\s|[-_]?api|cloud)|webhook|token|fetch\(|https?:\/\//i), "Controlled routing must remain local and provider-free.");
  console.info("Controlled Channel Routing QA: PASS");
} catch (error) { console.error(error); process.exit(1); }
