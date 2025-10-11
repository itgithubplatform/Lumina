"use client";

import React, { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StudentDashboardHeader from "./studentDashboardheader";
import { Session } from "next-auth";
import ClassCard from "./classCard";
import SummaryCards from "./summaryCard";

const mockClasses = [
  {
    id: "1",
    name: "Science 101",
    teacher: "Dr. Smith",
    lessons: [
      { id: "l1", title: "Solar System Basics", type: "video", teacher: "Dr. Smith", duration: "15:30", accessibility: { tts: true, captions: true, highContrast: true, simplified: false } },
      { id: "l2", title: "Gravity Explained", type: "pdf", teacher: "Dr. Smith", accessibility: { tts: true, captions: false, highContrast: true, simplified: true } },
    ]
  },
  {
    id: "2",
    name: "Mathematics Fundamentals",
    teacher: "Prof. Johnson",
    lessons: [
      { id: "l3", title: "Algebra Basics", type: "document", teacher: "Prof. Johnson", accessibility: { tts: true, captions: false, highContrast: false, simplified: true } },
    ]
  }
];

export default function StudentDashboard({ session }: {
  session: Session | null
}) {
  const handleOpenLesson = (lessonId: string) => {
  console.log("Open lesson:", lessonId);
  // Navigate to lesson viewer page
  };
  const handlePlayAudio = (lessonId: string) => {
  console.log("Play TTS for:", lessonId);
};
 const handleDownload = (lessonId: string) => {
    console.log("Download lesson:", lessonId);
  };
  return (
    <div className="min-h-screen max-w-7xl mx-auto p-6">
      <div className="container mx-auto p-4">
        <StudentDashboardHeader userName={session?.user?.name?.split(" ")[0] || ""} />
              <SummaryCards studentProfile={"hearing"} />

      {/* Classes */}
      {mockClasses.map((cls) => (
        <ClassCard
          key={cls.id}
          classData={cls}
          onOpenLesson={handleOpenLesson}
          onPlayAudio={handlePlayAudio}
          onDownload={handleDownload}
        />
      ))}

      </div>
    </div>
  );
}