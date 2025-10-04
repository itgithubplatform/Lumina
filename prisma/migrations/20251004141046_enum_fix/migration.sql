/*
  Warnings:

  - The values [colorblind,mobilityImpairment] on the enum `Accessibility` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Accessibility_new" AS ENUM ('dyslexia', 'visualImpairment', 'hearingImpairment', 'cognitiveDisability');
ALTER TABLE "public"."User" ALTER COLUMN "accessibility" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "accessibility" TYPE "Accessibility_new"[] USING ("accessibility"::text::"Accessibility_new"[]);
ALTER TYPE "Accessibility" RENAME TO "Accessibility_old";
ALTER TYPE "Accessibility_new" RENAME TO "Accessibility";
DROP TYPE "public"."Accessibility_old";
ALTER TABLE "User" ALTER COLUMN "accessibility" SET DEFAULT ARRAY[]::"Accessibility"[];
COMMIT;
