import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions)
    const req = await request.json()
    if(!session || session?.user?.role !== "teacher"){
        return NextResponse.json({ message: "Unauthorized to create classroom" }, { status: 401 });
    }
    if (!req.name || req.name?.trim() === ""||!req.subject || req.subject?.trim() === "") {
        return NextResponse.json({ message: "Classroom name is required" }, { status: 400 });
    }
    try{
        const res = await prisma.classroom.create({
            data: {
                name: req.name,
                teacherId: session.user.id,
                subject: req.subject
            }
        })
        return NextResponse.json({ message: "Classroom created successfully", classroom: res }, { status: 201 });
    }catch(e){
        console.log(e)
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json(
        { message: "A class with this name already exists." },
        { status: 409 }
      );
    }
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}