"use client";

import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Sparkles, Eye, Headphones, Accessibility, Palette, Brain, MousePointer2, Loader2 } from "lucide-react";
import BubbleBlob from "@/components/ui/bubbleBlob";
import Image from "next/image";
import { useSession } from "next-auth/react";

const accessibilityOptions = [
  { id: "dyslexia", label: "Normal Support", icon: Brain },
  { id: "visualImpairment", label: "Visual Impairment", icon: Eye },
  { id: "hearingImpairment", label: "Hearing Impairment", icon: Headphones },
  { id: "cognitiveDisability", label: "Cognitive Support", icon: Accessibility },
];

const checkRole = async(status: string, update: any, session: any, router: any) => {
    if (status === "authenticated") {
        if (session.user.role === "student" && session.user.accessibility && session.user.accessibility.length > 0) {
          await update();   
          router.push("/dashboard");
            return;            
        } 
        if (session.user.role === "teacher") {
          await update();
          router.push("/dashboard");
            return;            
        }
      }
      if (status === "unauthenticated") {
        router.push("/auth/signin");
      }
}

export default function page() {
    const [role, setRole] = useState<"student" | "teacher">("student");
    const [selectedAccess, setSelectedAccess] = useState<string[]>([]);
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const {data: session, status, update} = useSession();

  useEffect(() => {
    checkRole(status, update, session, router);
    console.log(session);
    
  }, [status, session]);

  const handleAccessSelect = (id: string) => {
      if (selectedAccess.includes(id)) {
        setError("");
      setSelectedAccess(selectedAccess.filter((x) => x !== id));
    } else if (selectedAccess.length < 2) {
      setError("");
      setSelectedAccess([...selectedAccess, id]);
    }
  };

  const handleContinue = async() => {
    if(role === "student" && selectedAccess.length === 0){
       setError("Please select at least one accessibility option.");
       return;
    }
     try {
        setLoading(true);
        setError("");
            const res = await fetch("/api/user/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    role,
                    accessibility: selectedAccess})
            });
            if (!res.ok) {
                setError("Failed to update user");
                return;
            }
            await update();
            router.push("/dashboard");
        } catch (err) {
            console.log(err);
        }finally {
            setLoading(false);
        }    
  };
  if(status === "loading"){
    return (
        <main className="min-h-screen flex flex-col justify-center items-center px-4 bg-gradient-to-br from-[#dbeafe] via-white to-[#e0f2fe]">
            <BubbleBlob />
        <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
        </main>
    )
  }
  return (
    <main className="min-h-screen flex flex-col justify-center items-center px-4 bg-gradient-to-br from-[#dbeafe] via-white to-[#e0f2fe]">
        <BubbleBlob />
      {/* Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="relative z-10 sm:bg-white/80 backdrop-blur-lg border sm:border-white/60 sm:shadow-xl rounded-3xl p-8 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-6">
           <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">L+</span>
          </div>
        </motion.div>
          <h1 className=" text-2xl font-bold text-gray-900">Set Up Your Profile</h1>
          <p className="text-gray-600 text-sm mt-1">
            Choose your role and accessibility preferences to personalize your experience.
          </p>
        </div>

        {/* Role Selection */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Select your role</h3>
          <div className="grid grid-cols-2 gap-3">
            {["student", "teacher"].map((r) => (
              <button
                key={r}
                onClick={() => {
                    setError("");
                    setRole(r as "student" | "teacher")}}
                className={`py-3 rounded-xl border text-sm font-medium transition-colors focus:outline-none  ${
                  role === r
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-transparent shadow-md"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                }`}
              >
                {r === "student" ? "🎓 Student" : "👩‍🏫 Teacher"}
              </button>
            ))}
          </div>
        </div>

        {/* Accessibility Options */}
        {
            role === "student" && (<div className="mt-8">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">
            Select accessibility preferences (up to 2)
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {accessibilityOptions.map(({ id, label, icon: Icon }) => {
              const selected = selectedAccess.includes(id);
              return (
                <motion.button
                  key={id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAccessSelect(id)}
                  aria-pressed={selected}
                  className={`flex items-center justify-start px-3 py-3 rounded-xl border transition-all focus:outline-none  ${
                    selected
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-transparent shadow-md"
                      : "bg-white border-gray-300 text-gray-700 hover:border-blue-400"
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-2 ${selected ? "text-white" : "text-blue-500"}`} />
                  <span className="text-sm">{label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>)
        }
        {/* Error Message */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-sm text-red-600 text-center"
            role="alert"
          >
            {error}
          </motion.p>
        )}
        {/* Continue Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleContinue}
          disabled={!role}
          className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center"
        >
          {loading ? (
            <Loader2 className="animate-spin mr-3 h-5 w-5 text-gray-100 " />):"Continue"}
        </motion.button>
      </motion.div>
    </main>
  );
}