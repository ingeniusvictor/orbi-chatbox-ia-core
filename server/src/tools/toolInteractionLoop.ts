import { ToolExecutor, type ToolResult } from "./toolEngine.js";
export type ToolPlannerDecision = Readonly<{ kind: "FINAL_RESPONSE"; text: string }> | Readonly<{ kind: "TOOL_REQUEST"; name: string; input: unknown }>;
export type ToolPlanner = Readonly<{ plan(input: Readonly<{ conversationId: string; userText: string; availableTools: readonly Readonly<{ name: string; description: string }>[]; results: readonly ToolResult[] }>): Promise<ToolPlannerDecision> }>;
export type ToolLoopResult = Readonly<{ ok: boolean; text?: string; errorCode?: "LOOP_LIMIT_REACHED"; results: readonly ToolResult[] }>;
/** Bounded planner/executor orchestration. It has no provider-native schema or dynamic execution. */
export class ToolInteractionLoop {
  constructor(private readonly planner: ToolPlanner, private readonly executor: ToolExecutor, private readonly availableTools: readonly Readonly<{ name: string; description: string }>[], private readonly allowed: readonly string[], private readonly maxSteps = 4) {}
  async run(conversationId: string, userText: string): Promise<ToolLoopResult> {
    const results: ToolResult[] = [];
    for (let sequence = 0; sequence < this.maxSteps; sequence += 1) {
      const decision = await this.planner.plan(Object.freeze({ conversationId, userText, availableTools: this.availableTools, results: Object.freeze([...results]) }));
      if (decision.kind === "FINAL_RESPONSE") return Object.freeze({ ok: true, text: decision.text.slice(0, 8_000), results: Object.freeze([...results]) });
      results.push(await this.executor.execute(decision.name, decision.input, { conversationId, allowed: this.allowed }));
    }
    return Object.freeze({ ok: false, errorCode: "LOOP_LIMIT_REACHED", results: Object.freeze([...results]) });
  }
}
