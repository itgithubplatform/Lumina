import FileDisplayer from '@/components/displayFiles/fileDisplayer';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';
import React from 'react';

export default async function FileViewPage({ params }: any) {
  const session = await getServerSession(authOptions);
  const id = (await params).id;
  console.log(id);
  
  if (!session) {
    return redirect('/auth/signin');
  }

  try {
    const file = await prisma.files.findFirst({
      where: {
        id: id,
        OR: [
          {
            class: {
              teacherId: session.user.id,
            },
          },
          {
            class: {
              students: {
                some: {
                  id: session.user.id,
                },
              },
            },
          },
        ],
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
            teacherId: true,
            students: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
    console.log(file);
    
    if (!file) {
      return notFound();
    }

    

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 py-8 px-4">
        {
        // @ts-ignore
        <FileDisplayer file={file} userId={session.user.id} />
        }
      </div>
    );
  } catch (error) {
    throw new Error('Failed to fetch file');
  }
}