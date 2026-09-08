import { runWhatsAppLiveTextTest } from "../src/channels/whatsapp/whatsappLiveTextTest.js";
import { type WhatsAppGraphTransport } from "../src/channels/whatsapp/whatsappGraphClient.js";
import { loadWhatsAppRuntimeConfig } from "../src/config/whatsappRuntimeConfig.js";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const valid = Object.freeze({ WHATSAPP_ENABLED: "true", WHATSAPP_LIVE_SEND_ENABLED: "true", WHATSAPP_ACCESS_TOKEN: "qa-access-token", WHATSAPP_PHONE_NUMBER_ID: "0000000000", WHATSAPP_GRAPH_API_VERSION: "v99.0", WHATSAPP_TEST_RECIPIENT_ALLOWLIST: "1111111111" });
const blocked = async (env: Readonly<Record<string, string | undefined>>): Promise<void> => {
  const result = await runWhatsAppLiveTextTest(loadWhatsAppRuntimeConfig(env), async () => { throw new Error("Transport must not execute while preflight is blocked."); });
  assert(!result.transportInvoked && result.lines.includes("WHATSAPP_LIVE_SEND_LOCKED"), "Missing live preflight requirement must block before transport.");
};

try {
  await blocked({ ...valid, WHATSAPP_LIVE_SEND_ENABLED: "false" });
  await blocked({ ...valid, WHATSAPP_ACCESS_TOKEN: undefined });
  await blocked({ ...valid, WHATSAPP_PHONE_NUMBER_ID: undefined });
  await blocked({ ...valid, WHATSAPP_GRAPH_API_VERSION: undefined });
  await blocked({ ...valid, WHATSAPP_TEST_RECIPIENT_ALLOWLIST: undefined });
  await blocked({ ...valid, WHATSAPP_TEST_RECIPIENT_ALLOWLIST: "1111111111,2222222222" });

  let calls = 0;
  const fakeTransport: WhatsAppGraphTransport = async () => {
    calls += 1;
    return Object.freeze({ status: 200, body: JSON.stringify({ messages: [{ id: "wamid.fake" }] }) });
  };
  const accepted = await runWhatsAppLiveTextTest(loadWhatsAppRuntimeConfig(valid), fakeTransport);
  assert(accepted.transportInvoked && calls === 1 && accepted.lines.includes("SEND_ACCEPTED"), "Complete fake configuration must execute exactly one injected send.");
  const output = accepted.lines.join(" ");
  assert(!output.includes("qa-access-token") && !output.includes("1111111111") && !output.includes("Bearer"), "Live command output must not expose credentials, recipients, or authorization headers.");
  assert(!output.includes("RETRY") && !output.includes("retry"), "Live command must not claim retry behavior.");
  console.info("WhatsApp Live Test Preflight QA: PASS (fake transport only, single send, fail-closed guards, sanitized output, no native network execution)");
} catch (error) { console.error(error); process.exit(1); }
