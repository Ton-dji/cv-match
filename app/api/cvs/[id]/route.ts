import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
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

    const cv = await prisma.tailoredCV.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!cv) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    return NextResponse.json({
        ...cv,
        content: JSON.parse(cv.content)
    });
  } catch (error) {
    console.error("Error fetching CV:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
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

    const cv = await prisma.tailoredCV.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!cv) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    await prisma.tailoredCV.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting CV:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
