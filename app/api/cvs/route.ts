import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const cvs = await prisma.tailoredCV.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        jobTitle: true,
        company: true,
        score: true,
        language: true,
        createdAt: true,
        updatedAt: true,
        // Exclude large content/jobDescription strings from list view for performance
      }
    });

    return NextResponse.json(cvs);
  } catch (error) {
    console.error("Error fetching CVs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newCV = await prisma.tailoredCV.create({
      data: {
        userId: user.id,
        jobTitle: data.jobTitle,
        company: data.company,
        jobDescription: data.jobDescription,
        score: data.score,
        language: data.language || "English",
        content: JSON.stringify(data.content),
      },
    });

    return NextResponse.json(newCV);
  } catch (error) {
    console.error("Error saving CV:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
