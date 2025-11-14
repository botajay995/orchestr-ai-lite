import { callAI } from "../lib/ai/agent";
import { z } from "zod";

// Validation schema for the incoming request
const askSchema = z.object({
  teamId: z.string(),
  question: z.string(),
});

// This function is triggered by the API route
export async function askAction(data) {
  const parsed = askSchema.parse(data);

  // Call your AI model
  const result = await callAI({
    teamId: parsed.teamId,
    question: parsed.question,
  });

  return result;
}
