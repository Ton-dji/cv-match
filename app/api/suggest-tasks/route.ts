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
      You are an expert resume writer and career coach.
      Generate 10 highly specific, professional, potent, and metric-oriented bullet points for the position of "${jobTitle}".
      Make the suggestions highly relevant to the actual daily tasks and accomplishments of this specific role.
      CRITICAL: You MUST write the suggestions in this language: ${language || 'English'}. If the language is not English, respond entirely in that language.
      CRITICAL WRITING STYLE: Instead of using 1st-person ("I managed") or 3rd-person ("Manages"), you MUST use action nouns (substantives) or infinitives. For example, in Spanish use "Gestión de equipos..." (noun) instead of "Gestioné..." or "Gestiona...". In English use "Management of..." or "Development of...".
      
      Format the output as a JSON object with a key "suggestions" containing an array of strings.
      Example:
      {
        "suggestions": [
          "...",
          "..."
        ]
      }
      
      Ensure the tone is active, professional, and suitable for a modern CV.
    `;

    const result = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }]
    });
    
    const text = result.content[0].type === "text" ? result.content[0].text : "";
    
    let cleanText = text.trim();
    if (cleanText.startsWith('```json')) {
        cleanText = cleanText.substring(7);
    } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.substring(3);
    }
    if (cleanText.endsWith('```')) {
        cleanText = cleanText.substring(0, cleanText.length - 3);
    }
    cleanText = cleanText.trim();
    
    try {
        const json = JSON.parse(cleanText);
        return NextResponse.json({ suggestions: json.suggestions || [] });
    } catch (parseError) {
        console.error("Failed to parse Gemini JSON:", text, parseError);
        // Try to extract suggestions using regex if JSON parse fails
        const match = cleanText.match(/"suggestions"\s*:\s*(\[[\s\S]*?\])/);
        if (match && match[1]) {
            try {
                const suggestions = JSON.parse(match[1]);
                return NextResponse.json({ suggestions });
            } catch (e) {
                console.error("Regex extraction failed too", e);
            }
        }
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
