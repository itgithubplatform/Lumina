/*
  Warnings:

  - The `dislexiaFriendly` column on the `Files` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Files" DROP COLUMN "dislexiaFriendly",
ADD COLUMN     "dislexiaFriendly" JSONB;
