import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/claude";

export async function POST(req: NextRequest) {
  try {
    const { role, jobDescription, missingSkills, targetLanguage } = await req.json();

    if (!role) {
      return NextResponse.json({ error: "Missing role" }, { status: 400 });
    }

    const missingKeywordsPrompt = missingSkills && missingSkills.length > 0
      ? `CRITICAL: You MUST seamlessly weave the following ATS keywords into the bullet points: ${missingSkills.join(", ")}.`
      : `No specific missing keywords provided. Just generate highly optimized bullet points.`;

    const prompt = `
      Act as an expert Senior Recruiter and CV Writer.
      Generate 10 highly optimized, action-oriented resume bullet points for a candidate with the role: "${role}".
      
      ${jobDescription ? `Make the bullet points highly relevant to this Job Description context: ${jobDescription}` : ''}
      
      ${missingKeywordsPrompt}
      
      Instructions:
      1. Write exactly 10 bullet points.
      2. Focus on RESULTS and IMPACT. Use placeholder brackets for metrics (e.g., "[X]%").
      3. Start each bullet point with a strong action verb.
      4. Ensure natural integration of any provided ATS keywords. Do not force them awkwardly.
      5. Translate all output to the following language: ${targetLanguage || "English"}.
      6. Return ONLY valid JSON in the exact format below.

      Output JSON Format:
      {
        "phrases": [
          "Action-oriented bullet point 1...",
          "Action-oriented bullet point 2..."
        ]
      }
    `;

    const result = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }]
    });

    const text = result.content[0].type === "text" ? result.content[0].text : "";
    const cleanText = text.replace(/```json\n?|\n?```/g, "").trim();
    
    let parsed;
    try {
        parsed = JSON.parse(cleanText);
    } catch (e) {
        console.error("Failed to parse phrase library JSON:", cleanText);
        throw new Error("Failed to parse AI response");
    }

    return NextResponse.json(parsed);

  } catch (error: unknown) {
    console.error("Phrase Library Error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
