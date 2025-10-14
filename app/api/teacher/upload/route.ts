import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'teacher') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const disabilityTypes = JSON.parse(formData.get('disabilityTypes') as string);
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Simulate AI processing
    const summary = `AI Summary: This lesson covers key concepts with ${disabilityTypes.length} adaptive formats. Content has been automatically transformed for visual, hearing, and cognitive accessibility needs.`;

    // Get all students with matching disability types
    const students = await prisma.user.findMany({
      where: {
        role: 'student',
        accessibility: {
          hasSome: disabilityTypes,
        },
      },
    });

    // Create file records for each student
    const filePromises = students.map(student =>
      prisma.studentFiles.create({
        data: {
          name: file.name,
          link: `/uploads/${file.name}`,
          studentId: student.id,
          status: 'completed',
          extractedText: summary,
        },
      })
    );

    await Promise.all(filePromises);

    return NextResponse.json({ 
      success: true, 
      summary,
      studentsReached: students.length 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
