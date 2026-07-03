import { anthropic } from "@/lib/claude";
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { jobTitle, language } = await req.json();

    if (!jobTitle) {
      return NextResponse.json(
        { error: 'Job title is required' },
        { status: 400 }
      );
    }

    const prompt = `
      You are an expert resume writer.
      Generate 6-8 professional, potent, and metric-oriented bullet points for a "${jobTitle}".
      Language: ${language || 'English'}.
      
      Format the output as a JSON object with a key "suggestions" containing an array of strings.
      Example:
      {
        "suggestions": [
          "Managed a team of X developed...",
          "Increased revenue by Y% through..."
        ]
      }
      
      Ensure the tone is active, professional, and suitable for a CV.
    `;

    const result = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }]
    });
    
    const text = result.content[0].type === "text" ? result.content[0].text : "";
    
    try {
        const json = JSON.parse(text);
        return NextResponse.json({ suggestions: json.suggestions || [] });
    } catch (parseError) {
        console.error("Failed to parse Gemini JSON:", text, parseError);
         // Fallback manual parse if JSON fails (unlikely with json mode but safe)
        return NextResponse.json({ suggestions: [] });
    }

  } catch (error) {
    console.error('Error generating suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    );
  }
}
