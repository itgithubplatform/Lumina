"use client";

import React, { useState } from "react";
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
  Star
} from "lucide-react";
import { useSession } from "next-auth/react";
import FileUpload from "./fileUpload";

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

/**
 * Get the current slot (0–11) based on the hour.
 */
function getTimeSlot(date = new Date()) {
  const hour = date.getHours();
  return Math.floor(hour / 2); // 12 slots (each 2 hours)
}

/**
 * Returns a random greeting heading based on current time slot.
 */
export function getGreetingHeading(date = new Date()) {
  const slot = getTimeSlot(date);
  const options = greetingHeadings[slot] || ["Hello"];
  const index = Math.floor(Math.random() * options.length);
  return options[index];
}

/**
 * Returns a random sub-greeting based on current time slot.
 */
export function getGreetingSubHeading(date = new Date()) {
  const slot = getTimeSlot(date);
  const options = greetingSubHeadings[slot] || ["Have a great day!"];
  const index = Math.floor(Math.random() * options.length);
  return options[index];
}


// Mock data
const mockData = {
  enrolledClassrooms: [
    {
      id: "1",
      name: "Database Management Systems",
      teacher: "Dr. Sharma",
      subject: "Computer Science",
      students: 45,
      recentFiles: 3,
      progress: 75,
      nextDeadline: "2024-12-15",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "2",
      name: "Artificial Intelligence",
      teacher: "Prof. Gupta",
      subject: "AI & ML",
      students: 38,
      recentFiles: 5,
      progress: 60,
      nextDeadline: "2024-12-20",
      color: "from-purple-500 to-pink-500"
    },
    {
      id: "3",
      name: "Data Structures",
      teacher: "Dr. Verma",
      subject: "Computer Science",
      students: 52,
      recentFiles: 2,
      progress: 90,
      nextDeadline: "2024-12-10",
      color: "from-green-500 to-emerald-500"
    }
  ],
  recentFiles: [
    {
      id: "1",
      name: "DBMS Chapter 5 - Normalization",
      type: "video",
      classroom: "Database Management Systems",
      uploadedAt: "2 hours ago",
      duration: "15:30",
      isNew: true
    },
    {
      id: "2",
      name: "AI Assignment 3 Solutions",
      type: "document",
      classroom: "Artificial Intelligence",
      uploadedAt: "1 day ago",
      pages: 12,
      isNew: true
    },
    {
      id: "3",
      name: "DS Lab Manual Week 8",
      type: "document",
      classroom: "Data Structures",
      uploadedAt: "2 days ago",
      pages: 8,
      isNew: false
    }
  ],
  recentOpenedFiles: [
    {
      id: "1",
      name: "DBMS Lecture Notes Chapter 4",
      type: "document",
      classroom: "Database Management Systems",
      lastOpened: "30 minutes ago",
      progress: 80
    },
    {
      id: "2",
      name: "AI Project Guidelines",
      type: "document", 
      classroom: "Artificial Intelligence",
      lastOpened: "2 hours ago",
      progress: 45
    },
    {
      id: "3",
      name: "DS Video Tutorial - Trees",
      type: "video",
      classroom: "Data Structures", 
      lastOpened: "5 hours ago",
      progress: 60
    }
  ]
};

export default function StudentDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session } = useSession();

  const filteredClassrooms = mockData.enrolledClassrooms.filter(classroom =>
    classroom.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    classroom.teacher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
     
      {/* Greeting Section */}
      <motion.section
      initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className=" pt-24 ">
        
 {/* Background decorative elements */}
      <div className="relative">
        {/* Floating elements */}
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-4 left-4 hidden lg:block"
        >
          <div className="bg-yellow-100 rounded-full p-3 shadow-lg">
            <Star className="text-yellow-500" size={20} />
          </div>
        </motion.div>
        
        <motion.div
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute -top-2 right-4 hidden lg:block"
        >
          <div className="bg-blue-100 rounded-full p-3 shadow-lg">
            <Users className="text-blue-500" size={20} />
          </div>
        </motion.div>

        <motion.div
          animate={{ 
            y: [0, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
          className="absolute bottom-4 left-1/4 hidden lg:block"
        >
          <div className="bg-purple-100 rounded-full p-3 shadow-lg">
            <BookOpen className="text-purple-500" size={20} />
          </div>
        </motion.div>

        {/* Main card */}
        <div className="rounded-3xl bg-transparent">
          {/* Animated gradient overlay */}
          <motion.div 
            className="absolute bg-transparent inset-0 opacity-10"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4  gap-3">
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

      {/* File Uploader Placeholder */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     <FileUpload />

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - My Classes */}
          <div className="lg:col-span-2">
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
                    {mockData.enrolledClassrooms.length} enrolled
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {filteredClassrooms.map((classroom, index) => (
                    <motion.div
                      key={classroom.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                      className="group cursor-pointer"
                    >
                      <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 border border-gray-200/60 hover:border-blue-300 transition-all duration-300 hover:shadow-md">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`p-2 rounded-lg bg-gradient-to-r ${classroom.color}`}>
                                <BookOpen className="text-white" size={20} />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                                  {classroom.name}
                                </h3>
                                <p className="text-sm text-gray-600">by {classroom.teacher}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                              <span className="flex items-center gap-1">
                                <Users size={14} />
                                {classroom.students} students
                              </span>
                              <span className="flex items-center gap-1">
                                <FileText size={14} />
                                {classroom.recentFiles} new files
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                Due {classroom.nextDeadline}
                              </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Course Progress</span>
                                <span className="font-semibold text-gray-800">{classroom.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${classroom.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>

                          <ChevronRight className="text-gray-400 group-hover:text-blue-500 transition-colors transform group-hover:translate-x-1" size={20} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
          </div>

          {/* Right Column - Recent Files & Recently Opened */}
          <div className="space-y-8">
            {/* Recent Files */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden"
            >
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 text-white">
                <div className="flex items-center gap-3">
                  <FileText size={20} />
                  <h2 className="text-lg font-semibold">Recent Files</h2>
                </div>
              </div>

              <div className="p-4">
                <div className="space-y-3">
                  {mockData.recentFiles.map((file, index) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="group cursor-pointer"
                    >
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200/60 hover:border-green-300 transition-all duration-300">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            file.type === 'video' 
                              ? 'bg-red-100 text-red-600' 
                              : 'bg-blue-100 text-blue-600'
                          }`}>
                            {file.type === 'video' ? <Video size={16} /> : <FileText size={16} />}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-800 text-sm group-hover:text-green-600 transition-colors truncate">
                              {file.name}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                              <span>{file.classroom}</span>
                              <span>•</span>
                              <span>{file.uploadedAt}</span>
                            </div>
                          </div>

                          <div className="flex gap-1">
                            <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                              <Eye size={14} />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors">
                              <Download size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Recently Opened Files */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden"
            >
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white">
                <div className="flex items-center gap-3">
                  <Clock size={20} />
                  <h2 className="text-lg font-semibold">Recently Opened</h2>
                </div>
              </div>

              <div className="p-4">
                <div className="space-y-3">
                  {mockData.recentOpenedFiles.map((file, index) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="group cursor-pointer"
                    >
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200/60 hover:border-orange-300 transition-all duration-300">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            file.type === 'video' 
                              ? 'bg-red-100 text-red-600' 
                              : 'bg-blue-100 text-blue-600'
                          }`}>
                            {file.type === 'video' ? <Play size={16} /> : <FileText size={16} />}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-800 text-sm group-hover:text-orange-600 transition-colors truncate">
                              {file.name}
                            </h3>
                            <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                              <span>{file.classroom}</span>
                              <span>{file.lastOpened}</span>
                            </div>
                            {/* Progress for videos/documents */}
                            <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                              <div 
                                className="bg-gradient-to-r from-orange-400 to-red-500 h-1 rounded-full"
                                style={{ width: `${file.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
}