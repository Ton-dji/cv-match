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
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(users);
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
