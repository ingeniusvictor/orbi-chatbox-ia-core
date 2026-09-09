import { ORBI_DEFAULT_PROFILE } from "../src/config/clientProfile.js";
import { DEFAULT_COMMERCIAL_RUNTIME_POLICY } from "../src/services/commercialRuntimeHardening.js";
import { validateCommercialRuntime, type CommercialRuntimeComposition } from "../src/services/commercialRuntimeValidator.js";
import { InMemoryConversationStore } from "../src/memory/conversationMemory.js";
import { HumanHandoffService } from "../src/handoff/humanHandoffService.js";
import { ToolRegistry } from "../src/tools/toolEngine.js";
import { createBusinessToolsPack, InMemoryBusinessRecordStore } from "../src/tools/businessToolsPack.js";
const assert=(value:unknown,message:string)=>{if(!value)throw Error(message)};
const handoff=new HumanHandoffService(),registry=new ToolRegistry();
for(const tool of createBusinessToolsPack({store:new InMemoryBusinessRecordStore(),handoff}))registry.register(tool);
const valid:CommercialRuntimeComposition={activeClient:ORBI_DEFAULT_PROFILE,commercialPolicy:DEFAULT_COMMERCIAL_RUNTIME_POLICY,toolRegistry:registry,supportedChannels:["web","widget","voice"],memory:new InMemoryConversationStore(),handoff,provider:{mode:"mock"}};
const invalid=(patch:Partial<CommercialRuntimeComposition>)=>validateCommercialRuntime({...valid,...patch});
try{
  assert(validateCommercialRuntime(valid).valid,"canonical composition");
  assert(!invalid({activeClient:undefined}).valid,"missing client");
  assert(!invalid({commercialPolicy:undefined}).valid,"missing policy");
  assert(!invalid({toolRegistry:new ToolRegistry()}).valid,"unregistered tool");
  assert(!invalid({supportedChannels:["web"]}).valid,"unsupported channel");
  assert(!invalid({memory:undefined}).valid,"missing memory");
  assert(!invalid({handoff:undefined}).valid,"missing handoff");
  const businessProfile={...ORBI_DEFAULT_PROFILE,capabilities:{allowedTools:["capture_lead"]}} as typeof ORBI_DEFAULT_PROFILE;
  assert(!invalid({activeClient:businessProfile,businessToolsAvailable:false}).valid,"missing business dependency");
  assert(validateCommercialRuntime({...valid,telemetry:undefined}).valid,"optional telemetry");
  assert(!invalid({provider:{mode:"qwen-local"}}).valid,"provider structural validation");
  const serialized=JSON.stringify(validateCommercialRuntime(valid));
  assert(!/token|password|phone|email|message content/i.test(serialized),"safe findings");
  console.info("Commercial Runtime Validator QA: PASS (structural only, zero network)");
}catch(error){console.error(error);process.exit(1)}
