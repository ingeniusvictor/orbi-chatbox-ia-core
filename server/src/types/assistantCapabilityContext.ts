export type AssistantCapabilityResult = {
  readonly capabilityId: string;
  readonly status: "success";
  readonly text: string;
  readonly resultIds: readonly string[];
};

/** Provider-neutral summary of a completed Core capability; it grants no capability permission. */
export type AssistantCapabilityContext = Readonly<AssistantCapabilityResult>;
