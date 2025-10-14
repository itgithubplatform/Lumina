'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FileText, Video, Headphones, Eye, Brain, Play, Clock, Sparkles, BookOpen, Zap } from 'lucide-react';
import Loader from '@/components/ui/loader';

interface File {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'audio' | 'doc';
  uploadDate: string;
  status: 'completed' | 'processing';
}

export default function MyFilesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/signin');
    } else if (status === 'authenticated') {
      if (session?.user?.role === 'student') {
        fetchFiles();
      } else {
        router.replace('/dashboard');
      }
    }
  }, [status, session]);

  const fetchFiles = async () => {
    try {
      const res = await fetch('/api/student/files');
      const data = await res.json();
      if (res.ok) setFiles(data.files || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getAccessibilityConfig = () => {
    const accessibility = session?.user?.accessibility?.[0];
    switch (accessibility) {
      case 'visualImpairment': 
        return { icon: <Eye className="w-6 h-6" />, color: 'from-blue-500 to-cyan-500', label: 'Visual Support' };
      case 'hearingImpairment': 
        return { icon: <Headphones className="w-6 h-6" />, color: 'from-purple-500 to-pink-500', label: 'Hearing Support' };
      case 'cognitiveDisability': 
        return { icon: <Brain className="w-6 h-6" />, color: 'from-emerald-500 to-teal-500', label: 'Cognitive Support' };
      default: 
        return { icon: <Sparkles className="w-6 h-6" />, color: 'from-emerald-500 to-teal-500', label: 'Learning Hub' };
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-10 h-10 text-purple-500" />;
      case 'audio': return <Headphones className="w-10 h-10 text-cyan-500" />;
      default: return <FileText className="w-10 h-10 text-emerald-500" />;
    }
  };

  const accessibilityConfig = getAccessibilityConfig();

  if (status === 'loading' || loading) return <Loader />;
  if (status === 'unauthenticated') return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 pt-24 pb-12 px-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <motion.div
        className="absolute top-20 right-20 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl"
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-80 h-80 bg-teal-200/30 rounded-full blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, 50, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-6 mb-6">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              className={`w-20 h-20 bg-gradient-to-br ${accessibilityConfig.color} rounded-3xl flex items-center justify-center text-white shadow-xl`}
            >
              {accessibilityConfig.icon}
            </motion.div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">My Files</h1>
                <Sparkles className="w-8 h-8 text-emerald-500" />
              </div>
              <p className="text-gray-600 text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                {accessibilityConfig.label} • Personalized for you
              </p>
            </div>
          </div>
        </motion.div>

        {files.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl border border-emerald-100 shadow-lg"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <BookOpen className="w-24 h-24 text-emerald-300 mx-auto mb-6" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No files yet</h3>
            <p className="text-gray-600 text-lg">Your teacher will upload materials soon</p>
            <div className="mt-6 flex items-center justify-center gap-2 text-emerald-600">
              <Zap className="w-5 h-5" />
              <span className="font-medium">Stay tuned for exciting lessons!</span>
            </div>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {files.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, type: "spring" }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => router.push(`/file/${file.id}`)}
                className="group bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all cursor-pointer border border-emerald-100 relative overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-5">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl"
                    >
                      {getFileIcon(file.type)}
                    </motion.div>
                    {file.status === 'processing' && (
                      <motion.span 
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="px-3 py-1 bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 text-xs font-semibold rounded-full border border-yellow-200"
                      >
                        Processing
                      </motion.span>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg line-clamp-2 group-hover:text-emerald-600 transition-colors">{file.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 gap-2 mb-4">
                    <Clock className="w-4 h-4" />
                    <span>{file.uploadDate}</span>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Play className="w-5 h-5" />
                    Open Lesson
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
