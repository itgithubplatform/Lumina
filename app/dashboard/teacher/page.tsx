'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Upload, 
  FileText, 
  Video, 
  Youtube, 
  BarChart3,
  Users,
  BookOpen,
  Settings,
  Plus,
  Eye,
  Ear,
  Brain,
  Zap
} from 'lucide-react';
import { useAccessibility } from '@/lib/accessibility-context';
import { useVoiceAccessibility } from '@/lib/voice-accessibility';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function TeacherDashboard() {
  const router = useRouter();
  const { speak } = useAccessibility();
  const { announceAction, announceNavigation, readContent } = useVoiceAccessibility();
  const [stats, setStats] = useState({
    totalUploads: 24,
    studentsReached: 156,
    accessibilityProcessed: 18,
    weeklyViews: 89
  });

  useEffect(() => {
    readContent('Teacher Dashboard loaded. You can upload content, view analytics, and manage accessibility features for your students.');
  }, []);

  const uploadOptions = [
    {
      id: 'notes',
      title: 'Upload Notes & PDFs',
      description: 'Upload PDF files, DOCX documents, and text notes',
      icon: FileText,
      route: '/dashboard/teacher/upload/notes',
      gradient: 'from-blue-500 to-cyan-500',
      features: ['Auto TTS', 'Braille Ready', 'Simplified Text']
    },
    {
      id: 'videos',
      title: 'Upload Videos',
      description: 'Upload MP4 videos with automatic processing',
      icon: Video,
      route: '/dashboard/teacher/upload/videos',
      gradient: 'from-purple-500 to-pink-500',
      features: ['Auto Captions', 'Audio Description', 'Sign Language']
    },
    {
      id: 'youtube',
      title: 'YouTube Links',
      description: 'Add YouTube URLs for automatic accessibility processing',
      icon: Youtube,
      route: '/dashboard/teacher/upload/youtube',
      gradient: 'from-red-500 to-orange-500',
      features: ['Transcript Generation', 'Caption Sync', 'Audio Extract']
    },
    {
      id: 'analytics',
      title: 'View Analytics',
      description: 'Track student engagement and accessibility usage',
      icon: BarChart3,
      route: '/dashboard/teacher/analytics',
      gradient: 'from-green-500 to-emerald-500',
      features: ['Usage Stats', 'Accessibility Metrics', 'Student Progress']
    }
  ];

  const handleUploadSelect = (option: typeof uploadOptions[0]) => {
    announceAction(`Opening ${option.title}`);
    speak(`Navigating to ${option.title}`);
    router.push(option.route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
            <motion.h1 
              className="text-4xl md:text-5xl font-black mb-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              👨🏫 Teacher Dashboard
            </motion.h1>
            <p className="text-xl md:text-2xl text-white/90 font-medium mb-6">
              Create accessible content for every learner
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">{stats.totalUploads}</div>
                <div className="text-sm opacity-90">Content Uploaded</div>
              </div>
              <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">{stats.studentsReached}</div>
                <div className="text-sm opacity-90">Students Reached</div>
              </div>
              <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">{stats.accessibilityProcessed}</div>
                <div className="text-sm opacity-90">AI Processed</div>
              </div>
              <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">{stats.weeklyViews}</div>
                <div className="text-sm opacity-90">Weekly Views</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Upload Options Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {uploadOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-gray-200"
                onClick={() => handleUploadSelect(option)}
              >
                <div className="text-center">
                  <div className={`bg-gradient-to-r ${option.gradient} rounded-xl p-4 w-fit mx-auto mb-4 shadow-lg`}>
                    <option.icon size={32} className="text-white" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {option.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {option.description}
                  </p>

                  {/* AI Features */}
                  <div className="space-y-1">
                    {option.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                        <Zap size={12} className="text-yellow-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Accessibility Repository Overview */}
        <Card className="p-8 shadow-lg border-2 border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg p-3">
              <Users size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Accessibility Repository</h2>
              <p className="text-gray-600">Your content automatically processed for all learners</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                type: 'hearing',
                title: 'Hearing Impaired',
                icon: Ear,
                color: 'from-green-500 to-emerald-500',
                features: ['Auto Captions', 'Transcripts', 'Sign Language', 'Visual Alerts'],
                count: 8
              },
              {
                type: 'visual',
                title: 'Visual Impaired', 
                icon: Eye,
                color: 'from-blue-500 to-cyan-500',
                features: ['Text-to-Speech', 'Braille Ready', 'High Contrast', 'Audio Description'],
                count: 12
              },
              {
                type: 'cognitive',
                title: 'Cognitive Support',
                icon: Brain,
                color: 'from-purple-500 to-pink-500',
                features: ['Simplified Text', 'Summaries', 'Image Aids', 'Focus Mode'],
                count: 6
              }
            ].map((repo, index) => (
              <motion.div
                key={repo.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-gray-50 rounded-xl p-6 border border-gray-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`bg-gradient-to-r ${repo.color} rounded-lg p-2`}>
                    <repo.icon size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{repo.title}</h3>
                    <p className="text-sm text-gray-600">{repo.count} items processed</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {repo.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => {
                    announceAction(`Viewing ${repo.title} repository`);
                    router.push(`/repository/${repo.type}`);
                  }}
                >
                  View Repository
                </Button>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Button
            variant="primary"
            onClick={() => router.push('/dashboard/teacher/upload/notes')}
            className="flex items-center gap-2"
          >
            <Plus size={20} />
            Quick Upload
          </Button>
          
          <Button
            variant="secondary"
            onClick={() => router.push('/dashboard/teacher/analytics')}
            className="flex items-center gap-2"
          >
            <BarChart3 size={20} />
            View Analytics
          </Button>
          
          <Button
            variant="secondary"
            onClick={() => {
              speak('Opening accessibility settings for content processing');
              announceAction('Accessibility settings opened');
            }}
            className="flex items-center gap-2"
          >
            <Settings size={20} />
            AI Settings
          </Button>
        </div>
      </div>
    </div>
  );
}