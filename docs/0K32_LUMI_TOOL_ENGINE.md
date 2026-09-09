# 0K-32 LUMI Tool Engine
The engine provides a neutral registry, deny-by-default policy through allowed names, bounded executor and a planner/executor loop with a default hard maximum of four steps. A planner returns either FINAL_RESPONSE or TOOL_REQUEST; normalized executor results return to the planner, so a controlled failure can still yield a human response.

Composition is optional and dependency-injected: existing Core execution remains unchanged when no planner is configured. Tool execution is one logical conversational turn, not fabricated chat messages. Audit-safe results retain only tool name, status, duration and bounded result/error summaries. There are no real business tools, eval, dynamic imports, shell access, provider-native schemas or external network calls.
