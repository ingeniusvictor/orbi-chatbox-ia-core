import { createServer } from "node:http";
import { executeLocalAiTransportRequest } from "../src/services/localAiRuntimeTransport.js";

const main = async (): Promise<void> => {
  const server = createServer((request, response) => {
    if (request.url === "/redirect") { response.writeHead(302, { Location: "http://example.invalid" }); response.end(); return; }
    if (request.url === "/slow") { setTimeout(() => { response.writeHead(200, { "Content-Type": "application/json" }); response.end("{}"); }, 100); return; }
    if (request.url === "/invalid") { response.writeHead(200, { "Content-Type": "application/json" }); response.end("{"); return; }
    if (request.url === "/large") { response.writeHead(200, { "Content-Type": "text/plain" }); response.end("x".repeat(65_537)); return; }
    let raw = ""; request.on("data", (chunk: Buffer) => { raw += chunk; }); request.on("end", () => { response.writeHead(200, { "Content-Type": "application/json" }); response.end(JSON.stringify({ method: request.method, body: raw ? JSON.parse(raw) : null })); });
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address(); const port = typeof address === "object" && address ? address.port : 0; const base = `http://127.0.0.1:${port}`;
  try {
    const get = await executeLocalAiTransportRequest({ runtimeId: "qa", url: `${base}/`, method: "GET", timeoutMs: 1_000 });
    const post = await executeLocalAiTransportRequest({ runtimeId: "qa", url: `${base}/`, method: "POST", timeoutMs: 1_000, body: { qa: true } });
    const failures = await Promise.all(["http://example.invalid", "http://192.168.1.1", "bad", "ftp://127.0.0.1", `${base}/redirect`, `${base}/slow`, `${base}/invalid`, `${base}/large`].map((url, index) => executeLocalAiTransportRequest({ runtimeId: "qa", url, method: "GET", timeoutMs: index === 5 ? 20 : 1_000 })));
    const passed = get.ok && post.ok && Object.isFrozen(get) && Object.isFrozen(post) && failures.every((result) => !result.ok) && port > 0;
    if (!passed) throw new Error("Transport assertions failed.");
    console.info("Local AI Runtime Transport QA: PASS (127.0.0.1 ephemeral server only)");
  } finally { await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve())); }
};
void main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : "Transport QA failed."); process.exit(1); });
