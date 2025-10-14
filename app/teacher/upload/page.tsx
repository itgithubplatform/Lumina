'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Upload, FileText, Video, Loader2, Sparkles, CheckCircle, Eye, Headphones, Brain, Users } from 'lucide-react';
import Loader from '@/components/ui/loader';

export default function TeacherUploadPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/signin');
    } else if (status === 'authenticated' && session?.user?.role !== 'teacher') {
      router.replace('/dashboard');
    }
  }, [status, session]);

  if (status === 'loading') return <Loader />;
  if (status === 'unauthenticated' || session?.user?.role !== 'teacher') return null;
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [summary, setSummary] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [disabilityTypes, setDisabilityTypes] = useState<string[]>([]);

  const disabilities = [
    { id: 'visualImpairment', label: 'Visual Impairment', icon: Eye, color: 'from-blue-500 to-cyan-500' },
    { id: 'hearingImpairment', label: 'Hearing Impairment', icon: Headphones, color: 'from-purple-500 to-pink-500' },
    { id: 'cognitiveDisability', label: 'Cognitive Support', icon: Brain, color: 'from-emerald-500 to-teal-500' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProcessing(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('disabilityTypes', JSON.stringify(disabilityTypes));
    formData.append('students', JSON.stringify(selectedStudents));

    try {
      const res = await fetch('/api/teacher/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      if (res.ok) {
        setSummary(data.summary);
        setTimeout(() => {
          setProcessing(false);
          router.replace('/dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const toggleDisability = (id: string) => {
    setDisabilityTypes(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 pt-24 pb-12 px-4 relative overflow-hidden">
      <motion.div
        className="absolute top-20 right-20 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl"
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center text-white shadow-xl">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Upload Lesson</h1>
              <p className="text-gray-600">AI will adapt for all students automatically</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-emerald-100"
        >
          {/* File Upload */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Upload File</label>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.mp4,.mov,.avi"
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center gap-3 p-8 border-2 border-dashed border-emerald-300 rounded-2xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-all"
              >
                {file ? (
                  <>
                    <FileText className="w-8 h-8 text-emerald-500" />
                    <span className="font-medium text-gray-700">{file.name}</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-gray-500">Click to upload or drag and drop</span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Disability Types */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Target Accessibility Groups</label>
            <div className="grid grid-cols-3 gap-4">
              {disabilities.map((disability) => (
                <motion.button
                  key={disability.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleDisability(disability.id)}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    disabilityTypes.includes(disability.id)
                      ? `bg-gradient-to-br ${disability.color} text-white border-transparent shadow-lg`
                      : 'bg-white border-gray-200 text-gray-700 hover:border-emerald-300'
                  }`}
                >
                  <disability.icon className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-xs font-medium text-center">{disability.label}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Upload Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleUpload}
            disabled={!file || uploading || disabilityTypes.length === 0}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing with AI...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Upload & Generate Adaptations
              </>
            )}
          </motion.button>
        </motion.div>

        {/* AI Processing Status */}
        {processing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-emerald-100"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">AI Processing Complete!</h3>
                <p className="text-sm text-gray-600">Generated adaptive versions for all students</p>
              </div>
            </div>
            {summary && (
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                <p className="text-sm text-gray-700">{summary}</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
