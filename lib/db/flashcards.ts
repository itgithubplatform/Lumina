import { prisma } from './prisma';
import { Difficulty } from '@prisma/client';

export interface FlashcardData {
  front: string;
  back: string;
  category: string;
  difficulty: Difficulty;
  visualCues?: string[];
  simplifiedVersion?: {
    front: string;
    back: string;
  };
}

export class FlashcardService {
  static async createFlashcard(userId: string, data: FlashcardData) {
    return await prisma.flashcard.create({
      data: {
        userId,
        front: data.front,
        back: data.back,
        category: data.category,
        difficulty: data.difficulty,
        visualCues: data.visualCues,
        simplifiedVersion: data.simplifiedVersion,
      },
    });
  }

  static async getUserFlashcards(userId: string, category?: string) {
    return await prisma.flashcard.findMany({
      where: {
        userId,
        ...(category && { category }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getFlashcardById(id: string) {
    return await prisma.flashcard.findUnique({
      where: { id },
    });
  }

  static async updateFlashcard(id: string, data: Partial<FlashcardData>) {
    return await prisma.flashcard.update({
      where: { id },
      data,
    });
  }

  static async deleteFlashcard(id: string) {
    return await prisma.flashcard.delete({
      where: { id },
    });
  }

  static async getFlashcardsByDifficulty(userId: string, difficulty: Difficulty) {
    return await prisma.flashcard.findMany({
      where: {
        userId,
        difficulty,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getFlashcardCategories(userId: string) {
    const categories = await prisma.flashcard.findMany({
      where: { userId },
      select: { category: true },
      distinct: ['category'],
    });
    
    return categories.map(c => c.category);
  }
}