import { WhatsAppGraphClient, type WhatsAppGraphTransport } from "../src/channels/whatsapp/whatsappGraphClient.js";
import { runWhatsAppLiveTemplateTest } from "../src/channels/whatsapp/whatsappLiveTemplateTest.js";
import { createWhatsAppOutboundTemplatePayload } from "../src/channels/whatsapp/whatsappOutboundTemplate.js";
import { loadWhatsAppRuntimeConfig } from "../src/config/whatsappRuntimeConfig.js";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const valid = Object.freeze({ WHATSAPP_ENABLED: "true", WHATSAPP_LIVE_SEND_ENABLED: "true", WHATSAPP_ACCESS_TOKEN: "qa-access-token", WHATSAPP_PHONE_NUMBER_ID: "0000000000", WHATSAPP_GRAPH_API_VERSION: "v99.0", WHATSAPP_TEST_RECIPIENT_ALLOWLIST: "1111111111", WHATSAPP_TEST_TEMPLATE_NAME: "hello_world", WHATSAPP_TEST_TEMPLATE_LANGUAGE_CODE: "es_CL" });
const blocked = async (env: Readonly<Record<string, string | undefined>>): Promise<void> => {
  const result = await runWhatsAppLiveTemplateTest(loadWhatsAppRuntimeConfig(env), async () => { throw new Error("Blocked template test must not invoke transport."); });
  assert(!result.transportInvoked && result.lines.includes("WHATSAPP_LIVE_SEND_LOCKED"), "Template readiness must fail closed.");
};

try {
  assert(loadWhatsAppRuntimeConfig({ ...valid, WHATSAPP_TEST_TEMPLATE_NAME: undefined }).templateLiveTestReadiness === "template-config-missing", "Missing template name must be explicit.");
  assert(loadWhatsAppRuntimeConfig({ ...valid, WHATSAPP_TEST_TEMPLATE_LANGUAGE_CODE: undefined }).templateLiveTestReadiness === "template-config-missing", "Missing template language must be explicit.");
  assert(loadWhatsAppRuntimeConfig({ ...valid, WHATSAPP_TEST_TEMPLATE_NAME: "Bad Template" }).templateLiveTestReadiness === "invalid-config", "Invalid template name must be rejected.");
  assert(loadWhatsAppRuntimeConfig({ ...valid, WHATSAPP_TEST_TEMPLATE_LANGUAGE_CODE: "es-CL" }).templateLiveTestReadiness === "invalid-config", "Invalid template language must be rejected.");
  const payload = createWhatsAppOutboundTemplatePayload({ recipient: "1111111111" }, "hello_world", "es_CL");
  assert(payload.type === "template" && payload.template.name === "hello_world" && payload.template.language.code === "es_CL" && Object.isFrozen(payload) && !("text" in payload) && !("components" in payload), "Template payload must be narrow and immutable.");
  let invalidThrown = false; try { createWhatsAppOutboundTemplatePayload({ recipient: "bad" }, "hello_world", "es_CL"); } catch { invalidThrown = true; }
  assert(invalidThrown, "Invalid recipients must be rejected.");
  await blocked({ ...valid, WHATSAPP_LIVE_SEND_ENABLED: "false" });
  await blocked({ ...valid, WHATSAPP_TEST_RECIPIENT_ALLOWLIST: undefined });
  await blocked({ ...valid, WHATSAPP_TEST_RECIPIENT_ALLOWLIST: "1111111111,2222222222" });
  await blocked({ ...valid, WHATSAPP_TEST_TEMPLATE_NAME: undefined });
  let calls = 0; let captured = "";
  const fake: WhatsAppGraphTransport = async (request) => { calls += 1; captured = request.body; return Object.freeze({ status: 200, body: JSON.stringify({ messages: [{ id: "wamid.fake" }] }) }); };
  const config = loadWhatsAppRuntimeConfig(valid);
  const clientResult = await new WhatsAppGraphClient(config, fake, 1_000).sendTemplate({ recipient: "1111111111" });
  assert(clientResult.ok && calls === 1 && captured.includes('"type":"template"') && captured.includes('"name":"hello_world"') && captured.includes('"code":"es_CL"'), "Graph client must send the expected provider-only template payload through fake transport.");
  calls = 0;
  const live = await runWhatsAppLiveTemplateTest(config, fake);
  assert(live.transportInvoked && calls === 1 && live.lines.includes("SEND_ACCEPTED"), "Ready template test must issue exactly one fake send.");
  const output = live.lines.join(" ");
  assert(!output.includes("qa-access-token") && !output.includes("1111111111") && !output.includes("Bearer") && !output.includes("retry"), "Template output must be sanitized with no retry behavior.");
  console.info("WhatsApp Template Message QA: PASS (env config, narrow payload, fake Graph transport, single-send lock, sanitized output, no native network)");
} catch (error) { console.error(error); process.exit(1); }
