import { createApp } from "./app.js";
import { loadServerRuntimeEnv } from "./config/env.js";

const runtimeEnv = loadServerRuntimeEnv();
const app = createApp(runtimeEnv);

app.listen(runtimeEnv.port, "127.0.0.1", () => {
  console.info("ORBI ChatBox IA Core receiver running in sandbox mode");
  console.info(`Local URL: http://localhost:${runtimeEnv.port}`);
});
