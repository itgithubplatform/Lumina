'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FileText, Volume2, Eye, Headphones, Brain, Sparkles, BookOpen, ArrowLeft } from 'lucide-react';
import Loader from '@/components/ui/loader';

export default function FilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/signin');
    } else if (status === 'authenticated') {
      if (session?.user?.role === 'student') {
        fetchFile();
      } else {
        router.replace('/dashboard');
      }
    }
  }, [status, session]);

  const fetchFile = async () => {
    try {
      const res = await fetch(`/api/student/files/${params.id}`);
      const data = await res.json();
      if (res.ok) setFile(data.file);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getAccessibilityFeatures = () => {
    const accessibility = session?.user?.accessibility?.[0];
    switch (accessibility) {
      case 'visualImpairment':
        return {
          icon: Eye,
          color: 'from-blue-500 to-cyan-500',
          features: ['Text-to-Speech', 'High Contrast', 'Screen Reader Optimized'],
          title: 'Visual Support Mode'
        };
      case 'hearingImpairment':
        return {
          icon: Headphones,
          color: 'from-purple-500 to-pink-500',
          features: ['Full Captions', 'Visual Summaries', 'Text Transcripts'],
          title: 'Hearing Support Mode'
        };
      case 'cognitiveDisability':
        return {
          icon: Brain,
          color: 'from-emerald-500 to-teal-500',
          features: ['Simplified Text', 'Step-by-Step Guide', 'Visual Aids'],
          title: 'Cognitive Support Mode'
        };
      default:
        return {
          icon: Sparkles,
          color: 'from-emerald-500 to-teal-500',
          features: ['Interactive Content', 'Rich Media', 'Full Access'],
          title: 'Standard Mode'
        };
    }
  };

  const handleTextToSpeech = () => {
    if ('speechSynthesis' in window && file?.extractedText) {
      if (speaking) {
        window.speechSynthesis.cancel();
        setSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(file.extractedText);
        utterance.onend = () => setSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setSpeaking(true);
      }
    }
  };

  if (status === 'loading' || loading) return <Loader />;
  if (status === 'unauthenticated') return null;
  if (!file) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">File not found</h2>
        <button onClick={() => router.back()} className="text-emerald-600 hover:underline">Go back</button>
      </div>
    </div>
  );

  const accessibilityConfig = getAccessibilityFeatures();
  const Icon = accessibilityConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 pt-24 pb-12 px-4 relative overflow-hidden">
      <motion.div
        className="absolute top-20 right-20 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl"
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.button
          onClick={() => router.back()}
          whileHover={{ x: -5 }}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to My Files
        </motion.button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-4 mb-8">
            <div className={`w-16 h-16 bg-gradient-to-br ${accessibilityConfig.color} rounded-3xl flex items-center justify-center text-white shadow-xl`}>
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{file.name}</h1>
              <p className="text-gray-600">{accessibilityConfig.title}</p>
            </div>
          </div>
        </motion.div>

        {/* Accessibility Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-emerald-100 mb-6"
        >
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            Active Adaptations
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {accessibilityConfig.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                {feature}
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-emerald-100 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <BookOpen className="w-7 h-7 text-emerald-500" />
              AI-Generated Summary
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTextToSpeech}
              className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${
                speaking
                  ? 'bg-red-500 text-white'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
              }`}
            >
              <Volume2 className="w-5 h-5" />
              {speaking ? 'Stop' : 'Listen'}
            </motion.button>
          </div>
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed">{file.extractedText}</p>
          </div>
        </motion.div>

        {/* Key Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl p-8 shadow-xl text-white"
        >
          <h3 className="text-2xl font-bold mb-4">Key Learning Points</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">1</div>
              <span>Content adapted specifically for your learning needs</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">2</div>
              <span>AI-powered summarization highlights main concepts</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">3</div>
              <span>Multiple formats available for comprehensive understanding</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
