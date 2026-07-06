
import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/claude";

export async function POST(req: NextRequest) {
  console.log("Analysis: Request received");
  try {
    const { masterProfile, jobDescription, targetLanguage } = await req.json();

    if (!masterProfile || !jobDescription) {
      console.error("Analysis: Missing fields", { hasProfile: !!masterProfile, hasJD: !!jobDescription });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const cleanProfile = { ...masterProfile };
    delete cleanProfile.picture;

    console.log("Analysis: Generating content...");
    const prompt = `
      Act as an expert ATS and Recruiter.
      Analyze the "Match Score" between the provided CV and Job Description.

      Input CV:
      ${JSON.stringify(cleanProfile)}

      Job Description:
      ${jobDescription.substring(0, 15000)}

      Target Language: ${targetLanguage || "English"}

      Instructions:
      1. Calculate a match score (0-100) based on skills, experience, and keywords.
      2. Identify CRITICAL skills or keywords from the JD that are missing or weak in the CV. Translate these skill names to the Target Language if appropriate.
      3. Provide a brief, actionable advice summary (max 2 sentences). MUST be written in the exact Target Language specified above.
      4. Return ONLY valid JSON.

      Output JSON Format:
      {
        "score": number, // e.g. 75
        "missingSkills": string[], // e.g. ["Typescript", "AWS"]
        "advice": "..." // e.g. "Add more details about your cloud experience."
      }
    `;

    const result = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });
    
    const text = result.content[0].type === "text" ? result.content[0].text : "";
    console.log("Analysis: Claude response", text.substring(0, 100) + "...");
    
    // Clean and parse
    const cleanText = text.replace(/```json\n?|\n?```/g, "").trim();
    const analysis = JSON.parse(cleanText);

    return NextResponse.json(analysis);

  } catch (error: unknown) {
    console.error("Analysis Error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
