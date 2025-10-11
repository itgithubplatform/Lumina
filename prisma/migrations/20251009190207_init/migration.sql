-- CreateEnum
CREATE TYPE "Status" AS ENUM ('processing', 'completed', 'failed');

-- AlterTable
ALTER TABLE "Files" ADD COLUMN     "audioLink" TEXT,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'processing',
ADD COLUMN     "transcript" TEXT;
