import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const validOptions = ["dyslexia", "visualImpairment", "hearingImpairment", "cognitiveDisability"];

export async function POST(req: Request) {
    const data = await req.json();
    const session = await getServerSession(authOptions);
    const { role, accessibility } = data;
    console.log(data,session?.user.id);
    
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (role !== "student" && role !== "teacher") {
        return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }
    if (role === "student") {
        if (!Array.isArray(accessibility) || accessibility.length > 2) {
            return NextResponse.json({ message: "Invalid accessibility options" }, { status: 400 });
        }
        for (const option of accessibility) {
            if (!validOptions.includes(option)) {
                return NextResponse.json({ message: "Invalid accessibility option: " + option }, { status: 400 });
            }
        }
    }
    try {
        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                role,
                accessibility: role === "teacher" ? [] : accessibility,
            }
        });
        console.log(user);
        
        return NextResponse.json({ message: "User updated successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}