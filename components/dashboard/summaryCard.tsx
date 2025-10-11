"use client";
import { motion, useReducedMotion } from "framer-motion";
import { Book, Clock, Headphones, FileText, Eye } from "lucide-react";

   
interface Stats {
  lessonsCompleted: number;
  ttsMinutes?: number;
  captionsUsed?: number;
  simplifiedLessons?: number;
  timeSpent: number;
}

interface AdaptiveSummaryCardsProps {
  studentProfile: "visual" | "hearing" | "cognitive";
  stats: Stats;
}

export default function AdaptiveSummaryCards({ studentProfile, stats }: AdaptiveSummaryCardsProps) {
  const prefersReducedMotion = useReducedMotion();

  const cards = [
    { title: "Lessons Completed", value: stats?.lessonsCompleted, icon: <Book size={20} className="text-indigo-600" /> },
    { title: "Time Spent (min)", value: stats?.timeSpent, icon: <Clock size={20} className="text-gray-600" /> },
  ];

  // Visual → TTS usage
  if (studentProfile === "visual" && stats?.ttsMinutes !== undefined) {
    cards.push({ title: "TTS Minutes", value: stats?.ttsMinutes, icon: <Headphones size={20} className="text-yellow-600" /> });
  }

  // Hearing → Captions usage
  if (studentProfile === "hearing" && stats?.captionsUsed !== undefined) {
    cards.push({ title: "Captions Used", value: stats?.captionsUsed, icon: <FileText size={20} className="text-green-600" /> });
  }

  // Cognitive → Simplified Lessons
  if (studentProfile === "cognitive" && stats?.simplifiedLessons !== undefined) {
    cards.push({ title: "Simplified Lessons", value: stats?.simplifiedLessons, icon: <Eye size={20} className="text-purple-600" /> });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {cards.map((card, idx) => (
        <motion.div
          key={card.title}
          className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-sm flex items-center gap-3 focus:ring-2 focus:ring-indigo-400"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
        >
          <div>{card.icon}</div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{card.title}</p>
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{card.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
