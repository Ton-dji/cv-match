import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/claude";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const hasAccess = dbUser.isPremium || dbUser.freeAccess || dbUser.credits > 0;
    if (!hasAccess) {
      return NextResponse.json({ error: "INSUFFICIENT_CREDITS" }, { status: 403 });
    }

    const { masterProfile, jobDescription, targetLanguage } = await req.json();
    console.log("Cover Letter: Request received", { targetLanguage });

    if (!masterProfile || !jobDescription) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const prompt = `
      Act as an expert Senior Executive Assistant and Professional Cover Letter Writer.
      Write a compelling, professional, and tailored cover letter for the candidate based on their CV and the Job Description.

      Candidate CV:
      ${JSON.stringify(masterProfile)}

      Job Description:
      ${jobDescription}

      Instructions:
      1. Write a 3-4 paragraph cover letter.
      2. The opening should be strong and express enthusiasm for the specific role.
      3. The body should highlight 2-3 specific achievements or skills from the CV that perfectly align with the core requirements of the JD. Focus on impact and value proposition.
      4. Avoid generic fluff. Be concise and confident.
      5. Do not include placeholder addresses at the top (e.g. [Company Name]). Start directly with the salutation "Dear Hiring Manager," (translated appropriately).
      6. Translate the entire cover letter to the following language: ${targetLanguage || "English"}.
      7. Return ONLY valid JSON containing the text.

      Output JSON Format:
      {
        "coverLetter": "Dear Hiring Manager,\\n\\n..."
      }
    `;

    const result = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }]
    });

    const text = result.content[0].type === "text" ? result.content[0].text : "";
    let cleanText = text.replace(/```json\n?|\n?```/g, "").trim();
    const jsonStart = cleanText.indexOf('{');
    const jsonEnd = cleanText.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
        cleanText = cleanText.substring(jsonStart, jsonEnd + 1);
    }
    
    let parsed;
    try {
        parsed = JSON.parse(cleanText);
    } catch (e) {
        console.error("Failed to parse cover letter JSON:", cleanText);
      throw new Error("Failed to parse AI response: The model did not return valid JSON.");
    }

    // Deduct 1 credit if they are on free tier
    if (!dbUser.isPremium && !dbUser.freeAccess) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { credits: Math.max(0, dbUser.credits - 1) },
      });
    }

    return NextResponse.json(parsed);

  } catch (error: unknown) {
    console.error("Cover Letter Error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
