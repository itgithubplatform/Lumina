"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Headphones, Accessibility, Sparkles } from "lucide-react";

import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function page() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setError("");
    try {
      // Simulate sign up process
      setTimeout(() => {
        router.push("/dashboard");
      }, 800);
    } catch (error) {
      setError("Failed to sign up with Google");
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-[#dbeafe] via-white to-[#e0f2fe]">
      {/* Motion blobs for background */}
      <motion.div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-200 opacity-20 sm:opacity-40 blur-3xl"
        animate={{ x: [0, 30, -30, 0], y: [0, 20, -20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-cyan-200 opacity-20 sm:opacity-40 blur-3xl"
        animate={{ x: [0, -20, 20, 0], y: [0, -30, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="relative z-10 bg-transparent sm:bg-white/80 backdrop-blur-md rounded-3xl sm:shadow-xl sm:border border-white/60 p-8 w-full max-w-md text-center"
      >
        {/* Logo */}
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

        {/* Title */}
        <h1 className="mt-4 text-3xl font-bold text-gray-900">Join Lumina+</h1>
        <p className="text-blue-700 italic mt-1 mb-6">"Bridging barriers in education through technology"</p>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Google Sign Up */}
        <motion.button
          onClick={handleGoogleSignUp}
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {isLoading ? (
            <Loader2 className="animate-spin mr-3 h-5 w-5 text-gray-500" />
          ) : (
            <div className="w-6 h-6 mr-3 bg-gradient-to-r from-blue-500 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">G</div>
          )}
          <span className="font-medium text-gray-700">
            {isLoading ? "Creating account..." : "Continue with Google"}
          </span>
        </motion.button>

        {/* Benefits */}
        <div className="mt-8 text-left bg-white/50 sm:bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
            <Sparkles className="w-4 h-4 text-blue-500 mr-2" />
            Your accessible learning journey starts here
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center">
              <BookOpen className="w-4 h-4 text-indigo-500 mr-2" /> 
              Upload notes, docs, PDFs, eBooks, and videos
            </li>
            <li className="flex items-center">
              <Headphones className="w-4 h-4 text-blue-500 mr-2" /> 
              AI-powered speech-to-text and text-to-speech
            </li>
            <li className="flex items-center">
              <Accessibility className="w-4 h-4 text-cyan-600 mr-2" /> 
              Personalized accessibility settings and simplified summaries
            </li>
          </ul>
        </div>

        {/* Sign In Link */}
        <p className="mt-6 text-gray-600 text-sm">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Sign in to your account
          </Link>
        </p>
      </motion.div>
    </main>
  );
}