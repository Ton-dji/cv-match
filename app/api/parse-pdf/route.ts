import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/claude";
// @ts-expect-error - pdf-parse lacks types
import pdfFn from 'pdf-parse/lib/pdf-parse';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfData = await pdfFn(buffer);
    const text = pdfData.text;

    console.log("PDF Text length:", text.length);

    // AI Parsing
    const prompt = `
      Extract CV data from the following text into strict JSON matching the interface below:
      
      interface MasterProfile {
        fullName: string;
        email: string;
        phone: string;
        location: string;
        summary: string;
        experience: { id: string, role: string, company: string, location: string, startDate: string, endDate: string, description: string }[];
        education: { id: string, degree: string, school: string, location: string, startDate: string, endDate: string }[];
        skills: string[];
      }

      CV Text:
      ${text.substring(0, 15000)}

      Instructions:
      1. Extract as much detail as possible.
      2. Use "Present" for current roles endDate.
      3. For ID fields, generate a random string or leave blank (frontend will handle).
      4. Return ONLY valid JSON.
    `;

    console.log("PDF Import: Sending to Claude...");
    const result = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }]
    });
    
    const responseText = result.content[0].type === "text" ? result.content[0].text : "";
    console.log("PDF Import: Claude response received");
    
    const cleanText = responseText.replace(/```json\n?|\n?```/g, "").trim();
    let profileData;
    try {
        profileData = JSON.parse(cleanText);
    } catch (jsonError: unknown) {
        console.error("PDF Import: JSON parse error", jsonError, cleanText);
        return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    return NextResponse.json(profileData);

  } catch (error: unknown) {
    console.error("PDF Import: General Error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
