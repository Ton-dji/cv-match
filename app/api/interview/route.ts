import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/claude";

export async function POST(req: NextRequest) {
  try {
    const { chatHistory, currentProfile, latestUserMessage } = await req.json();

    if (!latestUserMessage) {
      return NextResponse.json(
        { error: "latestUserMessage is required" },
        { status: 400 }
      );
    }

    const messages = [
      ...chatHistory,
      { role: "user", content: latestUserMessage }
    ];

    const systemPrompt = `You are a friendly, professional AI Resume Assistant. You are interviewing the user to build their CV.
Your goal is to extract information about their work experience, education, skills, and background, and use the 'update_cv' tool to save that information directly into their resume profile JSON.
Keep your responses conversational, encouraging, and relatively brief (1-2 sentences). Ask ONE clear question at a time to keep the user focused.
Currently, the user's CV JSON is:
${JSON.stringify(currentProfile, null, 2)}`;

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1000,
      temperature: 0.5,
      system: systemPrompt,
      messages: messages,
      tools: [
        {
          name: "update_cv",
          description: "Update the user's CV with newly extracted information. Pass a partial MasterProfile object containing only the fields you want to update or append to.",
          input_schema: {
            type: "object",
            properties: {
              fullName: { type: "string" },
              title: { type: "string" },
              email: { type: "string" },
              phone: { type: "string" },
              location: { type: "string" },
              summary: { type: "string" },
              experience: { 
                type: "array", 
                items: {
                  type: "object",
                  properties: {
                    role: { type: "string" },
                    company: { type: "string" },
                    location: { type: "string" },
                    startDate: { type: "string" },
                    endDate: { type: "string" },
                    description: { type: "string" },
                  }
                }
              },
              education: { 
                type: "array", 
                items: {
                  type: "object",
                  properties: {
                    degree: { type: "string" },
                    school: { type: "string" },
                    location: { type: "string" },
                    startDate: { type: "string" },
                    endDate: { type: "string" }
                  }
                }
              },
              skills: { type: "array", items: { type: "string" } }
            }
          }
        }
      ]
    });

    let aiMessage = "";
    let cvUpdates = null;

    for (const content of response.content) {
      if (content.type === "text") {
        aiMessage += content.text;
      } else if (content.type === "tool_use" && content.name === "update_cv") {
        cvUpdates = content.input;
      }
    }

    return NextResponse.json({
      message: aiMessage,
      updates: cvUpdates
    });
  } catch (error) {
    console.error("Error in interview route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
