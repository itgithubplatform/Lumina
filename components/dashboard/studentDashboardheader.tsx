"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

interface HeaderProps {
  userName: string;
}

const motivationalGreetings = [
  "You are stronger than you think",
  "Every effort matters",
  "Your persistence is power",
  "Today is full of new chances",
  "Believe in your pace",
  "Keep learning, keep growing",
  "You inspire others just by trying",
  "Progress, not perfection",
  "You make a difference every day",
  "The world needs your light",
];

const getTimeBasedSubtext = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning! Let’s start with purpose ☀️";
  if (hour < 18) return "Good afternoon! You’re doing amazing ⚡";
  return "Good evening! You’ve done enough — rest well 🌙";
};

export default function StudentDashboardHeader({ userName }: HeaderProps) {
  const [greeting, setGreeting] = useState("");
  const [subtext, setSubtext] = useState(getTimeBasedSubtext());
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const randomGreeting =
      motivationalGreetings[
        Math.floor(Math.random() * motivationalGreetings.length)
      ];
    setGreeting(`${randomGreeting}, ${userName}.`);

    const interval = setInterval(() => {
      setSubtext(getTimeBasedSubtext());
    }, 5 * 60 * 1000); 
    return () => clearInterval(interval);
  }, [userName]);

  useEffect(() => {
    const synth = window.speechSynthesis;
    if (synth && greeting) {
      const utter = new SpeechSynthesisUtterance(greeting);
      utter.rate = 0.9;
      utter.pitch = 1;
      synth.cancel();
      synth.speak(utter);
    }
  }, [greeting]);

  return (
    <motion.header
      className="flex flex-col items-start justify-center py-6 px-4 sm:px-8 "
      initial={prefersReducedMotion ? {} : { opacity: 0, y: -20 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      aria-live="polite"
      aria-atomic="true"
    >
      <motion.h1
        className="text-2xl sm:text-3xl font-bold text-zinc-900 leading-snug"
        key={greeting}
        initial={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
        animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {greeting}
      </motion.h1>

      <motion.p
        className="text-gray-700 dark:text-gray-700 mt-2 text-base sm:text-xl"
        key={subtext}
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={prefersReducedMotion ? {} : { opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {subtext}
      </motion.p>
    </motion.header>
  );
}
