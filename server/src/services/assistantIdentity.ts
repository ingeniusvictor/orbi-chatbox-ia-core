import { LUMI_IDENTITY } from "../data/lumiIdentity.js";
import type { AssistantIdentity } from "../types/assistantIdentity.js";

/** Returns the frozen canonical identity; it has no provider or runtime dependency. */
export const getAssistantIdentity = (): Readonly<AssistantIdentity> => LUMI_IDENTITY;
export const getAssistantIdentityName = (): string => LUMI_IDENTITY.name;
