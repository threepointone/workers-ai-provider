export type WorkersAIChatPrompt = Array<WorkersAIChatMessage>;

export type WorkersAIChatMessage =
  | WorkersAISystemMessage
  | WorkersAIUserMessage
  | WorkersAIAssistantMessage
  | WorkersAIToolMessage;

export interface WorkersAISystemMessage {
  role: "system";
  content: string;
}

export interface WorkersAIUserMessage {
  role: "user";
  content: string;
}

export interface WorkersAIAssistantMessage {
  role: "assistant";
  content: string;
  tool_calls?: Array<{
    id: string;
    type: "function";
    function: { name: string; arguments: string };
  }>;
}

export interface WorkersAIToolMessage {
  role: "tool";
  name: string;
  content: string;
}
