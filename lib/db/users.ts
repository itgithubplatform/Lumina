import { prisma } from './prisma';
import { Role, AccessibilityProfile } from '@prisma/client';

export interface UserData {
  email: string;
  name: string;
  passwordHash?: string;
  role: Role;
  accessibilityProfile: AccessibilityProfile;
  settings?: any;
}

export class UserService {
  static async createUser(data: UserData) {
    return await prisma.user.create({
      data,
    });
  }

  static async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        learningStreak: true,
        achievements: true,
      },
    });
  }

  static async getUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        learningStreak: true,
        achievements: true,
        notifications: {
          where: { readStatus: false },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });
  }

  static async updateUserSettings(id: string, settings: any) {
    return await prisma.user.update({
      where: { id },
      data: { settings },
    });
  }

  static async updateAccessibilityProfile(id: string, profile: AccessibilityProfile) {
    return await prisma.user.update({
      where: { id },
      data: { accessibilityProfile: profile },
    });
  }

  static async getUserProgress(userId: string) {
    return await prisma.studentProgress.findMany({
      where: { studentId: userId },
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

  static async getAccessibilityUsage(userId: string) {
    return await prisma.accessibilityUsage.groupBy({
      by: ['featureType'],
      where: { userId },
      _sum: {
        usageCount: true,
        sessionDurationSeconds: true,
      },
      _avg: {
        sessionDurationSeconds: true,
      },
    });
  }
}