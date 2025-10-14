import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if(!session) {
        return new Response("Unauthorized", { status: 401 });
    }
    if(session.user.role !== 'student') {
        return new Response("Forbidden", { status: 403 });
    }
try {
    const classrooms = await prisma.classroom.findMany({
      where: {
        students: {
          some: {
            id: session.user.id
          }
        }
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        students: {
          select: {
            id: true,
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      },
    });
    const files = await prisma.studentFiles.findMany({
      where: {
        studentId: session.user.id
      },
      include: {
        Student: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return new Response(JSON.stringify({ classrooms, files }), { status: 200 });
} catch (error) {
    return new Response("Internal Server Error", { status: 500 });
}
}