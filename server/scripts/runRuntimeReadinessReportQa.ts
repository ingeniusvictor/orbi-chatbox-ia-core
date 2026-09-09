import { ORBI_DEFAULT_PROFILE } from "../src/config/clientProfile.js";
import { DEFAULT_COMMERCIAL_RUNTIME_POLICY } from "../src/services/commercialRuntimeHardening.js";
import { validateCommercialRuntime } from "../src/services/commercialRuntimeValidator.js";
import { createRuntimeReadinessReport, RUNTIME_READINESS_COMPONENTS } from "../src/services/runtimeReadinessReport.js";
import { InMemoryConversationStore } from "../src/memory/conversationMemory.js";
import { HumanHandoffService } from "../src/handoff/humanHandoffService.js";
import { ToolRegistry } from "../src/tools/toolEngine.js";
import { createBusinessToolsPack, InMemoryBusinessRecordStore } from "../src/tools/businessToolsPack.js";
import { BoundedInMemoryTelemetrySink } from "../src/services/runtimeTelemetry.js";
const assert=(value:unknown,message:string)=>{if(!value)throw Error(message)};
const handoff=new HumanHandoffService(),registry=new ToolRegistry();
for(const tool of createBusinessToolsPack({store:new InMemoryBusinessRecordStore(),handoff}))registry.register(tool);
const composition={activeClient:ORBI_DEFAULT_PROFILE,commercialPolicy:DEFAULT_COMMERCIAL_RUNTIME_POLICY,toolRegistry:registry,supportedChannels:["web","widget","voice"],memory:new InMemoryConversationStore(),handoff,provider:{mode:"mock" as const}};
try{
  const degraded=createRuntimeReadinessReport(validateCommercialRuntime(composition));
  assert(degraded.status==="DEGRADED","optional telemetry degradation");
  const ready=createRuntimeReadinessReport(validateCommercialRuntime({...composition,telemetry:new BoundedInMemoryTelemetrySink()}));
  assert(ready.status==="READY","canonical ready");
  const failed=createRuntimeReadinessReport(validateCommercialRuntime({...composition,memory:undefined}));
  assert(failed.status==="NOT_READY","mandatory failure");
  assert(ready.components.length===RUNTIME_READINESS_COMPONENTS.length&&new Set(ready.components.map(x=>x.component)).size===RUNTIME_READINESS_COMPONENTS.length,"components exactly once");
  assert(JSON.stringify(ready)===JSON.stringify(createRuntimeReadinessReport(validateCommercialRuntime({...composition,telemetry:new BoundedInMemoryTelemetrySink()}))),"deterministic");
  const serialized=JSON.stringify(ready);
  assert(!/private-value|access.?token|password|phone|email|message content|business record/i.test(serialized),"privacy");
  assert(ready.components.every(x=>Object.keys(x).every(k=>["component","status","safeCode","safeMessage"].includes(k))),"safe fields only");
  console.info("Runtime Readiness Report QA: PASS (pure aggregation, zero network)");
}catch(error){console.error(error);process.exit(1)}
