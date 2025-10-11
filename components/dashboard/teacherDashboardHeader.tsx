"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Sparkles, Users, BookOpen, Star } from "lucide-react";
import { useSession } from "next-auth/react";

export default function TeacherDashboardHeader() {
    const {data:session,status} = useSession()
  const teacherName = session?.user?.name?.split(" ")[0] || "Educator";

  const greetings = {
    dawn: ["Good morning sunshine", "A fresh day to inspire", "Rise and shine", "Let's make magic today"],
    morning: ["Good morning", "A perfect time to teach", "Hope your morning is inspiring", "New ideas await"],
    noon: ["Good afternoon", "Keep shining through the day", "Time to make learning fun", "Your students await"],
    evening: ["Good evening", "Let's wrap up strong", "Inspiring minds one lesson at a time", "A calm evening to teach"],
    night: ["Good night teacher", "Your impact lasts beyond today", "Great teachers inspire even at night", "Rest well legend"],
    lateNight: ["Burning the midnight oil?", "Late night inspiration mode", "Still planning lessons?", "Legends don't sleep early"],
  };

  const [greetingText, setGreetingText] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    const slot =
      hour >= 4 && hour < 8
        ? "dawn"
        : hour >= 8 && hour < 12
        ? "morning"
        : hour >= 12 && hour < 16
        ? "noon"
        : hour >= 16 && hour < 20
        ? "evening"
        : hour >= 20 && hour < 24
        ? "night"
        : "lateNight";

    const arr = greetings[slot as keyof typeof greetings];
    const randomGreeting = arr[Math.floor(Math.random() * arr.length)];
    setGreetingText(randomGreeting);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto mb-12 px-4 sm:px-6"
    >
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
          className="absolute -top-4 -left-4 hidden lg:block"
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
          className="absolute -top-2 -right-4 hidden lg:block"
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
          className="absolute -bottom-4 left-1/4 hidden lg:block"
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
          
          <div className="rounded-3xl sm:p-10 relative z-10">
            {/* Greeting */}
            <motion.div
              className="text-lg sm:text-xl text-gray-800 flex items-center justify-center gap-2 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {greetingText && (
                <span className="text-center text-2xl md:text-4xl font-bold">
                  {greetingText}, <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{teacherName}</span> 👋
                </span>
              )}
            </motion.div>

            {/* Title */}
            

            {/* Subtext */}
            <motion.p
              className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-6 text-center leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Empowering you to build <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">inclusive classrooms</span> for every learner.
            </motion.p>

            {/* Quote */}
            
          </div>
        </div>
      </div>
    </motion.div>
  );
}