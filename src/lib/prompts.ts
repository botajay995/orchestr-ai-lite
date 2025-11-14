export const prompts = {
  teamAssistant: ({ teamId, question }) => `
Team ID: ${teamId}
You are a smart team assistant.

Respond ONLY in JSON:
{
  "suggestions": ["string"],
  "actions": [{"type": "something", "payload": {}}]
}

Question: ${question}
  `,
};
