import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const files = await prisma.studentFiles.findMany({
      where: { studentId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ files });
  } catch (error) {
    console.error('Error fetching student files:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
