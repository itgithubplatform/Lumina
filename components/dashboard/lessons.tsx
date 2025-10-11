"use client";
import { motion, useReducedMotion } from "framer-motion";
import { Headphones, FileText, Play, Download } from "lucide-react";

interface LessonCardProps {
  lesson: {
    id: string;
    title: string;
    type: "video" | "pdf" | "document";
    teacher: string;
    accessibility: {
      tts: boolean;
      captions: boolean;
      highContrast: boolean;
      simplified: boolean;
    };
    duration?: string;
  };
  onOpen: (lessonId: string) => void;
  onPlayAudio?: (lessonId: string) => void;
  onDownload?: (lessonId: string) => void;
}

export default function LessonCard({ lesson, onOpen, onPlayAudio, onDownload }: LessonCardProps) {
  const prefersReducedMotion = useReducedMotion();

  const typeIcon = lesson.type === "video" ? <Play size={20} /> : <FileText size={20} />;

  return (
    <motion.div
      className="p-4 border border-zinc-200 rounded-lg shadow-sm hover:shadow-lg focus:ring-2 focus:ring-indigo-500 bg-white  cursor-pointer "
      whileHover={{y: -5, boxShadow: "0 8px 15px rgba(0, 0, 0, 0.1)"}}
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      tabIndex={0}
      onClick={() => onOpen(lesson.id)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " " ? onOpen(lesson.id) : null)}
      aria-label={`Open lesson ${lesson.title} by ${lesson.teacher}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-indigo-600">{typeIcon}</div>
        {lesson.duration && (
          <span className="text-xs text-gray-500">{lesson.duration}</span>
        )}
      </div>

      <h3 className="font-semibold text-gray-800  mb-1 line-clamp-2">{lesson.title}</h3>
      <p className="text-sm text-gray-600  mb-2">By {lesson.teacher}</p>

      <div className="flex gap-2 mt-2">
        {lesson.accessibility.tts && (
          <button
            onClick={(e) => { e.stopPropagation(); onPlayAudio?.(lesson.id); }}
            className="flex-1 px-2 py-1 rounded bg-indigo-500 text-white text-sm focus:ring-2 focus:ring-indigo-400"
            aria-label={`Play audio narration for ${lesson.title}`}
          >
            <Headphones size={14} className="inline mr-1" /> Open
          </button>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); onDownload?.(lesson.id); }}
          className="flex-1 px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-indigo-400"
          aria-label={`Download lesson ${lesson.title}`}
        >
          <Download size={14} className="inline mr-1" /> Download
        </button>
      </div>
    </motion.div>
  );
}
