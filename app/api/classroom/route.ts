import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions)
    if(!session || session?.user?.role !== "teacher"){
        return NextResponse.json({ message: "Unauthorized to get classrooms" }, { status: 401 });
    }
    try{
        const res = await prisma.classroom.findMany({
            where: {
                teacherId: session.user.id
            },
            include: {
                _count: {
                    select: { students: true }
                }
            },
        })
        console.log(res);
        
        return NextResponse.json({ classrooms: res }, { status: 200 });
    }catch(e){
        console.log(e)
        return NextResponse.json({ message: "Error getting classrooms" }, { status: 500 });
    }
}

