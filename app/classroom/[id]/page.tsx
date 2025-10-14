import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import FileUpload from "@/components/dashboard/fileUpload"; 
import ClassroomNotFound from "@/components/dashboard/classroomNotFound";
import { BookOpen, ExternalLink, FileText, Upload, Users } from "lucide-react";
import ShowClassRoom from "@/components/dashboard/showClassRoom";

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  const classroomId = (await params).id 
  
  if (session && session.user.role === "teacher") {
  try {
    const classroom = await prisma.classroom.findUnique({
        where: {
            id: classroomId,
            teacherId: session.user.id,
          },
          include: {
              files: true, 
              _count: {
                  select: { students: true },
              },
          },
      });
      
      
      if (!classroom || classroom.teacherId !== session.user.id) {
          return <ClassroomNotFound />;
      }
      
      return (
            <ShowClassRoom classroomData={classroom} />
    );
  } catch (error) {
    console.log(error);
    
    // throw new Error(`Failed to fetch classroom: ${error}`);
  }
  
}
if (session && session.user.role === "student") {
  try {
    const classroom = await prisma.classroom.findFirst({
        where: {
            id: classroomId,
            students: {
              some: {
                id: session.user.id
              }
            }
          },
          include: {
              files: true, 
              _count: {
                  select: { students: true },
              },
          },
      });
      
      
      if (!classroom) {
          return <ClassroomNotFound />;
      }
      
      return (
            <ShowClassRoom classroomData={classroom} />
    );
  } catch (error) {
    console.log(error);
    
    // throw new Error(`Failed to fetch classroom: ${error}`);
  }
  
}

  return <ClassroomNotFound />;

            }