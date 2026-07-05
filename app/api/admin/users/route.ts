import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).role !== "ADMIN") {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        isPremium: true,
        freeAccess: true,
        credits: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    const totalCVs = await prisma.tailoredCV.count();
    
    const stats = {
      totalUsers: users.length,
      premiumUsers: users.filter(u => u.isPremium).length,
      totalCVs
    };

    return NextResponse.json({ users, stats });
  } catch (error) {
    console.error("Admin Users GET Error:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).role !== "ADMIN") {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { userId, freeAccess } = await req.json();
    
    if (!userId || typeof freeAccess !== "boolean") {
      return new NextResponse('Invalid data', { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { freeAccess }
    });
    
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Admin Users PATCH Error:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).role !== "ADMIN") {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { userId, creditsToAdd } = await req.json();
    
    if (!userId || typeof creditsToAdd !== "number") {
      return new NextResponse('Invalid data', { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { credits: { increment: creditsToAdd } }
    });
    
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Admin Users POST Error:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).role !== "ADMIN") {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return new NextResponse('User ID required', { status: 400 });
    }

    await prisma.user.delete({
      where: { id: userId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin Users DELETE Error:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
