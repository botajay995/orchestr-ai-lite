export type AgentResponse = {
  suggestions: string[];
  actions: { type: string; payload: any }[];
};
