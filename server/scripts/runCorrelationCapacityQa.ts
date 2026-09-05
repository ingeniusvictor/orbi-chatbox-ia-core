import { InMemoryConversationCorrelationStore } from "../src/services/inMemoryConversationCorrelationStore.js";
import { ConversationCorrelationError } from "../src/types/conversationCorrelation.js";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const key = (externalConversationId: string) => ({ channel: "web" as const, externalConversationId });

try {
  const store = new InMemoryConversationCorrelationStore(2);
  store.bind(key("one"), { conversationId: "orbi-one" });
  store.bind(key("two"), { conversationId: "orbi-two" });
  assert(store.bind(key("one"), { conversationId: "orbi-one" }).conversationId === "orbi-one", "Idempotent bind must work at capacity.");
  let capacityRejected = false;
  try { store.bind(key("three"), { conversationId: "orbi-three" }); } catch (error) { capacityRejected = error instanceof ConversationCorrelationError && error.code === "CORRELATION_CAPACITY_REACHED"; }
  assert(capacityRejected && !store.resolve(key("three")), "New mapping must fail safely at capacity without eviction.");
  assert(store.release(key("one")), "Explicit release must free one bounded slot.");
  assert(store.bind(key("three"), { conversationId: "orbi-three" }).conversationId === "orbi-three", "Released capacity must be reusable.");
  const restartedStore = new InMemoryConversationCorrelationStore(2);
  assert(!restartedStore.resolve(key("two")), "New process-local store must begin empty; persistence is intentionally absent.");
  console.info("Correlation Capacity QA: PASS (max entries reject policy, explicit release, restart ephemerality)");
} catch (error) { console.error(error); process.exit(1); }
