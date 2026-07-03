import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/claude";

export async function POST(req: NextRequest) {
  try {
    const { transcript } = await req.json();

    if (!transcript) {
      return NextResponse.json(
        { error: "Transcript is required" },
        { status: 400 }
      );
    }

    const prompt = `You are an expert resume writer. The following is a raw, unedited voice transcript of a person talking about their background, experience, education, and skills. 
Your goal is to extract all relevant resume information and format it into a specific JSON structure.
Rewrite any ramblings or casual speech into highly professional, metric-driven resume language.

The JSON structure you must return is a Partial<MasterProfile> object. Only include the fields you can find or deduce from the transcript.
Fields available:
- fullName (string)
- title (string) - Target job title or current headline
- email (string)
- phone (string)
- location (string)
- summary (string) - A professional summary paragraph
- experience (array of objects): { role, company, location, startDate, endDate, description, highlights (array of string bullet points) }
- education (array of objects): { degree, school, location, startDate, endDate }
- skills (array of strings)
- languages (array of objects): { language, proficiency }
- certifications (array of objects): { name, issuer, date }
- projects (array of objects): { name, description, url }

IMPORTANT: Return ONLY the raw JSON object. No markdown formatting, no \`\`\`json blocks, and no other text. Just the JSON.

TRANSCRIPT:
"""
${transcript}
"""
`;

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2000,
      temperature: 0.2,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content =
      response.content[0].type === "text" ? response.content[0].text : "";
    
    // Clean up potential markdown formatting just in case
    let jsonString = content.trim();
    // Use regex to strip out ```json and ``` regardless of newlines
    jsonString = jsonString.replace(/^```(json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    try {
      const parsedData = JSON.parse(jsonString);
      return NextResponse.json({ data: parsedData });
    } catch (parseError) {
      console.error("Error parsing Claude response as JSON:", content);
      return NextResponse.json(
        { error: "Failed to parse AI response into JSON" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error parsing voice transcript:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
