import { readFile } from "node:fs/promises";

type ExpectedResponse = {
  status: number;
  assertions: (body: unknown) => boolean;
};

type QaCase = {
  name: string;
  path: string;
  init?: RequestInit;
  expected: ExpectedResponse;
};

const fixtureUrl = (name: string): URL => new URL(`../fixtures/receiver/${name}`, import.meta.url);
const readFixture = async (name: string): Promise<string> => readFile(fixtureUrl(name), "utf8");
const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const hasFields = (fields: Record<string, unknown>) => (body: unknown): boolean => isRecord(body) && Object.entries(fields).every(([key, value]) => body[key] === value);
const hasValidProcessingResult = (body: unknown): boolean =>
  isRecord(body)
  && typeof body.requestId === "string"
  && body.requestId.length > 0
  && typeof body.conversationId === "string"
  && body.conversationId.length > 0
  && body.processingMode === "sandbox"
  && body.intent === "unclassified"
  && body.normalizedChannel === "manual_test"
  && body.normalizedMessage === "Prueba local QA 0K-13A.4 del receiver sandbox."
  && body.messageLength === 46;

const resolveBaseUrl = (): string => {
  const configured = process.env.ORBI_RECEIVER_QA_URL?.trim() || "http://127.0.0.1:8787";
  try {
    const url = new URL(configured);
    if (url.protocol !== "http:" || (url.hostname !== "localhost" && url.hostname !== "127.0.0.1")) {
      throw new Error("Only local http://localhost or http://127.0.0.1 receiver URLs are allowed.");
    }
    return url.toString().replace(/\/$/, "");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid receiver URL.";
    throw new Error(`Invalid ORBI_RECEIVER_QA_URL. ${message}`);
  }
};

const parseResponse = async (response: Response): Promise<unknown> => {
  try { return await response.json(); } catch { return null; }
};

const main = async (): Promise<void> => {
  const baseUrl = resolveBaseUrl();
  const [validMessage, emptyMessage, missingConsent, invalidChannel, malformedJson] = await Promise.all([
    readFixture("valid-message.json"), readFixture("empty-message.json"), readFixture("missing-consent.json"), readFixture("invalid-channel.json"), readFixture("malformed-json.txt"),
  ]);
  const longMessage = JSON.stringify({ channel: "manual_test", message: "x".repeat(2_001), consentAccepted: true });
  const jsonHeaders = { "Content-Type": "application/json" };
  const cases: QaCase[] = [
    { name: "health ok", path: "/api/health", expected: { status: 200, assertions: hasFields({ ok: true, mode: "sandbox", production: false }) } },
    { name: "valid widget message", path: "/api/public/widget/orbi_demo_widget_key/message", init: { method: "POST", headers: jsonHeaders, body: validMessage }, expected: { status: 200, assertions: (body) => hasFields({ ok: true, received: true, leadCreated: false })(body) && hasValidProcessingResult(body) } },
    { name: "invalid public key", path: "/api/public/widget/invalid_key/message", init: { method: "POST", headers: jsonHeaders, body: validMessage }, expected: { status: 403, assertions: hasFields({ errorCode: "INVALID_PUBLIC_KEY" }) } },
    { name: "empty message", path: "/api/public/widget/orbi_demo_widget_key/message", init: { method: "POST", headers: jsonHeaders, body: emptyMessage }, expected: { status: 400, assertions: hasFields({ errorCode: "INVALID_MESSAGE" }) } },
    { name: "long message", path: "/api/public/widget/orbi_demo_widget_key/message", init: { method: "POST", headers: jsonHeaders, body: longMessage }, expected: { status: 400, assertions: hasFields({ errorCode: "MESSAGE_TOO_LONG" }) } },
    { name: "missing consent", path: "/api/public/widget/orbi_demo_widget_key/message", init: { method: "POST", headers: jsonHeaders, body: missingConsent }, expected: { status: 400, assertions: hasFields({ errorCode: "CONSENT_REQUIRED" }) } },
    { name: "invalid channel", path: "/api/public/widget/orbi_demo_widget_key/message", init: { method: "POST", headers: jsonHeaders, body: invalidChannel }, expected: { status: 400, assertions: hasFields({ errorCode: "INVALID_JSON_BODY" }) } },
    { name: "malformed JSON", path: "/api/public/widget/orbi_demo_widget_key/message", init: { method: "POST", headers: jsonHeaders, body: malformedJson }, expected: { status: 400, assertions: hasFields({ errorCode: "INVALID_JSON_BODY" }) } },
    { name: "route not found", path: "/api/not-found", expected: { status: 404, assertions: hasFields({ errorCode: "ROUTE_NOT_FOUND" }) } },
    { name: "origin blocked", path: "/api/health", init: { headers: { Origin: "http://malicious.example" } }, expected: { status: 403, assertions: hasFields({ errorCode: "ORIGIN_NOT_ALLOWED" }) } },
  ];

  console.info("ORBI Receiver QA Matrix");
  console.info(`Base URL: ${baseUrl}`);
  let failures = 0;
  for (const testCase of cases) {
    try {
      const response = await fetch(`${baseUrl}${testCase.path}`, testCase.init);
      const body = await parseResponse(response);
      const passed = response.status === testCase.expected.status && testCase.expected.assertions(body);
      console.info(`${passed ? "PASS" : "FAIL"} ${testCase.name}`);
      if (!passed) failures += 1;
    } catch {
      console.error("Backend local no disponible. Ejecuta primero:");
      console.error("npm run server:dev");
      process.exit(1);
    }
  }
  if (failures > 0) {
    console.error(`Receiver QA: FAIL (${failures} case${failures === 1 ? "" : "s"})`);
    process.exit(1);
  }
  console.info("Receiver QA: PASS");
  process.exit(0);
};

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unexpected QA setup error.";
  console.error(message);
  process.exit(1);
});
