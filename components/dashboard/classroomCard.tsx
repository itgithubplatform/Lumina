"use client";

import { motion } from "framer-motion";
import { BookOpen, Users } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useEffect } from "react";

interface ClassroomCardProps {
  classroom: {
    id: string;
    name: string;
    subject: string;
    _count: { students: number }
  };
  index: number;
  speak: (text: string) => void;
  announceNavigation: (text: string) => void;
}

export default function ClassroomCard({
  classroom,
  index,
  speak,
  announceNavigation,
}: ClassroomCardProps) {
  const router = useRouter();
    const onSelect = (id: string) => {
        router.push(`/classroom/${id}`);
    }
    console.log(classroom);
      
  return (
    <motion.div
      key={classroom.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg p-6 border cursor-pointer hover:shadow-xl transition-all duration-300"
      onClick={() => {
        onSelect(classroom.id);
        speak(`Opened ${classroom.name} classroom`);
        announceNavigation(`${classroom.name} classroom content management`);
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg p-3">
          <BookOpen size={24} className="text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">{classroom.name}</h3>
          <p className="text-gray-600">{classroom.subject || "No subject"}</p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Users size={16} />
          <span>{classroom?._count?.students} students</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-xs text-green-600">AI Ready</span>
        </div>
      </div>
    </motion.div>
  );
}
