import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectDescription } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating project from description:", projectDescription);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a project planning assistant. Based on a project description, generate a team structure and task breakdown. Return ONLY valid JSON without any markdown formatting or code blocks.`
          },
          {
            role: "user",
            content: projectDescription
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_project_structure",
              description: "Generate team members and tasks for a project",
              parameters: {
                type: "object",
                properties: {
                  teamMembers: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        role: { type: "string" },
                        skills: {
                          type: "array",
                          items: { type: "string" }
                        },
                        workloadCapacity: { type: "number", minimum: 1, maximum: 10 }
                      },
                      required: ["name", "role", "skills", "workloadCapacity"],
                      additionalProperties: false
                    }
                  },
                  tasks: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        requiredSkills: {
                          type: "array",
                          items: { type: "string" }
                        },
                        priority: {
                          type: "string",
                          enum: ["low", "medium", "high"]
                        }
                      },
                      required: ["title", "description", "requiredSkills", "priority"],
                      additionalProperties: false
                    }
                  }
                },
                required: ["teamMembers", "tasks"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "generate_project_structure" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI Response:", JSON.stringify(data, null, 2));

    const toolCall = data.choices[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("No tool call in response");
    }

    const projectStructure = JSON.parse(toolCall.function.arguments);
    console.log("Generated project structure:", projectStructure);

    return new Response(
      JSON.stringify(projectStructure),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-project function:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate project";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
