import OpenAI from "openai";
import { prompts } from "./prompts";
import { AgentResponse } from "./types";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function callAI({ teamId, question }): Promise<AgentResponse> {
  const prompt = prompts.teamAssistant({ teamId, question });

  const resp = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are OrchestrAI, a helpful team assistant." },
      { role: "user", content: prompt },
    ],
    max_tokens: 600,
  });

  const content = resp.choices?.[0]?.message?.content || "";

  try {
    return JSON.parse(content) as AgentResponse;
  } catch {
    return {
      suggestions: [content],
      actions: [],
    };
  }
}
