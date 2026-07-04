import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/claude";

// Set max duration for Vercel (Hobby plan limit is often 10s or 60s, Pro is 300s)
export const maxDuration = 60; 

export async function POST(req: NextRequest) {
  try {
    const { masterProfile, jobDescription, targetLanguage } = await req.json();
    console.log("Optimize: Request received", { targetLanguage, hasProfile: !!masterProfile, hasJD: !!jobDescription });

    if (!masterProfile || !jobDescription) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log("Optimizing CV for target language:", targetLanguage);

    const prompt = `
      Act as an expert Senior Recruiter and Professional CV Writer.
      Your task is to rewrite the input CV to target the provided Job Description.

      GOAL: Create a highly professional, "human-written" CV that avoids AI clichés (e.g., avoid "spearheaded", "orchestrated", "navigated" unless truly appropriate).
      TONE: Confident, factual, concise, and impact-oriented.
      
      Target Language: ${targetLanguage || "English"} (Translate everything to this language).
      
      Input CV:
      ${JSON.stringify(masterProfile)}
      
      Job Description:
      ${jobDescription}
      
      Instructions:
      1. **Title**: Update the 'title' field to perfectly match or closely mirror the role/title specified in the Job Description, translated to the Target Language. This is crucial for ATS matching.
      2. **Professional Summary**: Write a compelling 3-4 line summary. Focus on value proposition and fit for the role. Avoid generic fluff.
      3. **Experience**:
         - Rewrite bullet points to focus on RESULTS and IMPACT (Quantitative metrics where possible).
         - Use strong, varied action verbs.
         - NATURALLY weave in keywords from the JD, but do not stuffing.
         - TRANSLATE strictly to the Target Language.
      3. **Skills**: Reorder and prioritize skills most relevant to the JD. Remove irrelevant filler skills.
      4. **Languages**: Keep all. Translate proficiency levels.
      5. **Education**: Keep all. Translate degrees/majors.
      6. **Certifications**: Keep relevant ones.
      7. **Projects**: Rewrite to highlight technical challenges solved and technologies used.
      8. **Formatting**: Ensure the output is valid JSON matching the exact MasterProfile schema.
      9. **Translation**: Ensure high-quality native-level translation for '${targetLanguage}'.

      Output JSON Format:
      {
        "fullName": "...",
        "title": "...",
        "email": "...",
        "phone": "...",
        "location": "...",
        "summary": "...",
        "experience": [ { 
           "id": "...", 
           "role": "...", 
           "company": "...", 
           "location": "...", 
           "startDate": "...", 
           "endDate": "...", 
           "description": "...", 
           "highlights": ["Task 1", "Task 2"] // Array of bullet points
        } ],
        "education": [ { "id": "...", "degree": "...", "school": "...", "location": "...", "startDate": "...", "endDate": "..." } ],
        "skills": [ "..." ],
        "languages": [ { "language": "...", "proficiency": "..." } ],
        "certifications": [ { "name": "...", "issuer": "...", "date": "..." } ],
        "projects": [ { "name": "...", "description": "...", "url": "..." } ],
        "socialLinks": [ { "platform": "...", "url": "..." } ]
      }
    `;

    try {
        const result = await anthropic.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 4096,
          messages: [{ role: "user", content: prompt }]
        });
        const responseText = result.content[0].type === "text" ? result.content[0].text : "";
        console.log("Claude Raw Response:", responseText); // Debug log

        let optimizedCV;
        try {
            optimizedCV = JSON.parse(responseText);
        } catch (jsonError) {
            console.error("Initial JSON Parse Error:", jsonError);
            // Robust fallback: find the JSON object within the text
            const firstBrace = responseText.indexOf('{');
            const lastBrace = responseText.lastIndexOf('}');
            
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                const cleanText = responseText.substring(firstBrace, lastBrace + 1);
                try {
                    optimizedCV = JSON.parse(cleanText);
                } catch (innerError) {
                     console.error("Secondary JSON Parse Error on substring:", innerError);
                     throw new Error("Failed to parse AI response as JSON even after cleaning.");
                }
            } else {
                 throw new Error("No JSON object found in AI response.");
            }
        }

    return NextResponse.json(optimizedCV);
    } catch (genError: unknown) {
        console.error("Gemini Generation Error:", genError);
        const message = genError instanceof Error ? genError.message : String(genError);
        return NextResponse.json({ error: "AI Generation failed: " + message }, { status: 500 });
    }

  } catch (error: unknown) {
    console.error("General API Error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: "Internal Server Error: " + message }, { status: 500 });
  }
}
