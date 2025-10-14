-- CreateTable
CREATE TABLE "StudentFiles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "classId" TEXT NOT NULL,
    "audioLink" TEXT,
    "status" "Status" NOT NULL DEFAULT 'processing',
    "extractedText" TEXT,
    "blindFriendlyLink" TEXT,
    "transcript" JSONB,
    "dislexiaFriendly" JSONB,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "StudentFiles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StudentFiles" ADD CONSTRAINT "StudentFiles_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
