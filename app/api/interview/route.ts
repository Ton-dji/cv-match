import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/claude";

export async function POST(req: NextRequest) {
  try {
    const { chatHistory, optimizedCV, jobDescription, targetLanguage } = await req.json();

    if (!optimizedCV || !jobDescription) {
      return NextResponse.json(
        { error: "optimizedCV and jobDescription are required" },
        { status: 400 }
      );
    }

    const language = targetLanguage || "English";

    const cleanProfile = { ...optimizedCV };
    delete cleanProfile.picture;

    const systemPrompt = `You are an expert Senior Hiring Manager conducting a job interview.
Your goal is to interview the user for the role described in the Job Description, based on their provided CV.

Target Language: ${language}
ALL of your responses, questions, and feedback MUST be in the Target Language.

Job Description:
${jobDescription.substring(0, 15000)}

User's CV:
${JSON.stringify(cleanProfile, null, 2)}

Instructions:
1. Act as the interviewer. Be professional, slightly challenging, but encouraging.
2. Ask ONE question at a time. Do not ask multiple questions in a single message.
3. The questions should be highly specific to their CV experience and how it relates to the Job Description.
4. Keep track of the interview. It should last exactly 3-4 questions total.
5. If the user has answered the final question, provide a comprehensive, constructive piece of feedback on their overall interview performance, highlighting strengths and areas for improvement.
6. Keep your responses relatively concise (2-4 sentences max).
7. NEVER break character. ALWAYS speak in the exact Target Language specified.`;

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1000,
      temperature: 0.7,
      system: systemPrompt,
      messages: chatHistory,
    });

    let aiMessage = "";

    for (const content of response.content) {
      if (content.type === "text") {
        aiMessage += content.text;
      }
    }

    return NextResponse.json({
      message: aiMessage,
    });
  } catch (error) {
    console.error("Error in interview route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
