"use client";
import LessonCard from "./lessons";

interface ClassCardProps {
  classData: {
    id: string;
    name: string;
    teacher: string;
    lessons: any[];
  };
  onOpenLesson: (lessonId: string) => void;
  onPlayAudio?: (lessonId: string) => void;
  onDownload?: (lessonId: string) => void;
}

export default function ClassCard({ classData, onOpenLesson, onPlayAudio, onDownload }: ClassCardProps) {
  return (
    <section className="mb-6">
      <h2 className="text-xl font-bold mb-2 text-gray-800 ">{classData.name}</h2>
      <p className="text-sm text-gray-600  mb-4">Teacher: {classData.teacher}</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classData.lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            onOpen={onOpenLesson}
            onPlayAudio={onPlayAudio}
            onDownload={onDownload}
          />
        ))}
      </div>
    </section>
  );
}
