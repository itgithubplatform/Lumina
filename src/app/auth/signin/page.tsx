"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "nextjs-toploader/app";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

export default function page() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    try {
      await signIn("google", { callbackUrl: "/select-role" });
    } catch (error) {
      setError("Failed to sign in with Google");
      setIsLoading(false);
    }
  };

  if (status === "authenticated") {
    router.push("/dashboard");
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-[#dbeafe] via-white to-[#e0f2fe]">
      {/* Animated gradient blobs */}
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

      {/* Card container */}
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
          <Image
            src="/logo.png"
            alt="Lumina+ Logo"
            width={90}
            height={90}
            className="rounded-md"
            priority
          />
        </motion.div>

        {/* Branding */}
        <h1 className="mt-4 text-4xl font-extrabold text-gray-900 tracking-tight">
          Lumina+
        </h1>
        <p className="text-blue-700 italic mt-1">
          "Lighting the way for every learner"
        </p>

        {/* Tagline */}
        <p className="text-gray-700 mt-4 mb-8 leading-relaxed text-sm">
           Transform any lesson into accessible formats with AI narration, captions, and personalized learning tools.
        </p>

        {/* Sign In */}
        <motion.button
          onClick={handleGoogleSignIn}
          aria-label="Sign in with Google"
          disabled={isLoading}
           whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center w-full border border-gray-300 rounded-lg py-3 px-4 text-gray-700 font-medium bg-white hover:bg-gray-100 transition disabled:opacity-70 shadow-sm disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="animate-spin mr-3 h-5 w-5 text-gray-500" />
          ) : (
            <FcGoogle className="mr-2 w-6 h-6" />
          )}
          {isLoading ? "Signing in..." : "Continue with Google"}
        </motion.button>

        {error && (
          <p className="mt-3 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}

        {/* Sign Up Link */}
        <p className="mt-6 text-gray-600 text-sm">
          Don't have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Create your account
          </Link>
        </p>
        </motion.div>
    </main>
  );
}