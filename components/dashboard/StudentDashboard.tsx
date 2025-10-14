"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Users, 
  Calendar, 
  Bell, 
  Search, 
  FileText,
  Video,
  ChevronRight,
  Upload,
  Clock,
  Eye,
  Download,
  Play,
  Sparkles,
  Star,
  FolderOpen,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";
import { useSession } from "next-auth/react";
import StudentFileUploader from "./studentFileUpload";
import Link from "next/link";
import Loader from "../ui/loader";

interface Classroom {
  id: string;
  name: string;
  subject: string;
  createdAt: Date;
  updatedAt: Date;
  teacherId: string;
  teacher: {
    id: string;
    name: string | null;
    email: string;
    image?: string | null;
  };
  files: File[];
  students: Student[];
  _count?: {
    students: number;
    files: number;
  };
}

interface File {
  id: string;
  name: string;
  link: string;
  createdAt: Date;
  updatedAt: Date;
  classId: string;
  audioLink?: string | null;
  status: 'processing' | 'completed' | 'failed';
  extractedText?: string | null;
  blindFriendlyLink?: string | null;
  transcript?: any;
  dislexiaFriendly?: any;
  class?: {
    name: string;
  };
}

interface StudentFile {
  id: string;
  name: string;
  link: string;
  createdAt: Date;
  updatedAt: Date;
  audioLink?: string | null;
  status: 'processing' | 'completed' | 'failed';
  extractedText?: string | null;
  blindFriendlyLink?: string | null;
  transcript?: Transcript | null;
  dislexiaFriendly?: DyslexiaFriendly | null;
  studentId: string;
  Student: {
    id: string;
    name: string | null;
    email: string;
    image?: string | null;
  };
}

interface Transcript {
  transcription: string;
  words: {
    word: string | null | undefined;
    startTime: number;
    endTime: number;
  }[];
  detectedLanguage: string;
}

interface DyslexiaFriendly {
  scenes: {
    description: string;
    title: string;
    image: string;
  }[];
  keyIdea: string;
}

interface Student {
  id: string;
  name: string | null;
  email: string;
  image?: string | null;
  role: 'student' | 'teacher';
}

// Greeting functions (same as before)
const greetingHeadings : Record<number, string[]> = {
  0: ["Midnight vibes", "Burning the midnight oil", "Hello night owl"],
  1: ["Early bird energy", "Good morning", "Bright start"],
  2: ["Morning freshness", "Rise and shine", "New beginnings"],
  3: ["Late morning groove", "Good day ahead", "Keep moving"],
  4: ["Afternoon hustle", "Good afternoon", "Stay sharp"],
  5: ["Mid-afternoon flow", "Power hours", "Steady and strong"],
  6: ["Evening mode", "Good evening", "Relax and unwind"],
  7: ["Golden hour", "Sunset vibes", "Evening glow"],
  8: ["The night is young", "Evening calm", "Chill vibes"],
  9: ["Late night zone", "Quiet hours", "Soft night"],
  10: ["Almost midnight", "Final stretch", "Winding down"],
  11: ["Deep night", "Silent hours", "Peaceful time"],
};

const greetingSubHeadings : Record<number, string[]> = {
  0: ["Perfect time to create magic ✨", "The world sleeps, you shine.", "Still going strong!"],
  1: ["A fresh day awaits!", "Let’s make today awesome!", "Good vibes only."],
  2: ["Grab that coffee ☕", "Start strong, finish stronger.", "New energy incoming."],
  3: ["The day’s just getting better.", "Keep the pace steady.", "You got this."],
  4: ["Stay focused, stay winning.", "Midday momentum is yours.", "Keep up the grind."],
  5: ["Smooth sailing ahead.", "Energy at its peak ⚡", "You’re doing great."],
  6: ["Time to ease the day.", "Let the calm in.", "Relax — you’ve earned it."],
  7: ["Enjoy the sunset glow 🌇", "Breathe in the moment.", "Evening chill vibes."],
  8: ["Unwind and recharge.", "Cozy time starts now.", "The night is yours."],
  9: ["Peaceful hours ahead.", "Slow down, you did well.", "Let serenity in."],
  10: ["Reflect, reset, and rest.", "Another day wrapped up.", "Good night energy."],
  11: ["Quiet moments matter.", "Drift into peace 🌙", "Sleep well, dream big."],
};

function getTimeSlot(date = new Date()) {
  const hour = date.getHours();
  return Math.floor(hour / 2);
}

export function getGreetingHeading(date = new Date()) {
  const slot = getTimeSlot(date);
  const options = greetingHeadings[slot] || ["Hello"];
  const index = Math.floor(Math.random() * options.length);
  return options[index];
}

export function getGreetingSubHeading(date = new Date()) {
  const slot = getTimeSlot(date);
  const options = greetingSubHeadings[slot] || ["Have a great day!"];
  const index = Math.floor(Math.random() * options.length);
  return options[index];
}

export default function StudentDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [files, setFiles] = useState<StudentFile[]>([]);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Set<string>>(new Set());
  const userId = session?.user?.id;
  const [textToSummarize, setTextToSummarize] = useState("");
const [summary, setSummary] = useState("");
const [isSummarizing, setIsSummarizing] = useState(false);
const [summaryError, setSummaryError] = useState("");

// Add this function to handle the summarization
const handleSummarize = async () => {
  if (!textToSummarize.trim()) return;

  setIsSummarizing(true);
  setSummaryError("");
  setSummary("");

  try {
    const response = await fetch("/api/summerize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: textToSummarize }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate summary");
    }

    const data = await response.json();
    setSummary(data.text || "No summary generated.");
  } catch (error) {
    console.error("Summarization error:", error);
    setSummaryError("Failed to generate summary. Please try again.");
  } finally {
    setIsSummarizing(false);
  }
};

  const getStudentData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/student-data');
      if (!response.ok) {
        throw new Error('Failed to fetch student data');
      }
      const data = await response.json();
      setClassrooms(data.classrooms || []);
      setFiles(data.files || []);
    } catch (error) {
      console.error("Error fetching student data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStudentData();
  }, []);
  React.useEffect(() => {
      const interval = setInterval(async () => {
  
        const processingFiles = files.filter(f => f.status === "processing");
        if (processingFiles.length === 0) return;
  
        for (const file of processingFiles) {
          try {
            const res = await fetch(`/api/files/student/upload?fileId=${file.id}`);
            if (!res.ok) continue;
  
            const data = await res.json();
            if (data.status !== file.status) {
              setFiles(prev => ({
                ...prev,
                files: prev.map(f =>
                  f.id === file.id ? { ...f, status: data.status } : f
                )
              }));
            }
          } catch (err) {
            console.error("Error polling file status:", err);
          }
        }
      }, 3000);
  
      return () => clearInterval(interval);
    }, [files]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      {/* Greeting Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-24"
      >
        {/* Background decorative elements */}
        <div className="relative">
          {/* Floating elements */}
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-4 left-4 hidden lg:block"
          >
            <div className="bg-yellow-100 rounded-full p-3 shadow-lg">
              <Star className="text-yellow-500" size={20} />
            </div>
          </motion.div>
          
          <motion.div
            animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -top-2 right-4 hidden lg:block"
          >
            <div className="bg-blue-100 rounded-full p-3 shadow-lg">
              <Users className="text-blue-500" size={20} />
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-0 left-1/4 hidden lg:block"
          >
            <div className="bg-purple-100 rounded-full p-3 shadow-lg">
              <BookOpen className="text-purple-500" size={20} />
            </div>
          </motion.div>

          <div className="rounded-3xl bg-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 gap-3">
              <div className="flex justify-center items-center flex-col">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                  {getGreetingHeading()}, {session?.user?.name?.split(" ")[0]}!
                </h1>
                <p className="text-md md:text-lg text-gray-600 mt-1">
                  {getGreetingSubHeading()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">My Study Tools</h2>
        </div>
      {/* File Uploader & Text Summarizer */}
<div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 lg:px-8 ">
    <StudentFileUploader setFiles={setFiles} userId={userId} />
  
  {/* Summarize Text Section */}
  
</div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - My Classes */}
          <div className="lg:col-span-2 ">
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BookOpen size={24} />
                    <h2 className="text-xl font-semibold">My Classes</h2>
                  </div>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    {classrooms.length} enrolled
                  </span>
                </div>
              </div>

              <div className="p-4 h-[19rem] overflow-auto">
                {classrooms.length > 0 ? (
                  <div className="space-y-4">
                    {classrooms.map((classroom, index) => (
                      <motion.div
                        key={classroom.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        whileHover={{ scale: 1.01 }}
                        className="group cursor-pointer"
                      >
                        <Link href={`/classroom/${classroom.id}`} className="block">
                          <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 border border-gray-200/60 hover:border-blue-300 transition-all duration-300 hover:shadow-md">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                                    <BookOpen className="text-white" size={20} />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                                      {classroom.name}
                                    </h3>
                                    <p className="text-sm text-gray-600">by {classroom.teacher.name}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                  <span className="flex items-center gap-1">
                                    <Users size={14} />
                                    {classroom.students?.length || 0} students
                                  </span>
                          
                                </div>
                              </div>
                              <ChevronRight className="text-gray-400 group-hover:text-blue-500 transition-colors transform group-hover:translate-x-1" size={20} />
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FolderOpen className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Classes Yet</h3>
                    <p className="text-gray-500">You haven't joined any classes yet.</p>
                  </div>
                )}
              </div>
            </motion.section>
          </div>

          {/* Right Column - My Files & Recently Opened */}
          <div className="space-y-8 ">
            {/* My Files */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden "
            >
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 text-white">
                <div className="flex items-center gap-3">
                  <FileText size={20} />
                  <h2 className="text-lg font-semibold">My Files</h2>
                </div>
              </div>

              <div className="p-4 h-80 overflow-auto">
                {files.length > 0 ? (
                  <div className="space-y-3">
                    {files.map((file, index) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="group"
                      >
                        {file.status === 'completed' ? (
                          <Link href={`/file/${file.id}`} className="block">
                            <FileCard file={file} />
                          </Link>
                        ) : (
                          <FileCard file={file} />
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="mx-auto text-gray-400 mb-3" size={32} />
                    <p className="text-gray-500 text-sm">No files uploaded yet</p>
                  </div>
                )}
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
}

// File Card Component
function FileCard({ file }: { file: StudentFile }) {
  const isVideo = ["mp4", "mov", "avi", "mkv", "webm", "flv", "wmv", "m4v", "mpg", "mpeg", "3gp", "ts", "vob", "ogv"]
    .includes(file.link.split('.').pop()?.toLowerCase() || '');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'processing':
        return 'Processing...';
      case 'completed':
        return 'Ready';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200/60 hover:border-green-300 transition-all duration-300">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${
          isVideo ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
        }`}>
          {isVideo ? <Video size={16} /> : <FileText size={16} />}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-gray-800 text-sm truncate">
              {file.name}
            </h3>
            {getStatusIcon(file.status)}
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className={`px-2 py-1 rounded-full ${
              file.status === 'processing' ? 'bg-blue-100 text-blue-700' :
              file.status === 'completed' ? 'bg-green-100 text-green-700' :
              'bg-red-100 text-red-700'
            }`}>
              {getStatusText(file.status)}
            </span>
            <span>{new Date(file.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex gap-1">
          {file.status === 'completed' && (
            <>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(file.link, '_blank');
                }}
                className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="View File"
              >
                <Eye size={14} />
              </button>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const link = document.createElement('a');
                  link.href = file.link;
                  link.download = file.name;
                  link.click();
                }}
                className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                title="Download File"
              >
                <Download size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}