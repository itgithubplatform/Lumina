/*
  Warnings:

  - A unique constraint covering the columns `[teacherId,name]` on the table `ClassRoom` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `subject` to the `ClassRoom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClassRoom" ADD COLUMN     "subject" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ClassRoom_teacherId_name_key" ON "ClassRoom"("teacherId", "name");
