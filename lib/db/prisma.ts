// lib/db/prisma.ts
import PrismaClientPkg from '@prisma/client';
const { PrismaClient } = PrismaClientPkg; // extract the class

// Create a global variable to prevent multiple instances in dev
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
