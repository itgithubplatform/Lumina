import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get('id');
        
        if (!id) {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }

        const session = await getServerSession(authOptions);
        
        if (!session) {
            return NextResponse.redirect(new URL('/auth/signin', req.url));
        }
        
        if (session.user.role !== 'student') {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }

        const classRoom = await prisma.classroom.findUnique({
            where: { id },
            include: { students: true }
        });

        if (!classRoom) {
            return NextResponse.redirect(new URL('/classroom/create', req.url));
        }

        const isAlreadyEnrolled = classRoom.students.some((student) => student.id === session.user.id);
        
        if (isAlreadyEnrolled) {
            return NextResponse.redirect(new URL(`/classroom/${classRoom.id}`, req.url));
        }

        const updatedClassRoom = await prisma.classroom.update({
            where: { id },
            data: {
                students: {
                    connect: { id: session.user.id }
                }
            }
        });

        return NextResponse.redirect(new URL(`/classroom/${updatedClassRoom.id}`, req.url));

    } catch (error) {
        console.log('Join classroom error:', error);
        return NextResponse.redirect(new URL('/dashboard?error=join_failed', req.url));
    }
}