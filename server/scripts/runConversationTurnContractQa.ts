import { ConversationTurnValidationError, createConversationTurn, MAX_CONVERSATION_TURN_CHARACTERS, validateConversationTurn } from "../src/services/conversationTurn.js";

const assert = (condition: unknown, message: string): void => {
  if (!condition) throw new Error(message);
};

const rejects = (input: Parameters<typeof createConversationTurn>[0]): boolean => {
  try {
    createConversationTurn(input);
    return false;
  } catch (error) {
    return error instanceof ConversationTurnValidationError;
  }
};

const main = (): void => {
  const conversationId = "ephemeral-conversation-qa";
  const user = createConversationTurn({ conversationId, role: "user", content: "  Hola LUMI  ", sequence: 1 });
  const assistant = createConversationTurn({ conversationId, role: "assistant", content: "Hola, soy LUMI.", sequence: 2 });
  const repeated = createConversationTurn({ conversationId, role: "user", content: "Hola LUMI", sequence: 3 });
  const passed = user.role === "user"
    && assistant.role === "assistant"
    && user.conversationId === conversationId
    && user.content === "Hola LUMI"
    && user.sequence === 1
    && assistant.sequence > user.sequence
    && user.id.length > 0
    && user.id !== assistant.id
    && repeated.id !== user.id
    && validateConversationTurn(user)
    && validateConversationTurn(assistant)
    && Object.isFrozen(user)
    && rejects({ conversationId, role: "system" as never, content: "blocked", sequence: 1 })
    && rejects({ conversationId, role: "user", content: "", sequence: 1 })
    && rejects({ conversationId, role: "user", content: "   ", sequence: 1 })
    && rejects({ conversationId, role: "user", content: "x".repeat(MAX_CONVERSATION_TURN_CHARACTERS + 1), sequence: 1 })
    && rejects({ conversationId, role: "user", content: "valid", sequence: 0 })
    && rejects({ conversationId, role: "user", content: "valid", sequence: -1 })
    && rejects({ conversationId, role: "user", content: "valid", sequence: 1.5 });
  assert(passed, "Conversation Turn Contract QA: FAIL");
  console.info("Conversation Turn Contract QA: PASS (ephemeral contract only; no history store or provider integration)");
};

main();
