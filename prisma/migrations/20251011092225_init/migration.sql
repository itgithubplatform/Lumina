/*
  Warnings:

  - The `transcript` column on the `Files` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Files" ADD COLUMN     "blindFriendlyLink" TEXT,
ADD COLUMN     "dislexiaFriendly" TEXT,
DROP COLUMN "transcript",
ADD COLUMN     "transcript" JSONB;
