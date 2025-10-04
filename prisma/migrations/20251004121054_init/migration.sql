-- CreateEnum
CREATE TYPE "Role" AS ENUM ('student', 'teacher');

-- CreateEnum
CREATE TYPE "Accessibility" AS ENUM ('dyslexia', 'colorblind', 'visualImpairment', 'hearingImpairment', 'mobilityImpairment', 'cognitiveDisability');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accessibility" "Accessibility"[] DEFAULT ARRAY[]::"Accessibility"[],
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'student';
