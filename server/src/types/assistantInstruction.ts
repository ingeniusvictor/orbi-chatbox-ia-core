export type AssistantInstruction = {
  readonly assistantId: string;
  readonly assistantName: string;
  readonly version: "1";
  readonly text: string;
  readonly characterCount: number;
};
