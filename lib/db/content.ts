import { prisma } from './prisma';
import { ContentType, Difficulty, ProcessingStatus, AccessibilityType } from '@prisma/client';

export interface ContentData {
  title: string;
  type: ContentType;
  originalFilePath?: string;
  youtubeUrl?: string;
  classroomId: string;
  teacherId: string;
  durationMinutes?: number;
  difficulty: Difficulty;
}

export class ContentService {
  static async createContent(data: ContentData) {
    return await prisma.content.create({
      data,
      include: {
        classroom: true,
        teacher: true,
      },
    });
  }

  static async getContentByClassroom(classroomId: string) {
    return await prisma.content.findMany({
      where: { classroomId },
      include: {
        processedContent: true,
        studentProgress: true,
      },
      orderBy: { uploadDate: 'desc' },
    });
  }

  static async getContentById(id: string) {
    return await prisma.content.findUnique({
      where: { id },
      include: {
        classroom: true,
        teacher: true,
        processedContent: true,
      },
    });
  }

  static async updateProcessingStatus(id: string, status: ProcessingStatus) {
    return await prisma.content.update({
      where: { id },
      data: { processingStatus: status },
    });
  }

  static async createProcessedContent(
    contentId: string,
    accessibilityType: AccessibilityType,
    processedData: any
  ) {
    return await prisma.processedContent.upsert({
      where: {
        contentId_accessibilityType: {
          contentId,
          accessibilityType,
        },
      },
      update: {
        processedData,
        processingCompleted: true,
      },
      create: {
        contentId,
        accessibilityType,
        processedData,
        processingCompleted: true,
      },
    });
  }

  static async getProcessedContent(contentId: string, accessibilityType?: AccessibilityType) {
    if (accessibilityType) {
      return await prisma.processedContent.findUnique({
        where: {
          contentId_accessibilityType: {
            contentId,
            accessibilityType,
          },
        },
      });
    }

    return await prisma.processedContent.findMany({
      where: { contentId },
    });
  }

  static async updateStudentProgress(
    studentId: string,
    contentId: string,
    progressData: {
      progressPercentage?: number;
      timeSpentMinutes?: number;
      completed?: boolean;
      bookmarks?: any;
      notes?: string;
    }
  ) {
    return await prisma.studentProgress.upsert({
      where: {
        studentId_contentId: {
          studentId,
          contentId,
        },
      },
      update: {
        ...progressData,
        lastAccessed: new Date(),
      },
      create: {
        studentId,
        contentId,
        ...progressData,
      },
    });
  }

  static async getStudentProgress(studentId: string, contentId?: string) {
    if (contentId) {
      return await prisma.studentProgress.findUnique({
        where: {
          studentId_contentId: {
            studentId,
            contentId,
          },
        },
        include: {
          content: true,
        },
      });
    }

    return await prisma.studentProgress.findMany({
      where: { studentId },
      include: {
        content: {
          include: {
            classroom: true,
          },
        },
      },
      orderBy: { lastAccessed: 'desc' },
    });
  }
}