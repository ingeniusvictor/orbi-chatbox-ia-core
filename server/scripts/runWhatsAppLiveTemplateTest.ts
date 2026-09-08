import "dotenv/config";
import { runWhatsAppLiveTemplateTest } from "../src/channels/whatsapp/whatsappLiveTemplateTest.js";
import { loadWhatsAppRuntimeConfig } from "../src/config/whatsappRuntimeConfig.js";

try {
  const result = await runWhatsAppLiveTemplateTest(loadWhatsAppRuntimeConfig());
  for (const line of result.lines) console.info(line);
  process.exit(result.lines.includes("SEND_ACCEPTED") ? 0 : 1);
} catch {
  console.info("LIVE_TEMPLATE_TEST_START");
  console.info("SEND_FAILED");
  console.info("WHATSAPP_NETWORK_FAILED");
  console.info("LIVE_TEMPLATE_TEST_END");
  process.exit(1);
}
